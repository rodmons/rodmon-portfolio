const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const year = document.querySelector("#year");
const mediaImages = document.querySelectorAll(".media-slot .asset-image");
const reelDialog = document.querySelector("#reel-dialog");
const reelEmbed = document.querySelector(".reel-video-embed");
const reelOpenButton = document.querySelector("[data-open-reel]");
const reelCloseButton = document.querySelector("[data-close-reel]");
const reelThumbnailImage = document.querySelector("[data-open-reel] .asset-image");
const reelThumbnailFallback = document.querySelector("[data-open-reel] .media-fallback");
const reelDialogTitle = document.querySelector("#reel-dialog-title");
const reelSwitchButtons = document.querySelectorAll("[data-reel-type]");
const reelMicro = document.querySelector("[data-reel-micro]");
const reelHeading = document.querySelector("[data-reel-heading]");
const reelBody = document.querySelector("[data-reel-body]");
const reelFooter = document.querySelector("[data-reel-footer]");
const galleryTabs = document.querySelectorAll("[data-gallery-tab]");
const galleryItems = document.querySelectorAll("[data-gallery-item]");
const galleryToggle = document.querySelector("[data-gallery-toggle]");
const galleryLightbox = document.querySelector("#gallery-lightbox");
const galleryLightboxImage = document.querySelector(".gallery-lightbox-image");
const galleryLightboxClose = document.querySelector(".gallery-lightbox-close");

const reelModes = {
  live: {
    thumbnail: "assets/demo_reel/live_action_thumbnail.jpg",
    embed: "https://player.vimeo.com/video/874232000",
    alt: "Live action demo reel thumbnail",
    fallback: "Live Action Demo Reel 2023",
    micro: "SKL_01 - 08",
    heading: "Integration. Cleanup.<br />Keying. Color Matching.<br />CG Compositing. Tracking.<br />Roto. Final Polish.",
    body: "With experience across animation, live-action, and high-end visual effects, I focus on creating polished, seamless imagery through compositing, integration, cleanup, keying, roto, and final shot refinement.",
    footer: ["PX_LUT - 006", "16:9 / 24FPS / ACES 1.3"],
  },
  animation: {
    thumbnail: "assets/demo_reel/animation_thumbnail.jpg",
    embed: "https://player.vimeo.com/video/458824989",
    alt: "CG animation compositing reel thumbnail",
    fallback: "Animation Compositing Reel 2020",
    micro: "CG_01 - 06",
    heading: "Character Integration.<br />Lighting Balance.<br />Render Polish.<br />Depth. Atmosphere.<br />Color Continuity.<br />Final Compositing.",
    body: "For CG animation, I focus on bringing rendered elements into a polished final frame - balancing lighting, color, depth, atmosphere, and character integration while preserving the intent of the animation and art direction.",
    footer: ["ANIM_COMP - 012", "16:9 / 24FPS / ACES 1.3"],
  },
};

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation");
    }
  });
}

mediaImages.forEach((image) => {
  const slot = image.closest(".media-slot");

  const showImage = () => {
    slot.classList.add("has-image");
    slot.classList.remove("image-error");
  };
  const showFallback = () => {
    slot.classList.remove("has-image");
    slot.classList.add("image-error");
  };

  image.addEventListener("load", showImage);
  image.addEventListener("error", showFallback);

  if (image.complete) {
    if (image.naturalWidth > 0) {
      showImage();
    } else {
      showFallback();
    }
  }
});

if (reelDialog && reelEmbed && reelOpenButton && reelCloseButton) {
  let selectedEmbed = "";

  const applyReelMode = (type) => {
    const mode = reelModes[type] || reelModes.live;
    selectedEmbed = mode.embed;

    reelSwitchButtons.forEach((button) => {
      const isActive = button.dataset.reelType === type;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (reelThumbnailImage) {
      reelOpenButton.classList.remove("has-image", "image-error");
      reelThumbnailImage.src = mode.thumbnail;
      reelThumbnailImage.alt = mode.alt;

      if (reelThumbnailImage.complete) {
        reelOpenButton.classList.toggle("has-image", reelThumbnailImage.naturalWidth > 0);
        reelOpenButton.classList.toggle("image-error", reelThumbnailImage.naturalWidth === 0);
      }
    }

    if (reelThumbnailFallback) {
      reelThumbnailFallback.textContent = mode.fallback;
    }

    if (reelDialogTitle) {
      reelDialogTitle.textContent = mode.fallback;
    }

    if (reelMicro) {
      reelMicro.textContent = mode.micro;
    }

    if (reelHeading) {
      reelHeading.innerHTML = mode.heading;
    }

    if (reelBody) {
      reelBody.textContent = mode.body;
    }

    if (reelFooter) {
      reelFooter.innerHTML = mode.footer.map((item) => `<span>${item}</span>`).join("");
    }
  };

  applyReelMode("live");

  reelSwitchButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyReelMode(button.dataset.reelType);
    });
  });

  reelOpenButton.addEventListener("click", () => {
    reelDialog.showModal();
    if (selectedEmbed) {
      reelEmbed.src = `${selectedEmbed}?autoplay=1&title=0&byline=0&portrait=0`;
    }
  });

  const closeReel = () => {
    reelEmbed.src = "";
    reelDialog.close();
  };

  reelCloseButton.addEventListener("click", closeReel);

  reelDialog.addEventListener("click", (event) => {
    if (event.target === reelDialog) {
      closeReel();
    }
  });

  reelDialog.addEventListener("close", () => {
    reelEmbed.src = "";
  });
}

if (galleryTabs.length && galleryItems.length) {
  const visibleLimit = 8;
  let currentGalleryCategory = "photography";
  let isGalleryExpanded = false;

  const updateGalleryToggle = (visibleCount) => {
    if (!galleryToggle) {
      return;
    }

    galleryToggle.hidden = visibleCount <= visibleLimit;
    galleryToggle.textContent = isGalleryExpanded ? "Show Less ↑" : "View All →";
  };

  const showGalleryCategory = (category, expanded = false) => {
    currentGalleryCategory = category;
    isGalleryExpanded = expanded;
    let visibleCount = 0;

    galleryItems.forEach((item) => {
      const matchesCategory = item.dataset.category === category;

      item.classList.toggle("is-hidden", !matchesCategory);
      item.classList.remove("is-overflow-hidden");

      if (!matchesCategory) {
        return;
      }

      visibleCount += 1;

      if (!isGalleryExpanded && visibleCount > visibleLimit) {
        item.classList.add("is-overflow-hidden");
      }
    });

    updateGalleryToggle(visibleCount);
  };

  const activeTab = document.querySelector(".gallery-tab.is-active");
  const initialTab = activeTab || [...galleryTabs].find((tab) => tab.dataset.galleryTab === "photography") || galleryTabs[0];
  const initialCategory = initialTab.dataset.galleryTab || "photography";

  galleryTabs.forEach((item) => {
    item.classList.toggle("is-active", item === initialTab);
  });

  showGalleryCategory(initialCategory);

  galleryTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const category = tab.dataset.galleryTab;

      galleryTabs.forEach((item) => {
        item.classList.toggle("is-active", item === tab);
      });

      showGalleryCategory(category, false);
    });
  });

  if (galleryToggle) {
    galleryToggle.addEventListener("click", () => {
      showGalleryCategory(currentGalleryCategory, !isGalleryExpanded);
    });
  }

  const openGalleryLightbox = (image) => {
    if (!galleryLightbox || !galleryLightboxImage) {
      return;
    }

    galleryLightboxImage.src = image.dataset.full || image.currentSrc || image.src;
    galleryLightboxImage.alt = image.alt || "";
    galleryLightbox.classList.add("is-open");
    galleryLightbox.setAttribute("aria-hidden", "false");
    galleryLightboxClose?.focus();
  };

  const closeGalleryLightbox = () => {
    if (!galleryLightbox || !galleryLightboxImage) {
      return;
    }

    galleryLightbox.classList.remove("is-open");
    galleryLightbox.setAttribute("aria-hidden", "true");
    galleryLightboxImage.src = "";
    galleryLightboxImage.alt = "";
  };

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const image = item.querySelector("img");

      if (!image || !image.getAttribute("src")) {
        return;
      }

      openGalleryLightbox(image);
    });
  });

  galleryLightboxClose?.addEventListener("click", closeGalleryLightbox);

  galleryLightbox?.addEventListener("click", (event) => {
    if (event.target === galleryLightbox) {
      closeGalleryLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && galleryLightbox?.classList.contains("is-open")) {
      closeGalleryLightbox();
    }
  });
}
