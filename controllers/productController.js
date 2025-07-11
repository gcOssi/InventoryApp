const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

// Obtener todos los productos
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .populate('supplier')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    res.render('products', {
      title: 'Productos',
      products,
      pagination: {
        page,
        pages: totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).render('error', { error: 'Error del servidor' });
  }
};

// Crear nuevo producto
const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.redirect('/products');
  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).render('error', { error: 'Error creando producto' });
  }
};

// Actualizar producto
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndUpdate(id, req.body);
    res.redirect('/products');
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).render('error', { error: 'Error actualizando producto' });
  }
};

// Eliminar producto
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/products');
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).render('error', { error: 'Error eliminando producto' });
  }
};

// API endpoints
const getProductsAPI = async (req, res) => {
  try {
    const products = await Product.find().populate('supplier');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo productos' });
  }
};

const createProductAPI = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error creando producto' });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsAPI,
  createProductAPI
};