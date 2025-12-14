// --- AUTH.JS ---

import {
  findUser,
  setSession,
  clearSession,
  saveUser,
  showMessage,
  hideModal,
  switchForm,
  STORAGE_KEY, // from utils.js
} from "./utils.js";
// Asumsi renderApp akan di-expose ke window dari main.js
// Asumsi loadDashboardContent akan di-expose ke window dari dashboard.js

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const errorElement = document.getElementById("login-error");

  errorElement.classList.add("hidden");

  const user = findUser(email, password);

  if (user) {
    setSession(user);
    showMessage(`Selamat datang kembali, ${user.name}!`, "success");
    document.getElementById("login-form").reset();
    hideModal();
    window.renderApp(); // Global function from main.js
  } else {
    errorElement.textContent = "Email atau password salah. Coba lagi.";
    errorElement.classList.remove("hidden");
  }
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value;
  const errorElement = document.getElementById("register-error");

  errorElement.classList.add("hidden");
  let users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  if (!(email.includes("@") && email.includes("."))) {
    errorElement.textContent = "Format email tidak valid.";
    errorElement.classList.remove("hidden");
    return;
  }
  if (users.find((u) => u.email === email)) {
    errorElement.textContent = "Email sudah terdaftar. Silakan login.";
    errorElement.classList.remove("hidden");
    return;
  }

  // Tambahkan photoUrl: null saat registrasi
  const newUser = { name, email, password, photoUrl: null };
  saveUser(newUser);
  showMessage("Pendaftaran Berhasil! Silakan Login.", "success");

  document.getElementById("register-form").reset();
  switchForm("login");
}

function handleLogout() {
  clearSession();
  showMessage("Anda telah berhasil logout.", "info");
  window.renderApp(); // Global function from main.js
}

function handleUpdatePassword(e, currentUser) {
  e.preventDefault();
  const currentPassword = document.getElementById("current-password").value;
  const newPassword = document.getElementById("new-password").value;
  const confirmNewPassword = document.getElementById(
    "confirm-new-password"
  ).value;
  const errorElement = document.getElementById("password-error");
  errorElement.classList.add("hidden");

  let users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const userIndex = users.findIndex((u) => u.email === currentUser.email);
  const storedUser = users[userIndex];

  if (storedUser.password !== currentPassword) {
    errorElement.textContent = "Password saat ini salah.";
    errorElement.classList.remove("hidden");
    return;
  }

  if (newPassword !== confirmNewPassword) {
    errorElement.textContent = "Konfirmasi password baru tidak cocok.";
    errorElement.classList.remove("hidden");
    return;
  }
  if (newPassword === currentPassword) {
    errorElement.textContent =
      "Password baru tidak boleh sama dengan password saat ini.";
    errorElement.classList.remove("hidden");
    return;
  }

  // Update password di master data
  storedUser.password = newPassword;
  saveUser(storedUser);

  document.getElementById("change-password-form").reset();
  showMessage("Password berhasil diperbarui!", "success");
}

export { handleLogin, handleRegister, handleLogout, handleUpdatePassword };