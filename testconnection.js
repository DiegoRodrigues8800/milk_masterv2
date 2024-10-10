// testConnection.js

const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // Ajuste conforme necessário
        },
    },
});

sequelize.authenticate()
    .then(() => {
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
    })
    .catch(err => {
        console.error('Erro ao conectar com o banco de dados:', err);
    })
    .finally(() => {
        sequelize.close();
    });
