import React from 'react';
import { Button, Icon } from 'native-base';

const buttonStyle = {
  width: 72,
  height: 72,
  alignSelf: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const ICON_SIZE = 40;

const GetRecordButtonByStatus = (props) => {
  if (props.playStatus === 'PLAYING') {
    return (
      <Button rounded disabled style={buttonStyle} onPress={() => {}}>
        <Icon
          type="FontAwesome"
          name="microphone"
          color="white"
          style={{ fontSize: ICON_SIZE + 4 }}
        />
      </Button>
    );
  } else {
    if (props.recordStatus === 'RECORDING') {
      return (
        <Button rounded danger style={buttonStyle} onPress={props.onStopRecordingPress}>
          <Icon
            type="FontAwesome"
            name="stop"
            color="white"
            style={{ fontSize: ICON_SIZE  }}
          />
        </Button>
      );
    }
    if (props.playStatus === 'BUFFERING' || props.playStatus === 'LOADING') {
      return (
        <Button rounded warning style={buttonStyle} onPress={() => {}}>
          <Icon
            type="FontAwesome"
            name="hourglass"
            color="white"
            style={{ fontSize: ICON_SIZE - 6 }}
          />
        </Button>
      );
    } else if (
      props.recordStatus === 'NOT_RECORDING' ||
      props.recordStatus === 'NOT_STARTED' ||
      props.recordStatus === 'RECORDING_COMPLETE'
    ) {
      return (
        <Button
          rounded
          danger
          style={buttonStyle}
          onPress={props.onStartRecordingPress}
        >
          <Icon
            type="FontAwesome"
            name="microphone"
            color="white"
            style={{ fontSize: ICON_SIZE }}
          />
        </Button>
      );
    } else if (props.recordStatus === 'ERROR') {
      return (
        <Button rounded warning style={buttonStyle} onPress={() => {}}>
          <Icon
            type="FontAwesome"
            name="exclamation-triangle"
            color="white"
            style={{ fontSize: ICON_SIZE -10 }}
          />
        </Button>
      );
    } else {
      console.warn(
        `GetRecordButtonByStatus: unknown recordStatus ${props.recordStatus}`
      );
      return (
        <Button rounded warning style={buttonStyle} onPress={() => {}}>
          <Icon
            type="FontAwesome"
            name="question-circle"
            color="white"
            style={{ fontSize: ICON_SIZE }}
          />
        </Button>
      );
    }
  }
};

export default GetRecordButtonByStatus;
