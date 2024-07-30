import requests
import sys
import os
import time
import boto3

#Define our global variables
#This argument is defined when we run our script. This tells us which MTG set/expansion we are looking up
card_set = sys.argv[1]

#The name of the s3 bucket we are requesting
BUCKET = "YOUR_BUCKET_NAME"

#Initialize an empty array to store the images for us to lookup
card_list = []

#TCGplayer.com variables
headers = {'Accept': 'application/json','Authorization':'bearer YOUR_API_CREDENTIALS'}
product_url = "http://api.tcgplayer.com/catalog/products"
group_id_url = "http://api.tcgplayer.com/catalog/categories/1/groups" #Magic the Gathering Category ID is 1

#Open a file for us to write the jpeg file name, detected text from Rekognition, and the market price from TCG
oFile=open('mtg_prices.txt','a')

def get_group_id(card_set):
	for k in range(0,2):
		off = 100 * k
		querystring = {"offset": off,"limit":"100"}
		response = requests.request("GET", group_id_url, headers=headers, params=querystring)
		data = response.json()
		for i in data['results']:
			#productId=i['name']
			#productName=i['abbreviation']
			if card_set == str(i['abbreviation']).lower():
			#print "{0},{1},{2}".format(groupId,productId,productName)
				groupId = i['groupId']
				break		
	return groupId
	

#Create a function that will take the 3 letter card abbreviation and look for the folder in our current directory. Then store the file name into the card_list array
def get_cards(card_set):
	for i in os.listdir("/YOUR/FILE/PATH/WITH/PICTURES/"+card_set):
		card_list.append(i)
	return card_list

#Create a function that will lookup the jpeg filename in s3 to be processed by Rekognition
def detect_labels(bucket, key, region="us-east-1"):
	rekognition = boto3.client("rekognition", region)
	response = rekognition.detect_text(
		Image={
			"S3Object": {
				"Bucket": bucket,
				"Name": key,
			}
		},
		
	)
	return response['TextDetections']

#Lookup the price our card as detected by Rekognition
def tcg_lookup(card_picture, card_name, card_set, groupId):
	querystring = {"categoryId":"1","productName":card_name,"limit":"10"}
	response = requests.get(product_url, headers=headers, params=querystring)
	data = response.json()
	if data['success']!=True:
		print "Sorry I don't know that one. Writing to file..." #If the text doesn't match a card, we'll write it to file anyways so we can submit it later
		oFile.write("{0},{1},{2}\n".format(card_picture, card_set, card_name))
	else:
		for j in data['results']:
			 if str(j['groupId']) == str(groupId):
				productId = j['productId']
				price_url = "http://api.tcgplayer.com/pricing/product/{0}".format(productId)
				response = requests.get(price_url,headers=headers)
				data = response.json()
				print "The market price of {0} is {1}".format(card_name,data['results'][0]['marketPrice'])
				oFile.write("{0},{1},{2}\n".format(card_picture,card_set,card_name,productId,data['results'][0]['marketPrice']))
	

get_cards(card_set)
print "Added {0} pictures to lookup...".format(str(len(card_list)))
groupId = get_group_id(card_set)
print "GroupId for {0} is {1}".format(card_set,groupId)

for i in card_list:
	KEY="{0}/{1}".format(card_set,i)
	rek_response = detect_labels(BUCKET,KEY)
	ftext = str(rek_response[0]['DetectedText'])
	print "Detected text: {0}. Looking up card".format(ftext)
	tcg_lookup(i,ftext,card_set,groupId)
	time.sleep(1)