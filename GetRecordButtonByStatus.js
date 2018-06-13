import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { RkButton } from 'react-native-ui-kitten';

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

const GetRecordButtonByStatus = (props) => {
  if (props.playStatus === 'PLAYING') {
    return (
      <RkButton rkType="disabled" style={buttonStyle} onPress={() => {}}>
        <FontAwesome name="microphone" color="white" size={ICON_SIZE} />
      </RkButton>
    );
  } else {
    if (props.recordStatus === 'RECORDING') {
      return (
        <RkButton
          rkType="danger"
          style={buttonStyle}
          onPress={props.onStopRecordingPress}
        >
          <FontAwesome name="stop" color="white" size={ICON_SIZE} />
        </RkButton>
      );
    }
    if (props.playStatus === 'BUFFERING' || props.playStatus === 'LOADING') {
      return (
        <RkButton
        rkType='disabled'
          style={buttonStyle}
          onPress={() => {}}
        >
          <FontAwesome name="hourglass" color="white" size={ICON_SIZE} />
        </RkButton>
      );
    } else if (
      props.recordStatus === 'NOT_RECORDING' ||
      props.recordStatus === 'NOT_STARTED' ||
      props.recordStatus === 'RECORDING_COMPLETE'
    ) {
      return (<RkButton
        rkType="success"
        style={buttonStyle}
        onPress={props.onStartRecordingPress}
      >
        <FontAwesome name="microphone" color="white" size={ICON_SIZE} />
      </RkButton>);
    } else if (props.recordStatus === 'ERROR') {
      return (
        <RkButton rkType="danger" style={buttonStyle} onPress={() => {}}>
          <FontAwesome name="exclamation-triangle" color="white" size={ICON_SIZE} />
        </RkButton>
      );
    } else {
        console.warn(`GetRecordButtonByStatus: unknown recordStatus ${props.recordStatus}`)
      return (
        <RkButton rkType="danger" style={buttonStyle} onPress={() => {}}>
          <FontAwesome name="question-circle" color="white" size={ICON_SIZE} />
        </RkButton>
      );
    }
  }
};

export default GetRecordButtonByStatus;
