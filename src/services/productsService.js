import { PicsService } from './picsService.js';
import { CategoryService } from './categoryService.js';
import { ToolsService } from './toolsService.js';

let ProductsService = {
	picSize:280,
	categories: [],
	products:[],
	productsAll:[],
	productsAllComplete:[],
	filters: [],
	getByApi: function(){
		return [
		];
	},
	getByApiAll: function(){
		let products = [];

		if (this.productsAll.length !== 0)
			return this.productsAll;

		for (var i = 0; i< 30; i++) {
			let product = { badge: "", id: i}
			
			let res = PicsService.finallyGetPicUrl(this.picSize);
			let category = CategoryService.getRandomCategory();			
			
			product.url = res.final;
			product.urls = res.pre.reverse();
			product.category = category;
			product.name = CategoryService.getRandomAdjective() + " " + CategoryService.getRandomFoodName().trim() + " and " + CategoryService.getRandomFoodName().trim();
			
			product.name = product.name.toLowerCase();
			
			product.priceval = ToolsService.getRandomFloat(1, 2000, 2);
			product.price = "$" + product.priceval;

			product.weight = ToolsService.getRandomFloat(100, 500, 2);
			
			products.push(product);			
		}

		this.productsAll = this.productsAllComplete = products;
		return this.productsAll;
	},
	filter: function(mask, from, to) {
		var self = this;

		if (mask) {
			this.filters.push("byTitle");
		} else {
			this.filters = this.filters.filter(f => f !== 'byTitle');
		}

		if (from && to) {
			this.filters.push("byPrice");
		} else {			
			this.filters = this.filters.filter(f => f !== 'byPrice');
		}

		this.productsAll = this.productsAllComplete.filter(function(el) { 
			var cond1 = mask ? (el.name.toLowerCase().indexOf(mask.toLowerCase()) != -1) : false;
		 	var price = parseFloat(el.price.replace("$", "")); 
		 	var cond2 = from && to ? (((price) > parseFloat(from)) && (price < parseFloat(to))) : false;
		 	var result = true;

		 	for (var filter of self.filters) {
		 		switch (filter) {
		 			case "byTitle":
		 				result = result && cond1;
		 			break;
		 			case "byPrice": 			
		 				result = result && cond2;
		 			break;
		 		}
		 	}

		 	return result;
		});
		var countFiltered = self.productsAllComplete.length - this.productsAll.length;		
		return countFiltered;
	},
	clearFilter: function(mask) {
		this.productsAll = this.productsAllComplete;
		return this.productsAll;
	},
	getTotalPrice: function() {
		let sum = 0;
		for(let i of this.products){
			sum += parseFloat(i.price.replace("$", ""));
		}
		return "$" + parseFloat(sum).toFixed(2);
	},
	getCurrentProducts: function() {
		return this.products = (this.products.length > 0 ? this.products : this.getByApi());
	},
	getAllProducts: function() {
		return this.productsAll = this.getByApiAll();
	},
	sortProducts: function(by ,direction){
		return this.productsAll = this.productsAll.sort(function(a, b){

			if (by === "price" && direction === "asc") {
				return a["priceval"]*1 > b["priceval"]*1;
			}

			if (by === "price" && direction === "desc") {
				return b["priceval"]*1 > a["priceval"]*1;
			}

			if (by === "alph" && direction === "asc") {
				return a["name"][0] > b["name"][0];
			}

			if (by === "alph" && direction === "desc") {
				return b["name"][0] > a["name"][0];
			}
		});
	},
	filterProductsCategory: function(category){
		return this.productsAll  = this.productsAllComplete.filter(function(item){
			return item.category === category;
		})
	},
	getCategories: function(){
		this.categories = [];
		let allProducts = this.getAllProducts();
		
		for(let product of allProducts){
			if (this.categories.indexOf(product.category) == -1) {
				this.categories.push(product.category);
			}
		}
		
		return this.categories;
	},
	addProduct: function(item) {
		this.products.push(item);
		return this.products;
	}
};

export { ProductsService };