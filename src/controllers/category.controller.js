import Category from '../models/category.model.js';

async function createCategory(req, res) {
    try {
        const { name, description } = req.body;
        const category = new Category({ name, description });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
       if (error.code === 11000) {
            return res.status(409).json({
                message: 'A category with this name already exists'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: error.message
            });
        }

        console.error(error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

async function getCategories(req, res){
    try{
        const categories = await Category.find();
        return res.status(200).json(categories);
    } catch(error){
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

export { createCategory, getCategories };