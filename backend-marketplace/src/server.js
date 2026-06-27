require('dotenv').config();
const bcrypt = require('bcryptjs');
const app = require('./app');
const { sequelize, User, Category } = require('./models');

const PORT = process.env.PORT || 3001;

const seedData = async () => {
    const categories = [
        { nombre: 'Laptops', descripcion: 'Computadoras portátiles' },
        { nombre: 'Periféricos', descripcion: 'Mouse, teclados y accesorios' },
        { nombre: 'Monitores', descripcion: 'Pantallas y monitores' },
        { nombre: 'Audio', descripcion: 'Audífonos y parlantes' },
    ];

    for (const cat of categories) {
        await Category.findOrCreate({ where: { nombre: cat.nombre }, defaults: cat });
    }

    const adminEmail = 'admin@productstore.com';
    const customerEmail = 'customer@productstore.com';

    const adminExists = await User.findOne({ where: { email: adminEmail } });
    if (!adminExists) {
        await User.create({
            nombre: 'Administrador',
            email: adminEmail,
            password: await bcrypt.hash('Admin123!', 10),
            role: 'ADMIN',
        });
        console.log('Usuario ADMIN creado: admin@productstore.com / Admin123!');
    }

    const customerExists = await User.findOne({ where: { email: customerEmail } });
    if (!customerExists) {
        await User.create({
            nombre: 'Cliente Demo',
            email: customerEmail,
            password: await bcrypt.hash('Customer123!', 10),
            role: 'CUSTOMER',
        });
        console.log('Usuario CUSTOMER creado: customer@productstore.com / Customer123!');
    }
};

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida');

        await sequelize.sync({ alter: true });
        console.log('Modelos sincronizados');

        await seedData();

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();
