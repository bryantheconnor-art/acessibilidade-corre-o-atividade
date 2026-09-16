<script>
  const root = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');
  const skipLink = document.querySelector('.skip-link');
  const mainContent = document.getElementById('conteudo');

  if (skipLink && mainContent) {
    skipLink.addEventListener('click', (event) => {
      event.preventDefault();
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    root.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.textContent = isDark ? 'Tema claro' : 'Tema escuro';
      themeToggle.setAttribute('aria-pressed', String(isDark));
    }
    localStorage.setItem('harmonia-theme', theme);
  }

  const savedTheme = localStorage.getItem('harmonia-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

  themeToggle?.addEventListener('click', () => {
    const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });

  const slides = Array.from(document.querySelectorAll('.slide'));
  const carrosselButtons = Array.from(document.querySelectorAll('.carrossel-btn'));
  let currentSlide = 0;

  function showSlide(index) {
    if (!slides.length) return;
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === currentSlide);
    });
  }

  carrosselButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const direction = button.dataset.direction === 'prev' ? -1 : 1;
      showSlide(currentSlide + direction);
    });
  });

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!reducedMotionQuery.matches) {
    setInterval(() => {
      showSlide(currentSlide + 1);
    }, 5000);
  }
</script>