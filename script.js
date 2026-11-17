/* ===== ВСТАВЬТЕ СВОИ ВИДЕО И ГИФКИ ЗДЕСЬ =====
   Путь к файлу рядом с index.html ("clips/start.mp4", "gifs/sad.gif")
   или ссылка на YouTube ("https://youtu.be/XXXXXXXXXXX").
   Можно и без кода: нажми на рамку и выбери файл или перетащи его. */
const MEDIA={start:"clips/start.mp4",peck:"clips/peck.mp4",sad:"clips/sad.mp4",happy:"clips/happy.mp4"};

/* ===== РЕДАКТОР ТЕКСТА =====
   true  - кнопка «Править текст» видна всем на странице
   false - кнопки нет; редактор открывается по адресу index.html?edit (поставь false перед публикацией) */
const SHOW_EDIT_BUTTON=true;

const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],mood=()=>document.body.dataset.mood,M=matchMedia('(max-width:700px)').matches;
$$('[data-pk]').forEach(s=>s.append($('#pk').content.cloneNode(true)));
$$('[data-st]').forEach(s=>s.append($('#st').content.cloneNode(true)));
for(let i=0;i<(M?3:6);i++){const c=document.createElement('div');c.className='cl';c.style.cssText=`top:${6+Math.random()*62}%;--s:${.5+Math.random()*.8};animation-duration:${60+Math.random()*50}s;animation-delay:-${Math.random()*90}s`;$('#hero').append(c)}
for(let i=0;i<(M?30:70);i++){const d=document.createElement('i');d.style.cssText=`left:${Math.random()*100}%;animation-duration:${.8+Math.random()*.6}s;animation-delay:-${Math.random()*2}s`;$('.rain').append(d)}

/* видео и гифки */
const yt=u=>(u.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)||[])[1];
function put(b,u,type){const id=yt(u);b.innerHTML=id?`<iframe src="https://www.youtube.com/embed/${id}" allowfullscreen loading="lazy"></iframe>`:(type?type.startsWith('video'):/\.(mp4|webm|mov|ogv)(\?|$)/i.test(u))?`<video src="${u}" autoplay muted loop playsinline preload="auto" disablepictureinpicture disableremoteplayback></video>`:`<img src="${u}" alt="">`;const v=b.querySelector('video');if(v){v.muted=true;v.play().catch(()=>{})}}
$$('.slot').forEach(b=>{b.innerHTML=`<label class="ph"><span>${b.dataset.i}</span>${b.dataset.h}<small>нажми и выбери файл или перетащи его сюда</small><input type="file" accept="video/*,image/*" hidden></label>`;const u=MEDIA[b.dataset.k];if(u)put(b,u);
 b.addEventListener('change',e=>{const f=e.target.files[0];f&&put(b,URL.createObjectURL(f),f.type)});
 b.ondragover=e=>e.preventDefault();
 b.ondrop=e=>{e.preventDefault();const f=e.dataTransfer.files[0];f&&put(b,URL.createObjectURL(f),f.type)}});


/* настроение, меню-бусины, появление */
let gift=false,sec=$('#hero');
const upd=()=>document.body.dataset.mood=(gift&&sec.id=='end')?'warm':sec.dataset.m;
const mo=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){sec=e.target;upd();$$('#nav a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')=='#'+sec.id))}}),{rootMargin:'-50% 0px -49% 0px'});
$$('section').forEach(s=>mo.observe(s));
const ro=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&(e.target.classList.add('in'),ro.unobserve(e.target))),{threshold:.2});
setTimeout(()=>$$('.rv').forEach(e=>ro.observe(e)),1500);

function pop(x,y,ch,n=10){for(let i=0;i<n;i++){const s=document.createElement('span');s.textContent=ch[i%ch.length];s.className='pp';s.style.cssText=`left:${x+(Math.random()-.5)*120}px;top:${y}px;--dx:${(Math.random()-.5)*160}px;animation-delay:${i*.07}s`;document.body.append(s);setTimeout(()=>s.remove(),2800)}}
const ctr=el=>{const r=el.getBoundingClientRect();return[r.left+r.width/2,r.top]};

/* текст: сохранённые правки (texts.js + localStorage) */
const SEL='.tag,h2,h3,.g p,.note,.hand:not(#msg),footer,.strip',KEY='cloud-texts-v1';
let store={};try{store=Object.assign({},window.TEXTS||{},JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){store=Object.assign({},window.TEXTS||{})}
const eds=$$(SEL);
eds.forEach((el,i)=>{el.dataset.e=i;const v=store['t'+i];if(v!=null){if(el.matches('.strip'))el.textContent=v;else el.innerHTML=v}});
$$('.pol').forEach(f=>{const v=store['c:'+f.querySelector('.slot').dataset.k];if(v!=null)f.dataset.cap=v});

/* заголовок: буквы на бумажных полосках пляшут волной */
const h1=$('h1'),esc=c=>c.replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));
const spell=()=>{$$('.strip').forEach((s,k)=>s.innerHTML=[...s.textContent].map((c,i)=>`<span class="L" aria-hidden="true" style="--i:${k*10+i}">${esc(c)}</span>`).join(''));h1.setAttribute('aria-label',h1.textContent)};
spell();

/* редактор текста: нажми на любой текст и пиши */
let ed=false,tm;
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(store))}catch(e){}};
const rec=el=>{store['t'+el.dataset.e]=el.matches('.strip')?el.textContent:el.innerHTML;clearTimeout(tm);tm=setTimeout(save,300)};
const host=e=>e.target.closest&&e.target.closest('[data-e]');
function setEd(on){ed=on;document.body.classList.toggle('editing',on);$('#ed').classList.toggle('on',on);
 eds.forEach(el=>{if(on){if(el.matches('.strip'))el.textContent=el.textContent;el.contentEditable='true';el.spellcheck=true}else el.removeAttribute('contenteditable')});
 if(!on)spell()}
document.addEventListener('input',e=>{const el=host(e);if(ed&&el)rec(el)});
document.addEventListener('paste',e=>{if(ed&&host(e)){e.preventDefault();document.execCommand('insertText',false,(e.clipboardData||window.clipboardData).getData('text/plain'))}});
document.addEventListener('keydown',e=>{const el=host(e);if(ed&&el&&e.key==='Enter'){e.preventDefault();if(el.matches('.note,.hand,.g p'))document.execCommand('insertLineBreak')}});
$$('.pol').forEach(f=>f.addEventListener('click',e=>{if(!ed||e.target!==f||e.clientY<f.getBoundingClientRect().bottom-56)return;
 const k=f.querySelector('.slot').dataset.k,v=prompt('Подпись под рамкой:',f.dataset.cap);if(v===null)return;f.dataset.cap=v;store['c:'+k]=v;save()}));
if(SHOW_EDIT_BUTTON||/[?&]edit|#edit/.test(location.search+location.hash)){
 const bar=document.createElement('div');bar.id='ed';
 bar.innerHTML='<span class="hint">Нажми на любой текст и пиши. Подпись под рамкой с видео тоже можно поменять: нажми на неё. Правки хранятся в этом браузере; чтобы они остались на сайте, скачай texts.js и положи рядом с index.html.</span><button class="main" data-a="done">✅ Готово</button><button data-a="dl">⬇ Скачать texts.js</button><button data-a="rs">↺ Сбросить правки</button><button class="main" data-a="on">✏️ Править текст</button>';
 bar.onclick=e=>{const a=e.target.dataset&&e.target.dataset.a;if(!a)return;
  if(a=='on')setEd(true);
  if(a=='done'){setEd(false);save()}
  if(a=='dl'){const l=document.createElement('a');l.href=URL.createObjectURL(new Blob(['window.TEXTS='+JSON.stringify(store,null,1)+';\n'],{type:'text/javascript'}));l.download='texts.js';l.click();setTimeout(()=>URL.revokeObjectURL(l.href),1000)}
  if(a=='rs'&&confirm('Сбросить все правки и вернуть тексты из texts.js?')){try{localStorage.removeItem(KEY)}catch(x){}location.reload()}};
 document.body.append(bar)}

/* доска стикеров: ткни в облако, вырежется малыш, его можно таскать */
const hero=$('#hero'),kids=['🐱','🐶','🐰','🐥','🐑','🐼','🦊'];let n=0,z=3;
function sticker(x,y){const s=document.createElement('div');s.className='stk';s.textContent=kids[n++%kids.length];s.style.cssText=`left:${x}px;top:${y}px;--r:${(Math.random()-.5)*30}deg`;hero.append(s);
 if($$('.stk').length>16)$('.stk').remove();let ox,oy;
 s.onpointerdown=e=>{s.setPointerCapture(e.pointerId);ox=e.clientX-s.offsetLeft;oy=e.clientY-s.offsetTop;s.style.zIndex=++z;s.classList.add('up')};
 s.onpointermove=e=>{if(s.hasPointerCapture(e.pointerId)){s.style.left=e.clientX-ox+'px';s.style.top=e.clientY-oy+'px'}};
 s.onpointerup=()=>s.classList.remove('up')}
$('#cloud').onclick=e=>{const c=e.currentTarget;c.classList.remove('sq');void c.offsetWidth;c.classList.add('sq');
 const r=c.getBoundingClientRect(),h=hero.getBoundingClientRect();sticker(r.left-h.left+r.width/2-30+(Math.random()-.5)*200,r.top-h.top-50-Math.random()*70);const cn=$('#cnt');if(cn)cn.textContent=n};

/* мобиль из малышей: качается от прикосновений */
const pens=$$('.pen').map((el,i)=>({el,b:el.querySelector('b'),a:0,v:i%2?1.5:-1.5,k:.008+i*.002}));
$('#mob').onpointermove=e=>pens.forEach(p=>{const r=p.b.getBoundingClientRect();if(Math.hypot(e.clientX-r.left-r.width/2,e.clientY-r.top-r.height/2)<55)p.v+=Math.max(-2.5,Math.min(2.5,e.movementX*.12))});
pens.forEach(p=>p.b.onclick=e=>{p.v+=(Math.random()<.5?-1:1)*8;pop(e.clientX,e.clientY,['✨','💛'],4)});
let t=0;(function loop(){t++;pens.forEach((p,i)=>{p.v+=-p.a*p.k;p.v*=.993;if(Math.abs(p.v)<.04)p.v+=.03*Math.sin(t/50+i*2);p.a+=p.v;p.el.style.transform=`rotate(${p.a}deg)`});requestAnimationFrame(loop)})();

/* тучки: глаза следят за курсором, тычки; наклон карточек */
addEventListener('pointermove',e=>$$('.pk').forEach(p=>{const r=p.getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,d=Math.hypot(dx,dy)||1,k=Math.min(6,d/40);p.style.setProperty('--ex',dx/d*k+'px');p.style.setProperty('--ey',dy/d*k+'px')}));
$('#pk1').onclick=e=>{const p=e.currentTarget.firstElementChild;p.classList.add('ouch');setTimeout(()=>p.classList.remove('ouch'),450);pop(e.clientX,e.clientY,['🐊','🦈','🐡'],5)};
$$('.tilt').forEach(t=>{t.onpointermove=e=>{const r=t.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;t.style.transform=`perspective(700px) rotateY(${x*16}deg) rotateX(${-y*16}deg) scale(1.03)`};t.onpointerleave=()=>t.style.transform=''});

/* грусть: ручка дождя и утешение */
const dial=$('#dial');
function turn(e){const r=dial.getBoundingClientRect();let a=Math.atan2(e.clientY-r.top-r.height/2,e.clientX-r.left-r.width/2)*180/Math.PI+90;if(a>180)a-=360;a=Math.max(-135,Math.min(135,a));dial.style.setProperty('--a',a+'deg');document.documentElement.style.setProperty('--ri',(a+135)/270)}
dial.onpointerdown=e=>{dial.setPointerCapture(e.pointerId);turn(e)};
dial.onpointermove=e=>dial.hasPointerCapture(e.pointerId)&&turn(e);
const msgs=['Тучка шмыгает носом… но ей чуточку легче.','Она не хотела никого обижать. Она просто такая.','Тучка прижалась поближе. Спасибо, что ты рядом.'];let k=0;
$('#hugBtn').onclick=e=>{pop(...ctr(e.target),['❤️','🤍','💙']);const p=$('#pk2 .pk');p.classList.add('hug');setTimeout(()=>p.classList.remove('hug'),2200);$('#msg').textContent=msgs[k++%msgs.length]};

/* радость: потяни за верёвочку, и аист вернётся */
const pull=$('#pull'),cw=$('#cordw'),cu=cw.querySelector('u');let cy=90,cy0=0,dr=false,moved=0;
const setY=y=>{cy=y;pull.style.top=y+'px';cu.style.height=y+'px'};
function call(){if(gift)return;gift=true;document.body.classList.add('gift');upd();pop(...ctr(pull),['✨','☀️','💛','🌈','🕊️'],24)}
pull.onpointerdown=e=>{dr=true;moved=0;cy0=e.clientY-cy;pull.setPointerCapture(e.pointerId);cw.classList.add('dr')};
pull.onpointermove=e=>{if(!dr)return;moved=1;setY(Math.max(90,Math.min(150,e.clientY-cy0)));if(cy>135)call()};
pull.onpointerup=()=>{dr=false;cw.classList.remove('dr');if(!moved)call();setY(90)};
pull.onkeydown=e=>(e.key=='Enter'||e.key==' ')&&call();

/* печать «одобрено» */
$('#stamp').onclick=e=>{const s=e.currentTarget;s.classList.add('on');s.classList.remove('hit');void s.offsetWidth;s.classList.add('hit');pop(e.clientX,e.clientY,['⭐','💛'],6)};

/* за пролетающим аистом тянется шлейф из искр */
setInterval(()=>{const r=$('.fly .gw').getBoundingClientRect();if(r.right<0||r.left>innerWidth||r.bottom<0)return;
 const s=document.createElement('span');s.className='sp';s.textContent=['✨','💫','☁️','·'][Math.random()*4|0];
 s.style.cssText=`left:${r.left+r.width*.2}px;top:${r.top+r.height*.55}px;font-size:${10+Math.random()*16}px`;
 document.body.append(s);setTimeout(()=>s.remove(),1700)},110);
