(() => {
  const toggle = document.querySelector('.theme-toggle');
  const updateLabel = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    toggle.textContent = dark ? '☀' : '☾';
    toggle.setAttribute('aria-label', dark ? '切换浅色模式' : '切换深色模式');
  };
  toggle.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('theme', theme); } catch {}
    updateLabel();
  });
  updateLabel();
  const tocLinks = [...document.querySelectorAll('.case-toc a')];
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting);
    if (!visible.length) return;
    const id = visible[0].target.id;
    tocLinks.forEach(link => link.setAttribute('aria-current', String(link.hash === '#' + id)));
  }, {rootMargin:'-80px 0px -55% 0px',threshold:0});
  document.querySelectorAll('.case-section[id]').forEach(section => observer.observe(section));
  const dialog = document.querySelector('.zoom-dialog');
  let sourceLink;
  let previousOverflow = '';
  document.querySelectorAll('[data-zoom]').forEach(link => link.addEventListener('click', event => {
    if (typeof dialog.showModal !== 'function' || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    sourceLink = link;
    const img = link.querySelector('img');
    dialog.querySelector('img').src = link.href;
    dialog.querySelector('img').alt = img.alt;
    dialog.querySelector('p').textContent = img.alt;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
  }));
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    sourceLink?.focus({preventScroll:true});
  });
  const states = {
    stable: 'AB 顺序选择回答 A；BA 顺序仍选择回答 A → 映射后结论一致，可进入汇总。',
    conflict: 'AB 顺序选择回答 A；BA 顺序选择回答 B → 偏好随位置改变，标记为低置信并转入复核。',
    tie: '两种顺序都判为平局 → 继续结合人工非平样本检查 False Tie，不能仅凭稳定就认定判断正确。'
  };
  document.querySelectorAll('[data-demo-state]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-demo-state]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelector('#swap-result').textContent = states[button.dataset.demoState];
  }));
})();
