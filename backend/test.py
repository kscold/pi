# from flask import Flask, jsonify, request
# from flask_cors import CORS  # CORS 모듈 임포트
# import requests
# import xml.etree.ElementTree as ET

# app = Flask(__name__)
# CORS(app)  # CORS를 애플리케이션에 적용


# def recursive_parse(xml):
#     data = {}
#     for child in xml:
#         if child.tag in [
#             "AREA_NM",
#             "LAT",
#             "LNG",
#             "TEMP",
#             "SENSIBLE_TEMP",
#             "PRECIPITATION",
#         ]:
#             data[child.tag] = child.text
#         data.update(recursive_parse(child))
#     return data


# @app.route("/get", methods=["POST"])
# def get_weather():
#     place = request.json.get("place")
#     url = f"http://openapi.seoul.go.kr:8088/487a5844577363343130326b6a625576/xml/citydata/1/5/{place}"

#     response = requests.get(url, verify=False)

#     if response.status_code == 200:
#         # Parse the XML response
#         root = ET.fromstring(response.text)

#         # Convert the XML data to a dictionary
#         data = recursive_parse(root)

#         return jsonify(data)
#     else:
#         return "Error: Unable to fetch data from the API"


# if __name__ == "__main__":
#     app.run(debug=True, port=4000)

from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import xml.etree.ElementTree as ET

app = Flask(__name__)
CORS(app)

location_data = {
    "강남 MICE 관광특구": {"lat": 37.535001, "lng": 126.9928168},
    "동대문 관광특구": {"lat": 37.5819561, "lng": 127.054846},
    "명동 관광특구": {"lat": 37.55998, "lng": 126.9858296},
    "이태원 관광특구": {"lat": 37.535001, "lng": 126.9928168},
    "잠실 관광특구": {"lat": 37.5049054, "lng": 127.0880716},
    "종로·청계 관광특구": {"lat": 37.535001, "lng": 126.9928168},
    "홍대 관광특구": {"lat": 37.535001, "lng": 126.9928168},
    "경복궁": {"lat": 37.579617, "lng": 126.977041},
    "광화문·덕수궁": {"lat": 37.5658049, "lng": 126.9751461},
}


def recursive_parse(xml):
    data = {}
    for child in xml:
        if child.tag in [
            "AREA_NM",
            "LAT",
            "LNG",
            "TEMP",
            "SENSIBLE_TEMP",
            "PRECIPITATION",
            # "SBIKE_STTS",  # 따릉이 현황
            # "SBIKE_SPOT_NM",  # 따릉이대여소명
            # "SBIKE_SPOT_ID",  # 따릉이대여소ID
            # "SBIKE_SHARED",  # 따릉이거치율
            # "SBIKE_PARKING_CNT"  # 따릉이 주차 건수
            # "SBIKE_RACK_CNT"  # 따릉이거치대 개수
            # "SBIKE_X"  # 따릉이대여소 X 좌표(경도)
            # "SBIKE_Y",
        ]:
            data[child.tag] = child.text
        data.update(recursive_parse(child))
    return data


@app.route("/get", methods=["POST"])
def get_weather():
    place = request.json.get("place")
    url = f"http://openapi.seoul.go.kr:8088/487a5844577363343130326b6a625576/xml/citydata/1/5/{place}"

    response = requests.get(url, verify=False)

    if response.status_code == 200:
        root = ET.fromstring(response.text)
        data = recursive_parse(root)
        # data["AREA_NM"] = place
        data["LAT"] = location_data.get(place, {}).get("lat", None)
        data["LNG"] = location_data.get(place, {}).get("lng", None)
        return jsonify(data)
    else:
        return "Error: Unable to fetch data from the API"


@app.route("/get_bike", methods=["GET"])
def get_bike():
    url = "http://openapi.seoul.go.kr:8088/507a4d55557363343938634d485652/json/bikeList/1/1000/"

    response = requests.get(url, verify=False)

    if response.status_code == 200:
        data = response.json()

        # Extracting relevant information from the API response
        bike_data = []
        for item in data["rentBikeStatus"]["row"]:
            bike_info = {
                "rackTotCnt": item["rackTotCnt"],
                "stationName": item["stationName"],
                "parkingBikeTotCnt": item["parkingBikeTotCnt"],
                "shared": item["shared"],
                "stationLatitude": item["stationLatitude"],
                "stationLongitude": item["stationLongitude"],
                "stationId": item["stationId"],
            }
            bike_data.append(bike_info)

        return jsonify(bike_data)
    else:
        return "Error: Unable to fetch bike data from the API"


if __name__ == "__main__":
    app.run(debug=True, port=4000)
