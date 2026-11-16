(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* language */
  function setLang(l) {
    root.setAttribute('data-lang', l);
    root.lang = l === 'zh' ? 'zh-CN' : 'en';
    document.title = root.getAttribute('data-title-' + l) || (l === 'zh' ? '苑泽楷 · Zekai Yuan' : 'Zekai Yuan · 苑泽楷');
    $$('[data-lang-btn]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang-btn') === l)); });
    try { localStorage.setItem('lang', l); } catch (e) {}
  }
  setLang(root.getAttribute('data-lang') === 'zh' ? 'zh' : 'en');
  $$('[data-lang-btn]').forEach(function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-lang-btn')); }); });

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

  /* grow bar charts when they scroll into view */
  var bars = $$('.bars');
  if (bars.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      bars.forEach(function (b) { b.classList.add('in'); });
    } else {
      var bio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); bio.unobserve(e.target); } });
      }, { threshold: 0.3 });
      bars.forEach(function (b) { bio.observe(b); });
    }
  }
})();
