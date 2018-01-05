import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { RkButton, RkStyleSheet } from 'react-native-ui-kitten';
import { FontAwesome } from '@expo/vector-icons';
import Expo, { Audio, FileSystem, Permissions } from 'expo';
import Slider from 'react-native-slider';
import PropTypes from 'prop-types';
import * as defaultProps from './defaults';
import BlinkView from 'react-native-blink-view';
import renderIf from 'render-if';

const GetRecordingButtonByStatus = props => {
  if (props.isRecording) {
    return (
      <View>
        <RkButton
          rkType="danger"
          style={styles.roundButton}
          onPress={props.onPress}
        >
          <FontAwesome name="stop" color="white" size={65} />
        </RkButton>
      </View>
    );
  } else if (props.isRecordingComplete) {
    return (
      <View>
        <RkButton style={[styles.roundButton, { backgroundColor: 'gray' }]}>
          <FontAwesome name="microphone" color="white" size={75} />
        </RkButton>
      </View>
    );
  } else {
    return (
      <View>
        <RkButton
          rkType="success"
          style={styles.roundButton}
          onPress={props.onPress}
        >
          <FontAwesome name="microphone" color="white" size={75} />
        </RkButton>
      </View>
    );
  }
};

const GetPlayButtonByStatus = props => {
  // console.log(props.playbackStatus, ' - rendering play button');
  if (!props.isRecordingComplete) {
    return (
      <View>
        <RkButton
          style={[
            styles.roundButton,
            { backgroundColor: 'gray', paddingLeft: 25 }
          ]}
          onPress={() => {
            console.log('do nothing');
          }}
        >
          <FontAwesome name="play" color="white" size={75} />
        </RkButton>
      </View>
    );
  } else {
    if (props.playbackStatus === 'playing') {
      return (
        <View>
          <RkButton
            rkType="danger"
            style={styles.roundButton}
            onPress={props.onPress}
          >
            <FontAwesome name="pause" color="white" size={65} />
          </RkButton>
        </View>
      );
    } else if (
      props.playbackStatus === 'stopped' ||
      props.playbackStatus === 'paused'
    ) {
      return (
        <View>
          <RkButton
            rkType="success"
            style={[styles.roundButton, { paddingLeft: 25 }]}
            onPress={props.onPress}
          >
            <FontAwesome name="play" color="white" size={75} />
          </RkButton>
        </View>
      );
    } else if (props.playbackStatus === 'buffering' || !props.playbackStatus) {
      return (
        <View>
          <RkButton
            style={[styles.roundButton, { backgroundColor: 'gray' }]}
            onPress={props.onPress}
          >
            <FontAwesome name="hourglass" color="white" size={65} />
          </RkButton>
        </View>
      );
    } else {
      return (
        <View>
          <Text>Uncaught playback status</Text>
          <Text>status = {props.playbackStatus}</Text>
        </View>
      );
    }
  }
};

const TimeStamp = props => {
  /* 
  the 'call' statements below binds 'this' to the SoundRecorder class
  I used this technique vice pulling out the relevant functions becasue
  I  knew that would work, and didn't want to incur risk by
  deviating from Expo's example too much
   */
  if (props.showTimeStamp) {
    if (props.isRecording) {
      let recordTimeStamp = props.recordTimeStamp.call(props.parent);
      return (
        <BlinkView blinking={true} delay={500}>
          <Text style={[props.timeStampStyle, { color: 'red' }]}>
            {recordTimeStamp}
          </Text>
        </BlinkView>
      );
    }

    if (props.playbackStatus === 'playing') {
      let playbackTimeStamp = props.playbackTimeStamp.call(props.parent);
      return <Text style={props.timeStampStyle}>{playbackTimeStamp}</Text>;
    } else if (props.playbackStatus === 'paused') {
      let playbackTimeStamp = props.playbackTimeStamp.call(props.parent);
      return (
        <BlinkView blinking={true} delay={750}>
          <Text style={props.timeStampStyle}>{playbackTimeStamp}</Text>
        </BlinkView>
      );
    } else {
      let recordingDurationTimestamp = props.recordingDurationTimestamp.call(
        props.parent
      );
      return (
        <Text style={props.timeStampStyle}>{recordingDurationTimestamp}</Text>
      );
    }
  } else {
    return null;
  }
};
const PlaybackBar = props => {
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

export default class SoundRecorder extends Component {
  constructor(props) {
    super(props);
    const { height, width } = Dimensions.get('window');
    this.progressBarWidth = width * 0.9;
    this.sound = null;
    this.recording = null;
    this.state = {
      isRecording: false,
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
    this.recordingSettings = JSON.parse(
      JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY)
    );
  }

  componentDidMount() {
    // ask for permissions to use the device's audio
    this.askForPermissions();
    this.componentIsMounted = true;
  }

  addDebugStatement = (statement)=>{
    this.setState({debugStatements: this.state.debugStatements.concat(`${statement}\n`)})
  }

  askForPermissions = async () => {
    const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.setState({
      haveRecordingPermissions: response.status === 'granted'
    });
  };

  // TODO: fix this function being called
  // after the component has been unmounted
  updateScreenForSoundStatus = status => {
    // if (this.componentIsMounted) {
    if (status.isLoaded) {
      let updatedPlaybackStatus = undefined;
      if (status.isPlaying) {
        updatedPlaybackStatus = 'playing';
      } else if (!status.isPlaying) {
        updatedPlaybackStatus = 'stopped';
      } else if (status.isBuffering === true) {
        updatedPlaybackStatus = 'buffering';
      } else {
        // console.log('unknown status');
      }

      // console.log('status.positionMillis: ', status.positionMillis);
      this.setState({
        maxSliderValue: status.durationMillis,
        positionMillis: status.positionMillis,
        currentSliderValue: status.positionMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        rate: status.rate,
        muted: status.isMuted,
        volume: status.volume,
        shouldCorrectPitch: status.shouldCorrectPitch,
        isPlaybackAllowed: true,
        playbackStatus: updatedPlaybackStatus
      });
    } else {
      this.setState({
        soundDuration: null,
        isPlaybackAllowed: false
      });

      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
    //  }
  };

  // update the status and progress of recording
  updateScreenForRecordingStatus = status => {
    if (status.canRecord) {
      this.setState({
        isRecording: status.isRecording,
        recordingDuration: status.durationMillis,
        currentSliderValue: status.durationMillis
      });
      // console.log('canRecord: ', status.durationMillis);
    } else if (status.isDoneRecording) {
      this.setState({
        isRecording: false,
        recordingDuration: status.durationMillis,
        isRecordingComplete: true
      });
      // console.log('isDoneRecording: ', status.durationMillis);

      if (!this.state.isLoading) {
        this.stopRecordingAndEnablePlayback();
      }
    }
  };

  /*
  Record sound
   */
  async stopPlaybackAndBeginRecording() {
    this.setState({
      isLoading: true
    });
    // check to see if there is already a sound object loaded
    if (this.sound !== null) {
      try {
        await this.sound.unloadAsync().then(() => {
          // console.log('******** sound unloaded ********');
        });
      } catch (error) {
        // console.log('Error: unloadAsync ', error);
      }
      this.sound.setOnPlaybackStatusUpdate(null);
      this.sound = null;
    }

    try {
      await Audio.setAudioModeAsync(this.props.audioMode);
      if (this.recording !== null) {
        this.recording.setOnRecordingStatusUpdate(null);
        this.recording = null;
      }
    } catch (error) {
      // console.log('Error: setAudioModeAsync ', error);
    }

    const recording = new Audio.Recording();
    try {
      await recording.prepareToRecordAsync(this.props.prepareToRecordParams);
      await recording.setProgressUpdateInterval(100);
      await recording.startAsync(); // Will call this._updateScreenForRecordingStatus to update the screen.
    } catch (error) {
      // console.log('Error: startAsync: ', error);
    }
    this.setState({ maxSliderValue: this.props.maxDurationMillis });
    recording.setOnRecordingStatusUpdate(this.updateScreenForRecordingStatus);

    this.recording = recording;

    this.setState({
      isLoading: false
    });
  }

  /*
  Stop recording, enable playback, and write sound file information to redux store
   */
  async stopRecordingAndEnablePlayback() {
    this.setState({
      isLoading: true
    });
    try {
      await this.recording.stopAndUnloadAsync();
      console.log(' +++ unloading +++');
    } catch (error) {
      // console.log('Error: stopAndUnloadAsync', error);
    }

    let info;
    try {
      info = await FileSystem.getInfoAsync(this.recording.getURI());
    } catch (error) {
      // console.log('Error: FileSystem.getInfoAsync', error);
    }

    // console.log(`FILE INFO: ${JSON.stringify(info)}`);

    try {
      await Audio.setAudioModeAsync(this.props.audioMode);
    } catch (error) {
      // console.log('Error: Audio.setAudioModeAsync', error);
    }

    // now that recording is complete, create and load a new sound object
    // to save to component state so that it can be played back later
    try {
      const { sound, status } = await this.recording.createNewLoadedSound(
        null,
        this.updateScreenForSoundStatus
      );
      this.setState({
        soundFileInfo: { ...info, durationMillis: status.durationMillis }
      });
      // connect the playback status function to this sound
      //sound.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
      this.setState({
        positionMillis: status.positionMillis,
        durationMillis: status.durationMillis,
        maxSliderValue: status.durationMillis,
        currentSliderValue: 0
        // playbackStatus: 'stopped'
      });
      this.sound = sound;
    } catch (error) {
      // console.log('Error: createNewLoadedSound', error);
    }
    this.setState({
      isLoading: false
    });
  }

  /*
  Function used to update the UI during playback
  */
  onPlaybackStatusUpdate = playbackStatus => {
    if (!playbackStatus.isLoaded) {
      // Update your UI for the unloaded state
      if (playbackStatus.error) {
        console.log(
          `Encountered a fatal error during playback: ${playbackStatus.error}
          Please report this error as an issue.  Thank you!`
        );
        // Send Expo team the error on Slack or the forums so we can help you debug!
      }
    } else {
      // Update the UI for the loaded state
      if (playbackStatus.isPlaying) {
        console.log(
          'playbackStatus.positionMillis (here): ',
          playbackStatus.positionMillis
        );

        // Update  UI for the playing state
        this.setState({
          playbackStatus: 'playing',
          positionMillis: playbackStatus.positionMillis,
          currentSliderValue: playbackStatus.positionMillis
        });
      } else {
        if (
          this.state.playbackStatus !== 'stopped' &&
          this.state.playbackStatus !== 'buffering'
        ) {
          // Update your UI for the paused state
          console.log('playbackStatus is paused');
          this.setState({
            playbackStatus: 'paused',
            positionMillis: playbackStatus.positionMillis,
            currentSliderValue: playbackStatus.positionMillis
          });
        }
      }

      if (playbackStatus.isBuffering) {
        // Update your UI for the buffering state
        console.log('playbackStatus is buffering');
        this.setState({ playbackStatus: 'buffering' });
      }

      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
        console.log('playbackStatus is stopped');
        this.setState({
          playbackStatus: 'stopped',
          isPlaying: false
        });
      }
    }
  };

  getMMSSFromMillis(millis) {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = number => {
      const string = number.toString();
      if (number < 10) {
        return '0' + string;
      }
      return string;
    };
    return padWithZero(minutes) + ':' + padWithZero(seconds);
  }

  getRecordingDurationTimestamp() {
    if (this.state.isRecordingComplete) {
      return this.getMMSSFromMillis(this.state.durationMillis);
    }
    return '00:00';
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

  getRecordingTimestamp() {
    if (this.state.recordingDuration != null) {
      return `${this.getMMSSFromMillis(this.state.recordingDuration)}`;
    }
    return `${this.getMMSSFromMillis(0)}`;
  }

  resetPressed = () => {
    this.resetRecordingState();
  };

  resetRecordingState = () => {
    this.sound = null;
    this.recording = null;
    this.setState({
      isRecording: false,
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
      soundFileInfo: 'no info yet'
    });
  };

  // perform this action when the user presses the "done" key
  onComplete = async () => {
    // need to check if sound has been set to null in case the user
    // has recorded soemthing, then did a reset, and then clicks the finish button
    if (this.sound !== null) {
      try {
        await this.sound.unloadAsync().then(() => {
          // console.log('******** sound unloaded ********');
          this.props.onComplete(this.state.soundFileInfo);
        });
      } catch (error) {
        console.log('Error: unloadAsync ', error);
      }
      // clear the status update object if the sound hasn't already been set to null
      if (this.sound.hasOwnProperty('setOnPlaybackStatusUpdate')) {
        this.sound.setOnPlaybackStatusUpdate(null);
      }
      this.sound = null;
    } else {
      // only get here if the user has never tried to click record or
      // did a reset
      this.props.onComplete(this.state.soundFileInfo);
    }
  };

  onSliderValueChange = value => {
    // set the postion of the actual sound object
    console.log('onSliderValueChange: ', value);
    this.sound.setPositionAsync(value);
  };

  onRecordPressed = () => {
    if (this.state.isRecording) {
      this.stopRecordingAndEnablePlayback();
    } else {
      this.stopPlaybackAndBeginRecording();
    }
  };

  onPlayPausePressed = () => {
    if (this.sound != null) {
      if (this.state.playbackStatus === 'playing') {
        this.sound.pauseAsync().then(() => {
          this.setState({ isPlaying: false, playbackStatus: 'paused' });
        });
      } else if (this.state.playbackStatus === 'stopped') {
        // check to see if the entire audio has finished playing, and if so
        // reset to the beginning and play it
        if (this.state.positionMillis === this.state.durationMillis) {
          this.sound.stopAsync().then(() => {
            this.sound.playAsync().then(() => {
              this.setState({ isPlaying: true, playbackStatus: 'playing' });
            });
          });
        } else {
          // just play from wherever we are
          this.sound.playAsync().then(() => {
            this.setState({ isPlaying: true, playbackStatus: 'playing' });
          });
        }
      } else if (this.state.playbackStatus === 'paused') {
        this.sound.playAsync().then(() => {
          this.setState({ isPlaying: true, playbackStatus: 'playing' });
        });
      } else {
        /* console.log(
          'Error onPlayPausePressed: unhandled state.playbackStatus = ',
          this.state.playbackStatus
        ); */
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <GetRecordingButtonByStatus
          onPress={this.onRecordPressed}
          isRecording={this.state.isRecording}
          isRecordingComplete={this.state.isRecordingComplete}
        />

        <GetPlayButtonByStatus
          isPlaying={this.state.isPlaying}
          isRecordingComplete={this.state.isRecordingComplete}
          playbackStatus={this.state.playbackStatus}
          onPress={this.onPlayPausePressed}
        />
        <PlaybackBar
          maximumValue={this.state.maxSliderValue}
          onValueChange={this.onSliderValueChange}
          value={this.state.currentSliderValue}
          width={this.progressBarWidth}
        />
        <TimeStamp
          playbackTimeStamp={this.getPlaybackTimestamp}
          recordTimeStamp={this.getRecordingTimestamp}
          recordingDurationTimestamp={this.getRecordingDurationTimestamp}
          playbackStatus={this.state.playbackStatus}
          timeStampStyle={this.props.timeStampStyle}
          isPlaying={this.state.isPlaying}
          isRecording={this.state.isRecording}
          isRecordingComplete={this.state.isRecordingComplete}
          parent={this}
          showTimeStamp={this.props.showTimeStamp}
        />
        <View style={{ alignSelf: 'stretch' }}>
          <RkButton
            rkType="danger stretch"
            onPress={this.resetPressed.bind(this)}
            style={{ marginVertical: 5 }}
          >
            Reset
          </RkButton>
          <RkButton
            rkType="success stretch"
            onPress={this.onComplete.bind(this)}
            style={{ marginVertical: 5 }}
          >
            {this.props.completeButtonText}
          </RkButton>
          {renderIf(this.props.showDebug)(
            <View style={{ backgroundColor: 'goldenrod' }}>
              <Text style={{ color: 'darkblue' }}>
                {this.state.debugStatements}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}

SoundRecorder.propTypes = {
  onComplete: PropTypes.func.isRequired,
  maxDurationMillis: PropTypes.number,
  completeButtonText: PropTypes.string,
  audioMode: PropTypes.object,
  timeStampStyle: PropTypes.object,
  showTimeStamp: PropTypes.bool,
  showDebug: PropTypes.bool
};

SoundRecorder.defaultProps = {
  audioMode: defaultProps.audioMode,
  completeButtonText: defaultProps.completeButtonText,
  prepareToRecordParams: defaultProps.prepareToRecordParams,
  maxDurationMillis: 600000,
  timeStampStyle: defaultProps.timeStampStyle,
  showTimeStamp: true,
  showDebug: false
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10
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
