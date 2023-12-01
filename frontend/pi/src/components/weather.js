// src/components/weather.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function Weather({ district, x, y }) {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const getWeatherForCoordinate = async () => {
      try {
        const response = await axios.post('http://localhost:4000/get_weather', { x, y });
        if (response.status === 200) {
          const result = response.data;
          if (Array.isArray(result)) {
            setWeather(result);
          } else {
            alert(`Error: ${result}`);
          }
        }
      } catch (error) {
        console.error("날씨 정보를 불러오는 중 에러 발생:", error);
      }
    };

    if (x && y) {
      getWeatherForCoordinate();
    }
  }, [x, y]);

  const formatDate = (dateStr, timeStr) => {
    const year = dateStr.slice(0, 4);
    const month = dateStr.slice(4, 6);
    const day = dateStr.slice(6, 8);

    const hour = timeStr.slice(0, 2);
    const minute = timeStr.slice(2, 4);

    return `${year}-${month}-${day} ${hour}:${minute}`;
  };

  return (
    <div>
      {weather && (
        <div>
          <h1>{district}</h1> {/* 행정구역 이름을 표시 */}
          <p>날짜 및 시간: {formatDate(weather[0], weather[1])}</p>
          <p>날씨: {weather[2]}</p>
          <p>기온: {weather[3]}℃</p>
          <p>습도: {weather[4]}%</p>
        </div>
      )}
    </div>
  );
}

export default Weather;
