// === KONFIGURASI ===
const CONFIG = {
  serverIpAddress: "chaoticsmp.my.id:19132",
  bedrockIpAddress: "chaoticsmp.my.id",
  bedrockPort: 19132,

  staff: {
    owner: "NaafiMC3809",
    admin: "SanoBruh77",
    admin0: "Brannot",
    admin1: "CalvinXMC",
    admin2: "ZIKKSUKANASI",
    admin3: "GlaryNich",
    admin4: "Faturstrong5020",
    admin5: "Kaltzyorientaa"
  },

  statusRefreshMs: 60_000,
};

// === UTIL ===
function $(id) {
  return document.getElementById(id);
}

function setText(id, text) {
  const el = $(id);
  if (el) el.textContent = text;
}

// === COPY IP ===
async function copyIpAddress() {
  const input = $("server-ip-input");
  const feedback = $("copy-feedback");
  const button = $("copy-button");
  if (!input || !feedback || !button) return;

  //copy IP penuh
  input.value = CONFIG.serverIpAddress;

  const successUI = () => {
    feedback.textContent = "Berhasil disalin ke clipboard!";
    feedback.classList.remove("text-red-400");
    feedback.classList.add("text-green-400");

    button.textContent = "Disalin!";
    button.classList.remove("bg-violet-600", "hover:bg-violet-700");
    button.classList.add("bg-green-600", "cursor-not-allowed");

    setTimeout(() => {
      feedback.textContent = "";
      button.textContent = "Salin";
      button.classList.remove("bg-green-600", "cursor-not-allowed");
      button.classList.add("bg-violet-600", "hover:bg-violet-700");
    }, 3000);
  };

  const failUI = () => {
    feedback.textContent = "Gagal menyalin. Salin manual.";
    feedback.classList.remove("text-green-400");
    feedback.classList.add("text-red-400");
  };

  try {
    await navigator.clipboard.writeText(input.value);
    successUI();
  } catch {
    // Fallback untuk browser lama
    try {
      const temp = document.createElement("textarea");
      temp.value = input.value;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      document.body.removeChild(temp);
      successUI();
    } catch {
      failUI();
    }
  }
}

// === SERVER STATUS ===
async function fetchServerStatus() {
  const statusDot = $("status-dot");
  const statusText = $("status-text");
  const playerCount = $("player-count");
  if (!statusDot || !statusText || !playerCount) return;

  try {
    const res = await fetch(`https://api.mcsrvstat.us/bedrock/3/${CONFIG.serverIpAddress}`);
    if (!res.ok) throw new Error("HTTP not ok");
    const data = await res.json();

    if (data.online) {
      statusDot.classList.remove("bg-yellow-500", "bg-red-500", "animate-pulse");
      statusDot.classList.add("bg-green-500");
      statusText.textContent = "Server Online:";
      playerCount.textContent = `${data.players?.online ?? 0}/${data.players?.max ?? "?"}`;
    } else {
      statusDot.classList.remove("bg-yellow-500", "bg-green-500", "animate-pulse");
      statusDot.classList.add("bg-red-500");
      statusText.textContent = "Server Offline";
      playerCount.textContent = "";
    }
  } catch (e) {
    console.error("Error fetching server status:", e);
    statusDot.classList.remove("bg-yellow-500", "bg-green-500", "animate-pulse");
    statusDot.classList.add("bg-red-500");
    statusText.textContent = "Gagal memuat status";
    playerCount.textContent = "";
  }
}

// === SMOOTH SCROLL ===
function addSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const targetId = a.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    });
  });
}

// === ANIMASI SCROLL (IntersectionObserver) ===
function addScrollAnimation() {
  const elements = document.querySelectorAll(".animate-on-scroll");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const obs = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  elements.forEach((el) => obs.observe(el));
}

// === LOAD SKIN STAFF ===
function load2DSkins() {
  const staffList = [
    { canvasId: "skin-owner-canvas", skin: "image/owner.png" },
    { canvasId: "skin-admin-canvas", skin: "image/admin.png" },
    { canvasId: "skin-admin0-canvas", skin: "image/admin0.png" },
    { canvasId: "skin-admin1-canvas", skin :"image/admin1.png"},
    { canvasId: "skin-admin2-canvas", skin :"image/admin2.png"},
    { canvasId: "skin-admin3-canvas", skin :"image/admin3.png"},
    { canvasId: "skin-admin4-canvas", skin :"image/admin4.png"},
    { canvasId: "skin-admin5-canvas", skin :"image/admin5.png"}
  ];

  staffList.forEach(({ canvasId, skin }) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const viewer = new skinview3d.SkinViewer({
      canvas,
      skin,
      width: 150,
      height: 250,
    });

    viewer.camera.position.set(0, 15, 40);
    viewer.zoom = 0.9;
    viewer.animation = new skinview3d.IdleAnimation();
  });
}

// === TYPING ANIMATION UNTUK IP ===
function startTypingIpAnimation() {
  const input = $("server-ip-input");
  if (!input) return;

  const target = CONFIG.serverIpAddress;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    let speed = isDeleting ? 50 : 120;

    if (isDeleting) {
      input.value = target.substring(0, Math.max(0, charIndex - 1));
      charIndex--;
      if (charIndex <= 0) {
        isDeleting = false;
        speed = 1000;
      }
    } else {
      input.value = target.substring(0, Math.min(target.length, charIndex + 1));
      charIndex++;
      if (charIndex >= target.length) {
        isDeleting = true;
        speed = 4000;
      }
    }

    setTimeout(tick, speed);
  }

  tick();
}

// === MOBILE MENU TOGGLE ===
function initMobileMenu() {
  const menuButton = $("mobile-menu-toggle");
  const mobileMenu = $("mobile-menu");
  if (!menuButton || !mobileMenu) return;

  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  menuButton.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("menu-is-open");
    menuButton.classList.toggle("menu-open", isOpen);
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("menu-is-open");
      menuButton.classList.remove("menu-open");
    });
  });
}

// === INIT ===
document.addEventListener("DOMContentLoaded", () => {
  // tombol salin
  const copyBtn = $("copy-button");
  if (copyBtn) copyBtn.addEventListener("click", copyIpAddress);

  // set teks IP
  setText("java-ip-text", `${CONFIG.serverIpAddress}:${CONFIG.bedrockPort}`);
  setText("bedrock-ip-text", CONFIG.bedrockIpAddress);

  // staff names
  setText("name-owner", CONFIG.staff.owner);
  setText("name-admin", CONFIG.staff.admin);
  setText("name-admin0", CONFIG.staff.admin0);
  setText("name-admin1", CONFIG.staff.admin1);
  setText("name-admin2", CONFIG.staff.admin2);
  setText("name-admin3", CONFIG.staff.admin3);
  setText("name-admin4", CONFIG.staff.admin4);
  setText("name-admin5", CONFIG.staff.admin5);

  addSmoothScroll();
  addScrollAnimation();
  initMobileMenu();
  load2DSkins();

  // status server
  fetchServerStatus();
  setInterval(fetchServerStatus, CONFIG.statusRefreshMs);

  // animasi typing
  startTypingIpAnimation();
});
