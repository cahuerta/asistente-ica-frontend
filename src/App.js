
import React, { useState } from "react";

function App() {
  const [text, setText] = useState("");

  const startDictation = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Tu navegador no soporta reconocimiento de voz.");
      return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "es-ES";
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
    };
  };

  const handleSend = async () => {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/procesar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ texto: text })
    });
    const data = await response.json();
    alert("Ficha generada:\n" + data.ficha);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Asistente ICA</h1>
      <button onClick={startDictation}>🎤 Dictar</button>
      <textarea value={text} onChange={e => setText(e.target.value)} rows="5" cols="50" />
      <br />
      <button onClick={handleSend}>Enviar a GPT</button>
    </div>
  );
}

export default App;
