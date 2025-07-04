import React, { useEffect, useState } from 'react';

function Home() {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
        if (usuario && usuario.nombre && usuario.apellido) {
            setNombre(usuario.nombre);
            setApellido(usuario.apellido);
        }
    }, []);

    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="card p-5 text-center">
                <h1>Bienvenido, {nombre} {apellido}!</h1>
                <p>Has iniciado sesión correctamente.</p>
                <button className="btn btn-primary" onClick={() => {
                    localStorage.removeItem('usuarioLogueado');
                    window.location.href = '/';
                }}>Cerrar sesión</button>
            </div>
        </div>
    );
}

export default Home; 