const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

document.body.classList.add("is-loaded");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const resumeDownload = document.querySelector(".resume-download");
const resumeDownloadToggle = document.querySelector(".resume-download-toggle");
const resumeDownloadMenu = document.querySelector(".resume-download-menu");

function closeResumeDownload() {
  if (!resumeDownload || !resumeDownloadToggle || !resumeDownloadMenu) {
    return;
  }

  resumeDownload.classList.remove("is-open");
  resumeDownloadToggle.setAttribute("aria-expanded", "false");
  resumeDownloadMenu.hidden = true;
}

if (resumeDownload && resumeDownloadToggle && resumeDownloadMenu) {
  resumeDownloadToggle.addEventListener("click", () => {
    const isOpen = resumeDownload.classList.toggle("is-open");
    resumeDownloadToggle.setAttribute("aria-expanded", String(isOpen));
    resumeDownloadMenu.hidden = !isOpen;
  });

  resumeDownloadMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeResumeDownload);
  });

  document.addEventListener("click", (event) => {
    if (!resumeDownload.contains(event.target)) {
      closeResumeDownload();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeResumeDownload();
      resumeDownloadToggle.focus();
    }
  });
}

const projectList = document.querySelector(".project-list");
const projectProfiles = {
  "EcoCity Heat Planner": {
    role: "Full-Stack Developer",
    tech: ["React", "Vite", "Tailwind CSS", "Supabase", "PostgreSQL", "PostGIS", "Leaflet", "Mapbox"],
  },
  "Lunar Ice Intelligence": {
    role: "Full-Stack Developer / Geospatial Engineer",
    tech: ["Next.js", "Prisma", "Python", "Chandrayaan-2 DFSAR", "NASA LOLA", "OHRC", "TMC-2"],
  },
  ShockProof: {
    role: "Full-Stack Developer",
    tech: ["Next.js", "Supabase", "PostgreSQL", "Gemini API", "Tariff logic", "AI workflows"],
  },
  S2C: {
    role: "Full-Stack Developer",
    tech: ["Next.js", "React", "TypeScript", "Convex", "Inngest", "Redux", "Gemini API", "Tailwind CSS"],
  },
  VibeBatch: {
    role: "Freelance Full-Stack Developer",
    tech: ["React/Vite", "Supabase", "PostgreSQL", "Supabase Auth", "RLS", "Gemini API"],
  },
  ResilienceOS: {
    role: "Full-Stack Developer",
    tech: ["React", "Simulation UI", "Role-based dashboards", "Maps", "Forecast reporting"],
  },
  JanSahayak: {
    role: "Frontend / UI Prototype Builder",
    tech: ["Frontend", "AI assistant", "Civic tech", "UI/UX", "Rapid prototyping"],
  },
  "TerraPulse Pro": {
    role: "Frontend / GIS Interface Builder",
    tech: ["GIS maps", "Leaflet", "Satellite views", "Analytics UI", "Frontend"],
  },
};

if (projectList) {
  // Keep the portfolio ordered by recency. New projects should receive the latest ISO data-added date.
  Array.from(projectList.querySelectorAll(".project-card"))
    .sort((a, b) => (b.dataset.added || "").localeCompare(a.dataset.added || ""))
    .forEach((card) => projectList.appendChild(card));
}

const projectDialog = document.createElement("div");
projectDialog.className = "project-dialog";
projectDialog.hidden = true;
projectDialog.setAttribute("role", "dialog");
projectDialog.setAttribute("aria-modal", "true");
projectDialog.setAttribute("aria-labelledby", "project-dialog-title");
projectDialog.innerHTML = `
  <div class="project-dialog-backdrop" data-close-project></div>
  <section class="project-sheet" tabindex="-1">
    <button class="project-dialog-close" type="button" data-close-project aria-label="Close project details">
      <span aria-hidden="true">&times;</span>
      <span class="sr-only">Close project details</span>
    </button>
    <div class="project-dialog-grid">
      <div class="project-dialog-media">
        <img alt="" />
      </div>
      <div class="project-dialog-content">
        <div class="project-dialog-badges"></div>
        <h3 id="project-dialog-title"></h3>
        <p class="project-dialog-summary"></p>
        <div class="project-tabs" role="tablist" aria-label="Project details">
          <button class="project-tab is-active" type="button" role="tab" aria-selected="true" data-tab="overview">Overview</button>
          <button class="project-tab" type="button" role="tab" aria-selected="false" data-tab="build">Build</button>
          <button class="project-tab" type="button" role="tab" aria-selected="false" data-tab="gallery">Gallery</button>
          <button class="project-tab" type="button" role="tab" aria-selected="false" data-tab="links">Links</button>
        </div>
        <div class="project-tab-panels">
          <div class="project-panel is-active" data-panel="overview"></div>
          <div class="project-panel" data-panel="build"></div>
          <div class="project-panel" data-panel="gallery"></div>
          <div class="project-panel" data-panel="links"></div>
        </div>
      </div>
    </div>
  </section>
`;
document.body.appendChild(projectDialog);

const projectSheet = projectDialog.querySelector(".project-sheet");
const projectDialogImage = projectDialog.querySelector(".project-dialog-media img");
const projectDialogTitle = projectDialog.querySelector("#project-dialog-title");
const projectDialogSummary = projectDialog.querySelector(".project-dialog-summary");
const projectDialogBadges = projectDialog.querySelector(".project-dialog-badges");
const projectTabs = Array.from(projectDialog.querySelectorAll(".project-tab"));
const projectPanels = Array.from(projectDialog.querySelectorAll(".project-panel"));
let lastProjectTrigger = null;

function makeBadge(label) {
  const badge = document.createElement("span");
  badge.className = "project-badge";
  badge.textContent = label;
  return badge;
}

function setActiveProjectTab(tabName) {
  projectTabs.forEach((tab) => {
    const isActive = tab.dataset.tab === tabName;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  projectPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panel === tabName);
  });
}

function getProjectData(card) {
  const title = card.querySelector("h3")?.textContent.trim() || "Project";
  const preview = card.querySelector(".project-preview img");
  const summary = card.querySelector(":scope > p")?.textContent.trim() || "";
  const meta = Array.from(card.querySelectorAll(".project-meta span")).map((item) => item.textContent.trim());
  const details = card.querySelector(".project-details");
  const bullets = Array.from(details?.querySelectorAll(".project-detail-body > ul > li") || []).map((item) => item.textContent.trim());
  const links = details?.querySelector(".project-links")?.cloneNode(true);
  const gallery = details?.querySelector(".project-gallery .gallery-grid")?.cloneNode(true);
  const profile = projectProfiles[title] || { role: "Developer", tech: meta };

  return {
    title,
    previewSrc: preview?.currentSrc || preview?.src || "",
    previewAlt: preview?.alt || `${title} preview`,
    summary,
    meta,
    details,
    bullets,
    links,
    gallery,
    role: profile.role,
    tech: profile.tech,
    context: card.dataset.context || "Recent project",
  };
}

function renderProjectDialog(card) {
  const project = getProjectData(card);

  projectDialogImage.src = project.previewSrc;
  projectDialogImage.alt = project.previewAlt;
  projectDialogTitle.textContent = project.title;
  projectDialogSummary.textContent = project.summary;
  projectDialogBadges.replaceChildren(...project.meta.map(makeBadge));

  const overviewPanel = projectDialog.querySelector('[data-panel="overview"]');
  const buildPanel = projectDialog.querySelector('[data-panel="build"]');
  const galleryPanel = projectDialog.querySelector('[data-panel="gallery"]');
  const linksPanel = projectDialog.querySelector('[data-panel="links"]');

  overviewPanel.replaceChildren();
  const overview = document.createElement("div");
  overview.className = "project-panel-copy";
  overview.innerHTML = `
    <p>${project.summary}</p>
    <dl>
      <div><dt>Role</dt><dd>${project.role}</dd></div>
      <div><dt>Context</dt><dd>${project.context}</dd></div>
    </dl>
  `;
  overviewPanel.appendChild(overview);

  buildPanel.replaceChildren();
  const build = document.createElement("div");
  build.className = "project-panel-copy";
  const techList = document.createElement("div");
  techList.className = "project-tech-list";
  project.tech.forEach((tech) => techList.appendChild(makeBadge(tech)));
  const buildTitle = document.createElement("h4");
  buildTitle.textContent = "What I built";
  const bulletList = document.createElement("ul");
  project.bullets.forEach((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    bulletList.appendChild(item);
  });
  build.append(techList, buildTitle, bulletList);
  buildPanel.appendChild(build);

  galleryPanel.replaceChildren();
  if (project.gallery) {
    project.gallery.querySelectorAll(".gallery-thumb").forEach((thumb) => {
      thumb.hidden = false;
      const image = thumb.querySelector("img");
      if (image) {
        image.loading = "lazy";
        image.addEventListener("error", () => {
          thumb.hidden = true;
        });
      }
    });
    galleryPanel.appendChild(project.gallery);
  } else {
    galleryPanel.innerHTML = '<p class="project-empty-note">Gallery coming soon.</p>';
  }

  linksPanel.replaceChildren();
  if (project.links) {
    linksPanel.appendChild(project.links);
  } else {
    linksPanel.innerHTML = '<p class="project-empty-note">Links coming soon.</p>';
  }

  setActiveProjectTab("overview");
}

function openProjectDialog(card, trigger) {
  lastProjectTrigger = trigger || card;
  renderProjectDialog(card);
  projectDialog.hidden = false;
  document.body.classList.add("has-dialog");
  requestAnimationFrame(() => {
    projectDialog.classList.add("is-open");
    projectSheet.focus();
  });
}

function closeProjectDialog() {
  if (projectDialog.hidden) {
    return;
  }

  projectDialog.classList.remove("is-open");
  document.body.classList.remove("has-dialog");
  setTimeout(() => {
    projectDialog.hidden = true;
    if (lastProjectTrigger) {
      lastProjectTrigger.focus();
    }
  }, 160);
}

document.querySelectorAll(".project-card").forEach((card) => {
  const details = card.querySelector(".project-details");
  if (details) {
    details.hidden = true;
    details.setAttribute("aria-hidden", "true");
  }

  const title = card.querySelector("h3")?.textContent.trim() || "project";
  card.tabIndex = 0;
  card.setAttribute("aria-label", `Open ${title} project details`);

  if (!card.querySelector(".project-open")) {
    const openButton = document.createElement("button");
    openButton.className = "project-open";
    openButton.type = "button";
    openButton.textContent = "View details";
    card.appendChild(openButton);
  }

  const openButton = card.querySelector(".project-open");
  openButton.addEventListener("click", () => openProjectDialog(card, openButton));
  card.addEventListener("click", (event) => {
    if (event.target.closest("a, button, summary, input, textarea, select")) {
      return;
    }
    openProjectDialog(card, card);
  });
  card.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && event.target === card) {
      event.preventDefault();
      openProjectDialog(card, card);
    }
  });
});

projectTabs.forEach((tab) => {
  tab.addEventListener("click", () => setActiveProjectTab(tab.dataset.tab));
});

projectDialog.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-project]")) {
    closeProjectDialog();
  }
});

const commandTrigger = document.createElement("button");
commandTrigger.className = "command-trigger";
commandTrigger.type = "button";
commandTrigger.innerHTML = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M10.8 4a6.8 6.8 0 0 1 5.38 10.95l3.96 3.91-1.28 1.28-3.91-3.96A6.8 6.8 0 1 1 10.8 4Zm0 1.8a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z" />
  </svg>
  <span class="sr-only">Search</span>
`;
commandTrigger.setAttribute("aria-label", "Open quick jump search");

if (navToggle) {
  navToggle.insertAdjacentElement("beforebegin", commandTrigger);
}

const commandDialog = document.createElement("div");
commandDialog.className = "command-dialog";
commandDialog.hidden = true;
commandDialog.setAttribute("role", "dialog");
commandDialog.setAttribute("aria-modal", "true");
commandDialog.setAttribute("aria-label", "Quick jump");
commandDialog.innerHTML = `
  <div class="command-backdrop" data-close-command></div>
  <section class="command-panel">
    <input class="command-input" type="search" placeholder="Jump to projects, skills, resume, contact..." aria-label="Quick jump search" />
    <div class="command-results" role="listbox"></div>
  </section>
`;
document.body.appendChild(commandDialog);

const commandInput = commandDialog.querySelector(".command-input");
const commandResults = commandDialog.querySelector(".command-results");
const commandItems = [
  { label: "Projects", hint: "Section", action: () => document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" }) },
  { label: "Technical skills and tools", hint: "Section", action: () => document.querySelector("#skills")?.scrollIntoView({ behavior: "smooth" }) },
  { label: "Experience", hint: "Section", action: () => document.querySelector("#experience")?.scrollIntoView({ behavior: "smooth" }) },
  { label: "Contact", hint: "Section", action: () => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }) },
  { label: "Resume PDF", hint: "Download", action: () => window.location.href = "Saatvik_Raghuvanshi_Resume_ATS.pdf" },
  { label: "Resume DOCX", hint: "Download", action: () => window.location.href = "Saatvik_Raghuvanshi_Resume_ATS.docx" },
  ...Array.from(document.querySelectorAll(".project-card")).map((card) => ({
    label: card.querySelector("h3")?.textContent.trim() || "Project",
    hint: "Project details",
    action: () => openProjectDialog(card, commandTrigger),
  })),
];

function closeCommandDialog() {
  commandDialog.classList.remove("is-open");
  document.body.classList.remove("has-dialog");
  setTimeout(() => {
    commandDialog.hidden = true;
  }, 140);
}

function renderCommandResults(query = "") {
  const normalizedQuery = query.trim().toLowerCase();
  const results = commandItems.filter((item) => {
    const text = `${item.label} ${item.hint}`.toLowerCase();
    return !normalizedQuery || text.includes(normalizedQuery);
  });

  commandResults.replaceChildren();
  results.slice(0, 8).forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "command-item";
    button.innerHTML = `<span>${item.label}</span><small>${item.hint}</small>`;
    button.addEventListener("click", () => {
      closeCommandDialog();
      item.action();
    });
    commandResults.appendChild(button);
  });
}

function openCommandDialog() {
  renderCommandResults();
  commandDialog.hidden = false;
  document.body.classList.add("has-dialog");
  requestAnimationFrame(() => {
    commandDialog.classList.add("is-open");
    commandInput.focus();
  });
}

commandTrigger.addEventListener("click", openCommandDialog);
commandInput.addEventListener("input", () => renderCommandResults(commandInput.value));
commandDialog.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-command]")) {
    closeCommandDialog();
  }
});

const contactForm = document.querySelector("#contact-note-form");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const topic = contactForm.querySelector("#contact-topic")?.value || "Portfolio inquiry";
  const message = contactForm.querySelector("#contact-message")?.value.trim() || "";
  const subject = encodeURIComponent(`Portfolio: ${topic}`);
  const body = encodeURIComponent(message ? `${message}\n\nSent from portfolio.` : "Hi Saatvik,\n\n");
  window.location.href = `mailto:raghuvanshisaatvik@gmail.com?subject=${subject}&body=${body}`;
});

// ═══ ANIME.JS ANIMATIONS ═══
(function() {
  const hasAnime = typeof anime === 'function';
  if (!hasAnime) {
    // Fallback: just show everything
    document.body.classList.add('anim-done');
    return;
  }

  // ─── HERO ENTRANCE ───
  const heroTimeline = anime.timeline({ easing: 'easeOutExpo', delay: 200 });
  
  heroTimeline
    .add({ targets: '.hero-grid-lines', opacity: [0, 1], duration: 800 })
    .add({ targets: '.eyebrow', opacity: [0, 1], translateY: [15, 0], duration: 500 }, '-=400')
    .add({ targets: '.hero-line', opacity: [0, 1], translateY: [40, 0], duration: 600, delay: anime.stagger(120) }, '-=300')
    .add({ targets: '.hero-copy', opacity: [0, 1], translateY: [20, 0], duration: 500 }, '-=350')
    .add({ targets: '.hero-actions', opacity: [0, 1], translateY: [15, 0], duration: 400 }, '-=300')
    .add({ targets: '.hero-showcase', opacity: [0, 1], translateY: [25, 0], duration: 500 }, '-=250')
    .add({ targets: '.queue-feature', opacity: [0, 1], translateY: [20, 0], scale: [0.98, 1], duration: 450 }, '-=300')
    .add({ targets: '.queue-item', opacity: [0, 1], translateX: [-20, 0], duration: 350, delay: anime.stagger(80) }, '-=250')
    .add({ targets: '.scroll-line', opacity: [0, 1], scaleY: [0, 1], duration: 600, easing: 'easeInOutQuad' }, '-=200');

  heroTimeline.finished.then(() => document.body.classList.add('anim-done'));

  // ─── SCROLL REVEALS ───
  const revealTargets = document.querySelectorAll(
    '.section-heading-block, .intro-grid, .timeline-item, .achievement-item, .contact-layout'
  );

  const revealed = new WeakSet();
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !revealed.has(entry.target)) {
        revealed.add(entry.target);
        anime({
          targets: entry.target,
          opacity: [0, 1],
          translateY: [30, 0],
          duration: 600,
          easing: 'easeOutCubic',
        });
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  revealTargets.forEach(el => scrollObserver.observe(el));

  // ─── PROJECT CARDS — staggered reveal ───
  const projectCards = document.querySelectorAll('.project-card');
  const projectRevealed = new WeakSet();
  const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !projectRevealed.has(entry.target)) {
        projectRevealed.add(entry.target);
        // Find index among siblings
        const parent = entry.target.parentElement;
        const siblings = Array.from(parent.querySelectorAll('.project-card'));
        const idx = siblings.indexOf(entry.target);
        anime({
          targets: entry.target,
          opacity: [0, 1],
          translateY: [40, 0],
          duration: 650,
          delay: idx * 100,
          easing: 'easeOutCubic',
        });
        projectObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });

  projectCards.forEach(card => projectObserver.observe(card));

  // ─── TECH CARDS — staggered grid reveal ───
  const techGrid = document.querySelector('.tech-grid');
  if (techGrid) {
    const techCards = techGrid.querySelectorAll('.tech-card');
    const techRevealed = { done: false };
    const techObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !techRevealed.done) {
          techRevealed.done = true;
          anime({
            targets: techCards,
            opacity: [0, 1],
            translateY: [20, 0],
            scale: [0.95, 1],
            duration: 400,
            delay: anime.stagger(30, { start: 100 }),
            easing: 'easeOutCubic',
          });
          techObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    techObserver.observe(techGrid);
  }

  // ─── HERO PARALLAX on scroll ───
  const heroGrid = document.querySelector('.hero-grid-lines');
  if (heroGrid) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const maxScroll = window.innerHeight;
          if (scrollY < maxScroll) {
            const progress = scrollY / maxScroll;
            heroGrid.style.transform = 'translateY(' + (progress * 60) + 'px)';
            heroGrid.style.opacity = 1 - progress * 0.7;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ─── SKILLS BAND reveal ───
  const skillsBand = document.querySelector('.skills-band');
  if (skillsBand) {
    const skillsObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          anime({
            targets: skillsBand,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 500,
            easing: 'easeOutCubic',
          });
          skillsObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    skillsObs.observe(skillsBand);
  }

  // ─── SECTION KICKER underline animation ───
  document.querySelectorAll('.section-kicker').forEach(kicker => {
    kicker.style.borderBottom = '2px solid var(--burgundy)';
    kicker.style.paddingBottom = '6px';
    kicker.style.display = 'inline-block';
    kicker.style.width = '0';
    kicker.style.overflow = 'hidden';
    kicker.style.transition = 'none';
    
    const kickerObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            kicker.style.transition = 'width 500ms cubic-bezier(0.16,1,0.3,1)';
            kicker.style.width = '100%';
          }, 200);
          kickerObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    kickerObs.observe(kicker);
  });

  // ─── FLOATING BURGUNDY DOT PARTICLES (decorative) ───
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    for (let i = 0; i < 6; i++) {
      const dot = document.createElement('div');
      dot.setAttribute('aria-hidden', 'true');
      dot.style.cssText = 'position:absolute;width:' + (3 + Math.random()*5) + 'px;height:' + (3 + Math.random()*5) + 'px;border-radius:50%;background:rgba(232,25,76,' + (0.15 + Math.random()*0.2) + ');pointer-events:none;z-index:1;top:' + (Math.random()*100) + '%;left:' + (Math.random()*100) + '%;';
      heroSection.appendChild(dot);
      
      anime({
        targets: dot,
        translateY: [0, -30 - Math.random()*40],
        translateX: [0, (Math.random()-0.5)*30],
        opacity: [0, 0.6, 0],
        duration: 3000 + Math.random()*2000,
        delay: 500 + i * 400,
        loop: true,
        easing: 'easeInOutQuad',
      });
    }
  }

})();
document.querySelectorAll(".tech-card, .project-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -4;
    const rotateY = ((x / rect.width) - 0.5) * 4;

    card.style.transform = `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

const galleryLightbox = document.createElement("div");
galleryLightbox.className = "gallery-lightbox";
galleryLightbox.innerHTML = `
  <button type="button" aria-label="Close gallery">Close</button>
  <img src="" alt="" />
`;
document.body.appendChild(galleryLightbox);

const lightboxImage = galleryLightbox.querySelector("img");
const lightboxClose = galleryLightbox.querySelector("button");

function closeGallery() {
  galleryLightbox.classList.remove("is-open");
  lightboxImage.setAttribute("src", "");
  lightboxImage.setAttribute("alt", "");
}

function updateGalleryState(gallery) {
  const thumbs = Array.from(gallery.querySelectorAll(".gallery-thumb"));
  const hasVisibleThumb = thumbs.some((thumb) => !thumb.hidden);
  gallery.classList.toggle("is-empty", !hasVisibleThumb);
}

document.querySelectorAll(".project-gallery").forEach((gallery) => {
  gallery.querySelectorAll(".gallery-thumb img").forEach((image) => {
    image.addEventListener("error", () => {
      const thumb = image.closest(".gallery-thumb");
      if (thumb) {
        thumb.hidden = true;
      }
      updateGalleryState(gallery);
    });

    image.addEventListener("load", () => {
      const thumb = image.closest(".gallery-thumb");
      if (thumb) {
        thumb.hidden = false;
      }
      updateGalleryState(gallery);
    });
  });

  updateGalleryState(gallery);
});

document.addEventListener("click", (event) => {
  const thumb = event.target.closest(".gallery-thumb");
  if (!thumb) {
    return;
  }

  const image = thumb.querySelector("img");
  if (!image || thumb.hidden) {
    return;
  }

  lightboxImage.setAttribute("src", thumb.dataset.full || image.currentSrc || image.src);
  lightboxImage.setAttribute("alt", image.alt || "Project screenshot");
  galleryLightbox.classList.add("is-open");
});

galleryLightbox.addEventListener("click", (event) => {
  if (event.target === galleryLightbox || event.target === lightboxClose) {
    closeGallery();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeGallery();
    closeProjectDialog();
    closeCommandDialog();
  }

  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openCommandDialog();
  }
});
