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

  /* clock */
  var clock = $('#clock');
  var fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', hour12: false });
  function tick() { if (clock) clock.textContent = fmt.format(new Date()); }
  tick(); setInterval(tick, 20000);

  /* bar */
  var bar = $('.bar');
  function onScroll() { bar.classList.toggle('scrolled', window.scrollY > 20); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* split the statement into words (EN) or characters (ZH) */
  $$('[data-split]').forEach(function (el) {
    var cjk = el.classList.contains('zh');
    var i = 0, frag = document.createDocumentFragment();
    function wrap(node) {
      var w = document.createElement('span'); w.className = 'w';
      var inner = document.createElement('span');
      inner.appendChild(node); w.appendChild(inner);
      w.style.setProperty('--i', i++);
      return w;
    }
    var seg = cjk && window.Intl && Intl.Segmenter ? new Intl.Segmenter('zh', { granularity: 'word' }) : null;
    function cjkParts(text) {
      var raw = seg ? Array.from(seg.segment(text), function (s) { return s.segment; })
        : text.split(/(\s+)/).reduce(function (a, s) { return a.concat(/\s/.test(s) ? [s] : s.split('')); }, []);
      return raw.reduce(function (a, s) {
        if (a.length && /^[，。、；：！？）」』”,.!?;:)]+$/.test(s) && !/^\s+$/.test(a[a.length - 1])) a[a.length - 1] += s;
        else a.push(s);
        return a;
      }, []);
    }
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var parts = cjk ? cjkParts(n.textContent) : n.textContent.split(/(\s+)/);
        parts.forEach(function (p) {
          if (!p) return;
          if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(' '));
          else frag.appendChild(wrap(document.createTextNode(p)));
        });
      } else {
        frag.appendChild(wrap(n.cloneNode(true)));
      }
    });
    var full = el.textContent.replace(/\s+/g, ' ').trim();
    var vis = document.createElement('span'); vis.setAttribute('aria-hidden', 'true'); vis.appendChild(frag);
    var sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = full;
    el.innerHTML = ''; el.appendChild(vis); el.appendChild(sr);
  });
  var intro = $('.intro');
  function ready() { intro.classList.add('ready'); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { requestAnimationFrame(ready); });
  else window.addEventListener('load', ready);
  setTimeout(ready, 1200);

  /* reveal */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('.r').forEach(function (el) { io.observe(el); });

  /* side nav active */
  var links = $$('.side-nav a');
  var sio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); });
    });
  }, { rootMargin: '-35% 0px -60% 0px' });
  $$('.block').forEach(function (s) { sio.observe(s); });

  /* project preview follows the cursor */
  var preview = $('.preview'), pin = $('.preview-in');
  if (finePointer && preview) {
    var tx = 0, ty = 0, x = 0, y = 0, raf = 0, active = false;
    function loop() {
      x += (tx - x) * 0.14; y += (ty - y) * 0.14;
      preview.style.transform = 'translate3d(' + (x + 24) + 'px,' + (y - 110) + 'px,0)';
      if (active || Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5) raf = requestAnimationFrame(loop); else raf = 0;
    }
    function lang() { return root.getAttribute('data-lang'); }
    $$('.work').forEach(function (w) {
      w.addEventListener('mouseenter', function (e) {
        if (w.getAttribute('data-preview') === 'img') {
          pin.innerHTML = '<img src="' + w.getAttribute('data-src') + '" alt="">';
        } else {
          var sub = lang() === 'zh' ? w.getAttribute('data-sub-zh') : w.getAttribute('data-sub-en');
          pin.innerHTML = '<div class="preview-tile"><span>' + sub + '</span><b>' + w.getAttribute('data-tile') + '</b></div>';
        }
        if (!active) { x = tx = e.clientX; y = ty = e.clientY; }
        active = true; preview.classList.add('show');
        if (!raf) raf = requestAnimationFrame(loop);
      });
      w.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; });
      w.addEventListener('mouseleave', function () { active = false; preview.classList.remove('show'); });
    });
  }

  /* covers marquee: duplicate for a seamless loop */
  var track = $('.covers-track');
  if (track && !reduce) {
    $$('img', track).forEach(function (img) { var c = img.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.alt = ''; track.appendChild(c); });
  }

  /* magnetic button */
  if (finePointer && !reduce) {
    $$('.magnetic').forEach(function (m) {
      var inner = m.firstElementChild;
      m.addEventListener('mousemove', function (e) {
        var r = m.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        m.style.transform = 'translate(' + dx * 0.22 + 'px,' + dy * 0.32 + 'px)';
        if (inner) inner.style.transform = 'translate(' + dx * 0.1 + 'px,' + dy * 0.12 + 'px)';
      });
      m.addEventListener('mouseleave', function () {
        m.style.transition = 'transform .6s cubic-bezier(.19,1,.22,1), background .35s, color .35s, border-color .35s';
        m.style.transform = ''; if (inner) { inner.style.transition = 'transform .6s cubic-bezier(.19,1,.22,1)'; inner.style.transform = ''; }
        setTimeout(function () { m.style.transition = ''; if (inner) inner.style.transition = ''; }, 600);
      });
    });
  }
})();
