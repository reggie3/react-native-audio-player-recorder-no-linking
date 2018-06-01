import React from 'react';
import BlinkView from 'react-native-blink-view';
import {Text} from 'react-native';

const RecordTimeStamp = (props) => {
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

  const getRecordingDurationTimestamp=()=> {
    if (props.recordStatus === 'RECORDING_COMPLETE') {
      return getMMSSFromMillis(props.durationMillis);
    }
    return '00:00';
  }


  const getRecordingTimestamp=()=> {
    debugger;
    if (props.recordingDuration != null) {
      return `${getMMSSFromMillis(props.recordingDuration)}`;
    }
    return `${getMMSSFromMillis(0)}`;
  }

  /* 
    the 'call' statements below binds 'this' to the Player class
    I used this technique vice pulling out the relevant functions becasue
    I  knew that would work, and didn't want to incur risk by
    deviating from Expo's example too much
     */
    debugger;
    if (props.recordStatus==='RECORDING') {
    
      return (
        <BlinkView blinking={true} delay={500}>
          <Text style={[props.timeStampStyle, { color: 'red' }]}>
            {getRecordingTimestamp()}
          </Text>
        </BlinkView>
      );
    }

   else {

      return (
        <Text style={props.timeStampStyle}>{getRecordingDurationTimestamp()}</Text>
      );
    }
};

export default RecordTimeStamp;
