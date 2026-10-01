import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

async function login(req, res){
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email});
        if(!user) {
            return res.status(401).json({message: "User not found"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({message: "Invalid credentials"});
        }
        res.status(200).json({message: "Login successful"});
    } catch (error) {
        res.status(500).json({message: "Error logging in", error: error.message});
    }
}

export { login };