/* Gaia Lake Menu — guest ordering (v2.0.3). Loaded by index.html after the menu script. */
let ORDERING = false;
const menuData = () => window.MENU || {};   // index.html stores the loaded menu in window.MENU
const OS = { cart:new Map(), amend:null, lastId:null, id:null, f:{}, text:'' };
const $ = id => document.getElementById(id);
const today = () => new Date().toLocaleDateString('en-CA', { timeZone:'Asia/Colombo' });
const nowHM = () => new Date().toLocaleTimeString('en-GB', { timeZone:'Asia/Colombo', hour:'2-digit', minute:'2-digit', hour12:false });
function tomorrow(){ const d = new Date(today() + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + 1); return d.toISOString().slice(0, 10); }
function hours(){ const s = (menuData().settings || {}); return { open:s.kitchenOpen || '06:00', close:s.kitchenClose || '22:00', cutoff:s.sameDayCutoff || '19:00', last:s.lastDining || '21:00' }; }
const pastCutoff = () => nowHM() >= hours().cutoff;
const minDate = () => pastCutoff() ? tomorrow() : today();          // earliest dining date a guest may still pick
function kitchenOpenNow(){ const h = hours(), n = nowHM(); return h.open <= h.close ? (n >= h.open && n < h.close) : (n >= h.open || n < h.close); }
const dishBy = c => (menuData().dishes || []).find(d => Number(d.code) === Number(c));
const catOf = c => (menuData().categories || []).find(x => x.id === dishBy(c)?.categoryId);
const isBB = c => !!catOf(c)?.bbIncluded;
const cartHasBB = () => lines().some(l => isBB(l.c));
const code3 = c => '#' + String(c).padStart(3, '0');
const usd = n => 'USD ' + Number(n).toFixed(2);   // all order prices are in USD; LKR conversion happens at final billing
const lines = () => [...OS.cart.values()];
function unit(c, s){ const d = dishBy(c); if (!d) return 0; const o = s && (d.subOptions || []).find(x => x.name === s); return Number((o ? o.price : d.price)?.usd) || 0; }
function lineCharge(l){ return (OS.f.bb && isBB(l.c)) ? 0 : unit(l.c, l.s) * l.q; }         // 0 when waived on Bed & Breakfast
const total = () => Math.round(lines().reduce((t, l) => t + lineCharge(l), 0) * 100) / 100;
function addBtn(c, s){ return ORDERING && c && unit(c, s) > 0 ? `<button class="add-btn" data-c="${c}" data-s="${esc(s)}">+ Add</button>` : ''; }
const totalTxt = () => usd(total());
function syncBtns(){ document.querySelectorAll('.add-btn').forEach(b => { const l = OS.cart.get(b.dataset.c + '|' + b.dataset.s); b.textContent = l ? '✓ Added (' + l.q + ')' : '+ Add'; b.classList.toggle('on', !!l); }); }
function bar(){
  const n = lines().reduce((t, l) => t + l.q, 0);
  $('cartBar').classList.toggle('hidden', !n);
  $('cartSummary').textContent = `${n} item${n > 1 ? 's' : ''} · ${usd(total())}`; syncBtns();
}
function initOrdering(){
  bar();
  try{ Object.assign(OS.f, JSON.parse(localStorage.getItem('gl-guest-details') || '{}')); }catch(e){}
}
document.addEventListener('click', e => {
  const b = e.target.closest('.add-btn'); if (!b) return;
  const k = b.dataset.c + '|' + b.dataset.s, l = OS.cart.get(k) || { c:b.dataset.c, s:b.dataset.s, q:0, d:'', t:'' };
  l.q = Math.min(50, l.q + 1); OS.cart.set(k, l); bar();
});
$('openCart').onclick = () => { showForm(); $('orderModal').classList.add('open'); document.body.classList.add('o-lock'); $('orderModal').scrollTop = 0; };
const closeO = () => { $('orderModal').classList.remove('open'); document.body.classList.remove('o-lock'); };

function roomOptions(){                                              // Room Numbers + Group/bulk-order labels, merged — dropdown only, no typing
  const s = menuData().settings || {};
  return [...(s.rooms || []), ...(s.groupLabels || [])];
}
function isGroupRoom(v){ return (menuData().settings || {}).groupLabels?.some(g => g.toLowerCase() === (v || '').trim().toLowerCase()); }

function grab(){
  if (!$('fName')) return;
  OS.f = { ...OS.f, date:$('fDate').value, time:$('fTime').value, name:$('fName').value, room:$('fRoom') ? $('fRoom').value : (OS.f.room || ''), phone:$('fPhone').value, note:$('fNote').value, web:$('fWeb').value, bb:$('fBB') ? $('fBB').checked : (OS.f.bb || false) };
  try{ localStorage.setItem('gl-guest-details', JSON.stringify({ name:OS.f.name, room:OS.f.room, phone:OS.f.phone })); }catch(e){}
}
function notices(){
  const h = hours(); let n = '';
  if (pastCutoff()) n += `<div class="o-note">Same-day orders are closed for today (after ${to12h(h.cutoff)}). Please choose tomorrow or a later date.</div>`;
  if (!kitchenOpenNow()) n += `<div class="o-note">The kitchen is closed right now. Your order will still be sent and seen when we open at ${to12h(h.open)}.</div>`;
  return n;
}
function showForm(err){
  const f = OS.f, opts = roomOptions();
  const roomIn = opts.length
    ? `<select id="fRoom">${!f.room ? '<option value="">Select room…</option>' : ''}${opts.map(r => `<option${r === f.room ? ' selected' : ''}>${esc(r)}</option>`).join('')}</select>`
    : `<div class="hint">No rooms are set up yet — please contact us directly to order.</div>`;
  const h = hours();
  $('orderTitle').textContent = OS.amend ? 'Amend your order' : 'Your order';
  $('orderBody').innerHTML = (err ? `<div class="o-err">${esc(err)}</div>` : '') + notices() +
    ([...OS.cart.entries()].map(([k, l]) => `<div class="ol" data-k="${esc(k)}">
      <div class="ol-top"><b><span class="item-no">${code3(l.c)}</span> ${esc(dishBy(l.c)?.name || '')}</b>${l.s ? `<small>${esc(l.s)}</small>` : ''}</div>
      <div class="ol-ctl"><button class="q" data-d="-1">−</button><span>${l.q}</span><button class="q" data-d="1">+</button><span class="ol-p">${(OS.f.bb && isBB(l.c)) ? 'Included (BB)' : usd(unit(l.c, l.s) * l.q)}</span><button class="q rm" data-rm="1">×</button></div>
      <div class="ol-when"><span>Different date/time for this item? (optional)</span><div class="ol-when-in"><input type="date" class="od" min="${minDate()}" value="${l.d}"><input type="time" class="ot" min="${h.open}" max="${h.last}" value="${l.t}"></div></div></div>`).join('') || '<p>Your order is empty.</p>') +
    (cartHasBB() ? `<label class="bb-box"><input type="checkbox" id="fBB" ${f.bb ? 'checked' : ''}> On Bed &amp; Breakfast — this breakfast is included in my room rate.</label>
    <div class="hint">If this isn't correct, your order will be billed at the full price.</div>` : '') +
    `<div class="o-total"><span>Total</span><b>${totalTxt()}</b></div>
    <div class="o-grid"><label>Dining date<input type="date" id="fDate" min="${minDate()}" value="${f.date || ''}"></label><label>Dining time<input type="time" id="fTime" min="${h.open}" max="${h.last}" value="${f.time || ''}"></label></div>
    <div class="hint">Dining time must be between ${to12h(h.open)} and ${to12h(h.last)}. For any other time (e.g. an early breakfast), please write it in the Note below.</div>
    <label>Your name<input id="fName" autocomplete="name" value="${esc(f.name || '')}"></label>
    <div class="o-grid"><label>Room number${roomIn}</label><label>Phone<input id="fPhone" type="tel" autocomplete="tel" value="${esc(f.phone || '')}"></label></div>
    <label>Note (optional)<textarea id="fNote">${esc(f.note || '')}</textarea></label>
    <input class="hp" id="fWeb" tabindex="-1" autocomplete="off" aria-hidden="true" value="${esc(f.web || '')}">
    <div class="o-btns"><button class="btn-ghost danger" id="oCancel">Cancel order</button><button class="btn-ghost" id="oClose">Go back</button><button class="btn-main" id="oReview">Review order</button></div>`;
}
function check(){
  const f = OS.f, ph = (f.phone || '').replace(/[\s\-()]/g, ''), h = hours();
  if (!OS.cart.size) return 'Please add at least one item.';
  if ((f.name || '').trim().length < 2) return 'Please enter your name.';
  if (!(f.room || '').trim()) return 'Please select a room.';
  if (!/^\+?\d{7,15}$/.test(ph)) return 'Please enter a valid phone number (digits only; add the country code if outside Sri Lanka).';
  for (const l of lines()){
    const d = l.d || f.date, t = l.t || f.time;
    if (!d || !t) return 'Please choose a dining date and time.';
    if (d < today()) return 'The dining date cannot be in the past.';
    if (d < minDate()) return `Same-day orders are closed for today (after ${to12h(h.cutoff)}). Please choose tomorrow or a later date.`;
    if (t < h.open || t > h.last) return `Dining time must be between ${to12h(h.open)} and ${to12h(h.last)}. For any other time, please write your request in the Note.`;
  }
  return '';
}
function showReview(){
  const f = OS.f;
  $('orderTitle').textContent = 'Review your order';
  $('orderBody').innerHTML = notices() +
    (isGroupRoom(f.room) ? `<div class="o-note">Group Selection Policy: please select one common category / meal option per group for each meal sitting (Breakfast, Lunch, Dinner).</div>` : '') +
    `<div class="rv">${lines().map(l => `<div class="rv-l"><span>${l.q}× <span class="item-no">${code3(l.c)}</span> ${esc(dishBy(l.c)?.name || '')}${l.s ? ' – ' + esc(l.s) : ''}${l.d || l.t ? `<small>${l.d || f.date} at ${l.t || f.time}</small>` : ''}</span><b>${(f.bb && isBB(l.c)) ? 'Included (BB)' : usd(unit(l.c, l.s) * l.q)}</b></div>`).join('')}
    <div class="rv-l tot"><span>Total</span><b>${totalTxt()}</b></div></div>
    <p class="rv-m"><b>${esc(f.name)}</b> · Room ${esc(f.room)} · ${esc(f.phone)}<br>Dining ${f.date} at ${f.time}${f.note ? '<br>Note: ' + esc(f.note) : ''}${f.bb ? '<br><small>On Bed &amp; Breakfast — breakfast included</small>' : ''}</p>
    <div class="o-btns"><button class="btn-ghost" id="oEdit">Edit</button><button class="btn-main" id="oSend">Confirm &amp; send</button></div>`;
}
function payload(){
  const f = OS.f; OS.id = OS.id || 'GL-' + Array.from({ length:6 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('');
  return { v:1, id:OS.id, amend:OS.amend || undefined, name:f.name.trim(), room:f.room.trim(), phone:f.phone.replace(/[\s\-()]/g, ''), date:f.date, time:f.time,
    note:(f.note || '').trim() || undefined, total:total(), planIncluded:!!f.bb, website:f.web || '',
    items:lines().map(l => ({ c:Number(l.c), s:l.s || undefined, q:l.q, d:l.d || undefined, t:l.t || undefined })) };
}
function orderText(o){   // human-readable order + one #GLORDER line the admin paste box can read
  const { website, ...clean } = o;
  const j = btoa(unescape(encodeURIComponent(JSON.stringify(clean)))), ck = [...j].reduce((h, ch) => (h * 33 + ch.charCodeAt(0)) >>> 0, 5381).toString(36);
  return `Gaia Lake food order ${o.id}${o.amend ? ' (amends ' + o.amend + ')' : ''}\n${o.name}, Room ${o.room}, ${o.phone}\nDining: ${o.date} ${o.time}\n` +
    o.items.map(i => `${i.q}x ${code3(i.c)} ${dishBy(i.c)?.name || ''}${i.s ? ' - ' + i.s : ''}${i.d || i.t ? ` (${i.d || o.date} ${i.t || o.time})` : ''}`).join('\n') +
    `\nTotal ${usd(o.total)}${o.planIncluded ? ' (Bed & Breakfast — breakfast included)' : ''}${o.note ? '\nNote: ' + o.note : ''}\n#GLORDER ${j}.${ck}`;
}
async function send(){
  const o = payload(), b = $('oSend'); b.disabled = true; b.textContent = 'Sending…';
  let why = '';
  for (let a = 0; a < 3; a++){                       // automatic retries; safe because the server ignores a repeated order ID
    let j = null;
    try{
      const c = new AbortController(), t = setTimeout(() => c.abort(), 10000);
      const r = await fetch(CONFIG.ORDER_SCRIPT_URL, { method:'POST', headers:{ 'Content-Type':'text/plain;charset=utf-8' }, body:JSON.stringify(o), signal:c.signal });
      clearTimeout(t); j = await r.json();
    }catch(e){ why = e.name === 'AbortError' ? 'timed out' : e.message; console.error('Order send failed:', e); }
    if (j && j.ok){ OS.lastId = o.id; OS.id = null; showDone(o.id); return; }
    if (j && j.reject){ showForm(j.error); return; }
    if (j) why = j.error || 'server error';
    if (a < 2){ b.textContent = 'Retrying…'; await new Promise(r => setTimeout(r, 1500)); }
  }
  showFallback(o, why);
}
function showDone(id){
  const ph = (menuData().profile || {}).phone || '';
  $('orderTitle').textContent = 'Order sent ✓';
  $('orderBody').innerHTML = `<p>Thank you, your order <b>${id}</b> has reached the kitchen. If anything is wrong, ${ph ? `call us on <a href="tel:${esc(ph.replace(/\s+/g, ''))}">${esc(ph)}</a>` : 'please contact the reception'}.</p>
    <div class="o-btns"><button class="btn-ghost" id="oAmend">Amend this order</button><button class="btn-main" id="oFinish">Done</button></div>`;
}
function showFallback(o, why){
  const t = orderText(o), s = (menuData().settings || {}).orders || {}, p = menuData().profile || {}, q = encodeURIComponent(t);
  const em = s.email || CONFIG.GUEST_ORDER_EMAIL, wa = (s.whatsapp || p.phone || '').replace(/\D/g, ''), ph = (p.phone || '').replace(/\s+/g, ''); OS.text = t;
  $('orderTitle').textContent = 'Couldn’t send automatically';
  $('orderBody').innerHTML = `<p>Please send your order another way — the message is already written for you.</p><p class="rv-m" style="opacity:.6;font-size:.72rem">Reason: ${esc(why || 'unknown')}</p><div class="fb">
    ${wa ? `<a class="btn-main" href="https://wa.me/${wa}?text=${q}">WhatsApp</a>` : ''}${em ? `<a class="btn-ghost" href="mailto:${esc(em)}?subject=${encodeURIComponent('Food order ' + o.id)}&body=${q}">Email</a>` : ''}
    ${ph ? `<a class="btn-ghost" href="sms:${ph}?&body=${q}">SMS</a><a class="btn-ghost" href="tel:${ph}">Call</a>` : ''}<button class="btn-ghost" id="oCopy">Copy text</button></div>
    <pre class="fb-t">${esc(t)}</pre><div class="o-btns"><button class="btn-ghost" id="oBack">Back</button><button class="btn-main" id="oFinish">I’ve sent it</button></div>`;
}
function finish(){ OS.cart.clear(); OS.amend = null; OS.id = null; OS.f.date = OS.f.time = OS.f.note = ''; bar(); closeO(); }
$('orderBody').addEventListener('click', e => {
  const t = e.target, row = t.closest('.ol');
  if (t.classList.contains('q') && row){
    grab(); const l = OS.cart.get(row.dataset.k), d = Number(t.dataset.d);
    if (t.dataset.rm || l.q + d < 1) OS.cart.delete(row.dataset.k); else l.q = Math.min(50, l.q + d);
    bar(); showForm(); return;
  }
  ({ oClose:closeO, oCancel:() => { if (confirm('Cancel this order and clear all your selections?')) finish(); }, oReview:() => { grab(); const m = check(); m ? showForm(m) : showReview(); }, oEdit:() => showForm(), oSend:send,
     oBack:showReview, oFinish:finish, oAmend:() => { OS.amend = OS.lastId; showForm(); },
     oCopy:() => { navigator.clipboard?.writeText(OS.text).then(() => t.textContent = 'Copied ✓').catch(() => {}); } })[t.id]?.();
});
$('orderBody').addEventListener('change', e => {
  const row = e.target.closest('.ol'); if (!row) return; const l = OS.cart.get(row.dataset.k);
  if (e.target.classList.contains('od')) l.d = e.target.value; if (e.target.classList.contains('ot')) l.t = e.target.value;
});
$('orderBody').addEventListener('change', e => { if (e.target.id === 'fBB'){ OS.f.bb = e.target.checked; showForm(); } });
