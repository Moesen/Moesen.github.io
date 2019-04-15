//Functions loading on page init

$(document).ready(function() {
	var counter = 0;
	$.ajax({
		url: "ComparedPrices.json",
		dataType: "json",
		success: function(data){
			$(data).each(function(index, items) {
				//buildHeader( items['catagory'][0] );
				$(items['catagory'][1].items).each(function(indexx, item) {
					$("#price_table").append(buildItem(item, counter));
					counter++;
				})
			});
		}
	});
});

function buildItem(item, counter){
	var title, danPrice, borPrice = "";
	title = item['name'];
	danPrice = item['danishPrice'];
	borPrice = item['borderPrice'];

	var buildString = "<div class = 'item' id = item_" + counter + ">";
	buildString += buildItemTitle(title, counter);
	buildString += buildItemDanPrice(danPrice, counter);
	buildString += buildItemBorPrice(borPrice, counter);
	buildString += buildItemField(counter)
	buildString += "</div>";
	return buildString;
}

function buildItemTitle(title, counter){
	return "<h2 class = 'item_title' id = 'title_" + counter + "'>" + title + "</h2>"
}

function buildItemDanPrice(price, counter){
	return "<h3 class = 'item_danish_price' id = 'dan" + counter + "'> "+price+" kr,-</h3>"
}

function buildItemBorPrice(price, counter){
	return "<h3 class = 'item_border_price' id = 'bor_"+counter+"'>"+price+" kr,-</h3>"
}

function buildItemField(counter){
	return "<button class = 'item_button' type='button' onclick = 'addToInput("+counter+")'>-</button>" +
	"<input class = 'item_input' type='number' value='0' id = 'input_"+counter+"'>" +
	"<button class ='item_button' type='button' oncclick = 'subtractFromInput("+counter+")'>+</button>" +
	"<button type='button' onclick = 'addItemToCart("+counter+")'>Add to Cart</button>"
}

//Field

var gasPrice = 11.2;
var kmL = 15;
var locationName = ["gedser", "rodby", "fleggaard_east", "fleggaard_west"];


//Main function

function SearchTable(){
	var input, filter, table, tr, td, th, i, txtValue;
	input = document.getElementById("search_input");
	filter = input.value.toUpperCase().replace(" ", "");
	table = document.getElementById("price_table");
	tr = table.getElementsByTagName("tr");
	for(i = 0; i < tr.length; i++){
		td = tr[i].getElementsByTagName("td")[0];
		if(td) {
			txtValue = td.textContent || td.innerText;
			if(txtValue.toUpperCase().replace(" ", "").indexOf(filter) > -1){
				tr[i].style.display = "";
			} else {
				tr[i].style.display = "none";
			}
		}
	}
}

function CalculateTotal(){
	var counter = 0;
	var danPris = 0.0;
	var bordPris = 0.0;
	var numOfProds = 0;
	$(document).ready(function() {
		$.ajax({
			url: "ComparedPrices.json",
			dataType: "json",
			success: function(data){
				$(data).each(function(index, items) {
					$(items['catagory'][1].items).each(function(indexx, item){
						danPris += calcPrice(item.danishPrice, counter);
						bordPris += calcPrice(item.borderPrice, counter);
						numOfProds += parseInt(document.getElementById("item" + counter).value);
						//console.log(document.getElementById("item" + counter));
						counter++;
						//console.log(item.borderPrice)
					});
				});
				document.getElementById("danish_price").innerText = "Dansk Pris: " + danPris;
				document.getElementById("border_price").innerText = "Border Pris: " + bordPris;
			}
		});
	});
}

function findDist(){
	var postCode = document.getElementById("post_code").value;
	if(postCode.length != 4){
		document.getElementById("dist_info").innerText = "Ikke et dansk postnummer";
		return;
	}
	$.ajax({
		url: "distances.json",
		dataType: "json",
		success: function(data){
			$(data).each(function(index, postCodes){
				var obj = postCodes[postCode];
				if(typeof obj === 'undefined'){
					document.getElementById("dist_table").innerText = "Postnummeret blev ikke fundet";
					return;
				}
				document.getElementById("dist_table").innerHTML = updateDist(obj);
				document.getElementById("travel_price").innerHTML = updateTravelPrice(obj);
			})
		}
	});
}

function updateDist(obj){
	var stringBuild = "";
	stringBuild += "<tr>";
	for(let i = 0; i < 4; i++){
		//console.log(obj['distance'][i]);
		stringBuild += "<td>"
		stringBuild += "Location: " + locationName[i];
		stringBuild += "\nDistance: " + obj['distance'][i];
		stringBuild += "</td>"
	}
	stringBuild += "</tr>";
	return stringBuild;
}

function updateTravelPrice(obj){

	let lowestPrice = 1000000000;
	let lowestIndex = -1;
	for(let i = 0; i < 4; i++){
		if(obj['distance'][i] * gasPrice / kmL < lowestPrice){
			lowestPrice = obj['distance'][i] * gasPrice / kmL;
			lowestIndex = i;
		}
	}

	var stringBuild = "";
	stringBuild += "<h3>Det er billigst at køre til " + locationName[lowestIndex] + "</h3>\n";
	stringBuild += "<h3>Distancen er: " + obj['distance'][lowestIndex] + "km </h3>\n";
	stringBuild += "<h3>Prisen for turen er: " + lowestPrice + "kr,-</h3>\n";
	stringBuild += "<h3 id = 'gas_price' onclick = 'changeGasPrice()'>Benzinprisen er sat til: " + gasPrice + "</h3>";
	stringBuild += "<h3> Bilen er sat til at køre: " + kmL  + " km/L";
	return stringBuild;
}

function seeLocalStorage(){
	console.log(localStorage.getItem("danPris"));
	console.log(localStorage.getItem("bordPris"));
}

function calcPrice(item, counter) {
	let price = parseInt(item);
	let num = parseInt(document.getElementById("item" + counter).value);
	if(isNaN(price)) return 0
	else return price*num;
}

//Small functions

function plusFunction(inputId){
	document.getElementById(inputId).value++;
}

function minusFunction(inputId){
	document.getElementById(inputId).value--;
}
