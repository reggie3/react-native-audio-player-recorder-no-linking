import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import Slider from 'react-native-slider';


const PlaybackSlider = (props) => {
    console.log(props.value)
    return (
      <View
        style={{
          height: 60,
          width: props.sliderWidth,
          backgroundColor: 'purple'
        }}
      >
        <Slider
          trackStyle={sliderStyles.track}
          thumbStyle={sliderStyles.thumb}
          minimumTrackTintColor="#ec4c46"
          minimimValue={0}
          maximumValue={props.maximumValue}
          value={props.value}
          onSlidingComplete={props.onSliderValueChange}
        />
      </View>
    );
  };

  export default PlaybackSlider

  const sliderStyles = StyleSheet.create({
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
  