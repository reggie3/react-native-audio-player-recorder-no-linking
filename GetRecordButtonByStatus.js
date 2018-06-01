import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { RkButton } from 'react-native-ui-kitten';

const roundButtonStyle = {
  borderRadius: 50,
  width: 100,
  height: 100,
  alignSelf: 'center'
};

const GetRecordButtonByStatus = (props) => {
  if (props.playStatus === 'PLAYING') {
    return (
      <RkButton rkType="disabled" style={roundButtonStyle} onPress={() => {}}>
        <FontAwesome name="microphone" color="white" size={75} />
      </RkButton>
    );
  } else {
    if (props.recordStatus === 'RECORDING') {
      return (
        <RkButton
          rkType="danger"
          style={roundButtonStyle}
          onPress={props.onStopRecordingPress}
        >
          <FontAwesome name="stop" color="white" size={65} />
        </RkButton>
      );
    }
    if (props.playStatus === 'BUFFERING' || props.playStatus === 'LOADING') {
      return (
        <RkButton
        rkType='disabled'
          style={roundButtonStyle}
          onPress={() => {}}
        >
          <FontAwesome name="hourglass" color="white" size={65} />
        </RkButton>
      );
    } else if (
      props.recordStatus === 'NOT_RECORDING' ||
      props.recordStatus === 'NOT_STARTED' ||
      props.recordStatus === 'RECORDING_COMPLETE'
    ) {
      return (<RkButton
        rkType="success"
        style={roundButtonStyle}
        onPress={props.onStartRecordingPress}
      >
        <FontAwesome name="microphone" color="white" size={75} />
      </RkButton>);
    } else if (props.recordStatus === 'ERROR') {
      return (
        <RkButton rkType="danger" style={roundButtonStyle} onPress={() => {}}>
          <FontAwesome name="exclamation-triangle" color="white" size={55} />
        </RkButton>
      );
    } else {
      debugger;
        console.log(`GetRecordButtonByStatus: unknown recordStatus ${props.recordStatus}`)
      return (
        <RkButton rkType="danger" style={roundButtonStyle} onPress={() => {}}>
          <FontAwesome name="question-circle" color="white" size={55} />
        </RkButton>
      );
    }
  }
};

export default GetRecordButtonByStatus;
