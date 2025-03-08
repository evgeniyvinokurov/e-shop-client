let ToolsService = {
	doByClassName: function(className, cb) {
		let elems = document.getElementsByClassName(className);

    	for (let i = 0; i < elems.length; i++) {
    		let elemItem = elems[i];
    		cb(elemItem);
    	}

    	return  elems;
	},
	getRandomNumber: function() {
		return Math.floor((Math.random() * 9999999) + 1111111);
	},
	getRandomFloat: function(min, max, decimals) {
  		let str = (Math.random() * (max - min) + min).toFixed(decimals);
  		return parseFloat(str);
	},
	getRandomColor: function() {
		var letters = '0123456789';
	    var number = 'rgba(';
	    for (var i = 0; i < 3; i++ ) {
	        number += Math.floor(Math.random() * 255) + ",";
	    }
	    number += "0.7)"
	    return number;
	},
	getRandomArrayValue: function(array){
		var choose = [];
	
	   for (var key in array) {
	    	choose.push(key);
		}
	
		var arrayLength = choose.length;	
		return array[choose[Math.floor(Math.random() * arrayLength)]];
	},
	getRandom: function(min, max) {
		var x = Math.ceil(Math.random() * (max - min) + min);	
		if (max == x) {
			x--;
		}
		return x;
	},
	getFromWarmColors: function(){		
		return this.getRandomColor();
	}
};

export { ToolsService };
