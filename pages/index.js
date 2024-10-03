// pages/index.js
import React, { useState, useEffect } from 'react';
import MicButton from '../components/MicButton';
import io from 'socket.io-client';

const socket = io();

const Index = () => {
  const [text, setText] = useState('');
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    socket.on('bot reply', (replyText) => {
      setText(replyText);
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(replyText);
      synth.speak(utterance);
    });
  }, []);

  const handleMicClick = (audioBlob) => {
    setAudio(audioBlob);
    socket.emit('chat message', audioBlob);
  };

  return (
    <div>
      <MicButton onMicClick={handleMicClick} />
      <p>{text}</p>
    </div>
  );
};

export default Index;
