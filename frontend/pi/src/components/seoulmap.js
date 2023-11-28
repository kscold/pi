// // src/components/SeoulMap.js
// import React, { useEffect } from "react"
// import geojson from "./geo.json"

// const { kakao } = window

// const SeoulMap = ({ map }) => {
//   useEffect(() => {
//     const fetchSeoulDistricts = () => {
//       try {
//         const seoulDistricts = geojson.features

//         seoulDistricts.forEach((feature) => {
//           const coordinates = feature.geometry.coordinates[0].map(
//             (coord) => new kakao.maps.LatLng(coord[1], coord[0])
//           )

//           const polygon = new kakao.maps.Polygon({
//             path: coordinates,
//             strokeWeight: 2,
//             strokeColor: "#004c80",
//             strokeOpacity: 0.8,
//             fillColor: "#fff",
//             fillOpacity: 0.7,
//           })

//           polygon.setMap(map)
//         })
//       } catch (error) {
//         console.error("서울시 행정구역 데이터를 불러오는 중 에러 발생:", error)
//       }
//     }

//     fetchSeoulDistricts()
//   }, [map]) // map이 변경될 때마다 실행

//   return null
// }

// export default SeoulMap


// // src/components/SeoulMap.js
// import React, { useEffect, useState } from "react";
// import geojson from "./geo.json";
// import Weather from "./weather";
// import { getWeather } from "./weather";


// const { kakao } = window;

// const SeoulMap = ({ map }) => {
//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [selectedPolygon, setSelectedPolygon] = useState(null);

//   useEffect(() => {
//     const fetchSeoulDistricts = () => {
//       try {
//         const seoulDistricts = geojson.features;

//         seoulDistricts.forEach((feature) => {
//           const coordinates = feature.geometry.coordinates[0].map(
//             (coord) => new kakao.maps.LatLng(coord[1], coord[0])
//           );

//           const polygon = new kakao.maps.Polygon({
//             path: coordinates,
//             strokeWeight: 2,
//             strokeColor: "#004c80",
//             strokeOpacity: 0.8,
//             fillColor: "#fff",
//             fillOpacity: 0.1,
//           });

//           kakao.maps.event.addListener(polygon, "click", () => {
//             if (selectedPolygon) {
//               selectedPolygon.setOptions({ fillColor: "#fff" });
//             }

//             const districtName = feature.properties.name;
//             setSelectedDistrict(districtName);
//             polygon.setOptions({ fillColor: "#ff0000" });
//             setSelectedPolygon(polygon);

//             // Pass the callback to Weather component
//             setWeatherCallback(() => getWeatherForDistrict(coordinates));
//           });

//           polygon.setMap(map);
//         });
//       } catch (error) {
//         console.error("서울시 행정구역 데이터를 불러오는 중 에러 발생:", error);
//       }
//     };

//     fetchSeoulDistricts();
//   }, [map, selectedPolygon]);

//   const [weatherCallback, setWeatherCallback] = useState(null);

//   const getWeatherForDistrict = async (coordinates) => {
//     const centroid = coordinates.reduce(
//       (acc, coord) => {
//         acc[0] += coord[0];
//         acc[1] += coord[1];
//         return acc;
//       },
//       [0, 0]
//     );

//     const centroidX = centroid[0] / coordinates.length;
//     const centroidY = centroid[1] / coordinates.length;
//     const result = await getWeather(centroidX, centroidY);

//     if (Array.isArray(result)) {
//       alert(`Weather in ${selectedDistrict} - ${result[2]}, ${result[3]}℃, ${result[4]}% humidity`);
//     } else {
//       alert(`Error: ${result}`);
//     }
//   };

//   return (
//     <div>
//       {selectedDistrict && (
//         <Weather
//         district={selectedDistrict}
//         x={centroidX}
//         y={centroidY}
//       />
//       )}
//     </div>
//   );
// };

// export default SeoulMap;

// src/components/SeoulMap.js
// import React, { useEffect, useState } from "react";
// import geojson from "./geo.json";
// import Weather from "./weather";

// const { kakao } = window;

// const SeoulMap = ({ map }) => {
//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [selectedPolygon, setSelectedPolygon] = useState(null);
//   const [centroidX, setCentroidX] = useState(null);
//   const [centroidY, setCentroidY] = useState(null);

//   useEffect(() => {
//     const fetchSeoulDistricts = () => {
//       try {
//         const seoulDistricts = geojson.features;

//         seoulDistricts.forEach((feature) => {
//           const coordinates = feature.geometry.coordinates[0].map(
//             (coord) => new kakao.maps.LatLng(coord[1], coord[0])
//           );

//           const polygon = new kakao.maps.Polygon({
//             path: coordinates,
//             strokeWeight: 2,
//             strokeColor: "#004c80",
//             strokeOpacity: 0.8,
//             fillColor: "#fff",
//             fillOpacity: 0.1,
//           });

//           kakao.maps.event.addListener(polygon, "click", () => {
//             if (selectedPolygon) {
//               selectedPolygon.setOptions({ fillColor: "#fff" });
//             }

//             const districtName = feature.properties.name;
//             setSelectedDistrict(districtName);
//             polygon.setOptions({ fillColor: "#ff0000" });
//             setSelectedPolygon(polygon);

//             const centroid = coordinates.reduce(
//               (acc, coord) => {
//                 acc[0] += coord[0];
//                 acc[1] += coord[1];
//                 return acc;
//               },
//               [0, 0]
//             );

//             setCentroidX(centroid[0] / coordinates.length);
//             setCentroidY(centroid[1] / coordinates.length);
//           });

//           polygon.setMap(map);
//         });
//       } catch (error) {
//         console.error("서울시 행정구역 데이터를 불러오는 중 에러 발생:", error);
//       }
//     };

//     fetchSeoulDistricts();
//   }, [map, selectedPolygon]);

//   return (
//     <div>
//       {selectedDistrict && centroidX && centroidY(
//         <Weather
//           district={selectedDistrict}
//           x={centroidX}
//           y={centroidY}
//         />
//       )}
//     </div>
//   );
// };

// export default SeoulMap;

// src/components/SeoulMap.js
import React, { useEffect, useState } from "react";
import geojson from "./geo.json";
import Weather from "./weather";

const { kakao } = window;

const SeoulMap = ({ map }) => {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [centroidX, setCentroidX] = useState(null);
  const [centroidY, setCentroidY] = useState(null);

  useEffect(() => {
    const fetchSeoulDistricts = () => {
      try {
        const seoulDistricts = geojson.features;

        seoulDistricts.forEach((feature) => {
          const coordinates = feature.geometry.coordinates[0].map(
            (coord) => new kakao.maps.LatLng(coord[1], coord[0])
          );

          const polygon = new kakao.maps.Polygon({
            path: coordinates,
            strokeWeight: 2,
            strokeColor: "#004c80",
            strokeOpacity: 0.8,
            fillColor: "#fff",
            fillOpacity: 0.3,
          });

          kakao.maps.event.addListener(polygon, "click", () => {
            if (selectedPolygon) {
              selectedPolygon.setOptions({
                fillColor: "#fff",
                fillOpacity: -1,
              });
            }

            const districtName = feature.properties.name;
            setSelectedDistrict(districtName);
            polygon.setOptions({ fillColor: "#ff0000" });
            setSelectedPolygon(polygon);

            // Get centroidX and centroidY from geojson properties
            const centroidX = feature.properties.centroidX;
            const centroidY = feature.properties.centroidY;

            setCentroidX(centroidX);
            setCentroidY(centroidY);
          });

          polygon.setMap(map);
        });
      } catch (error) {
        console.error("서울시 행정구역 데이터를 불러오는 중 에러 발생:", error);
      }
    };

    fetchSeoulDistricts();

  }, [map, selectedPolygon]);

  return (
    <div>
      {selectedDistrict && centroidX && centroidY && (
        <Weather
          district={selectedDistrict}
          x={centroidX}
          y={centroidY}
        />
      )}
    </div>
  );
};

export default SeoulMap;


