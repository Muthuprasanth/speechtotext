
require('dotenv').config();
var fs = require("fs");
var request = require('request');
var url = require('url');

var request = require('request-promise').defaults({ encoding: null });
var toWav = require('audiobuffer-to-wav')
//var audiobuffer = require('audio-buffer')
const AudioContext = require('web-audio-api').AudioContext;
const audioContext = new AudioContext;
const { BingSpeechClient, VoiceRecognitionResponse } = require('bingspeech-api-client');

function getfile(url,token)
{
  return request({
    url: url,
    headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/octet-stream'
    }
  });
}
exports.list_all_tasks =  function (req, res) {

  console.log("success");
  var filename = "wavoutput_1.wav";
  //var url = req.query.url;
  //var token = req.query.token;
  //console.log("url "+url);
  //console.log("token "+token);
  var url = "https://smba.trafficmanager.net/apis/v3/attachments/0-sa-d5-725f8af72e3c8a60696c06f40d8f0e59/views/original";
  var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjdfWnVmMXR2a3dMeFlhSFMzcTZsVWpVWUlHdyIsImtpZCI6IjdfWnVmMXR2a3dMeFlhSFMzcTZsVWpVWUlHdyJ9.eyJhdWQiOiJodHRwczovL2FwaS5ib3RmcmFtZXdvcmsuY29tIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvZDZkNDk0MjAtZjM5Yi00ZGY3LWExZGMtZDU5YTkzNTg3MWRiLyIsImlhdCI6MTUzMjg3ODM0MSwibmJmIjoxNTMyODc4MzQxLCJleHAiOjE1MzI4ODIyNDEsImFpbyI6IjQyQmdZTmlUYnpCcDk0R0VRejdYWlQrRWlreGVBQUE9IiwiYXBwaWQiOiJiMjM3NTNmZS1hNjk1LTRmMWMtYTk0YS04NmZjM2EwZWI4YzgiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9kNmQ0OTQyMC1mMzliLTRkZjctYTFkYy1kNTlhOTM1ODcxZGIvIiwidGlkIjoiZDZkNDk0MjAtZjM5Yi00ZGY3LWExZGMtZDU5YTkzNTg3MWRiIiwidXRpIjoiTVNmRGh1SFdxMGljRzdldkpfUUZBQSIsInZlciI6IjEuMCJ9.C0PaDWeORRzEU6Qdgc5U6bV8wD7UmCb64df1iVEH5JpqD5ERZbbayJbMaOE75ewrm_FYkCM4Sa4ligrvDzxaK9zMRQIM3J0DscQ3qKA--EUCJE6_edfgAeRU41ZxSuu-BCg_bFMWZf4ZePN-cSzelJQP7BGjZfLqaudb8dZgkoWzyb4fQOoG0a92FjvoD6wr3wyeSRJK61VX1BQBjMt3uML7UAhQNRkekq3P1mxEYEdODgmnW-wdm2vDPHRKWGX4mUI1SrMe9u3jBS72gJesj4RgDyvvVmdGsTN9Q4l2k4bTRnT1vJc9dpzrYvRb9jLcJ6beitI0fe90UZ5yi2puyg";
  var fileDownload  = getfile(url,token);
    fileDownload.then(function (resp) {
      // Send reply with attachment type & size
    console.log("Response is  ",resp);
  // var reply = new builder.Message(session)
    //    .text('Attachment of %s type and size of %s bytes received.', attachment.contentType, resp.length);
  //  session.send(reply);
    audioContext.decodeAudioData(resp, buffer => {
      let wav = toWav(buffer); 
      var chunk = new Uint8Array(wav);
    //   console.log(chunk); 

    if (fs.existsSync(filename)) {
      console.log("file deleted ");
      console.log("-------------------------------------------------");
      fs.unlinkSync(filename); 
      // Do something
    }
      fs.appendFile(filename, new Buffer(chunk), function (err) {
        let audioStream = fs.createReadStream("wavoutput.wav"); // create audio stream from any source
        // Bing Speech Key (https://www.microsoft.com/cognitive-services/en-us/subscriptions)
        let subscriptionKey = 'c9a70ce52aae4bb592fcb80099cd2b8b';        
        let client = new BingSpeechClient(subscriptionKey);
        //  client.recognizeStream(audioStream).then(response => console.log(response.results[0].name));
        client.recognizeStream(audioStream).then(function(response)
        {
        console.log("response is ",response);
        console.log("-------------------------------------------------");
        console.log("response is ",response.results[0]);
        var s = {text:response.results[0].name}
      //  var s1 = JSON.stringify(response.results[0].name);
        console.log("After stringify  ",s);
       // console.log("After stringify  ",JSON.parse(s1));
        res.send(s);
      //  resolve(response.results[0].name);
        }).catch(function(error)
        {
          console.log("error occured is ",error);
        //  reject(error);
        });
      });             
    });

    }).catch(function (err) {
        console.log("Error thing is  ",err);
      //  reject(error);
    });

}

/*
if (fs.existsSync(path)) {
    fs.unlinkSync(filePath);
}

*/