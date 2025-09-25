const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) return res.status(401).json({ error: "Token não fornecido" });

    try {
        const actualToken = token.startsWith("Bearer ") ? token.slice(7) : token;
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET || "segredo123");

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token inválido" });
    }
};

module.exports = authMiddleware;
