// cart-service/index.js

const express = require('express');
const { createClient } = require('redis');

const app = express();
app.use(express.json());

// --- Kết nối Redis ---
const redisClient = createClient({
    // Trong môi trường Docker, chúng ta sẽ dùng tên service
    url: 'redis://cart-service-db:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

// --- Các API Endpoints ---

// Lấy giỏ hàng của một người dùng
app.get('/cart/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const cart = await redisClient.get(`cart:${userId}`);
        res.status(200).json(JSON.parse(cart) || { items: [] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Thêm sản phẩm vào giỏ hàng
app.post('/cart/:userId', async (req, res) => {
    const userId = req.params.userId;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        return res.status(400).json({ error: 'productId and quantity are required' });
    }

    try {
        // Lấy giỏ hàng hiện tại
        const cartString = await redisClient.get(`cart:${userId}`);
        const cart = JSON.parse(cartString) || { items: [] };

        // Kiểm tra xem sản phẩm đã tồn tại chưa
        const itemIndex = cart.items.findIndex(item => item.productId === productId);

        if (itemIndex > -1) {
            // Cập nhật số lượng
            cart.items[itemIndex].quantity += quantity;
        } else {
            // Thêm sản phẩm mới
            cart.items.push({ productId, quantity });
        }

        // Lưu lại giỏ hàng vào Redis
        await redisClient.set(`cart:${userId}`, JSON.stringify(cart));
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Khởi động Server ---
const PORT = 3001; // Sử dụng một port khác
app.listen(PORT, async () => {
    await redisClient.connect();
    console.log(`Cart service running on port ${PORT}`);
    console.log('Connected to Redis!');
});