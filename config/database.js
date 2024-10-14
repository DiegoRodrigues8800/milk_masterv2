// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306, // Adicione a porta aqui
    dialect: 'mysql',
    dialectOptions: {
        // Se estiver usando SSL, adicione as opções aqui
        ssl: {
            require: true,
            rejectUnauthorized: false, // Pode precisar ajustar conforme sua configuração SSL
        },
    },
});

module.exports = sequelize;
