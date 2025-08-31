#build-quote-doc-context handler.py
import os, json, boto3
from decimal import Decimal
from datetime import datetime, timezone

dynamodb = boto3.resource('dynamodb')

CUSTOMER_QUOTES_TABLE = os.environ.get('CUSTOMER_QUOTES_TABLE','CustomerQuotes')
OWNER_TABLE           = os.environ.get('OWNER_TABLE','Owner_DB')
FRANCHISE_TABLE       = os.environ.get('FRANCHISE_TABLE','Franchise_DB')
TEMPLATE_BUCKET       = os.environ.get('TEMPLATE_BUCKET','')
OUTPUT_BUCKET         = os.environ.get('OUTPUT_BUCKET','')

def _unwrap(v):
    if isinstance(v, dict) and len(v) == 1 and next(iter(v)) in ('S','N','BOOL','NULL','M','L','B'):
        if 'S' in v: return v['S']
        if 'N' in v:
            n = v['N']
            try:
                return float(n) if '.' in n else int(n)
            except: return n
        if 'BOOL' in v: return bool(v['BOOL'])
        if 'NULL' in v: return None
        if 'M' in v: return {k:_unwrap(v2) for k,v2 in v['M'].items()}
        if 'L' in v: return [_unwrap(x) for x in v['L']]
        if 'B' in v: return v['B']
    if isinstance(v, dict): return {k:_unwrap(v2) for k,v2 in v.items()}
    if isinstance(v, list): return [_unwrap(x) for x in v]
    if isinstance(v, Decimal): return float(v)
    return v

def _get(d, path, default=''):
    cur = d
    for p in path:
        if isinstance(cur, dict) and p in cur: cur = cur[p]
        else: return default
    return '' if cur is None else cur

def _fmt_num(x):
    if x in (None,''): return ''
    try:
        f = float(x)
        return str(int(f)) if f.is_integer() else f"{f:.2f}".rstrip('0').rstrip('.')
    except: return str(x)

def _fmt_money(x):
    if x in (None,''): return ''
    try: return f"${float(x):,.2f}"
    except: return str(x)

def _fmt_ts(v):
    if v in (None,''): return ''
    try:
        if isinstance(v,(int,float,Decimal)) or (isinstance(v,str) and v.strip().isdigit()):
            n=float(v); 
            if n>1e12: n/=1000.0
            dt=datetime.fromtimestamp(n,tz=timezone.utc).astimezone()
            return dt.strftime('%b %d, %Y %I:%M %p')
        if isinstance(v,str):
            s=v.replace('Z','+00:00')
            dt=datetime.fromisoformat(s)
            if dt.tzinfo: dt=dt.astimezone()
            return dt.strftime('%b %d, %Y %I:%M %p')
    except: pass
    return str(v)

def _build_rooms_block(choice):
    lines=[]
    rooms=(choice or {}).get('rooms') or []
    for r in rooms:
        nm=r.get('roomName','Room / Area')
        cnt=_fmt_num(r.get('roomNumber'))
        sz=_fmt_num(r.get('roomSize'))
        lines.append(f"• {nm} (x{cnt}, {sz} sqft)")
        tasks=r.get('roomTasks') or r.get('tasks') or []
        if tasks:
            lines.append("  Tasks:")
            for t in tasks:
                tn=t.get('taskName','')
                fq=t.get('frequency','') or t.get('taskFrequency','')
                tpm=_fmt_num(t.get('timePerMonth'))
                lines.append(f"    – {tn} — {fq} — {tpm} min/month")
        r_mon=_fmt_num(r.get('totalMonthTime'))
        lines.append(f"  Room Total: {r_mon} min/month")
        lines.append("")
    return "\n".join(lines).strip()

def _build_floor_block(section):
    if not section: return ""
    lines=[]
    for t in (section.get('tasks') or []):
        tn=t.get('taskName','')
        fq=t.get('frequency','') or t.get('taskFrequency','')
        tpm=_fmt_num(t.get('timePerMonth'))
        lines.append(f"– {tn} — {fq} — {tpm} min/month")
    return "\n".join(lines).strip()

def _compose_placeholders(quote, owner, franchise):
    qi = _get(quote,['quoteInfo'],{})
    meas = _get(quote,['customerMeasurements'],{})
    floor = _get(meas,['floorTypes'],{})
    stairs = _get(meas,['stairwells'],{})
    pkg=_get(quote,['Package'],{})
    choice=_get(pkg,['packageChoice'],{})

    cust=_get(quote,['customerData'],{})
    addr=_get(cust,['address'],{})

    placeholders = {
        "[FRANCHISE_NAME]": _get(franchise,['Name']) or _get(franchise,['franchiseName']),
        "[FRANCHISE_TAGLINE]": _get(franchise,['Tagline']),
        "[FRANCHISE_ADDRESS_STREET]": _get(franchise,['Address','street']),
        "[FRANCHISE_ADDRESS_CITY]": _get(franchise,['Address','city']),
        "[FRANCHISE_ADDRESS_STATE]": _get(franchise,['Address','state']),
        "[FRANCHISE_ADDRESS_ZIP]": _get(franchise,['Address','postalCode']),
        "[FRANCHISE_PHONE]": _get(franchise,['Phone']),
        "[FRANCHISE_EMAIL]": _get(franchise,['Email']),
        "[FRANCHISE_WEBSITE]": _get(franchise,['Website']),
        "[FRANCHISE_ID]": _get(quote,['Franchise']),
        "[QUOTE_TIMESTAMP]": _fmt_ts(_get(quote,['Timestamp'])),

        "[CONFIRMATION_NUMBER]": _get(quote,['ConfirmationNumber']),
        "[CONFIRMATION_TIMESTAMP]": _fmt_ts(_get(quote,['ConfirmationTimestamp'])),

        "[CUSTOMER_COMPANY]": _get(cust,['company']),
        "[CUSTOMER_FIRST_NAME]": _get(cust,['firstName']),
        "[CUSTOMER_LAST_NAME]": _get(cust,['lastName']),
        "[CUSTOMER_NAME]": f"{_get(cust,['firstName'])} {_get(cust,['lastName'])}".strip(),
        "[CUSTOMER_EMAIL]": _get(cust,['email']),
        "[CUSTOMER_PHONE]": _get(cust,['phone']),
        "[SITE_STREET]": _get(addr,['street']),
        "[SITE_CITY]": _get(addr,['city']),
        "[SITE_STATE]": _get(addr,['state']),
        "[SITE_ZIP]": _get(addr,['postalCode']),
        "[SITE_COUNTRY]": _get(addr,['country']),

        "[FACILITY_TYPE]": _get(qi,['facilityType']),
        "[TOTAL_SQFT]": _fmt_num(_get(meas,['sqft']) or _get(qi,['sqft'])),
        "[TOTAL_FLOORS]": _fmt_num(_get(meas,['floors'])),
        "[PCT_HARDFLOOR]": _fmt_num(_get(floor,['hardfloor'])),
        "[PCT_CARPET]": _fmt_num(_get(floor,['carpet'])),
        "[STAIRWELLS_HARDFLOOR]": _fmt_num(_get(stairs,['hardfloor'])),
        "[STAIRWELLS_CARPET]": _fmt_num(_get(stairs,['carpet'])),
        "[SERVICE_FREQUENCY]": _get(qi,['frequency']),

        "[OWNER_NAME]": f"{_get(owner,['firstName'])} {_get(owner,['lastName'])}".strip(),
        "[OWNER_TITLE]": _get(owner,['title']),
        "[OWNER_EMAIL]": _get(owner,['email']),
        "[OWNER_PHONE]": _get(owner,['phone']),

        "[SELECTED_PACKAGE_NAME]": _get(choice,['packageName']),
        "[SELECTED_PACKAGE_TYPE]": _get(choice,['packageType']),
        "[SELECTED_PACKAGE_COST]": _fmt_money(_get(choice,['packageCost'])),
        "[SELECTED_TOTAL_DAY_TIME]": _fmt_num(_get(choice,['totalDayTime'])),
        "[SELECTED_TOTAL_MONTH_TIME]": _fmt_num(_get(choice,['totalMonthTime'])),
        "[SELECTED_TOTAL_DAY_TIME_FROM_MONTH]": _fmt_num(_get(choice,['totalDayTimeFromMonth'])),
        "[OTHER_DAY_TIME]": _fmt_num(_get(choice,['otherDayTime'])),
        "[OTHER_MONTH_TIME]": _fmt_num(_get(choice,['otherMonthTime'])),
        "[OTHER_DAY_TIME_FROM_MONTH]": _fmt_num(_get(choice,['otherDayTimeFromMonth'])),
    }
    # Synonyms
    placeholders["[CLIENT_NAME]"] = placeholders["[CUSTOMER_NAME]"]
    placeholders["[EMAIL]"]       = placeholders["[CUSTOMER_EMAIL]"]
    placeholders["[PHONE]"]       = placeholders["[CUSTOMER_PHONE]"]
    return {k: '' if v is None else str(v) for k,v in placeholders.items()}

def lambda_handler(event, context):
    rid = event.get('requestId') or getattr(context, 'aws_request_id', 'no-context')
    quote_id = event.get('quoteID') or (event.get('body') or {}).get('quoteID')
    if not quote_id:
        return {"statusCode":400, "body": json.dumps({"message":"Missing quoteID"}), "requestId": rid}

    # Load quote + owner + franchise
    q = dynamodb.Table(CUSTOMER_QUOTES_TABLE).get_item(Key={'QuoteID': quote_id}).get('Item')
    if not q: return {"statusCode":404, "body": json.dumps({"message":"Quote not found"}), "requestId": rid}
    q = _unwrap(q)

    owner_id=_get(q,['OwnerID'])
    fr_id=_get(q,['Franchise'])
    owner = _unwrap(dynamodb.Table(OWNER_TABLE).get_item(Key={'OwnerID': owner_id}).get('Item')) if owner_id else {}
    franchise = _unwrap(dynamodb.Table(FRANCHISE_TABLE).get_item(Key={'FranchiseID': fr_id}).get('Item')) if fr_id else {}

    # Compose placeholders + blocks
    pkg = _get(q,['Package'],{})
    choice = _get(pkg,['packageChoice'],{}) or {}
    rooms_block = _build_rooms_block(choice)
    hard_block  = _build_floor_block(_get(choice,['hardfloor'],{}))
    carp_block  = _build_floor_block(_get(choice,['carpet'],{}))
    blocks = [
        {"start":"[ROOMS_START]","end":"[ROOMS_END]","text": rooms_block},
        {"start":"[HARDFLOOR_TASKS_START]","end":"[HARDFLOOR_TASKS_END]","text": hard_block},
        {"start":"[CARPET_TASKS_START]","end":"[CARPET_TASKS_END]","text": carp_block},
    ]

    placeholders = _compose_placeholders(q, owner, franchise)

    # S3 keys
    template_key = f"members/franchise/{fr_id}/templates/quote/quote-template.docx"
    docx_key = f"customer/{quote_id}/quotes/quote.docx"
    pdf_key  = f"customer/{quote_id}/quotes/quote.pdf"
    pdf_url  = f"https://{OUTPUT_BUCKET}.s3.amazonaws.com/{pdf_key}"

    body = {
        "quoteID": quote_id,
        "template_bucket": TEMPLATE_BUCKET,
        "template_key": template_key,
        "output_bucket": OUTPUT_BUCKET,
        "docx_key": docx_key,
        "pdf_key": pdf_key,
        "pdf_url": pdf_url,
        "placeholders": placeholders,
        "blocks": blocks,
        "requestId": rid
    }
    return {"statusCode":200, "body": json.dumps(body), "requestId": rid}
