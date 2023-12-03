// GPT.js
import React, { useState } from "react";
import axios from "axios";

function GPT({ selectedBikeInfo, weatherData, piData, district }) {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState(null);

    console.log(district)
    console.log(selectedBikeInfo)
    console.log(weatherData)
    console.log(piData)
    // console.log(piData.pressure)
    // console.log(piData.temperature)

    const onAskGPT = async () => {
        try {
            // Pass selectedBikeInfo, weatherData, and piData to the backend
            const response = await axios.post("http://localhost:4000/ask_gpt", {
                district,
                question,
                selectedBikeInfo,
                weatherData,
                piData,
            });

            if (response.status === 200) {
                setAnswer(response.data.answer);
            }
        } catch (error) {
            console.error("GPT에게 질문하는 중 에러 발생:", error);
        }
    };

    return (
        <div>
            <h2>따릉이 챗봇에게 의견 물어보기</h2>
            <button onClick={() => onAskGPT()}>물어보기</button>


            {answer && (
                <div>
                    <h3>챗봇 답변:</h3>
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
}

export default GPT;