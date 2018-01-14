import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import SoundRecorder from './SoundRecorder';
import { Constants } from 'expo';
import { RkButton } from 'react-native-ui-kitten';
import renderIf from 'render-if';
import expo from 'expo';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      soundFileInfo: 'sound file information will appear here',
      viewToShow: 'home'
    };
  }

  showRecorder = () => {
    this.setState({ viewToShow: 'recorder' });
  };
  soundRecorderComplete = (soundFileInfo) => {
    soundFileInfo =
      typeof soundFileInfo === 'object'
        ? JSON.stringify(soundFileInfo, undefined, 2)
        : soundFileInfo;

    this.setState({
      viewToShow: 'home',
      soundFileInfo
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusBar} />
        <Text
          style={{
            margin: 10,
            fontSize: 24,
            color: 'black'
          }}
        >
          Sound Recorder App
        </Text>
        {renderIf(this.state.viewToShow === 'recorder')(
          <SoundRecorder
            style={{ flex: 1 }}
            onComplete={this.soundRecorderComplete.bind(this)}
            maxDurationMillis={150000}
            completeButtonText={'Finished'}
          />
        )}
        {renderIf(this.state.viewToShow === 'home')(
          <View
            style={{
              flex: 1,
              margin: 10,
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Text
              style={{
                fontSize: 20,
                flex: 1,
                display: 'flex',
                alignSelf: 'center',
                color: 'darkblue'
              }}
            >
              {this.state.soundFileInfo}
            </Text>
            <RkButton
              rkType="stretch"
              onPress={this.showRecorder.bind(this)}
              style={{ marginVertical: 5 }}
            >
              Record Sound
            </RkButton>
          </View>
        )}
 
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
