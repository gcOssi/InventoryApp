const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Limpiar datos existentes
    await Product.deleteMany({});
    await Supplier.deleteMany({});
    
    // Crear proveedores
    const suppliers = await Supplier.insertMany([
      {
        name: 'Tech Solutions S.A.',
        email: 'contact@techsolutions.com',
        phone: '+34 123 456 789'
      },
      {
        name: 'Global Electronics Ltd.',
        email: 'info@globalelectronics.com',
        phone: '+34 987 654 321'
      }
    ]);
    
    // Crear productos
    const products = [
      {
        name: 'Laptop HP Pavilion',
        sku: 'HP-PAV-001',
        category: 'Electrónicos',
        description: 'Laptop HP Pavilion 15.6" Intel Core i5',
        price: 899.99,
        stock: 45,
        minStock: 10,
        supplier: suppliers[0]._id
      },
      {
        name: 'Mouse Logitech MX',
        sku: 'LOG-MX-002',
        category: 'Accesorios',
        description: 'Mouse inalámbrico Logitech MX Master 3',
        price: 79.99,
        stock: 8,
        minStock: 15,
        supplier: suppliers[1]._id
      },
      {
        name: 'Teclado Mecánico',
        sku: 'TEC-MEC-003',
        category: 'Accesorios',
        description: 'Teclado mecánico RGB con switches azules',
        price: 129.99,
        stock: 0,
        minStock: 5,
        supplier: suppliers[1]._id
      }
    ];
    
    await Product.insertMany(products);
    
    console.log('Datos de prueba insertados correctamente');
    process.exit(0);
  } catch (error) {
    console.error('Error insertando datos:', error);
    process.exit(1);
  }
};

seedData();