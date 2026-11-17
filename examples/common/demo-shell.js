/* Public demo controls and shared chart accessibility. No telemetry. */
(function () {
  'use strict';
  let paused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const originalInterval = window.setInterval.bind(window);
  window.setInterval = function (fn, delay, ...args) {
    return originalInterval(function () { if (!paused && !document.hidden && typeof fn === 'function') fn(...args); }, delay);
  };
  const provinceNames = {北京:'Beijing',天津:'Tianjin',上海:'Shanghai',重庆:'Chongqing',河北:'Hebei',河南:'Henan',云南:'Yunnan',辽宁:'Liaoning',黑龙江:'Heilongjiang',湖南:'Hunan',安徽:'Anhui',山东:'Shandong',新疆:'Xinjiang',江苏:'Jiangsu',浙江:'Zhejiang',江西:'Jiangxi',湖北:'Hubei',广西:'Guangxi',甘肃:'Gansu',山西:'Shanxi',内蒙古:'Inner Mongolia',陕西:'Shaanxi',吉林:'Jilin',福建:'Fujian',贵州:'Guizhou',广东:'Guangdong',青海:'Qinghai',西藏:'Tibet',四川:'Sichuan',宁夏:'Ningxia',海南:'Hainan',台湾:'Taiwan',香港:'Hong Kong',澳门:'Macao',南海诸岛:'South China Sea islands'};
  if (window.echarts) {
    const init = echarts.init.bind(echarts);
    echarts.init = function (element, theme, options) {
      const chart = init(element, theme, options);
      element.setAttribute('role','img');
      element.setAttribute('aria-label', (element.closest('.chart-card,.chart-container,.ranking-card,.card')?.querySelector('.chart-title,.card-header')?.textContent || element.id.replace(/[-_]/g,' ')).trim() + '. Synthetic demonstration data.');
      const setOption = chart.setOption.bind(chart);
      chart.setOption = function (option, ...args) {
        option.aria = {enabled:true};
        if (paused) option.animation = false;
        const geos = Array.isArray(option.geo) ? option.geo : option.geo ? [option.geo] : [];
        geos.forEach(geo=>{if(geo.map==='china')geo.nameMap=provinceNames;});
        (Array.isArray(option.series)?option.series:option.series?[option.series]:[]).forEach(series=>{if(series.map==='china')series.nameMap=provinceNames;});
        if (option.title) (Array.isArray(option.title)?option.title:[option.title]).forEach(title=>{title.textStyle={...title.textStyle,fontSize:window.innerWidth<600?13:(title.textStyle?.fontSize||16),overflow:'break',width:element.clientWidth-40};});
        if(element.id==='chart-sales-trend') {option.grid={...option.grid,top:65,right:70,left:55,bottom:40,containLabel:true};option.legend={...option.legend,top:4};}
        if (window.innerWidth < 600) {
          const series = Array.isArray(option.series) ? option.series : option.series ? [option.series] : [];
          const pies = series.filter(s => s.type === 'pie');
          if (pies.length) {
            pies.forEach(s => { s.center = ['50%', '44%']; s.radius = ['32%', '56%']; s.label = {show:false}; s.labelLine = {show:false}; });
            option.legend = {...(option.legend || {}), type:'scroll', orient:'horizontal', left:'center', right:10, top:undefined, bottom:8, textStyle:{color:'#a9b5cc',fontSize:10},itemWidth:12,itemHeight:10};
          }
          series.filter(s => s.type === 'funnel').forEach(s => { s.left='8%';s.width='84%';s.label={...s.label,position:'inside',fontSize:10}; });
          const axes = Array.isArray(option.xAxis)?option.xAxis:option.xAxis?[option.xAxis]:[];
          axes.forEach(axis => {if(axis.type==='value'){axis.splitNumber=3;axis.axisLabel={...axis.axisLabel,fontSize:9};}});
          axes.filter(a=>a.type==='category').forEach(a=>{a.axisLabel={...a.axisLabel,hideOverlap:true,fontSize:9};});
          const grids=Array.isArray(option.grid)?option.grid:option.grid?[option.grid]:[];
          grids.forEach(g=>{g.containLabel=true;if(typeof g.left==='string' && parseFloat(g.left)<15)g.left=12;if(typeof g.right==='string' && parseFloat(g.right)<15)g.right=18;});
          if(element.id==='chart-power') {option.legend={...option.legend,top:40,left:20,right:10,textStyle:{color:'#a9b5cc',fontSize:9}};option.grid={...option.grid,top:90,left:15,right:16,containLabel:true};}
          if(element.id==='chart-gauge') series.forEach(s=>{s.title={...s.title,fontSize:10,color:'#a9b5cc',offsetCenter:[0,'80%']};s.detail={...s.detail,fontSize:14};});
          if(element.id==='limit-chart') series.forEach(s=>{s.title={...s.title,fontSize:11,color:'#a9b5cc'};});
          if(element.id==='chart-heatmap') {option.visualMap={...option.visualMap,orient:'horizontal',left:'center',bottom:0,top:undefined,itemWidth:8,itemHeight:120};option.grid={...option.grid,left:35,right:10,bottom:65};}
          const yAxes = Array.isArray(option.yAxis)?option.yAxis:option.yAxis?[option.yAxis]:[];
          yAxes.forEach(axis => {if(axis.name){axis.nameTextStyle={...axis.nameTextStyle,fontSize:9};axis.nameGap=12;}});
          if (element.id==='chart-sales-trend') {option.grid={...option.grid,top:58,right:48,left:45,bottom:35};option.legend={...option.legend,top:8};}
          if (element.id==='chart-topproducts') {option.grid={...option.grid,left:110,right:44};}
        }
        return setOption(option,...args);
      };
      if (window.ResizeObserver) new ResizeObserver(()=>chart.resize()).observe(element);
      return chart;
    };
  }
  document.addEventListener('DOMContentLoaded',function(){
    const demos=[['report-studio','Report studio'],['finance-trading','Markets'],['ecommerce-retail','Retail'],['iot-energy','Energy'],['city-geo','Cities']];
    const nav=document.createElement('nav'); nav.className='demo-nav';nav.setAttribute('aria-label','AnyViz examples');
    nav.innerHTML='<a class="demo-brand" href="https://anyviz.aiware.store">anyviz<span aria-hidden="true">↗</span></a><div class="demo-nav-links">'+demos.map(([slug,label])=>'<a href="../'+slug+'/" '+(document.body.dataset.demo===slug?'aria-current="page"':'')+'>'+label+'</a>').join('')+'<a href="https://github.com/TseringYuu/anyviz">GitHub ↗</a></div>';
    const note=document.createElement('aside'); note.className='demo-note';
    note.innerHTML='<p><strong>Interactive example · synthetic data.</strong> Explore chart tooltips and legends. No live feeds or business recommendations.</p><button class="demo-pause" type="button"></button>';
    const button=note.querySelector('button');function sync(){button.textContent=paused?'Resume simulation':'Pause simulation';button.setAttribute('aria-pressed',String(paused));}sync();button.addEventListener('click',()=>{paused=!paused;sync();});
    const main=document.querySelector('.content,.dashboard-container,.dashboard'); if(main){main.id='demo-main';main.setAttribute('role','main');}
    const skip=document.createElement('a');skip.href='#demo-main';skip.className='demo-skip';skip.textContent='Skip to charts';
    document.body.prepend(note);document.body.prepend(nav);document.body.prepend(skip);
    if (!window.echarts) {const error=document.createElement('p');error.className='demo-note';error.setAttribute('role','alert');error.textContent='Charts could not load from the CDN. Check your connection and reload. The page labels remain available.';note.after(error);}
    window.dispatchEvent(new Event('resize'));
  });
})();
