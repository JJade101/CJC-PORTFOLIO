const sections = document.querySelectorAll("section");
const navLinks  = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop    = section.offsetTop - 150;
    const sectionHeight = section.clientHeight;

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
});

/* ─────────────────────────────────────────────────
   ORIGINAL ② — Premium project interaction
───────────────────────────────────────────────── */
const pjCards       = document.querySelectorAll(".project-card");
const pjOverlay     = document.querySelector(".pj-overlay");
const pjPanel       = document.querySelector(".pj-panel");
const pjTitle       = document.querySelector(".pj-title");
const pjDescription = document.querySelector(".pj-description");

// Click handler for project cards
pjCards.forEach(card => {
  card.addEventListener("click", () => {
    const isActive = card.classList.contains("active");

    // Close all panels first
    closePanel();

    if (!isActive) {
      card.classList.add("active");
      pjOverlay.classList.add("show");
      pjPanel.classList.add("show");

      // ALWAYS use data-description from the card div
      const title       = card.querySelector(".project-desc").innerText;
      const description = card.dataset.description || "A featured project showcasing functionality, structure, and clean UI implementation.";

      pjTitle.textContent       = title;
      pjDescription.textContent = description;

      // Handle video autoplay if the card has a <video>
      const video = card.querySelector("video");
      if (video) {
        video.currentTime = 0;
        video.play();
      }
    }
  });
});

// Close panel on overlay click
pjOverlay.addEventListener("click", closePanel);

// Close panel on Escape key
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closePanel();
});

// Close panel function
function closePanel() {
  pjOverlay.classList.remove("show");
  pjPanel.classList.remove("show");
  pjCards.forEach(c => {
    c.classList.remove("active");
    const video = c.querySelector("video");
    if (video) video.pause();
  });
}

/* ─────────────────────────────────────────────────
   ORIGINAL ③ — Video + Description Panel Handling
───────────────────────────────────────────────── */
const pjMediaContainer = document.createElement("div");
pjMediaContainer.classList.add("pj-media-container");
pjPanel.insertBefore(pjMediaContainer, pjDescription); // video above description

pjCards.forEach(card => {
  card.addEventListener("click", () => {
    const isActive = card.classList.contains("active");
    closePanel();

    if (!isActive) {
      card.classList.add("active");
      pjOverlay.classList.add("show");
      pjPanel.classList.add("show");

      const title       = card.querySelector(".project-desc").innerText;
      const description = card.dataset.description || "";

      pjTitle.textContent       = title;
      pjDescription.textContent = description;

      // Handle video only when card has one
      const video = card.querySelector("video");
      pjMediaContainer.innerHTML = ""; // clear previous video
      if (video) {
        const cloneVideo           = video.cloneNode(true);
        cloneVideo.autoplay        = true;
        cloneVideo.controls        = true;
        cloneVideo.muted           = false;
        cloneVideo.style.width     = "100%";
        cloneVideo.style.maxHeight = "50vh";
        pjMediaContainer.appendChild(cloneVideo);
      }
    }
  });
});

function closePanel() {
  pjOverlay.classList.remove("show");
  pjPanel.classList.remove("show");
  pjCards.forEach(c => c.classList.remove("active"));
  // Remove video from panel
  pjMediaContainer.innerHTML = "";
}

/* ==============================================
   NEW ADDITIONS (do not touch originals above)
   ① Navbar background on scroll
   ② Typing effect
   ③ Scroll reveal (fade-in on scroll)
============================================== */

/* NEW ① — Navbar .scrolled class for frosted glass */
(function initNavScroll() {
  const nav = document.querySelector("nav");
  if (!nav) return;
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 30);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // run once on load
})();

/* NEW ② — Typing effect for .home-sub */
(function initTyping() {
  // Inject a <span id="typingText"> into the first line of .home-sub if not present
  const sub = document.querySelector(".home-sub");
  if (!sub) return;

  // Create the typing span if it doesn't exist
  if (!document.getElementById("typingText")) {
    const span   = document.createElement("span");
    span.id      = "typingText";
    const cursor = document.createElement("span");
    cursor.className = "cursor";
    cursor.textContent = "|";

    // Prepend to .home-sub before existing text
    sub.insertBefore(cursor,  sub.firstChild);
    sub.insertBefore(span,    sub.firstChild);
  }

  const el = document.getElementById("typingText");
  if (!el) return;

  const phrases = [
    "Computer Science Student",
    "Aspiring Developer",
    "Creative Problem Solver",
    "CS @ Surigao del Sur"
  ];

  let pIdx    = 0;
  let cIdx    = 0;
  let del     = false;
  const T     = 80;   // type speed ms
  const D     = 42;   // delete speed ms
  const PAUSE = 1800; // pause at end ms
  const WAIT  = 400;  // pause before next phrase

  function tick() {
    const phrase = phrases[pIdx];
    if (!del) {
      el.textContent = phrase.slice(0, cIdx + 1);
      cIdx++;
      if (cIdx === phrase.length) { del = true; setTimeout(tick, PAUSE); return; }
      setTimeout(tick, T);
    } else {
      el.textContent = phrase.slice(0, cIdx - 1);
      cIdx--;
      if (cIdx === 0) {
        del  = false;
        pIdx = (pIdx + 1) % phrases.length;
        setTimeout(tick, WAIT);
        return;
      }
      setTimeout(tick, D);
    }
  }
  setTimeout(tick, 1000);
})();

/* NEW ③ — Scroll reveal: adds .reveal class to key elements
   then uses IntersectionObserver to add .reveal-visible */
(function initReveal() {
  // Elements to animate in
  const targets = [
    ".projects-headline",
    ".project-card",
    "#about h2",
    "#about p",
    "#about ul li",
    ".contacts-top",
    ".contact-links a"
  ];

  targets.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.classList.add("reveal");
    });
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Slight stagger per element within a group
        entry.target.style.transitionDelay = (i * 0.05) + "s";
        entry.target.classList.add("reveal-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
})();