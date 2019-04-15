import requests 
import json

import os

abspath = os.path.abspath(__file__)
dname = os.path.dirname(abspath)
os.chdir(dname)


scrape_url = "https://www.pricerunner.dk/public/v1/cl/{0}/dk/desktop?page={1}&retailer=63022&urlName={2}&sort=1"

all_products = list()
categories = {
	"vin": 465,
	"OEl-og-spiritus": 1424,
}
cat_translate = {
	465: 'vin',
	1424: 'ol-spiritus-vand-cider'
}

for cat, cat_id in categories.items():
	for i in range(1, 10000):
		r = requests.get(scrape_url.format(cat_id, i, cat)).json()
		
		prods = r["viewData"]["category"]["products"]
		if prods is None:
			break
		clean_prods = list()
		
		for prod in prods:
			clean_prod = {}
			
			clean_prod["name"] = prod["name"]
			clean_prod["price"] = [[1,prod["localMinPrice"]["value"]] ]
			clean_prod["category"] = cat_translate[cat_id]
						
			clean_prods.append(clean_prod)
		all_products += clean_prods
			
		print(len(all_products))
with open("raw_pricerunner_prices.json", 'w+') as outfile:
	json.dump(all_products, outfile)