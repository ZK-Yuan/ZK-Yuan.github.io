(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* language */
  function setLang(l) {
    root.setAttribute('data-lang', l);
    root.lang = l === 'zh' ? 'zh-CN' : 'en';
    document.title = l === 'zh' ? '苑泽楷 · Zekai Yuan' : 'Zekai Yuan · 苑泽楷';
    $$('[data-lang-btn]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang-btn') === l)); });
    try { localStorage.setItem('lang', l); } catch (e) {}
  }
  setLang(root.getAttribute('data-lang') === 'zh' ? 'zh' : 'en');
  $$('[data-lang-btn]').forEach(function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-lang-btn')); }); });

  /* preloader, then hero entrance */
  var hero = $('.hero');
  var loader = $('.loader');
  function heroIn() { hero.classList.add('in'); }
  if (loader && !root.classList.contains('skip-loader')) {
    var zh = root.getAttribute('data-lang') === 'zh';
    var words = zh
      ? ['你好', 'Hello', 'Bonjour', 'Hola', 'Ciao', 'こんにちは', '안녕하세요', 'Hallo', '你好']
      : ['Hello', '你好', 'Bonjour', 'Hola', 'Ciao', 'こんにちは', '안녕하세요', 'Hallo', 'Hello'];
    var word = $('.loader-word > span');
    var i = 0;
    var prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    word.textContent = words[0];
    var next = function () {
      i += 1;
      if (i < words.length) {
        word.textContent = words[i];
        setTimeout(next, i === words.length - 1 ? 520 : 135);
        return;
      }
      loader.classList.add('done');
      document.body.style.overflow = prevOverflow;
      setTimeout(heroIn, 280);
      setTimeout(function () { loader.remove(); }, 1100);
      try { sessionStorage.setItem('seen', '1'); } catch (e) {}
    };
    setTimeout(next, 900);
  } else {
    if (loader) loader.remove();
    requestAnimationFrame(function () { requestAnimationFrame(heroIn); });
  }

  /* hero name marquee: drifts left, reverses when scrolling up */
  var track = $('.hero-track');
  if (track && !reduce) {
    var x = 0, dir = -1, boost = 0, w = 0, last = 0, lastY = window.scrollY, visible = true, raf = 0;
    var measure = function () { w = track.firstElementChild.getBoundingClientRect().width; };
    measure();
    window.addEventListener('resize', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    window.addEventListener('scroll', function () {
      var y = window.scrollY, dy = y - lastY;
      if (dy > 0) dir = -1; else if (dy < 0) dir = 1;
      boost = Math.min(boost + Math.abs(dy) * 0.08, 6);
      lastY = y;
    }, { passive: true });
    var frame = function (t) {
      var dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
      last = t;
      if (w) {
        x += dir * (w / 32) * (1 + boost) * dt;
        boost *= 0.92;
        if (x <= -w) x += w;
        if (x > 0) x -= w;
        track.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
      }
      raf = visible ? requestAnimationFrame(frame) : 0;
    };
    new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      if (visible && !raf) { last = 0; raf = requestAnimationFrame(frame); }
    }).observe(hero);
  }

  /* side nav: highlight the section in view */
  var navLinks = $$('.side-nav a');
  var sections = navLinks.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
  function setActive(id) { navLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + id); }); }
  if (sections.length) {
    var updateNav = function () {
      var probe = window.innerHeight * 0.35, current = sections[0].id;
      sections.forEach(function (s) { if (s.getBoundingClientRect().top <= probe) current = s.id; });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = sections[sections.length - 1].id;
      setActive(current);
    };
    window.addEventListener('scroll', updateNav, { passive: true });
    window.addEventListener('resize', updateNav);
    updateNav();
  }

  /* spotlight that follows the cursor over the résumé */
  var page = $('.page');
  if (page && finePointer) {
    var cx = -1000, cy = -1000;
    var paint = function () {
      var r = page.getBoundingClientRect();
      page.style.setProperty('--sx', (cx - r.left) + 'px');
      page.style.setProperty('--sy', (cy - r.top) + 'px');
    };
    window.addEventListener('pointermove', function (e) { cx = e.clientX; cy = e.clientY; paint(); }, { passive: true });
    window.addEventListener('scroll', paint, { passive: true });
  }
})();
