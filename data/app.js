async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) return null;
  return await res.json();
}

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

function card(html) {
  const div = document.createElement('div');
  div.className = "border rounded-2xl p-5 bg-white";
  div.innerHTML = html;
  return div;
}

(async () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  const events = await loadJSON('./data/events.json') || [];
  const sponsors = await loadJSON('./data/sponsors.json') || [];
  const officers = await loadJSON('./data/officers.json') || [];

  // Events
  const $events = document.getElementById('events-list');
  const upcoming = events
    .filter(e => new Date(e.start) >= new Date(new Date().toDateString()))
    .sort((a,b) => new Date(a.start) - new Date(b.start))
    .slice(0, 6);

  upcoming.forEach(e => {
    const el = card(`
      <div class="flex flex-col h-full">
        <div class="text-xs text-gray-500">${fmtDate(e.start)}${e.end ? ' – ' + fmtDate(e.end) : ''}</div>
        <h3 class="mt-1 font-semibold">${e.title}</h3>
        <div class="mt-1 text-sm text-gray-700">${e.location || ''}</div>
        <p class="mt-3 text-sm text-gray-700 line-clamp-3">${e.description || ''}</p>
        <div class="mt-4 flex gap-2 mt-auto">
          ${e.form ? `<a class="px-3 py-1 rounded-lg bg-black text-white text-sm" href="${e.form}">Register</a>` : ''}
          ${e.link ? `<a class="px-3 py-1 rounded-lg border text-sm" href="${e.link}">Details</a>` : ''}
        </div>
      </div>
    `);
    $events.appendChild(el);
  });
  document.getElementById('all-events-link').href = './events.html';

  // Sponsors
  const $s = document.getElementById('sponsor-grid');
  sponsors.forEach(s => {
    const a = document.createElement('a');
    a.href = s.url || '#';
    a.className = "block border rounded-xl p-3 bg-white";
    a.innerHTML = `<img alt="${s.name}" class="w-full h-20 object-contain" src="${s.logo}">`;
    $s.appendChild(a);
  });

  // Officers
  const $o = document.getElementById('officers');
  officers.forEach(o => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="font-medium">${o.name}</span> — ${o.role}`;
    $o.appendChild(li);
  });
})();
