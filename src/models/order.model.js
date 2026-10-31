import mongoose from "mongoose";
import productModel from "./product.model";
const orderSchema = ({
    user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        items :[
                {
                    product: {
                        type : mongoose.Schema.Types.ObjectId,
                        ref : 'Product',
                        name: 'productModel.name',
                        price: 'productModel.price'
                    },
                    quantity: {
                        type: Number,
                        required: true,
                        min: [1, 'Quantity must be atleast 1']
                    }
                }
            ] 
    },

    {
    timestamps: true
    })