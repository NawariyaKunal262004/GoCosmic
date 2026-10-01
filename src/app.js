import express from 'express';
import userRoutes from './routes/user.routes.js';

const app = express();
app.use(express.json());


app.get('/api/health', (req,res) => {
    res.json({
        "message": "GoCosmic API is running"
    });
})

app.use('/api/users', userRoutes);

export default app;
