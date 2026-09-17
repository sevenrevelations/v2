(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.BlobbyCore=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const STORAGE_KEY='blobby.v6';
const VERSION=6;
const engines={
 google:{name:'Google',prefix:'https://www.google.com/search?q='},
 duck:{name:'DuckDuckGo',prefix:'https://duckduckgo.com/?q='},
 bing:{name:'Bing',prefix:'https://www.bing.com/search?q='}
};
const defaultLinks=[
 {label:'Google',url:'https://www.google.com/',icon:'G',folder:''},
 {label:'YouTube',url:'https://www.youtube.com/',icon:'▶',folder:''},
 {label:'Wikipedia',url:'https://www.wikipedia.org/',icon:'W',folder:'Study'},
 {label:'Khan Academy',url:'https://www.khanacademy.org/',icon:'K',folder:'Study'}
];
const layoutItemIds=['topbar','addressbar','hero','clock','shortcuts','recent','preview'];
const defaultLayoutGrid={
 hero:{col:1,row:1,w:8,h:2},
 topbar:{col:9,row:1,w:4,h:1},
 clock:{col:9,row:2,w:4,h:1},
 addressbar:{col:1,row:3,w:12,h:1},
 shortcuts:{col:1,row:4,w:7,h:3},
 recent:{col:8,row:4,w:5,h:3},
 preview:{col:1,row:7,w:12,h:2}
};
const layoutPresets={
 classic:{name:'Balanced',grid:defaultLayoutGrid,hidden:[]},
 minimal:{name:'Minimal',grid:{hero:{col:1,row:1,w:9,h:2},topbar:{col:10,row:1,w:3,h:1},clock:{col:10,row:2,w:3,h:1},addressbar:{col:1,row:3,w:12,h:1},shortcuts:{col:1,row:4,w:12,h:2},recent:{col:1,row:6,w:12,h:2},preview:{col:1,row:8,w:12,h:2}},hidden:['clock','recent','preview']},
 compact:{name:'Compact',grid:{topbar:{col:10,row:1,w:3,h:1},hero:{col:1,row:1,w:9,h:1},clock:{col:10,row:2,w:3,h:1},addressbar:{col:1,row:2,w:9,h:1},shortcuts:{col:1,row:3,w:12,h:2},recent:{col:1,row:5,w:12,h:2},preview:{col:1,row:7,w:12,h:2}},hidden:['clock','preview']},
 centered:{name:'Centered',grid:{hero:{col:3,row:1,w:8,h:2},topbar:{col:9,row:3,w:4,h:1},clock:{col:1,row:3,w:3,h:1},addressbar:{col:4,row:3,w:5,h:1},shortcuts:{col:2,row:4,w:10,h:3},recent:{col:2,row:7,w:10,h:2},preview:{col:1,row:9,w:12,h:2}},hidden:[]},
 gaming:{name:'Gaming',grid:{hero:{col:1,row:1,w:8,h:2},topbar:{col:9,row:1,w:4,h:1},clock:{col:9,row:2,w:4,h:1},addressbar:{col:1,row:3,w:12,h:1},shortcuts:{col:1,row:4,w:12,h:3},recent:{col:1,row:7,w:12,h:2},preview:{col:1,row:9,w:12,h:2}},hidden:['recent']},
 floating:{name:'Floating',grid:{topbar:{col:9,row:1,w:4,h:1},hero:{col:1,row:1,w:8,h:2},clock:{col:9,row:2,w:4,h:1},addressbar:{col:2,row:3,w:10,h:1},shortcuts:{col:1,row:5,w:7,h:3},recent:{col:9,row:5,w:4,h:3},preview:{col:2,row:9,w:10,h:2}},hidden:[]},
 mobile:{name:'Mobile',grid:{topbar:{col:9,row:1,w:4,h:1},hero:{col:1,row:1,w:8,h:2},clock:{col:9,row:2,w:4,h:1},addressbar:{col:1,row:3,w:12,h:1},shortcuts:{col:1,row:4,w:12,h:3},recent:{col:1,row:7,w:12,h:2},preview:{col:1,row:9,w:12,h:2}},hidden:['clock','preview']},
 desktop:{name:'Wide',grid:{hero:{col:1,row:1,w:7,h:2},topbar:{col:9,row:1,w:4,h:1},clock:{col:9,row:2,w:4,h:1},addressbar:{col:1,row:3,w:12,h:1},shortcuts:{col:1,row:4,w:8,h:3},recent:{col:9,row:4,w:4,h:3},preview:{col:1,row:7,w:12,h:2}},hidden:[]}
};
function clone(v){return JSON.parse(JSON.stringify(v));}
function safeUrl(raw){if(typeof raw!=='string')return null;try{const u=new URL(raw);if(!['https:','http:'].includes(u.protocol)||u.username||u.password)return null;return u.href;}catch{return null;}}
function resolve(text,engine='google',customPrefix=''){text=String(text||'').trim();if(!text)return null;
 if(/^(localhost|[\w-]+(?:\.[\w-]+)+):\d+(?:[/?#]|$)/i.test(text))return safeUrl((text.startsWith('localhost')?'http://':'https://')+text);
 if(/^[a-z][a-z0-9+.-]*:/i.test(text))return safeUrl(text);
 if(!/\s/.test(text)&&(/^[\w-]+(?:\.[\w-]+)+(?:[/:?#]|$)/.test(text)||/^localhost(?:[/:]|$)/.test(text)))return safeUrl((text.startsWith('localhost')?'http://':'https://')+text);
 if(engine==='custom'&&customPrefix){const custom=String(customPrefix).trim();if(/^https?:\/\//i.test(custom))return custom.includes('%s')?custom.replace('%s',encodeURIComponent(text)):custom+encodeURIComponent(text);}
 const prefix=(engines[engine]||engines.google).prefix;return prefix+encodeURIComponent(text);
}
function safeSearchPrefix(v){const s=String(v||'').trim();return /^https?:\/\//i.test(s)?s:engines.google.prefix;}
function hex(v,fallback='#8da2ff'){const s=String(v||'').trim();if(/^#[0-9a-f]{6}$/i.test(s))return s.toLowerCase();if(/^#[0-9a-f]{3}$/i.test(s))return '#'+s.slice(1).split('').map(x=>x+x).join('').toLowerCase();return fallback;}
function clamp(v,min,max){v=Number(v);return Number.isFinite(v)?Math.max(min,Math.min(max,v)):min;}
function uid(prefix='id'){return prefix+'_'+Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-4);}
function titleFromUrl(url){try{const u=new URL(url);return u.hostname.replace(/^www\./,'')||'Home';}catch{return 'Home';}}
function createTab(url=''){return {id:uid('view'),title:url?titleFromUrl(url):'Home',url:url||'',history:url?[url]:[],historyIndex:url?0:-1,favicon:''};}
function sanitizeGrid(raw){const out={};for(const id of layoutItemIds){const d=defaultLayoutGrid[id],v=raw&&raw[id]||d;const w=Math.round(clamp(v.w||d.w,1,12));const h=Math.round(clamp(v.h||d.h,1,5));const col=Math.round(clamp(v.col||d.col,1,13-w));const row=Math.round(clamp(v.row||d.row,1,12));out[id]={col,row,w,h};}return out;}
function defaults(){return {
 version:VERSION,
 prefs:{
  theme:'midnight',customThemeId:'',engine:'google',customSearchPrefix:'',rememberRecent:true,autofocus:true,
  performance:false,reducedMotion:false,animations:true,animationSpeed:1,hoverEffects:true,pageTransitions:true,tabAnimations:true,
  glass:true,blur:18,shadow:22,radius:18,panelOpacity:.68,
  rgb:false,rgbSpeed:8,rgbIntensity:70,rgbSaturation:100,rgbAreas:{logo:true,tabs:false,panels:false,address:true,buttons:false,ambient:true},
  backgroundMode:'gradient',backgroundSolid:'#090b13',backgroundGradient:'linear-gradient(135deg,#090b13 0%,#111827 55%,#171129 100%)',backgroundImage:'',backgroundBrightness:100,backgroundBlur:0,backgroundOpacity:100,backgroundOverlay:20,backgroundSize:'cover',backgroundPosition:'center',
  effectsMaster:true,effectDensity:45,effectSpeed:1,effectOpacity:.55,effectSize:1,
  effects:{snow:false,rain:false,stars:false,particles:false,fireflies:false,orbs:false,aurora:true,fog:false,matrix:false,bubbles:false,shooting:false,waves:false,rgbGlow:false,dust:false},
  rainLightning:false,rainGlass:false,
  layoutPreset:'classic',layoutGrid:clone(defaultLayoutGrid),layoutHidden:[],layoutLocked:true,
  showSubtitle:true,showClock:true,showShortcuts:true,showRecent:true,showPreview:true
 },
 links:clone(defaultLinks),recent:[],tabs:[createTab()],activeTab:null,customThemes:[],profiles:[],savedLayouts:[]
};}
function sanitizeEffects(raw){const keys=['snow','rain','stars','particles','fireflies','orbs','aurora','fog','matrix','bubbles','shooting','waves','rgbGlow','dust'];const out={};for(const k of keys)out[k]=!!(raw&&raw[k]);return out;}
function sanitizePrefs(raw={}){const d=defaults().prefs,p={...d,...raw};
 p.blur=clamp(p.blur,0,36);p.shadow=clamp(p.shadow,0,60);p.radius=clamp(p.radius,4,32);p.panelOpacity=clamp(p.panelOpacity,.35,1);
 p.rgbSpeed=clamp(p.rgbSpeed,2,30);p.rgbIntensity=clamp(p.rgbIntensity,0,100);p.rgbSaturation=clamp(p.rgbSaturation,20,140);p.animationSpeed=clamp(p.animationSpeed,.4,2);
 p.effectDensity=clamp(p.effectDensity,10,100);p.effectSpeed=clamp(p.effectSpeed,.3,2.5);p.effectOpacity=clamp(p.effectOpacity,.1,1);p.effectSize=clamp(p.effectSize,.5,2.5);
 p.backgroundBrightness=clamp(p.backgroundBrightness,30,150);p.backgroundBlur=clamp(p.backgroundBlur,0,24);p.backgroundOpacity=clamp(p.backgroundOpacity,20,100);p.backgroundOverlay=clamp(p.backgroundOverlay,0,80);
 p.effects=sanitizeEffects(raw.effects||d.effects);p.rgbAreas={...d.rgbAreas,...(raw.rgbAreas||{})};if(raw.rgbAreas&&raw.rgbAreas.panels===undefined&&raw.rgbAreas.tabs!==undefined)p.rgbAreas.panels=!!raw.rgbAreas.tabs;
 p.layoutGrid=sanitizeGrid(raw.layoutGrid||d.layoutGrid);
 p.layoutHidden=Array.isArray(raw.layoutHidden)?raw.layoutHidden.filter(x=>layoutItemIds.includes(x)):[];
 return p;
}
function sanitizeLinks(items){return (Array.isArray(items)?items:[]).filter(x=>x&&typeof x.label==='string'&&safeUrl(x.url)).slice(0,40).map(x=>({label:x.label.slice(0,32),url:safeUrl(x.url),icon:String(x.icon||x.label.slice(0,1)).slice(0,4),folder:String(x.folder||'').slice(0,24)}));}
function sanitizeRecent(items){return (Array.isArray(items)?items:[]).filter(x=>x&&safeUrl(x.url)).slice(0,30).map(x=>({label:String(x.label||titleFromUrl(x.url)).slice(0,80),url:safeUrl(x.url),time:Number(x.time)||Date.now()}));}
function sanitizeTabs(items){const tabs=(Array.isArray(items)?items:[]).slice(0,1).map(t=>{const history=(Array.isArray(t.history)?t.history:[]).map(safeUrl).filter(Boolean).slice(-50);const idx=Math.min(Math.max(Number(t.historyIndex)||0,-1),history.length-1);const url=safeUrl(t.url)||history[idx]||'';return {id:String(t.id||uid('view')),title:String(t.title||titleFromUrl(url)).slice(0,80),url,history,historyIndex:history.length?idx:-1,favicon:''};});return tabs.length?tabs:[createTab()];}
function oldOrderToGrid(){return clone(defaultLayoutGrid);}
function normalizeSavedLayouts(items){return (Array.isArray(items)?items:[]).slice(0,20).map(x=>({id:String(x.id||uid('layout')),name:String(x.name||'Saved layout').slice(0,48),grid:sanitizeGrid(x.grid||oldOrderToGrid(x.order)),hidden:Array.isArray(x.hidden)?x.hidden.filter(i=>layoutItemIds.includes(i)):[],preset:String(x.preset||'classic')}));}
function readVersion(read,key){try{return read(key,null);}catch{return null;}}
function migrate(read){const fresh=defaults();let saved=readVersion(read,STORAGE_KEY);
 if(!saved)saved=readVersion(read,'blobby.v5');
 if(saved&&typeof saved==='object'){
  const rawPrefs={...(saved.prefs||{})};if(!rawPrefs.layoutGrid)rawPrefs.layoutGrid=oldOrderToGrid(rawPrefs.layoutOrder);
  fresh.prefs=sanitizePrefs(rawPrefs);fresh.links=sanitizeLinks(saved.links||defaultLinks);fresh.recent=sanitizeRecent(saved.recent);fresh.tabs=sanitizeTabs(saved.tabs);fresh.activeTab=fresh.tabs[0].id;fresh.customThemes=Array.isArray(saved.customThemes)?saved.customThemes.slice(0,30):[];fresh.profiles=(Array.isArray(saved.profiles)?saved.profiles:[]).slice(0,20).map(pr=>{const rp={...(pr&&pr.prefs||{})};if(!rp.layoutGrid)rp.layoutGrid=oldOrderToGrid(rp.layoutOrder);return {id:String(pr&&pr.id||uid('profile')),name:String(pr&&pr.name||'Profile').slice(0,48),prefs:sanitizePrefs(rp)};});fresh.savedLayouts=normalizeSavedLayouts(saved.savedLayouts);return fresh;
 }
 const old=readVersion(read,'blobby.v3');
 if(old&&typeof old==='object'){
  const op=old.prefs||{},themeMap={arctic:'light',monochrome:'dark'};fresh.prefs=sanitizePrefs({...fresh.prefs,...op,theme:themeMap[op.baseTheme]||op.baseTheme||fresh.prefs.theme,performance:op.performance??op.fast??fresh.prefs.performance,effects:{...fresh.prefs.effects,snow:!!op.snow}});fresh.links=sanitizeLinks(old.links||defaultLinks);fresh.recent=sanitizeRecent(old.recent);fresh.activeTab=fresh.tabs[0].id;return fresh;
 }
 fresh.activeTab=fresh.tabs[0].id;return fresh;
}
function serialize(state){return JSON.stringify({...state,version:VERSION});}
function recordRecent(list,url,label){const safe=safeUrl(url);if(!safe)return sanitizeRecent(list);const next=[{url:safe,label:label||titleFromUrl(safe),time:Date.now()},...sanitizeRecent(list).filter(x=>x.url!==safe)];return next.slice(0,30);}
function navigateTab(tab,url,push=true){url=safeUrl(url);if(!url)return tab;if(push){const head=tab.history.slice(0,tab.historyIndex+1);head.push(url);tab.history=head.slice(-50);tab.historyIndex=tab.history.length-1;}tab.url=url;tab.title=titleFromUrl(url);return tab;}
function goHistory(tab,delta){const next=tab.historyIndex+delta;if(next<0||next>=tab.history.length)return null;tab.historyIndex=next;tab.url=tab.history[next];tab.title=titleFromUrl(tab.url);return tab.url;}
function canBack(tab){return tab.historyIndex>0;}function canForward(tab){return tab.historyIndex>=0&&tab.historyIndex<tab.history.length-1;}
return {STORAGE_KEY,VERSION,engines,defaultLinks,layoutItemIds,defaultLayoutGrid,layoutPresets,clone,safeUrl,resolve,safeSearchPrefix,hex,clamp,uid,titleFromUrl,createTab,defaults,sanitizeGrid,sanitizePrefs,sanitizeLinks,sanitizeRecent,sanitizeTabs,migrate,serialize,recordRecent,navigateTab,goHistory,canBack,canForward};
});
