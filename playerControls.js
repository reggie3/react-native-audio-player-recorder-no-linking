import React from 'react';
import { RkButton, RkText } from 'react-native-ui-kitten';
import { FontAwesome } from '@expo/vector-icons';

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

export const getPlayButton = (player) => {
  debugger;
  return (
    <RkButton
      rkType="success"
      style={{ ...roundButtonStyle, paddingLeft: 25 }}
      onPress={player ? player.onPlayPress : null}
    >
      <FontAwesome name="play" color="white" size={75} />
    </RkButton>
  );
};

export const playingButton = (player) => {
  return (
    <RkButton
      rkType="danger"
      style={roundButtonStyle}
      onPress={player ? player.onPausePress : null}
    >
      <FontAwesome name="pause" color="white" size={65} />
    </RkButton>
  );
};

export const errorBadge = (
  <RkButton rkType="danger" style={roundButtonStyle} onPress={() => {}}>
    <FontAwesome name="exclamation-triangle" color="red" size={65} />
  </RkButton>
);

export const goBackButton = (player) => {
  return (
    <RkButton
      rkType="success stretch"
      style={{ marginVertical: 5 }}
      onPress={() => {
        this.onComplete;
        player ? player.stopPlaying() : null;
      }}
    >
      <RkText>Go Back</RkText>
    </RkButton>
  );
};
