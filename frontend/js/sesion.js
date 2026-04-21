document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const errorEl = document.getElementById("error-message");
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const eyeIcon = document.getElementById('eyeIcon');
    const successModal = document.getElementById('success-modal');
    const btnAccept = document.getElementById('btn-accept');
    const welcomeTitle = document.getElementById('welcome-title');
    const welcomeText = document.querySelector('#success-modal p');

    const recoveryModal = document.getElementById('recovery-modal');
    const btnVerifyCode = document.getElementById('btn-verify-code');
    const linkRecuperar = document.querySelector('a[href="recuperar.html"]');

    let pendingRole = null; 

    // --- 1. MOSTRAR/OCULTAR CONTRASEÑA
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            eyeIcon.classList.toggle('fa-eye');
            eyeIcon.classList.toggle('fa-eye-slash');
        });
    }

    // --- 2. GESTIÓN DE REDIRECCIÓN 
    const redirigirSegunRol = (rol) => {
        if (rol === "admin") {
            window.location.href = "./admin/inicioadmin.html";
        } else {
            window.location.href = "./inicioinquilino.html";
        }
    };

    // --- 3. LOGIN (POR DEPARTAMENTO)
    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            
            const dept = document.getElementById("username").value;
            const pass = passwordInput.value;
            
            if (errorEl) errorEl.classList.add("hidden");

            try {
                const response = await fetch("http://localhost:3000/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ departamento: dept, password: pass })
                });

                const data = await response.json();

                if (data.success) {
                    localStorage.setItem("rol", data.usuario.rol);
                    localStorage.setItem("id_usuario", data.usuario.id);
                    
                    pendingRole = data.usuario.rol;
                    if (welcomeTitle) welcomeTitle.innerText = "¡Bienvenido a RENTAU!";
                    if (welcomeText) welcomeText.innerText = "Has iniciado sesión con éxito.";
                    successModal.classList.add('active'); 
                } else {
                    if (errorEl) {
                        errorEl.innerText = data.message || "Credenciales incorrectas.";
                        errorEl.classList.remove("hidden");
                    }
                }
            } catch (error) {
                console.error("Error:", error);
                if (errorEl) errorEl.innerText = "Error al conectar con el servidor.";
            }
        });
    }

    // --- 4. RECUPERACIÓN POR CÓDIGO 
    if (linkRecuperar) {
        linkRecuperar.addEventListener('click', (e) => {
            e.preventDefault(); 
            recoveryModal.classList.add('active');
        });
    }

    if (btnVerifyCode) {
        btnVerifyCode.addEventListener('click', async () => {
            const departamento = document.getElementById('rec-dept').value;
            const codigo = document.getElementById('rec-code').value;

            try {
                const response = await fetch("http://localhost:3000/api/recuperar", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ departamento, codigo })
                });

                const data = await response.json();

                if (data.success) {
                    recoveryModal.classList.remove('active');
                    if (welcomeTitle) welcomeTitle.innerText = "Contraseña Recuperada";
                    if (welcomeText) welcomeText.innerText = `Tu contraseña es: ${data.password}`;
                    pendingRole = null; 
                    successModal.classList.add('active');
                } else {
                    alert(data.message);
                }
            } catch (err) {
                alert("Error al intentar recuperar.");
            }
        });
    }

    // --- 5. ACCIÓN AL ACEPTAR NOTIFICACIÓN
    if (btnAccept) {
        btnAccept.addEventListener('click', () => {
            if (pendingRole) {
                redirigirSegunRol(pendingRole);
            } else {
                successModal.classList.remove('active');
            }
        });
    }
});