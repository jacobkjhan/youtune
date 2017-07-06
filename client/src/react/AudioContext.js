import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NotesToSheets from './components/NotesToSheet';

var Context = window.AudioContext || window.webkitAudioContext;

export default class AudioContextComponent extends Component {
  componentWillMount() {
    if (this.props.audioContext){
      return true;
    }
    else if (Context){
      this.audioContext = new Context();
    }
    else {
      console.error('AudioContext is not supported in this browser.');
      this.audioContext = {};
    }
  }


  componentWillUnmount(){
    if (this.audioContext){
      this.audioContext.close();
    }
  }


  getChildContext(){
    return { audioContext: this.props.audioContext || this.audioContext };
  }


  render(){
    return (
      <div>
        <NotesToSheets />
        {this.props.children}
      </div>

    );
  }
}

AudioContextComponent.childContextTypes = {
  audioContext: PropTypes.any.isRequired
};
