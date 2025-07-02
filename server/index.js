const express = require('express'); // Importamos Express.js para crear el servidor web
const mongoose = require('mongoose'); // Importamos Mongoose para conectarnos a MongoDB
const cors = require('cors'); // Importamos CORS para permitir peticiones desde el frontend
const bcrypt = require('bcrypt');

const app = express(); // Creamos una instancia de la aplicación Express
app.use(cors()); // Habilitamos CORS para que el frontend pueda hacer peticiones al servidor
app.use(express.json()); // Configuramos Express para que pueda leer JSON en las peticiones

// Conectamos a la base de datos MongoDB Atlas
// Esta URL contiene las credenciales y la dirección de tu base de datos
mongoose.connect('mongodb+srv://dcabrera2:dany.12@database2.9z8r0om.mongodb.net/dates', {})
    .then(() => console.log('MongoDB conectado'))  // Si se conecta exitosamente, muestra mensaje
    .catch(err => console.log(err));             // Si hay error, lo muestra

// Definimos el esquema (estructura) de la tabla "usuarios" en la base de datos
const UsuarioSchema = new mongoose.Schema({
    // creamos los campos para almacenar los datos del usuario
    nombre: String,
    apellido: String,
    correo: String,
    contrasenia: String
});
const Usuario = mongoose.model('Users', UsuarioSchema); // Creamos el modelo que nos permite interactuar con la colección "usuarios"

// Definimos el esquema (estructura) de la tabla "Productos" en la base de datos
const ProductoSchema = new mongoose.Schema({
  codigo: String,
  nombre: String,
  descripcion: String,
  precio: Number,
  categoria: String,
  stock: Number,
  proveedor: String
})
const Producto =  mongoose.model('Productos', ProductoSchema); // Creamos el modelo que nos permite interactuar con la colección "productos"

// Rutas para la seccion de LOGIN
// Ruta GET para obtener todos los usuarios de la base de datos
app.get('/usuarios', async (req, res) => {
    const usuarios = await Usuario.find(); // Buscamos TODOS los usuarios en la colección "usuarios" de MongoDB
    res.json(usuarios); // Devolvemos los usuarios como JSON al frontend
});

// Ruta POST para crear un nuevo usuario en la base de datos
app.post('/usuarios', async (req, res) => {
    try {
      const {nombre, apellido, correo, contrasenia} = req.body;
      
      console.log('Intentando crear usuario con correo:', correo);
      
      // Verificar si ya existe un usuario con el mismo correo electrónico
      const usuarioExistente = await Usuario.findOne({ correo: correo });
            
      if (usuarioExistente) {
        console.log('Correo duplicado detectado');
        return res.status(400).json({error: 'El correo electrónico ya está registrado'});
      }
      
      const hashePassword = await bcrypt.hash(contrasenia, 10);
  
      const nuevoUsuario = new Usuario({
        nombre, 
        apellido, 
        correo, 
        contrasenia: hashePassword
      });
  
      await nuevoUsuario.save();
      console.log('Usuario creado exitosamente');
      res.status(201).json({mensaje: 'Usuario registrado correctamente'});
    } catch (err) {
      console.error('Error en POST /usuarios:', err);
      res.status(500).json({error: 'Error al registrar el usuario'});
    }
});
  
//Ruta POST para iniciar sesión
app.post('/login', async (req, res) => {
  const {correo, contrasenia} = req.body;

  try {
    const usuario = await Usuario.findOne({correo});

    if(!usuario){
      return res.status(404).json({mensaje: 'Usuario no encontrado'});
    }

    const passwordValida = await bcrypt.compare(contrasenia, usuario.contrasenia);
    if (!passwordValida) {
      return res.status(401).json({mensaje: 'contraseña incorrecta'});
    }

    // si todo esta bien con los datos
    res.status(200).json({mensaje: 'Inicio de sesión exitoso', usuario});
  } catch (error) {
    console.log(error);
    res.status(500).json({mensaje: 'Error del servidor'})
  }
});

//Rutas para la seccion de AGREGAR PRODUCTOS
app.post('/productos', async (req, res) => {
  try {
    const {codigo, nombre, descripcion, precio, categoria, stock, proveedor} = req.body;
    
    // Validar que los campos requeridos estén presentes
    if (!codigo || !nombre || !precio || !categoria || stock === undefined) {
      return res.status(400).json({error: 'Todos los campos son requeridos excepto descripción y proveedor'});
    }

    // Verificar si ya existe un producto con el mismo código
    const productoExistente = await Producto.findOne({ codigo: codigo });
    if (productoExistente) {
      return res.status(409).json({error: 'Ya existe un producto con ese código'});
    }

    // Validar que precio y stock sean números válidos
    if (isNaN(precio) || precio <= 0) {
      return res.status(400).json({error: 'El precio debe ser un número mayor a 0'});
    }

    if (isNaN(stock) || stock < 0) {
      return res.status(400).json({error: 'El stock debe ser un número mayor o igual a 0'});
    }

    const nuevoProducto = new Producto({
      codigo,
      nombre, 
      descripcion: descripcion || '', 
      precio: parseFloat(precio), 
      categoria,
      stock: parseInt(stock),
      proveedor: proveedor || ''
    });

    await nuevoProducto.save();
    console.log('Producto creado exitosamente:', nuevoProducto);
    res.status(201).json(nuevoProducto);
  } catch (err) {
    console.error('Error en POST /productos:', err);
    res.status(500).json({error: 'Error al registrar el producto'});
  }
});

// Ruta GET para obtener todos los productos
app.get('/productos', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (err) {
    console.error('Error en GET /productos:', err);
    res.status(500).json({error: 'Error al obtener los productos'});
  }
});

// Iniciamos el servidor en el puerto 5000
app.listen(5000, () => {
    console.log('Servidor backend corriendo en http://localhost:5000');
});
