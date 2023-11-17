// src/components/SeoulMap.js
import React, { useEffect } from "react"
import geojson from "./geo.json"

const { kakao } = window

const SeoulMap = ({ map }) => {
  useEffect(() => {
    const fetchSeoulDistricts = () => {
      try {
        const seoulDistricts = geojson.features

        seoulDistricts.forEach((feature) => {
          const coordinates = feature.geometry.coordinates[0].map(
            (coord) => new kakao.maps.LatLng(coord[1], coord[0])
          )

          const polygon = new kakao.maps.Polygon({
            path: coordinates,
            strokeWeight: 2,
            strokeColor: "#004c80",
            strokeOpacity: 0.8,
            fillColor: "#fff",
            fillOpacity: 0.7,
          })

          polygon.setMap(map)
        })
      } catch (error) {
        console.error("서울시 행정구역 데이터를 불러오는 중 에러 발생:", error)
      }
    }

    fetchSeoulDistricts()
  }, [map]) // map이 변경될 때마다 실행

  return null
}

export default SeoulMap
