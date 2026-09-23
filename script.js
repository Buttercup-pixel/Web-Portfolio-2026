(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Counter-scrolling columns ----------
     Left column drifts up 12% faster than the page, right column 12% slower. */
  const colUp = $('#col-up');
  const colDown = $('#col-down');
  const SPEED = 0.12;
  let ticking = false;

  function applyParallax() {
    ticking = false;
    if (reduced) return;
    const y = window.scrollY || window.pageYOffset || 0;
    colUp.style.transform = `translate3d(0, ${(-y * SPEED).toFixed(2)}px, 0)`;
    colDown.style.transform = `translate3d(0, ${(y * SPEED).toFixed(2)}px, 0)`;
  }
  function requestParallax() {
    if (!ticking) { ticking = true; requestAnimationFrame(applyParallax); }
  }
  window.addEventListener('scroll', requestParallax, { passive: true });
  window.addEventListener('resize', requestParallax);
  applyParallax();

  /* ---------- Entry scroll hints ---------- */
  const hints = $('#hints');
  const hintMakeup = $('#hint-makeup');
  const hintDigital = $('#hint-digital');
  let hintsDone = false;
  let startY = window.scrollY || 0;

  function placeHints() {
    if (hintsDone) return;
    const a = $('#makeup-1').getBoundingClientRect();
    const b = $('#digital-1').getBoundingClientRect();
    const w = Math.max(window.innerWidth, 1);
    hintMakeup.style.left = `${((a.left + a.width / 2) / w) * 100}%`;
    hintDigital.style.left = `${((b.left + b.width / 2) / w) * 100}%`;
  }
  function dismissHints() {
    if (hintsDone) return;
    hintsDone = true;
    hints.classList.add('is-leaving');
    setTimeout(() => hints.classList.add('is-fading'), 360);
    setTimeout(() => { hints.hidden = true; }, 820);
    ['wheel', 'touchmove', 'click', 'keydown'].forEach((t) => window.removeEventListener(t, dismissHints));
    window.removeEventListener('scroll', onScrollHints);
  }
  function onScrollHints() {
    if (Math.abs((window.scrollY || 0) - startY) > 1) dismissHints();
  }
  placeHints();
  window.addEventListener('resize', placeHints, { passive: true });
  window.addEventListener('scroll', onScrollHints, { passive: true });
  ['wheel', 'touchmove', 'click'].forEach((t) => window.addEventListener(t, dismissHints, { passive: true }));

  /* ---------- Cursor labels ---------- */
  const labels = { makeup: $('#cursor-makeup'), digital: $('#cursor-digital') };
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  let activeLabel = null;

  function moveLabels(e) {
    const el = activeLabel;
    if (el) el.style.transform = `translate(-50%, -50%) translate(${e.clientX}px, ${e.clientY}px)`;
  }
  function setLabel(cat, e) {
    const next = cat ? labels[cat] : null;
    if (next !== activeLabel) {
      if (activeLabel) activeLabel.classList.remove('is-on');
      activeLabel = next;
      if (next) next.classList.add('is-on');
    }
    if (next && e) moveLabels(e);
  }
  if (finePointer) {
    $$('.item').forEach((item) => {
      item.addEventListener('pointerenter', (e) => setLabel(item.dataset.category, e));
      item.addEventListener('pointermove', (e) => setLabel(item.dataset.category, e));
      item.addEventListener('pointerleave', () => setLabel(null));
    });
    window.addEventListener('scroll', () => { /* keep label attached to pointer position */ }, { passive: true });
  }

  /* ---------- Gallery overlay ----------
     Every grid item opens the overlay. Only "bon" has its own verified
     photos (the real project behind makeup-1); every other item is a
     placeholder gallery that reuses those same supporting photos until
     real project photos are provided, per its own main thumbnail. */
  const overlay = $('#overlay');
  const panel = $('#panel');
  const title = $('#gallery-title');
  const infoBtn = $('#info-btn');
  const details = $('#gallery-details');
  const detailsInner = details.querySelector('.gallery__details-inner');
  const nextBtn = $('#next-btn');
  const mainImg = $('#gallery-main-img');
  const supportingImgs = $$('#gallery-supporting img');
  let lastFocus = null;

  const bonSupporting = [1, 2, 3, 4, 5].map((n) => `assets/images/bon/supporting-${n}.jpg`);

  const galleries = {
    bon: { title: 'BON Magazine', mainSrc: 'assets/images/bon/main.jpg', supporting: bonSupporting },
    wrpd: { title: 'WRPD Magazine', mainSrc: 'assets/images/grid-02.jpg', supporting: bonSupporting },
    vogue: { title: 'Vogue CS', mainSrc: 'assets/images/grid-03.jpg', supporting: bonSupporting },
    metalhead: { title: 'Metalhead Magazine', mainSrc: 'assets/images/grid-04.webp', supporting: bonSupporting },
    studio: { title: 'Studio Editorial', mainSrc: 'assets/images/grid-05.jpg', supporting: bonSupporting },
    reddress: { title: 'Red Editorial', mainSrc: 'assets/images/grid-06.jpg', supporting: bonSupporting },
    personal: { title: 'Personal Project', mainSrc: 'assets/images/grid-07.png', supporting: bonSupporting },
    acte: { title: 'Acté Atelier', mainSrc: 'assets/images/grid-08.svg', supporting: bonSupporting },
    gloves: { title: 'Gloves Editorial', mainSrc: 'assets/images/grid-09.jpg', supporting: bonSupporting },
    mamika: { title: 'Mamika Suzuki', mainSrc: 'assets/images/grid-10.svg', supporting: bonSupporting },
    dramatic: { title: 'Dramatic Editorial', mainSrc: 'assets/images/grid-11.png', supporting: bonSupporting },
  };

  function syncNext() {
    nextBtn.classList.toggle('is-visible', panel.scrollTop > 24);
  }
  function setInfo(open) {
    // Animate to the content's real height rather than a fixed guess —
    // with an eased curve, a target much taller than the content makes
    // the reveal finish almost instantly instead of over the full
    // transition.
    details.style.maxHeight = open ? `${detailsInner.scrollHeight}px` : '0px';
    details.classList.toggle('is-open', open);
    infoBtn.classList.toggle('is-open', open);
    infoBtn.setAttribute('aria-expanded', String(open));
  }

  function openGallery(trigger) {
    const key = trigger && trigger.dataset && trigger.dataset.gallery;
    const data = key && galleries[key];
    if (!data) return;
    title.textContent = data.title;
    mainImg.src = data.mainSrc;
    mainImg.alt = data.title;
    supportingImgs.forEach((img, i) => { img.src = data.supporting[i]; });
    lastFocus = trigger || document.activeElement;
    closeAbout(true);
    setInfo(false);
    overlay.hidden = false;
    panel.scrollTop = 0;
    syncNext();
    setLabel(null);
    panel.focus({ preventScroll: true });
  }
  function closeGallery() {
    if (overlay.hidden) return;
    overlay.hidden = true;
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus({ preventScroll: true });
  }

  panel.tabIndex = -1;
  panel.style.outline = 'none';
  panel.addEventListener('scroll', syncNext, { passive: true });

  $$('.item[data-gallery]').forEach((item) => {
    item.addEventListener('click', () => openGallery(item));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGallery(item); }
    });
  });

  $('#overlay-backdrop').addEventListener('click', closeGallery);

  infoBtn.addEventListener('click', (e) => { e.stopPropagation(); setInfo(!details.classList.contains('is-open')); });
  title.addEventListener('click', (e) => { e.stopPropagation(); setInfo(!details.classList.contains('is-open')); });

  // Click anywhere inside the panel that isn't a photo (or the credits
  // accordion) closes it too.
  panel.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') return;
    closeGallery();
  });

  /* ---------- About overlay ---------- */
  const about = $('#about');
  const aboutPanel = $('#about-panel');
  const aboutBtn = $('#about-btn');

  function openAbout() {
    closeGallery();
    about.hidden = false;
    aboutBtn.setAttribute('aria-expanded', 'true');
    aboutPanel.scrollTop = 0;
    setLabel(null);
    sizeBoard();
    aboutPanel.focus({ preventScroll: true });
  }
  function closeAbout(silent) {
    if (about.hidden) return;
    about.hidden = true;
    aboutBtn.setAttribute('aria-expanded', 'false');
    if (!silent) aboutBtn.focus({ preventScroll: true });
  }
  aboutBtn.addEventListener('click', () => (about.hidden ? openAbout() : closeAbout()));

  // Tap anywhere in the about panel closes it, except on links or the
  // drawing board (so people can actually use those).
  aboutPanel.addEventListener('click', (e) => {
    if (e.target.closest('a, #trace')) return;
    closeAbout();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeGallery(); closeAbout(); }
  });

  /* ---------- "Leave a trace" drawing board ---------- */
  const canvas = $('#trace-canvas');
  const board = $('#trace-board');
  const ctx = canvas.getContext('2d');
  const BOARD_H = 420;
  const STROKE = 'rgb(255, 45, 45)';
  const strokeHistory = [];
  const saved = [];
  let drawing = false;

  function sizeBoard() {
    const w = board.getBoundingClientRect().width;
    if (!w) return;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const pw = Math.max(1, Math.floor(w * dpr));
    const ph = Math.max(1, Math.floor(BOARD_H * dpr));
    if (canvas.width !== pw || canvas.height !== ph) { canvas.width = pw; canvas.height = ph; }
    canvas.style.width = `${w}px`;
    canvas.style.height = `${BOARD_H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3;
    ctx.strokeStyle = STROKE;
  }
  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  canvas.addEventListener('pointerdown', (e) => {
    const { x, y } = pos(e);
    strokeHistory.push(canvas.toDataURL('image/png'));
    canvas.setPointerCapture(e.pointerId);
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!drawing) return;
    const { x, y } = pos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  });
  const endStroke = (e) => {
    if (!drawing) return;
    drawing = false;
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
  };
  ['pointerup', 'pointercancel', 'pointerleave'].forEach((t) => canvas.addEventListener(t, endStroke));

  function clearBoard() {
    const r = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, r.width, BOARD_H);
  }
  function undo() {
    if (!strokeHistory.length) return false;
    const snap = strokeHistory.pop();
    const r = canvas.getBoundingClientRect();
    const img = new Image();
    img.onload = () => { ctx.clearRect(0, 0, r.width, BOARD_H); ctx.drawImage(img, 0, 0, r.width, BOARD_H); };
    img.src = snap;
    return true;
  }
  $('#trace-undo').addEventListener('click', undo);
  $('#trace-clear').addEventListener('click', clearBoard);
  $('#trace-save').addEventListener('click', () => {
    const url = canvas.toDataURL('image/png');
    if (!url) return;
    saved.push(url);
    const img = new Image();
    img.src = url;
    img.alt = `saved drawing ${saved.length}`;
    $('#trace-grid').insertBefore(img, $('#trace-count'));
    $('#trace-count').textContent = `${saved.length} people have left a trace`;
  });
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key.toLowerCase() === 'z' && !about.hidden && undo()) e.preventDefault();
  });
  window.addEventListener('resize', () => { if (!about.hidden) sizeBoard(); });

  /* ---------- Go up (page) ---------- */
  $('#page-goup').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    window.history.replaceState(null, '', location.pathname + location.search);
  });

  /* ---------- Brand name: back to home ---------- */
  $('#brand-btn').addEventListener('click', () => {
    closeGallery();
    closeAbout(true);
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    window.history.replaceState(null, '', location.pathname + location.search);
  });
})();
