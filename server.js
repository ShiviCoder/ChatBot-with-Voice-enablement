// server.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const speech = require('@google-cloud/speech');
const textToSpeech = require('@google-cloud/text-to-speech');

const speechClient = new speech.SpeechClient();
const textToSpeechClient = new textToSpeech.TextToSpeechClient();

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('chat message', (audioBlob) => {
    const audio = {
      content: audioBlob,
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    };

    speechClient.recognize({
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
      },
      interimResults: false,
      audio: audio,
    })
      .then(([response]) => {
        const transcription = response.results
          .map((result) => result.alternatives[0].transcript)
          .join('\n');
        console.log(`Transcription: ${transcription}`);

        const request = {
          input: { text: transcription },
          voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
          audioConfig: { audioEncoding: 'LINEAR16' },
        };

        textToSpeechClient.synthesizeSpeech(request)
          .then(([response]) => {
            const audioContent = response.audioContent;
            const audioBlob = new Buffer.from(audioContent, 'binary');
            socket.emit('bot reply', transcription);
          })
          .catch((err) => {
            console.error('ERROR:', err);
          });
      })
      .catch((err) => {
        console.error('ERROR:', err);
      });
  });
});

http.listen(3000, () => {
  console.log('Serverlistening on port 3000');
});
