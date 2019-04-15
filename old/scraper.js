/*

// Henter mine pakker ned
//cheerio er til at sortere i data
//puppeteer er til at hente html kode, der er blevet parced
//fs er jeg ikke helt sikker på hvad gør
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs');

// Henter først html koden ned med puppetter
let scrape = async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto('https://www.bordershop.com/dk/ol-cider/dansk-ol');

    const result = await page.evaluate(() => {
        let data = []; // Create an empty array that will store our data
        let elements = document.querySelectorAll('.product-tile'); // Select all Products


        //Et loop der laver en sorterer filen. Det ønsker vi, at gøre med
        cheerio, så vi lader den lige være i lidt tid *//*
        for (var element of elements){ // Loop through each proudct
            let title   = element.childNodes[5].innerText; // Select the title
            let price   = element.childNodes[7].children[1].innerText;
            let picture = element.

            data.push({title, price}); // Push an object with the data onto our array
        }
        data = elements;
        return data; // Return our data array
    });

    browser.close();
    return result;

  //  return result;
};

scrape().then((value) => {
    console.log(value); // Success!

    fs.writeFile('virkerdet.txt', JSON.stringify(value, undefined, 2), function (err) {
      if (err) return console.log(err);
      console.log('Det virkede!');
    });

});
*/

// Used to enter a page and download the content
const puppeteer = require('puppeteer');
// Used to write a file
const fs        = require('fs');
//Defining url
const urls = 'https://www.bordershop.com/dk/ol-cider/dansk-ol';

let scrape = async() => {
  //Opening the browser and a new page
  const browser = await puppeteer.launch({headless: false});
  const page    = await browser.newPage();

  //Entering the website
  await page.goto(urls);
};

scrape();
