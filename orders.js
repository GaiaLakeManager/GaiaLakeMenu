/* Gaia Lake Menu — guest ordering (v2.0). Loaded by index.html after the menu script. */
let ORDERING = false, MENU = {};
const OS = { cart:new Map(), amend:null, lastId:null, id:null, f:{}, text:'' };
const $ = id => document.getElementById(id);
const today = () => new Date().toLocaleDateString('en-CA', { timeZone:'Asia/Colombo' });
const dishBy = c => (MENU.dishes || []).find(d => Number(d.code) === Number(c));
const code3 = c => '#' + String(c).padStart(3, '0');
const lkr = n => 'LKR ' + Number(n).toLocaleString('en-US');
const lines = () => [...OS.cart.values()];
function unit(c, s){ const d = dishBy(c); if (!d) return 0; const o = s && (d.subOptions || []).find(x => x.name === s); return Number((o ? o.price : d.price)?.lkr) || 0; }
const total = () => lines().reduce((t, l) => t + unit(l.c, l.s) * l.q, 0);
function addBtn(c, s){ return ORDERING && c ? `<button class="add-btn" data-c="${c}" data-s="${esc(s)}">+ Add</button>` : ''; }
function bar(){
  const n = lines().reduce((t, l) => t + l.q, 0);
  $('cartBar').classList.toggle('hidden', !n);
  $('cartSummary').textContent = `${n} item${n > 1 ? 's' : ''} · ${lkr(total())}`;
}
function initOrdering(){
  bar();
  try{ Object.assign(OS.f, JSON.parse(localStorage.getItem('gl-guest-details') || '{}')); }catch(e){}
}
document.addEventListener('click', e => {
  const b = e.target.closest('.add-btn'); if (!b) return;
  const k = b.dataset.c + '|' + b.dataset.s, l = OS.cart.get(k) || { c:b.dataset.c, s:b.dataset.s, q:0, d:'', t:'' };
  l.q = Math.min(50, l.q + 1); OS.cart.set(k, l); bar(); b.textContent = '✓ Added (' + l.q + ')';
});
$('openCart').onclick = () => { showForm(); $('orderModal').classList.add('open'); };
const closeO = () => $('orderModal').classList.remove('open');

function grab(){
  if (!$('fName')) return;
  OS.f = { ...OS.f, date:$('fDate').value, time:$('fTime').value, name:$('fName').value, room:$('fRoom').value, phone:$('fPhone').value, note:$('fNote').value, web:$('fWeb').value };
  try{ localStorage.setItem('gl-guest-details', JSON.stringify({ name:OS.f.name, room:OS.f.room, phone:OS.f.phone })); }catch(e){}
}
function showForm(err){
  const f = OS.f;
  $('orderTitle').textContent = OS.amend ? 'Amend your order' : 'Your order';
  $('orderBody').innerHTML = (err ? `<div class="o-err">${esc(err)}</div>` : '') +
    ([...OS.cart.entries()].map(([k, l]) => `<div class="ol" data-k="${esc(k)}">
      <div class="ol-top"><b><span class="item-no">${code3(l.c)}</span> ${esc(dishBy(l.c)?.name || '')}</b>${l.s ? `<small>${esc(l.s)}</small>` : ''}</div>
      <div class="ol-ctl"><button class="q" data-d="-1">−</button><span>${l.q}</span><button class="q" data-d="1">+</button><span class="ol-p">${lkr(unit(l.c, l.s) * l.q)}</span><button class="q rm" data-rm="1">×</button></div>
      <div class="ol-when">Different date/time for this item? <input type="date" class="od" min="${today()}" value="${l.d}"> <input type="time" class="ot" value="${l.t}"></div></div>`).join('') || '<p>Your order is empty.</p>') +
    `<div class="o-total">Total <b>${lkr(total())}</b></div>
    <div class="o-grid"><label>Dining date<input type="date" id="fDate" min="${today()}" value="${f.date || ''}"></label><label>Dining time<input type="time" id="fTime" value="${f.time || ''}"></label></div>
    <label>Your name<input id="fName" autocomplete="name" value="${esc(f.name || '')}"></label>
    <div class="o-grid"><label>Room number<input id="fRoom" value="${esc(f.room || '')}"></label><label>Phone<input id="fPhone" type="tel" autocomplete="tel" value="${esc(f.phone || '')}"></label></div>
    <label>Note (optional)<textarea id="fNote">${esc(f.note || '')}</textarea></label>
    <input class="hp" id="fWeb" tabindex="-1" autocomplete="off" aria-hidden="true" value="${esc(f.web || '')}">
    <div class="o-btns"><button class="btn-ghost" id="oClose">Close</button><button class="btn-main" id="oReview">Review order</button></div>`;
}
function check(){
  const f = OS.f, ph = (f.phone || '').replace(/[\s\-()]/g, '');
  if (!OS.cart.size) return 'Please add at least one item.';
  if ((f.name || '').trim().length < 2) return 'Please enter your name.';
  if (!/^[A-Za-z0-9\-\/ ]{1,10}$/.test((f.room || '').trim())) return 'Please enter a valid room number.';
  if (!/^\+?\d{7,15}$/.test(ph)) return 'Please enter a valid phone number (digits only; add the country code if outside Sri Lanka).';
  for (const l of lines()){ const d = l.d || f.date, t = l.t || f.time; if (!d || !t) return 'Please choose a dining date and time.'; if (d < today()) return 'The dining date cannot be in the past.'; }
  return '';
}
function showReview(){
  const f = OS.f; $('orderTitle').textContent = 'Review your order';
  $('orderBody').innerHTML = `<div class="rv">${lines().map(l => `<div class="rv-l"><span>${l.q}× <span class="item-no">${code3(l.c)}</span> ${esc(dishBy(l.c)?.name || '')}${l.s ? ' – ' + esc(l.s) : ''}${l.d || l.t ? `<small>${l.d || f.date} at ${l.t || f.time}</small>` : ''}</span><b>${lkr(unit(l.c, l.s) * l.q)}</b></div>`).join('')}
    <div class="rv-l tot"><span>Total</span><b>${lkr(total())}</b></div></div>
    <p class="rv-m"><b>${esc(f.name)}</b> · Room ${esc(f.room)} · ${esc(f.phone)}<br>Dining ${f.date} at ${f.time}${f.note ? '<br>Note: ' + esc(f.note) : ''}</p>
    <div class="o-btns"><button class="btn-ghost" id="oEdit">Edit</button><button class="btn-main" id="oSend">Confirm &amp; send</button></div>`;
}
function payload(){
  const f = OS.f; OS.id = OS.id || 'GL-' + Array.from({ length:6 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('');
  return { v:1, id:OS.id, amend:OS.amend || undefined, name:f.name.trim(), room:f.room.trim(), phone:f.phone.replace(/[\s\-()]/g, ''), date:f.date, time:f.time,
    note:(f.note || '').trim() || undefined, total:total(), website:f.web || '',
    items:lines().map(l => ({ c:Number(l.c), s:l.s || undefined, q:l.q, d:l.d || undefined, t:l.t || undefined })) };
}
function orderText(o){   // human-readable order + one #GLORDER line the admin paste box can read
  const { website, ...clean } = o;
  const j = btoa(unescape(encodeURIComponent(JSON.stringify(clean)))), ck = [...j].reduce((h, ch) => (h * 33 + ch.charCodeAt(0)) >>> 0, 5381).toString(36);
  return `Gaia Lake food order ${o.id}${o.amend ? ' (amends ' + o.amend + ')' : ''}\n${o.name}, Room ${o.room}, ${o.phone}\nDining: ${o.date} ${o.time}\n` +
    o.items.map(i => `${i.q}x ${code3(i.c)} ${dishBy(i.c)?.name || ''}${i.s ? ' - ' + i.s : ''}${i.d || i.t ? ` (${i.d || o.date} ${i.t || o.time})` : ''}`).join('\n') +
    `\nTotal ${lkr(o.total)}${o.note ? '\nNote: ' + o.note : ''}\n#GLORDER ${j}.${ck}`;
}
async function send(){
  const o = payload(), b = $('oSend'); b.disabled = true; b.textContent = 'Sending…';
  try{
    const c = new AbortController(), t = setTimeout(() => c.abort(), 15000);
    const r = await fetch(CONFIG.ORDER_SCRIPT_URL, { method:'POST', headers:{ 'Content-Type':'text/plain;charset=utf-8' }, body:JSON.stringify(o), signal:c.signal });
    clearTimeout(t); const j = await r.json();
    if (!j.ok){ if (j.reject){ showForm(j.error); return; } throw new Error(j.error); }
    OS.lastId = o.id; OS.id = null; showDone(o.id);
  }catch(e){ showFallback(o); }
}
function showDone(id){
  $('orderTitle').textContent = 'Order sent ✓';
  $('orderBody').innerHTML = `<p>Thank you, your order <b>${id}</b> has reached the kitchen. If anything is wrong, call us on the number at the top of the menu.</p>
    <div class="o-btns"><button class="btn-ghost" id="oAmend">Amend this order</button><button class="btn-main" id="oFinish">Done</button></div>`;
}
function showFallback(o){
  const t = orderText(o), s = (MENU.settings || {}).orders || {}, p = MENU.profile || {}, q = encodeURIComponent(t);
  const em = s.email || CONFIG.GUEST_ORDER_EMAIL, wa = (s.whatsapp || p.phone || '').replace(/\D/g, ''), ph = (p.phone || '').replace(/\s+/g, ''); OS.text = t;
  $('orderTitle').textContent = 'Couldn’t send automatically';
  $('orderBody').innerHTML = `<p>Please send your order another way — the message is already written for you.</p><div class="fb">
    ${wa ? `<a class="btn-main" href="https://wa.me/${wa}?text=${q}">WhatsApp</a>` : ''}${em ? `<a class="btn-ghost" href="mailto:${esc(em)}?subject=${encodeURIComponent('Food order ' + o.id)}&body=${q}">Email</a>` : ''}
    ${ph ? `<a class="btn-ghost" href="sms:${ph}?&body=${q}">SMS</a><a class="btn-ghost" href="tel:${ph}">Call</a>` : ''}<button class="btn-ghost" id="oCopy">Copy text</button></div>
    <pre class="fb-t">${esc(t)}</pre><div class="o-btns"><button class="btn-ghost" id="oBack">Back</button><button class="btn-main" id="oFinish">I’ve sent it</button></div>`;
}
function finish(){ OS.cart.clear(); OS.amend = null; OS.id = null; OS.f.date = OS.f.time = OS.f.note = ''; bar(); document.querySelectorAll('.add-btn').forEach(b => b.textContent = '+ Add'); closeO(); }
$('orderBody').addEventListener('click', e => {
  const t = e.target, row = t.closest('.ol');
  if (t.classList.contains('q') && row){
    grab(); const l = OS.cart.get(row.dataset.k), d = Number(t.dataset.d);
    if (t.dataset.rm || l.q + d < 1) OS.cart.delete(row.dataset.k); else l.q = Math.min(50, l.q + d);
    bar(); showForm(); return;
  }
  ({ oClose:closeO, oReview:() => { grab(); const m = check(); m ? showForm(m) : showReview(); }, oEdit:() => showForm(), oSend:send,
     oBack:showReview, oFinish:finish, oAmend:() => { OS.amend = OS.lastId; showForm(); },
     oCopy:() => { navigator.clipboard?.writeText(OS.text).then(() => t.textContent = 'Copied ✓').catch(() => {}); } })[t.id]?.();
});
$('orderBody').addEventListener('change', e => {
  const row = e.target.closest('.ol'); if (!row) return; const l = OS.cart.get(row.dataset.k);
  if (e.target.classList.contains('od')) l.d = e.target.value; if (e.target.classList.contains('ot')) l.t = e.target.value;
});
