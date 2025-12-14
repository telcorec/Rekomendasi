// --- LANDING.JS ---

import {
  createProductCard,
  DUMMY_PRODUCTS,
  showModal, // from utils.js
} from "./utils.js";

// Fungsi untuk membuat SVG ikon LinkedIn
function getLinkedInIcon() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.395-2.127 4-2.293 4-2.293 2.5 0 3.5 1.875 3.5 5.617v5.911z"/>
    </svg>
  `;
}

// Fungsi untuk membuat SVG ikon Instagram (Diperbarui)
function getInstagramIcon() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-instagram">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  `;
}

function renderHomeContent() {
  return `
    <div class="bg-white rounded-2xl shadow-xl p-10 max-w-4xl mx-auto text-center">
      <h2 class="text-5xl font-extrabold text-gray-900 mb-4">
        Dapatkan Rekomendasi Paket Terbaik!
      </h2>

      <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
        Kami menyediakan rekomendasi paket internet, telepon, dan combo terbaik dari berbagai provider terkemuka. 
        Dapatkan koneksi cepat, kuota besar, dan harga paling hemat, 
        disesuaikan dengan profil dan penggunaan Anda!
      </p>

      <button
        id="start-search-btn"
        class="bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold py-3 px-8 rounded-xl shadow-xl transition duration-300 transform hover:scale-105"
      >
        Mulai Cari Sekarang
      </button>
    </div>

        <div class="max-w-4xl mx-auto mt-12">
      <div class="p-8 bg-indigo-50 rounded-xl shadow-inner">
        <h3 class="text-3xl font-bold text-indigo-800 mb-4">Mengapa Memilih TelcoRec?</h3>

        <ul class="grid grid-cols-1 md:grid-cols-3 gap-6 text-indigo-700">
          <li class="p-4 bg-white rounded-lg shadow-md flex items-start">
            <span class="text-2xl mr-3">⚡</span>
            <div>
              <p class="font-bold">Kecepatan Maksimal</p>
              <p class="text-sm text-gray-600">Nikmati streaming dan gaming tanpa lag.</p>
            </div>
          </li>

          <li class="p-4 bg-white rounded-lg shadow-md flex items-start">
            <span class="text-2xl mr-3">💰</span>
            <div>
              <p class="font-bold">Harga Terjangkau</p>
              <p class="text-sm text-gray-600">Bandingkan dan temukan paket termurah.</p>
            </div>
          </li>

          <li class="p-4 bg-white rounded-lg shadow-md flex items-start">
            <span class="text-2xl mr-3">🛡</span>
            <div>
              <p class="font-bold">Keamanan Terjamin</p>
              <p class="text-sm text-gray-600">Transaksi aman dan terpercaya.</p>
            </div>
          </li>
        </ul>
      </div>
    </div>

  `;
}

function renderProductContent() {
  return `
    <div id="product-overview" class="mb-10 text-center bg-gray-100 p-8 rounded-xl">
      <h3 class="text-4xl font-extrabold text-gray-800 mb-3">Produk Unggulan Kami</h3>
      <p class="text-lg text-gray-600 max-w-4xl mx-auto">
        Kami menyajikan pilihan paket terlengkap, terorganisir berdasarkan kebutuhan Anda, mulai dari kuota harian, bulanan, hingga paket khusus gaming dan combo. Pilih yang paling sesuai dengan gaya hidup digital Anda.
      </p>
    </div>

    <div id="product-list-container"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-3">
      ${DUMMY_PRODUCTS.map((product) => createProductCard(product, false)).join(
        ""
      )}
    </div>
  `;
}

function renderAboutContent() {
  // Tentukan path gambar spesifik
  const annisaImagePath = "/Telco/public/image/Annisa.jpeg";
  const sholehImagePath = "/Telco/public/image/Sholeh.jpeg";
  const NitaImagePath = "/Telco/public/image/Nita.jpeg";
  const IbnulImagePath = "/Telco/public/image/Ibnul.jpeg";
  const MikeImagePath = "/Telco/public/image/Mike.jpg";

  const teamMembers = [
    {
      name: "Annisa Tasya S",
      role: "Frontend & Backend",
      // Gunakan foto Sholeh yang spesifik
      image: annisaImagePath,
      linkedin: "https://www.linkedin.com/in/annisa-tasya-salsabila-4b63a92b4/",
      instagram: "https://www.instagram.com/annisaatsy?igsh=MWwxZXlkOWdhbzhwaw%3D%3D&utm_source=qr",
    },
    {
      name: "Noor Senita S",
      role: "Frontend & Backend",
      image: NitaImagePath, // Kembali ke default/Annisa
      linkedin: "https://www.linkedin.com/in/noor-senita-syaira-7823232862",
      instagram: "https://www.instagram.com/nrsenita?igsh=ZHBwb29scThyc3Qz",
    },
    {
      name: "M. Sholeh",
      role: "Frontend & Backend",
      image: sholehImagePath,
      linkedin:"https://www.linkedin.com/in/m-sholeh-654152353?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      instagram: "https://www.instagram.com/rembo_jw?igsh=cGYzMDVkOGcwaGhp",
    },
    {
      name: "Ibnul Mahdi",
      role: "Machine Learning",
      image: IbnulImagePath,
      linkedin: "https://www.linkedin.com/in/ibnulmahdi",
      instagram: "https://www.instagram.com/ibnuhc/",
    },
    {
      name: "Michael Elbert J",
      role: "Machine Learning",
      image: MikeImagePath,
      linkedin: "https://www.linkedin.com/in/michael-elbert-justian-aa2481239?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      instagram: "https://www.instagram.com/michael_ej1?igsh=MXI0YjZlNTFldTVheg==",
    },
  ];

  return `
    <div class="text-center py-8">
      <h2 class="text-4xl font-extrabold text-gray-900 mb-4">Tentang Kami & Tim Pengembang</h2>
      <p class="text-lg text-gray-600 max-w-4xl mx-auto mb-10">
        TelcoRec adalah platform rekomendasi paket telekomunikasi yang dibangun dengan semangat inovasi dan kolaborasi tim.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
      ${teamMembers
        .map(
          (member) => `
          <div class="flex flex-col items-center bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <div class="w-28 h-28 mb-4 rounded-full overflow-hidden border-4 border-indigo-200">
              <img 
                src="${member.image}" 
                alt="${member.name}" 
                onerror="this.onerror=null;this.src='https://via.placeholder.com/150/93C5FD/4338CA?Text=${member.name.replace(
                  /\s/g,
                  "+"
                )}'"
                class="w-full h-full object-cover"/>
            </div>
            <h4 class="text-xl font-bold text-gray-900">${member.name}</h4>
            <p class="text-sm text-indigo-600 font-medium mb-3">${
              member.role
            }</p>
            
            <div class="flex space-x-3 text-gray-400">
              <a href="${
                member.linkedin
              }" target="_blank" rel="noopener noreferrer" class="hover:text-indigo-600 transition duration-150">
                ${getLinkedInIcon()}
              </a>
              <a href="${
                member.instagram
              }" target="_blank" rel="noopener noreferrer" class="hover:text-pink-600 transition duration-150">
                ${getInstagramIcon()}
              </a>
            </div>
          </div>
        `
        )
        .join("")}
    </div>
  `;
}

function handleLandingPageNavigation(target) {
  const contentArea = document.getElementById("landing-content");
  let contentHTML = "";

  // Highlight active link in header
  document.querySelectorAll("#main-nav-links a").forEach((link) => {
    if (link.getAttribute("data-target") === target) {
      link.classList.add("text-indigo-600", "font-bold");
      link.classList.remove("text-gray-600", "font-medium");
    } else {
      link.classList.remove("text-indigo-600", "font-bold");
      link.classList.add("text-gray-600", "font-medium");
    }
  });

  switch (target) {
    case "home":
      contentHTML = renderHomeContent();
      break;
    case "product":
      contentHTML = renderProductContent();
      break;
    case "about":
      contentHTML = renderAboutContent();
      break;
    default:
      contentHTML = renderHomeContent();
      break;
  }
  contentArea.innerHTML = contentHTML;

  // Re-attach listener for start-search-btn after content is rendered
  if (target === "home" || target === "product") {
    const startSearchBtn = document.getElementById("start-search-btn");
    if (startSearchBtn) {
      startSearchBtn.addEventListener("click", () => showModal("register")); // showModal from utils.js
    }
  }
}

export {
  renderHomeContent,
  renderProductContent,
  renderAboutContent,
  handleLandingPageNavigation,
};
