document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const statusText = document.getElementById("loginStatus");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Cegah reload halaman

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        // Login berhasil → redirect ke dashboard
        window.location.href = "/dashboard";
      } else {
        // Tampilkan pesan error
        statusText.textContent = result.message || "Login gagal.";
        statusText.style.color = "red";
      }
    } catch (error) {
      statusText.textContent = "Terjadi kesalahan.";
      statusText.style.color = "red";
      console.error("Error:", error);
    }
  });
});
