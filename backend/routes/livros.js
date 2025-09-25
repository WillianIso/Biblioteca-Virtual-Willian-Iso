const express = require('express');
const router = express.Router();
const livrosController = require('../controller/livroController');
const usuarioController = require('../controller/usuarioController');
const { db } = require('../firebase');
const LIVROS_COLLECTION = 'livros';

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post("/cadastrar", upload.fields([{ name: "imagem" }, { name: "pdf" }]), async (req, res) => {
  try {
    const { titulo, autor, editora } = req.body;

    const livro = {
      titulo,
      autor,
      editora,
      imagem: req.files.imagem ? req.files.imagem[0].filename : null,
      pdf: req.files.pdf ? req.files.pdf[0].filename : null,
      emprestado: 0,
      dataInicio: new Date(),
    };

    const livroRef = await db.collection(LIVROS_COLLECTION).add(livro);
    res.status(201).json({ id: livroRef.id, ...livro });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', (req, res, next) => {

  next();
}, livrosController.editarLivro);

router.delete('/:id', (req, res, next) => {

  next();
}, livrosController.deletarLivro);

router.get('/:id', livrosController.obterLivroPorId);

router.get('/', livrosController.listarLivros);

const USUARIOS_COLLECTION = 'usuarios';

const { FieldValue } = require('firebase-admin').firestore;

router.put('/pegarEmprestado', async (req, res) => {
  try {
    const userRef = db.collection(USUARIOS_COLLECTION).doc(req.usuario.id);


    await userRef.update({
      livros: FieldValue.arrayUnion(req.livro)
    });

    res.json({ message: "Livro emprestado com sucesso" });
  } catch (err) {
    console.error("Erro em pegarEmprestado:", err);
    res.status(500).json({ error: "Erro ao processar empréstimo" });
  }
});


router.put('/devolver', async (req, res, next) => {

  const userRef = db.collection(USUARIOS_COLLECTION).doc(req.usuario.id);
  const userSnap = await userRef.get();

  if (!userSnap.exists) return res.status(404).json({ message: "Usuário não encontrado" });

  if (userSnap.livros == null) return res.status(404).json({ message: "Livro não se encontra na lista de leitura." });

  const index = userSnap.livros.findIndex(elem => elem.nome === req.livro.nome);
  if (index === -1) {
    return res.status(404).json({ message: "Livro não se encontra na lista de leitura." });
  }

  userSnap.livros.splice(index, 1);

  next();

}, usuarioController.editarUsuario);

module.exports = router;
