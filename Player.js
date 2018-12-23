import React, { Component } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Button, Text } from 'native-base';
import { Audio } from 'expo';
import PropTypes from 'prop-types';
import PlayTimeStamp from './PlayTimeStamp';
import PlaybackSlider from './PlaybackSlider';
import GetPlayButtonByStatus from './GetPlayButtonByStatus';

const initialState = {
  isLoaded: false,
  isBuffering: 'NOT_STARTED',
  playStatus: 'LOADING', // LOADING, BUFFERING, PAUSED, STOPPED, PLAYING

  // legacy items
  isPlaying: false,
  durationMillis: 0,
  playbackMillis: 0,
  maxSliderValue: 0,
  currentSliderValue: 0,
  debugStatements: 'debug info will appear here'
};
export default class Player extends Component {
  constructor(props) {
    super(props);
    this.sound = null;
    this.state = {
      ...initialState
    };
  }

  componentDidMount = () => {
    this.loadSound();
  };

  loadSound = async () => {
    let sound = new Audio.Sound();
    try {
      sound.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
      let soundInfo = await sound.loadAsync({ uri: this.props.uri });
      this.setState({
        maxSliderValue: soundInfo.durationMillis,
        durationMillis: soundInfo.durationMillis,
        positionMillis: soundInfo.positionMillis,
        currentSliderValue: soundInfo.positionMillis,
        shouldPlay: soundInfo.shouldPlay,
        isPlaying: soundInfo.isPlaying,
        rate: soundInfo.rate,
        muted: soundInfo.isMuted,
        volume: soundInfo.volume,
        shouldCorrectPitch: soundInfo.shouldCorrectPitch,
        isPlaybackAllowed: true
      });
      this.sound = sound;
    } catch (error) {
      // An error occurred!
      console.warn(`Player.js loadSound error : ${error}`);
    }
  };

  addDebugStatement = (statement) => {
    this.setState({
      debugStatements: this.state.debugStatements.concat(`- ${statement}\n`)
    });
  };

  componentWillUnmount = () => {
    this.setState({ ...initialState });
    this.sound.setOnPlaybackStatusUpdate(null);
  };
  /*
  Function used to update the UI during playback
  Playback Status Order:
  1. isLoaded: false
  2. isLoaded: true, isBuffering: true, duration 1st available
  3. isloaded: true, isBuffering: false
  */
  onPlaybackStatusUpdate = (playbackStatus) => {
    let that = this;
    this.setState({
      prevPlaybackStatus: that.state.playbackStatus,
      playbackStatus: playbackStatus
    });

    if (playbackStatus.error) {
      this.setState({ playBackStatus: 'ERROR' });
      this.addDebugStatement(
        `Encountered a fatal error during playback: ${playbackStatus.error}
        Please report this error as an issue.  Thank you!`
      );
    }

    if (playbackStatus.isLoaded) {
      // don't care about buffering if state.playStatus is equal to one of the other states
      // state.playStatus can only be equal to one of the other states after buffer
      // has completed, at which point state.playStatus is set to 'STOPPED'
      if (
        this.state.playStatus !== 'PLAYING' &&
        this.state.playStatus !== 'PAUSED' &&
        this.state.playStatus !== 'STOPPED' &&
        this.state.playStatus !== 'ERROR'
      ) {
        if (playbackStatus.isLoaded && !this.state.isLoaded) {
          this.setState({ isLoaded: true });
          this.addDebugStatement(`playbackStatus.isLoaded`);
        }
        if (this.state.isLoaded && playbackStatus.isBuffering) {
          this.setState({
            playStatus: 'BUFFERING'
          });
          this.addDebugStatement(`playbackStatus.isBuffering IN_PROGRESS`);
        }
        if (
          this.state.isLoaded &&
          !playbackStatus.isBuffering &&
          playbackStatus.hasOwnProperty('durationMillis')
        ) {
          this.setState({
            playStatus: 'STOPPED'
          });
          this.addDebugStatement(`playbackStatus.isBuffering COMPLETE`);
        }
      }

      // Update the UI for the loaded state
      if (playbackStatus.isPlaying) {
        this.addDebugStatement(
          `playbackStatus.positionMillis (here): ${
            playbackStatus.positionMillis
          }`
        );

        // Update  UI for the playing state
        this.setState({
          positionMillis: playbackStatus.positionMillis,
          currentSliderValue: playbackStatus.positionMillis
        });
      }

      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
        this.addDebugStatement('playbackStatus is stopped');
        this.setState({
          playStatus: 'STOPPED',
          isPlaying: false,
          positionMillis: playbackStatus.durationMillis,
          currentSliderValue: playbackStatus.durationMillis
        });
      }
    }
  };

  onSliderValueChange = (value) => {
    // set the postion of the actual sound object
    this.addDebugStatement(`onSliderValueChange: ${value}`);
    this.sound.setPositionAsync(value);
  };

  onPausePress = () => {
    if (this.sound != null) {
      this.sound.pauseAsync().then(() => {
        this.setState({ playStatus: 'PAUSED' });
      });
    }
  };

  onPlayPress = () => {
    if (this.sound != null) {
      if (this.state.positionMillis === this.state.durationMillis) {
        this.sound.stopAsync().then(() => {
          this.sound.playAsync().then(() => {
            this.setState({ playStatus: 'PLAYING' });
          });
        });
      } else {
        // just play from wherever we are
        this.sound
          .playAsync()
          .then(() => {
            this.setState({ playStatus: 'PLAYING' });
          })
          .catch((err) => {
            console.warn(`Player.js onPlayPress error: ${err}`);
          });
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this.props.showTimeStamp ? (
          <PlayTimeStamp
            playStatus={this.state.playStatus}
            sound={this.sound}
            positionMillis={this.state.positionMillis}
            durationMillis={this.state.durationMillis}
            timeStampStyle={this.props.timeStampStyle}
          />
        ) : null}
        <GetPlayButtonByStatus
          playStatus={this.state.playStatus}
          onPlayPress={this.onPlayPress.bind(this)}
          onPausePress={this.onPausePress.bind(this)}
        />

        {this.props.showPlaybackSlider ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              margin: 5,
              width:'100%'

            }}
          >
           {this.props.playbackSlider({
              maximumValue: this.state.maxSliderValue,
              onValueChange: this.onSliderValueChange,
              value: this.state.currentSliderValue,
              onSlidingComplete: this.onSlidingComplete,
            })}
            {/* <PlaybackSlider
              maximumValue={this.state.maxSliderValue}
              onValueChange={this.onSliderValueChange}
              value={this.state.currentSliderValue}
              sliderStyle={this.props.sliderStyle}
              thumbStyle={this.props.thumbStyle}
            /> */}
          </View>
        ) : null}

        <View style={{ alignSelf: 'stretch' }}>
          {this.props.showBackButton ? (
            <Button
              success
              block
              style={{ marginVertical: 5 }}
              onPress={this.props.onComplete}
            >
              <Text>{this.props.completeButtonText}</Text>
            </Button>
          ) : null}

          {this.props.showDebug ? (
            <ScrollView
              style={{
                backgroundColor: '#FAFAD2',
                height: 150,
                padding: 5,
                borderWidth: 0.5,
                borderColor: '#d6d7da'
              }}
            >
              <Text style={{ color: 'darkblue' }}>
                {this.state.debugStatements}
              </Text>
            </ScrollView>
          ) : null}
        </View>
      </View>
    );
  }
}

Player.propTypes = {
  onComplete: PropTypes.func,
  completeButtonText: PropTypes.string,
  audioMode: PropTypes.object,
  timeStampStyle: PropTypes.object,
  showTimeStamp: PropTypes.bool,
  showPlaybackSlider: PropTypes.bool,
  showDebug: PropTypes.bool,
  showBackButton: PropTypes.bool,
  sliderProps: PropTypes.shape({
    onSlidingComplete: PropTypes.function,
    onValueChange: PropTypes.function,
    minimumTrackTintColor: PropTypes.string,
    maximumTrackTintColor: PropTypes.string,
    thumbTintColor: PropTypes.string,
    maximumTrackImage: PropTypes.string,
    minimumTrackImage: PropTypes.string,
    thumbImage: PropTypes.string,
    trackImage: PropTypes.string
  })
};

Player.defaultProps = {
  audioMode: {
    allowsRecordingIOS: true,
    interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
    playsInSilentModeIOS: true,
    playsInSilentLockedModeIOS: true,
    shouldDuckAndroid: true,
    interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    playThroughEarpieceAndroid: false
  },
  completeButtonText: 'Finished',
  timeStampStyle: {
    color: 'white',
    fontSize: 24
  },
  showTimeStamp: true,
  showPlaybackSlider: true,
  showDebug: false,
  showBackButton: true,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});
