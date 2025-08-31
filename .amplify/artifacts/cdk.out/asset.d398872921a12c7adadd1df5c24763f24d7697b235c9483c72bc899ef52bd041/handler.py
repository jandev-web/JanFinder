import os, boto3, json, base64, traceback
from io import BytesIO
import zipfile
from decimal import Decimal
from datetime import datetime, timezone

try:
    import lxml.etree as etree
    print("LXML import successful")
except Exception as e:
    print("LXML import failed:", e)
    etree = None  # We'll still do best-effort replacements without it.

dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')
lambda_client = boto3.client('lambda')

CUSTOMER_QUOTES_TABLE = os.environ.get('CUSTOMER_QUOTES_TABLE', 'CustomerQuotes')
OWNER_TABLE = os.environ.get('OWNER_TABLE', 'Owner_DB')
FRANCHISE_TABLE = os.environ.get('FRANCHISE_TABLE', 'Franchise_DB')
QUOTE_PDF_BUCKET_NAME = os.environ.get('QUOTE_PDF_BUCKET_NAME', '')
CONVERT_LAMBDA_NAME = os.environ.get('CONVERT_LAMBDA_NAME', 'convertDocxtoPDF')

# ---------------------------
# Logging helper
# ---------------------------
def _log(rid, msg, **kv):
    try:
        print(f"[get-quote-pdf][{rid}] {msg} :: {json.dumps(kv, default=str)}")
    except Exception:
        print(f"[get-quote-pdf][{rid}] {msg} :: {kv}")

# ---------------------------
# Safe DynamoDB unwrapping
# (handles both native and DynamoDB-typed JSON)
# ---------------------------
def _unwrap(v):
    if isinstance(v, dict) and len(v) == 1 and next(iter(v)) in ('S','N','BOOL','NULL','M','L','B'):
        # DynamoDB JSON
        if 'S' in v: return v['S']
        if 'N' in v:
            n = v['N']
            try:
                return float(n) if ('.' in n) else int(n)
            except Exception:
                return n
        if 'BOOL' in v: return bool(v['BOOL'])
        if 'NULL' in v: return None
        if 'M' in v: return {k: _unwrap(v2) for k,v2 in v['M'].items()}
        if 'L' in v: return [_unwrap(x) for x in v['L']]
        if 'B' in v: return v['B']
    if isinstance(v, dict):
        return {k: _unwrap(v2) for k,v2 in v.items()}
    if isinstance(v, list):
        return [_unwrap(x) for x in v]
    if isinstance(v, Decimal):
        return float(v)
    return v

def _get(dct, path, default=''):
    cur = dct
    for p in path:
        if isinstance(cur, dict) and p in cur:
            cur = cur[p]
        else:
            return default
    return '' if cur is None else cur

def _fmt_money(x):
    if x in (None, ''): return ''
    try:
        return f"${float(x):,.2f}"
    except Exception:
        return str(x)

def _fmt_num(x):
    if x in (None, ''): return ''
    try:
        x = float(x)
        if x.is_integer():
            return f"{int(x)}"
        return f"{x:.2f}".rstrip('0').rstrip('.')
    except Exception:
        return str(x)

def _fmt_ts(v):
    """Return a readable date/time like 'Aug 29, 2025 1:11 PM'."""
    if v in (None, ''):
        return ''
    try:
        # epoch seconds / ms?
        if isinstance(v, (int, float, Decimal)) or (isinstance(v, str) and v.strip().isdigit()):
            n = float(v)
            if n > 1e12:  # ms
                n /= 1000.0
            dt = datetime.fromtimestamp(n, tz=timezone.utc)
            return dt.astimezone().strftime('%b %d, %Y %I:%M %p')
        # ISO-ish strings (handle trailing Z)
        if isinstance(v, str):
            s = v.replace('Z', '+00:00')
            dt = datetime.fromisoformat(s)
            if dt.tzinfo:
                dt = dt.astimezone()
            return dt.strftime('%b %d, %Y %I:%M %p')
    except Exception:
        pass
    return str(v)

# ---------------------------
# Convert Lambda
# ---------------------------
def invoke_convert_lambda(quote_id, docx_key, pdf_key, rid):
    payload = {"quoteID": quote_id, "docx_key": docx_key, "pdf_key": pdf_key, "requestId": rid}
    _log(rid, "Invoking convert lambda", function=CONVERT_LAMBDA_NAME, payload=payload)
    resp = lambda_client.invoke(
        FunctionName=CONVERT_LAMBDA_NAME,
        InvocationType='RequestResponse',
        Payload=json.dumps(payload).encode('utf-8'),
    )
    status = resp.get('StatusCode')
    fn_error = resp.get('FunctionError')
    raw = resp['Payload'].read().decode('utf-8') if 'Payload' in resp else ''
    try:
        body = json.loads(raw)
    except Exception:
        body = {"raw": raw}
    _log(rid, "Convert lambda response", status=status, functionError=fn_error, body=body)
    if fn_error or (isinstance(body, dict) and body.get('statusCode', 200) >= 400):
        raise Exception(f"convertDocxtoPDF error: status={status}, fnError={fn_error}, body={body}")
    return body

# ---------------------------
# Text builders for lists (simple single-placeholder versions)
# ---------------------------
def build_room_breakdown_text(pkg_choice):
    lines = []
    rooms = (pkg_choice or {}).get('rooms') or []
    for r in rooms:
        name = r.get('roomName', 'Room')
        count = _fmt_num(r.get('roomNumber'))
        size  = _fmt_num(r.get('roomSize'))
        lines.append(f"{name} (x{count}, {size} sqft)")
        tasks = r.get('roomTasks') or []
        for t in tasks:
            tn = t.get('taskName','')
            fq = t.get('frequency','')
            tpd = _fmt_num(t.get('timePerDay'))
            tpm = _fmt_num(t.get('timePerMonth'))
            tpdfm = _fmt_num(t.get('timePerDayFromMonthly'))
            lines.append(f"  • {tn} — {fq} — {tpd} min/day — {tpm} min/mo (day-from-mo {tpdfm})")
        # Totals if present
        r_day   = _fmt_num(r.get('totalDayTime'))
        r_mon   = _fmt_num(r.get('totalMonthTime'))
        r_dfm   = _fmt_num(r.get('totalDayTimeFromMonth'))
        suffix = []
        if r_day: suffix.append(f"Daily {r_day} min")
        if r_mon: suffix.append(f"Monthly {r_mon} min")
        if r_dfm: suffix.append(f"FromMonthly/Day {r_dfm}")
        if suffix: lines.append("    └ " + " • ".join(suffix))
        lines.append("")  # blank line between rooms
    return "\n".join(lines).strip()

def build_floor_tasks_text(section):
    # section like pkg_choice['hardfloor'] or pkg_choice['carpet']
    if not section: return ""
    lines = []
    for t in (section.get('tasks') or []):
        tn = t.get('taskName','')
        fq = t.get('frequency','')
        tpd = _fmt_num(t.get('timePerDay'))
        tpm = _fmt_num(t.get('timePerMonth'))
        tpdfm = _fmt_num(t.get('timePerDayFromMonthly'))
        lines.append(f"• {tn} — {fq} — {tpd} min/day — {tpm} min/mo (day-from-mo {tpdfm})")
    return "\n".join(lines).strip()

# ---------------------------
# Text builders for block sections ([*_START] ... [*_END])
# ---------------------------
def build_rooms_block(choice):
    """Expands the [ROOMS_START]...[ROOMS_END] section."""
    lines = []
    for r in (choice or {}).get('rooms') or []:
        name  = r.get('roomName', 'Room / Area')
        count = _fmt_num(r.get('roomNumber'))
        size  = _fmt_num(r.get('roomSize'))
        lines.append(f"Room / Area: {name}")
        lines.append(f"Number of Rooms: {count} Avg/Size (sqft): {size}")

        tasks = r.get('roomTasks') or r.get('tasks') or []
        for t in tasks:
            tn   = t.get('taskName', '')
            fq   = t.get('frequency', '') or t.get('taskFrequency', '')
            tpd  = _fmt_num(t.get('timePerDay'))
            tpm  = _fmt_num(t.get('timePerMonth'))
            tpdf = _fmt_num(t.get('timePerDayFromMonthly'))
            lines.append(f"- {tn} — {fq} — {tpd} min/day — {tpm} min/month")
            lines.append(f"— (from monthly/day: {tpdf})")

        r_day = _fmt_num(r.get('totalDayTime'))
        r_mon = _fmt_num(r.get('totalMonthTime'))
        r_dfm = _fmt_num(r.get('totalDayTimeFromMonth'))
        lines.append(f"Room Totals — Daily: {r_day} min — Monthly: {r_mon} min — From Monthly/Day: {r_dfm}")
        lines.append("")  # blank line between rooms
    return "\n".join(lines).strip()

def build_floor_block(section):
    """Expands either [HARDFLOOR_TASKS_*] or [CARPET_TASKS_*] section (tasks only)."""
    if not section:
        return ""
    lines = []
    for t in (section.get('tasks') or []):
        tn   = t.get('taskName','')
        fq   = t.get('frequency','') or t.get('taskFrequency','')
        tpd  = _fmt_num(t.get('timePerDay'))
        tpm  = _fmt_num(t.get('timePerMonth'))
        tpdf = _fmt_num(t.get('timePerDayFromMonthly'))
        lines.append(f"- {tn} — {fq} — {tpd} min/day — {tpm} min/month")
        lines.append(f"— (from monthly/day: {tpdf})")
    return "\n".join(lines).strip()

def build_package_options_text(package_options):
    # Returns a compact multi-line string and a dict keyed by type
    by_type = {}
    lines = []
    for opt in (package_options or []):
        t = opt.get('packageType','')
        by_type[t] = opt
    order = [('top','TOP'), ('middle','MIDDLE'), ('bottom','BOTTOM')]
    for key,label in order:
        o = by_type.get(key)
        if not o: continue
        name = o.get('packageName','')
        cost = _fmt_money(o.get('packageCost'))
        day  = _fmt_num(o.get('totalDayTime'))
        mon  = _fmt_num(o.get('totalMonthTime'))
        lines.append(f"{label}: {name} — {cost} — Daily {day} min • Monthly {mon} min")
    return "\n".join(lines), by_type

# ---------------------------
# DOCX placeholder replacement (robust across Word run-splitting)
# ---------------------------
W_NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'

def _replace_in_tree_across_runs(tree, replacements, rid):
    """
    Replaces placeholders like [FIELD] even if Word split them across multiple <w:t> nodes.
    """
    ns = {'w': W_NS}
    texts = tree.findall('.//w:t', namespaces=ns)
    if not texts:
        return 0

    delim = '\u0001'  # unlikely to appear in DOCX text

    def _rebuild_map(tree_):
        tnodes = tree_.findall('.//w:t', namespaces=ns)
        bb, spp, ii = [], [], 0
        for el_ in tnodes:
            s_ = el_.text or ''
            st = ii
            bb.append(s_)
            ii += len(s_)
            spp.append((st, ii, el_))
            bb.append(delim)
            ii += 1
        return ''.join(bb), spp

    big, spans = _rebuild_map(tree)

    total_replacements = 0

    def do_one_pass(b, sp, placeholder, value):
        nonlocal total_replacements
        search_start = 0
        while True:
            pos = b.find(placeholder, search_start)
            if pos == -1:
                break
            end = pos + len(placeholder)

            # Find first and last node indices that overlap the match
            first_i = next(i for i,(s,e,_) in enumerate(sp) if e > pos)
            last_i  = next(i for i,(s,e,_) in enumerate(sp) if s < end <= e or (i==len(sp)-1 and end <= e))

            first_s, _, first_el = sp[first_i]
            last_s,  _,  last_el  = sp[last_i]

            # local indices inside first/last nodes
            first_local_start = max(0, pos - first_s)
            last_local_end    = max(0, end - last_s)

            first_text = (first_el.text or '')
            last_text  = (last_el.text or '')

            prefix = first_text[:first_local_start]
            suffix = last_text[last_local_end:]

            # Set first node text to prefix + replacement + suffix
            first_el.text = f"{prefix}{value}{suffix}"

            # Clear all overlapped middle/last nodes
            for j in range(first_i+1, last_i+1):
                sp[j][2].text = ''

            # Rebuild after replacement
            b, sp = _rebuild_map(tree)
            total_replacements += 1
            search_start = pos + len(str(value))
        return b, sp

    # Run replacements
    for ph, val in (replacements or {}).items():
        if not ph:
            continue
        if ph in big:
            big, spans = do_one_pass(big, spans, ph, val)

    return total_replacements

def _replace_blocks_in_tree(tree, blocks, rid):
    """
    blocks: list of dicts like:
      {"start": "[ROOMS_START]", "end": "[ROOMS_END]", "text": "...."}
    Replaces everything from start..end (inclusive) with the provided text,
    even if tokens are split across runs.
    """
    ns = {'w': W_NS}
    delim = '\u0001'

    def rebuild():
        tnodes = tree.findall('.//w:t', namespaces=ns)
        big, spans, idx = [], [], 0
        for el in tnodes:
            s = el.text or ''
            st = idx
            big.append(s); idx += len(s)
            spans.append((st, idx, el))
            big.append(delim); idx += 1
        return ''.join(big), spans

    big, spans = rebuild()

    def find_span(pos):
        for i,(s,e,_) in enumerate(spans):
            if e > pos:
                return i
        return len(spans)-1

    for b in blocks or []:
        start_tok = b['start']
        end_tok   = b['end']
        repl      = b.get('text','')

        search_from = 0
        while True:
            s_pos = big.find(start_tok, search_from)
            if s_pos == -1:
                break
            e_pos = big.find(end_tok, s_pos + len(start_tok))
            if e_pos == -1:
                break
            e_pos += len(end_tok)

            first_i = find_span(s_pos)
            last_i  = find_span(e_pos-1)

            fs, _, fel = spans[first_i]
            ls, _, lel = spans[last_i]

            first_local = max(0, s_pos - fs)
            last_local  = max(0, e_pos - ls)

            prefix = (fel.text or '')[:first_local]
            suffix = (lel.text or '')[last_local:]

            fel.text = f"{prefix}{repl}{suffix}"

            for j in range(first_i+1, last_i+1):
                spans[j][2].text = ''

            big, spans = rebuild()
            search_from = s_pos + len(repl)

    return

def validate_docx_stream(stream, rid):
    """Fail fast if the docx zip or critical XML parts are invalid."""
    stream.seek(0)
    with zipfile.ZipFile(stream, 'r') as z:
        bad = z.testzip()
        if bad:
            _log(rid, "DOCX zip corrupt", bad_entry=bad)
            raise ValueError(f"DOCX ZIP is corrupt at {bad}")

        # Parse core content parts to ensure well-formed XML
        parts = ['word/document.xml']
        parts += [n for n in z.namelist() if n.startswith('word/header') and n.endswith('.xml')]
        parts += [n for n in z.namelist() if n.startswith('word/footer') and n.endswith('.xml')]
        parts += [n for n in z.namelist() if n.endswith('/footnotes.xml') or n.endswith('/endnotes.xml')]

        for part in parts:
            try:
                etree.fromstring(z.read(part))
            except Exception as e:
                _log(rid, "DOCX XML invalid", part=part, error=str(e))
                raise
    stream.seek(0)

def replace_placeholders_in_docx(doc_stream, placeholders, rid, blocks=None):
    if etree is None:
        raise RuntimeError("lxml not available; cannot safely replace placeholders across runs")

    updated = {}
    with zipfile.ZipFile(doc_stream, 'r') as z:
        names = z.namelist()
        parts = []
        for n in names:
            if not (n.startswith('word/') and n.endswith('.xml')):
                continue
            if (
                n == 'word/document.xml' or
                n.startswith('word/header') or
                n.startswith('word/footer') or
                n.endswith('/footnotes.xml') or
                n.endswith('/endnotes.xml')
            ):
                parts.append(n)

        _log(rid, "XML parts to process", count=len(parts), parts=parts)

        for file in parts:
            xml_bytes = z.read(file)
            tree = etree.fromstring(xml_bytes)

            # 1) Replace blocks between START/END markers
            if blocks:
                _replace_blocks_in_tree(tree, blocks, rid)

            # 2) Replace normal placeholders (across runs)
            reps = _replace_in_tree_across_runs(tree, placeholders, rid)
            updated[file] = etree.tostring(tree, encoding='utf-8')
            _log(rid, "Part replaced", file=file, replacements=reps)

        out = BytesIO()
        with zipfile.ZipFile(out, 'w', compression=zipfile.ZIP_DEFLATED) as new_doc:
            for name in names:
                if name in updated:
                    new_doc.writestr(name, updated[name])
                else:
                    new_doc.writestr(name, z.read(name))
        out.seek(0)

    validate_docx_stream(out, rid)
    return out

# ---------------------------
# Data fetch
# ---------------------------
def fetch_dynamodb_item(table_name, key_name, key_value, rid):
    table = dynamodb.Table(table_name)
    _log(rid, "DDB get", table=table_name, keyName=key_name, keyValue=key_value)
    resp = table.get_item(Key={key_name: key_value})
    item = resp.get('Item')
    item = _unwrap(item) if item else None
    _log(rid, "DDB get result", found=bool(item))
    return item

# ---------------------------
# Template loader (try multiple locations)
# Matches Amplify FileUploader default ("public") and your previous paths.
# ---------------------------
def load_template_stream(franchise_id, rid):
    candidates = [
        f"members/franchise/{franchise_id}/templates/quote/quote-template.docx",
    ]
    last_err = None
    for key in candidates:
        try:
            _log(rid, "Trying template", bucket=QUOTE_PDF_BUCKET_NAME, key=key)
            obj = s3.get_object(Bucket=QUOTE_PDF_BUCKET_NAME, Key=key)
            stream = BytesIO(obj['Body'].read())
            _log(rid, "Template loaded", key=key, size=len(stream.getvalue()))
            return stream, key
        except Exception as e:
            last_err = e
    raise FileNotFoundError(f"Template not found in bucket {QUOTE_PDF_BUCKET_NAME}. Last error: {last_err}")

# ---------------------------
# Placeholder composer
# ---------------------------
def compose_placeholders(quote, owner_info, franchise_info, rid):
    # Base fields
    ts  = _get(quote, ['Timestamp'])
    conf_num  = _get(quote, ['ConfirmationNumber'])
    conf_ts   = _get(quote, ['ConfirmationTimestamp'])

    # Customer
    cust = _get(quote, ['customerData'], {})
    addr = _get(cust, ['address'], {})
    site_street = _get(addr, ['street'])
    site_city   = _get(addr, ['city'])
    site_state  = _get(addr, ['state'])
    site_zip    = _get(addr, ['postalCode'])
    site_country= _get(addr, ['country'])

    customer_company   = _get(cust, ['company'])
    customer_first     = _get(cust, ['firstName'])
    customer_last      = _get(cust, ['lastName'])
    customer_email     = _get(cust, ['email'])
    customer_phone     = _get(cust, ['phone'])

    # Quote info / measurements
    qi = _get(quote, ['quoteInfo'], {})
    facility_type = _get(qi, ['facilityType'])
    frequency     = _get(qi, ['frequency'])
    budget        = _get(qi, ['budget'])
    qi_sqft       = _get(qi, ['sqft'])

    meas = _get(quote, ['customerMeasurements'], {})
    total_sqft    = _get(meas, ['sqft']) or qi_sqft
    total_floors  = _get(meas, ['floors'])
    floor_types   = _get(meas, ['floorTypes'], {})
    pct_carpet    = _fmt_num(_get(floor_types, ['carpet']))
    pct_hard      = _fmt_num(_get(floor_types, ['hardfloor']))
    stairwells    = _get(meas, ['stairwells'], {})
    stairs_carpet = _fmt_num(_get(stairwells, ['carpet']))
    stairs_hard   = _fmt_num(_get(stairwells, ['hardfloor']))

    # Package (selected)
    pkg = _get(quote, ['Package'], {})
    choice = _get(pkg, ['packageChoice'], {})
    sel_name  = _get(choice, ['packageName'])
    sel_type  = _get(choice, ['packageType'])
    sel_cost  = _fmt_money(_get(choice, ['packageCost']))
    sel_day   = _fmt_num(_get(choice, ['totalDayTime']))
    sel_mon   = _fmt_num(_get(choice, ['totalMonthTime']))
    sel_dfm   = _fmt_num(_get(choice, ['totalDayTimeFromMonth']))
    other_day = _fmt_num(_get(choice, ['otherDayTime']))
    other_mon = _fmt_num(_get(choice, ['otherMonthTime']))
    other_dfm = _fmt_num(_get(choice, ['otherDayTimeFromMonth']))

    rooms_text = build_room_breakdown_text(choice)
    hard_text  = build_floor_tasks_text(_get(choice, ['hardfloor'], {}))
    hard_day   = _fmt_num(_get(_get(choice, ['hardfloor'], {}), ['totalDayTime']))
    hard_mon   = _fmt_num(_get(_get(choice, ['hardfloor'], {}), ['totalMonthTime']))
    hard_dfm   = _fmt_num(_get(_get(choice, ['hardfloor'], {}), ['totalDayTimeFromMonth']))

    carpet_text= build_floor_tasks_text(_get(choice, ['carpet'], {}))
    carp_day   = _fmt_num(_get(_get(choice, ['carpet'], {}), ['totalDayTime']))
    carp_mon   = _fmt_num(_get(_get(choice, ['carpet'], {}), ['totalMonthTime']))
    carp_dfm   = _fmt_num(_get(_get(choice, ['carpet'], {}), ['totalDayTimeFromMonth']))

    # Owner & Franchise
    owner_full = f"{_get(owner_info, ['firstName'])} {_get(owner_info, ['lastName'])}".strip()
    placeholders = {
        # franchise / header
        "[FRANCHISE_NAME]": _get(franchise_info, ['Name']),
        "[FRANCHISE_TAGLINE]": _get(franchise_info, ['Tagline']),
        "[FRANCHISE_ADDRESS_STREET]": _get(franchise_info, ['Address','street']),
        "[FRANCHISE_ADDRESS_CITY]": _get(franchise_info, ['Address','city']),
        "[FRANCHISE_ADDRESS_STATE]": _get(franchise_info, ['Address','state']),
        "[FRANCHISE_ADDRESS_ZIP]": _get(franchise_info, ['Address','postalCode']),
        "[FRANCHISE_PHONE]": _get(franchise_info, ['Phone']),
        "[FRANCHISE_EMAIL]": _get(franchise_info, ['Email']),
        "[FRANCHISE_WEBSITE]": _get(franchise_info, ['Website']),
        "[FRANCHISE_ID]": _get(quote, ['Franchise']),
        # quote meta
        "[QUOTE_TIMESTAMP]": _fmt_ts(ts),
        # confirmation / acceptance
        "[CONFIRMATION_NUMBER]": conf_num,
        "[CONFIRMATION_TIMESTAMP]": _fmt_ts(conf_ts),
        # client
        "[CUSTOMER_COMPANY]": customer_company,
        "[CUSTOMER_FIRST_NAME]": customer_first,
        "[CUSTOMER_LAST_NAME]": customer_last,
        "[CUSTOMER_NAME]": f"{customer_first} {customer_last}".strip(),
        "[CUSTOMER_EMAIL]": customer_email,
        "[CUSTOMER_PHONE]": customer_phone,
        "[SITE_STREET]": site_street,
        "[SITE_CITY]": site_city,
        "[SITE_STATE]": site_state,
        "[SITE_ZIP]": site_zip,
        "[SITE_COUNTRY]": site_country,
        # overview
        "[FACILITY_TYPE]": facility_type,
        "[TOTAL_SQFT]": _fmt_num(total_sqft),
        "[TOTAL_FLOORS]": _fmt_num(total_floors),
        "[PCT_HARDFLOOR]": pct_hard,
        "[PCT_CARPET]": pct_carpet,
        "[STAIRWELLS_HARDFLOOR]": stairs_hard,
        "[STAIRWELLS_CARPET]": stairs_carpet,
        "[SERVICE_FREQUENCY]": frequency,
        # owner/preparer
        "[OWNER_NAME]": owner_full,
        "[OWNER_TITLE]": _get(owner_info, ['title']),
        "[OWNER_EMAIL]": _get(owner_info, ['email']),
        "[OWNER_PHONE]": _get(owner_info, ['phone']),
        # selected package
        "[SELECTED_PACKAGE_NAME]": sel_name,
        "[SELECTED_PACKAGE_TYPE]": sel_type,
        "[SELECTED_PACKAGE_COST]": sel_cost,
        "[SELECTED_TOTAL_DAY_TIME]": sel_day,
        "[SELECTED_TOTAL_MONTH_TIME]": sel_mon,
        "[SELECTED_TOTAL_DAY_TIME_FROM_MONTH]": sel_dfm,
        "[OTHER_DAY_TIME]": other_day,
        "[OTHER_MONTH_TIME]": other_mon,
        "[OTHER_DAY_TIME_FROM_MONTH]": other_dfm,
        "[ROOMS_BREAKDOWN]": rooms_text,
        "[HARDFLOOR_TASKS]": hard_text,
        "[HARDFLOOR_TOTAL_DAY_TIME]": hard_day,
        "[HARDFLOOR_TOTAL_MONTH_TIME]": hard_mon,
        "[HARDFLOOR_TOTAL_DAY_TIME_FROM_MONTH]": hard_dfm,
        "[CARPET_TASKS]": carpet_text,
        "[CARPET_TOTAL_DAY_TIME]": carp_day,
        "[CARPET_TOTAL_MONTH_TIME]": carp_mon,
        "[CARPET_TOTAL_DAY_TIME_FROM_MONTH]": carp_dfm,
    }

    # Common synonyms so your docx can use either label
    synonyms = {
        "[CLIENT_NAME]": "[CUSTOMER_NAME]",
        "[EMAIL]": "[CUSTOMER_EMAIL]",
        "[PHONE]": "[CUSTOMER_PHONE]",
    }
    for k, v in synonyms.items():
        placeholders[k] = placeholders.get(v, "")

    # Convert all to strings to be safe for XML text nodes
    return {k: ("" if v is None else str(v)) for k, v in placeholders.items()}

# ---------------------------
# Lambda handler
# ---------------------------
def lambda_handler(event, context):
    rid = (event or {}).get("requestId") or getattr(context, "aws_request_id", "no-context")
    _log(rid, "START", env={
        "CUSTOMER_QUOTES_TABLE": CUSTOMER_QUOTES_TABLE,
        "OWNER_TABLE": OWNER_TABLE,
        "FRANCHISE_TABLE": FRANCHISE_TABLE,
        "QUOTE_PDF_BUCKET_NAME": QUOTE_PDF_BUCKET_NAME,
        "CONVERT_LAMBDA_NAME": CONVERT_LAMBDA_NAME,
    }, event=event)

    try:
        body = event.get('body', {}) if isinstance(event, dict) else {}
        if isinstance(body, str):
            try:
                body = json.loads(body)
            except Exception:
                body = {}
        quote_id = body.get('quoteID') or event.get('quoteID')
        if not quote_id:
            _log(rid, "Missing quoteID")
            return {'statusCode': 400, 'body': json.dumps({'message': 'Missing quoteID'}), 'requestId': rid}

        # Output locations
        docx_key = f"customer/{quote_id}/quotes/quote.docx"
        pdf_key  = f"customer/{quote_id}/quotes/quote.pdf"
        pdf_url  = f"https://{QUOTE_PDF_BUCKET_NAME}.s3.amazonaws.com/{pdf_key}"
        _log(rid, "S3 keys", docx_key=docx_key, pdf_key=pdf_key, pdf_url=pdf_url)

        # Fetch quote + related records
        quote = fetch_dynamodb_item(CUSTOMER_QUOTES_TABLE, 'QuoteID', quote_id, rid)
        if not quote:
            _log(rid, "Quote not found")
            return {'statusCode': 404, 'body': json.dumps({'message': 'Quote not found'}), 'requestId': rid}

        owner_id     = _get(quote, ['OwnerID'])
        franchise_id = _get(quote, ['Franchise'])
        _log(rid, "Quote ownership", ownerID=owner_id, franchiseID=franchise_id)

        owner_info     = fetch_dynamodb_item(OWNER_TABLE, 'OwnerID', owner_id, rid) if owner_id else None
        franchise_info = fetch_dynamodb_item(FRANCHISE_TABLE, 'FranchiseID', franchise_id, rid) if franchise_id else None
        if not owner_info or not franchise_info:
            _log(rid, "Owner/Franchise missing", ownerFound=bool(owner_info), franchiseFound=bool(franchise_info))
            return {'statusCode': 404, 'body': json.dumps({'message': 'Owner or Franchise not found'}), 'requestId': rid}

        # Load DOCX template
        doc_template, template_key = load_template_stream(franchise_id, rid)

        # Build placeholders (BRACKETS ONLY, e.g., [FIELD])
        placeholders = compose_placeholders(quote, owner_info, franchise_info, rid)
        _log(rid, "Placeholders prepared", count=len(placeholders))

        # Build block contents and replace block sections ([*_START] ... [*_END])
        pkg = _get(quote, ['Package'], {})
        choice = _get(pkg, ['packageChoice'], {})
        rooms_block      = build_rooms_block(choice)
        hardfloor_block  = build_floor_block(_get(choice, ['hardfloor'], {}))
        carpet_block     = build_floor_block(_get(choice, ['carpet'], {}))
        blocks = [
            {"start": "[ROOMS_START]", "end": "[ROOMS_END]", "text": rooms_block},
            {"start": "[HARDFLOOR_TASKS_START]", "end": "[HARDFLOOR_TASKS_END]", "text": hardfloor_block},
            {"start": "[CARPET_TASKS_START]", "end": "[CARPET_TASKS_END]", "text": carpet_block},
        ]

        # Replace placeholders across all XML parts
        updated_doc_stream = replace_placeholders_in_docx(doc_template, placeholders, rid, blocks=blocks)
        validate_docx_stream(updated_doc_stream, rid)

        # Upload filled DOCX
        _log(rid, "Uploading updated DOCX", bucket=QUOTE_PDF_BUCKET_NAME, key=docx_key)
        s3.put_object(
            Bucket=QUOTE_PDF_BUCKET_NAME,
            Key=docx_key,
            Body=updated_doc_stream.getvalue(),
            ContentType='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )

        # Convert to PDF
        invoke_convert_lambda(quote_id, docx_key, pdf_key, rid)

        # Persist PDF URL on quote
        _log(rid, "Updating DDB with PDF URL", table=CUSTOMER_QUOTES_TABLE, quoteID=quote_id, url=pdf_url)
        customer_quotes_table = dynamodb.Table(CUSTOMER_QUOTES_TABLE)
        customer_quotes_table.update_item(
            Key={'QuoteID': quote_id},
            UpdateExpression="SET QuotePDF = :url",
            ExpressionAttributeValues={':url': pdf_url}
        )
        email_fn = os.environ.get('SEND_QUOTE_EMAIL_FUNCTION_NAME')
        if email_fn:
            try:
                payload = {"body": {"quoteID": quote_id}, "requestId": rid}
                lambda_client.invoke(
                    FunctionName=email_fn,
                    InvocationType='Event',
                    Payload=json.dumps(payload).encode('utf-8'),
                )
                _log(rid, "Invoked email lambda", function=email_fn)
            except Exception as e:
                _log(rid, "Email lambda invoke failed", error=str(e))

        _log(rid, "DONE")
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Contract created successfully', 'contractURL': pdf_url}),
            'requestId': rid
        }

    except Exception as e:
        _log(rid, "FATAL", error=str(e), traceback=traceback.format_exc())
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Error processing request', 'error': str(e)}),
            'requestId': rid
        }
