var mongoose = require('mongoose');
var ProductFileSchema = new mongoose.Schema({unqId:String},{strict: false});

module.exports = mongoose.model(
'ProductFile', ProductFileSchema, 'productfiles');

