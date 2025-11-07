import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import addressRoutes from "./routes/addressRoutes";
import priceRulesRoutes from "./routes/priceRulesRoutes";
import cartRoutes from "./routes/cartRoutes";

dotenv.config()

const app = express()

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(cookieParser());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Rotas de autenticacao
app.use('/api/auth', authRoutes)

// Rotas de produtos
app.use('/api/products', productRoutes)

// Rotas de endereços
app.use('/api/addresses', addressRoutes)

// Rotas de regras de preço
app.use('/api/price-rules', priceRulesRoutes)

// Rotas de carrinho
app.use('/api/cart', cartRoutes)

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});