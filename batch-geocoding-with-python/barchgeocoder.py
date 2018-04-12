import os
import pandas as pb
import requests

app = "&app_id={YOUR_APP_ID}&app_code={YOUR_APP_CODE}"
BASE_URL = '''https://batch.geocoder.cit.api.here.com/6.2/jobs?action=run&mailto=YOUR_EMAIL&gen=8&header=false&outdelim=%7C&outcols=displayLatitude,displayLongitude&outputCombined=false'''

HEADERS = {"Content-Type":"application/json"}
url = BASE_URL + app

csv_ = pb.read_csv('basic.csv', delimiter=";")
data_to_geocode = csv_['Region']
data_to_geocode = data_to_geocode.to_string().encode('utf-8')

response = requests.post(url, headers=HEADERS, data=data_to_geocode)
print(data_to_geocode)
