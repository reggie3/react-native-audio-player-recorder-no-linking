import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { RkButton, RkTheme } from 'react-native-ui-kitten';

const buttonStyle = {
  borderRadius: 5,
  width: 64,
  height: 64,
  alignSelf: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const ICON_SIZE= 48;
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
        style={{ ...buttonStyle, paddingLeft: 14 }}
        onPress={() => {}}
      >
        <FontAwesome name="play" color="white" size={ICON_SIZE} />
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
          style={[buttonStyle]}
          onPress={() => {}}
        >
          <FontAwesome name="hourglass" color="white" size={ICON_SIZE} />
        </RkButton>
      );
    } else if (props.playStatus === 'PAUSED') {
      return (
        <RkButton
          rkType="success"
          style={[buttonStyle, { paddingLeft: 25 }]}
          onPress={props.onPlayPress}
        >
          <FontAwesome name="play" color="white" size={ICON_SIZE} />
        </RkButton>
      );
    } else if (props.playStatus === 'STOPPED') {
      return (
        <RkButton
          rkType="success"
          style={[buttonStyle, { paddingLeft: 14 }]}
          onPress={props.onPlayPress}
        >
          <FontAwesome name="play" color="white" size={ICON_SIZE} />
        </RkButton>
      );
    } else if (props.playStatus === 'PLAYING') {
      return (
        <RkButton
          rkType="danger"
          style={buttonStyle}
          onPress={props.onPausePress}
        >
          <FontAwesome name="pause" color="white" size={ICON_SIZE} />
        </RkButton>
      );
    } else if (props.playStatus === 'ERROR') {
      return (
        <RkButton rkType="danger" style={buttonStyle} onPress={() => {}}>
          <FontAwesome name="exclamation-triangle" color="white" size={ICON_SIZE} />
        </RkButton>
      );
    } else {
      console.warn(
        `GetPlayButtonByStatus: unknown playStatus ${props.playStatus}`
      );
      return (
        <RkButton rkType="danger" style={buttonStyle} onPress={() => {}}>
          <FontAwesome name="question-circle" color="white" size={ICON_SIZE} />
        </RkButton>
      );
    }
  }
};

export default GetPlayButtonByStatus;
