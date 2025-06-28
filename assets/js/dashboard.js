// === Efek Partikel Latar Belakang ===
function createParticles() {
  const container = document.querySelector('.particles');
  if (!container) return;

  const colors = ['#00ffff', '#ff00ff', '#8000ff', '#00ff00'];
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 6}s`;
    particle.style.animationDuration = `${Math.random() * 3 + 3}s`;
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    container.appendChild(particle);
  }
}

// === Navigasi antar Section (SPA) ===
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.page-section');
  const ctaButton = document.getElementById('ctaMulaiBtn');
  if (!navItems.length || !sections.length) return;

  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      const targetId = item.dataset.target;
      navItems.forEach((i) => i.classList.remove('active'));
      item.classList.add('active');
      sections.forEach((section) => {
        section.classList.toggle('hidden', section.id !== targetId);
      });
      if (ctaButton) {
        ctaButton.classList.toggle('hidden', targetId !== 'misi');
      }
      window.location.hash = targetId;
    });
  });

  const initialTarget = document.querySelector('.nav-item.active')?.dataset.target || '';
  if (ctaButton) {
    ctaButton.classList.toggle('hidden', initialTarget !== 'misi');
  }
}

// === Popup Modul ===
function setupModulPopup() {
  const mulaiBtn = document.getElementById('ctaMulaiBtn');
  const modulMenu = document.getElementById('modulMenu');
  const closeBtn = document.getElementById('closeModulMenu');
  if (!mulaiBtn || !modulMenu || !closeBtn) return;

  mulaiBtn.addEventListener('click', () => {
    modulMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  closeBtn.addEventListener('click', () => {
    modulMenu.classList.remove('active');
    document.body.style.overflow = '';
  });

  modulMenu.addEventListener('click', (e) => {
    if (e.target === modulMenu) {
      modulMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// === Hover Modul Background ===
function setupModulDynamicBackground() {
  const modulCards = document.querySelectorAll('.modul-card');
  const bgContainer = document.getElementById('modulBg');
  if (!modulCards.length || !bgContainer) return;

  modulCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const bgImage = card.getAttribute('data-bg');
      if (bgImage) {
        bgContainer.style.backgroundImage = `url(${bgImage})`;
      }
    });
  });
}

// === CTA Observer ===
function setupCtaObserver() {
  const ctaBtn = document.getElementById("ctaMulaiBtn");
  const sectionMisi = document.getElementById("misi");
  if (!ctaBtn || !sectionMisi) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      ctaBtn.style.display = entry.isIntersecting ? 'block' : 'none';
    });
  }, { threshold: 0.3 });

  observer.observe(sectionMisi);
}

// === Scroll Horizontal ===
function scrollMenu(direction) {
  const scrollContainer = document.getElementById('modulScrollArea');
  const scrollAmount = 320;
  if (scrollContainer) {
    scrollContainer.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  }
}

// === Modal Popup Utilities ===
function showModal(htmlContent) {
  const modal = document.getElementById("dashboardModal");
  const modalBody = document.getElementById("modalBody");
  if (!modal || !modalBody) return;

  modalBody.innerHTML = htmlContent;
  modal.classList.remove("hidden");
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById("dashboardModal");
  const modalBody = document.getElementById("modalBody");
  if (!modal || !modalBody) return;

  modal.classList.add("hidden");
  modalBody.innerHTML = "";
  document.body.style.overflow = '';
}

function setupModalControls() {
  const modal = document.getElementById("dashboardModal");
  const modalClose = document.getElementById("modalClose");

  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

// === Konten Dinamis Modal ===
function generateQuestModalContent(quests) {
  return `
    <h3><img src="/assets/images/icon-small/rocket.png" class="icon-img" alt="modul" /> Misi Aktif Hari Ini</h3>
    <ul>
      <li>Total misi aktif: <strong>${quests}</strong></li>
      <li>Contoh: Selesaikan 1 Modul</li>
      <li>Contoh: Login 3 hari berturut-turut</li>
      <li>Contoh: Kumpulkan 500 XP</li>
    </ul>
  `;
}

function generateModulModalContent(modules) {
  if (modules && modules.length > 0) {
    const listItems = modules.map(mod => {
      const title = mod.title || "Modul Tanpa Nama";
      const progress = (typeof mod.progress === 'number' && !isNaN(mod.progress)) ? Math.round(mod.progress) : 0;
      const icon = `<img src="/assets/images/icon-small/javascript.png" class="modul-icon-img" alt="icon" />`;
      return `<li>${icon} <strong>${title}</strong> – ${progress}%</li>`;
    }).join("");

    return `
      <h3><img src="/assets/images/icon-small/module-icon.png" class="icon-img" alt="modul" /> Modul Aktif Kamu</h3>
      <ul>${listItems}</ul>
      <a href='/modul'>Lihat Semua Modul →</a>
    `;
  } else {
    return `
      <h3>img src="/assets/images/icon-small/module-icon.png" alt="modul" /> Modul Aktif Kamu</h3>
      <p>Kamu belum memiliki modul aktif saat ini.</p>
    `;
  }
}

// === Klik Card Dashboard Utama ===
function setupDashboardCardActions() {
  const cardProgress = document.getElementById("cardProgress");
  const cardLastModule = document.getElementById("cardLastModule");
  const cardQuest = document.getElementById("cardQuest");
  const cardAI = document.getElementById("cardAI");
  const cardModul = document.getElementById("cardModul");

  if (cardProgress) {
    cardProgress.addEventListener("click", () => {
      alert("Detail progres belajar akan segera hadir 🎯");
    });
  }

  if (cardLastModule) {
    cardLastModule.addEventListener("click", () => {
      alert("Lanjutkan modul terakhir kamu. 🚀");
    });
  }

  if (cardQuest) {
    cardQuest.addEventListener("click", () => {
      const quests = (window.userData && userData.active_quests) || 0;
      const content = generateQuestModalContent(quests);
      showModal(content);
    });
  }

  if (cardAI) {
    cardAI.addEventListener("click", () => {
      alert("Nova & Algorhizmi akan hadir dalam waktu dekat. 🤖");
    });
  }

  if (cardModul) {
    cardModul.addEventListener("click", () => {
      const modules = (window.userData && userData.current_modules) || [];
      const content = generateModulModalContent(modules);
      showModal(content);
    });
  }
}

// === Inisialisasi Semua ===
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  setupNavigation();
  setupModulPopup();
  setupModulDynamicBackground();
  setupCtaObserver();
  setupModalControls();
  setupDashboardCardActions();
});
