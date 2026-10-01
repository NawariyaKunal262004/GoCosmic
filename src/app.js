import express from 'express';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();
app.use(express.json());


app.get('/api/health', (req,res) => {
    res.json({
        "message": "GoCosmic API is running"
    });
})

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

export default app;
