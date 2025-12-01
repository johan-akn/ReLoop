
const express = require('express');


const pool = require('./config/database'); 


const app = express();
const PORT = process.env.PORT || 3001; 

// Middlewares básicos
app.use(express.json()); // Permite que o Express leia dados JSON no corpo da requisição

// Rota de teste simples
app.get('/', (req, res) => {
    res.send('API RELOOP Online! Conectado ao BD se não houver erros no console.');
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});