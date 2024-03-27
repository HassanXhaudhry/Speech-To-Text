import React, { Fragment, useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const App = () => {
  const [apiResponse, setApiResponse] = useState('Ask');
  const [responseTime, setResponseTime] = useState(null);
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    resetTranscript();
  };

  const handleTranscript = async () => {
    try {
      const startTime = new Date().getTime();
      const response = await generateResponse(transcript);
      const endTime = new Date().getTime();
      const timeTaken = (endTime - startTime) / 1000; // in seconds
      setResponseTime(timeTaken);
      setApiResponse(response);
    } catch (error) {
      console.error("Error in handleTranscript:", error);
    }
  };

  useEffect(() => {
    if (transcript) {
      handleTranscript();
    }
  }, [transcript]);


  const generateResponse = async (question) => {
    const prompt = `Your role is to answer the question based on the context and be very helpful. This is for an interview. Also analyze the script to understand what he is asking about, and if he is using machine learning terms, then answer and also complete the words, like "ed" stands for EDA and etc also you can analyze the script accordingly question. here is the question: ${question}`;

    const apiKey = "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";
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 2000,
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseJson = await response.json();
    return responseJson.choices[0].message.content;
  };

  if (!browserSupportsSpeechRecognition) {
    return <div>Browser doesn't support speech recognition</div>;
  }

  
  return (
    <Fragment>
      <div>
        <h1>Speech To text Conversion</h1>
        <p>{transcript}</p>
      </div>
      <div>
        <button onClick={startListening}>Start Listening</button>
        <button onClick={stopListening}>Stop Listening</button>
        <p>{apiResponse}</p>
        {responseTime !== null && <p>Response Time: {responseTime} seconds</p>}
      </div>
    </Fragment>
  );
};

export default App;


