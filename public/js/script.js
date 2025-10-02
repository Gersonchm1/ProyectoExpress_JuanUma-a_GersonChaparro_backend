const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    correo: document.getElementById("username").value,
    contrasena: document.getElementById("password").value
  };

  try {
    const res = await fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    console.log(result);

    if (res.ok && result.token && result.user) {
      alert(" Login exitoso");
      localStorage.setItem("token", result.token); // guardar JWT
      localStorage.setItem("user", JSON.stringify(result.user)); // guardar el usuario

      // Redirige según el rol
      if (result.user.role === "admin") {
        window.location.href = "./index7.html";
      } else {
        window.location.href = "./index4.html";
      }
    } else {
      alert(" Error: " + result.msg);
    }
  } catch (error) {
    console.error("Error:", error);
  }
});