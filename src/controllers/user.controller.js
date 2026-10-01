import User from "../models/user.model.js";

async function createUser(req, res) {
    try {
        const { name, email, password, role } = req.body;
        const newUser = new User({ name, email, password, role });
        await newUser.save();
        res.status(201).json({ message : "User created succesfully", user : newUser })
    } catch (error) {
        res.status(400).json({ message : "Error creating user", error })
    }
}

export { createUser };