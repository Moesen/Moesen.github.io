const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

const preUrl = "https://www.fleggaard.dk/Services/ProductService.asmx/ProductList?v=1.0&lId=0&so=7&cId=54&langId=1&countryId=11&locId=14917&customerId=0&mId=";
const postUrl = "&p=1&rp=1000&fbclid=IwAR0wARUHFQO_QC_HX2S1ESC_02wZYq_n-WaxNrh73arcm-7iYGlXjrqXAkk";


const upperBound = 99999;
var urls = [];

for(let urlId = 10000; urlId < upperBound; urlId++){
	axios.get(preUrl + urlId + postUrl).then((response) => {
		if(urlId % 100 == 0) console.log("Tjekker urlId: " + urlId);

		if(response.data['data'].items.length > 0){
			urls.push({urlId: urlId})
		}
	});
}
const jsonString = JSON.stringify(urls);
fs.writeFile("FleggaardURLS.json", jsonString, 'utf8', function(err) {
	if(err) console.log(err);
})