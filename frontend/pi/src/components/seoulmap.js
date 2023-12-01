// src/components/seoulmap.js
import React, { useEffect, useState } from "react";
import geojson from "./geo.json";
import Weather from "./weather";

const { kakao } = window;

const SeoulMap = ({ map, selectedBikeInfo }) => {
  // 선택된 행정구역과 중심 좌표 상태 정의
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [centroidX, setCentroidX] = useState(null);
  const [centroidY, setCentroidY] = useState(null);
  const [seoulDistricts, setSeoulDistricts] = useState([]);


  // 다각형 스타일 초기값 설정
  const initPolygonOptions = {
    fillColor: "#fff",
    fillOpacity: 0.01,
  };

  // 다각형 스타일을 초기화하는 함수
  const resetPolygonStyle = () => {
    console.log("Resetting polygon style");
    seoulDistricts.forEach(district => {
      if (district.poly) {
        district.poly.setOptions({
          fillColor: initPolygonOptions.fillColor,
          fillOpacity: initPolygonOptions.fillOpacity
        });
      }
    });
  };
  // };


  // 다각형 클릭 이벤트 핸들러
  const handlePolygonClick = (district) => {
    // 선택된 행정구역이 있으면 스타일을 초기화
    console.log("Handling polygon click", district);

    if (selectedDistrict) {
      resetPolygonStyle(selectedDistrict);
    }

    // 클릭된 행정구역과 중심 좌표를 상태로 설정
    setSelectedDistrict(district.properties.name);
    setCentroidX(district.properties.centroidX);
    setCentroidY(district.properties.centroidY);

    // 클릭된 다각형의 스타일을 변경
    district.poly.setOptions({ fillColor: "#ff0000", fillOpacity: 0.3 });
  };


  // 주어진 점이 다각형 안에 포함되는지 확인하는 함수
  const pointInPolygon = (point, polygon) => {
    const x = point[0];
    const y = point[1];
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0];
      const yi = polygon[i][1];
      const xj = polygon[j][0];
      const yj = polygon[j][1];

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

      if (intersect) {
        inside = !inside;
      }
    }

    return inside;
  };

  // 주어진 마커 좌표가 어느 행정구역에 속하는지 확인하는 함수
  const findContainingDistrict = (markerPosition, seoulDistricts) => {
    for (const district of seoulDistricts) {
      const coordinates = district.geometry.coordinates[0];
      if (pointInPolygon([markerPosition.getLng(), markerPosition.getLat()], coordinates)) {
        return district;
      }
    }
    return null; // 마커가 어떤 행정구역에도 속하지 않을 때
  };

  useEffect(() => {
    const fetchSeoulDistricts = () => {
      try {
        const districts = geojson.features.map((feature) => {
          const coordinates = feature.geometry.coordinates[0].map(
            (coord) => new kakao.maps.LatLng(coord[1], coord[0])
          );

          const polygon = new kakao.maps.Polygon({
            path: coordinates,
            strokeWeight: 2,
            strokeColor: "#004c80",
            strokeOpacity: 0.8,
            ...initPolygonOptions,
          });

          const district = {
            ...feature,
            poly: polygon,
          };

          // console.log(district)

          kakao.maps.event.addListener(polygon, "click", () => {
            handlePolygonClick(district);
          });

          polygon.setMap(map);

          return district;
        });
        setSeoulDistricts(districts);

      } catch (error) {
        console.error("서울시 행정구역 데이터를 불러오는 중 에러 발생:", error);
      }
    };



    if (map) {
      fetchSeoulDistricts();
    }

    if (selectedDistrict) {
      resetPolygonStyle(selectedDistrict);
    }

  }, [map]);

  useEffect(() => {
    console.log(seoulDistricts)
    if (selectedBikeInfo && seoulDistricts.length > 0) {
      const bikeMarkerPosition = new kakao.maps.LatLng(
        selectedBikeInfo.stationLatitude,
        selectedBikeInfo.stationLongitude
      );

      const containingDistrict = findContainingDistrict(bikeMarkerPosition, seoulDistricts);

      if (containingDistrict) {
        handlePolygonClick(containingDistrict);
      }
    }
  }, [selectedBikeInfo]);



  // 선택된 행정구역의 날씨 정보를 렌더링
  return (
    <div>
      {selectedDistrict && selectedBikeInfo && (
        <Weather district={selectedDistrict} x={centroidX} y={centroidY} />
      )}
    </div>
  );
};

export default SeoulMap;
