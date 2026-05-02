const progress = document.querySelector(".progress span");
const glow = document.querySelector(".cursor-glow");
const reveals = document.querySelectorAll(".reveal");
const compare = document.querySelector("[data-compare]");
const interestOutput = document.querySelector("#interest-output");
const workflowOutput = document.querySelector("#workflow-output");
const metricReadout = document.querySelector("#metric-readout");
const metricTicker = document.querySelector("#metric-ticker");
const caseImage = document.querySelector("#case-image");
const caseKicker = document.querySelector("#case-kicker");
const caseTitle = document.querySelector("#case-title");
const showcase = document.querySelector(".showcase");
const siteHeader = document.querySelector(".site-header");

const interests = {
  reading: "Pride & Prejudice",
  learning: "Stitching",
  doing: "Bootstrapping CliniSift",
  eating: "XL shawarma with spicy garlic",
};

const cases = [
  {
    image: "assets/site/recharge-dashboard.jpg",
    kicker: "Owner mindset",
    title: "Bring structure to ambiguous product spaces.",
  },
  {
    image: "assets/site/wizard-ui.jpg",
    kicker: "Smart defaults",
    title: "Start from a useful recommendation, then let merchants refine.",
  },
  {
    image: "assets/site/data-chart.jpg",
    kicker: "Evidence",
    title: "Use behavioral data to decide what needs simplifying first.",
  },
];

const workflow = {
  Claude: "Claude helps turn messy inputs into sharper framing before design energy gets expensive.",
  Stitch: "Stitch compresses early visual exploration into a faster critique loop.",
  Cursor: "Cursor keeps prototypes close to the material reality of code.",
};

const metrics = {
  "4.2x": "4.2x higher same-session deactivation signal exposed where the wizard needed more clarity.",
  "2.2x": "2.2x signal on cross-sell showed that simpler configuration still needed stronger preview confidence.",
  "0x": "No meaningful movement on the subscription widget meant the team could avoid over-designing the wrong surface.",
};

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const pct = scrollable > 0 ? window.scrollY / scrollable : 0;
  if (progress) progress.style.width = `${pct * 100}%`;
  if (siteHeader) siteHeader.classList.toggle("compact", window.scrollY > 42);
}

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

window.addEventListener("load", () => {
  if (!window.location.hash) return;
  const target = document.querySelector(window.location.hash);
  if (target) requestAnimationFrame(() => target.scrollIntoView());
});

window.addEventListener("pointermove", (event) => {
  if (!glow) return;
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.16 }
);

reveals.forEach((item) => observer.observe(item));

document.querySelectorAll("[data-tilt]").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${y * -5}deg) rotateY(${x * 5}deg)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

document.querySelectorAll(".magic-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  });
});

if (compare) {
  const range = compare.querySelector("input");
  const after = compare.querySelector(".compare-after");
  const handle = compare.querySelector(".compare-handle");

  if (range && after) {
    function syncCompare(val) {
      after.style.width = `${val}%`;
      if (handle) handle.style.left = `${val}%`;
    }

    range.addEventListener("input", () => syncCompare(range.value));
    syncCompare(range.value);
  }
}

document.querySelectorAll("[data-interest]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-interest]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    if (interestOutput) interestOutput.textContent = interests[button.dataset.interest];
  });
});

document.querySelectorAll("[data-case]").forEach((card) => {
  card.setAttribute("tabindex", "0");

  function selectCase() {
    const selected = cases[Number(card.dataset.case)];
    document.querySelectorAll("[data-case]").forEach((item) => item.classList.remove("active"));
    card.classList.add("active");
    showcase?.classList.add("swapping");
    setTimeout(() => {
      if (caseImage) caseImage.src = selected.image;
      if (caseKicker) caseKicker.textContent = selected.kicker;
      if (caseTitle) caseTitle.textContent = selected.title;
      showcase?.classList.remove("swapping");
    }, 200);
  }

  card.addEventListener("click", selectCase);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectCase();
    }
  });
});

document.querySelectorAll("[data-tool]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-tool]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    if (workflowOutput) workflowOutput.textContent = workflow[button.dataset.tool];
  });
});

document.querySelectorAll("[data-metric]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-metric]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    if (metricTicker) metricTicker.textContent = button.dataset.metric;
    metricTicker?.animate(
      [
        { opacity: 0, transform: "translateY(10px) scale(0.96)", filter: "blur(8px)" },
        { opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0)" },
      ],
      { duration: 360, easing: "cubic-bezier(.2,.8,.2,1)" }
    );
    if (metricReadout) metricReadout.textContent = metrics[button.dataset.metric];
  });
});

document.querySelector(".theme-toggle")?.addEventListener("click", () => {
  document.body.classList.toggle("contrast");
});

// Nav scroll spy
const navLinks = document.querySelectorAll("nav a");
const spySections = ["story", "work", "systems", "ai"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  },
  { rootMargin: "-38% 0px -38% 0px", threshold: 0 }
);

spySections.forEach((s) => spyObserver.observe(s));
