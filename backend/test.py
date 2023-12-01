from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import datetime
import threading

import Adafruit_BMP.BMP085 as BMP085
import Adafruit_SSD1306
import RPi.GPIO as GPIO
import time

from PIL import ImageFont
from PIL import Image, ImageDraw, ImageFont

# from openai import OpenAI
import openai

app = Flask(__name__)
CORS(app)

sensor = BMP085.BMP085()

# GPIO 핀 설정
red_led_pin = 17  # 빨간색 LED의 GPIO 핀
yellow_led_pin = 18  # 노란색 LED의 GPIO 핀
green_led_pin = 27  # 초록색 LED의 GPIO 핀
buzzer_active_pin = 13  # 부저의 활성 핀

# GPIO 핀 초기화 및 중복 사용 경고 비활성화
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(red_led_pin, GPIO.OUT)
GPIO.setup(yellow_led_pin, GPIO.OUT)
GPIO.setup(green_led_pin, GPIO.OUT)
GPIO.setup(buzzer_active_pin, GPIO.OUT)

# OLED 설정
RST = 24
disp = Adafruit_SSD1306.SSD1306_128_64(rst=RST)
disp.begin()
disp.clear()
disp.display()

# 화면 크기 설정
width = disp.width
height = disp.height
image = Image.new("1", (width, height))
draw = ImageDraw.Draw(image)

font_path = "NanumGothic.ttf"
# 한글 폰트 설정
font = ImageFont.truetype(font_path, 12)  # 폰트 크기는 12로 설정 (조절 가능)


def play_buzzer(note):
    scale = {"도": 261.63, "레": 293.66, "미": 329.63}  # 2옥타브 도  # 2옥타브 레  # 2옥타브 미

    frequency = scale.get(note, 0)  # 주어진 음표에 해당하는 주파수 가져오기
    if frequency > 0:
        p = GPIO.PWM(buzzer_active_pin, frequency)
        p.start(50)  # 50%의 듀티 사이클로 PWM 시작 (소리의 크기 조절)
        time.sleep(1)  # 1초 동안 음을 재생
        p.stop()  # PWM 정지


def main_loop():
    try:
        while True:
            temp = sensor.read_temperature()
            pressure = sensor.read_pressure()
            altitude = sensor.read_altitude()

            # LED 및 부저 제어
            if temp >= 20:
                GPIO.output(green_led_pin, GPIO.HIGH)
                GPIO.output(yellow_led_pin, GPIO.LOW)
                GPIO.output(red_led_pin, GPIO.LOW)
                play_buzzer("도")  # 높은 온도에 해당하는 부저음 재생

                # OLED에 메시지 추가
                draw.rectangle((0, 0, width, height), outline=0, fill=0)  # 이미지 초기화
                draw.text((0, 40), "놀러가기 좋은 날씨네요:)", font=font, fill=255)
            elif 10 <= temp < 20:
                GPIO.output(green_led_pin, GPIO.LOW)
                GPIO.output(yellow_led_pin, GPIO.HIGH)
                GPIO.output(red_led_pin, GPIO.LOW)
                play_buzzer("레")  # 중간 온도에 해당하는 부저음 재생

                # OLED에 메시지 추가
                draw.rectangle((0, 0, width, height), outline=0, fill=0)  # 이미지 초기화
                draw.text((0, 40), "쌀쌀한 날씨", font=font, fill=255)
                draw.text((0, 55), "잘 챙겨입으세요 :|", font=font, fill=255)
            else:
                GPIO.output(green_led_pin, GPIO.LOW)
                GPIO.output(yellow_led_pin, GPIO.LOW)
                GPIO.output(red_led_pin, GPIO.HIGH)
                play_buzzer("미")  # 낮은 온도에 해당하는 부저음 재생

                # OLED에 메시지 추가
                draw.rectangle((0, 0, width, height), outline=0, fill=0)  # 이미지 초기화
                draw.text((0, 40), "야외활동을 자제해주세요X()", font=font, fill=255)

            # OLED에 데이터 표시
            draw.text((0, 0), "온도: {:.2f} C ".format(temp), font=font, fill=255)
            draw.text((0, 15), "압력: {:.2f} Pa ".format(pressure), font=font, fill=255)

            disp.image(image)
            disp.display()

            # 5초 간격으로 측정
            time.sleep(5)

    except KeyboardInterrupt:
        # 프로그램 종료 시 GPIO 정리
        GPIO.cleanup()


# 새로운 스레드에서 메인 루프 실행
threading.Thread(target=main_loop).start()


@app.route("/get_pi", methods=["GET"])
def get_pi_data():
    temp = sensor.read_temperature()
    pressure = sensor.read_pressure()
    altitude = sensor.read_altitude()

    return jsonify({"temperature": temp, "pressure": pressure, "altitude": altitude})


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


@app.route("/ask_gpt", methods=["POST"])
def ask_gpt():
    openai.api_key = "키 입력"
    # Get the user message from the request
    districtName = request.json.get("district")
    bikeData = request.json.get("selectedBikeInfo")
    weatherData = request.json.get("weatherData")
    piData = request.json.get("piData")

    print(districtName)
    print(bikeData)
    print(bikeData["stationName"])
    print(weatherData)
    print(piData)

    # Prepare the conversation format for GPT-3.5-turbo
    conversation = [
        {"role": "system", "content": "너는 서울 특별시 자전거에 대한 정보를 알려주는 따릉이 챗봇, 휠톡이다."},
        {"role": "system", "content": "한국서비스 이므로 한국어로만 대답해야한다."},
        {
            "role": "system",
            "content": f"사용자 질문 형식: 행정구역: {districtName} 날씨: {weatherData[2]} 기온: {weatherData[3]} 습도: {weatherData[4]} 대여소명: {bikeData['stationName']} 대여소의 남은 자전거 수: {bikeData['parkingBikeTotCnt']}, 현재 위치 측정 온도: {piData['temperature']} 로만 들어온다.",
        },
        {
            "role": "assistant",
            "content": f"휠톡이 정보를 알려드려요!, 가시려고 하시는 {districtName}의 대여소, {bikeData['stationName']}는 기온은 {weatherData[3]}도 이며 지금 날씨가 {weatherData[2]}인 상태이고, 현재 위치의 측정 기온{piData['temperature']}로, 이 둘의 기온차가 약 {abs(int(weatherData[3])- piData['temperature'])} 차이가 나네요. 이후 총평을 해야한다.",
        },
        {
            "role": "system",
            "content": "대답 형식대로 대답하고 마지막에 습도와 날씨 기온, 기온차에 따라서 자전거가 타기 좋은 정도를 나쁘다, 적당하다, 좋다로 표현해야한다.",
        },
        {
            "role": "user",
            "content": f"사용자 질문 형식: 행정구역: {districtName} 날씨: {weatherData[2]} 기온: {weatherData[3]} 습도: {weatherData[4]} 대여소명: {bikeData['stationName']} 대여소의 남은 자전거 수: {bikeData['parkingBikeTotCnt']}, 현재 위치 측정 온도: {piData['temperature']}",
        },
    ]

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-1106", messages=conversation
        )

        # Extract the generated answer from the API response
        answer = response["choices"][0]["message"]["content"]

        # Return the answer to the client
        return jsonify({"answer": answer})
    except Exception as e:
        # Handle errors gracefully
        print("Error interacting with GPT:", str(e))
        return jsonify({"answer": "An error occurred while processing your request."})


if __name__ == "__main__":
    app.run(debug=True, port=4000)
