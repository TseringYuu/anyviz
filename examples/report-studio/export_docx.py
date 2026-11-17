#!/usr/bin/env python3
"""Create editable report text with high-resolution chart images. Requires python-docx."""
from pathlib import Path
import csv
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
P=Path(__file__).resolve().parent
d=Document();s=d.sections[0];s.page_width=Inches(8.27);s.page_height=Inches(11.69)
s.top_margin=Inches(.55);s.bottom_margin=Inches(.55);s.left_margin=s.right_margin=Inches(.62)
s.header_distance=s.footer_distance=Inches(.25)
normal=d.styles['Normal'];normal.font.name='Arial';normal.font.size=Pt(10);normal.font.color.rgb=RGBColor.from_string('19354A');normal.paragraph_format.space_after=Pt(7);normal.paragraph_format.line_spacing=1.12
for name,size in [('Title',27),('Heading 1',23),('Heading 2',11)]:
    style=d.styles[name];style.font.name='Arial';style.font.size=Pt(size);style.font.color.rgb=RGBColor.from_string('000000' if name=='Title' else '19354A');style.paragraph_format.space_after=Pt(10)
    style.paragraph_format.keep_with_next=True
    for border in list(style.element.xpath('./w:pPr/w:pBdr')):
        border.getparent().remove(border)
header=s.header.paragraphs[0];header.text='ANYVIZ  /  REPORT STUDIO                                        SYNTHETIC DATA';header.style='Caption';header.runs[0].font.size=Pt(8)
footer=s.footer.paragraphs[0];footer.text='Synthetic demonstration data  •  Not business guidance                          ANYVIZ / ';footer.runs[0].font.size=Pt(8)
f=OxmlElement('w:fldSimple');f.set(qn('w:instr'),'PAGE');footer._p.append(f)
def para(text,style=None):return d.add_paragraph(text,style)
def heading(text,title=False):d.add_paragraph(text,'Title' if title else 'Heading 1')
def chart(n,title,name,note):
    p=para('FIGURE %02d   %s'%(n,title),'Heading 2');p.paragraph_format.space_before=Pt(9);p.paragraph_format.space_after=Pt(3)
    p=para('');p.paragraph_format.space_after=Pt(2);p.paragraph_format.keep_with_next=True
    run=p.add_run();shape=run.add_picture(str(P/'charts/png'/f'{name}.png'),width=Inches(6.75));shape._inline.docPr.set('descr',note)
    p=para(note);p.paragraph_format.space_after=Pt(8)
    for r in p.runs:r.font.size=Pt(8);r.font.color.rgb=RGBColor.from_string('536574')
rows=list(csv.DictReader((P/'data/monthly.csv').open()));revenue=sum(float(r['revenue_usd']) for r in rows);orders=sum(int(r['orders']) for r in rows);h1=sum(float(r['revenue_usd']) for r in rows[:6]);h2=revenue-h1
heading('Commerce performance report',True)
para('Demonstration edition • FY 2025')
para('This report uses fictional commerce data to demonstrate six consistent, document-ready charts. Revenue grows across the sample while average order value rises. The data illustrates presentation decisions, not business performance or causal evidence.')
p=para(f'${revenue/1e6:.3f}m revenue     |     {orders:,} orders     |     H2 revenue +{(h2/h1-1)*100:.1f}% versus H1');p.runs[0].bold=True
chart(1,'Revenue builds steadily through the year','revenue','Monthly revenue, USD thousands. The axis begins at $150k to emphasize variation; this is a trend, not a magnitude comparison.')
chart(2,'Average order value rises alongside revenue','order-value','Average order value = monthly revenue divided by orders, USD. A rising average does not establish a cause; no customer-level data is available.')
d.add_page_break();heading('Revenue composition')
para('Direct accounts for 42.0% of annual revenue. Every synthetic region records more revenue in H2 than H1. Ranked bars answer a channel comparison; paired bars compare two periods within each region.')
chart(3,'Direct is the largest revenue channel','channels','Annual channel revenue. End labels show USD thousands and rounded share. Bars begin at zero; all channels reconcile to annual revenue.')
chart(4,'The second half is larger in every region','regions','Regional revenue, USD thousands. H1 is January–June; H2 is July–December. Period colors and paired rows provide explicit comparisons.')
para('Interpretation limits','Heading 2');para('These aggregates do not explain acquisition, retention or regional profitability. Higher revenue is not evidence of better unit economics. Inspect the committed CSV files before reusing the sample.')
d.add_page_break();heading('Quality and methods')
para('Gross margin and return rate add operational context. They remain separate charts with explicit units, avoiding a dual axis that could suggest a relationship.')
chart(5,'Gross margin moves above the reference','margin','Gross margin, percent. The dashed 40% line is an illustrative reference, not a real target. The vertical axis begins at 35%.')
chart(6,'Return rate declines across the sample','returns','Monthly returned-order rate, percent, with a zero-based axis. Rates are supplied in synthetic data, not estimated from customer records.')
para('Reproduction and scope','Heading 2');para('The three CSV files and build.py are the source of truth. The generator checks channel and regional totals and calculates average order value. Charts follow AnyViz Analytics and publication guidance. This is an authored, deterministic reference, not a model benchmark or one-prompt output claim.')
d.core_properties.title='Commerce performance report';d.core_properties.author='AnyViz';d.core_properties.subject='Synthetic document visualization reference';d.core_properties.comments=''
d.save(P/'report.docx');print('Created report.docx')
