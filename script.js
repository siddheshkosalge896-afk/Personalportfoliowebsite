/* ================= LOADING SCREEN ================= */

function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  window.addEventListener('load', function () {
    setTimeout(function () {
      loader.classList.add('hidden');
    }, 400);
  });

  // Fallback in case load event already fired or is delayed
  setTimeout(function () {
    loader.classList.add('hidden');
  }, 2500);
}


/* ================= RECOMMENDATIONS ================= */

function addRecommendation() {

  let recommendation = document.getElementById("new_recommendation");
  let nameField = document.getElementById("rec_name");

  if (recommendation.value != null && recommendation.value.trim() != "") {

    let displayName = (nameField && nameField.value.trim() != "")
      ? nameField.value.trim()
      : "Anonymous";

    showPopup(true, "Thank you for leaving a recommendation!");

    var element = document.createElement("div");
    element.setAttribute("class", "recommendation");

    element.innerHTML =
      "<span>&#8220;</span>" +
      recommendation.value +
      "<span>&#8221;</span>" +
      "<p style='text-align:right; margin:10px 0 0; font-style:normal; font-weight:600; color:var(--purple);'>- " + displayName + "</p>";

    document.getElementById("all_recommendations").appendChild(element);

    recommendation.value = "";
    if (nameField) nameField.value = "";
  }
}

function showPopup(bool, message) {
  const popup = document.getElementById('popup');
  const popupText = document.getElementById('popup_text');

  if (bool) {
    if (message && popupText) popupText.textContent = message;
    popup.style.visibility = 'visible';
  } else {
    popup.style.visibility = 'hidden';
  }
}


/* ================= DARK MODE ================= */

function initTheme() {
  const toggleBtn = document.getElementById('theme_toggle');
  const icon = document.getElementById('theme_icon');
  const savedTheme = localStorage.getItem('portfolio_theme');

  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (icon) icon.textContent = '☀️';
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('portfolio_theme', 'light');
        if (icon) icon.textContent = '🌙';
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('portfolio_theme', 'dark');
        if (icon) icon.textContent = '☀️';
      }
    });
  }
}


/* ================= TYPING ANIMATION ================= */

function initTypingAnimation() {
  const target = document.getElementById('typed_text');
  if (!target) return;

  const roles = [
    "Web Development Student",
    "Aspiring Software Developer",
    "Frontend Enthusiast",
    "Problem Solver"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const currentRole = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      target.textContent = currentRole.substring(0, charIndex);

      if (charIndex === currentRole.length) {
        deleting = true;
        setTimeout(tick, 1400);
        return;
      }
    } else {
      charIndex--;
      target.textContent = currentRole.substring(0, charIndex);

      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    setTimeout(tick, deleting ? 50 : 90);
  }

  tick();
}


/* ================= STATS COUNTER (animate on scroll) ================= */

function initStatsCounter() {
  const statBoxes = document.querySelectorAll('.stat_box h3');
  if (statBoxes.length === 0) return;

  let animated = false;

  function animateCounters() {
    if (animated) return;
    animated = true;

    statBoxes.forEach(function (box) {
      const target = parseInt(box.getAttribute('data-count'), 10) || 0;
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 30));

      const interval = setInterval(function () {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        box.textContent = current;
      }, 40);
    });
  }

  const statsRow = document.querySelector('.stats_row');
  if (!statsRow) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounters();
      }
    });
  }, { threshold: 0.4 });

  observer.observe(statsRow);
}


/* ================= SKILL BARS (animate on scroll) ================= */

function initSkillBars() {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  let animated = false;

  function fillBars() {
    if (animated) return;
    animated = true;

    document.querySelectorAll('.skill_fill').forEach(function (bar) {
      const width = bar.style.width;
      bar.style.width = '0';
      requestAnimationFrame(function () {
        bar.style.width = width;
      });
    });
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        fillBars();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(skillsSection);
}


/* ================= CONTACT FORM (mailto + live validation) ================= */

function initContactForm() {
  const form = document.getElementById('contact_form');
  if (!form) return;

  const recipientEmail = 'siddheshkosalge896@gmail.com';

  const fields = {
    name: {
      input: document.getElementById('cf_name'),
      error: document.getElementById('err_name'),
      validate: function (val) {
        if (val.trim().length === 0) return 'Please enter your name.';
        if (val.trim().length < 2) return 'Name must be at least 2 characters.';
        return '';
      }
    },
    email: {
      input: document.getElementById('cf_email'),
      error: document.getElementById('err_email'),
      validate: function (val) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (val.trim().length === 0) return 'Please enter your email.';
        if (!emailPattern.test(val.trim())) return 'Please enter a valid email address.';
        return '';
      }
    },
    message: {
      input: document.getElementById('cf_message'),
      error: document.getElementById('err_message'),
      validate: function (val) {
        if (val.trim().length === 0) return 'Please enter a message.';
        if (val.trim().length < 10) return 'Message should be at least 10 characters.';
        return '';
      }
    }
  };

  function validateField(key) {
    const field = fields[key];
    if (!field.input) return true;

    const errorMsg = field.validate(field.input.value);
    const wrapper = field.input.closest('.form_field');

    if (errorMsg) {
      field.error.textContent = errorMsg;
      wrapper.classList.add('invalid');
      wrapper.classList.remove('valid');
      return false;
    } else {
      field.error.textContent = '';
      wrapper.classList.remove('invalid');
      wrapper.classList.add('valid');
      return true;
    }
  }

  Object.keys(fields).forEach(function (key) {
    const field = fields[key];
    if (!field.input) return;

    // Validate live as the user types, but don't show "invalid" until they've interacted
    field.input.addEventListener('input', function () {
      const wrapper = field.input.closest('.form_field');
      if (wrapper.classList.contains('invalid') || wrapper.classList.contains('valid')) {
        validateField(key);
      }
    });

    field.input.addEventListener('blur', function () {
      validateField(key);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const allValid = Object.keys(fields).every(validateField);
    if (!allValid) {
      showToast('Please fix the highlighted fields.');
      return;
    }

    const name = fields.name.input.value.trim();
    const email = fields.email.input.value.trim();
    const message = fields.message.input.value.trim();

    const subject = encodeURIComponent('Portfolio Contact from ' + (name || 'Website Visitor'));
    const body = encodeURIComponent(
      'Name: ' + name + '\n' +
      'Email: ' + email + '\n\n' +
      message
    );

    const mailtoUrl = 'mailto:' + recipientEmail + '?subject=' + subject + '&body=' + body;

    showToast("Opening your email app...");
    window.location.href = mailtoUrl;

    setTimeout(function () {
      form.reset();
      Object.keys(fields).forEach(function (key) {
        const wrapper = fields[key].input.closest('.form_field');
        wrapper.classList.remove('valid', 'invalid');
        fields[key].error.textContent = '';
      });
    }, 600);
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(function () {
    toast.classList.remove('show');
  }, 3500);
}


/* ================= VISITOR COUNTER ================= */

function initVisitorCounter() {
  const el = document.getElementById('visitor_count');
  if (!el) return;

  let count = parseInt(localStorage.getItem('portfolio_visits') || '0', 10);
  count += 1;
  localStorage.setItem('portfolio_visits', count);

  el.textContent = '👁 ' + count + ' visit' + (count === 1 ? '' : 's') + ' (this browser)';
}


/* ================= CASE STUDY TOGGLE ================= */

function initCaseStudyToggles() {
  document.querySelectorAll('.case-study-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const caseStudy = btn.closest('.project-card').querySelector('.case-study');
      if (!caseStudy) return;

      const isOpen = caseStudy.classList.contains('open');
      caseStudy.classList.toggle('open');
      btn.textContent = isOpen ? 'View Case Study ▾' : 'Hide Case Study ▴';
    });
  });
}


/* ================= TESTIMONIAL CAROUSEL ================= */

function initCarousel() {
  const track = document.getElementById('all_recommendations');
  const prevBtn = document.getElementById('carousel_prev');
  const nextBtn = document.getElementById('carousel_next');
  const dotsWrap = document.getElementById('carousel_dots');

  if (!track || !prevBtn || !nextBtn || !dotsWrap) return;

  let index = 0;
  let autoTimer = null;

  function getSlides() {
    return track.querySelectorAll('.recommendation');
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    const slides = getSlides();
    slides.forEach(function (_, i) {
      const dot = document.createElement('span');
      dot.classList.add('carousel_dot');
      if (i === index) dot.classList.add('active');
      dot.addEventListener('click', function () {
        goTo(i);
        restartAuto();
      });
      dotsWrap.appendChild(dot);
    });
  }

  function update() {
    const slides = getSlides();
    if (slides.length === 0) return;
    track.style.transform = 'translateX(-' + (index * 100) + '%)';

    dotsWrap.querySelectorAll('.carousel_dot').forEach(function (dot, i) {
      dot.classList.toggle('active', i === index);
    });
  }

  function goTo(i) {
    const slides = getSlides();
    const max = slides.length - 1;
    if (i < 0) i = max;
    if (i > max) i = 0;
    index = i;
    update();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function restartAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(next, 5000);
  }

  prevBtn.addEventListener('click', function () { prev(); restartAuto(); });
  nextBtn.addEventListener('click', function () { next(); restartAuto(); });

  // Rebuild dots whenever a new recommendation is added
  const observer = new MutationObserver(function () {
    buildDots();
    update();
  });
  observer.observe(track, { childList: true });

  buildDots();
  update();
  restartAuto();
}


/* ================= SCROLL PROGRESS BAR ================= */

function initScrollProgress() {
  const bar = document.getElementById('scroll_progress_bar');
  if (!bar) return;

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = percent + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}


/* ================= HERO PARTICLE BACKGROUND ================= */

function initHeroParticles() {
  const canvas = document.getElementById('hero_particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const section = canvas.closest('section');
  let particles = [];
  let animationId = null;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }

  function createParticles() {
    const count = Math.floor((canvas.width * canvas.height) / 18000);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3
      });
    }
  }

  function getParticleColor() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark ? 'rgba(183, 102, 255, 0.5)' : 'rgba(118, 0, 188, 0.25)';
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const color = getParticleColor();

    particles.forEach(function (p) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });

    animationId = requestAnimationFrame(draw);
  }

  resize();
  createParticles();

  if (!prefersReducedMotion) {
    draw();
  } else {
    // Draw a single static frame for reduced motion
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const color = getParticleColor();
    particles.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });
  }

  window.addEventListener('resize', function () {
    resize();
    createParticles();
  });
}


/* ================= SOCIAL SHARE ================= */

function initSocialShare() {
  const buttons = document.querySelectorAll('.share_btn');
  if (buttons.length === 0) return;

  const pageUrl = window.location.href;
  const pageTitle = "Check out Siddhesh Kosalge's developer portfolio";

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const platform = btn.getAttribute('data-platform');
      let shareUrl = '';

      if (platform === 'linkedin') {
        shareUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(pageUrl);
      } else if (platform === 'twitter') {
        shareUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(pageTitle) + '&url=' + encodeURIComponent(pageUrl);
      } else if (platform === 'whatsapp') {
        shareUrl = 'https://wa.me/?text=' + encodeURIComponent(pageTitle + ' ' + pageUrl);
      } else if (platform === 'copy') {
        navigator.clipboard.writeText(pageUrl).then(function () {
          showToast('Link copied to clipboard!');
        }).catch(function () {
          showToast('Could not copy link.');
        });
        return;
      }

      if (shareUrl) {
        window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
      }
    });
  });
}


/* ================= PRINT RESUME VIEW ================= */

function initPrintResume() {
  const btn = document.getElementById('print_resume_btn');
  if (!btn) return;

  btn.addEventListener('click', function () {
    window.print();
  });
}


/* ================= IMAGE LIGHTBOX ================= */

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox_img');
  const lightboxCaption = document.getElementById('lightbox_caption');
  const closeBtn = document.getElementById('lightbox_close');

  if (!lightbox || !lightboxImg || !closeBtn) return;

  const triggers = document.querySelectorAll('[data-lightbox-trigger]');

  function openLightbox(imgSrc, imgAlt, caption) {
    lightboxImg.setAttribute('src', imgSrc);
    lightboxImg.setAttribute('alt', imgAlt || '');
    lightboxCaption.textContent = caption || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      const img = trigger.querySelector('img');
      if (!img) return;
      openLightbox(img.getAttribute('src'), img.getAttribute('alt'), trigger.getAttribute('data-caption'));
    });
  });

  closeBtn.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
}


/* ================= TILT EFFECT ================= */

function initTiltEffect() {
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.tilt_card');
  if (cards.length === 0) return;

  const maxTilt = 8;

  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const percentX = (x / rect.width) - 0.5;
      const percentY = (y / rect.height) - 0.5;

      const rotateX = (-percentY * maxTilt).toFixed(2);
      const rotateY = (percentX * maxTilt).toFixed(2);

      card.style.transform = 'perspective(700px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });
}


/* ================= PROJECT FILTER BAR ================= */

function initProjectFilter() {
  const chips = document.querySelectorAll('.filter_chip');
  const cards = document.querySelectorAll('.project-card');
  const emptyState = document.getElementById('filter_empty_state');

  if (chips.length === 0 || cards.length === 0) return;

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');

      const filter = chip.getAttribute('data-filter');
      let visibleCount = 0;

      cards.forEach(function (card) {
        const tags = (card.getAttribute('data-tags') || '').split(' ');
        const matches = filter === 'all' || tags.indexOf(filter) !== -1;
        card.classList.toggle('filtered_out', !matches);
        if (matches) visibleCount++;
      });

      if (emptyState) emptyState.classList.toggle('visible', visibleCount === 0);
    });
  });
}


/* ================= SKILLS RADAR CHART ================= */

function initSkillsRadar() {
  const cardsBtn = document.getElementById('skills_view_cards');
  const radarBtn = document.getElementById('skills_view_radar');
  const cardsView = document.getElementById('skills_cards_view');
  const radarView = document.getElementById('skills_radar_view');
  const canvas = document.getElementById('skills_radar_canvas');

  if (!cardsBtn || !radarBtn || !cardsView || !radarView || !canvas) return;

  const skills = [
    { label: 'HTML', value: 90 },
    { label: 'CSS', value: 85 },
    { label: 'JavaScript', value: 80 },
    { label: 'Java', value: 75 },
    { label: 'React', value: 65 },
    { label: 'Node.js', value: 60 }
  ];

  let drawn = false;
  let progress = 0;
  let animFrame = null;

  function getColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      grid: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(40,20,70,0.12)',
      label: isDark ? '#cac6d6' : '#524d5e',
      fill: isDark ? 'rgba(168, 85, 247, 0.35)' : 'rgba(109, 40, 217, 0.28)',
      stroke: isDark ? '#c084fc' : '#6d28d9',
      point: isDark ? '#f3f1f8' : '#ffffff'
    };
  }

  function draw(animProgress) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = Math.min(canvas.parentElement.clientWidth - 20, 480);

    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.34;
    const sides = skills.length;
    const colors = getColors();

    ctx.clearRect(0, 0, size, size);

    // Grid rings
    const rings = 4;
    for (let r = 1; r <= rings; r++) {
      ctx.beginPath();
      for (let i = 0; i <= sides; i++) {
        const angle = (Math.PI * 2 * i / sides) - Math.PI / 2;
        const rad = radius * (r / rings);
        const x = cx + rad * Math.cos(angle);
        const y = cy + rad * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Spokes + labels
    skills.forEach(function (skill, i) {
      const angle = (Math.PI * 2 * i / sides) - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1;
      ctx.stroke();

      const labelX = cx + (radius + 28) * Math.cos(angle);
      const labelY = cy + (radius + 28) * Math.sin(angle);
      ctx.fillStyle = colors.label;
      ctx.font = '600 13px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(skill.label, labelX, labelY);
    });

    // Data polygon (animated)
    ctx.beginPath();
    skills.forEach(function (skill, i) {
      const angle = (Math.PI * 2 * i / sides) - Math.PI / 2;
      const rad = radius * (skill.value / 100) * animProgress;
      const x = cx + rad * Math.cos(angle);
      const y = cy + rad * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = colors.fill;
    ctx.fill();
    ctx.strokeStyle = colors.stroke;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Data points
    skills.forEach(function (skill, i) {
      const angle = (Math.PI * 2 * i / sides) - Math.PI / 2;
      const rad = radius * (skill.value / 100) * animProgress;
      const x = cx + rad * Math.cos(angle);
      const y = cy + rad * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = colors.stroke;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = colors.point;
      ctx.stroke();
    });
  }

  function animateIn() {
    if (drawn) {
      draw(1);
      return;
    }
    drawn = true;
    progress = 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      draw(1);
      return;
    }

    function step() {
      progress += 0.045;
      if (progress >= 1) {
        progress = 1;
        draw(progress);
        return;
      }
      draw(progress);
      animFrame = requestAnimationFrame(step);
    }
    step();
  }

  function showView(view) {
    const isRadar = view === 'radar';
    cardsBtn.classList.toggle('active', !isRadar);
    radarBtn.classList.toggle('active', isRadar);
    cardsView.style.display = isRadar ? 'none' : 'flex';
    radarView.classList.toggle('visible', isRadar);

    if (isRadar) {
      requestAnimationFrame(function () { animateIn(); });
    }
  }

  cardsBtn.addEventListener('click', function () { showView('cards'); });
  radarBtn.addEventListener('click', function () { showView('radar'); });

  window.addEventListener('resize', function () {
    if (radarView.classList.contains('visible')) draw(1);
  });

  // Redraw with correct theme colors when theme toggles
  const themeBtn = document.getElementById('theme_toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      if (radarView.classList.contains('visible')) {
        setTimeout(function () { draw(1); }, 50);
      }
    });
  }
}


/* ================= GITHUB STATS WIDGET ================= */

function initGithubStats() {
  const statusEl = document.getElementById('github_status');
  const reposList = document.getElementById('github_repos_list');
  const card = document.getElementById('github_card');

  if (!statusEl || !card) return;

  const username = 'siddheshkosalge896-afk';

  function setStat(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  fetch('https://api.github.com/users/' + username)
    .then(function (res) {
      if (!res.ok) throw new Error('User not found (' + res.status + ')');
      return res.json();
    })
    .then(function (data) {
      setStat('gh_repos', data.public_repos);
      setStat('gh_followers', data.followers);
      setStat('gh_following', data.following);
      setStat('gh_gists', data.public_gists);
      statusEl.textContent = 'Live data from GitHub';

      return fetch('https://api.github.com/users/' + username + '/repos?sort=updated&per_page=4');
    })
    .then(function (res) {
      if (!res || !res.ok) return [];
      return res.json();
    })
    .then(function (repos) {
      if (!Array.isArray(repos) || repos.length === 0 || !reposList) return;

      reposList.innerHTML = '';
      repos.forEach(function (repo) {
        const item = document.createElement('a');
        item.href = repo.html_url;
        item.target = '_blank';
        item.className = 'github_repo_item';
        item.innerHTML =
          '<span class="github_repo_name">' + repo.name + '</span>' +
          '<span class="github_repo_meta">★ ' + repo.stargazers_count + ' · ' + (repo.language || 'N/A') + '</span>';
        reposList.appendChild(item);
      });
    })
    .catch(function () {
      statusEl.textContent = 'Live stats unavailable right now — view the full profile below.';
    });
}


/* ================= SCROLLSPY NAV HIGHLIGHT ================= */
/* Highlights the nav link matching the section currently in view.
   Uses IntersectionObserver where available; falls back to a plain
   scroll-position check for browsers that lack it, so it works
   everywhere — old browsers, embedded webviews, anything. */

function initScrollSpy() {
  const navLinks = Array.prototype.slice.call(document.querySelectorAll('.topmenu'));
  if (navLinks.length === 0) return;

  // Build {section, link} pairs only for links that point to a real section on the page
  const links = [];
  navLinks.forEach(function (link) {
    const href = link.getAttribute('href') || '';
    if (href.charAt(0) !== '#') return;
    const section = document.getElementById(href.slice(1));
    if (section) links.push({ link: link, section: section });
  });

  if (links.length === 0) return;

  function clearActive() {
    navLinks.forEach(function (link) { link.classList.remove('nav_active'); });
  }

  function setActive(section) {
    clearActive();
    links.forEach(function (item) {
      if (item.section === section) item.link.classList.add('nav_active');
    });
  }

  // ----- Preferred path: IntersectionObserver -----
  if ('IntersectionObserver' in window) {
    let currentSection = null;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          currentSection = entry.target;
          setActive(currentSection);
        }
      });
    }, {
      // Treat a section as "current" once it crosses the upper third of the viewport
      rootMargin: '-35% 0px -55% 0px',
      threshold: 0
    });

    links.forEach(function (item) {
      observer.observe(item.section);
    });

    return;
  }

  // ----- Fallback path: plain scroll listener, no IntersectionObserver needed -----
  let ticking = false;

  function updateOnScroll() {
    const markerLine = window.innerHeight * 0.35;
    let activeSection = links[0].section;

    for (let i = 0; i < links.length; i++) {
      const rect = links[i].section.getBoundingClientRect();
      if (rect.top <= markerLine) {
        activeSection = links[i].section;
      }
    }

    setActive(activeSection);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      (window.requestAnimationFrame || function (cb) { setTimeout(cb, 100); })(updateOnScroll);
    }
  }, { passive: true });

  window.addEventListener('resize', updateOnScroll);
  updateOnScroll();
}


/* ================= SCROLL REVEAL ================= */

function initScrollReveal() {
  const targets = document.querySelectorAll('h2, .skill, .certification_card, .project-card, .timeline-item, .github_card');
  if (targets.length === 0) return;

  targets.forEach(function (el) {
    el.classList.add('reveal');
  });

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(function (el) {
    observer.observe(el);
  });
}


/* ================= INIT ================= */

document.addEventListener('DOMContentLoaded', function () {
  initLoader();
  initTheme();
  initTypingAnimation();
  initStatsCounter();
  initSkillBars();
  initContactForm();
  initVisitorCounter();
  initCaseStudyToggles();
  initCarousel();
  initScrollProgress();
  initHeroParticles();
  initSocialShare();
  initPrintResume();
  initLightbox();
  initTiltEffect();
  initScrollReveal();
  initProjectFilter();
  initSkillsRadar();
  initGithubStats();
  initScrollSpy();
});