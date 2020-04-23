from flask import Flask, jsonify
from flask_cors import CORS
from datetime import date
import bisect
import json
import requests
from collections import defaultdict, OrderedDict


app = Flask(__name__)
CORS(app)
data_dict = defaultdict(list)
bookings_list = []
url = "https://www.thinkful.com/api/advisors/availability"


@app.route('/')
def index():
    return 'Index Page'


@app.route("/today", methods=["GET"])
def today():
    return jsonify({"today": date.today().isoformat()})


@app.route("/bookings", methods=["GET"])
def bookings():
    global data_dict
    resp = requests.get(url)
    raw_data = json.loads(resp.text)
    data_dict = defaultdict(list)
    for _, avail in raw_data.items():
        for date_time, adv_id in avail.items():
            bisect.insort(data_dict[adv_id], date_time)
    ordered_dict = OrderedDict(sorted(data_dict.items()))
    return jsonify(ordered_dict)
