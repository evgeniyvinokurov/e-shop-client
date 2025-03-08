import Vue from '../../lib/vue.js';

import Modal from './modal.js';

import { ToolsService } from '../services/toolsService.js';
import { ProductsService } from '../services/productsService.js';
import { PicsService } from '../services/picsService.js';

let Main = Vue.component('catalog', {
  	template: '<div><div class="big-product-card">'+
                      '<div class="big-product"><img :src="bigImageUrl"/></div>'+
                      '<div class="big-product"><div class="big-product--text">But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure.</div><div class="big-price"><div class="big-price__digits">${{bestPrice}}</div><div class="big-price__words">best price</div></div></div>'+                                        
                  '</div>'+
      '<div class="browse__category">'+
      	'<span class="browse__category-title">Categories: </span>'+
      	'<span class="browse__category-item"  v-bind:class="{ selected: all}" v-on:click="showAll()">All</span>'+
      	'<span class="browse__category-item" v-for="(item, index) in categories" v-bind:class="{ selected: selectedCategory === item}" v-on:click="selectCategory(item)">{{item}}</span>'+
      '</div>'+
      '<div class="sort">'+
      	'<span class="sort-title">Sort: </span>'+
      	'<span class="sort-item" v-bind:class="{ selected: direction === sort.price.asc.direction && by === sort.price.asc.by}" v-on:click="sortCatalog(sort.price.asc)">Price up</span>'+
      	'<span class="sort-item" v-bind:class="{ selected: direction === sort.price.desc.direction && by === sort.price.desc.by}" v-on:click="sortCatalog(sort.price.desc)">Price down</span>'+
      	'<span class="sort-item" v-bind:class="{ selected: direction === sort.alph.asc.direction && by === sort.alph.asc.by}" v-on:click="sortCatalog(sort.alph.asc)">A-z</span>'+
      	'<span class="sort-item" v-bind:class="{ selected: direction === sort.alph.desc.direction && by === sort.alph.desc.by}" v-on:click="sortCatalog(sort.alph.desc)">Z-a</span>'+
      '</div>'+
      '<div class="products-list"><div v-for="(item, index) in products" class="product-card" v-on:click="showProduct(item)">'+
      '<img  :src="item.url" />'+
  		'<div class="product-card__name">{{item.name}}</div>'+
  		'<div class="product-card__price">{{item.price}}</div>'+
  		'<div class="product-card__cover""></div>'+
  		'<div class="product-card__badge" v-bind:class="{ hide: item.badge.length == 0}">{{item.badge}}</div>'+
      '<div class="product-card__buy" v-bind:class="{ hide: (item.badge.length > 0) || orderCreated}" v-on:click="addProduct($event, item)">buy</div>'+
  	 '</div></div>'+ 
     '<modal></modal>'+    
     '</div>',
    data: function () {
        return {
          by: "",
          all: true,
          selectedCategory: "",
          categories: [],
          direction: "",
          products: [],
          orderCreated: false,
          bigImageUrl: "",
          bigImageSize: 320,
          bestPrice: 0,
          sort:{
            "price": {
              "asc": {"direction": "asc" , "by": "price"},
              "desc": {"direction": "desc" , "by": "price"}
            },
            "alph": {
              "asc": {"direction": "asc" , "by": "alph"},
              "desc": {"direction": "desc" , "by": "alph"}
            }
          },
        }
    },
  	created: function() {
      var self = this;
      
      this.bigImageUrl = PicsService.finallyGetPicUrl(this.bigImageSize).final;
      
  		this.products = ProductsService.getAllProducts();
  		
  		this.bestPrice = ToolsService.getRandomFloat(0, 1000, 2);

      this.categories = ProductsService.getCategories();

      this.$root.$on("orderCreated", function(){
        self.orderCreated = true;
      }); 

      this.$root.$on("clearCatFilter", function(){        
        self.selectedCategory = "";
        self.by = "";
        self.direction = "";
      }); 

      this.$root.$on("catalogRefresh", function(){
        self.products = ProductsService.getAllProducts();

        self.currentProducts = ProductsService.getCurrentProducts();
        
        var ids = []; 
        for(var p of self.currentProducts) {
          ids.push(p.id);
        }

        for(var p of self.products) {
          if (ids.indexOf(p.id) !== -1){
            p.badge = "added";
          }
        }

        self.$root.$emit("headerCount", { filteredProductsCount: ProductsService.productsAllComplete.length - self.products.length });
      });

      this.$root.$on("cancelOrder", function(){
        self.orderCreated = false;
      }); 
    },
    methods: {
    	sortCatalog: function(param) {
        this.all = false;

        this.by = param.by;
        this.direction = param.direction;        

        this.products = ProductsService.sortProducts(param.by, param.direction);
    	},
    	addProduct: function($event, item) {
          $event.stopPropagation();
	        this.$root.$emit("addProduct", {item: item});
          item.badge = "added";
	    },
      showProduct: function(item) {
          this.$root.$emit("showModal", {item: item});
      },
      getCategories: function() {
          ProductsService.getCategories();
      },
      selectCategory: function(item) {
          this.all = false;
          this.selectedCategory = item;
          this.$root.$emit("clearFilterEl");

          this.products = ProductsService.filterProductsCategory(item);
          
          this.$root.$emit("headerCount", { filteredProductsCount: ProductsService.productsAllComplete.length  - this.products.length });
      },
      showAll: function() {
          this.all = true;
          this.selectedCategory = "";
          this.by = "";
          this.direction = "";

          this.$root.$emit("clearFilterEl");
          this.products = ProductsService.productsAll = ProductsService.productsAllComplete;
          this.$root.$emit("headerCount", { filteredProductsCount: ProductsService.productsAllComplete.length  - this.products.length });
      }
    }
})

export { Main };
