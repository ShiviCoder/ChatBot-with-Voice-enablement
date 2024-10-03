// components/MicButton.js
import React, { useState, useEffect } from 'react';

const MicButton = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    if (isRecording) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const mediaRecorder = new MediaRecorder(stream);
          const audioChunks = [];

          mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
          };

          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            setAudio(audioBlob);
          };

          mediaRecorder.start();
        })
        .catch(error => console.error('Error:', error));
    }
  }, [isRecording]);

  const handleMicClick = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
    }, 5000); // Record for 5 seconds
  };

  return (
    <button onClick={handleMicClick}>
      {isRecording ? 'Recording...' : 'Press to Record'}
    </button>
  );
};

export default MicButton;
