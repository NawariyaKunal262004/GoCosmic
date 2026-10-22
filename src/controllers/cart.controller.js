import { response } from "express";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";

async function addToCart(req, res) {
    try {
        const { productId, quantity } = req.body;
        const itemQuantity = quantity ?? 1; // Default to 1 if quantity is not provided
        const userId = req.user._id;

        if (!productId || !mongoose.isObjectIdOrHexString(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }


        if (!Number.isInteger(itemQuantity) || itemQuantity < 1) {
            return res.status(400).json({
                message: "Quantity must be a positive integer"
            });
        }
        const product = await Product.findById(productId);

        if(!product) {
            return res.status(404).json({ message: "Product not found"});
        }

        
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({
                user: userId,
                items: []
            });
        }
        const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        
        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += itemQuantity;
        } else {
            cart.items.push({ product: productId, quantity: itemQuantity });
        }

        await cart.save();
        return res.status(200).json({ message: "Item added to cart", cart });
    } catch (error) {
        return res.status(500).json({ message: "Error adding to cart", error });
    }
}

async function getCart(req, res) {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if(!cart){
            return res.status(200).json({
                cart: { items: [] },
                subtotal: 0,
                message: "Cart is empty"
            });
        }
        let subtotal = cart.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
        return res.status(200).json({ cart, subtotal, message: "Cart fetched successfully"});
    } catch (error) {
        return res.status(500).json({ message: "Error fetching cart", error });
    }
}

async function updateCartItem(req, res) {
    try {
        const productId = req.params.productId;
        const { quantity } = req.body;
        const userId = req.user._id;

        if (!mongoose.isObjectIdOrHexString(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be a positive integer"
            });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (existingItemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        cart.items[existingItemIndex].quantity = quantity;
        await cart.save();
        return res.status(200).json({ message: "Item quantity updated", cart });
    } catch (error) {
        return res.status(500).json({ message: "Error updating cart item"});
    }
}

async function removeCartItem(req,res){
    try {
            const productId = req.params.productId;
            const userId = req.user._id;

            if (!mongoose.isObjectIdOrHexString(productId)) {
                    return res.status(400).json({ message: "Invalid product ID" });
                }

            let cart = await Cart.findOne({ user: userId });    

            if (!cart) {
                    return res.status(404).json({ message: "Cart not found" });
                }
            
            const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

            if (existingItemIndex === -1) {
                    return res.status(404).json({ message: "Item not found in cart" });
                }
            cart.items.splice(existingItemIndex, 1);
            await cart.save();  
            return res.status(200).json({ message: "Item removed from cart", cart });
    } catch (error) {
        return res.status(500).json({ message: "Error removing cart item"});
    }
}

async function clearCart(req, res) {
    try {
        const userId = req.user._id;
        let cart = await Cart.findOne({ user: userId });   
        if (!cart) {
                    return res.status(404).json({ message: "Cart not found" });
                }
        cart.items = [];
        await cart.save();  
        return res.status(200).json({ message: "Cart cleared successfully" });      
    } catch (error) {
        return res.status(500).json({ message: "Error removing cart"});
    }
}

export { addToCart, getCart, updateCartItem, removeCartItem, clearCart };
