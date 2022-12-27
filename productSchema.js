var mongoose = require('mongoose');
 
var Products = new mongoose.Schema({

    unqId:String,
    name:String,
    file:String,
    description: String,
    MRP:String,
    shippingcharge:String,
    discount:String,
    
    
},{timestamps: true}
);
 
module.exports = mongoose.model(
    'Products', Products, 'products');