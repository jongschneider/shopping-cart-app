const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
	imagePath: { type: String, required: true },
	itemName: { type: String, required: true },
	itemPrice: { type: Number, required: true },
	itemDescription: { type: String, required: true }
});

module.exports = mongoose.model('Product', ProductSchema);
