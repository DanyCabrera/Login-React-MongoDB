// Importamos React y los hooks necesarios para manejar estado y efectos
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fontsource/poppins/600.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './LoginForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser, faUserPlus, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import 'animate.css';
import Home from './Home';

function LoginForm() {
  // Estado para almacenar la lista de usuarios que vienen de la base de datos
  // Estado para almacenar el email que el usuario está escribiendo en el input
  // Estado para almacenar el nombre que el usuario está escribiendo en el input
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarContrasenia, setMostrarContrasenia] = useState(false);

  // useEffect para limpiar el mensaje de error y exito después de 3 segundos
  useEffect(() => {
    let timer;

    if (mensajeError || mensajeExito) {
      timer = setTimeout(() => {
        setMensajeError('');
        setMensajeExito('');
      }, 3000); // Usamos el mayor tiempo (4 segundos)
    }

    return () => clearTimeout(timer);
  }, [mensajeError, mensajeExito]);

  // useEffect se ejecuta cuando el componente se monta (al cargar la página)
  useEffect(() => {
    // Hacemos una petición GET al servidor backend para obtener todos los usuarios
    axios.get('http://localhost:5000/usuarios')
      // Si la petición es exitosa, actualizamos el estado 'usuarios' con los datos recibidos
      .then(res => setUsuarios(res.data))
      // Si hay un error, lo mostramos en la consola del navegador
      .catch(err => console.error(err));
  }, []); // El array vacío [] significa que solo se ejecuta una vez al cargar la página

  // Función que se ejecuta cuando el usuario hace clic en el botón "Agregar"
  const agregarUsuario = () => {
    if (nombre === '' || apellido === '' || correo === '' || contrasenia === '') {
      setMensajeError('Todos los campos son obligatorios');
      return;
    }

    if (contrasenia.length < 8) {
      setMensajeError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    axios.post('http://localhost:5000/usuarios', { nombre, apellido, correo, contrasenia })
      .then(res => {
        setUsuarios([...usuarios, res.data]); // actualiza la lista
        // Limpia los campos:
        setNombre('');
        setApellido('');
        setCorreo('');
        setContrasenia('');
        setMensajeError(''); // Limpia cualquier mensaje de error previo
        setMensajeExito('Cuenta creada con exito ✅');
      })
      .catch(err => {
        console.error(err);
        if (err.response && err.response.status === 400) {
          setMensajeError(err.response.data.error);
        } else {
          setMensajeError('Error al crear la cuenta. Inténtalo de nuevo.❌');
        }
        setMensajeExito(''); // Limpia mensaje de éxito si hay error
      });
  };

  // Función para alternar entre formularios
  const alternarFormulario = () => {
    setMostrarLogin(!mostrarLogin);
    // Limpiar mensajes y campos al cambiar de formulario
    setMensajeError('');
    setMensajeExito('');
    setNombre('');
    setApellido('');
    setCorreo('');
    setContrasenia('');
  };

  const iniciarSesion = () => {
    if (correo === '' || contrasenia === '') {
      setMensajeError('Todos los campos son obligatorios');
      setMensajeExito('');
      return;
    }

    axios.post('http://localhost:5000/login', {
      correo, contrasenia
    })
    .then(res => {
      setMensajeError(''); // Limpia cualquier error previo
      // Guardar datos del usuario en localStorage
      const userData = {
        nombre: res.data.usuario.nombre,
        apellido: res.data.usuario.apellido,
        correo: res.data.usuario.correo
      };
      localStorage.setItem('usuarioLogueado', JSON.stringify(userData));
      // Redirigir al dashboard después de un breve delay
      window.location.href = '/home';
    })
    .catch(err => {
      setMensajeExito(''); // Limpia cualquier éxito previo
      if (err.response && err.response.data) {
        setMensajeError(err.response.data.mensaje);
      } else {
        setMensajeError('Error al iniciar sesión');
      }
    });
  }

  const alternarMostrarContrasenia = () => setMostrarContrasenia(m => !m);

  // Renderizamos la interfaz de usuario
  return (
    <div className="login-bg">
      <div className="container vh-100 d-flex justify-content-center align-items-center">
        <div className="login-card card shadow-lg p-5 rounded-4 animate__animated animate__fadeIn" style={{ maxWidth: '400px', width: '100%' }}>
          {!mostrarLogin ? (
            <>
              <h2 className="text-center mb-4 fw-bold">Iniciar sesión</h2>
              <div className="input-group mb-3">
                <span className="input-group-text"><FontAwesomeIcon icon={faEnvelope} /></span>
                <input
                  className="form-control"
                  value={correo}
                  onChange={e => setCorreo(e.target.value)}
                  placeholder="Correo electrónico"
                />
              </div>
              <div className="input-group mb-4">
                <span className="input-group-text"><FontAwesomeIcon icon={faLock} /></span>
                <input
                  type={mostrarContrasenia ? 'text' : 'password'}
                  className="form-control"
                  value={contrasenia}
                  onChange={e => setContrasenia(e.target.value)}
                  placeholder="Contraseña"
                />
                <button type="button" className="btn btn-outline-secondary" tabIndex={-1} onClick={alternarMostrarContrasenia}>
                  <FontAwesomeIcon icon={mostrarContrasenia ? faEyeSlash : faEye} />
                </button>
              </div>
              <button className="btn btn-success w-100 mb-3 login-btn" onClick={iniciarSesion}>Iniciar sesión</button>
              <div className="text-center">
                <span>¿No tienes cuenta? </span>
                <button className="btn btn-sm btn-outline-danger ms-2" onClick={alternarFormulario}>Crear cuenta</button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-center mb-4 fw-bold">Crear cuenta</h2>
              <div className="input-group mb-3">
                <span className="input-group-text"><FontAwesomeIcon icon={faUser} /></span>
                <input
                  className="form-control"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  placeholder="Nombre"
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text"><FontAwesomeIcon icon={faUserPlus} /></span>
                <input
                  className="form-control"
                  value={apellido}
                  onChange={e => setApellido(e.target.value)}
                  placeholder="Apellido"
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text"><FontAwesomeIcon icon={faEnvelope} /></span>
                <input
                  className="form-control"
                  value={correo}
                  onChange={e => setCorreo(e.target.value)}
                  placeholder="Correo electrónico"
                />
              </div>
              <div className="input-group mb-4">
                <span className="input-group-text"><FontAwesomeIcon icon={faLock} /></span>
                <input
                  type={mostrarContrasenia ? 'text' : 'password'}
                  className="form-control"
                  value={contrasenia}
                  onChange={e => setContrasenia(e.target.value)}
                  placeholder="Contraseña"
                />
                <button type="button" className="btn btn-outline-secondary" tabIndex={-1} onClick={alternarMostrarContrasenia}>
                  <FontAwesomeIcon icon={mostrarContrasenia ? faEyeSlash : faEye} />
                </button>
              </div>
              <button onClick={agregarUsuario} className="btn btn-info w-100 mb-3 login-btn">Crear cuenta</button>
              <div className="text-center">
                <span>¿Ya tienes cuenta? </span>
                <button className="btn btn-sm btn-outline-primary ms-2" onClick={alternarFormulario}>Iniciar sesión</button>
              </div>
            </>
          )}
          {mensajeError && (
            <div className="alert alert-danger text-center mt-3 animate__animated animate__fadeInDown">
              {mensajeError}
            </div>
          )}
          {mensajeExito && (
            <div className="alert alert-success text-center mt-3 animate__animated animate__fadeInDown">
              {mensajeExito}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

// Exportamos el componente App para que pueda ser usado en otros archivos
export default App;
