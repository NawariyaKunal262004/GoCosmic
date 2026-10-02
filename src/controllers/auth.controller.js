import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

async function login(req, res){
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email});
        if(!user) {
            return res.status(401).json({message: "Invalid credentials"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({message: "Invalid credentials"});
        }
        const token = jwt.sign({ id: user._id, role: user.role}, process.env.JWT_SECRET, { expiresIn: '1h'});
        res.status(200).json({message: "Login successful", token});
    } catch (error) {
        res.status(500).json({message: "Error logging in", error: error.message});
    }
}
async function getMe(req, res) {
   await res.status(200).json({
        user: req.user
    });
}

export { getMe };
export { login };