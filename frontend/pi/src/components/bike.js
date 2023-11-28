// // src/components/Bike.js
// import React, { useEffect, useState } from "react"
// import axios from "axios"

// const { kakao } = window

// const BikeMap = ({ map }) => {
//   const [bikeData, setBikeData] = useState([])

//   useEffect(() => {
//     const fetchBikeData = async () => {
//       const allBikeData = []
//       try {
//         for (let start_idx = 1; start_idx <= 3000; start_idx += 1000) {

//           const response = await axios.get(`http://localhost:4000/get_bike?start_idx=${start_idx}`)
//           if (response.status === 200) {
//             const data = response.data
//             allBikeData.push(...data)
//           }
//         }

//         //       // 지도에 마커 추가
//         //       allBikeData.forEach((bikeInfo) => {
//         //         const markerPosition = new kakao.maps.LatLng(
//         //           bikeInfo.stationLatitude,
//         //           bikeInfo.stationLongitude
//         //         )

//         //         const marker = new kakao.maps.Marker({
//         //           position: markerPosition,
//         //           title: bikeInfo.stationName,
//         //         })

//         //         marker.setMap(map)

//         //         kakao.maps.event.addListener(marker, "click", function () {
//         //           alert(
//         //             `대여소명: ${bikeInfo.stationName}
//         // 자전거 보유 수: ${bikeInfo.parkingBikeTotCnt}`
//         //           )
//         //         })
//         //       })
//         allBikeData.forEach((bikeInfo) => {
//           const markerPosition = new kakao.maps.LatLng(
//             bikeInfo.stationLatitude,
//             bikeInfo.stationLongitude
//           );

//           const marker = new kakao.maps.Marker({
//             position: markerPosition,
//             title: bikeInfo.stationName,
//           });

//           marker.setMap(map);

//           kakao.maps.event.addListener(marker, "click", function () {
//             alert(
//               `대여소명: ${bikeInfo.stationName}
// 자전거 보유 수: ${bikeInfo.parkingBikeTotCnt}`
//             );

//             if (onMarkerClick) {
//               onMarkerClick(markerPosition);
//             }
//           });
//         });

//         setBikeData(allBikeData)
//       } catch (error) {
//         console.error("자전거 정보를 불러오는 중 에러 발생:", error)
//       }
//     }

//     fetchBikeData()
//   }, [map, onMarkerClick]) // map이 변경될 때마다 실행

//   return null
// }

// export default BikeMap

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
//               "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png", // 별 핀 이미지 URL
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


// src/components/Bike.js
// import React, { useEffect, useState } from "react"
// import axios from "axios"
// import bikeData from "./bike.json"

// const { kakao } = window

// const BikeMap = ({ map }) => {
//   const [bikeDataAPI, setBikeDataAPI] = useState([])

//   useEffect(() => {
//     const fetchBikeData = async () => {
//       try {
//         const response = await axios.get("http://localhost:4000/get_bike")
//         if (response.status === 200) {
//           const data = response.data
//           console.log(data)

//           // API가 있는 데이터는 파란 핀으로 표시
//           data.forEach((bikeInfoAPI) => {
//             const markerPositionAPI = new kakao.maps.LatLng(
//               bikeInfoAPI.stationLatitude,
//               bikeInfoAPI.stationLongitude
//             )

//             const markerAPI = new kakao.maps.Marker({
//               position: markerPositionAPI,
//               title: bikeInfoAPI.stationName,
//             })

//             markerAPI.setMap(map)

//             kakao.maps.event.addListener(markerAPI, "click", function () {
//               alert(
//                 `대여소명: ${bikeInfoAPI.stationName}
// 자전거 보유 수: ${bikeInfoAPI.parkingBikeTotCnt}`
//               )
//             })
//           })

//           setBikeDataAPI(data)
//         }
//       } catch (error) {
//         console.error("자전거 정보를 불러오는 중 에러 발생:", error)
//       }
//     }

//     fetchBikeData()
//   }, [map]) // map이 변경될 때마다 실행

//   useEffect(() => {
//     const fetchBikeDataJSON = () => {
//       try {
//         // bike.json 파일 불러오기
//         const dataJSON = bikeData.DATA

//         // API가 없는 데이터는 별 핀으로 표시
//         dataJSON.forEach((bikeInfoJSON) => {
//           if (!bikeDataAPI.find(bikeInfoAPI => bikeInfoAPI.stationName.includes(bikeInfoJSON.statn_addr1))) {
//             const markerPositionJSON = new kakao.maps.LatLng(
//               bikeInfoJSON.statn_lat,
//               bikeInfoJSON.statn_lnt
//             )

//             const markerJSON = new kakao.maps.Marker({
//               position: markerPositionJSON,
//               image: new kakao.maps.MarkerImage(
//                 "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png", // 별 핀 이미지 URL
//                 new kakao.maps.Size(30, 30),
//                 { offset: new kakao.maps.Point(15, 15) }
//               ),
//             })

//             markerJSON.setMap(map)

//             kakao.maps.event.addListener(markerJSON, "click", function () {
//               alert(
//                 `대여소명: ${bikeInfoJSON.statn_addr1}
// 대여소 ID: ${bikeInfoJSON.lendplace_id}`
//               )
//             })
//           }
//         })
//       } catch (error) {
//         console.error("자전거 정보를 불러오는 중 에러 발생:", error)
//       }
//     }

//     fetchBikeDataJSON()
//   }, [map, bikeDataAPI]) // map이나 bikeDataAPI가 변경될 때마다 실행

//   return null
// }

// export default BikeMap


// // src/components/Bike.js
// import React, { useEffect, useState } from "react"
// import axios from "axios"
// import bikeData from "./bike.json"

// const { kakao } = window

// const BikeMap = ({ map }) => {
//   const [bikeDataAPI, setBikeDataAPI] = useState([])

//   useEffect(() => {
//     const fetchBikeData = async () => {
//       try {
//         const response = await axios.get("http://localhost:4000/get_bike")
//         if (response.status === 200) {
//           const data = response.data

//           // API가 있는 데이터는 파란 핀으로 표시
//           data.forEach((bikeInfoAPI) => {
//             const markerPositionAPI = new kakao.maps.LatLng(
//               bikeInfoAPI.stationLatitude,
//               bikeInfoAPI.stationLongitude
//             )

//             const markerAPI = new kakao.maps.Marker({
//               position: markerPositionAPI,
//               title: bikeInfoAPI.stationName,
//             })

//             markerAPI.setMap(map)

//             kakao.maps.event.addListener(markerAPI, "click", function () {
//               alert(
//                 `대여소명: ${bikeInfoAPI.stationName}
// 자전거 보유 수: ${bikeInfoAPI.parkingBikeTotCnt}`
//               )
//             })
//           })

//           setBikeDataAPI(data)

//           // bike.json 파일 불러오기
//           const dataJSON = bikeData.DATA

//           // API가 없는 데이터는 별 핀으로 표시
//           dataJSON.forEach((bikeInfoJSON) => {
//             if (!data.find(bikeInfoAPI =>
//               (Math.abs(bikeInfoAPI.stationLatitude - bikeInfoJSON.statn_lat) < 0.000001) &&
//               (Math.abs(bikeInfoAPI.stationLongitude - bikeInfoJSON.statn_lnt) < 0.000001)
//             )) {
//               const markerPositionJSON = new kakao.maps.LatLng(
//                 bikeInfoJSON.statn_lat,
//                 bikeInfoJSON.statn_lnt
//               )

//               const markerJSON = new kakao.maps.Marker({
//                 position: markerPositionJSON,
//                 image: new kakao.maps.MarkerImage(
//                   "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png", // 별 핀 이미지 URL
//                   new kakao.maps.Size(30, 30),
//                   { offset: new kakao.maps.Point(15, 15) }
//                 ),
//               })

//               markerJSON.setMap(map)

//               kakao.maps.event.addListener(markerJSON, "click", function () {
//                 alert(
//                   `대여소명: ${bikeInfoJSON.statn_addr1}
// 대여소 ID: ${bikeInfoJSON.lendplace_id}`
//                 )
//               })
//             }
//           })
//         }
//       } catch (error) {
//         console.error("자전거 정보를 불러오는 중 에러 발생:", error)
//       }
//     }

//     fetchBikeData()
//   }, [map]) // map이 변경될 때마다 실행

//   return null
// }

// export default BikeMap


// src/components/Bike.js
// import React, { useEffect, useState } from "react"
// import axios from "axios"
// import bikeData from "./bike.json"

// const { kakao } = window

// const BikeMap = ({ map }) => {
//   const [bikeDataAPI, setBikeDataAPI] = useState([])
//   const [temperature, setTemperature] = useState(null)

//   const fetchTemperature = async (nx, ny) => {
//     const response = await axios.get("http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst", {
//       params: {
//         serviceKey: "ZtGq7Au5Kf/NiW3xAO04zSKex1VLDedcbpzt1nXzTkfpQKnN/T1F0a4yttny2a6k6ONyBTMBG8QTBUbMNVi4bQ==",
//         pageNo: 1,
//         numOfRows: 10,
//         dataType: "JSON",
//         base_date: new Date().toISOString().slice(0, 10).replace(/-/g, ""),
//         base_time: "0600",
//         nx: nx,
//         ny: ny
//       }
//     })

//     const temperatureInfo = response.data.response.body.items.item.find(item => item.category === "T1H")
//     if (temperatureInfo) {
//       setTemperature(temperatureInfo.obsrValue)
//     }
//   }

//   useEffect(() => {
//     const fetchBikeData = async () => {
//       try {
//         const response = await axios.get("http://localhost:4000/get_bike")
//         if (response.status === 200) {
//           const data = response.data

//           // API가 있는 데이터는 파란 핀으로 표시
//           data.forEach((bikeInfoAPI) => {
//             const markerPositionAPI = new kakao.maps.LatLng(
//               bikeInfoAPI.stationLatitude,
//               bikeInfoAPI.stationLongitude
//             )

//             const markerAPI = new kakao.maps.Marker({
//               position: markerPositionAPI,
//               title: bikeInfoAPI.stationName,
//             })

//             markerAPI.setMap(map)

//             kakao.maps.event.addListener(markerAPI, "click", async function () {
//               fetchTemperature(Math.round(bikeInfoAPI.stationLatitude), Math.round(bikeInfoAPI.stationLongitude))

//               alert(
//                 `대여소명: ${bikeInfoAPI.stationName}
// 자전거 보유 수: ${bikeInfoAPI.parkingBikeTotCnt}`
//               )
//             })
//           })

//           setBikeDataAPI(data)

//           // bike.json 파일 불러오기
//           const dataJSON = bikeData.DATA

//           // API가 없는 데이터는 별 핀으로 표시
//           dataJSON.forEach((bikeInfoJSON) => {
//             if (!data.find(bikeInfoAPI =>
//               (Math.abs(bikeInfoAPI.stationLatitude - bikeInfoJSON.statn_lat) < 0.000001) &&
//               (Math.abs(bikeInfoAPI.stationLongitude - bikeInfoJSON.statn_lnt) < 0.000001)
//             )) {
//               const markerPositionJSON = new kakao.maps.LatLng(
//                 bikeInfoJSON.statn_lat,
//                 bikeInfoJSON.statn_lnt
//               )

//               const markerJSON = new kakao.maps.Marker({
//                 position: markerPositionJSON,
//                 image: new kakao.maps.MarkerImage(
//                   "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png", // 별 핀 이미지 URL
//                   new kakao.maps.Size(30, 30),
//                   { offset: new kakao.maps.Point(15, 15) }
//                 ),
//               })

//               markerJSON.setMap(map)

//               kakao.maps.event.addListener(markerJSON, "click", async function () {
//                 fetchTemperature(Math.round(bikeInfoJSON.statn_lat), Math.round(bikeInfoJSON.statn_lnt))

//                 alert(
//                   `대여소명: ${bikeInfoJSON.statn_addr1}
// 대여소 ID: ${bikeInfoJSON.lendplace_id}`
//                 )
//               })
//             }
//           })
//         }
//       } catch (error) {
//         console.error("자전거 정보를 불러오는 중 에러 발생:", error)
//       }
//     }

//     fetchBikeData()
//   }, [map]) // map이 변경될 때마다 실행

//   return (
//     <div>
//       {temperature && <div>현재 온도: {temperature}℃</div>}
//     </div>
//   )
// }

// export default BikeMap



// // src/components/Bike.js
// import React, { useEffect, useState } from "react"
// import axios from "axios"

// const { kakao } = window

// const BikeMap = ({ map }) => {
//   const [bikeData, setBikeData] = useState([])

//   useEffect(() => {
//     const fetchBikeData = async () => {
//       const allBikeData = []
//       try {
//         for (let start_idx = 1; start_idx <= 3000; start_idx += 1000) {

//           const response = await axios.get(`http://localhost:4000/get_bike?start_idx=${start_idx}`)
//           if (response.status === 200) {
//             const data = response.data
//             allBikeData.push(...data)
//           }
//         }

//         // 지도에 마커 추가
//         allBikeData.forEach((bikeInfo) => {
//           const markerPosition = new kakao.maps.LatLng(
//             bikeInfo.stationLatitude,
//             bikeInfo.stationLongitude
//           )

//           const marker = new kakao.maps.Marker({
//             position: markerPosition,
//             title: bikeInfo.stationName,
//           })

//           marker.setMap(map)

//           kakao.maps.event.addListener(marker, "click", function () {
//             alert(
//               `대여소명: ${bikeInfo.stationName}
//         자전거 보유 수: ${bikeInfo.parkingBikeTotCnt}`
//             )
//           })
//         })


//         setBikeData(allBikeData)
//       } catch (error) {
//         console.error("자전거 정보를 불러오는 중 에러 발생:", error)
//       }
//     }

//     fetchBikeData()
//   }, [map]) // map이 변경될 때마다 실행

//   return null
// }

// export default BikeMap


// src/components/Bike.js
import React, { useEffect, useState } from "react"
import axios from "axios"
import SeoulMap from "./seoulmap"

const { kakao } = window

const BikeMap = ({ map }) => {
  const [bikeData, setBikeData] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  useEffect(() => {
    const fetchBikeData = async () => {
      const allBikeData = [];
      try {
        for (let start_idx = 1; start_idx <= 3000; start_idx += 1000) {
          const response = await axios.get(`http://localhost:4000/get_bike?start_idx=${start_idx}`);
          if (response.status === 200) {
            const data = response.data;
            allBikeData.push(...data);
          }
        }

        // 지도에 마커 추가
        allBikeData.forEach((bikeInfo) => {
          const markerPosition = new kakao.maps.LatLng(
            bikeInfo.stationLatitude,
            bikeInfo.stationLongitude
          );

          const marker = new kakao.maps.Marker({
            position: markerPosition,
            title: bikeInfo.stationName,
          });

          marker.setMap(map);

          kakao.maps.event.addListener(marker, "click", function () {
            // Set the selected district when a marker is clicked
            setSelectedDistrict(bikeInfo.districtName);

            alert(
              `대여소명: ${bikeInfo.stationName}
        자전거 보유 수: ${bikeInfo.parkingBikeTotCnt}`
            );
          });
        });

        setBikeData(allBikeData);
      } catch (error) {
        console.error("자전거 정보를 불러오는 중 에러 발생:", error);
      }
    };

    fetchBikeData();
  }, [map]);

  return <SeoulMap map={map} selectedDistrict={selectedDistrict} />;
};

export default BikeMap;