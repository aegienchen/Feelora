const fs = require('fs');
const path = require('path');

if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    const credPath = path.join(__dirname, 'secret.json');
    fs.writeFileSync(credPath, process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credPath;
}

const express = require('express'); // import express
const app = express(); // express function call
const port = process.env.PORT || 3000;
const server = app.listen(port);
app.use(express.static('public'));
console.log("Server start!\n");

const socket = require('socket.io'); // import socket
const io = socket(server); // create socket
io.sockets.on('connection', newConnection);
console.log("Socket ready!\n");

const language = require('@google-cloud/language'); // Imports the Google Cloud client library
const client = new language.LanguageServiceClient(); // Instantiates a client
console.log("Google client set!\n")


function newConnection(socket){
    console.log("New connection: " + socket.id + "\n");
    socket.on('diary', (data) => analyzeDiary(socket, data));
}

async function analyzeDiary(socket, data){
    console.log("Receive Diary: " + data.text);
    const document = {
        content: data.text,
        type: 'PLAIN_TEXT'
    };

    const [result] = await client.analyzeSentiment({document: document});
    const document_result = result.documentSentiment;

    console.dir(result, { depth: null });
    if (result.sentences) {
        result.sentences.forEach((sentence, idx) => {
            console.log(`Sentence ${idx + 1}: ${sentence.text.content}`);
            console.log(`Score: ${sentence.sentiment.score}`);
            console.log(`Magnitude: ${sentence.sentiment.magnitude}`);
            console.log("\n");
        });
    }
  
    // console.log(result);
    console.log(`Document Score: ${document_result.score}`);
    console.log(`Document Magnitude: ${document_result.magnitude}\n`);

    console.log("Analyze complete!\n")
    console.log("Sending result...\n")

    const response = {
        score: document_result.score,
        magnitude: document_result.magnitude,
        word_count: data.text.trim().split(/\s+/).length,
        pos_proportion: result.sentences.filter(sentence => sentence.sentiment.score > 0.25).length / result.sentences.length
    }

    socket.emit('analyze_result', response);
    console.log("Result sent!\n")
}