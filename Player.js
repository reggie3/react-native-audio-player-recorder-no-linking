import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native';
import { RkButton, RkStyleSheet } from 'react-native-ui-kitten';
import { FontAwesome } from '@expo/vector-icons';
import Expo, { Audio, FileSystem, Permissions } from 'expo';
import Slider from 'react-native-slider';
import PropTypes from 'prop-types';
import * as defaultProps from './defaults';
import BlinkView from 'react-native-blink-view';
import renderIf from 'render-if';
import diff from 'deep-diff';

const GetPlayButtonByStatus = (props) => {
  let button;
  if (props.playStatus === 'BUFFERING' || props.playStatus === 'LOADING') {
    button = (
      <RkButton
        style={[styles.roundButton, { backgroundColor: 'gray' }]}
        onPress={() => {}}
      >
        <FontAwesome name="hourglass" color="white" size={65} />
      </RkButton>
    );
  } else if (props.playStatus === 'PAUSED') {
    button = (
      <RkButton
        rkType="success"
        style={[styles.roundButton, { paddingLeft: 25 }]}
        onPress={props.onPlayPress}
      >
        <FontAwesome name="play" color="white" size={75} />
      </RkButton>
    );
  } else if (props.playStatus === 'STOPPED') {
    button = (
      <RkButton
        rkType="success"
        style={[styles.roundButton, { paddingLeft: 25 }]}
        onPress={props.onPlayPress}
      >
        <FontAwesome name="play" color="white" size={75} />
      </RkButton>
    );
  } else if (props.playStatus === 'PLAYING') {
    button = (
      <RkButton
        rkType="danger"
        style={styles.roundButton}
        onPress={props.onPausePress}
      >
        <FontAwesome name="pause" color="white" size={65} />
      </RkButton>
    );
  } else if (props.playStatus === 'ERROR') {
    button = (
      <RkButton rkType="danger" style={styles.roundButton} onPress={() => {}}>
        <FontAwesome name="exclamation-triangle" color="red" size={65} />
      </RkButton>
    );
  } else {
    debugger;
  }

  return <View>{button}</View>;
};

const TimeStamp = (props) => {
  /* 
  the 'call' statements below binds 'this' to the Player class
  I used this technique vice pulling out the relevant functions becasue
  I  knew that would work, and didn't want to incur risk by
  deviating from Expo's example too much
   */
  if (props.showTimeStamp) {


    if (props.playStatus === 'PLAYING' || props.playStatus === 'STOPPED') {
      let playbackTimeStamp = props.playbackTimeStamp.call(props.parent);
      return <Text style={props.timeStampStyle}>{playbackTimeStamp}</Text>;
    } else if (props.playStatus === 'PAUSED') {
      let playbackTimeStamp = props.playbackTimeStamp();
      return (
        <BlinkView blinking={true} delay={750}>
          <Text style={props.timeStampStyle}>{playbackTimeStamp}</Text>
        </BlinkView>
      );
    }
  } 
    return null;
  
};

const PlaybackBar = (props) => {
  return (
    <View
      style={{
        height: 60,
        width: props.width
      }}
    >
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

export default class Player extends Component {
  constructor(props) {
    super(props);
    const { height, width } = Dimensions.get('window');
    this.progressBarWidth = width * 0.9;
    this.sound = null;
    this.state = {
      isLoaded: false,
      isBuffering: 'NOT_STARTED',
      playStatus: 'LOADING', // LOADING, BUFFERING, PAUSED, STOPPED, PLAYING

      // legacy items
      isPlaying: false,
      durationMillis: 0,
      playbackMillis: 0,
      isLoading: false,
      recordingInformation: {},
      isRecordingComplete: false,
      playbackStatus: '',
      recordingDuration: null,
      soundDuration: null,
      maxSliderValue: 0,
      currentSliderValue: 0,
      soundFileInfo: 'make a recording to see its information',
      debugStatements: 'debug info will appear here'
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
      console.warn(error);
      //debugger;
    }
  };

  addDebugStatement = (statement) => {
    this.setState({
      debugStatements: this.state.debugStatements.concat(`- ${statement}\n`)
    });
  };

  componentWillUnmount = () => {
    this.setState({
      isLoaded: false,
      isBuffering: 'NOT_STARTED'
    });
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

  getMMSSFromMillis(millis) {
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
  }

  getPlaybackTimestamp() {
    if (
      this.sound != null &&
      this.state.positionMillis != null &&
      this.state.durationMillis != null
    ) {
      return `${this.getMMSSFromMillis(
        this.state.positionMillis
      )} / ${this.getMMSSFromMillis(this.state.durationMillis)}`;
    }
    return '';
  }

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
            debugger;
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
            debugger;
          });
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {
          <GetPlayButtonByStatus
            playStatus={this.state.playStatus}
            onPlayPress={this.onPlayPress.bind(this)}
            onPausePress={this.onPausePress.bind(this)}
          />
        }
        <PlaybackBar
          maximumValue={this.state.maxSliderValue}
          onValueChange={this.onSliderValueChange}
          value={this.state.currentSliderValue}
          width={this.progressBarWidth}
        />
        <TimeStamp
          playbackTimeStamp={this.getPlaybackTimestamp}
          playStatus={this.state.playStatus}
          timeStampStyle={this.props.timeStampStyle}
          parent={this}
          showTimeStamp={this.props.showTimeStamp}
        />
        <View style={{ alignSelf: 'stretch' }}>
          <RkButton
            rkType="success stretch"
            style={{ marginVertical: 5 }}
            onPress={this.props.onComplete}
          >
            {this.props.completeButtonText}
          </RkButton>

          {renderIf(this.props.showDebug)(
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
          )}
        </View>
      </View>
    );
  }
}

Player.propTypes = {
  onComplete: PropTypes.func.isRequired,
  completeButtonText: PropTypes.string,
  audioMode: PropTypes.object,
  timeStampStyle: PropTypes.object,
  showTimeStamp: PropTypes.bool,
  showDebug: PropTypes.bool
};

Player.defaultProps = {
  audioMode: defaultProps.audioMode,
  completeButtonText: defaultProps.completeButtonText,
  timeStampStyle: defaultProps.timeStampStyle,
  showTimeStamp: true,
  showDebug: false
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  roundButton: {
    borderRadius: 50,
    width: 100,
    height: 100,
    alignSelf: 'center'
  }
});

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
