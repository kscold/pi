// src/components/Bike.js
import React, { useEffect, useState } from "react"
import axios from "axios"

const { kakao } = window

const BikeMap = ({ map }) => {
  const [bikeData, setBikeData] = useState([])

  useEffect(() => {
    const fetchBikeData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/get_bike")
        if (response.status === 200) {
          const data = response.data

          // 지도에 마커 추가
          data.forEach((bikeInfo) => {
            const markerPosition = new kakao.maps.LatLng(
              bikeInfo.stationLatitude,
              bikeInfo.stationLongitude
            )

            const marker = new kakao.maps.Marker({
              position: markerPosition,
              title: bikeInfo.stationName,
            })

            marker.setMap(map)

            kakao.maps.event.addListener(marker, "click", function () {
              alert(
                `대여소명: ${bikeInfo.stationName}\n자전거 보유 수: ${bikeInfo.parkingBikeTotCnt}`
              )
            })
          })

          setBikeData(data)
        }
      } catch (error) {
        console.error("자전거 정보를 불러오는 중 에러 발생:", error)
      }
    }

    fetchBikeData()
  }, [map]) // map이 변경될 때마다 실행

  return null
}

export default BikeMap

// // src/components/Bike.js
// import React, { useEffect } from "react"
// // import axios from "axios"
// import bikeData from "./bike.json"

// const { kakao } = window

// const BikeMap = ({ map }) => {
//   useEffect(() => {
//     const fetchBikeData = () => {
//       try {
//         // bike.json 파일 불러오기
//         const data = bikeData.DATA

//         // 지도에 빨간 핀으로 대여소 위치 표시
//         data.forEach((bikeInfo) => {
//           const markerPosition = new kakao.maps.LatLng(
//             bikeInfo.statn_lat,
//             bikeInfo.statn_lnt
//           )

//           const marker = new kakao.maps.Marker({
//             position: markerPosition,
//             image: new kakao.maps.MarkerImage(
//               "http://imageurl.com/red_marker.png", // 빨간 핀 이미지 URL
//               new kakao.maps.Size(30, 30),
//               { offset: new kakao.maps.Point(15, 15) }
//             ),
//           })

//           marker.setMap(map)

//           kakao.maps.event.addListener(marker, "click", function () {
//             alert(
//               `대여소명: ${bikeInfo.statn_addr1}\n대여소 ID: ${bikeInfo.lendplace_id}`
//             )
//           })
//         })
//       } catch (error) {
//         console.error("자전거 정보를 불러오는 중 에러 발생:", error)
//       }
//     }

//     fetchBikeData()
//   }, [map]) // map이 변경될 때마다 실행

//   return null
// }

// export default BikeMap
