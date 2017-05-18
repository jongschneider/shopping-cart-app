const Product = require('../models/product.js');

const mongoose = require('mongoose');
const mongoDB = require('../app.js');

mongoose.connect(mongoDB);

const products = [
	new Product({
		imagePath: 'https://media.blueapron.com/recipes/2232/c_main_dish_images/1491488490-4-0017-2113/417-2PM-Spiced-Beef-Chili-39090_WEB_Right_high_menu_thumb.jpg',
		itemName: 'Mole-Spiced Beef Chili',
		itemPrice: 12.99,
		itemDescription: 'In Mexican cooking, mole is a centuries-old sauce known for its delicious, spicy-sweet complexity: the result of varied spices, chiles, nuts, and more. This inspired beef chili recipe calls on a combination of traditional mole spices, including chipotle powder, cocoa powder, coriander, cinnamon, and sesame seeds—plus a bit of ancho chile paste and agave nectar (made from the Mexican agave plant). Served with the bold, quick-cooking chili, tender potato and cooling crème fraîche are perfect for stirring into every bite.'
	}),
	new Product({
		imagePath: 'https://media.blueapron.com/recipes/2230/c_main_dish_images/1491932226-4-0008-4619/417_2PP_Spice_Chicken_Sandwich_WEB_Right_high_menu_thumb.jpg',
		itemName: 'Spicy Chicken Sandwiches',
		itemPrice: 14.99,
		itemDescription: 'Alabama white sauce, or white barbecue sauce, is a mayo-based condiment with a kick—thanks to ingredients like cayenne pepper and prepared horseradish (the grated and vinegar-packed root). Tonight, we’re slathering our white sauce onto toasted buns before piling on crispy chicken and pickled sweet peppers. Served with the sandwiches, roasted sweet potato, tossed with marinated scallion, makes for a perfectly hearty side.'
	}),
	new Product({
		imagePath: 'https://media.blueapron.com/recipes/2231/c_main_dish_images/1491932215-4-0007-0954/417_2PF_Shrimp_Fried_Rice_45657_WEBRight_high_menu_thumb.jpg',
		itemName: 'Cumin-Sichuan Shrimp Fried Rice',
		itemPrice: 14.99,
		itemDescription: 'Tonight’s shrimp fried rice gets its delicious heat from two special ingredients: bird’s eye chile and cumin and Sichuan peppercorn sauce. First, we’re sautéing the chile with garlic and scallion as a base for the dish. Later, we’re stirring the sauce in with our rice, building another layer of warm, aromatic flavor. A topping of vinegar-marinated purple daikon radish completes each bowl with a bit of refreshing crunch—and a splash of gorgeous color. (Be sure to slice your radish very thinly, so that it softens a bit as it marinates!)'
	}),
	new Product({
		imagePath: 'https://media.blueapron.com/recipes/2235/c_main_dish_images/1491488506-4-0018-2978/417-2PV1-Swiss-Chard-Shakshuka-38213_WEB_Right_high_menu_thumb.jpg',
		itemName: 'Swiss Chard & Potato Shakshuka',
		itemPrice: 12.99,
		itemDescription: 'Tonight, we’re celebrating a North African and Middle Eastern staple: shakshuka, or eggs baked in a spiced tomato sauce. Our sauce features seasonal mini sweet peppers, known for their bright hues, along with hearty chard and ground espelette pepper, a type of hot paprika popular in southwestern France. On the side, crunchy garlic toasts are perfect for scooping up the flavorful sauce and eggs.'
	}),
	new Product({
		imagePath: 'https://media.blueapron.com/recipes/2236/c_main_dish_images/1491939920-4-0002-6548/417-2PV2-Crispy-Gnocchi-37932_WEB_Right_high_menu_thumb.jpg',
		itemName: 'Crispy Gnocchi',
		itemPrice: 13.99,
		itemDescription: 'Creamy, cheesy, and hearty, this recipe has all the makings of a comfort food classic. After quickly cooking our gnocchi, we’re sautéing them with a bit of butter until they turn crispy and golden brown on the outside—then serving them, dressed with a splash of lemon juice, over a sumptuous fontina cheese sauce. On the side, lemony roasted broccoli cuts through the richness of the pasta and sauce.'
	}),
	new Product({
		imagePath: 'https://media.blueapron.com/recipes/2237/c_main_dish_images/1491488539-4-0020-2582/417-2PV3-Chirashi-Rice-Bowl-39506_WEB_Right_high_menu_thumb.jpg',
		itemName: 'Chirashi-Style Rice Bowls',
		itemPrice: 13.99,
		itemDescription: 'The chirashi bowl is a Japanese favorite of sticky sushi rice (a short-grain variety) covered with any number of flavorful toppings. Tonight’s vegetarian take features a dynamic array of tastes and textures, including crispy tempura-fried mushrooms, pickled carrots spiced with chile paste, creamy avocado, and nutty-sweet roasted broccoli. All together, it makes for a delicious homage to the classic.'
	})
];

// Exit callback function for product.save function.
const exit = () => mongoose.disconnect();

// Because product.save is async, we need to set up the done counter and increment it in the callback.
// Otherwise, product.save would start and it is likely the exit function would be run before all of the
// products have been saved to the database.
let done = 0;
products.map(product => {
	product.save((error, result) => {
		done++;
		if (done === products.length) {
			console.log('All saved!');
			// only when every product has been uploaded do we call the exit function.
			exit();
		}
	});
});
