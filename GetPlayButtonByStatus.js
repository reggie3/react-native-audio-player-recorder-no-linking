import React from 'react';
import { Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { RkButton } from 'react-native-ui-kitten';

const roundButtonStyle = {
  borderRadius: 50,
  width: 100,
  height: 100,
  alignSelf: 'center'
};

const GetPlayButtonByStatus = (props) => {
  debugger;
  if (props.recordStatus === 'RECORDING') {
    return (
      <RkButton
        rkType="disabled"
        style={{ ...roundButtonStyle, paddingLeft: 25 }}
        onPress={() => {}}
      >
        <FontAwesome name="play" color="white" size={75} />
      </RkButton>
    );
  } else {
    if (
      props.playStatus === 'BUFFERING' ||
      props.playStatus === 'LOADING' ||
      props.playStatus === 'NO_SOUND_FILE_AVAILABLE'
    ) {
      return (
        <RkButton
          style={[roundButtonStyle, { backgroundColor: 'gray' }]}
          onPress={() => {}}
        >
          <FontAwesome name="hourglass" color="white" size={65} />
        </RkButton>
      );
    } else if (props.playStatus === 'PAUSED') {
      return (
        <RkButton
          rkType="success"
          style={[roundButtonStyle, { paddingLeft: 25 }]}
          onPress={props.onPlayPress}
        >
          <FontAwesome name="play" color="white" size={75} />
        </RkButton>
      );
    } else if (props.playStatus === 'STOPPED') {
      return (
        <RkButton
          rkType="success"
          style={[roundButtonStyle, { paddingLeft: 25 }]}
          onPress={props.onPlayPress}
        >
          <FontAwesome name="play" color="white" size={75} />
        </RkButton>
      );
    } else if (props.playStatus === 'PLAYING') {
      return (
        <RkButton
          rkType="danger"
          style={roundButtonStyle}
          onPress={props.onPausePress}
        >
          <FontAwesome name="pause" color="white" size={65} />
        </RkButton>
      );
    } else if (props.playStatus === 'ERROR') {
      return (
        <RkButton rkType="danger" style={roundButtonStyle} onPress={() => {}}>
          <FontAwesome name="exclamation-triangle" color="red" size={65} />
        </RkButton>
      );
    } else {
      console.error(
        `unhandled error in GetPlayButtonByStatus${props.playStatus}`
      );
    }
  }
};

export default GetPlayButtonByStatus;
