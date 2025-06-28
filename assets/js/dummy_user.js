document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const status = document.getElementById("loginStatus");

  // Dummy akun login (opsional untuk testing awal)
  const dummyUser = {
    email: "user@altair.com",
    password: "123456"
  };

  // Cek ke localStorage (akun hasil registrasi)
  const storedUser = JSON.parse(localStorage.getItem("altairUser"));

  const loginSuccess =
    (storedUser && email === storedUser.email && password === storedUser.password) ||
    (email === dummyUser.email && password === dummyUser.password);

  if (loginSuccess) {
    status.style.color = "#00ff99";
    status.textContent = "Login berhasil! Mengarahkan ke dashboard...";
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1200);
  } else {
    status.style.color = "#ff6666";
    status.textContent = "Email atau password salah!";
  }
});
