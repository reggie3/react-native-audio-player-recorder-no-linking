import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import SoundRecorder from './SoundRecorder';

export default class App extends Component {
  soundRecorderComplete = audioFileInfo => {
    console.log(audioFileInfo);
    debugger;
  };

  render() {
    return (
      <View style={styles.container}>
      <Text>Sound Recorder App</Text>
      <SoundRecorder
          onComplete={this.soundRecorderComplete}
          maxDurationMillis={5000}
          completeButtonText={'Finished'}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#eee'
  }

});
