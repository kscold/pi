// src/components/map.js
import React, { useState, useEffect } from "react"
import BikeMap from "./bike"

const { kakao } = window

function Map() {
  const [map, setMap] = useState(null)

  // 컴포넌트가 마운트되면 실행되는 useEffect
  useEffect(() => {
    // 지도를 표시할 HTML 요소를 가져옴
    const container = document.getElementById("map")

    // 지도의 옵션 설정
    const options = {
      center: new kakao.maps.LatLng(37.4961, 127.0113),
      level: 8,
    }

    // 지도를 생성하고 map 상태에 저장
    const map = new kakao.maps.Map(container, options)
    setMap(map)

  }, [])

  // 지도와 BikeMap 컴포넌트를 렌더링
  return (
    <div>
      <div id="map" style={{ width: "100%", height: "500px" }}></div>
      <BikeMap map={map} />
    </div>
  )
}

export default Map
