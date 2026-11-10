import Vue from '../../lib/vue.js';

import { ProductsService } from '../services/productsService.js';
import { ToolsService } from '../services/toolsService.js';

let AppHeader = Vue.component('app-header', {
  	template: '<div class="header">'+
        '<div class="menu">'+
          '<div class="menu-item">E-Shop <span class="title-327" :style="{backgroundColor: logoColor}">327</span></div>'+
        '</div>'+
        '<div class="categories"><div class="categories__title" @click="showCategories()" :style="{backgroundColor: catBColor, color: catColor}">Categories</div></div>'+
       
        '<div class="cart"><div class="cart__title" @click="showCart()" :style="{backgroundColor: cartBColor, color: cartColor}">Cart</div></div>'+
      '</div>',
    data: function () {
        return {
          shownCart: false,
          shownCategories: false,
          length: 0,
          logoColor: "",
          cartBColor: "",
          cartColor: "",
          catBColor: "",
          catColor: ""
        }
    },
  	created: function() {
      var self = this;
      
      self.logoColor = ToolsService.getFromWarmColors();
      self.cartBColor = "transparent";
      self.cartColor = "black";
      self.catBColor = "transparent";
      self.catColor = "black";
      
      this.$root.$on("hideCart",  function(){
          self.shownCart = false;
      });

      this.$root.$on("showCart",  function(){
          self.shownCart = true;
          this.$root.$emit("hideFilter"); 
          this.$root.$emit("hideCategories");          
      });

      
      this.$root.$on("hideCategories",  function(){
          self.shownCategories = false;
      });

      this.$root.$on("showCategories",  function(){
          self.shownCategories = true;
          
          self.$root.$emit("hideCart"); 
          self.$root.$emit("hideFilter");    
      });

      this.$root.$on("recount", function(){
        self.length = ProductsService.getCurrentProducts().length;

        if (self.length > 0) {
          self.cartBColor = ToolsService.getFromWarmColors();
          self.cartColor = "white";
        } else {
          self.cartBColor = "transparent";
          self.cartColor = "black";
        }
      });
    },
    methods: {
      showCategories: function(){
         if(!this.shownCategories) {
           this.$root.$emit("showCategories");
         } else {
           this.$root.$emit("hideCategories");        
         }
      },
      showCart: function(){
        if (this.length > 0) {
            if(!this.shownCart) {
              this.$root.$emit("showCart");
            } else {
              this.$root.$emit("hideCart");        
            }
        }
      }
    }
})

export { AppHeader };
