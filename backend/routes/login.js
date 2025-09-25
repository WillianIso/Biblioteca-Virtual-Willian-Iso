const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { db } = require("../firebase");

const router = express.Router();
const USUARIOS_COLLECTION = "usuarios";
const JWT_SECRET = process.env.JWT_SECRET;

async function autenticarJWT(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token não fornecido" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido" });
  }
}

router.post("/", async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ message: "Email e senha obrigatórios" });

  try {
    const querySnapshot = await db
      .collection(USUARIOS_COLLECTION)
      .where("email", "==", email)
      .limit(1)
      .get();

    if (querySnapshot.empty) return res.status(400).json({ message: "Usuário não encontrado" });

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    const senhaCorreta = bcrypt.compareSync(senha, userData.senha);
    // if (!senhaCorreta) return res.status(401).json({ message: "Senha incorreta" });

    const token = jwt.sign({ id: userDoc.id, email: userData.email }, JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

router.get("/me", autenticarJWT, async (req, res) => {
  try {
    const userRef = db.collection(USUARIOS_COLLECTION).doc(req.user.id);
    const userSnap = await userRef.get();

    if (!userSnap.exists) return res.status(404).json({ message: "Usuário não encontrado" });

    const userData = userSnap.data();
    delete userData.senha;

    return res.status(200).json({
      message: "Usuário autenticado com sucesso!",
      user: { id: userSnap.id, ...userData },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

module.exports = router;
