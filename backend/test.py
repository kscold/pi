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
import datetime

app = Flask(__name__)
CORS(app)


@app.route("/get_weather", methods=["POST"])
def get_weather():
    # 받아온 x, y 좌표
    x = request.json.get("x")
    y = request.json.get("y")

    t = datetime.datetime.now()
    t = t - datetime.timedelta(minutes=30)

    base_date = t.strftime("%Y%m%d")
    base_time = t.strftime("%H%M")

    url = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst"
    params = {
        "ServiceKey": "ZtGq7Au5Kf/NiW3xAO04zSKex1VLDedcbpzt1nXzTkfpQKnN/T1F0a4yttny2a6k6ONyBTMBG8QTBUbMNVi4bQ==",
        "numOfRows": "60",
        "base_date": base_date,
        "base_time": base_time,
        "nx": x,
        "ny": y,
        "dataType": "JSON",
    }

    response = requests.get(url, params=params)
    data = response.json()

    if data.get("response").get("header").get("resultCode") == "00":
        items = data.get("response").get("body").get("items").get("item")
        fd = ft = pty = sky = None
        v = [None] * 5

        for item in items:
            if ft is None:
                fd = item.get("fcstDate")
                ft = item.get("fcstTime")
            elif fd != item.get("fcstDate") or ft != item.get("fcstTime"):
                continue

            cat = item.get("category")
            val = item.get("fcstValue")

            if cat == "PTY":
                pty = val
            elif cat == "SKY":
                sky = val
            elif cat == "T1H":
                v[3] = val
            elif cat == "REH":
                v[4] = val

        v[0] = fd
        v[1] = ft

        if pty == "0":
            if sky == "1":
                v[2] = "맑음"
            elif sky == "3":
                v[2] = "구름많음"
            elif sky == "4":
                v[2] = "흐림"
        elif pty == "1":
            v[2] = "비"
        elif pty == "2":
            v[2] = "비/눈"
        elif pty == "3":
            v[2] = "눈"
        elif pty == "5":
            v[2] = "빗방울"
        elif pty == "6":
            v[2] = "빗방울눈날림"
        elif pty == "7":
            v[2] = "눈날림"

        return jsonify(v)

    else:
        return jsonify(
            {
                "error": "API Error: "
                + data.get("response").get("header").get("resultMsg")
            }
        )


@app.route("/get_bike", methods=["GET"])
def get_bike():
    # query parameter에서 start_idx 추출
    start_idx = request.args.get("start_idx", default=1, type=int)
    end_idx = start_idx + 999  # 페이지당 1000개의 데이터를 가져오도록 설정
    print(start_idx)
    print(end_idx)

    # 서울시 따릉이 API의 URL 형식에 맞게 수정
    url = f"http://openapi.seoul.go.kr:8088/507a4d55557363343938634d485652/json/bikeList/{start_idx}/{end_idx}/"
    print(url)

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


# #-*- coding: utf-8 -*-

# import Adafruit_BMP.BMP085 as BMP085
# import Adafruit_SSD1306
# import RPi.GPIO as GPIO
# import time

# from PIL import Image, ImageDraw, ImageFont

# # GPIO 핀 설정
# red_led_pin = 17  # 빨간색 LED의 GPIO 핀
# yellow_led_pin = 18  # 노란색 LED의 GPIO 핀
# green_led_pin = 27  # 초록색 LED의 GPIO 핀

# # GPIO 핀 초기화
# GPIO.setmode(GPIO.BCM)
# GPIO.setup(red_led_pin, GPIO.OUT)
# GPIO.setup(yellow_led_pin, GPIO.OUT)
# GPIO.setup(green_led_pin, GPIO.OUT)

# # OLED 설정
# RST = 24
# disp = Adafruit_SSD1306.SSD1306_128_64(rst=RST)
# disp.begin()
# disp.clear()
# disp.display()

# # 화면 크기 설정
# width = disp.width
# height = disp.height
# image = Image.new("1", (width, height))
# draw = ImageDraw.Draw(image)
# font = ImageFont.load_default()

# sensor = BMP085.BMP085()

# try:
#     while True:
#         temp = sensor.read_temperature()
#         pressure = sensor.read_pressure()
#         altitude = sensor.read_altitude()

#         # LED 제어
#         if temp >= 20:
#             GPIO.output(green_led_pin, GPIO.HIGH)
#             GPIO.output(yellow_led_pin, GPIO.LOW)
#             GPIO.output(red_led_pin, GPIO.LOW)
#         elif 10 <= temp < 20:
#             GPIO.output(green_led_pin, GPIO.LOW)
#             GPIO.output(yellow_led_pin, GPIO.HIGH)
#             GPIO.output(red_led_pin, GPIO.LOW)
#         else:
#             GPIO.output(green_led_pin, GPIO.LOW)
#             GPIO.output(yellow_led_pin, GPIO.LOW)
#             GPIO.output(red_led_pin, GPIO.HIGH)

#         # OLED에 데이터 표시
#         draw.rectangle((0, 0, width, height), outline=0, fill=0)
#         draw.text((0, 0), "Temperature: {:.2f} C".format(temp), font=font, fill=255)
#         draw.text((0, 10), "Pressure: {:.2f} Pa".format(pressure), font=font, fill=255)
#         draw.text((0, 20), "Altitude: {:.2f} m".format(altitude), font=font, fill=255)

#         disp.image(image)
#         disp.display()

#         # 5초 간격으로 측정
#         time.sleep(5)

# except KeyboardInterrupt:
#     # 프로그램 종료 시 GPIO 정리
#     GPIO.cleanup()
