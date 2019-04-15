import requests, json
import csv
import os

abspath = os.path.abspath(__file__)
dname = os.path.dirname(abspath)
os.chdir(dname)

gedser = '54.574699,11.92531' 
rodby = '54.660727,11.362782'
fleggaard_west = '54.887001,8.849254'
fleggaard_east = '54.830685,9.414208'

key = '7U3pbNM6W5GhxffR1wiRBvdenMFwZZub'
api_str = 'http://www.mapquestapi.com/directions/v2/routematrix?key={0}'.format(key)

postals = list()

with open('postnumre.csv', 'r') as csvfile:
	postalreader = csv.reader(csvfile, delimiter=',', quotechar='\"')
	for row in postalreader:
		print(row)
		if row[3] or not row[5] or int(row[5]) > 1:
			pass
		else:
			postals.append(row[0])
distances = {}
for postal in postals:
	place = postal + ",Denmark"

	body = {
	"locations":[
		place,
		gedser,
		rodby,
		fleggaard_east, 
		fleggaard_west
	],
	"options":
	{
		"manyToOne": 'true',
		"unit": 'k'
	}
	}


	try:
		r = requests.post(api_str, data=json.dumps(body))
		clean_infos = {}
		answer = r.json()

		clean_infos["query_postal"] = postal
		clean_infos["distance"] = answer["distance"][1:]
		clean_infos["answer_postal"] = answer["locations"][0]["postalCode"]
		
		if clean_infos["query_postal"] != clean_infos["answer_postal"]:
			print("wrong postal:", clean_infos["query_postal"] , clean_infos["answer_postal"])
		else:
			distances[postal] = clean_infos
	except:
		print("failed request", postal)
		pass
	
with open("distances.json", 'w+') as outfile:
	json.dump(distances, outfile)
