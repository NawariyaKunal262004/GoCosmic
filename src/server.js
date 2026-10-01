import app from './app.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();
const port = process.env.PORT || 3000;

await connectDB();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
