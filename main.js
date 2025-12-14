// --- MAIN.JS ---

import {
  getLoggedInUser,
  showModal,
  hideModal,
  saveUser,
  setSession,
  clearSession,
  switchForm, // <--- TAMBAHAN: Import switchForm
} from "./utils.js";
import { handleLandingPageNavigation } from "./landing.js";
import {   
  loadDashboardContent,
  handleProfileImageUpload,
} from "./dashboard.js";

import {
  handleLogin,
  handleRegister,
  handleLogout,
  handleUpdatePassword,
} from "./auth.js";
import { hidePaymentModal } from "./payment.js";

// Expose necessary functions globally for inline HTML onclick attributes and cross-file calls
window.renderApp = renderApp;
window.showModal = showModal; // showModal from utils.js
window.switchForm = switchForm; // <--- TAMBAHAN: Agar onclick="switchForm(...)" di HTML bisa jalan

// Expose storage/session functions for dashboard.js/profile image handler to use
window.saveUser = saveUser;
window.setSession = setSession;
window.clearSession = clearSession;

// Expose auth functions for dashboard.js to use in loadDashboardContent (ganti-password)
window.authExports = { handleUpdatePassword, handleLogout };

// --- CORE APPLICATION FLOW ---
function renderApp() {
  const user = getLoggedInUser();
  const landingPage = document.getElementById("landing-page");
  const dashboard = document.getElementById("dashboard");
  const authBtn = document.getElementById("auth-btn");
  const mainNavLinks = document.getElementById("main-nav-links");
  const sidebarUsername = document.getElementById("sidebar-username");
  const profileInitials = document.getElementById("profile-initials");
  const profileContainer = document.getElementById(
    "profile-picture-container"
  );
  // *** PERUBAHAN UTAMA: Ambil elemen header utama ***
  const mainHeader = document.querySelector("header");

  if (user) {
    // Logged In: Show Dashboard
    landingPage.classList.add("hidden");
    dashboard.classList.remove("hidden");

    // Sembunyikan semua elemen header utama
    authBtn.classList.add("hidden");
    mainNavLinks.classList.add("hidden");
    if (mainHeader) mainHeader.classList.add("hidden");

    sidebarUsername.textContent = user.name.split(" ")[0];

    // Menampilkan Foto Profil
    profileContainer.style.backgroundColor = user.photoUrl
      ? "transparent"
      : "#F8B4B4";
    if (user.photoUrl) {
      profileInitials.innerHTML = `<img src="${user.photoUrl}" alt="Profile" class="w-full h-full object-cover">`;
    } else {
      profileInitials.innerHTML = user.name.charAt(0).toUpperCase();
    }

    loadDashboardContent("rekomendasi", user);
  } else {
    // Logged Out: Show Landing Page
    dashboard.classList.add("hidden");
    landingPage.classList.remove("hidden");

    // Tampilkan kembali semua elemen header utama
    authBtn.classList.remove("hidden");
    mainNavLinks.classList.remove("hidden");
    if (mainHeader) mainHeader.classList.remove("hidden");

    // Set initial landing content to Home
    handleLandingPageNavigation("home");
  }
}

// --- APP INITIALIZATION ---
function initApp() {
  // Pasang semua event listener
  document
    .getElementById("login-form")
    .addEventListener("submit", handleLogin);
  document
    .getElementById("register-form")
    .addEventListener("submit", handleRegister);
  document
    .getElementById("auth-btn")
    .addEventListener("click", () => showModal("login"));

  document
    .getElementById("logout-sidebar-btn")
    .addEventListener("click", handleLogout);

  // Listener navigasi Landing Page
  document.querySelectorAll("#main-nav-links a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = e.target.getAttribute("data-target");
      handleLandingPageNavigation(target);
    });
  });

  // Listener untuk upload foto profil
  document
    .getElementById("profile-image-upload")
    .addEventListener("change", handleProfileImageUpload);

  // Listener navigasi Dashboard Sidebar
  document.querySelectorAll("#sidebar .sidebar-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = link.getAttribute("data-page") || "rekomendasi";
      const user = getLoggedInUser();

      if (user) {
        loadDashboardContent(page, user);
      }
    });
  });

  // Listener untuk menutup modal
  document.getElementById("auth-modal").addEventListener("click", (e) => {
    if (e.target.id === "auth-modal") hideModal();
  });

  document.getElementById("payment-modal").addEventListener("click", (e) => {
    if (e.target.id === "payment-modal") hidePaymentModal();
  });

  renderApp();
}

document.addEventListener("DOMContentLoaded", initApp);