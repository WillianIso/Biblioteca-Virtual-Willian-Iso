// server.js
require("dotenv").config();
const express = require('express');
const app = express();
const usuariosRouter = require('./routes/usuarios');
const livrosRouter = require('./routes/livros');
const permissoesRouter = require('./routes/permissoes');
const turmasRouter = require('./routes/turmas');
const loginRouter = require("./routes/login.js");
const cors = require("cors"); 
const authMiddleware = require("./auth.js");


app.use(cors());
app.use(express.json());
app.use("/usuarios", authMiddleware, usuariosRouter);
app.use("/livros", authMiddleware, livrosRouter);
app.use("/permissoes", authMiddleware, permissoesRouter);
app.use("/turmas", authMiddleware, turmasRouter);
app.use('/login', loginRouter);
app.use('/uploads', express.static('uploads'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
