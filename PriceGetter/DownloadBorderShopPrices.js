const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs'); 

const urlFilename = "/Users/Moesen/Git/compareTaxfree/PriceGetter/BorderURLS.json"


var obj = JSON.parse(fs.readFileSync(urlFilename, 'utf8'))


var urlData = [];
const itterations = obj.length

let counter = 0;


for(let i = 0; i < itterations; i++){

	
	axios.get(obj[i]).then((response) => {

		const id = obj[i].replace('https://www.bordershop.com/dk/bordershop/api/recommendationapi/gettopsellingincategory?categoryId=', '').replace('&count=1000', '');
		var idItems = [];
		idItems.push({id: id})

		var items = [];

		var products = response.data.products;

		console.log("Getting \"" + products[0].displayName + "\" type of product");

		for(let j = 0; j < products.length; j++){
			let DisplayName = products[j].displayName;
			let Price = products[j].price['amount'];

			items.push({displayName: DisplayName, price: Price})
			counter++;
		}

		idItems.push({items: items})
		urlData.push({idItems})
			console.log("Downloaded " + counter + " items");
	})
}
var jsonString = JSON.stringify(urlData);
		fs.writeFile('AllPricesBordersShop.json', jsonString, 'utf8', function(err) {
			if(err) console.log(err);
		})