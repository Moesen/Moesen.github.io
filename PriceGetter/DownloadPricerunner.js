const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs'); 

const url1 = "https://www.pricerunner.dk/public/v1/cl/1424/dk/desktop?page=";
const url2 = "&attr_56525176=58381604&retailer=63022&urlName=%C3%98l%20og%20spiritus&sort=1";
var products = [];

for(let i = 0; i < 5; i++){

	//console.log(url1 + i +url2);

	axios.get(url1 + i + url2).then((response) => {

		const $ = cheerio.load(response);

		console.log($)

	})


}