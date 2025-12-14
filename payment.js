// --- PAYMENT.JS ---

import {
  formatRupiah,
  getLoggedInUser,
  getHistory,
  saveHistory,
  showMessage,
  DUMMY_PRODUCTS,
} from "./utils.js";

// State
let selectedProduct = null;
let selectedMethod = null;
let paymentTimerInterval = null;

function startPaymentTimer(durationInSeconds) {
  const countdownElement = document.getElementById("payment-countdown");
  let timer = durationInSeconds;
  let hours, minutes, seconds;

  clearInterval(paymentTimerInterval);

  paymentTimerInterval = setInterval(() => {
    hours = parseInt(timer / 3600, 10);
    minutes = parseInt((timer % 3600) / 60, 10);
    seconds = parseInt(timer % 60, 10);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    if (countdownElement) {
      countdownElement.textContent = hours + ":" + minutes + ":" + seconds;
    }

    if (--timer < 0) {
      clearInterval(paymentTimerInterval);
      if (countdownElement) {
        countdownElement.textContent = "Waktu Habis";
        const finishBtn = document.getElementById("finish-payment-btn");
        if (finishBtn) {
          finishBtn.disabled = true;
          finishBtn.classList.add("bg-gray-400", "cursor-not-allowed");
          finishBtn.classList.remove("bg-green-600", "hover:bg-green-700");
        }
      }
      showMessage(
        "Waktu pembayaran telah habis. Silakan buat transaksi baru.",
        "error"
      );
    }
  }, 1000);
}

function showPaymentModal(product) {
  selectedProduct = product;
  selectedMethod = null;

  const modal = document.getElementById("payment-modal");
  const detailsArea = document.getElementById("payment-details");
  let finishBtn = document.getElementById("finish-payment-btn");
  let cancelBtn = document.getElementById("cancel-payment-btn"); 
  const methodsList = document.getElementById("payment-methods-list");

  if (!modal || !detailsArea || !finishBtn || !methodsList) return;

  // 1. Render Payment Details
  detailsArea.innerHTML = `
    <p class="text-md text-gray-700 font-medium">Paket: <span class="float-right font-bold text-indigo-700">${
      product.name
    }</span></p>
    <p class="text-md text-gray-700 font-medium">Harga: <span class="float-right font-bold text-indigo-700">Rp ${formatRupiah(
      product.price
    )}</span></p>
    <p class="text-md text-gray-700 font-medium">Biaya Admin: <span class="float-right font-bold text-indigo-700">Rp 2.500</span></p>
    <p class="text-xl text-gray-900 font-extrabold mt-3 border-t pt-3">TOTAL: <span class="float-right text-green-600">Rp ${formatRupiah(
      product.price + 2500
    )}</span></p>
  `;

  // 2. Render Payment Methods List
  const paymentMethods = [
    { name: "Mandiri VA", code: "1234567890" },
    { name: "BCA VA", code: "9876543210" },
    { name: "BNI VA", code: "1122334455" },
  ];

  methodsList.innerHTML = paymentMethods
    .map(
      (method, index) => `
        <div class="payment-method-item flex justify-between items-center p-3 bg-gray-50 rounded-lg border-2 border-transparent cursor-pointer transition-all hover:bg-indigo-50" data-name="${method.name}">
          <span class="font-semibold text-gray-700 pointer-events-none">${method.name}</span>
          <span class="text-sm font-mono bg-white border px-3 py-1 rounded text-indigo-600 pointer-events-none">${method.code}</span>
        </div>
      `
    )
    .join("");

  const newFinishBtn = finishBtn.cloneNode(true);
  finishBtn.replaceWith(newFinishBtn);
  finishBtn = newFinishBtn;

  if (cancelBtn) {
    const newCancelBtn = cancelBtn.cloneNode(true);
    cancelBtn.replaceWith(newCancelBtn);
    cancelBtn = newCancelBtn;
    
    cancelBtn.addEventListener("click", hidePaymentModal);
  }

  finishBtn.disabled = true;
  finishBtn.classList.remove("bg-green-600", "hover:bg-green-700");
  finishBtn.classList.add("bg-gray-400", "cursor-not-allowed");

  finishBtn.addEventListener("click", () => handleFinalPayment(selectedProduct));

  document.querySelectorAll(".payment-method-item").forEach((item) => {
    item.addEventListener("click", function () {
    
      document.querySelectorAll(".payment-method-item").forEach((el) => {
        el.classList.remove("border-indigo-600", "bg-indigo-100");
        el.classList.add("border-transparent", "bg-gray-50");
      });

      this.classList.remove("border-transparent", "bg-gray-50");
      this.classList.add("border-indigo-600", "bg-indigo-100");

      
      selectedMethod = this.getAttribute("data-name");

      
      finishBtn.disabled = false;
      finishBtn.classList.remove("bg-gray-400", "cursor-not-allowed");
      finishBtn.classList.add("bg-green-600", "hover:bg-green-700");
    });
  });

  
  modal.classList.remove("hidden");
  modal.style.opacity = "1";
  startPaymentTimer(24 * 60 * 60);
}

function hidePaymentModal() {
  const modal = document.getElementById("payment-modal");
  if (modal) {
    modal.style.opacity = "0";
    setTimeout(() => modal.classList.add("hidden"), 300);
  }
  clearInterval(paymentTimerInterval);
  selectedProduct = null;
  selectedMethod = null;
}

function handleFinalPayment(product) {
  if (!product) return;
  if (!selectedMethod) {
    showMessage("Silakan pilih metode pembayaran terlebih dahulu!", "error");
    return;
  }

  const user = getLoggedInUser();

  // Stop the timer
  clearInterval(paymentTimerInterval);

  // Catat Transaksi
  const newTransaction = {
    id: Date.now(),
    userId: user.email,
    date: new Date().toISOString().slice(0, 10),
    packageName: product.name,
    amount: product.price,
    status: "Selesai",
    type: "Pembelian Paket",
    method: selectedMethod,
  };

  const history = getHistory();
  history.push(newTransaction);
  saveHistory(history);

  // Beri Feedback
  hidePaymentModal();
  showMessage(
    `Pembelian paket "${product.name}" via ${selectedMethod} berhasil!`,
    "success"
  );

  // Render ulang dashboard
  if (
    !document.getElementById("dashboard").classList.contains("hidden") &&
    window.loadDashboardContent
  ) {
    window.loadDashboardContent("transaksi", user);
  }
}

export {
  showPaymentModal,
  hidePaymentModal,
  handleFinalPayment,
  paymentTimerInterval,
};