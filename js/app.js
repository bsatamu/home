async function loadJSON(path){ const r=await fetch(path); return r.ok?await r.json():null; }
function fmtDate(iso){ const d=new Date(iso); return d.toLocaleString(undefined,{dateStyle:'medium', timeStyle:'short'}); }
function el(tag, cls, html){ const e=document.createElement(tag); if(cls) e.className=cls; if(html!==undefined) e.innerHTML=html; return e; }
function card(html){ return el('div', 'border rounded-2xl p-5 bg-white', html); }

(async()=>{
  document.getElementById('year').textContent = new Date().getFullYear?.() || new Date().getFullYear();

  const [officers, honors, events, sponsors] = await Promise.all([
    loadJSON('./data/officers.json').then(v=>v||[]),
    loadJSON('./data/honors.json').then(v=>v||[]),
    loadJSON('./data/events.json'),
    loadJSON('./data/sponsors.json').then(v=>v||[])
  ]);

  // Executive Committee with photos
  const $exec = document.getElementById('exec-grid');
  if ($exec && officers.length){
    officers.forEach(o=>{
      const c = document.createElement('div');
      c.className = "border rounded-2xl p-5 bg-white flex flex-col items-center text-center";
      c.innerHTML = `
        <img src="${o.photo}" alt="${o.name}" class="h-24 w-24 object-cover rounded-full border mb-3">
        <div class="font-medium">${o.name}</div>
        <div class="text-sm text-gray-600">${o.role}</div>
        <div class="text-xs text-gray-500 mt-1">${o.info || ''}</div>
      `;
      $exec.appendChild(c);
    });
  }

  // Honor Roll (past presidents)
  const $hon = document.getElementById('honors-list');
  if ($hon && honors.length){
    honors.forEach(h=>{
      const li = el('li','border rounded-xl p-4 bg-white',
        `<div class="font-medium">${h.name}</div><div class="text-sm text-gray-600">${h.year}</div>`);
      $hon.appendChild(li);
    });
  }

// Current/Ongoing Event
const $cur = document.getElementById('current-card');
if ($cur && events?.featured) {
  const e = events.featured;
  const c = card(`
    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex-1">
        <div class="text-xs text-gray-500">${e.start ? fmtDate(e.start) : ''}</div>
        <h3 class="mt-1 font-semibold">${e.title}</h3>
        <div class="mt-1 text-sm text-gray-700">${e.location || ''}</div>
        <p class="mt-3 text-sm text-gray-700">${e.summary || ''}</p>
        <div class="mt-4 flex gap-2">
          ${e.link ? `
            <a href="${e.link}"
               class="px-4 py-2 rounded-lg bg-black text-white text-sm hover:bg-gray-900 transition">
               ${e.cta || 'Register Now'}
            </a>` : ''}
          <a href="./results/index.html"
             class="px-4 py-2 rounded-lg bg-white text-black border border-black text-sm hover:bg-gray-100 transition">
             View Results
          </a>
        </div>
      </div>
    </div>
  `);
  $cur.appendChild(c);
}



  // Upcoming Events (existing section)
  const $events = document.getElementById('events-list');
  if ($events){
    const upcoming = (events?.upcoming||[])
      .filter(e => e.start ? new Date(e.start) >= new Date(new Date().toDateString()) : true)
      .sort((a,b)=> new Date(a.start||'2100-01-01') - new Date(b.start||'2100-01-01'))
      .slice(0,6);
    upcoming.forEach(e=>{
      const c = card(`
        <div class="flex flex-col h-full">
          <div class="text-xs text-gray-500">${e.start?fmtDate(e.start):''}${e.end?' – '+fmtDate(e.end):''}</div>
          <h3 class="mt-1 font-semibold">${e.title}</h3>
          <div class="mt-1 text-sm text-gray-700">${e.location||''}</div>
          <p class="mt-3 text-sm text-gray-700 line-clamp-3">${e.description||''}</p>
          <div class="mt-4 flex gap-2 mt-auto">
            ${e.form?`<a class="px-3 py-1 rounded-lg bg-black text-white text-sm" href="${e.form}">Register</a>`:''}
            ${e.link?`<a class="px-3 py-1 rounded-lg border text-sm" href="${e.link}">Details</a>`:''}
          </div>
        </div>
      `);
      $events.appendChild(c);
    });
    const allLink = document.getElementById('all-events-link');
    if (allLink) allLink.href = './previous-events.html';
  }
})();
