from bs4 import BeautifulSoup
from selenium import webdriver
import json



def getHtml(pageLinks):
    # Åbner browseren vha. selenium
    browser = webdriver.Chrome()

    #liste med html'er
    soupList = []

    # Går ind på alle siderne
    for url in pageLinks:
        browser.get(url)
         #Åbner siden i bs4, der læser html'en
        soup = BeautifulSoup(browser.page_source, 'lxml')
        soupList.append(soup)

    #Lukker browservinduet
    browser.close()

    return soupList


def removeHtmlTagsFromString(string):

    if string == None:
        return None
    #Gør den til string
    string = str(string)
    # Finder åbnende Html-tags slutning og gemmer dens index
    for x in range(len(string)):
        if string[x] == ">":
            startIdx = x
            break

    #Finder lukkende Html-tags begyndelse og gemmer dens index
    for x in range(startIdx, len(string)):
        if string[x] =="<":
            endIdx = x
            break
    #Cutter strengen det rigtige sted
    cleanedString = string[startIdx + 1:endIdx]
    #Kontrollerer, at den har indhold

    return cleanedString

def findDiscount(product):

    #Finder mængdeprisen og fjerner html
    discountPriceTag = product.find("span", class_="__price ng-binding")
    discountPrice = removeHtmlTagsFromString(discountPriceTag)

    #Finder tekststykket med den enkelte pris i og fjerner html
    productPriceTextTag = product.find("span", class_="block ng-binding")
    productPriceText = removeHtmlTagsFromString(productPriceTextTag)

    #Fjerner alt teksten og bibeholder prisen
    for x in range(len(productPriceText)):
        if productPriceText[x] == ":":
            startIdx = x
            break

    for x in range(startIdx, len(productPriceText)):
        if productPriceText[x] ==",":
            endIdx = x
            break

    #Cutter stringen for den unødvendige tekst
    productPrice = productPriceText[startIdx+2:endIdx]

    return productPrice, discountPrice

def parseHtml(soup):
    #Skærer alt andet end produktruderne væk ved at søge på deres klasse
    productList = soup.find_all("product-tile", class_="ng-scope ng-isolate-scope")

    #Fjerner duplikanter
    productList = list(set(productList))

    #Tomme lister til de færdige produkt-strings
    normalProducts, discountProducts = [], []

    #Loop, der skal undersøge hver produktrude og udtrække pris, navn og detaljer om discount
    for product in productList:
        #Udtrækker navnet og fjerner Html-kode
        prodNameTag = product.find("h2", class_="product-tile__title ng-binding")
        prodName = removeHtmlTagsFromString(prodNameTag)
        #Undersøger, om der er kode, der afslører, at det er et produkt på tilbud
        discountAmountTag = product.find("span", class_="__deal ng-binding ng-scope")
        #Hvis ikke, der er nogen tal i tilbudsmængden, skal den sættes til None, da tilbuddet så ikke er et mængdetilbud
        if not any(char.isdigit() for char in str(discountAmountTag)): discountAmountTag = None
        if discountAmountTag == None:

            #Hvis det ikke er på tilbud findes standardprisen nemt og udtrækkes og rengøres for html
            prodPriceTag = product.find("span", class_= "__price ng-binding")
            prodPrice = removeHtmlTagsFromString(prodPriceTag)
            #Navn og pris tilføjes listen
            normalProducts.append([prodName,prodPrice])



        else:
            #Gælder produkter, der ER på tilbud
            #Tryller alt andet end tal væk fra tagget med mængden af tilbd
            discountAmount = ''.join(filter(lambda x: x.isdigit(),removeHtmlTagsFromString(discountAmountTag)))

            #Produktets pris og den samlede pris for mængdetilbuddet findes og udtrækkes
            prodPrice, discountPrice  = findDiscount(product)

            #navn, standardpris, tilbudsmængde og mængdepris tilføjes listen
            discountProducts.append([prodName, prodPrice, discountAmount, discountPrice])
    return normalProducts, discountProducts


def jsonify(normalProducts, discountProducts):

    productsList = []
    for product in normalProducts:
        productInfoDict = {}
        productInfoDict["title"]=product[0]
        productInfoDict["price"]=product[1]
        productsList.append(productInfoDict)
    for product in discountProducts:
        productInfoDict = {}
        productInfoDict["title"]=product[0]
        productInfoDict["price"]=product[1]
        productInfoDict["discountAmount"]=product[2]
        productInfoDict["discountPrice"]=product[3]

        productsList.append(productInfoDict)

    return productsList

def getPrices(boozeList, linkList):
    #Hoved-JSON-dicten, der skal fyldes med data
    mainDict = {}

    # Browseren åbnes og fra browseren trækkes html'en og derefter priserne ud
    souplist = getHtml(linkList)

    for idx in range(len(boozeList)):
        normalProducts, discountProducts = parseHtml(souplist[idx])
        #Produkternes information skrives til JSON
        print(normalProducts, discountProducts)
        productsList = jsonify(normalProducts, discountProducts)
        mainDict[boozeList[idx]] = productsList

    with open('data.txt', 'w') as f:
        json.dump(mainDict, f, ensure_ascii=False, indent=4, sort_keys=True)

    pass

boozeList = ["beer", "gin", "wine", "whiskey"]
linkList = ["https://www.bordershop.com/dk/ol-cider/dansk-ol", "https://www.bordershop.com/dk/spiritus/gin","https://www.bordershop.com/dk/vin/rodvin","https://www.bordershop.com/dk/spiritus/whisky"]
getPrices(boozeList, linkList)

