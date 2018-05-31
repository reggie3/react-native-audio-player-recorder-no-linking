import React from 'react';
import { RkButton, RkText, RkTheme } from 'react-native-ui-kitten';
import { FontAwesome } from '@expo/vector-icons';

RkTheme.setType('RkButton', 'disabled', {
  container: {
    backgroundColor: 'lightgray'
  },
  content: {
    color: 'white'
  }
});

const roundButtonStyle = {
  borderRadius: 50,
  width: 100,
  height: 100,
  alignSelf: 'center'
};
export const loadingButton = (
  <RkButton
    style={{
      ...roundButtonStyle,
      backgroundColor: 'gray'
    }}
    onPress={() => {}}
  >
    <FontAwesome name="hourglass" color="white" size={65} />
  </RkButton>
);

export const playButton = (recorder) => {
  debugger;
  return (
    <RkButton
      rkType="success"
      style={{ ...roundButtonStyle, paddingLeft: 25 }}
      onPress={recorder ? recorder.onPlayPress : null}
    >
      <FontAwesome name="play" color="white" size={75} />
    </RkButton>
  );
};

export const playingButton = (recorder) => {
  return (
    <RkButton
      rkType="danger"
      style={roundButtonStyle}
      onPress={recorder ? recorder.onPausePress : null}
    >
      <FontAwesome name="pause" color="white" size={65} />
    </RkButton>
  );
};

export const stopRecordingButton = (recorder) => {
  return (
    <RkButton
      rkType="danger"
      style={roundButtonStyle}
      onPress={recorder ? recorder.onStopRecordingPress : null}
    >
      <FontAwesome name="stop" color="white" size={65} />
    </RkButton>
  );
};
export const startRecordingButton = (recorder) => {
  return (
    <RkButton
      rkType="success"
      style={roundButtonStyle}
      onPress={recorder.onPress}
    >
      <FontAwesome name="microphone" color="white" size={75} />
    </RkButton>
  );
};

export const disabledRecordingButton = () => {
  return (
    <RkButton rkType="disabled" style={roundButtonStyle} onPress={() => {}}>
      <FontAwesome name="microphone" color="white" size={75} />
    </RkButton>
  );
};
export const disabledPlayButton = () => {
  debugger;
  return (
    <RkButton
      rkType="disabled"
      style={{ ...roundButtonStyle, paddingLeft: 25 }}
      onPress={() => {}}
    >
      <FontAwesome name="play" color="white" size={75} />
    </RkButton>
  );
};

export const errorBadge = (
  <RkButton rkType="danger" style={roundButtonStyle} onPress={() => {}}>
    <FontAwesome name="exclamation-triangle" color="red" size={65} />
  </RkButton>
);

export const goBackButton = (recorder, onComplete) => {
  return (
    <RkButton
      rkType="success stretch"
      style={{ marginVertical: 5 }}
      onPress={() => {
        onComplete();
        recorder ? recorder.stopPlaying() : null;
      }}
    >
      <RkText>Go Back</RkText>
    </RkButton>
  );
};
