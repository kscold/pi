import Adafruit_BMP.BMP085 as BMP085
import Adafruit_SSD1306
import RPi.GPIO as GPIO
import time

from PIL import ImageFont
from PIL import Image, ImageDraw, ImageFont

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

sensor = BMP085.BMP085()


def play_buzzer(note):
    scale = {"도": 261.63, "레": 293.66, "미": 329.63}  # 2옥타브 도  # 2옥타브 레  # 2옥타브 미

    frequency = scale.get(note, 0)  # 주어진 음표에 해당하는 주파수 가져오기
    if frequency > 0:
        p = GPIO.PWM(buzzer_active_pin, frequency)
        p.start(50)  # 50%의 듀티 사이클로 PWM 시작 (소리의 크기 조절)
        time.sleep(1)  # 1초 동안 음을 재생
        p.stop()  # PWM 정지


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
