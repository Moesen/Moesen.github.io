const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs'); 

var borderPrices 	= JSON.parse(fs.readFileSync( "/Users/Moesen/Git/compareTaxfree/PriceGetter/AllPricesBordersShop.json" ));
const danishPrices 	= JSON.parse(fs.readFileSync("/Users/Moesen/Git/compareTaxfree/PriceGetter/pricerunner_prices.json"));

var comparedItems = [];

var counter = 0;

for(let i = 0; i < borderPrices.length; i++){


	//console.log(borderPrices[i].idItems)

	var newItem = [];
	var newItemId = borderPrices[i].idItems[0]['id'];
	newItem.push({id: newItemId});

	var newItemList = [];

	let allItems = borderPrices[i].idItems[1]['items']

	var itts = allItems.length

	for(let j = 0; j < itts; j++){
		//console.log(allItems[j]['displayName'])

		var name = allItems[j]['displayName']
		var borderPrice = allItems[j]['price']
		var danishPrice = findDanishPrice( name )



		newItemList.push({name: name, borderPrice: borderPrice, danishPrice: danishPrice});


		counter++;


	}


	newItem.push({items: newItemList});

	comparedItems.push({catagory: newItem});

	//console.log(comparedItems[0].catagory[1])
}

var jsonString = JSON.stringify(comparedItems);
fs.writeFile( "ComparedPrices.json", jsonString, 'utf8', function(err) {
	if(err) console.log(err);
});

	//console.log(comparedItems)

function findDanishPrice(__borderString){
	var indexes = [];
	for(let i = 0; i < danishPrices.length; i++){
		

		if(danishPrices[i].name.includes( __borderString.substring(0, 2) )){
			//console.log(__borderString + " -> resembles " + danishPrices[i].name)
			indexes.push(i);
			
		}

	}

	if(indexes.length > 0){
		if(indexes.length == 1) return danishPrices[indexes[0]].name;
		var values = [];

		for(let i = 0; i < indexes.length; i++){
			values.push(0);
			for(let j = 0; j < __borderString.length; j++){
				if( __borderString[j] == danishPrices[indexes[i]].name[j] ){
					values[i] = values[i]++;
				}
			}
		}

		for(let i = 0; i < indexes.length; i++){

			if( danishPrices[indexes[i]].price.includes("24") ) values[i] += 10;

		}	

		var biggestIndex = 0;
		var biggestNumber = -1;

		for(let i = 0; i < values.length; i++){

			if(values[i] > biggestNumber){
				biggestNumber = values[i];
				biggestIndex = i;
			}

		}

		console.log(danishPrices[biggestIndex].price)
		return danishPrices[biggestIndex].price

	}
	

	return "Produktet blev ej fundet"

}
