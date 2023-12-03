// src/components/bike.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import SeoulMap from "./seoulmap";

const { kakao } = window;

const BikeMap = ({ map }) => {
  const [bikeData, setBikeData] = useState([]); // 자전거 대여소 정보 상태 정의
  const [selectedBikeInfo, setSelectedBikeInfo] = useState(null); // 선택된 자전거 대여소 정보 상태 정의

  // 컴포넌트가 마운트되거나 map 상태가 바뀔 때 실행되는 useEffect
  useEffect(() => {
    // 자전거 대여소 정보를 가져오는 비동기 함수 정의
    const fetchBikeData = async () => {
      const allBikeData = [];

      // 서버로부터 자전거 대여소 정보를 가져옴
      try {
        for (let start_idx = 1; start_idx <= 3000; start_idx += 1000) {
          const response = await axios.get(
            `http://localhost:4000/get_bike?start_idx=${start_idx}`
          );

          // 응답이 성공적이면 자전거 대여소 정보를 allBikeData에 추가
          if (response.status === 200) {
            const data = response.data;
            allBikeData.push(...data);
          }
        }

        // 각 자전거 대여소 위치에 마커를 추가
        allBikeData.forEach((bikeInfo) => {
          const markerPosition = new kakao.maps.LatLng(
            bikeInfo.stationLatitude,
            bikeInfo.stationLongitude
          );

          // 마커 생성
          const marker = new kakao.maps.Marker({
            position: markerPosition,
            title: bikeInfo.stationName,
          });

          // 마커를 지도에 추가
          marker.setMap(map);

          // 마커 클릭 이벤트 리스너 추가
          kakao.maps.event.addListener(marker, "click", function () {
            // 클릭된 마커의 자전거 대여소 정보를 selectedBikeInfo 상태에 저장
            setSelectedBikeInfo({
              ...bikeInfo,
              markerPosition,
            });
          });
        });

        // allBikeData를 bikeData 상태에 저장
        setBikeData(allBikeData);
      } catch (error) {
        console.error("자전거 정보를 불러오는 중 에러 발생:", error);
      }
    };

    // fetchBikeData 함수를 호출
    fetchBikeData();
  }, [map]);

  // 선택된 자전거 대여소 정보와 SeoulMap 컴포넌트를 렌더링
  return (
    <div>
      {selectedBikeInfo && (
        <div>
          <h3>{`대여소명: ${selectedBikeInfo.stationName}`}</h3>
          <p>{`자전거 보유 수: ${selectedBikeInfo.parkingBikeTotCnt}`}</p>
        </div>
      )}
      {/* <SeoulMap map={map} selectedBikeInfo={selectedBikeInfo} /> */}
      <SeoulMap map={map} selectedBikeInfo={selectedBikeInfo} />

    </div>
  );
};

export default BikeMap;
