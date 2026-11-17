#!/usr/bin/env python3
"""Deterministic, dependency-free report built from clearly synthetic CSV data."""
import csv,json,pathlib,html
P=pathlib.Path(__file__).resolve().parent
ROOT=P.parent.parent
THEME=json.loads((ROOT/'aesthetics/themes/analytics.json').read_text())
BLUE=THEME['color']['highlight']['primary']; GREEN=THEME['color']['highlight']['positive']; RED=THEME['color']['highlight']['comparison']
INK='#19354A'; MUTED='#536574'; GRID='#DFE5EA'
def read(name):
    return list(csv.DictReader((P/'data'/name).open()))
m=read('monthly.csv'); ch=read('channels.csv'); reg=read('regions.csv')
num=lambda k:[float(r[k]) for r in m]
rev=num('revenue_usd'); orders=num('orders'); margin=num('gross_margin_pct')
total=sum(rev); h1=sum(rev[:6]); h2=sum(rev[6:]); avg=sum(v*x for v,x in zip(rev,margin))/total
assert sum(float(r['revenue_usd']) for r in ch)==total
assert sum(float(r['h1_revenue_usd']) for r in reg)==h1
assert sum(float(r['h2_revenue_usd']) for r in reg)==h2

def text(x,y,s,size=13,anchor='start',color=MUTED,weight='400'):
    return f'<text x="{x}" y="{y}" font-size="{size}" text-anchor="{anchor}" fill="{color}" font-weight="{weight}">{html.escape(str(s))}</text>'
def line(x1,y1,x2,y2,color=GRID,dash=''):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-dasharray="{dash}"/>'
def svg(name,title,body):
    out=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 660 240" role="img" aria-labelledby="title"><title id="title">{html.escape(title)}</title><rect width="660" height="240" fill="white"/><g font-family="Arial, Helvetica, sans-serif">{body}</g></svg>'
    (P/'charts'/f'{name}.svg').write_text(out)

def plot(name,title,values,lo,hi,ticks,suffix='',color=BLUE,fmt=lambda v:str(v),target=None):
    b=text(52,17,suffix,11)
    X=lambda i:52+i*51
    Y=lambda v:198-(v-lo)/(hi-lo)*162
    for t in ticks:b+=line(52,Y(t),613,Y(t))+text(41,Y(t)+4,fmt(t),11,'end')
    if target:
        b+=line(52,Y(target[0]),613,Y(target[0]),MUTED,'5 5')+text(58,Y(target[0])-7,target[1],10,'start')
    pts=' '.join(f'{X(i)},{Y(v)}' for i,v in enumerate(values))
    b+=f'<polyline points="{pts}" fill="none" stroke="{color}" stroke-width="3" stroke-linejoin="round"/>'
    for i,v in enumerate(values):
        b+=f'<circle cx="{X(i)}" cy="{Y(v)}" r="3.7" fill="white" stroke="{color}" stroke-width="2"/>'
        b+=text(X(i),220,m[i]['month'],10,'middle')
    for i in [0,11]: b+=text(X(i),Y(values[i])-11,fmt(values[i]),12,'middle',INK,'700')
    svg(name,title,b)
plot('revenue','Monthly revenue rises from $184k to $336k.',[x/1000 for x in rev],150,375,[150,200,250,300,350],'USD thousands',fmt=lambda x:f'{x:g}')
# Revenue / order is derived, not an independently invented metric.
aov=[v/o for v,o in zip(rev,orders)]
plot('order-value','Average order value by month.',aov,70,100,[70,80,90,100],'USD per order',color=GREEN,fmt=lambda x:f'{x:.0f}')
b=text(152,17,'USD thousands · zero baseline',11)
for i,r in enumerate(ch):
    y=46+i*46; v=float(r['revenue_usd']); w=v/1400000*408
    b+=text(140,y+16,r['channel'],12,'end',INK)
    b+=f'<rect x="152" y="{y}" width="{w}" height="24" rx="3" fill="{BLUE}"/>'
    b+=text(160+w,y+17,f'{v/1000:,.0f}  /  {v/total:.0%}',11,color=INK)
svg('channels','Direct contributes 42 percent of synthetic annual revenue.',b)
b=text(135,17,'USD thousands · zero baseline',11)+f'<rect x="371" y="6" width="10" height="10" fill="{BLUE}"/>'+text(386,16,'H1',11)+f'<rect x="432" y="6" width="10" height="10" fill="{GREEN}"/>'+text(447,16,'H2',11)
for i,r in enumerate(reg):
    y=38+i*47;b+=text(120,y+24,r['region'],12,'end',INK)
    for j,k in enumerate(['h1_revenue_usd','h2_revenue_usd']):
        v=float(r[k]);w=v/600000*430;c=[BLUE,GREEN][j]
        b+=f'<rect x="135" y="{y+j*18}" width="{w}" height="14" rx="2" fill="{c}"/>'+text(142+w,y+j*18+11,f'{v/1000:,.0f}',10,color=INK)
svg('regions','Revenue by region, first and second half of the synthetic year.',b)
plot('margin','Gross margin increases from 37.2 to 41.2 percent.',margin,35,43,[35,37,39,41,43],'Percent · axis begins at 35%',color=GREEN,fmt=lambda x:f'{x:g}',target=(40,'Illustrative 40% reference'))
plot('returns','Return rate falls from 5.8 to 3.7 percent.',num('return_rate_pct'),0,7,[0,2,4,6],'Percent · zero baseline',color=RED,fmt=lambda x:f'{x:g}')

def fig(n,title,name,note):
    return f'<figure><figcaption><span>FIGURE {n:02}</span><strong>{title}</strong></figcaption><img src="charts/{name}.svg" alt="{html.escape(note)}" width="660" height="240"><p class="figure-note">{note}</p></figure>'
def header(section):return f'<header><a href="https://github.com/TseringYuu/anyviz">anyviz<span> / {section.split(" / ")[-1].upper()}</span></a><span>{section}</span></header>'
def foot(page):return f'<footer><span>Source: synthetic demonstration data · Sheet {page} · Not business guidance</span><span>ANYVIZ / {page:02}</span></footer>'
css='''*{box-sizing:border-box}html{scrollbar-color:#a8b6c0 #edf1f4}body{margin:0;background:#e9eef2;color:#19354a;font:14px/1.55 Arial,Helvetica,sans-serif}a{color:inherit;text-underline-offset:4px}a:focus-visible,button:focus-visible{outline:3px solid #5b7fbd;outline-offset:5px}.toolbar{max-width:860px;margin:24px auto;display:flex;justify-content:space-between;gap:16px;align-items:center;padding:0 20px}.toolbar div{display:flex;flex-wrap:wrap;gap:16px}.toolbar a,button{font:600 12px Arial;cursor:pointer}button{border:1px solid #19354a;background:#19354a;color:white;border-radius:4px;padding:12px 16px}.page{width:794px;min-height:1090px;margin:0 auto 24px;padding:38px 50px 28px;background:white;box-shadow:0 5px 30px #1b354a12;display:flex;flex-direction:column}header{display:flex;justify-content:space-between;border-bottom:2px solid #19354a;padding-bottom:15px;font-size:10px;letter-spacing:1px;text-transform:uppercase}header a{font-size:17px;font-weight:800;text-decoration:none;text-transform:none;letter-spacing:-.5px}header a span{font-size:9px;letter-spacing:1.5px;font-weight:400}header>span{padding-top:7px;color:#536574}.eyebrow{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#536574;margin:27px 0 9px}h1{font-size:43px;line-height:1.08;letter-spacing:-1.7px;margin:0 0 14px;max-width:600px}h2{font-size:29px;line-height:1.15;letter-spacing:-1px;margin:0 0 12px}.intro{font-size:14px;color:#536574;max-width:620px;margin:0 0 20px}.metrics{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid #dfe5ea;border-bottom:1px solid #dfe5ea;margin:0 0 19px;padding:16px 0;gap:16px}.metrics b{display:block;font-size:26px;font-weight:500;letter-spacing:-1px}.metrics span{font-size:10px;color:#536574}.badge{display:inline-block;background:#eef3f9;color:#315d91;padding:3px 7px;font-size:9px;font-weight:700;letter-spacing:1px;margin-bottom:10px}figure{margin:0 0 19px;padding-top:12px;border-top:1px solid #dfe5ea}figcaption{display:flex;align-items:baseline;gap:15px;margin-bottom:6px}figcaption span{font-size:9px;letter-spacing:1px;color:#536574;white-space:nowrap}figcaption strong{font-size:13px;font-weight:600}figure img{width:100%;height:auto;display:block}.figure-note{font-size:10px;line-height:1.5;color:#536574;margin:3px 0 0}.insight{border-left:3px solid #5b7fbd;padding:8px 15px;margin:0 0 20px;font-size:12px;background:#f5f8fc}.method{display:grid;grid-template-columns:1fr 1fr;gap:24px;font-size:11px;color:#536574;margin-top:3px}.method h3{font-size:11px;color:#19354a;margin:0 0 4px}.method p{margin:0}footer{margin-top:auto;padding-top:15px;border-top:1px solid #dfe5ea;display:flex;justify-content:space-between;font-size:8px;color:#536574;gap:10px}@media(max-width:820px){.page{width:calc(100% - 24px);min-height:0;padding:28px 24px}h1{font-size:34px}.toolbar{align-items:flex-start}footer{margin-top:25px}.metrics b{font-size:23px}header>span{display:none}}@media(max-width:460px){.page{padding:24px 17px}.toolbar{flex-direction:column}h1{font-size:30px}.metrics{gap:8px}.metrics b{font-size:21px}.method{grid-template-columns:1fr}figcaption{gap:9px}figcaption strong{font-size:12px}}@media print{@page{size:A4;margin:0}header>span{display:block}body{background:white}.toolbar{display:none}.page{width:210mm;height:296mm;min-height:0;display:block;position:relative;box-shadow:none;margin:0;padding:10mm 13mm 9mm;break-after:page}.page>*{flex-shrink:0}.page:last-child{break-after:auto}h1{font-size:36px}.intro{font-size:12px;margin-bottom:14px}.eyebrow{margin-top:20px}.metrics{padding:12px 0;margin-bottom:12px}figure{margin-bottom:12px}figure img{height:55mm;width:100%;object-fit:contain}.figure-note{font-size:9px}footer{font-size:8px;position:absolute;bottom:9mm;left:13mm;right:13mm}a{text-decoration:none}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}}'''
body=f'''<nav class="toolbar" aria-label="Report actions"><a href="https://anyviz.aiware.store">← AnyViz</a><div><a href="data/monthly.csv" download>Download CSV</a><a href="README.md">Reproduce this report</a><a href="report.pdf">Download PDF</a><button onclick="window.print()">Print report</button></div></nav>
<main><article class="page">{header('Commerce / Annual review')}<p class="eyebrow">Demonstration edition · FY 2025</p><span class="badge">SYNTHETIC DATA</span><h1>Growth, with a clearer<br>view of the detail.</h1><p class="intro">A reproducible commerce report showing how AnyViz’s chart-selection and publication rules turn a small dataset into a consistent, document-ready visual narrative.</p><div class="metrics"><div><b>${total/1e6:.3f}m</b><span>Annual revenue</span></div><div><b>+{(h2/h1-1)*100:.1f}%</b><span>H2 revenue versus H1</span></div><div><b>{int(sum(orders)):,}</b><span>Annual orders</span></div></div>{fig(1,'Revenue builds steadily through the year','revenue','Monthly revenue, USD thousands. The axis starts at $150k to show variation; this is a trend, not a magnitude comparison.')}{fig(2,'Average order value rises alongside revenue','order-value','Revenue divided by orders in each month. A higher average does not establish a cause; no customer-level data is available.')}{foot(1)}</article>
<article class="page">{header('Commerce / Revenue composition')}<p class="eyebrow">Where growth appears</p><h2>One story. Multiple scales.</h2><p class="intro">Use a common visual language without forcing different questions into the same chart. Ranked bars compare channels; paired bars compare two periods within each region.</p><div class="insight"><strong>Reading the sample:</strong> Direct accounts for 42.0% of annual revenue. Every synthetic region records higher revenue in H2 than H1.</div>{fig(3,'Direct is the largest revenue channel','channels','Annual revenue by channel. End labels give USD thousands and rounded share. Bars start at zero; channels sum to annual revenue.')}{fig(4,'The second half is larger in every region','regions','Regional revenue in USD thousands. H1 is January–June; H2 is July–December. Paired rows preserve readable period comparisons.')}<div class="method"><div><h3>Why these charts?</h3><p>Aligned, zero-based bars support magnitude comparisons. Direct labels remove the need to estimate values from distant grid lines.</p></div><div><h3>What not to infer</h3><p>These aggregates do not explain acquisition, retention or regional profitability. More revenue is not evidence of better unit economics.</p></div></div>{foot(2)}</article>
<article class="page">{header('Commerce / Quality & methods')}<p class="eyebrow">Operational context</p><h2>Read performance with its limits.</h2><p class="intro">Margin and returns provide context for the revenue story. They are separate measures, with explicit units and no dual axis to imply a relationship.</p>{fig(5,'Gross margin moves above the reference line','margin','Gross margin, percent. The dashed 40% line is an illustrative reference, not a real business target. The vertical axis begins at 35%.')}{fig(6,'Return rate declines across the sample','returns','Monthly returned-order rate, percent. Zero-based axis. Aggregate rates are supplied in the synthetic data, not estimated from customer records.')}<div class="method"><div><h3>Data & calculations</h3><p>All values are fictional and committed in three CSV files. Revenue, order counts, channel totals and regional totals reconcile in build.py. Average order value = revenue ÷ orders.</p></div><div><h3>Reproduction & scope</h3><p>Run python3 build.py. SVG charts use AnyViz’s Analytics palette and publication guidance. This is a deterministic reference implementation, not a model benchmark or a promise of one-prompt output.</p></div></div>{foot(3)}</article></main>'''
(P/'index.html').write_text(f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="A reproducible, three-page document visualization report built with AnyViz rules and clearly synthetic data."><title>Report Studio — AnyViz</title><style>{css}</style></head><body>{body}</body></html>')
print(f'Built 6 SVG charts and report. Revenue ${total:,.0f}; orders {sum(orders):,.0f}; H2 growth {(h2/h1-1)*100:.1f}%.')
