const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Banco de Dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '', 
    database: 'cornercraft_db'
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL');
});

// Criação de Rota para registro
app.post('/register', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Preencha todos os campos' });
    }

    const checkEmailQuery = 'SELECT * FROM usuario WHERE email = ?';
    db.query(checkEmailQuery, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao verificar e-mail', error: err });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'E-mail já cadastrado' });
        }

        const query = 'INSERT INTO usuario (email, password) VALUES (?, ?)';
        db.query(query, [email, password], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao registrar usuário', error: err });
            }
            res.status(201).json({ message: 'Usuário registrado com sucesso' });
        });
    });
});


// Criação de Rota para o Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Preencha todos os campos' });
    }
    
    const query = 'SELECT * FROM usuario WHERE email = ? AND password = ?';
    db.query(query, [email, password], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao buscar usuário', error: err });
        }
        
        if (results.length === 0) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }
        
        res.json({ message: 'Login bem-sucedido' });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
