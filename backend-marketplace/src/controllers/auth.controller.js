const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (user) => jwt.sign(
  { id: user.id, email: user.email, role: user.role, nombre: user.nombre },
  process.env.JWT_SECRET || 'marketplace_secret',
  { expiresIn: '24h' }
);

exports.register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, email y contraseña son requeridos',
        data: null,
      });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado',
        data: null,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      nombre,
      email,
      password: hashedPassword,
      role: 'CUSTOMER',
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      data: {
        token,
        user: { id: user.id, nombre: user.nombre, email: user.email, role: user.role },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      data: null,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos',
        data: null,
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
        data: null,
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
        data: null,
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        token,
        user: { id: user.id, nombre: user.nombre, email: user.email, role: user.role },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      data: null,
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'nombre', 'email', 'role'],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
        data: null,
      });
    }

    res.json({
      success: true,
      message: 'Perfil obtenido',
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil',
      data: null,
    });
  }
};
