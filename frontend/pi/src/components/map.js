// // src/components/map.js
// import React, { useState, useEffect } from "react"
// import axios from "axios"

// const { kakao } = window

// function Map() {
//   const [map, setMap] = useState(null)
//   const [marker, setMarker] = useState(null)
//   const [infoWindow, setInfoWindow] = useState(null)
//   const [userInput, setUserInput] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState("")

//   const searchLocation = async () => {
//     setLoading(true)
//     setMessage("데이터를 받는 중입니다...")

//     const response = await axios.post("http://localhost:4000/get", {
//       place: userInput,
//     })

//     if (response.status === 200) {
//       const backendData = response.data
//       setLoading(false)
//       setMessage("요청한 위치 데이터에 마커가 생겼습니다")
//       console.log(backendData)
//       console.log(backendData.LAT)

//       if (marker) {
//         marker.setMap(null)
//       }

//       const markerPosition = new kakao.maps.LatLng(
//         backendData.LAT,
//         backendData.LNG
//       )

//       const newMarker = new kakao.maps.Marker({
//         position: markerPosition,
//       })
//       setMarker(newMarker)

//       newMarker.setMap(map)

//       const iwContent = `<div style="padding:5px;">온도${backendData.TEMP}<br></br>체감 온도${backendData.SENSIBLE_TEMP}</div>`

//       const infoWindow = new kakao.maps.InfoWindow({
//         content: iwContent,
//       })
//       setInfoWindow(infoWindow)

//       kakao.maps.event.addListener(newMarker, "click", function () {
//         if (infoWindow.getMap()) {
//           infoWindow.close()
//         } else {
//           infoWindow.open(map, newMarker)
//         }
//       })
//     }
//   }

//   const handleUserInputChange = (event) => {
//     setUserInput(event.target.value)
//   }

//   useEffect(() => {
//     const container = document.getElementById("map")
//     const options = {
//       center: new kakao.maps.LatLng(37.624915253753194, 127.15122688059974),
//       level: 3,
//     }
//     const map = new kakao.maps.Map(container, options)
//     setMap(map)
//   }, [])

//   useEffect(() => {
//     if (marker) {
//       marker.setMap(map)
//     }
//   }, [marker, map])

//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Enter location"
//         value={userInput}
//         onChange={handleUserInputChange}
//       />
//       <button onClick={searchLocation}>위치 검색</button>
//       <div id="map" style={{ width: "500px", height: "500px" }}></div>
//       {loading && <p>{message}</p>}
//     </div>
//   )
// }

// export default Map

// src/components/map.js

import React, { useState, useEffect } from "react"
import axios from "axios"
import SeoulMap from "./seoulmap"
import BikeMap from "./bike"

const { kakao } = window

function Map() {
  const [map, setMap] = useState(null)
  const [marker, setMarker] = useState(null)
  const [infoWindow, setInfoWindow] = useState(null)
  const [userInput, setUserInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const searchLocation = async () => {
    setLoading(true)
    setMessage("데이터를 받는 중입니다...")

    const response = await axios.post("http://localhost:4000/get", {
      place: userInput,
    })

    if (response.status === 200) {
      const backendData = response.data
      setLoading(false)
      setMessage("요청한 위치 데이터에 마커가 생겼습니다")
      console.log(backendData)
      console.log(backendData.LAT)

      if (marker) {
        marker.setMap(null)
      }

      const markerPosition = new kakao.maps.LatLng(
        backendData.LAT,
        backendData.LNG
      )

      const newMarker = new kakao.maps.Marker({
        position: markerPosition,
      })
      setMarker(newMarker)

      newMarker.setMap(map)

      const iwContent = `<div style="padding:5px;">온도${backendData.TEMP}<br></br>체감 온도${backendData.SENSIBLE_TEMP}</div>`

      const infoWindow = new kakao.maps.InfoWindow({
        content: iwContent,
      })
      setInfoWindow(infoWindow)

      kakao.maps.event.addListener(newMarker, "click", function () {
        if (infoWindow.getMap()) {
          infoWindow.close()
        } else {
          infoWindow.open(map, newMarker)
        }
      })
    }
  }

  const handleUserInputChange = (event) => {
    setUserInput(event.target.value)
  }

  useEffect(() => {
    const container = document.getElementById("map")
    const options = {
      center: new kakao.maps.LatLng(37.624915253753194, 127.15122688059974),
      level: 3,
    }
    const map = new kakao.maps.Map(container, options)
    setMap(map)
  }, [])

  useEffect(() => {
    if (marker) {
      marker.setMap(map)
    }
  }, [marker, map])

  return (
    <div>
      <input
        type="text"
        placeholder="Enter location"
        value={userInput}
        onChange={handleUserInputChange}
      />
      <button onClick={searchLocation}>위치 검색</button>
      <div id="map" style={{ width: "500px", height: "500px" }}></div>
      <SeoulMap map={map} />
      <BikeMap map={map} />
      {loading && <p>{message}</p>}
    </div>
  )
}

export default Map
