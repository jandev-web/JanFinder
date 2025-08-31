# fill-docx-placeholders handler.py
import os, json, boto3, zipfile
from io import BytesIO

try:
    import lxml.etree as etree
except Exception as e:
    etree=None

s3 = boto3.client('s3')
W_NS='http://schemas.openxmlformats.org/wordprocessingml/2006/main'

def _replace_in_tree_across_runs(tree, replacements):
    if not etree: raise RuntimeError("lxml not available")
    ns={'w':W_NS}
    tnodes = tree.findall('.//w:t', namespaces=ns)
    if not tnodes: return 0
    delim='\u0001'
    def rebuild():
        big=[]; spans=[]; i=0
        for el in tree.findall('.//w:t', namespaces=ns):
            s=el.text or ''
            st=i; big.append(s); i+=len(s)
            spans.append((st,i,el))
            big.append(delim); i+=1
        return ''.join(big), spans
    big,spans=rebuild()
    total=0
    def pass_one(b, sp, ph, val):
        nonlocal total
        start=0
        while True:
            pos=b.find(ph, start)
            if pos==-1: break
            end=pos+len(ph)
            first_i = next(i for i,(s,e,_) in enumerate(sp) if e>pos)
            last_i  = next(i for i,(s,e,_) in enumerate(sp) if s<end<=e or (i==len(sp)-1 and end<=e))
            fs,_,fel = sp[first_i]
            ls,_,lel = sp[last_i]
            fl=max(0,pos-fs); ll=max(0,end-ls)
            ft=(fel.text or ''); lt=(lel.text or '')
            prefix=ft[:fl]; suffix=lt[ll:]
            fel.text=f"{prefix}{val}{suffix}"
            for j in range(first_i+1,last_i+1): sp[j][2].text=''
            b,sp=rebuild()
            total+=1
            start=pos+len(str(val))
        return b,sp
    for k,v in (replacements or {}).items():
        if k and k in big: big,spans=pass_one(big,spans,k,v)
    return total

def _replace_blocks_in_tree(tree, blocks):
    if not etree: raise RuntimeError("lxml not available")
    ns={'w':W_NS}
    delim='\u0001'
    def rebuild():
        big=[]; spans=[]; i=0
        for el in tree.findall('.//w:t', namespaces=ns):
            s=el.text or ''
            st=i; big.append(s); i+=len(s)
            spans.append((st,i,el))
            big.append(delim); i+=1
        return ''.join(big), spans
    def find_span(sp, pos):
        for i,(s,e,_) in enumerate(sp):
            if e>pos: return i
        return len(sp)-1
    big,spans=rebuild()
    for blk in blocks or []:
        st=blk['start']; en=blk['end']; repl=blk.get('text','')
        search=0
        while True:
            s_pos=big.find(st, search)
            if s_pos==-1: break
            e_pos=big.find(en, s_pos+len(st))
            if e_pos==-1: break
            e_pos+=len(en)
            fi=find_span(spans, s_pos); li=find_span(spans, e_pos-1)
            fs,_,fel=spans[fi]; ls,_,lel=spans[li]
            fl=max(0, s_pos-fs); ll=max(0, e_pos-ls)
            prefix=(fel.text or '')[:fl]; suffix=(lel.text or '')[ll:]
            fel.text=f"{prefix}{repl}{suffix}"
            fel.set("{http://www.w3.org/XML/1998/namespace}space","preserve")
            for j in range(fi+1, li+1): spans[j][2].text=''
            big,spans=rebuild(); search=s_pos+len(repl)

def _validate_docx_stream(stream):
    stream.seek(0)
    with zipfile.ZipFile(stream,'r') as z:
        bad=z.testzip()
        if bad: raise ValueError(f"DOCX ZIP is corrupt at {bad}")
        need=[n for n in z.namelist() if n.startswith('word/') and n.endswith('.xml')]
        if not etree: return
        for part in need:
            etree.fromstring(z.read(part))
    stream.seek(0)

def lambda_handler(event, context):
    rid = event.get('requestId') or getattr(context,'aws_request_id','no-context')
    template_bucket = event.get('template_bucket')
    template_key    = event.get('template_key')
    output_bucket   = event.get('output_bucket')
    docx_key        = event.get('docx_key')
    placeholders    = event.get('placeholders') or {}
    blocks          = event.get('blocks') or []

    if not (template_bucket and template_key and output_bucket and docx_key):
        return {"statusCode":400, "body": json.dumps({"message":"Missing template/output params"}), "requestId": rid}

    # Load template
    obj = s3.get_object(Bucket=template_bucket, Key=template_key)
    stream = BytesIO(obj['Body'].read())

    # Replace blocks + placeholders across all XML parts
    if not etree:
        return {"statusCode":500, "body": json.dumps({"message":"lxml not available in runtime"}), "requestId": rid}

    updated={}
    with zipfile.ZipFile(stream,'r') as z:
        names=z.namelist()
        parts=[n for n in names if n.startswith('word/') and n.endswith('.xml')]
        for file in parts:
            tree=etree.fromstring(z.read(file))
            if blocks: _replace_blocks_in_tree(tree, blocks)
            _replace_in_tree_across_runs(tree, placeholders)
            updated[file]=etree.tostring(tree, encoding='utf-8')
        out=BytesIO()
        with zipfile.ZipFile(out,'w',compression=zipfile.ZIP_DEFLATED) as newdoc:
            for n in names:
                newdoc.writestr(n, updated.get(n, z.read(n)))
        out.seek(0)

    _validate_docx_stream(out)

    # Write to S3
    s3.put_object(
        Bucket=output_bucket,
        Key=docx_key,
        Body=out.getvalue(),
        ContentType='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )

    return {"statusCode":200, "body": json.dumps({"docx_key": docx_key, "bucket": output_bucket}), "requestId": rid}
