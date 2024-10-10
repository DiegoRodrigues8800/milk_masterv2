// app.js

const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();

// Middleware para logs de requisições
app.use(morgan('dev'));

// Middleware para interpretar dados do corpo das requisições
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configurar a engine de templates EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal
app.get('/', (req, res) => {
    res.render('index', { titulo: 'ERP de Vacas Leiteiras' });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// app.js (adicione após as importações)

const sequelize = require('./config/database');
const Vaca = require('./models/vaca');
const Raca = require('./models/raca');

// Definir associações
Vaca.belongsTo(Raca, { foreignKey: 'racaId' });
Raca.hasMany(Vaca, { foreignKey: 'racaId' });

// Sincronizar com o banco de dados
sequelize.authenticate()
    .then(() => {
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
        return sequelize.sync(); // Sincroniza os modelos
    })
    .then(() => {
        console.log('Modelos sincronizados com o banco de dados.');
    })
    .catch(err => {
        console.error('Erro ao conectar com o banco de dados:', err);
    });

// app.js (adicione após a rota principal)

const vacasRouter = require('./routes/vaca');

app.use('/vacas', vacasRouter);
