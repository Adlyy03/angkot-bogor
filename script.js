document.addEventListener("DOMContentLoaded", () => {
  // Scroll to top on page load/refresh
  window.scrollTo(0, 0);
  
  const body = document.body;
  const loadingScreen = document.querySelector("[data-loading-screen]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const navLinks = document.querySelector("[data-nav-links]");
  const navAnchorLinks = Array.from(document.querySelectorAll("[data-nav-links] a"));
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const scrollTopButton = document.querySelector("[data-scroll-top]");
  const revealElements = Array.from(document.querySelectorAll("[data-reveal]"));
  const counters = Array.from(document.querySelectorAll("[data-counter]"));
  const faqItems = Array.from(document.querySelectorAll("[data-faq-item]"));
  const routeCards = Array.from(document.querySelectorAll("[data-route-card]"));
  const routeSearch = document.querySelector("[data-route-search]");
  const filterPills = Array.from(document.querySelectorAll("[data-route-filter]"));
  const routeGrid = document.querySelector(".routes-grid");
  const routeModal = document.querySelector("[data-route-modal]");
  const routeModalCloseButtons = Array.from(document.querySelectorAll("[data-route-modal-close]"));
  const routeDetailButtons = Array.from(document.querySelectorAll("[data-route-detail]"));
  const routeModalCode = document.querySelector("[data-route-modal-code]");
  const routeModalTitle = document.querySelector("[data-route-modal-title]");
  const routeModalSummary = document.querySelector("[data-route-modal-summary]");
  const routeModalDuration = document.querySelector("[data-route-modal-duration]");
  const routeModalDistance = document.querySelector("[data-route-modal-distance]");
  const routeModalPrice = document.querySelector("[data-route-modal-price]");
  const routeModalHours = document.querySelector("[data-route-modal-hours]");
  const routeModalStops = document.querySelector("[data-route-modal-stops]");
  const mapNodes = Array.from(document.querySelectorAll("[data-map-target]"));
  const routeMapStage = document.querySelector("[data-route-map-stage]");
  const mapTooltipTitle = document.querySelector("[data-map-tooltip-title]");
  const mapTooltipText = document.querySelector("[data-map-tooltip-text]");
  const mapSummaryTitle = document.querySelector("[data-map-summary-title]");
  const mapSummaryText = document.querySelector("[data-map-summary-text]");
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const heroStage = document.querySelector("[data-hero-stage]");
  const heroTitle = document.querySelector("[data-hero-title]");
  const heroCopy = document.querySelector("[data-hero-copy]");
  const heroActions = document.querySelector("[data-hero-actions]");
  const header = document.querySelector(".site-header");
  const parallaxLayers = Array.from(document.querySelectorAll("[data-parallax-speed]"));
  const parallaxFaders = Array.from(document.querySelectorAll("[data-parallax-fade]"));
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const hasPageLinks = navAnchorLinks.some((link) => {
    const href = link.getAttribute("href") || "";
    return href && !href.startsWith("#");
  });

  const scrollProgress = document.createElement("div");
  scrollProgress.className = "scroll-progress";
  scrollProgress.innerHTML = '<span data-scroll-progress-fill></span>';
  document.body.prepend(scrollProgress);
  const scrollProgressFill = scrollProgress.querySelector("[data-scroll-progress-fill]");

  const motionTargets = Array.from(
    document.querySelectorAll(
      ".page-hero-card, .page-panel, .page-switch-link, .route-map-panel, .schedule-card, .map-summary, .trust-item, .about-panel, .feature-card, .route-card, .stat-card, .testimonial-card, .cta-card, .search-bar, .icon-button, .primary-button, .secondary-button"
    )
  );

  const themeKey = "angkot-bogor-theme";
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lowCpu = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
  const lowMemory = navigator.deviceMemory && navigator.deviceMemory <= 2;
  const allowParallax = !prefersReducedMotion && !(lowCpu || lowMemory);

  if (!allowParallax) {
    body.classList.add("low-motion");
  }

  const setTheme = (theme) => {
    body.dataset.theme = theme;
    themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
    themeToggle.innerHTML = theme === "dark" ? "<span>☀</span>" : "<span>◐</span>";
    localStorage.setItem(themeKey, theme);
  };

  const storedTheme = localStorage.getItem(themeKey) || (prefersDark ? "dark" : "light");
  setTheme(storedTheme);

  themeToggle.addEventListener("click", () => {
    const nextTheme = body.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  });

  const closeMenu = () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navAnchorLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.addEventListener("click", (event) => {
    if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
      closeMenu();
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
  );

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index * 60, 360)}ms`;
    observer.observe(element);
  });

  const attachTilt = (element) => {
    let rect = null;

    const resetTilt = () => {
      element.style.setProperty("--tilt-x", "0deg");
      element.style.setProperty("--tilt-y", "0deg");
      element.style.setProperty("--lift", "0px");
      element.style.setProperty("--card-scale", "1");
    };

    element.addEventListener("pointerenter", () => {
      rect = element.getBoundingClientRect();
    });

    element.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse") {
        return;
      }

      rect ||= element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      element.style.setProperty("--tilt-x", `${(x * 8).toFixed(2)}deg`);
      element.style.setProperty("--tilt-y", `${(-y * 8).toFixed(2)}deg`);
      element.style.setProperty("--lift", "-6px");
      element.style.setProperty("--card-scale", "1.02");
    });

    element.addEventListener("pointerleave", () => {
      rect = null;
      resetTilt();
    });

    element.addEventListener("pointerdown", () => {
      element.style.setProperty("--card-scale", "1.01");
    });
  };

  motionTargets.forEach((element) => attachTilt(element));

  const updateScrollUi = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;

    if (scrollProgressFill) {
      scrollProgressFill.style.width = `${(progress * 100).toFixed(2)}%`;
    }

    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 12);
    }
  };

  const animateCounter = (element) => {
    const target = Number(element.dataset.counter || "0");
    const suffix = element.dataset.suffix || "";
    const duration = 1600;
    const start = performance.now();

    const tick = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      element.textContent = `${value}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  let countersStarted = false;
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          counters.forEach(animateCounter);
        }
      });
    },
    { threshold: 0.35 }
  );

  if (counters.length) {
    counterObserver.observe(counters[0]);
  }

  faqItems.forEach((item) => {
    const trigger = item.querySelector("button");
    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      faqItems.forEach((current) => current.classList.remove("open"));
      if (!isOpen) {
        item.classList.add("open");
      }
    });
  });

  const routeList = Array.from(routeCards);
  const routeByCode = new Map(routeList.map((card) => [card.dataset.routeCode, card]));

  const mapDetails = {
    B01: { title: "B01 - Bubulak", text: "Trayek aktif menuju Baranangsiang", summary: "Jalur utama barat kota ke pusat mobilitas Bogor." },
    B03: { title: "B03 - Ciawi", text: "Rute wisata dan koneksi antarkawasan", summary: "Cocok untuk perjalanan ke arah Tajur dan Ciawi." },
    B04: { title: "B04 - IPB Dramaga", text: "Rute kampus dengan arus penumpang ramai", summary: "Pilihan utama menuju IPB Dramaga dari Bubulak." },
    B05: { title: "B05 - BTM", text: "Trayek pusat kota yang stabil", summary: "Menghubungkan Warung Jambu, pusat kota, dan BTM." },
  };

  const setMapSelection = (code) => {
    const detail = mapDetails[code] || mapDetails.B01;

    mapNodes.forEach((node) => {
      node.classList.toggle("active", node.dataset.mapTarget === code);
    });

    if (mapTooltipTitle) {
      mapTooltipTitle.textContent = detail.title;
    }

    if (mapTooltipText) {
      mapTooltipText.textContent = detail.text;
    }

    if (mapSummaryTitle) {
      mapSummaryTitle.textContent = detail.title;
    }

    if (mapSummaryText) {
      mapSummaryText.textContent = detail.summary;
    }

    const card = routeByCode.get(code);
    if (card) {
      routeSearch.value = code;
      activeFilter = "all";
      filterPills.forEach((button) => button.classList.toggle("active", button.dataset.routeFilter === "all"));
      applyRouteFilters();
      routeList.forEach((routeCard) => routeCard.classList.remove("is-highlighted"));
      card.classList.add("is-highlighted");
      window.setTimeout(() => card.classList.remove("is-highlighted"), 1200);
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const openRouteModal = (card) => {
    if (!routeModal) {
      return;
    }

    const routeCode = card.dataset.routeCode || "-";
    const routeName = card.dataset.routeName || card.querySelector(".route-title")?.textContent || "Detail trayek";
    const routeDuration = card.dataset.routeDuration || "-";
    const routeDistance = card.dataset.routeDistance || "-";
    const routePrice = card.dataset.routePrice || "-";
    const routeHours = card.dataset.routeHours || "-";
    const routeStops = card.dataset.routeStops || "-";
    const routeStatus = card.dataset.routeStatus || "Trayek aktif";

    routeModalCode.textContent = routeCode;
    routeModalTitle.textContent = routeName;
    routeModalSummary.textContent = `${routeStatus} dan siap dipakai untuk perjalanan harian di Bogor.`;
    routeModalDuration.textContent = routeDuration;
    routeModalDistance.textContent = routeDistance;
    routeModalPrice.textContent = routePrice;
    routeModalHours.textContent = routeHours;
    routeModalStops.textContent = routeStops;

    routeModal.classList.add("open");
    routeModal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");
  };

  const closeRouteModal = () => {
    if (!routeModal) {
      return;
    }

    routeModal.classList.remove("open");
    routeModal.setAttribute("aria-hidden", "true");
    body.classList.remove("modal-open");
  };

  routeDetailButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest("[data-route-card]");
      if (card) {
        openRouteModal(card);
      }
    });
  });

  routeModalCloseButtons.forEach((button) => {
    button.addEventListener("click", closeRouteModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeRouteModal();
    }
  });

  routeModal?.addEventListener("click", (event) => {
    if (event.target === routeModal) {
      closeRouteModal();
    }
  });

  closeRouteModal();

  const renderNoData = () => {
    if (!routeGrid) {
      return null;
    }

    let noData = document.querySelector("[data-no-routes]");
    if (!noData) {
      noData = document.createElement("div");
      noData.className = "no-data";
      noData.dataset.noRoutes = "true";
      noData.textContent = "Tidak ada rute yang cocok dengan pencarian ini.";
      routeGrid?.appendChild(noData);
    }
    return noData;
  };

  let activeFilter = "all";
  const applyRouteFilters = () => {
    if (!routeSearch || !routeGrid || routeList.length === 0) {
      return;
    }

    const query = routeSearch.value.trim().toLowerCase();
    let visibleCount = 0;

    routeList.forEach((card) => {
      const matchesSearch = query === "" || card.dataset.routeKeywords.includes(query);
      const matchesFilter = activeFilter === "all" || card.dataset.routeCategory === activeFilter;
      const show = matchesSearch && matchesFilter;
      card.hidden = !show;
      card.setAttribute("aria-hidden", String(!show));
      card.style.display = show ? "" : "none";
      if (show) {
        visibleCount += 1;
      }
    });

    const noData = renderNoData();
    noData.hidden = visibleCount !== 0;
    noData.style.display = visibleCount === 0 ? "block" : "none";
  };

  if (routeSearch) {
    routeSearch.addEventListener("input", applyRouteFilters);
  }

  mapNodes.forEach((node) => {
    node.addEventListener("click", () => {
      setMapSelection(node.dataset.mapTarget);
    });
  });

  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      filterPills.forEach((button) => button.classList.remove("active"));
      pill.classList.add("active");
      activeFilter = pill.dataset.routeFilter;
      applyRouteFilters();
    });
  });

  if (mapNodes.length) {
    setMapSelection(mapNodes[0].dataset.mapTarget);
  }

  const updateActiveSection = () => {
    if (hasPageLinks) {
      navAnchorLinks.forEach((link) => {
        const linkUrl = new URL(link.getAttribute("href"), window.location.href);
        const linkPage = linkUrl.pathname.split("/").pop() || "index.html";
        const isActive = linkPage === currentPage;
        link.classList.toggle("active", isActive);
      });
      return;
    }

    const scrollPosition = window.scrollY + 130;
    let currentId = sections[0]?.id || "home";

    sections.forEach((section) => {
      if (scrollPosition >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navAnchorLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${currentId}`;
      link.classList.toggle("active", isActive);
    });
  };

  const toggleScrollTop = () => {
    scrollTopButton.classList.toggle("visible", window.scrollY > 420);
  };

  const parallaxHero = (scrollY) => {
    if (!allowParallax || (!heroStage && parallaxLayers.length === 0)) {
      return;
    }

    const y = Math.max(0, scrollY);
    const damp = window.innerWidth < 768 ? 0.6 : 1;

    parallaxLayers.forEach((layer) => {
      const speed = Number(layer.dataset.parallaxSpeed || "0");
      if (!Number.isFinite(speed) || speed === 0) {
        return;
      }

      const offset = Math.min(y * speed * damp, 120);
      layer.style.transform = `translate3d(0, ${(-offset).toFixed(2)}px, 0)`;
    });

    parallaxFaders.forEach((element) => {
      const fadeSpeed = Number(element.dataset.parallaxFade || "0.001");
      const minOpacity = Number(element.dataset.parallaxMinOpacity || "0.55");
      const nextOpacity = Math.max(minOpacity, 1 - y * fadeSpeed);
      element.style.opacity = nextOpacity.toFixed(3);
    });
  };

  let latestScrollY = window.scrollY;
  let scrollRafActive = false;

  const runScrollFrame = () => {
    scrollRafActive = false;
    updateActiveSection();
    toggleScrollTop();
    parallaxHero(latestScrollY);
    updateScrollUi();
  };

  const queueScrollFrame = () => {
    latestScrollY = window.scrollY;
    if (!scrollRafActive) {
      scrollRafActive = true;
      window.requestAnimationFrame(runScrollFrame);
    }
  };

  window.addEventListener("scroll", queueScrollFrame, { passive: true });

  scrollTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768 && navLinks.classList.contains("open")) {
      closeMenu();
    }
  });

  setTimeout(() => {
    loadingScreen.classList.add("hidden");
    body.classList.remove("is-loading");
  }, 900);

  applyRouteFilters();
  updateActiveSection();
  toggleScrollTop();
  updateScrollUi();
  parallaxHero(window.scrollY);
});
