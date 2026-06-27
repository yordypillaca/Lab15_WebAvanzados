const { Category } = require('../models');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json({
      success: true,
      message: 'Categorías obtenidas correctamente',
      data: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener categorías',
      data: null,
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: 'El nombre es requerido',
        data: null,
      });
    }

    const category = await Category.create({ nombre, descripcion });

    res.status(201).json({
      success: true,
      message: 'Categoría creada correctamente',
      data: category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al crear categoría',
      data: null,
    });
  }
};
