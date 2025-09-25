// routes/turmas.js
const express = require('express');
const router = express.Router();
const { db } = require('../firebase');

const USUARIOS_COLLETION = 'turmas';

router.post('/', async (req, res) => {


  const data = req.body;
  try {
    const docRef = db.collection(USUARIOS_COLLETION).doc();
    await docRef.set(data);

    res.status(201).json({ id: docRef.id, ...data });
  } catch (err) {
    console.error("Erro ao criar turma:", err);
    res.status(500).json({ error: 'Erro ao criar turma' });
  }
});

router.put('/:id', async (req, res) => {


  const permissaoId = req.params.id;
  const data = req.body;

  try {
    await db.collection(USUARIOS_COLLETION).doc(permissaoId).update(data);
    res.json({ id: permissaoId, ...data });
  } catch (err) {
    console.error("Erro ao atualizar turma:", err);
    res.status(500).json({ error: 'Erro ao atualizar turma' });
  }
});

router.delete('/:id', async (req, res) => {


  try {
    await db.collection(USUARIOS_COLLETION).doc(req.params.id).delete();
    res.json({ message: 'Turma deletada com sucesso', id: req.params.id });
  } catch (err) {
    console.error("Erro ao deletar turma:", err);
    res.status(500).json({ error: 'Erro ao deletar turma' });
  }
});

router.get('/', async (req, res) => {

  try {
    const snapshot = await db.collection(USUARIOS_COLLETION).get();
    const turmas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(turmas);
  } catch (err) {
    console.error("Erro ao buscar turmas:", err);
    res.status(500).json({ error: 'Erro ao buscar turmas' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection(USUARIOS_COLLETION).doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Turma não encontrada' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error("Erro ao buscar turma:", err);
    res.status(500).json({ error: 'Erro ao buscar turma' });
  }
});

module.exports = router;
