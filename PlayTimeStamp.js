import React from 'react';
import BlinkView from 'react-native-blink-view';
import {Text} from 'react-native';

const PlaybackTimeStamp = (props) => {
  const getMMSSFromMillis = (millis) => {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = (number) => {
      const string = number.toString();
      if (number < 10) {
        return '0' + string;
      }
      return string;
    };
    return padWithZero(minutes) + ':' + padWithZero(seconds);
  };

  const getPlaybackTimestamp = () => {
    if (
      props.sound != null &&
      props.positionMillis != null &&
      props.durationMillis != null
    ) {
      return `${getMMSSFromMillis(props.positionMillis)} / ${getMMSSFromMillis(
        props.durationMillis
      )}`;
    }
    return '';
  };

  /* 
    the 'call' statements below binds 'this' to the Player class
    I used this technique vice pulling out the relevant functions becasue
    I  knew that would work, and didn't want to incur risk by
    deviating from Expo's example too much
     */

  if (props.playStatus === 'PAUSED') {
    return (
      <BlinkView blinking={true} delay={750}>
        <Text style={props.timeStampStyle}>{getPlaybackTimestamp()}</Text>
      </BlinkView>
    );
  } else {
    return <Text style={props.timeStampStyle}>{getPlaybackTimestamp()}</Text>;
  }
};

export default PlaybackTimeStamp;
