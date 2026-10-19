(() => {
  const reader = document.querySelector('.resume-reader');
  if (!reader) return;
  const content = reader.querySelector('.resume-content');
  const links = [...reader.querySelectorAll('.resume-navigation a')];
  const chapters = [...reader.querySelectorAll('.resume-chapter')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function setActive(id) {
    links.forEach(link => {
      if (link.hash === `#${id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  links.forEach(link => link.addEventListener('click', event => {
    const target = chapters.find(chapter => `#${chapter.id}` === link.hash);
    if (!target) return;
    event.preventDefault();
    content.scrollTo({
      top: content.scrollTop + target.getBoundingClientRect().top - content.getBoundingClientRect().top - 24,
      behavior: reducedMotion.matches ? 'instant' : 'smooth',
    });
    target.querySelector('h3').focus({preventScroll: true});
    setActive(target.id);
  }));
  let scheduled = false;
  content.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      const top = content.getBoundingClientRect().top + 70;
      const visible = chapters.filter(chapter => chapter.getBoundingClientRect().top <= top);
      const atEnd = content.scrollHeight - content.scrollTop - content.clientHeight < 4;
      setActive(atEnd ? chapters.at(-1).id : (visible.at(-1) || chapters[0]).id);
      scheduled = false;
    });
  }, {passive: true});
})();
