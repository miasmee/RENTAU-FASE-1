function cerrarSesion() {
    localStorage.clear();
    sessionStorage.clear();
    
    window.location.href = "./login.html"; 
}