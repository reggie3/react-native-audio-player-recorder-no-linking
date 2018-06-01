import 'expo';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import Recorder from './Recorder';
import Player from './Player';
import { Constants } from 'expo';
import { RkButton, RkText } from 'react-native-ui-kitten';

const AUDIO_CLIP_URL = encodeURI(
"http://res.cloudinary.com/tourystory/video/upload/v1516221224/audioclips/eaffcf76b6cbf5032634150b69286ccab489e66040b0508d81f2ce0478a41036-a987f707-552d-eeea-baea-2b1731b429a0.mp4");
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
  showPlayer = () => {
    this.setState({ viewToShow: 'player' });
  };

  recorderComplete = (soundFileInfo) => {
    soundFileInfo =
      typeof soundFileInfo === 'object'
        ? JSON.stringify(soundFileInfo, undefined, 2)
        : soundFileInfo;

    this.setState({
      viewToShow: 'home',
      soundFileInfo
    });
  };

  playerComplete = () => {
    this.setState({
      viewToShow: 'home',
    });
  };

  uploadCallback = (message) => {
    console.log(`uploadCallback: ${message}`);
  };

  renderScreen =()=>{
    if(this.state.viewToShow === 'recorder'){
      return (<View
        style={{
          display: 'flex',
          flex: 1
        }}
      >
        <RkText>Sound Recorder</RkText>
        <Recorder
          style={{ flex: 1 }}
          onComplete={this.recorderComplete.bind(this)}
          maxDurationMillis={150000}
          completeButtonText={'Finished'}
          showDebug={true}
        />
      </View>)
    }
   else if(this.state.viewToShow === 'player'){
      return (<View
        style={{
          display: 'flex',
          flex: 1
        }}
      >
        <RkText>Sound Player</RkText>
        <Player
          style={{ flex: 1 }}
          onComplete={this.playerComplete.bind(this)}
          completeButtonText={'Return Home'}
          uri={AUDIO_CLIP_URL}
          showDebug={true}
        />
      </View>
    )}
    else if(this.state.viewToShow ==='home'){
      return (
        <View
            style={{
              flex: 1,
              margin: 10,
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <RkText
              style={{
                fontSize: 20,
                flex: 1,
                display: 'flex',
                alignSelf: 'center',
                color: 'darkblue'
              }}
            >
              {this.state.soundFileInfo}
            </RkText>
            <RkButton
              rkType="stretch"
              onPress={this.showRecorder}
              style={{ marginVertical: 5 }}
            >
              Record Sound
            </RkButton>
            <RkButton
              rkType="stretch"
              onPress={this.showPlayer}
              style={{ marginVertical: 5 }}
            >
              Play Music
            </RkButton>
            <RkButton
              rkType="stretch success"
              onPress={this.uploadSound}
              style={{ marginVertical: 5 }}
            >
              Upload Sound
            </RkButton>
          </View>
      )
    }
    else
    return null
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusBar} />
        <RkText
          style={{
            margin: 10,
            fontSize: 24,
            color: 'black'
          }}
        >
          Sound Demo App
        </RkText>
       
        <View
          style={{
            backgroundColor: 'lightblue',
            padding: 5,
            display: 'flex',
            flex: 1
          }}>
         {this.renderScreen()}
        </View>

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
