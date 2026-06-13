(function (g) {
  if (typeof document === 'undefined') return;
  const GAME = g.GAME;
  const $ = (id) => document.getElementById(id);
  const SAVE_KEY = 'backrooms_save_v1';
  const SET_KEY = 'backrooms_settings_v1';
  let state = null;

  // ---------- 设置 ----------
  const DEF = { flicker:true, scan:true, grain:true, bigfont:false, hum:false };
  let settings = loadSettings();
  function loadSettings(){ try { return Object.assign({}, DEF, JSON.parse(localStorage.getItem(SET_KEY)||'{}')); } catch(e){ return Object.assign({}, DEF); } }
  function saveSettings(){ try { localStorage.setItem(SET_KEY, JSON.stringify(settings)); } catch(e){} }
  function applyBodyClasses(){
    const tier = (state && !state.ended) ? GAME.sanityTier(state.sanity) : 'calm';
    const c = ['tier-'+tier];
    if (!settings.flicker) c.push('noflicker');
    if (!settings.scan) c.push('noscan');
    if (!settings.grain) c.push('nograin');
    if (settings.bigfont) c.push('bigfont');
    document.body.className = c.join(' ');
  }

  // ---------- 荧光嗡鸣（WebAudio，离线合成） ----------
  let actx=null, hum=null;
  function ensureHum(){
    if (hum) return;
    try {
      actx = actx || new (window.AudioContext||window.webkitAudioContext)();
      const o=actx.createOscillator();  o.type='sine'; o.frequency.value=60;
      const o2=actx.createOscillator(); o2.type='sine'; o2.frequency.value=119;
      const lfo=actx.createOscillator(); lfo.type='sine'; lfo.frequency.value=0.18;
      const lg=actx.createGain(); lg.gain.value=7; lfo.connect(lg); lg.connect(o2.frequency);
      const g2=actx.createGain(); g2.gain.value=0;
      o.connect(g2); o2.connect(g2); g2.connect(actx.destination);
      o.start(); o2.start(); lfo.start();
      hum={ g:g2 }; updateHum();
    } catch(e){ hum=null; }
  }
  function killHum(){ if(!hum) return; try{ hum.g.gain.value=0; }catch(e){} hum=null; }
  function updateHum(){
    if(!hum||!actx) return;
    const tier=(state&&!state.ended)?GAME.sanityTier(state.sanity):'calm';
    const v={calm:0.012,unease:0.02,dread:0.034,broken:0.05}[tier]||0.012;
    try{ hum.g.gain.setTargetAtTime(v, actx.currentTime, 0.6); }catch(e){ hum.g.gain.value=v; }
  }
  function setHum(on){ settings.hum=on; saveSettings(); if(on){ ensureHum(); updateHum(); } else killHum(); }

  // ---------- 设置面板 ----------
  function buildPanel(){
    const p=$('panel'); p.innerHTML='';
    p.appendChild(el('h4',null,'终端设置'));
    [['flicker','屏幕闪烁'],['scan','扫描线'],['grain','噪点'],['bigfont','大字号'],['hum','荧光嗡鸣 (声音)']].forEach(([k,label])=>{
      const lab=document.createElement('label');
      const cb=document.createElement('input'); cb.type='checkbox'; cb.checked=!!settings[k];
      cb.onchange=()=>{ if(k==='hum'){ setHum(cb.checked); } else { settings[k]=cb.checked; saveSettings(); applyBodyClasses(); } };
      lab.appendChild(cb); lab.appendChild(document.createTextNode(label)); p.appendChild(lab);
    });
  }
  $('gear').onclick=()=>{ const p=$('panel'); p.hidden=!p.hidden; if(!p.hidden) buildPanel(); };

  // ---------- 渲染辅助 ----------
  function el(tag,cls,txt){ const e=document.createElement(tag); if(cls)e.className=cls; if(txt!=null)e.textContent=txt; return e; }
  function sep(){ return el('span','sep','·'); }
  function mkBtn(t,fn){ const b=document.createElement('button'); b.textContent=t; b.onclick=fn; return b; }
  function thirstLabel(t){ return t<30?'尚可':t<60?'口渴':t<90?'干渴':'濒临脱水'; }
  function sanityHint(s){ return {calm:'',unease:'耳边有嗡鸣',dread:'有人在喊你的名字',broken:'你分不清真假了'}[GAME.sanityTier(s)]; }
  function setTextPlain(str){ const t=$('text'); t.className=''; t.textContent=str; void t.offsetWidth; t.className='reveal'; }
  function setTextHtml(html){ const t=$('text'); t.className=''; t.innerHTML=html; void t.offsetWidth; t.className='reveal'; }
  function esc(s){ const d=document.createElement('div'); d.textContent=s==null?'':s; return d.innerHTML; }
  function addChoice(box,i,label,fn){
    const b=el('button','choice');
    b.appendChild(el('span','key', (i+1)<=9 ? String(i+1) : '·'));
    b.appendChild(el('span','lbl', label));
    b.style.animationDelay=(i*0.05)+'s'; b.onclick=fn; box.appendChild(b); return b;
  }

  // ---------- 主渲染 ----------
  function startMenu(){
    state=null; applyBodyClasses(); updateHum();
    $('status').innerHTML='';
    setTextHtml('<div class="title">后室 · 无尽回廊</div><div class="subtitle">THE ENDLESS HALLS</div><div class="lede">你在错误的地方滑出了现实。选择你坠入的方式：</div>');
    const box=$('choices'); box.innerHTML='';
    const starts=Object.values(GAME.starts);
    starts.forEach((st,i)=> addChoice(box,i, st.label+'　—　'+st.intro, ()=>{ state=GAME.newState(st.id,(Date.now()>>>0)); render(); }));
    if (localStorage.getItem(SAVE_KEY)) addChoice(box, starts.length, '继续：读取存档', load);
    $('bar').innerHTML=''; bindKeys();
  }

  function render(){
    if(!state){ startMenu(); return; }
    applyBodyClasses(); updateHum();
    if(state.ended){ renderEnding(); return; }
    const lvl=GAME.levels[state.level];
    const cups=Object.keys(state.inv).filter(k=>k.indexOf('almond_')===0).reduce((n,k)=>n+state.inv[k],0);
    $('status').innerHTML='';
    $('status').append(el('span','plate', lvl?lvl.name:state.level), sep(), el('span',null,'口渴：'+thirstLabel(state.thirst)), sep(), el('span',null,'杏仁水×'+cups));
    const h=sanityHint(state.sanity); if(h) $('status').append(el('span','hint', h));
    setTextPlain(GAME.nodeText(state));
    const box=$('choices'); box.innerHTML='';
    GAME.visibleChoices(state).forEach((c,i)=> addChoice(box,i,c.label, ()=>{ GAME.choose(state,i); autosave(); render(); }));
    renderBar(); bindKeys();
  }

  function renderEnding(){
    const e=GAME.endings[state.ended]||{title:state.ended,text:''};
    $('status').innerHTML='';
    setTextHtml('<div class="ending"><span class="tag">结局</span><div class="etitle">'+esc(e.title)+'</div><div class="etext">'+esc(e.text)+'</div></div>');
    const box=$('choices'); box.innerHTML=''; addChoice(box,0,'重新开始', ()=>{ state=null; render(); });
    $('bar').innerHTML=''; try{ localStorage.removeItem(SAVE_KEY); }catch(e){} bindKeys();
  }

  function renderBar(){
    const inv=Object.entries(state.inv).map(([k,n])=>(GAME.items[k]||{name:k}).name+'×'+n).join('  ')||'（空）';
    $('bar').innerHTML='';
    $('bar').append(mkBtn('存档',save_), mkBtn('导出',exportSave), mkBtn('导入',importSave));
    const span=el('span','inv'); span.innerHTML='背包：<b>'+esc(inv)+'</b>'; $('bar').appendChild(span);
  }

  // ---------- 键盘导航 ----------
  let keyHandler=null;
  function bindKeys(){
    if(keyHandler) document.removeEventListener('keydown', keyHandler);
    keyHandler=(e)=>{
      if(e.target && /input|textarea/i.test(e.target.tagName)) return;
      const btns=Array.prototype.slice.call($('choices').querySelectorAll('.choice'));
      if(e.key>='1'&&e.key<='9'){ const idx=+e.key-1; if(btns[idx]){ e.preventDefault(); btns[idx].click(); } }
      else if((e.key==='Enter'||e.key===' ')&&btns.length===1){ e.preventDefault(); btns[0].click(); }
    };
    document.addEventListener('keydown', keyHandler);
  }

  // ---------- 存档 ----------
  function autosave(){ if(state && !state.ended){ try{ localStorage.setItem(SAVE_KEY, GAME.serialize(state)); }catch(e){} } }
  function save_(){ try{ localStorage.setItem(SAVE_KEY, GAME.serialize(state)); flash('已存档'); }catch(e){ flash('存档失败'); } }
  function load(){ const s=localStorage.getItem(SAVE_KEY); if(s){ try{ state=GAME.deserialize(s); render(); }catch(e){ alert('存档损坏'); } } }
  function exportSave(){ window.prompt('复制此存档串：', GAME.serialize(state)); }
  function importSave(){ const s=window.prompt('粘贴存档串：'); if(s){ try{ state=GAME.deserialize(s.trim()); render(); }catch(e){ alert('存档无效'); } } }
  function flash(m){ const st=$('status'); const old=st.firstChild; const tag=el('span','hint',m); st.appendChild(tag); setTimeout(()=>{ if(state&&!state.ended) render(); }, 900); }

  // 首次任意点击：若开启嗡鸣则激活音频（绕过自动播放限制）
  function gestureInit(){ if(settings.hum) ensureHum(); document.removeEventListener('click', gestureInit); }
  document.addEventListener('click', gestureInit);

  g.addEventListener('DOMContentLoaded', ()=>{ applyBodyClasses(); render(); });
})(typeof window !== 'undefined' ? window : globalThis);
