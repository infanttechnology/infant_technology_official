

(() => {
  "use strict";


  const GALLERY_PHOTOS = [
    { src: "assets/gallery/placement.jpeg", category: "placement", alt: "Placement drive", caption: "Placement Drive" },
    { src: "assets/gallery/mou-1.jpeg", category: "mou", alt: "Institution partnership signing", caption: "Partnership Signing" },
    { src: "assets/gallery/mou.jpeg", category: "mou", alt: "Memorandum event", caption: "MoU Event" },
    { src: "assets/gallery/mou-2.jpeg", category: "mou", alt: "Memorandum of understanding signing with DMI Engineering College", caption: "MoU Event" },
    { src: "assets/gallery/class-2.jpeg", category: "internship", alt: "Internship classroom session", caption: "Internship Classroom" },
    { src: "assets/gallery/class.jpeg", category: "workshop", alt: "Live class workshop", caption: "Live Class Session" },
    { src: "assets/gallery/class-1.jpeg", category: "workshop", alt: "Technical workshop", caption: "Workshop Day" }
  ];

  
  const GALLERY_VIDEOS = [
    { src: "assets/videos/campus-1.mp4", poster: "assets/gallery/campus-1-poster.jpg", alt: "MoU signing highlight video" },
    { src: "assets/videos/campus-2.mp4", poster: "assets/gallery/campus-2-poster.jpg", alt: "Seminar highlight video" },
    { src: "assets/videos/campus-3.mp4", poster: "assets/gallery/campus-3-poster.jpg", alt: "Internship highlight video" },
    { src: "assets/videos/campus-4.mp4", poster: "assets/gallery/campus-4-poster.jpg", alt: "Inauguration highlight video" },
    { src: "assets/videos/video-5.mp4", poster: "assets/gallery/campus-5-poster.jpg", alt: "Event highlight video" },
    { src: "assets/videos/video-6.mp4", poster: "assets/gallery/campus-6-poster.jpg", alt: "seminar video" }
  ];

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const isCoarsePointer =
    window.matchMedia && window.matchMedia("(pointer: coarse)").matches;

  const connection =
    navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  const lowConnection = connection
    ? ["slow-2g", "2g", "3g"].includes(connection.effectiveType) || connection.saveData
    : false;

  const lowPerfMode =
    lowConnection ||
    (navigator.hardwareConcurrency ? navigator.hardwareConcurrency < 4 : false);

  const supportsIntersectionObserver = "IntersectionObserver" in window;
  const supportsRAF = typeof window.requestAnimationFrame === "function";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function safeRun(label, callback) {
    try {
      callback();
    } catch (error) {
      // Non-blocking fail-safe to keep UX working.
      console.warn(`[InfantTech] ${label} failed`, error);
    }
  }

  function initLoader() {
    const releaseLoader = () => {
      document.body.classList.add("is-loaded");
    };

    window.addEventListener("load", releaseLoader, { once: true });
    window.setTimeout(releaseLoader, 1800);
  }

  function initYear() {
    const yearNode = $("#year");
    if (!yearNode) return;
    yearNode.textContent = String(new Date().getFullYear());
  }

  function initMobileMenu() {
    const toggle = $(".menu-toggle");
    const panel = $("#navPanel");
    const nav = $(".navbar");
    if (!toggle || !panel || !nav) return;

    const navLinks = $$(".nav-list a, .nav-cta", panel);

    const closeMenu = () => {
      document.body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    const openMenu = () => {
      document.body.classList.add("menu-open");
      toggle.setAttribute("aria-expanded", "true");
    };

    toggle.addEventListener("click", () => {
      const isOpen = document.body.classList.contains("menu-open");
      if (isOpen) closeMenu();
      else openMenu();
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      const isOpen = document.body.classList.contains("menu-open");
      if (!isOpen) return;
      if (nav.contains(event.target)) return;
      closeMenu();
    });

    window.addEventListener(
      "resize",
      () => {
        if (window.innerWidth > 980) {
          closeMenu();
        }
      },
      { passive: true }
    );
  }

  function initTyping() {
    const typingNode = $(".typing");
    if (!typingNode) return;

    const phrases = [
      "AI systems, web products, and applied innovation.",
      "Internships, workshops, and real-world technical mentoring.",
      "Modern solutions built for speed, quality, and growth."
    ];

    if (prefersReducedMotion) {
      typingNode.textContent = phrases[0];
      return;
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const phrase = phrases[phraseIndex];

      if (deleting) {
        charIndex -= 1;
      } else {
        charIndex += 1;
      }

      typingNode.textContent = phrase.slice(0, charIndex);

      let delay = deleting ? 34 : 56;

      if (!deleting && charIndex === phrase.length) {
        deleting = true;
        delay = 1400;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 360;
      }

      window.setTimeout(tick, delay);
    };

    tick();
  }

  function initRevealAnimations() {
    const revealNodes = $$(".reveal");
    if (!revealNodes.length) return;

    if (prefersReducedMotion || !supportsIntersectionObserver) {
      revealNodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    revealNodes.forEach((node, index) => {
      node.style.transitionDelay = `${Math.min(index * 35, 260)}ms`;
    });

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    revealNodes.forEach((node) => observer.observe(node));
  }

  function animateCounter(counter) {
    const target = Number(counter.getAttribute("data-target") || "0");
    const suffix = counter.getAttribute("data-suffix") || "";

    if (!Number.isFinite(target) || target <= 0) {
      counter.textContent = `0${suffix}`;
      return;
    }

    if (prefersReducedMotion || !supportsRAF) {
      counter.textContent = `${target.toLocaleString()}${suffix}`;
      return;
    }

    const duration = 1600;
    const startTime = performance.now();

    const step = (timeNow) => {
      const elapsed = timeNow - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);

      counter.textContent = `${value.toLocaleString()}${suffix}`;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }

  function initCounters() {
    const counters = $$(".counter[data-target]");
    if (!counters.length) return;

    if (prefersReducedMotion || !supportsIntersectionObserver) {
      counters.forEach((counter) => animateCounter(counter));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          currentObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.4
      }
    );

    counters.forEach((counter) => observer.observe(counter));
  }

  function initCarousel() {
    const track = $("#aboutTrack");
    if (!track) return;

    const slides = $$(".carousel-item", track);
    const prevButton = $("[data-carousel-prev]");
    const nextButton = $("[data-carousel-next]");
    const dots = $$(".carousel-dot");

    if (!slides.length) return;

    let currentIndex = 0;
    let autoplayId = 0;

    const setActiveDot = (index) => {
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    };

    const render = () => {
      track.style.transform = `translate3d(${-currentIndex * 100}%, 0, 0)`;
      setActiveDot(currentIndex);
    };

    const goTo = (index) => {
      currentIndex = (index + slides.length) % slides.length;
      render();
    };

    const next = () => goTo(currentIndex + 1);
    const prev = () => goTo(currentIndex - 1);

    prevButton && prevButton.addEventListener("click", prev);
    nextButton && nextButton.addEventListener("click", next);

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const index = Number(dot.getAttribute("data-slide") || "0");
        goTo(index);
      });
    });

    let touchStartX = 0;
    track.addEventListener(
      "touchstart",
      (event) => {
        touchStartX = event.changedTouches[0].clientX;
      },
      { passive: true }
    );

    track.addEventListener(
      "touchend",
      (event) => {
        const touchEndX = event.changedTouches[0].clientX;
        const deltaX = touchEndX - touchStartX;

        if (Math.abs(deltaX) < 45) return;
        if (deltaX < 0) next();
        else prev();
      },
      { passive: true }
    );

    const stopAutoplay = () => {
      if (!autoplayId) return;
      window.clearInterval(autoplayId);
      autoplayId = 0;
    };

    const startAutoplay = () => {
      if (prefersReducedMotion || autoplayId) return;
      autoplayId = window.setInterval(next, 4200);
    };

    const card = $(".carousel-card");
    if (card) {
      card.addEventListener("mouseenter", stopAutoplay, { passive: true });
      card.addEventListener("mouseleave", startAutoplay, { passive: true });
      card.addEventListener("focusin", stopAutoplay);
      card.addEventListener("focusout", startAutoplay);
    }

    render();
    startAutoplay();
  }

  function initMagneticButtons() {
    if (prefersReducedMotion || isCoarsePointer || !supportsRAF) return;

    const buttons = $$(".magnetic");
    if (!buttons.length) return;

    buttons.forEach((button) => {
      let rafToken = 0;
      let offsetX = 0;
      let offsetY = 0;

      const updatePosition = () => {
        rafToken = 0;
        button.style.setProperty("--mx", `${offsetX.toFixed(2)}px`);
        button.style.setProperty("--my", `${offsetY.toFixed(2)}px`);
      };

      button.addEventListener("mousemove", (event) => {
        const rect = button.getBoundingClientRect();
        const relativeX = event.clientX - rect.left - rect.width / 2;
        const relativeY = event.clientY - rect.top - rect.height / 2;

        offsetX = relativeX * 0.14;
        offsetY = relativeY * 0.14;

        if (!rafToken) {
          rafToken = window.requestAnimationFrame(updatePosition);
        }
      });

      button.addEventListener("mouseleave", () => {
        offsetX = 0;
        offsetY = 0;
        if (!rafToken) {
          rafToken = window.requestAnimationFrame(updatePosition);
        }
      });
    });
  }

  function initOrbParallax() {
    if (prefersReducedMotion || isCoarsePointer || !supportsRAF) return;

    const orbs = $$(".orb");
    if (!orbs.length) return;

    let pointerX = 0;
    let pointerY = 0;
    let frameX = 0;
    let frameY = 0;
    let running = true;

    const onPointerMove = (event) => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 1.6;
      pointerY = (event.clientY / window.innerHeight - 0.5) * 1.6;
    };

    const tick = () => {
      if (!running) return;

      frameX += (pointerX - frameX) * 0.08;
      frameY += (pointerY - frameY) * 0.08;

      orbs.forEach((orb, index) => {
        const depth = (index + 1) * 6;
        const x = frameX * depth;
        const y = frameY * depth;
        orb.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });

      window.requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", onPointerMove, { passive: true });

    document.addEventListener("visibilitychange", () => {
      running = !document.hidden;
      if (running) window.requestAnimationFrame(tick);
    });

    window.requestAnimationFrame(tick);
  }

  function initHeroParticleBackground() {
    const canvas = $("#heroParticleCanvas");
    const hero = $("#hero");
    if (!canvas || !hero || !supportsRAF) return;

    if (prefersReducedMotion) {
      canvas.style.display = "none";
      return;
    }

    const canUseThree = Boolean(window.THREE) && !window.__threeCdnFailed && !lowPerfMode;

    if (canUseThree) {
      const THREE = window.THREE;

      let isRunning = true;
      let camX = 0;
      let camY = 0;
      let targetX = 0;
      let targetY = 0;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(74, 1, 0.1, 1000);
      camera.position.z = 30;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });

      renderer.setClearAlpha(0);

      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount =
        window.innerWidth <= 680 ? 650 : window.innerWidth <= 1024 ? 900 : 1250;
      const posArray = new Float32Array(particlesCount * 3);

      for (let index = 0; index < particlesCount * 3; index += 1) {
        posArray[index] = (Math.random() - 0.5) * 100;
      }

      particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.14,
        color: "#66f0ff",
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
      });

      const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particlesMesh);

      const setSize = () => {
        const width = Math.max(hero.clientWidth, 1);
        const height = Math.max(hero.clientHeight, 1);
        const dpr = Math.min(window.devicePixelRatio || 1, 1.8);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setPixelRatio(dpr);
        renderer.setSize(width, height, false);
      };

      const onMove = (event) => {
        const rect = hero.getBoundingClientRect();
        const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
        const relativeY = (event.clientY - rect.top) / rect.height - 0.5;
        targetX = relativeX * 4.5;
        targetY = -relativeY * 4.5;
      };

      const onLeave = () => {
        targetX = 0;
        targetY = 0;
      };

      const onVisibilityChange = () => {
        isRunning = !document.hidden;
        if (isRunning) {
          window.requestAnimationFrame(animate);
        }
      };

      const animate = () => {
        if (!isRunning) return;

        particlesMesh.rotation.y += 0.00055;
        particlesMesh.rotation.x += 0.00024;

        camX += (targetX - camX) * 0.08;
        camY += (targetY - camY) * 0.08;

        camera.position.x = camX;
        camera.position.y = camY;

        renderer.render(scene, camera);
        window.requestAnimationFrame(animate);
      };

      setSize();
      hero.addEventListener("mousemove", onMove, { passive: true });
      hero.addEventListener("mouseleave", onLeave, { passive: true });
      window.addEventListener("resize", setSize, { passive: true });
      document.addEventListener("visibilitychange", onVisibilityChange, { passive: true });

      if ("ResizeObserver" in window) {
        const resizeObserver = new ResizeObserver(setSize);
        resizeObserver.observe(hero);
      }

      window.requestAnimationFrame(animate);
      return;
    }

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    let width = 1;
    let height = 1;
    let dpr = 1;
    let particles = [];
    let isRunning = true;
    let pointerX = 0;
    let pointerY = 0;
    let hasPointer = false;

    const makeParticles = () => {
      const count = lowPerfMode
        ? 28
        : window.innerWidth <= 680
          ? 36
          : window.innerWidth <= 1024
            ? 54
            : 74;

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.42,
        vy: (Math.random() - 0.5) * 0.42,
        radius: Math.random() * 1.6 + 0.7,
        alpha: Math.random() * 0.5 + 0.25
      }));
    };

    const setSize = () => {
      width = Math.max(hero.clientWidth, 1);
      height = Math.max(hero.clientHeight, 1);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      makeParticles();
    };

    const onMove = (event) => {
      const rect = hero.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;
      hasPointer = true;
    };

    const onLeave = () => {
      hasPointer = false;
    };

    const onVisibilityChange = () => {
      isRunning = !document.hidden;
      if (isRunning) {
        window.requestAnimationFrame(animate);
      }
    };

    const animate = () => {
      if (!isRunning) return;

      context.clearRect(0, 0, width, height);

      const maxLineDistance = width < 700 ? 96 : 132;

      for (let outer = 0; outer < particles.length; outer += 1) {
        const particle = particles[outer];
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x <= 0 || particle.x >= width) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= height) particle.vy *= -1;

        if (hasPointer) {
          const dx = pointerX - particle.x;
          const dy = pointerY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 160) {
            particle.vx += dx * 0.00001;
            particle.vy += dy * 0.00001;
          }
        }

        particle.vx *= 0.999;
        particle.vy *= 0.999;
        particle.vx = Math.max(-0.75, Math.min(0.75, particle.vx));
        particle.vy = Math.max(-0.75, Math.min(0.75, particle.vy));

        for (let inner = outer + 1; inner < particles.length; inner += 1) {
          const other = particles[inner];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > maxLineDistance) continue;

          const alpha = (1 - distance / maxLineDistance) * 0.26;
          context.strokeStyle = `rgba(102, 240, 255, ${alpha})`;
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        }
      }

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        context.fillStyle = `rgba(170, 243, 255, ${particle.alpha})`;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      }

      window.requestAnimationFrame(animate);
    };

    setSize();
    hero.addEventListener("mousemove", onMove, { passive: true });
    hero.addEventListener("mouseleave", onLeave, { passive: true });
    window.addEventListener("resize", setSize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange, { passive: true });

    if ("ResizeObserver" in window) {
      const resizeObserver = new ResizeObserver(setSize);
      resizeObserver.observe(hero);
    }

    window.requestAnimationFrame(animate);
  }

  function renderGallery() {
    const photoGrid = $("#galleryGrid");
    const videoGrid = $("#videoGrid");

    if (photoGrid) {
      const photoMarkup = GALLERY_PHOTOS.map((photo) => {
        const caption = photo.caption
          ? `<figcaption>${photo.caption}</figcaption>`
          : "";
        return `
          <figure class="portfolio-item reveal" data-category="${photo.category}">
            <img src="${photo.src}" alt="${photo.alt || ""}" loading="lazy" decoding="async" />
            ${caption}
          </figure>`;
      }).join("");

      photoGrid.innerHTML = photoMarkup;
    }

    if (videoGrid) {
      const videoMarkup = GALLERY_VIDEOS.map((clip) => {
        const posterAttr = clip.poster ? ` poster="${clip.poster}"` : "";
        return `
          <figure class="portfolio-item video-item reveal">
            <video controls preload="metadata"${posterAttr} aria-label="${clip.alt || ""}">
              <source src="${clip.src}" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </figure>`;
      }).join("");

      videoGrid.innerHTML = videoMarkup;
    }
  }

  function initGalleryFilter() {
    const filterButtons = $$(".gallery-filter");
    if (!filterButtons.length) return;

    const filterableItems = $$("#galleryGrid .portfolio-item[data-category]");
    if (!filterableItems.length) return;

    function applyFilter(category) {
      filterableItems.forEach((item) => {
        const matches = category === "all" || item.dataset.category === category;
        item.classList.toggle("is-filtered-out", !matches);
      });
    }

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (button.classList.contains("is-active")) return;

        filterButtons.forEach((btn) => {
          btn.classList.remove("is-active");
          btn.setAttribute("aria-selected", "false");
        });
        button.classList.add("is-active");
        button.setAttribute("aria-selected", "true");

        applyFilter(button.dataset.filter);
      });
    });
  }

  function initContactForm() {
    const form = $("#contactForm");
    if (!form) return;

    const statusNode = $(".form-status", form);
    const submitButton = $("button[type='submit']", form);

    const setStatus = (message, kind) => {
      if (!statusNode) return;
      statusNode.textContent = message;
      statusNode.classList.remove("error", "success");
      if (kind) statusNode.classList.add(kind);
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const firstName = $("#firstName", form)?.value.trim() || "";
      const lastName = $("#lastName", form)?.value.trim() || "";
      const email = $("#email", form)?.value.trim() || "";
      const message = $("#message", form)?.value.trim() || "";

      if (!firstName || !lastName || !emailRegex.test(email) || !message) {
        setStatus("Please complete all required fields with a valid email.", "error");
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.setAttribute("aria-busy", "true");
      }

      setStatus("Message sent successfully. We will contact you soon.", "success");

      window.setTimeout(() => {
        form.reset();
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.removeAttribute("aria-busy");
        }
      }, 850);
    });

    form.addEventListener(
      "input",
      () => {
        setStatus("", "");
      },
      { passive: true }
    );
  }

  function initAnimationFallbackMode() {
    const hasGSAP = Boolean(window.gsap && window.ScrollTrigger);

    
    if (!hasGSAP) {
      document.documentElement.classList.add("native-animation-mode");
      return;
    }

    if (prefersReducedMotion) return;

    try {
      window.gsap.from(".hero-kicker", { opacity: 0, y: 18, duration: 0.8, ease: "power2.out" });
      window.gsap.from(".hero-copy h1", { opacity: 0, y: 24, duration: 1, delay: 0.08, ease: "power3.out" });
    } catch (error) {
      document.documentElement.classList.add("native-animation-mode");
      console.warn("[InfantTech] GSAP enhancement unavailable", error);
    }
  }

  function bootstrap() {
    safeRun("loader", initLoader);
    safeRun("year", initYear);
    safeRun("hero-particles", initHeroParticleBackground);
    safeRun("menu", initMobileMenu);
    safeRun("typing", initTyping);
    safeRun("gallery-render", renderGallery);
    safeRun("reveal", initRevealAnimations);
    safeRun("counters", initCounters);
    safeRun("carousel", initCarousel);
    safeRun("gallery-filter", initGalleryFilter);
    safeRun("magnetic", initMagneticButtons);
    safeRun("parallax", initOrbParallax);
    safeRun("contact-form", initContactForm);
    safeRun("animation-fallback", initAnimationFallbackMode);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
  } else {
    bootstrap();
  }
})();