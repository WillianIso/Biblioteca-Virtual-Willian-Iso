const { db } = require('../firebase');
const bcrypt = require('bcryptjs');

const USUARIOS_COLLETION = 'usuarios';

exports.editarUsuario = async (req, res) => {

    const userId = req.params.id;
    const data = req.body;

    try {
        if (data.senha) {
            data.senha = bcrypt.hashSync(data.senha, 10);
        }

        await db.collection(USUARIOS_COLLETION).doc(userId).update(data);
        res.json({ id: userId, ...data, senha: undefined });
    } catch (err) {
        console.error("Erro ao atualizar usuário:", err);
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
};