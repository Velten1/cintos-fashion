import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";

dotenv.config()

const app = express()

app.use(cors({ credentials: true, origin: 'http://localhost:5170' }));
app.use(express.json());
app.use(cookieParser());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});