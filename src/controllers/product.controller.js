import Product from '../models/product.model.js';
import Category from '../models/category.model.js';

async function createProduct(req, res) {
    try{
        const {name, description, price, categoryId} = req.body;
        const existingCategory = await Category.findById(categoryId);
        if(!existingCategory){
            return res.status(404).json({message: "Category not found"})
        }
        const product = new Product({name, description, price, category: categoryId, seller: req.user._id});
        await product.save();
        return res.status(201).json({message: "Product created successfully", product});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

export { createProduct };