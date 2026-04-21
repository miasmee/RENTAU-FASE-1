# RENTAU: Sistema de Pago de Alquiler y de Servicio de Electricidad

**RENTAU** es una plataforma integral diseñada para optimizar la administración de una residencia estudiantil y la comunicación entre administradores e inquilinos. Este proyecto aplica principios avanzados de ingeniería de software para digitalizar procesos de arrendamiento en Zacatepec.

Actualmente, el repositorio refleja la **Fase 1** del desarrollo, con una arquitectura sólida que separa el núcleo lógico del servidor de la interfaz de usuario.

---

##  Características principales

* **Autenticación de usuarios:** Inicio de sesión con redirección por roles (Administrador/Inquilino).
* **Gestión de Agenda:** Visualización y control de citas de visitas.
* **CRUD de Citas:** Capacidad de agendar, confirmar y eliminar citas de la base de datos.
* **Centro de Ayuda:** Preguntas frecuentes (FAQ) dinámicas para usuarios.
* **Filtrado Avanzado:** Clasificación de agenda por temporalidad (Hoy, Semana, Mes).
* **Seguridad SQL:** Control de privilegios y acceso a nivel de base de datos.

---

## Módulos Implementados

### 1. Sistema de Autenticación y Acceso
Gestiona la entrada segura al sistema mediante un flujo de login que valida las credenciales contra la base de datos.
* **Seguridad por Roles:** Diferencia automáticamente entre administradores e inquilinos, redirigiendo a `inicioadmin.html` o `inicioinquilino.html` según corresponda.
* **Persistencia:** Implementado con lógica de sesión para mantener la integridad del usuario durante la navegación.

### 2. Centro de Soporte (FAQ)
Módulo interactivo de preguntas frecuentes diseñado para la autogestión del usuario.
* **Vistas Especializadas:** Contiene lógica diferenciada en `adminFaq.js` para la gestión administrativa y en `tenanFaq.js` para la consulta del inquilino.
* **Interfaz Dinámica:** Utiliza componentes responsivos para facilitar la resolución de dudas comunes sobre el servicio.

### 3. Agenda de Visitas (Gestión de Citas)
El componente más robusto de la fase actual, permitiendo la coordinación técnica de citas.
* **Lógica Administrativa:** Panel en `adminAgenda.js` que permite visualizar la agenda completa, confirmar asistencia o eliminar registros mediante peticiones a la API.
* **Reservación:** Los prospectos pueden agendar visitas a través de `agendaVisita.html`, integrando validaciones de datos en tiempo real.

---

## Tecnologías

### Frontend
* **HTML5 / CSS3**
* **Tailwind CSS** (Framework de diseño)
* **JavaScript (Vanilla)**

### Backend (En desarrollo)
* **Node.js**
* **Express**
* **MySQL** (Gestión de base de datos relacional)

---

## Estructura del Proyecto

### `frontend/`
* **admin/** → Vistas de gestión para el administrador (Agenda, FAQ).
* **css/** → Hojas de estilo y configuraciones de diseño.
* **js/** → Lógica del lado del cliente y consumo de APIs.
* **assets/** → Recursos visuales e imágenes.

### `backend/`
* **config/** → Configuración de conexión a la base de datos (`db.js`).
* **controllers/** → Lógica de negocio (Autenticación, Gestión).
* **models/** → Esquemas y modelos de datos.
* **routes/** → Definición de endpoints de la API.
* **server.js** → Punto de entrada del servidor Express.

---

## Instalación

### 1. Clonar el repositorio
git clone <URL_DEL_REPO>

## 2. Entrada del proyecto
cd RENTAU-FASE1

## 3. Configurar backend
cd backend
npm install
npm start

El servidor backend estará disponible en: http://localhost:3000.

---

## API 
POST /api/auth/login → Iniciar sesión.
GET /api/visitas → Obtener lista de visitas.
POST /api/visitas → Registrar nueva cita.
DELETE /api/visitas/:id → Eliminar cita de la base de datos.

---

## Scripts disponibles

# Backend
npm start → Inicia el servidor de producción.
node server.js → Ejecución directa del servidor.

---

## Roadmap
[X] Implementar autenticación básica por roles.
[X] Implementar reservación de citas. 
[X] Implementar centro de ayuda (faq).
[ ] Integegración de alta de inquilinos.
[ ] Sistema de notificaciones automáticas.
[ ] Integegración de registro de Consumo de Electricidad.
[ ] Integración de pagos de renta.
[ ] Integración de pagos de servicio de electricidad.
[ ] Integración de consultas de pagos de renta.
[ ] Integración de consultas de servicios de electricidad.
[ ] Integración de actualización manual de pagos,  
[ ] Integración de reportes estadísticos. 
[ ] Integración de seguimiento de fallas. 
[ ] Integración de reporte de avería. 
[ ] Integración de panel de Alertas.
[ ] Integegración de contrato de arrendamiento. 

---

## Contribuciones 
Las contribuciones son bienvenidas.
Haz un fork del proyecto.
Crea una rama (git checkout -b feature/nueva-funcionalidad).
Realiza tus cambios.
Haz commit (git commit -m "Añadir nueva funcionalidad").
Haz push (git push origin feature/nueva-funcionalidad).
Abre un Pull Request.

--- 

## Reporte de errores
Si encuentras algún error o bug, puedes abrir un issue en el repositorio de GitHub.

--- 

## Licencia
Este proyecto es de carácter académico y se distribuye bajo la Licencia MIT.

---

## Autores
Desarrollado por Sánchez Morante Mia Alexandra y Basurto García América Yusleivy como proyecto académico para la asignatura de Ingeniería de Software.  

---

## Notas finales
Este proyecto escolar está diseñado como base para escalar a una aplicación profesional de gestión de residencias estudiantiles. Se enfoca en mantener una arquitectura limpia y una validación de datos estricta en el nivel de Entidad.
