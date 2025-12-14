// --- DASHBOARD.JS ---

import {
  formatRupiah,
  createProductCard,
  DUMMY_PRODUCTS,
  getHistory,
  saveHistory,
  getLoggedInUser,
  showMessage,
  showModal,
  saveUser,
  setSession,
  predictOffer,
} from "./utils.js";
import { showPaymentModal } from "./payment.js"; // from payment.js

// Expose to window for inline HTML onclick in renderRekomendasiPage
window.getLoggedInUser = getLoggedInUser;

// --- RENDER HALAMAN DASHBOARD ---

// Daftar kategori sesuai rekomendasi AI
const ML_CATEGORIES = [
  "Data Booster",
  "Device Upgrade Offer",
  "Family Plan Offer",
  "General Offer",
  "Retention Offer",
  "Roaming Pass",
  "Streaming Partner Pack",
  "Top-up Promo",
  "Voice Bundle",
];

function renderRekomendasiPage(user, filter = "semua", mlPrediction = null) {
  // Jika ada rekomendasi AI, otomatis filter ke kategori yang direkomendasikan
  let activeFilter = filter;
  if (mlPrediction && mlPrediction.prediction) {
    activeFilter = mlPrediction.prediction;
  }

  let filteredProducts = DUMMY_PRODUCTS;

  if (activeFilter !== "semua") {
    // Filter berdasarkan kategori rekomendasi AI
    filteredProducts = DUMMY_PRODUCTS.filter((p) => p.category === activeFilter);
  }

  const activeClass = (f) =>
    f === activeFilter
      ? "bg-indigo-600 text-white"
      : "bg-white text-indigo-600 border border-indigo-300";

  return `
    <h2 class="text-3xl font-extrabold text-gray-900 mb-6">Rekomendasi Paket</h2>
    
    ${mlPrediction && mlPrediction.prediction ? `
      <div class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold mb-2">🎯 Rekomendasi AI untuk Anda</h3>
            <p class="text-lg">Berdasarkan analisis penggunaan Anda, kami merekomendasikan:</p>
            <p class="text-3xl font-extrabold mt-2">${mlPrediction.prediction}</p>
            <p class="text-sm mt-2 opacity-90">Paket yang sesuai dengan rekomendasi ditampilkan di bawah</p>
          </div>
          <div class="text-6xl">🤖</div>
        </div>
      </div>
    ` : `
      <div class="bg-indigo-50 border-2 border-indigo-200 p-6 rounded-xl mb-6">
        <h3 class="text-xl font-bold text-indigo-900 mb-3">💡 Dapatkan Rekomendasi Personalisasi dengan AI</h3>
        <p class="text-gray-700 mb-4">Isi data penggunaan Anda untuk mendapatkan rekomendasi paket yang paling sesuai dengan kebutuhan Anda.</p>
        <button 
          id="show-ml-form-btn"
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition duration-150"
        >
          Isi Form Rekomendasi AI
        </button>
      </div>
    `}
    
    <div id="ml-form-container" class="hidden bg-white p-6 rounded-xl shadow-lg mb-6">
      <h3 class="text-xl font-bold text-gray-900 mb-4">Form Data Penggunaan</h3>
      <form id="ml-recommendation-form" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="plan_type" class="block text-sm font-medium text-gray-700 mb-1">Tipe Paket Saat Ini</label>
            <select id="plan_type" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" required>
              <option value="">-- Pilih Tipe Paket --</option>
              <option value="Prepaid">Prepaid</option>
              <option value="Postpaid">Postpaid</option>
            </select>
          </div>
          <div>
            <label for="device_brand" class="block text-sm font-medium text-gray-700 mb-1">Merek Device</label>
            <select id="device_brand" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" required>
              <option value="">-- Pilih Merek --</option>
              <option value="Samsung">Samsung</option>
              <option value="Apple">Apple</option>
              <option value="Xiaomi">Xiaomi</option>
              <option value="Oppo">Oppo</option>
              <option value="Vivo">Vivo</option>
              <option value="Realme">Realme</option>
              <option value="Other">Lainnya</option>
            </select>
          </div>
          <div>
            <label for="avg_data_usage_gb" class="block text-sm font-medium text-gray-700 mb-1">Rata-rata Penggunaan Data (GB/bulan)</label>
            <input type="number" id="avg_data_usage_gb" step="0.1" min="0" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="Contoh: 25.5" required/>
          </div>
          <div>
            <label for="pct_video_usage" class="block text-sm font-medium text-gray-700 mb-1">Persentase Penggunaan Video (%)</label>
            <input type="number" id="pct_video_usage" step="0.1" min="0" max="100" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="Contoh: 60" required/>
          </div>
          <div>
            <label for="avg_call_duration" class="block text-sm font-medium text-gray-700 mb-1">Rata-rata Durasi Panggilan (menit)</label>
            <input type="number" id="avg_call_duration" step="0.1" min="0" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="Contoh: 15.5" required/>
          </div>
          <div>
            <label for="sms_freq" class="block text-sm font-medium text-gray-700 mb-1">Frekuensi SMS (kali/bulan)</label>
            <input type="number" id="sms_freq" min="0" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="Contoh: 50" required/>
          </div>
          <div>
            <label for="monthly_spend" class="block text-sm font-medium text-gray-700 mb-1">Pengeluaran Bulanan (Rp)</label>
            <input type="number" id="monthly_spend" step="1000" min="0" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="Contoh: 150000" required/>
          </div>
          <div>
            <label for="topup_freq" class="block text-sm font-medium text-gray-700 mb-1">Frekuensi Top Up (kali/bulan)</label>
            <input type="number" id="topup_freq" min="0" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="Contoh: 3" required/>
          </div>
          <div>
            <label for="travel_score" class="block text-sm font-medium text-gray-700 mb-1">Travel Score (1-10)</label>
            <input type="number" id="travel_score" min="1" max="10" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="Contoh: 5" required/>
          </div>
          <div>
            <label for="complaint_count" class="block text-sm font-medium text-gray-700 mb-1">Jumlah Komplain (kali)</label>
            <input type="number" id="complaint_count" min="0" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="Contoh: 0" required/>
          </div>
        </div>
        <div class="flex space-x-3">
          <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-150">
            Dapatkan Rekomendasi AI
          </button>
          <button type="button" id="hide-ml-form-btn" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition duration-150">
            Batal
          </button>
        </div>
      </form>
    </div>
    
    <div class="flex space-x-3 mb-8 overflow-x-auto pb-2">
      <button class="flex-shrink-0 px-4 py-2 rounded-full font-semibold transition ${activeClass(
        "semua"
      )}" onclick="window.loadDashboardContent('rekomendasi', window.getLoggedInUser(), { filter: 'semua' })">Semua Paket (${
    DUMMY_PRODUCTS.length
  })</button>
      ${ML_CATEGORIES.map((cat) => {
        const count = DUMMY_PRODUCTS.filter((p) => p.category === cat).length;
        return `<button class="flex-shrink-0 px-4 py-2 rounded-full font-semibold transition ${activeClass(
          cat
        )}" onclick="window.loadDashboardContent('rekomendasi', window.getLoggedInUser(), { filter: '${cat}' })">${cat} (${count})</button>`;
      }).join("")}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${
        filteredProducts.length > 0
          ? filteredProducts
              .map((product) => createProductCard(product, true))
              .join("")
          : `<p class="text-gray-500 text-lg p-6 bg-white rounded-lg shadow-md">Tidak ada paket tersedia untuk kategori ${activeFilter}.</p>`
      }
    </div>
  `;
}

function renderTransaksiPage(user) {
  const userHistory = getHistory().filter((h) => h.userId === user.email);

  return `
    <h2 class="text-3xl font-extrabold text-gray-900 mb-6">Riwayat Transaksi</h2>
    <div class="bg-white p-6 rounded-xl shadow-lg space-y-4">
      ${
        userHistory.length > 0
          ? userHistory
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((history) => {
                const statusColor =
                  history.status === "Selesai"
                    ? "bg-green-100 text-green-700"
                    : history.status === "Dibatalkan"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700";
                const icon = history.type.includes("Topup") ? "💸" : "📦";
                return `
                  <div class="flex justify-between items-center border-b pb-3 pt-3">
                    <div class="flex items-center">
                      <span class="text-2xl mr-4">${icon}</span>
                      <div>
                        <p class="font-semibold text-gray-800">${
                          history.packageName
                        }</p>
                        <p class="text-sm text-gray-500">${history.date} (${
                  history.type
                })</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="font-bold text-lg text-indigo-600">Rp ${formatRupiah(
                        history.amount
                      )}</p>
                      <span class="text-xs font-medium px-2 py-1 rounded-full ${statusColor}">${
                  history.status
                }</span>
                    </div>
                  </div>
                `;
              })
              .join("")
          : `<p class="text-gray-500 text-center py-4">Belum ada riwayat transaksi.</p>`
      }
    </div>
  `;
}

function renderTopupPage(user) {
  return `
    <h2 class="text-3xl font-extrabold text-gray-900 mb-6">Isi Pulsa / Dana</h2>
    <form id="topup-form" class="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg space-y-6">
      <div id="topup-error" class="text-red-500 hidden text-sm font-semibold p-2 bg-red-100 rounded-lg"></div>

      <div>
        <label for="topup-number" class="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon/ID Dana</label>
        <input type="text" id="topup-number" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="Contoh: 0812xxxxxx atau ID Dana" required/>
      </div>

      <div>
        <label for="topup-amount" class="block text-sm font-medium text-gray-700 mb-1">Pilih Nominal (Pulsa/Dana)</label>
        <select id="topup-amount" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" required>
          <option value="">-- Pilih Nominal --</option>
          <option value="25000">Rp 25.000</option>
          <option value="50000">Rp 50.000</option>
          <option value="100000">Rp 100.000</option>
          <option value="200000">Rp 200.000</option>
        </select>
      </div>

      <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-md transition duration-150">
        Top Up Sekarang
      </button>
    </form>
  `;
}

function renderGantiPasswordPage() {
  return `
    <h2 class="text-3xl font-extrabold text-gray-900 mb-6">Ganti Password</h2>
    
    <form id="change-password-form" class="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg space-y-6">
      <div id="password-error" class="text-red-500 hidden text-sm font-semibold p-2 bg-red-100 rounded-lg"></div>

      <div><label for="current-password" class="block text-sm font-medium text-gray-700 mb-1">Password Saat Ini</label><input type="password" id="current-password" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" required/></div>
      <div><label for="new-password" class="block text-sm font-medium text-gray-700 mb-1">Password Baru (min 6 karakter)</label><input type="password" id="new-password" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" minlength="6" required/></div>
      <div><label for="confirm-new-password" class="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label><input type="password" id="confirm-new-password" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" minlength="6" required/></div>

      <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition duration-150">
        Simpan Perubahan
      </button>
    </form>
  `;
}

function renderHomePage(user) {
  const userHistory = getHistory().filter((h) => h.userId === user.email);
  return `
    <h2 class="text-3xl font-extrabold text-gray-900 mb-6">Beranda User</h2>
    <div class="bg-white p-8 rounded-xl shadow-lg space-y-4">
      <p class="text-lg text-gray-700">Selamat datang di Dashboard Anda. Di sini Anda bisa melihat rekomendasi paket terbaik, cek riwayat transaksi, dan mengelola akun.</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div class="p-4 bg-indigo-50 rounded-lg text-indigo-700 font-semibold text-center">
          Total Transaksi Selesai: ${
            userHistory.filter((h) => h.status === "Selesai").length
          }
        </div>
        <div class="p-4 bg-teal-50 rounded-lg text-teal-700 font-semibold text-center">
          Total Paket Tersedia: ${DUMMY_PRODUCTS.length}
        </div>
        <div class="p-4 bg-red-50 rounded-lg text-red-700 font-semibold text-center">
          Akun Aktif: ${user.email}
        </div>
      </div>
    </div>
  `;
}

// Global function exposed to window for inline calls in HTML and cross-module calls
function loadDashboardContent(page, user, options = {}) {
  const contentArea = document.getElementById("dashboard-content");
  let contentHTML = "";

  document.querySelectorAll(".sidebar-link").forEach((link) => {
    link.classList.remove("active");
  });
  const activeLink = document.querySelector(
    `.sidebar-link[data-page="${page}"]`
  );
  if (activeLink) {
    activeLink.classList.add("active");
  }

  switch (page) {
    case "rekomendasi":
      contentHTML = renderRekomendasiPage(user, options.filter || "semua", options.mlPrediction || null);
      break;
    case "home":
      contentHTML = renderHomePage(user);
      break;
    case "topup":
      contentHTML = renderTopupPage(user);
      break;
    case "transaksi":
      contentHTML = renderTransaksiPage(user);
      break;
    case "ganti-password":
      contentHTML = renderGantiPasswordPage();
      break;
    default:
      contentHTML = renderRekomendasiPage(user, "semua");
      break;
  }

  contentArea.innerHTML = contentHTML;

  // Pasang Listener setelah render
  if (page === "ganti-password") {
    // handleUpdatePassword exposed globally in main.js via window.authExports
    const handleUpdatePassword = window.authExports.handleUpdatePassword;
    document
      .getElementById("change-password-form")
      .addEventListener("submit", (e) => handleUpdatePassword(e, user));
  }
  if (page === "topup") {
    document
      .getElementById("topup-form")
      .addEventListener("submit", (e) => handleTopup(e, user));
  }
  if (page === "rekomendasi") {
    // ML Form handlers
    const showFormBtn = document.getElementById("show-ml-form-btn");
    const hideFormBtn = document.getElementById("hide-ml-form-btn");
    const mlForm = document.getElementById("ml-recommendation-form");
    const mlFormContainer = document.getElementById("ml-form-container");

    if (showFormBtn) {
      showFormBtn.addEventListener("click", () => {
        if (mlFormContainer) {
          mlFormContainer.classList.remove("hidden");
        }
      });
    }

    if (hideFormBtn) {
      hideFormBtn.addEventListener("click", () => {
        if (mlFormContainer) {
          mlFormContainer.classList.add("hidden");
        }
      });
    }

    if (mlForm) {
      mlForm.addEventListener("submit", (e) => handleMLRecommendation(e, user));
    }
  }
}

// --- TRANSACTION HANDLERS ---

function handlePurchaseClick(productId) {
  const user = getLoggedInUser();
  if (!user) {
    showMessage("Anda harus login untuk melakukan pembelian.", "error");
    window.showModal("login"); // Global function from utils.js
    return;
  }
  const product = DUMMY_PRODUCTS.find((p) => p.id === productId);
  if (product) {
    showPaymentModal(product); // from payment.js
  }
}

function handleTopup(e, user) {
  e.preventDefault();
  const number = document.getElementById("topup-number").value;
  const amount = parseInt(document.getElementById("topup-amount").value);
  const errorElement = document.getElementById("topup-error");
  errorElement.classList.add("hidden");

  if (!amount) {
    errorElement.textContent = "Silakan pilih nominal Top Up.";
    errorElement.classList.remove("hidden");
    return;
  }

  // 1. Catat Transaksi Topup
  const transactionName = number.length > 10 ? "Top Up Dana" : "Isi Pulsa";

  const newTransaction = {
    id: Date.now(),
    userId: user.email,
    date: new Date().toISOString().slice(0, 10),
    packageName: `${transactionName} ${number}`,
    amount: amount,
    status: "Selesai",
    type: transactionName,
  };

  const history = getHistory();
  history.push(newTransaction);
  saveHistory(history);

  // 2. Beri Feedback dan Reset Form
  document.getElementById("topup-form").reset();
  showMessage(
    `${transactionName} sebesar Rp ${formatRupiah(amount)} berhasil!`,
    "success"
  );

  // 3. Render ulang halaman transaksi
  loadDashboardContent("transaksi", user);
}

async function handleMLRecommendation(e, user) {
  e.preventDefault();
  
  // Collect form data
  const formData = {
    device_brand: document.getElementById("device_brand").value,
    plan_type: document.getElementById("plan_type").value,
    avg_data_usage_gb: parseFloat(document.getElementById("avg_data_usage_gb").value),
    pct_video_usage: parseFloat(document.getElementById("pct_video_usage").value),
    avg_call_duration: parseFloat(document.getElementById("avg_call_duration").value),
    sms_freq: parseInt(document.getElementById("sms_freq").value),
    monthly_spend: parseFloat(document.getElementById("monthly_spend").value),
    topup_freq: parseInt(document.getElementById("topup_freq").value),
    travel_score: parseInt(document.getElementById("travel_score").value),
    complaint_count: parseInt(document.getElementById("complaint_count").value),
  };

  // Validate all fields are filled
  for (const [key, value] of Object.entries(formData)) {
    if (value === "" || value === null || value === undefined) {
      showMessage(`Mohon lengkapi semua field, terutama ${key.replace(/_/g, " ")}`, "error");
      return;
    }
  }

  try {
    showMessage("Memproses rekomendasi AI...", "info");
    
    // Call ML API
    const result = await predictOffer(formData);
    
    if (result && result.prediction) {
      // Hide form and show prediction
      const mlFormContainer = document.getElementById("ml-form-container");
      if (mlFormContainer) {
        mlFormContainer.classList.add("hidden");
      }
      
      // Reload page with prediction - filter otomatis ke kategori yang direkomendasikan
      loadDashboardContent("rekomendasi", user, { 
        filter: result.prediction, // Filter otomatis ke kategori rekomendasi
        mlPrediction: result 
      });
      
      showMessage(`Rekomendasi AI: ${result.prediction}. Paket yang sesuai ditampilkan di bawah.`, "success");
    } else {
      showMessage("Tidak dapat mendapatkan rekomendasi. Silakan coba lagi.", "error");
    }
  } catch (error) {
    console.error("Error getting ML recommendation:", error);
    showMessage("Terjadi kesalahan saat memproses rekomendasi. Pastikan API tersedia.", "error");
  }
}

// --- PROFILE IMAGE HANDLER ---

function handleProfileImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  // Memastikan ukuran file tidak terlalu besar (misalnya, maks 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showMessage("Ukuran file terlalu besar (Maks 5MB).", "error");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const imageUrl = e.target.result;
    const user = getLoggedInUser();

    // 1. Update data di localStorage (User Master Data)
    let users = JSON.parse(localStorage.getItem("telco_user_data")) || [];
    const userIndex = users.findIndex((u) => u.email === user.email);

    if (userIndex !== -1) {
      const storedUser = users[userIndex];
      storedUser.photoUrl = imageUrl; // Simpan URL Data
      saveUser(storedUser); // Simpan kembali ke master data (from utils.js)

      // 2. Update sesi yang sedang berjalan
      setSession(storedUser); // Perbarui sesi dengan data lengkap (from utils.js)
    }

    // 3. Render ulang UI
    showMessage("Foto profil berhasil diunggah/diganti!", "success");
    window.renderApp(); // Global function from main.js
  };
  reader.readAsDataURL(file);
}

// Expose to window for inline HTML onclick in renderRekomendasiPage and sidebar
window.loadDashboardContent = loadDashboardContent;
window.handlePurchaseClick = handlePurchaseClick;

export {
  loadDashboardContent,
  handlePurchaseClick,
  handleTopup,
  handleProfileImageUpload,
  handleMLRecommendation,
};