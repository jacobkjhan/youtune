import React, { Component } from 'react';
import { connect } from 'react-redux';
import Vex from 'vexflow';
import { frequenciesObject, frequenciesObjectKeys } from '../../../../formulas';
import Tone from 'tone';

  //Currently only creates new VexFlow instances when used in 60BPM and when given a measure of rest.
  const VF = Vex.Flow;
  const synth = new Tone.Synth().toMaster();

  //Create Audio Context to have access to Web Audio API.
  var audioContext = new AudioContext();
  var analyser = null;
  var mediaStreamSource = null;
  var streamInstance = [];
  var frequencies = [];
  var individualInput = [];
  var bufferLength = null;
  var freqData = null;
  var counter = -1;
  var tonejsNotes = [];

export default class Sheet extends Component {
  constructor(props){
    super(props);
    this.state = {
      isPlaying: false,
      notes: []
    };
  this.connectMic = this.connectMic.bind(this);
  this.toggleLiveInput = this.toggleLiveInput.bind(this);
  }

  //Connects Microphone to data collector.
  connectMic (stream) {
    streamInstance = stream;
    mediaStreamSource = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    mediaStreamSource.connect(analyser);
    bufferLength = analyser.fftSize;
    freqData = new Float32Array(bufferLength);
      function freqToArray(){
        analyser.getFloatTimeDomainData(freqData);

        var foundNotes = require('detect-pitch')(freqData, 0.15);
        var freq = !foundNotes ? -1 : 44100 / foundNotes;

        // Check to see how many times per second the computer receives frequencies.
        // counter++;
        // console.log(freq);
        frequencies.push(freq);
        console.log(counter, 'Array of Notes: ', frequencies);
        individualInput = window.requestAnimationFrame(freqToArray);

      }
    freqToArray();
  }

  //Start / Stop Microphone reception.
  toggleLiveInput () {
    if (!this.state.isPlaying) {
      console.log('Started');
      this.setState({ isPlaying: true });
    navigator.mediaDevices.getUserMedia(
      {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
    })
    .then(this.connectMic)
    .catch(err => console.error(err));
  }
    else if (this.state.isPlaying){

      //Gives you the array of all frequencies to average up (computer takes in 60 freqs/sec).
      //We must extract a single frequency from the 60 that the computer has taken in.
      //This allows us to find the note within the frequenciesObject.
      //Only for when tempo is 60 bpm and after when you take a measure of rest (4 beats of rest).
      //frequenciesArray is the array of frequencies we must average out in order to find a SINGLE frequency.
      var frequenciesArray = frequencies.slice(240, frequencies.length);

      //How many notes have been played?
      var notesPlayed = Math.round(frequenciesArray.length / 60);

      //This is an array that contains an array of 60 frequencies.
      var notesArrWithArrOfFreqs = [];

      //This is the array with the averaged frequencies, to create the notes.
      var freqsToNoteArr = [];

      //This is the array of the closest frequencies.
      var closestFreqs = [];

      //This is the array of the actual notes.
      var notes = [];

      //This is the array of objects to be turned into Vex Stave instances.
      var vexNotes = [];

      //This is the array of notes with accidentals.
      var addAccidentals = [];

      //Pushes in 60 frequencies to the notesArrWithArrOfFreqs, to be able to average them for a single note.
      if (notesPlayed === 4){
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(0, 60));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(60, 120));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(120, 180));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(180, 240));
      }
      if (notesPlayed === 8) {
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(0, 60));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(60, 120));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(120, 180));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(180, 240));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(240, 300));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(300, 360));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(360, 420));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(420, 480));
      }
      if (notesPlayed === 12) {
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(0, 60));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(60, 120));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(120, 180));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(180, 240));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(240, 300));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(300, 360));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(360, 420));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(420, 480));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(480, 540));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(540, 600));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(600, 660));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(660, 720));
      }
      if (notesPlayed === 16) {
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(0, 60));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(60, 120));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(120, 180));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(180, 240));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(240, 300));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(300, 360));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(360, 420));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(420, 480));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(480, 540));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(540, 600));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(600, 660));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(660, 720));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(720, 800));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(800, 860));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(860, 920));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(920, 980));
      }
      if (notesPlayed === 20) {
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(0, 60));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(60, 120));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(120, 180));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(180, 240));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(240, 300));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(300, 360));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(360, 420));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(420, 480));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(480, 540));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(540, 600));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(600, 660));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(660, 720));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(720, 800));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(800, 860));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(860, 920));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(920, 980));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(980, 1040));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1040, 1100));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1100, 1160));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1160, 1220));
      }
      if (notesPlayed === 24) {
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(0, 60));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(60, 120));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(120, 180));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(180, 240));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(240, 300));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(300, 360));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(360, 420));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(420, 480));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(480, 540));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(540, 600));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(600, 660));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(660, 720));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(720, 800));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(800, 860));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(860, 920));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(920, 980));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(980, 1040));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1040, 1100));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1100, 1160));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1160, 1220));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1220, 1280));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1280, 1340));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1340, 1400));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1400, 1460));
      }
      if (notesPlayed === 28) {
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(0, 60));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(60, 120));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(120, 180));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(180, 240));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(240, 300));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(300, 360));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(360, 420));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(420, 480));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(480, 540));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(540, 600));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(600, 660));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(660, 720));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(720, 800));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(800, 860));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(860, 920));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(920, 980));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(980, 1040));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1040, 1100));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1100, 1160));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1160, 1220));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1220, 1280));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1280, 1340));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1340, 1400));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1400, 1460));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1460, 1520));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1520, 1580));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1580, 1640));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1640, 1700));
      }
      if (notesPlayed === 32) {
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(0, 60));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(60, 120));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(120, 180));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(180, 240));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(240, 300));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(300, 360));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(360, 420));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(420, 480));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(480, 540));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(540, 600));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(600, 660));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(660, 720));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(720, 800));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(800, 860));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(860, 920));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(920, 980));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(980, 1040));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1040, 1100));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1100, 1160));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1160, 1220));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1220, 1280));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1280, 1340));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1340, 1400));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1400, 1460));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1460, 1520));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1520, 1580));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1580, 1640));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1640, 1700));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1700, 1760));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1760, 1820));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1820, 1880));
        notesArrWithArrOfFreqs.push(frequenciesArray.slice(1880, 1940));
      }

      const average = function (array){
        var sum = 0;
        for (var i = 0; i < array.length; i++){
          sum += +array[i];
        }
        var avg = sum / array.length;
        return avg;
      };

      const closest = function (num, arr) {
        var curr = arr[0];
        var diff = Math.abs(num - curr);
        for (var val = 0; val < arr.length; val++) {
            var newdiff = Math.abs(num - arr[val]);
            if (newdiff < diff) {
                diff = newdiff;
                curr = arr[val];
            }
        }
        return curr;
      };

      //This loops through the array that has arrays of 60 frequencies for each element, and finds the average.
      for (var j = 0; j < notesArrWithArrOfFreqs.length; j++){
        freqsToNoteArr.push(average(notesArrWithArrOfFreqs[j]));
      }

      //This loop goes through the averaged frequencies and locates the closest frequency from the frequenciesObjectKeys.
      for (var k = 0; k < freqsToNoteArr.length; k++){
        closestFreqs.push(closest(freqsToNoteArr[k], frequenciesObjectKeys));
      }

      //This loop goes through the matched frequencies and extracts the objects from the props of the matching key.
      for (var l = 0; l < closestFreqs.length; l++){
        notes.push(frequenciesObject[closestFreqs[l]]);
      }

      //This loop is to create new instances for Vex Flow to render on the staff.
      for (var m = 0; m < notes.length; m++){
        vexNotes.push(new VF.StaveNote(notes[m]));
      }

      //This loop adds accidentals to the new instances of Vex Flow.
      for (var n = 0; n < notes.length; n++){
        if (notes[n]['keys'][0].indexOf('#') !== -1){
          addAccidentals.push(vexNotes[n].addAccidental(0, new VF.Accidental("#")));
        }
        else {
          addAccidentals.push(vexNotes[n]);
        }
      }

      //This loop is to add tone.js triggerAttackReleases to play back the notes given.
      var toneCounter = 0;
      for (var o = 0; o < closestFreqs.length; o++){
        tonejsNotes.push(synth.triggerAttackRelease(+closestFreqs[o], 1, audioContext.currentTime + toneCounter));
        toneCounter++;
      }

      // Console logs to test if things are working.

      // console.log("This is the length of the computer's calculated frequencies", frequencies.length);
      // console.log("This is the number of notes played", notesPlayed);
      // console.log("This is the nested array", notesArrWithArrOfFreqs);
      // console.log("This is the array of averaged frequencies", freqsToNoteArr);
      // console.log("These are the note frequencies", closestFreqs);
      // console.log("This is the array of objects for VexFlow", notes);
      // console.log('Vex Flow new Instances', vexNotes);
      // console.log('Vex Flow with Accidentals', addAccidentals);
      // console.log('This is the array of Tone.JS calls', toneCounter);
      console.log('This is the sample rate', audioContext.sampleRate);
      console.log('Stopped');
      this.setState({
        isPlaying: false,
        notes: addAccidentals
      });
      window.cancelAnimationFrame(individualInput);
      streamInstance.getAudioTracks()[0].stop();
    }
  }

  componentDidMount() {
    // let renderer = new VF.Renderer(this.vexdiv, VF.Renderer.Backends.SVG);

    // // Configure the rendering context.
    // renderer.resize(800, 500);
    // let context = renderer.getContext();
    // context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

    // var stave = new VF.Stave(20, 0, 300);
    // var stave2 = new VF.Stave(320, 0, 300);
    // var stave3 = new VF.Stave(20, 100, 300);
    // var stave4 = new VF.Stave(320, 100, 300);
    // var stave5 = new VF.Stave(20, 200, 300);
    // var stave6 = new VF.Stave(320, 200, 300);
    // var stave7 = new VF.Stave(20, 300, 300);
    // var stave8 = new VF.Stave(320, 300, 300);


    // stave.addClef('treble');
    // stave3.addClef('treble');
    // stave5.addClef('treble');
    // stave7.addClef('treble');
    // stave.setContext(context).draw();
    // stave2.setContext(context).draw();
    // stave3.setContext(context).draw();
    // stave4.setContext(context).draw();
    // stave5.setContext(context).draw();
    // stave6.setContext(context).draw();
    // stave7.setContext(context).draw();
    // stave8.setContext(context).draw();

  }

  componentDidUpdate() {
    var notes = this.state.notes;

    // console.log('This is the array of notes', notes);
    if (this.state.notes.length > 0){
    var renderer = new VF.Renderer(this.vexdiv, VF.Renderer.Backends.SVG);

    renderer.resize(500, 500);
    var context = renderer.getContext();
    context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

        var stave = new VF.Stave(10,40,400);
        // var stave = new VF.Stave(20, 0, 300);

        stave.addClef("treble").addTimeSignature("4/4");
        stave.setContext(context).draw();

        var voice = new VF.Voice({num_beats: 4, beat_value: 4});
        voice.addTickables(notes);

        var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400);
        voice.draw(context, stave);

      // if (this.state.notes.length === 8){
      //   var stave = new VF.Stave(10, 40, 300);
      //   var stave2 = new VF.Stave(310, 40, 300);

      //   stave.addClef("treble").addTimeSignature("4/4");
      //   stave.setContext(context).draw();
      //   stave2.setContext(context).draw();

      //   var voice = new VF.Voice({num_beats: 4, beat_value: 4});
      //   voice.addTickables(notes.slice(0,4));
      //   var voice2 = new VF.Voice({num_beats: 4, beat_value: 4});
      //   voice2.addTickables(notes.slice(4,8));

      //   var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400);
      //   voice.draw(context, stave);
      //   var formatter2 = new VF.Formatter().joinVoices([voice2]).format([voice2], 400);
      //   voice2.draw(context, stave2);
      // }
      // if (this.state.notes.length === 12){

      // }
      // if (this.state.notes.length === 16){

      // }
      // if (this.state.notes.length === 20){

      // }
      // if (this.state.notes.length === 24){

      // }
      // if (this.state.notes.length === 28){

      // }
      // if (this.state.notes.length === 32){

      // }
    }
  }

  render() {
    return (
      <div>
        <h2 className="jumbotron text-center">YouTune</h2>
        <div>
          <div>
            <button  className="btn btn-default" onClick={() => this.toggleLiveInput()}>Start/Stop Recording!</button>
          </div>
          <div ref={(div) => { this.vexdiv = div; }}></div>
        </div>
      </div>
    );
  }
}


// 60 Beat Per Minute => Each second is a beat
// 60 Frequencies per second => each beat has 60
