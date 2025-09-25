const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { db } = require('../firebase');
const usuarioController = require('../controller/usuarioController');

const USUARIOS_COLLETION = 'usuarios';

router.post('/', async (req, res) => {

  const data = req.body;

  try {
    if (data.senha) {
      data.senha = bcrypt.hashSync(data.senha, 10);
    }

    const docRef = db.collection(USUARIOS_COLLETION).doc();
    await docRef.set(data);

    res.status(201).json({ id: docRef.id, ...data, senha: undefined });
  } catch (err) {
    console.error("Erro ao criar usuário:", err);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

router.put('/:id', async (req, res, next) => {

  next();
}, usuarioController.editarUsuario);

router.delete('/:id', async (req, res) => {


  try {
    await db.collection(USUARIOS_COLLETION).doc(req.params.id).delete();
    res.json({ message: 'Usuário deletado com sucesso', id: req.params.id });
  } catch (err) {
    console.error("Erro ao deletar usuário:", err);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
});

router.get('/', async (req, res) => {


  try {
    const snapshot = await db.collection(USUARIOS_COLLETION).get();
    const usuarios = snapshot.docs.map(doc => {
      const data = doc.data();
      delete data.senha;
      return { id: doc.id, ...data };
    });
    res.json(usuarios);
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection(USUARIOS_COLLETION).doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Usuário não encontrado' });
    const data = doc.data();
    delete data.senha;
    res.json({ id: doc.id, ...data });
  } catch (err) {
    console.error("Erro ao buscar usuário:", err);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

module.exports = router;
