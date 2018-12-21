import React from 'react';
import { View, StyleSheet, Slider } from 'react-native';

const PlaybackSlider = (props) => {
  return (
    <View style={sliderStyles.container}>
      <Slider
        minimimValue={0}
        maximumValue={props.maximumValue}
        value={props.value}
        onSlidingComplete={props.onSlidingComplete}
        onValueChange={props.onValueChange}
        minimumTrackTintColor={props.minimumTrackTintColor}
        maximumTrackTintColor={props.maximumTrackTintColor}
        thumbTintColor={props.thumbTintColor}
        maximumTrackImage={props.maximumTrackImage}
        minimumTrackImage={props.minimumTrackImage}
        thumbImage={props.thumbImage}
        trackImage={props.trackImage}
      />
    </View>
  );
};

export default PlaybackSlider;

const sliderStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center'
  }
});
