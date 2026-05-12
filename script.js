document.addEventListener("DOMContentLoaded", () => {
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
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const heroStage = document.querySelector("[data-hero-stage]");
  const heroTitle = document.querySelector("[data-hero-title]");
  const heroCopy = document.querySelector("[data-hero-copy]");
  const heroActions = document.querySelector("[data-hero-actions]");

  const themeKey = "angkot-bogor-theme";
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

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

  revealElements.forEach((element) => observer.observe(element));

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

  const renderNoData = () => {
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

  routeSearch.addEventListener("input", applyRouteFilters);

  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      filterPills.forEach((button) => button.classList.remove("active"));
      pill.classList.add("active");
      activeFilter = pill.dataset.routeFilter;
      applyRouteFilters();
    });
  });

  const updateActiveSection = () => {
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

  const parallaxHero = () => {
    if (!heroStage || window.innerWidth < 768) {
      return;
    }

    const offset = window.scrollY * 0.08;
    heroStage.style.transform = `translate3d(0, ${offset * -0.2}px, 0)`;
    heroTitle.style.transform = `translate3d(0, ${offset * 0.08}px, 0)`;
    heroCopy.style.transform = `translate3d(0, ${offset * 0.04}px, 0)`;
    heroActions.style.transform = `translate3d(0, ${offset * 0.02}px, 0)`;
  };

  window.addEventListener("scroll", () => {
    updateActiveSection();
    toggleScrollTop();
    parallaxHero();
  }, { passive: true });

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
  parallaxHero();
});
