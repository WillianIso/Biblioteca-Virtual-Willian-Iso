// routes/permissoes.js
const express = require('express');
const router = express.Router();
const { db } = require('../firebase');

const PERMISSOES_COLLETION = 'permissoes';

router.post('/', async (req, res) => {


  const data = req.body;
  try {
    const docRef = db.collection(PERMISSOES_COLLETION).doc();
    await docRef.set(data);

    res.status(201).json({ id: docRef.id, ...data });
  } catch (err) {
    console.error("Erro ao criar permissão:", err);
    res.status(500).json({ error: 'Erro ao criar permissão' });
  }
});

router.put('/:id', async (req, res) => {


  const permissaoId = req.params.id;
  const data = req.body;

  try {
    await db.collection(PERMISSOES_COLLETION).doc(permissaoId).update(data);
    res.json({ id: permissaoId, ...data });
  } catch (err) {
    console.error("Erro ao atualizar permissão:", err);
    res.status(500).json({ error: 'Erro ao atualizar permissão' });
  }
});

router.delete('/:id', async (req, res) => {


  try {
    await db.collection(PERMISSOES_COLLETION).doc(req.params.id).delete();
    res.json({ message: 'Permissão deletada com sucesso', id: req.params.id });
  } catch (err) {
    console.error("Erro ao deletar permissão:", err);
    res.status(500).json({ error: 'Erro ao deletar permissão' });
  }
});

router.get('/', async (req, res) => {


  try {
    const snapshot = await db.collection(PERMISSOES_COLLETION).get();
    const permissoes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(permissoes);
  } catch (err) {
    console.error("Erro ao buscar permissões:", err);
    res.status(500).json({ error: 'Erro ao buscar permissões' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection(PERMISSOES_COLLETION).doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Permissão não encontrada' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error("Erro ao buscar permissão:", err);
    res.status(500).json({ error: 'Erro ao buscar permissão' });
  }
});

module.exports = router;
