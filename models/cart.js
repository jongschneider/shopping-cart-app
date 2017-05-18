module.exports = function Cart(oldCart = {}) {
	this.items = oldCart.items || {};
	this.totalQty = oldCart.totalQty || 0;
	this.totalPrice = oldCart.totalPrice
		? Number(oldCart.totalPrice.toFixed(2))
		: 0;

	this.generateArray = () => {
		const arr = [];
		for (let id in this.items) {
			arr.push(this.items[id]);
		}
		return arr;
	};

	this.add = (item, id) => {
		let storedItem = this.items[id];
		if (!storedItem) {
			storedItem = this.items[id] = {
				item,
				qty: 0,
				price: 0
			};
		}
		storedItem.qty++;
		storedItem.price = Number(
			(storedItem.item.itemPrice * storedItem.qty).toFixed(2)
		);
		this.totalQty++;
		this.totalPrice += Number(storedItem.item.itemPrice.toFixed(2));
	};

	this.update = (item, id, updateNumber) => {
		let storedItem = this.items[id];
		const difference = updateNumber - storedItem.qty;
		storedItem.qty = updateNumber;
		storedItem.price = Number(
			(storedItem.item.itemPrice * storedItem.qty).toFixed(2)
		);
		this.totalQty += difference;
		this.totalPrice += Number(
			(difference * storedItem.item.itemPrice).toFixed(2)
		);
		if (this.items[id].qty <= 0) {
			delete this.items[id];
		}
	};

	this.remove = id => {
		this.totalQty -= this.items[id].qty;
		this.totalPrice -= this.items[id].price;
		delete this.items[id];
	};
};
