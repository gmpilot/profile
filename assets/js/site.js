(() => {
  const root = document.documentElement;
  const storedTheme = localStorage.getItem('gm-theme');
  root.dataset.theme = storedTheme === 'dark' ? 'dark' : 'light';

  const pages = [
    ['index.html', 'Home'],
    ['research.html', 'Research'],
    ['publications.html', 'Publications'],
    ['projects.html', 'Projects'],
    ['services.html', 'Services'],
    ['experience.html', 'Experience'],
    ['gallery.html', 'Gallery']
  ];

  const path = location.pathname.split('/').pop() || 'index.html';
  const current = pages.some(([href]) => href === path) ? path : 'index.html';
  const navLinks = pages.map(([href, label]) =>
    `<a href="${href}" ${href === current ? 'aria-current="page"' : ''}>${label}</a>`
  ).join('');

  const header = document.querySelector('[data-site-header]');
  if (header) {
    header.className = 'site-header';
    header.innerHTML = `
      <div class="container nav-shell">
        <a class="brand" href="index.html" aria-label="Golam Mahadi home">
          <span class="brand-mark">GM</span>
          <span class="brand-text">Golam Mahadi<small>Research · Engineering</small></span>
        </a>
        <nav class="main-nav" id="main-nav" aria-label="Primary navigation">${navLinks}</nav>
        <div class="nav-actions">
          <button class="icon-button command-trigger" type="button" aria-label="Open quick navigation" title="Quick navigation (⌘K)">⌘</button>
          <button class="icon-button theme-toggle" type="button" aria-label="Switch to dark mode" title="Change colour mode"><span aria-hidden="true">◐</span></button>
          <a class="hire-button" href="contact.html"><i></i> Available for work</a>
          <button class="menu-button" type="button" aria-controls="main-nav" aria-expanded="false" aria-label="Open menu"><span>☰</span></button>
        </div>
      </div>`;
  }

  const footer = document.querySelector('[data-site-footer]');
  if (footer) {
    footer.className = 'site-footer';
    footer.innerHTML = `
      <div class="container">
        <div class="footer-top">
          <div class="footer-intro">
            <p class="eyebrow">Research, engineering & collaboration</p>
            <p class="footer-title">Let’s turn a difficult idea into useful work.</p>
            <a class="text-link" href="mailto:golammahadi13@gmail.com">Email Now <span>↗</span></a>
          </div>
          <div class="footer-col">
            <h3>Explore</h3>
            <a href="research.html">Research</a>
            <a href="publications.html">Publications</a>
            <a href="projects.html">Projects</a>
            <a href="services.html">Services</a>
          </div>
          <div class="footer-col">
            <h3>Connect</h3>
            <a href="https://www.researchgate.net/profile/Golam-Mahadi" target="_blank" rel="noopener">ResearchGate ↗</a>
            <a href="https://www.linkedin.com/in/gmpilot13" target="_blank" rel="noopener">LinkedIn ↗</a>
            <a href="https://github.com/gmpilot" target="_blank" rel="noopener">GitHub ↗</a>
            <a href="contact.html">Contact</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} Golam Mahadi. Built for clarity, speed and discovery.</span>
          <span>Dalian, China · UTC+8</span>
        </div>
      </div>`;
  }

  document.body.insertAdjacentHTML('beforeend', `
    <div class="command-palette" role="dialog" aria-modal="true" aria-label="Quick navigation" aria-hidden="true">
      <div class="command-box">
        <input type="search" placeholder="Go to a page…" aria-label="Filter navigation">
        <div class="command-links">
          ${pages.map(([href, label]) => `<a href="${href}" data-search="${label.toLowerCase()}"><span>${label}</span><small>↵</small></a>`).join('')}
          <a href="contact.html" data-search="contact hire freelance"><span>Hire / Contact</span><small>↵</small></a>
          <a href="assets/Golam-Mahadi-CV.pdf" data-search="cv resume curriculum vitae" target="_blank"><span>Download CV</span><small>PDF ↗</small></a>
        </div>
      </div>
    </div>`);

  const headerEl = document.querySelector('.site-header');
  const progress = document.querySelector('.site-progress');
  const onScroll = () => {
    headerEl?.classList.toggle('is-scrolled', scrollY > 12);
    if (progress) {
      const total = document.documentElement.scrollHeight - innerHeight;
      progress.style.setProperty('--scroll', `${total > 0 ? (scrollY / total) * 100 : 0}%`);
    }
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const themeButton = document.querySelector('.theme-toggle');
  const syncThemeLabel = () => {
    if (themeButton) themeButton.setAttribute('aria-label', root.dataset.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  };
  syncThemeLabel();
  themeButton?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('gm-theme', root.dataset.theme);
    syncThemeLabel();
  });

  const menuButton = document.querySelector('.menu-button');
  const nav = document.querySelector('.main-nav');
  menuButton?.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.querySelector('span').textContent = open ? '×' : '☰';
  });
  nav?.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });

  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .08, rootMargin: '0px 0px -35px' });
  reveals.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index % 4, 3) * 65}ms`;
    revealObserver.observe(el);
  });

  const palette = document.querySelector('.command-palette');
  const commandInput = palette.querySelector('input');
  const commandLinks = [...palette.querySelectorAll('.command-links a')];
  const openPalette = () => {
    palette.classList.add('is-open');
    palette.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => commandInput.focus());
  };
  const closePalette = () => {
    palette.classList.remove('is-open');
    palette.setAttribute('aria-hidden', 'true');
    commandInput.value = '';
    commandLinks.forEach(link => { link.hidden = false; link.classList.remove('is-selected'); });
  };
  document.querySelector('.command-trigger')?.addEventListener('click', openPalette);
  palette.addEventListener('click', event => { if (event.target === palette) closePalette(); });
  addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      palette.classList.contains('is-open') ? closePalette() : openPalette();
    }
    if (event.key === 'Escape') closePalette();
  });
  commandInput.addEventListener('input', () => {
    const query = commandInput.value.toLowerCase().trim();
    let first = null;
    commandLinks.forEach(link => {
      link.hidden = !link.dataset.search.includes(query) && !link.textContent.toLowerCase().includes(query);
      link.classList.remove('is-selected');
      if (!link.hidden && !first) first = link;
    });
    first?.classList.add('is-selected');
  });
  commandInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      const selected = commandLinks.find(link => link.classList.contains('is-selected')) || commandLinks.find(link => !link.hidden);
      selected?.click();
    }
  });

  document.querySelectorAll('[data-filter-group]').forEach(group => {
    const targetSelector = group.dataset.filterGroup;
    const targets = [...document.querySelectorAll(targetSelector)];
    group.querySelectorAll('[data-filter]').forEach(button => {
      button.addEventListener('click', () => {
        group.querySelectorAll('[data-filter]').forEach(btn => btn.classList.remove('is-active'));
        button.classList.add('is-active');
        const filter = button.dataset.filter;
        targets.forEach(target => target.classList.toggle('is-hidden', filter !== 'all' && target.dataset.category !== filter));
      });
    });
  });

  const publicationSearch = document.querySelector('[data-publication-search]');
  publicationSearch?.addEventListener('input', () => {
    const query = publicationSearch.value.toLowerCase().trim();
    document.querySelectorAll('.publication-card').forEach(card => {
      card.classList.toggle('is-hidden', !card.textContent.toLowerCase().includes(query));
    });
  });

  document.querySelectorAll('[data-copy-citation]').forEach(button => {
    button.addEventListener('click', async () => {
      await navigator.clipboard.writeText(button.dataset.copyCitation);
      const original = button.textContent;
      button.textContent = 'Copied ✓';
      setTimeout(() => { button.textContent = original; }, 1600);
    });
  });

  const lightboxItems = document.querySelectorAll('[data-lightbox-src]');
  if (lightboxItems.length) {
    document.body.insertAdjacentHTML('beforeend', '<div class="lightbox" role="dialog" aria-modal="true" aria-label="Image preview" aria-hidden="true"><button class="lightbox-close" type="button" aria-label="Close preview">×</button><div><img alt=""><p class="lightbox-caption"></p></div></div>');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImage = lightbox.querySelector('img');
    const caption = lightbox.querySelector('.lightbox-caption');
    const close = () => { lightbox.classList.remove('is-open'); lightbox.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };
    lightboxItems.forEach(item => item.addEventListener('click', () => {
      lightboxImage.src = item.dataset.lightboxSrc;
      lightboxImage.alt = item.querySelector('img')?.alt || '';
      caption.textContent = item.dataset.caption || '';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }));
    lightbox.querySelector('.lightbox-close').addEventListener('click', close);
    lightbox.addEventListener('click', event => { if (event.target === lightbox) close(); });
    addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
  }

  const contactForm = document.querySelector('[data-contact-form]');
  contactForm?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const subject = encodeURIComponent(`${data.get('service')} enquiry from ${data.get('name')}`);
    const body = encodeURIComponent(`Hello Golam,\n\n${data.get('message')}\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nProject type: ${data.get('service')}\nBudget / scope: ${data.get('budget') || 'Not specified'}`);
    location.href = `mailto:golammahadi13@gmail.com?subject=${subject}&body=${body}`;
  });

  document.body.classList.add('page-enter');
})();
