import React from 'react';
import {View, StyleSheet} from 'react-native';
import Slider from 'react-native-slider'

const PlaybackSlider = (props) => {
  debugger;
  return (
    <View style={sliderStyles.container}>
      <Slider
        trackStyle={sliderStyles.track}
        thumbStyle={sliderStyles.thumb}
        minimumTrackTintColor="#ec4c46"
        minimimValue={0}
        maximumValue={props.maximumValue}
        value={props.value}
        onSlidingComplete={props.onValueChange}
      />
    </View>
  );
};
  
  export default PlaybackSlider;

  const sliderStyles = StyleSheet.create({
    container: {
      flex: 1,
      marginLeft: 10,
      marginRight: 10,
      alignItems: 'stretch',
      justifyContent: 'center'
    },
    track: {
      height: 18,
      borderRadius: 1,
      backgroundColor: '#d5d8e8'
    },
    thumb: {
      width: 20,
      height: 30,
      borderRadius: 1,
      backgroundColor: '#838486'
    }
  });
  