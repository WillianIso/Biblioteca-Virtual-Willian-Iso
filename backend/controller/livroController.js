const { db } = require('../firebase');
const fs = require('fs');
const path = require('path');

const LIVROS_COLLECTION = 'livros';

exports.cadastrarLivro = async (req, res) => {
  try {
    const { titulo, autor, editora, emprestado, dataInicio, dataFim } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'Arquivo PDF é obrigatório' });

    const filename = `${Date.now()}_${file.originalname}`;
    const filepath = path.join(__dirname, '../uploads', filename);
    fs.writeFileSync(filepath, file.buffer);

    const novoLivro = {
      titulo,
      autor,
      editora,
      emprestado: parseInt(emprestado || 0),
      dataInicio,
      dataFim,
      pdfPath: `/uploads/${filename}`
    };

    const livroRef = await db.collection(LIVROS_COLLECTION).add(novoLivro);
    res.status(201).json({ id: livroRef.id, ...novoLivro });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.editarLivro = async (req, res) => {
  try {
    const { id } = req.params;
    const dadosAtualizados = req.body;

    await db.collection(LIVROS_COLLECTION).doc(id).update(dadosAtualizados);
    res.json({ message: 'Livro atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletarLivro = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection(LIVROS_COLLECTION).doc(id).delete();
    res.json({ message: 'Livro deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obterLivroPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection(LIVROS_COLLECTION).doc(id).get();

    if (!doc.exists) return res.status(404).json({ error: 'Livro não encontrado' });

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listarLivros = async (req, res) => {
  try {
    const { titulo, autor } = req.query;
    let query = db.collection(LIVROS_COLLECTION);

    if (titulo) query = query.where('titulo', '>=', titulo).where('titulo', '<=', titulo + '\uf8ff');
    if (autor) query = query.where('autor', '>=', autor).where('autor', '<=', autor + '\uf8ff');

    const snapshot = await query.get();
    const livros = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(livros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
