// import React, { useState } from "react";

// export async function getWeather(x, y) {
//   try {
//     const t = new Date();
//     t.setMinutes(t.getMinutes() - 30);

//     const url =
//       "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst" +
//       "?ServiceKey=ZtGq7Au5Kf/NiW3xAO04zSKex1VLDedcbpzt1nXzTkfpQKnN/T1F0a4yttny2a6k6ONyBTMBG8QTBUbMNVi4bQ==" +
//       "&numOfRows=60" +
//       "&base_date=" +
//       t.toISOString().slice(0, 10).replace(/-/g, "") +
//       "&base_time=" +
//       t.toISOString().slice(11, 16).replace(/:/g, "") +
//       "&nx=" +
//       x +
//       "&ny=" +
//       y +
//       "&dataType=JSON";

//     const response = await fetch(url);
//     const data = await response.json();

//     // Add logging
//     console.log("API Response:", data);

//     if (data?.response?.header?.resultCode === "00") {
//       const items = data.response.body.items.item;

//       let fd = null,
//         ft = null;
//       let pty = null,
//         sky = null;
//       let cat, val;
//       const v = Array(5).fill(null);

//       items.forEach((item) => {
//         if (ft === null) {
//           fd = item.fcstDate;
//           ft = item.fcstTime;
//         } else if (fd !== item.fcstDate || ft !== item.fcstTime) {
//           return;
//         }

//         cat = item.category;
//         val = item.fcstValue;

//         if (cat === "PTY") pty = val;
//         else if (cat === "SKY") sky = val;
//         else if (cat === "T1H") v[3] = val;
//         else if (cat === "REH") v[4] = val;
//       });

//       v[0] = fd;
//       v[1] = ft;

//       if (pty === "0") {
//         if (sky === "1") v[2] = "맑음";
//         else if (sky === "3") v[2] = "구름많음";
//         else if (sky === "4") v[2] = "흐림";
//       } else if (pty === "1") v[2] = "비";
//       else if (pty === "2") v[2] = "비/눈";
//       else if (pty === "3") v[2] = "눈";
//       else if (pty === "5") v[2] = "빗방울";
//       else if (pty === "6") v[2] = "빗방울눈날림";
//       else if (pty === "7") v[2] = "눈날림";

//       return v;
//     } else {
//       console.error("API Error:", data.response.header.resultMsg);
//       return data.response.header.resultMsg;
//     }
//   } catch (error) {
//     console.error("Error fetching weather data:", error);
//     return error.message;
//   }
// }

// import React, { useState } from "react";

// function Weather() {
//   const [weather, setWeather] = useState(null);

//   const getWeatherForCoordinate = async (x, y) => {
//     const result = await getWeather(x, y);

//     if (Array.isArray(result)) {
//       setWeather(result);
//     } else {
//       alert(`Error: ${result}`);
//     }
//   };

//   return (
//     <div>
//       <div id="coordinateButtons">
//         <button onClick={() => getWeatherForCoordinate(58, 34)}>
//           종로구
//         </button>
//         <button onClick={() => getWeatherForCoordinate(59, 33)}>
//           중구
//         </button>
//       </div>

//       {weather && (
//         <div>
//           <p>날짜: {weather[0]}</p>
//           <p>시간: {weather[1]}</p>
//           <p>날씨: {weather[2]}</p>
//           <p>기온: {weather[3]}℃</p>
//           <p>습도: {weather[4]}%</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Weather;


// import React, { useEffect, useState } from "react";
// import axios from "axios";

// function Weather({ x, y }) {
//   const [weather, setWeather] = useState(null);

//   useEffect(() => {
//     const getWeatherForCoordinate = async () => {
//       try {
//         const response = await axios.post('http://localhost:4000/get_weather', { x, y });
//         if (response.status === 200) {
//           const result = response.data;
//           if (Array.isArray(result)) {
//             setWeather(result);
//           } else {
//             alert(`Error: ${result}`);
//           }
//         }
//       } catch (error) {
//         console.error("날씨 정보를 불러오는 중 에러 발생:", error);
//       }
//     };

//     if (x && y) {
//       getWeatherForCoordinate();
//     }
//   }, [x, y]);

//   return (
//     <div>
//       <div id="coordinateButtons">
//         <button onClick={() => getWeatherForCoordinate(58, 34)}>
//           종로구
//         </button>
//         <button onClick={() => getWeatherForCoordinate(59, 33)}>
//           중구
//         </button>
//       </div>

//       {weather && (
//         <div>
//           <p>날짜: {weather[0]}</p>
//           <p>시간: {weather[1]}</p>
//           <p>날씨: {weather[2]}</p>
//           <p>기온: {weather[3]}℃</p>
//           <p>습도: {weather[4]}%</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Weather;


// Weather.js
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
