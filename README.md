# Sistema de Inventario y Usuarios

Este proyecto es una aplicación web de inventario y gestión de usuarios, desarrollada con React para el frontend y Node.js/Express/MongoDB para el backend.

## Estructura del Proyecto

```
PROYECTO/
├── server/         # Backend (Node.js, Express, MongoDB)
│   ├── index.js
│   ├── package.json
│   └── ...
└── web/            # Frontend (React)
    ├── src/
    │   ├── App.js
    │   ├── Home.js
    │   ├── LoginForm.css
    │   └── ...
    ├── public/
    │   └── index.html
    ├── package.json
    └── ...
```

## Instalación

### 1. Clona el repositorio

```bash
git clone <url-del-repo>
cd PROYECTO
```

### 2. Instala dependencias

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd ../web
npm install
```

## Uso

### 1. Inicia el backend
```bash
cd server
node index.js
```
El backend corre en `http://localhost:5000`.

### 2. Inicia el frontend
```bash
cd web
npm start
```
El frontend corre en `http://localhost:3000`.

## Funcionalidades principales

- Registro de usuarios (nombre, apellido, correo, contraseña)
- Inicio de sesión seguro (contraseña encriptada)
- Redirección a la página Home tras login exitoso
- Visualización personalizada del nombre y apellido del usuario logueado
- Gestión de productos (agregar, listar)

## Endpoints del Backend

- `POST /usuarios` — Registrar usuario
- `GET /usuarios` — Listar usuarios
- `POST /login` — Iniciar sesión
- `POST /productos` — Agregar producto
- `GET /productos` — Listar productos

## Estructura de Componentes Frontend

- `App.js` — Configuración de rutas y lógica principal
- `Home.js` — Página de bienvenida tras login, muestra nombre y apellido
- `LoginForm.css` — Estilos del login y registro

## Personalización
- Puedes modificar el archivo `web/src/Home.js` para personalizar la página de bienvenida.
- El backend usa MongoDB Atlas, cambia la cadena de conexión en `server/index.js` si usas otra base de datos.

## Notas de Seguridad
- Las contraseñas se almacenan encriptadas usando bcrypt.
- No compartas la cadena de conexión de MongoDB en repositorios públicos.

## Créditos
- Desarrollado por Dany Abimael Cabrera Hernández

---
¡Listo para usar y personalizar según tus necesidades!
