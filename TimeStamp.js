import React from 'react';
import { Text, View } from 'react-native';
import BlinkView from 'react-native-blink-view';

const TimeStamp = (props) => {
  const getPlaybackTimestamp = () => {
    if (
      this.sound != null &&
      props.positionMillis != null &&
      props.durationMillis != null
    ) {
      return `${this.getMMSSFromMillis(
        props.positionMillis
      )} / ${getMMSSFromMillis(props.durationMillis)}`;
    }
    return '';
  };

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

  let timeStampText = getPlaybackTimestamp();
  let timeStampComponent = (
    <Text style={props.timeStampStyle}>{timeStampText}</Text>
  );

  if (!props.blink) {
    return (
      <View>
        <Text>Hello</Text>
        {timeStampComponent}
      </View>
    );
  } else {
    return (
      <View>
        <Text>Hello</Text>
        <BlinkView blinking={true} delay={750}>
          {timeStampComponent}
        </BlinkView>
      </View>
    );
  }
};

export default TimeStamp;
