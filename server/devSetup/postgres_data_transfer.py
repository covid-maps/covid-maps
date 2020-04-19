import requests
import json

URL = "http://localhost:5000/v1/admin-add"

def read(file_name):
	f = open(file_name, "r",encoding="utf8")
	data = f.readlines()
	f.close()
	return data


def build_rq_body(ar):	
	rq =  {
  "Store Name": ar[5].strip(),
  "Store Category":  ar[4].strip() ,
  "Useful Information": ar[7].strip(),
  "Safety Observations": ar[6].strip(),
  "Latitude": ar[2].strip(),
  "Longitude": ar[3].strip(),
  "City": ar[9].strip(),
  "Locality": ar[10].strip()	,
  "Place Id": ar[8].strip(),
  "Address": ar[11].strip(),
  "Opening Time": ar[13].strip(),
  "Closing Time": ar[14].strip(),
  "Country": ar[12].strip(),
  "User IP": ar[0].strip(),
  "Timestamp": ar[1].strip()
	}
	return rq


def post_data(rq):
	try:
		result = requests.post(URL, data = rq).text
		if(json.loads(result)["error"]):
			print(json.dumps(rq))
	
	except:
		pass



data = read("covid.tsv")

rqsts = [build_rq_body(i.split("\t")) for i in data[1:]]

[post_data(r) for r in rqsts]
