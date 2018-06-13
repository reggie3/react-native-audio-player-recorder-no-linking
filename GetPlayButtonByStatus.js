import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { RkButton, RkTheme } from 'react-native-ui-kitten';

const roundButtonStyle = {
  borderRadius: 50,
  width: 75,
  height: 75,
  alignSelf: 'center'
};

RkTheme.setType('RkButton', 'disabled', {
  container: {
    backgroundColor: 'gray'
  }
});

const GetPlayButtonByStatus = (props) => {
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
        rkType='disabled'
          style={[roundButtonStyle]}
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
          <FontAwesome name="exclamation-triangle" color="white" size={55} />
        </RkButton>
      );
    } else {
      console.warn(
        `GetPlayButtonByStatus: unknown playStatus ${props.playStatus}`
      );
      return (
        <RkButton rkType="danger" style={roundButtonStyle} onPress={() => {}}>
          <FontAwesome name="question-circle" color="white" size={55} />
        </RkButton>
      );
    }
  }
};

export default GetPlayButtonByStatus;
