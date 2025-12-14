// --- UTILS.JS ---

// 1. DATA & STORAGE KEYS
const STORAGE_KEY = "telco_user_data";
const SESSION_KEY = "telco_user_session";
const HISTORY_KEY = "telco_history";

// Data Produk Diperbarui - Sesuai dengan kategori rekomendasi AI
const DUMMY_PRODUCTS = [
  // Data Booster
  {
    id: 1,
    name: "Data Booster 50GB",
    category: "Data Booster",
    provider: "Tele-X",
    quota: "50 GB",
    speed: "50 Mbps",
    price: 120000,
    type: "Data Booster",
  },
  {
    id: 2,
    name: "Data Booster 100GB",
    category: "Data Booster",
    provider: "GlobalCom",
    quota: "100 GB",
    speed: "100 Mbps",
    price: 200000,
    type: "Data Booster",
  },
  {
    id: 3,
    name: "Data Booster Unlimited",
    category: "Data Booster",
    provider: "PhoneLink",
    quota: "Unlimited",
    speed: "Unlimited FUP",
    price: 300000,
    type: "Data Booster",
  },
  // Device Upgrade Offer
  {
    id: 4,
    name: "Device Upgrade - Smartphone Bundle",
    category: "Device Upgrade Offer",
    provider: "Tele-X",
    quota: "30 GB + Device",
    speed: "25 Mbps",
    price: 5000000,
    type: "Device Upgrade",
  },
  {
    id: 5,
    name: "Device Upgrade - Tablet Bundle",
    category: "Device Upgrade Offer",
    provider: "GlobalCom",
    quota: "50 GB + Device",
    speed: "50 Mbps",
    price: 3500000,
    type: "Device Upgrade",
  },
  // Family Plan Offer
  {
    id: 6,
    name: "Family Plan 4 Lines",
    category: "Family Plan Offer",
    provider: "PhoneLink",
    quota: "40 GB/line",
    speed: "30 Mbps",
    price: 400000,
    type: "Family Plan",
  },
  {
    id: 7,
    name: "Family Plan 6 Lines",
    category: "Family Plan Offer",
    provider: "Tele-X",
    quota: "50 GB/line",
    speed: "50 Mbps",
    price: 600000,
    type: "Family Plan",
  },
  // General Offer
  {
    id: 8,
    name: "General Offer - Paket Hemat",
    category: "General Offer",
    provider: "GlobalCom",
    quota: "25 GB",
    speed: "20 Mbps",
    price: 75000,
    type: "General",
  },
  {
    id: 9,
    name: "General Offer - Paket Standar",
    category: "General Offer",
    provider: "PhoneLink",
    quota: "40 GB",
    speed: "30 Mbps",
    price: 120000,
    type: "General",
  },
  // Retention Offer
  {
    id: 10,
    name: "Retention Offer - Loyalty Bonus",
    category: "Retention Offer",
    provider: "Tele-X",
    quota: "60 GB",
    speed: "40 Mbps",
    price: 100000,
    type: "Retention",
  },
  {
    id: 11,
    name: "Retention Offer - Special Discount",
    category: "Retention Offer",
    provider: "GlobalCom",
    quota: "80 GB",
    speed: "50 Mbps",
    price: 150000,
    type: "Retention",
  },
  // Roaming Pass
  {
    id: 12,
    name: "Roaming Pass - Asia",
    category: "Roaming Pass",
    provider: "PhoneLink",
    quota: "10 GB",
    speed: "20 Mbps",
    price: 250000,
    type: "Roaming",
  },
  {
    id: 13,
    name: "Roaming Pass - Global",
    category: "Roaming Pass",
    provider: "Tele-X",
    quota: "20 GB",
    speed: "30 Mbps",
    price: 500000,
    type: "Roaming",
  },
  // Streaming Partner Pack
  {
    id: 14,
    name: "Streaming Partner Pack - Netflix",
    category: "Streaming Partner Pack",
    provider: "GlobalCom",
    quota: "50 GB + Netflix",
    speed: "50 Mbps",
    price: 180000,
    type: "Streaming",
  },
  {
    id: 15,
    name: "Streaming Partner Pack - Disney+",
    category: "Streaming Partner Pack",
    provider: "PhoneLink",
    quota: "40 GB + Disney+",
    speed: "40 Mbps",
    price: 160000,
    type: "Streaming",
  },
  // Top-up Promo
  {
    id: 16,
    name: "Top-up Promo - Bonus 20%",
    category: "Top-up Promo",
    provider: "Tele-X",
    quota: "Pulsa + Bonus",
    speed: "N/A",
    price: 100000,
    type: "Top-up",
  },
  {
    id: 17,
    name: "Top-up Promo - Double Data",
    category: "Top-up Promo",
    provider: "GlobalCom",
    quota: "2x Kuota",
    speed: "N/A",
    price: 150000,
    type: "Top-up",
  },
  // Voice Bundle
  {
    id: 18,
    name: "Voice Bundle - Unlimited Call",
    category: "Voice Bundle",
    provider: "PhoneLink",
    quota: "Unlimited Menit",
    speed: "N/A",
    price: 80000,
    type: "Voice",
  },
  {
    id: 19,
    name: "Voice Bundle - 1000 Menit",
    category: "Voice Bundle",
    provider: "Tele-X",
    quota: "1000 Menit",
    speed: "N/A",
    price: 50000,
    type: "Voice",
  },
];

// 2. STORAGE & SESSION FUNCTIONS
function saveUser(user) {
  let users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const existingIndex = users.findIndex((u) => u.email === user.email);

  if (existingIndex > -1) {
    users[existingIndex] = { ...users[existingIndex], ...user };
  } else {
    users.push(user);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

  const loggedInUser = getLoggedInUser();
  if (loggedInUser && loggedInUser.email === user.email) {
    setSession(users[existingIndex] || user);
  }
}

function findUser(email, password) {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  return users.find((u) => u.email === email && u.password === password);
}

function getLoggedInUser() {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
}

function setSession(user) {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const fullUser = users.find((u) => u.email === user.email) || user;

  const sessionData = {
    name: fullUser.name,
    email: fullUser.email,
    photoUrl: fullUser.photoUrl || null,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function getHistory() {
  return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
}

function saveHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// 3. UI UTILITY FUNCTIONS
function formatRupiah(number) {
  return number.toLocaleString("id-ID");
}

function showMessage(message, type = "success") {
  const msgBox = document.getElementById("message-box");
  msgBox.textContent = message;
  msgBox.className = `fixed bottom-6 right-6 p-4 rounded-lg shadow-2xl z-max transition-opacity duration-300`;

  if (type === "success") {
    msgBox.classList.add("bg-green-500", "text-white");
  } else if (type === "error") {
    msgBox.classList.add("bg-red-500", "text-white");
  } else {
    msgBox.classList.add("bg-indigo-500", "text-white");
  }

  msgBox.style.opacity = "1";
  setTimeout(() => {
    msgBox.style.opacity = "0";
    setTimeout(() => {
      msgBox.className = ""; // Reset class
    }, 300);
  }, 3000);
}

function getCategoryIcon(category) {
  const iconMap = {
    "Data Booster": "🚀",
    "Device Upgrade Offer": "📱",
    "Family Plan Offer": "👨‍👩‍👧‍👦",
    "General Offer": "🎁",
    "Retention Offer": "💎",
    "Roaming Pass": "✈️",
    "Streaming Partner Pack": "📺",
    "Top-up Promo": "💰",
    "Voice Bundle": "📞",
  };
  return iconMap[category] || "📦";
}

function createProductCard(product, isDashboard = false) {
  const buttonClass = isDashboard
    ? "bg-green-600 hover:bg-green-700"
    : "bg-indigo-600 hover:bg-indigo-700";
  // The global functions must be exposed to window object for inline HTML onclick to work
  const onClickAction = isDashboard
    ? `window.handlePurchaseClick(${product.id})`
    : `window.showModal('register')`; 

  return `
    <div class="flex-shrink-0 w-80 bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-500">
      <div class="flex justify-between items-start mb-4">
        <span class="text-3xl">${getCategoryIcon(product.category)}</span>
        <span class="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">${
          product.provider
        }</span>
      </div>
      <h4 class="text-xl font-bold text-gray-900 mb-2">${product.name}</h4>
      <p class="text-xs font-semibold text-indigo-600 mb-2">${product.category}</p>
      <p class="text-3xl font-extrabold text-indigo-600 mb-4">
        Rp ${formatRupiah(product.price)}
      </p>
      <ul class="text-sm text-gray-700 space-y-2 mb-6">
        <li class="flex items-center"><span class="mr-2 text-indigo-500">✅</span> Kuota: <span class="ml-auto font-medium">${
          product.quota
        }</span></li>
        <li class="flex items-center"><span class="mr-2 text-indigo-500">⚡</span> Kecepatan: <span class="ml-auto font-medium">${
          product.speed
        }</span></li>
        <li class="flex items-center"><span class="mr-2 text-indigo-500">🏷️</span> Jenis: <span class="ml-auto font-medium">${
          product.type
        }</span></li>
      </ul>
      <button
        class="w-full ${buttonClass} text-white font-bold py-2.5 rounded-lg transition duration-300 shadow-md transform hover:scale-[1.02]"
        onclick="${onClickAction}"
      >
        ${isDashboard ? "Beli Sekarang" : "Cari & Daftar"}
      </button>
    </div>
  `;
}

function showModal(formType) {
  const modal = document.getElementById("auth-modal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.style.opacity = "1";
    switchForm(formType);
  }
}

function hideModal() {
  const modal = document.getElementById("auth-modal");
  if (modal) {
    modal.style.opacity = "0";
    setTimeout(() => modal.classList.add("hidden"), 300);
    document.getElementById("login-error").classList.add("hidden");
    document.getElementById("register-error").classList.add("hidden");
  }
}

function switchForm(type) {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const modalTitle = document.getElementById("modal-title");

  if (type === "login") {
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    modalTitle.textContent = "Login ke Akun Anda";
  } else {
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
    modalTitle.textContent = "Buat Akun Baru";
  }
}

// ML API Configuration
const ML_API_URL = "https://ml-project-e6ov.onrender.com";

// Function to call ML API for offer prediction
async function predictOffer(data) {
  try {
    const response = await fetch(`${ML_API_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error calling ML API:", error);
    throw error;
  }
}

export {
  STORAGE_KEY,
  DUMMY_PRODUCTS,
  formatRupiah,
  showMessage,
  createProductCard,
  saveUser,
  findUser,
  getLoggedInUser,
  setSession,
  clearSession,
  getHistory,
  saveHistory,
  showModal,
  hideModal,
  switchForm,
  predictOffer,
  ML_API_URL,
};