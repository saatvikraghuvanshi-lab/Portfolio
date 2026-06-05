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

const projectList = document.querySelector(".project-list");

if (projectList) {
  // Keep the portfolio ordered by recency. New projects should receive the latest ISO data-added date.
  Array.from(projectList.querySelectorAll(".project-card"))
    .sort((a, b) => (b.dataset.added || "").localeCompare(a.dataset.added || ""))
    .forEach((card) => projectList.appendChild(card));
}

const revealTargets = document.querySelectorAll(
  ".section-heading, .intro-grid, .project-card, .tech-card, .timeline-item, .achievement-list p, .contact-layout"
);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else {
          entry.target.classList.remove("is-visible");
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "-6% 0px -6% 0px",
    }
  );

  revealTargets.forEach((target, index) => {
    target.classList.add("reveal");
    target.style.transitionDelay = `${Math.min(index * 35, 210)}ms`;
    observer.observe(target);
  });
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

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

document.querySelectorAll(".project-card").forEach((card) => {
  const details = card.querySelector(".project-details");
  if (!details) {
    return;
  }

  card.addEventListener("click", (event) => {
    if (
      details.open ||
      event.target.closest("a, button, summary, .project-gallery")
    ) {
      return;
    }

    details.open = true;
  });
});

const galleryLightbox = document.createElement("div");
galleryLightbox.className = "gallery-lightbox";
galleryLightbox.innerHTML = `
  <button type="button" aria-label="Close gallery">x</button>
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

document.querySelectorAll(".gallery-thumb").forEach((thumb) => {
  thumb.addEventListener("click", () => {
    const image = thumb.querySelector("img");
    if (!image || thumb.hidden) {
      return;
    }

    lightboxImage.setAttribute("src", thumb.dataset.full || image.currentSrc || image.src);
    lightboxImage.setAttribute("alt", image.alt || "Project screenshot");
    galleryLightbox.classList.add("is-open");
  });
});

galleryLightbox.addEventListener("click", (event) => {
  if (event.target === galleryLightbox || event.target === lightboxClose) {
    closeGallery();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeGallery();
  }
});
