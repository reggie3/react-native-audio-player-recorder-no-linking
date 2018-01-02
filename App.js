import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import SoundRecorder from './SoundRecorder';
import { Constants } from 'expo';
import { RkButton, RkText } from 'react-native-ui-kitten';


export default class App extends Component {
  soundRecorderComplete = audioFileInfo => {
    console.log(audioFileInfo);
    debugger;
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusBar} />
        <RkText style={{margin: 10}}
        rkType='xxlarge'>Sound Recorder App</RkText>
        <SoundRecorder
          onComplete={this.soundRecorderComplete}
          maxDurationMillis={150000}
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
  },
  statusBar: {
    backgroundColor: '#C2185B',
    height: Constants.statusBarHeight
  }
});
