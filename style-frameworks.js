/*
 * Style frameworks: renders index.html from window.STYLE_DATA.
 *
 * DATA FORMAT
 * Each section is one file, data/<id>.js, loaded with a plain <script> tag
 * before this file (no fetch, so the page also works from file://). A file sets:
 *
 *   (window.STYLE_DATA = window.STYLE_DATA || {})['os'] = {
 *     title: 'Operating systems',
 *     intro: 'One sentence introducing the section.',
 *     styles: [
 *       {
 *         name: 'Aqua',
 *         when: '2001-2013',
 *         where: 'Apple, Mac OS X',
 *         line: 'Named after water: glossy, translucent buttons that looked like drops of liquid.',
 *         image: 'img/os/aqua.png',
 *         alt: 'Mac OS X 10.0 desktop with a translucent blue Dock and striped windows',
 *         credit: {
 *           by: '(c) Apple Inc.',
 *           license: 'non-free, via English Wikipedia',
 *           source: 'https://en.wikipedia.org/wiki/File:...'
 *         }
 *       }
 *     ]
 *   };
 *
 * Fields of a style (all strings):
 * - name    the style's name.
 * - when    years: '1985', '2001-2013', 'c. 1140-1500', '1990s'.
 * - where   the maker or place: 'Apple, Mac OS X', 'Île-de-France', 'Nintendo'.
 * - line    one sentence, at most ~30 words: where the name comes from and the idea.
 * - image   path relative to index.html: 'img/<id>/<slug>.<ext>'.
 * - alt     alt text describing the picture (also the caption in the enlarged view).
 * - credit  { by, license, source }: shown as "Photo: <by>, <license>", linked to source,
 *           the file's Wikimedia page URL (the "source" that get_image.py prints).
 * - demo    optional: the style's finished framework, as the path of its demo page relative
 *           to index.html: 'frameworks/aqua/'. The card then shows a "Framework" badge and a
 *           "View demo" link, and the "Completed only" filter (?sort=completed) keeps it.
 *
 * Rules:
 * - About 10-12 styles per section, oldest first. The page keeps the file's order.
 * - Images go in img/<id>/, about 800px wide and under ~400 KB. Fetch them with
 *   tools/get_image.py, which prints the credit.
 * - Prefer free Wikimedia Commons files. Non-free English Wikipedia screenshots are allowed
 *   for OS, app and game screenshots: credit them as
 *   { by: '(c) <owner>', license: 'non-free, via English Wikipedia', source: <file page> }.
 * - The Objects and Art and film sections use free Wikimedia Commons files only: no
 *   non-free English Wikipedia files and nothing from big franchises or studios (Star Wars,
 *   Disney, Marvel, Pixar, Studio Ghibli and the like). With no free picture, use an SVG specimen.
 * - Only when no image exists, draw an SVG specimen (img/<id>/<slug>.svg) and credit it as
 *   { by: 'Illustration made for this page', license: '', source: '' }. An empty license
 *   shows the credit as plain text without "Photo:".
 * - A missing or broken image shows a neutral tile with the style name.
 *
 * Group membership and section order live in GROUPS below. A section whose file is
 * missing or has no styles shows "Coming soon".
 */
(function () {
  'use strict';

  const GROUPS = [
    { name: 'Screens', sections: ['os', 'web', 'games'] },
    { name: 'Buildings and spaces', sections: ['architecture-historic', 'architecture-modern', 'interiors', 'gardens'] },
    { name: 'Objects', sections: ['products', 'furniture', 'cars'] },
    { name: 'Art and film', sections: ['art', 'film', 'animation'] }
  ];

  const DATA = window.STYLE_DATA || {};
  const $ = (selector) => document.querySelector(selector);

  // Small DOM helper: el('p', { class: 'x', text: 'y' }, child, ...). Text is never parsed as HTML.
  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs || {})) {
      if (value == null || value === false) continue;
      if (key === 'class') node.className = value;
      else if (key === 'text') node.textContent = value;
      else node.setAttribute(key, value === true ? '' : value);
    }
    for (const child of children) if (child != null) node.append(child);
    return node;
  }

  function sectionData(id) {
    const data = DATA[id];
    if (!data) console.warn(`Style frameworks: data/${id}.js did not set STYLE_DATA['${id}'].`);
    return {
      title: (data && data.title) || id,
      intro: (data && data.intro) || '',
      styles: data && Array.isArray(data.styles) ? data.styles : []
    };
  }

  function creditNode(credit) {
    if (!credit || !credit.by) return null;
    const p = el('p', { class: 'credit' });
    const text = credit.license ? `${credit.by}, ${credit.license}` : credit.by;
    if (credit.license) p.append('Photo: ');
    if (credit.source) p.append(el('a', { href: credit.source, target: '_blank', rel: 'noopener', text }));
    else p.append(text);
    return p;
  }

  function placeholder(name) {
    return el('div', { class: 'placeholder', 'aria-hidden': 'true' }, el('span', { text: name }));
  }

  function photoNode(style) {
    if (!style.image) return placeholder(style.name);
    const img = el('img', { alt: style.alt || '', width: 800, height: 600, loading: 'lazy', decoding: 'async' });
    const button = el('button', { type: 'button', class: 'photo', 'aria-label': `Enlarge photo: ${style.alt || style.name}` }, img);
    img.addEventListener('error', () => button.replaceWith(placeholder(style.name)), { once: true });
    img.src = style.image;
    button.addEventListener('click', () => openViewer(style, button));
    return button;
  }

  function cardNode(style) {
    const meta = [style.when, style.where].filter(Boolean).join(' · ');
    const name = style.name || 'Untitled';
    const title = el('h3', { text: name });
    const card = el('article', { class: 'card' },
      photoNode(style),
      el('div', { class: 'card-body' },
        style.demo ? el('div', { class: 'card-title' }, title, el('span', { class: 'badge', text: 'Framework' })) : title,
        meta ? el('p', { class: 'meta', text: meta }) : null,
        style.line ? el('p', { class: 'line', text: style.line }) : null,
        style.demo ? el('p', { class: 'demo' },
          el('a', { href: style.demo, 'aria-label': `View demo of the ${name} framework` },
            'View demo', el('span', { 'aria-hidden': 'true', text: ' →' }))) : null,
        creditNode(style.credit)));
    card.dataset.search = [style.name, style.when, style.where, style.line].join(' ').toLowerCase();
    if (style.demo) card.dataset.demo = '';
    return card;
  }

  // Build the menu and sections.
  const menu = $('#menu');
  const main = $('#main');
  const groups = [];
  const sections = [];
  let total = 0;
  let frameworks = 0;

  for (const group of GROUPS) {
    const list = el('ul');
    const menuGroup = el('div', { class: 'menu-group' }, el('span', { class: 'menu-label', text: group.name }), list);
    const groupTitle = el('p', { class: 'group-title', text: group.name });
    const groupSections = [];
    menu.append(menuGroup);
    main.append(groupTitle);

    for (const id of group.sections) {
      const data = sectionData(id);
      const cards = data.styles.map(cardNode);
      const grid = el('div', { class: 'grid' }, ...cards);
      const note = el('p', { class: 'note', text: cards.length ? 'No matches' : 'Coming soon', hidden: cards.length > 0 });
      const link = el('li', {}, el('a', { href: '#' + id, text: data.title }));
      const section = el('section', { class: 'section', id, 'aria-labelledby': id + '-title' },
        el('h2', { id: id + '-title', text: data.title }),
        data.intro ? el('p', { class: 'section-intro', text: data.intro }) : null,
        grid,
        note);
      list.append(link);
      main.append(section);
      const demos = data.styles.filter((style) => style.demo).length;
      const entry = { section, link, cards, note, demos, off: false };
      sections.push(entry);
      groupSections.push(entry);
      total += cards.length;
      frameworks += demos;
    }
    groups.push({ menuGroup, groupTitle, sections: groupSections });
  }

  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
  $('#count').textContent = `${plural(total, 'style')} in ${plural(sections.length, 'section')}`;

  // Search: every word must appear in the name, when, where or line.
  // "Completed only" keeps the styles with a demo and hides sections (and groups) without one.
  const input = $('#q');
  const matches = $('#matches');
  const completed = $('#completed');

  function filter() {
    const words = input.value.toLowerCase().split(/\s+/).filter(Boolean);
    const only = completed.checked;
    let shown = 0;
    for (const entry of sections) {
      const { cards, note } = entry;
      let count = 0;
      for (const card of cards) {
        const hit = (!only || 'demo' in card.dataset) && words.every((word) => card.dataset.search.includes(word));
        card.hidden = !hit;
        if (hit) count++;
      }
      entry.off = only && entry.demos === 0;
      entry.section.hidden = entry.link.hidden = entry.off;
      if (cards.length) note.hidden = count > 0;
      shown += count;
    }
    for (const group of groups) {
      group.menuGroup.hidden = group.groupTitle.hidden = group.sections.every((entry) => entry.off);
    }
    if (only) matches.textContent = words.length ? `${shown} of ${frameworks}` : plural(frameworks, 'framework');
    else matches.textContent = words.length ? `${shown} ${shown === 1 ? 'match' : 'matches'}` : '';
  }
  input.addEventListener('input', filter);

  // ?sort=completed in the URL turns "Completed only" on, so a shared link opens filtered.
  completed.addEventListener('change', () => {
    const params = new URLSearchParams(location.search);
    if (completed.checked) params.set('sort', 'completed');
    else params.delete('sort');
    const query = params.toString();
    history.replaceState(history.state, '', location.pathname + (query ? '?' + query : '') + location.hash);
    filter();
  });
  completed.checked = new URLSearchParams(location.search).get('sort') === 'completed';
  if (completed.checked) filter();

  // Photo viewer.
  const viewer = $('#viewer');
  const viewerImg = $('#viewer-img');
  let opener = null;

  function openViewer(style, button) {
    opener = button;
    viewerImg.src = style.image;
    viewerImg.alt = style.alt || style.name;
    $('#viewer-caption').textContent = style.alt || style.name;
    const credit = creditNode(style.credit);
    $('#viewer-credit').replaceChildren(...(credit ? [credit] : []));
    viewer.showModal();
  }

  $('#viewer-close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', (event) => {
    if (event.target === viewer) viewer.close(); // a click on the backdrop
  });
  viewer.addEventListener('close', () => {
    viewerImg.removeAttribute('src');
    if (opener && opener.isConnected) opener.focus();
  });

  // Keep section headings clear of the sticky bar when jumping to them.
  const bar = $('#bar');
  const setBarHeight = () => document.documentElement.style.setProperty('--bar-h', bar.offsetHeight + 'px');
  setBarHeight();
  if ('ResizeObserver' in window) new ResizeObserver(setBarHeight).observe(bar);

  // Sections are built after load, so honour a #section link now.
  if (location.hash) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView();
  }
})();
