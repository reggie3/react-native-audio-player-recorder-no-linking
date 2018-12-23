import React, { Component } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text } from 'native-base';
import { Audio, FileSystem, Permissions } from 'expo';
import PropTypes from 'prop-types';
import PlayTimeStamp from './PlayTimeStamp';
import RecordTimeStamp from './RecordTimeStamp';
import GetPlayButtonByStatus from './GetPlayButtonByStatus';
import GetRecordButtonByStatus from './GetRecordButtonByStatus';

const initialState = {
  playStatus: 'NO_SOUND_FILE_AVAILABLE',
  recordStatus: 'NOT_STARTED',

  // legacy
  durationMillis: 0,
  playbackMillis: 0,
  positionMillis: 0,
  recordingInformation: {},
  recordingDuration: 0,
  soundDuration: 0,
  maxSliderValue: 0,
  currentSliderValue: 0,
  soundFileInfo: 'make a recording to see its information',
  debugStatements: 'debug info will appear here'
};
export default class Recorder extends Component {
  constructor(props) {
    super(props);
    this.sound = null;
    this.recording = null;
    this.state = {
      ...initialState
    };
  }

  componentDidMount() {
    // ask for permissions to use the device's audio
    this.askForPermissions();
    this.componentIsMounted = true;
  }
  componentWillUnmount = () => {
    if (this.sound) {
      this.sound.setOnPlaybackStatusUpdate(null);
    }
    if (this.recording) {
      this.recording.setOnRecordingStatusUpdate(null);
    }
  };

  addDebugStatement = (statement) => {
    this.setState({
      debugStatements: this.state.debugStatements.concat(`- ${statement}\n`)
    });
  };

  askForPermissions = async () => {
    const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.setState({
      haveRecordingPermissions: response.status === 'granted'
    });
  };

  // TODO: fix this function being called
  // after the component has been unmounted
  updateScreenForSoundStatus = (status) => {
    //
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
        this.addDebugStatement('unknown status in updateScreenForSoundStatus');
      }

      this.addDebugStatement(`status.positionMillis: ${status.positionMillis}`);
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
        this.addDebugStatement(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
    //  }
  };

  // update the status and progress of recording
  updateScreenForRecordingStatus = (status) => {
    //
    if (!status.isRecording) {
      this.setState({
        recordStatus: 'NOT_RECORDING'
      });
      this.addDebugStatement(`NOT_RECORDING: ${status.durationMillis}`);
    } else if (status.isRecording) {
      this.setState({
        recordStatus: 'RECORDING',
        recordingDuration: status.durationMillis,
        currentSliderValue: status.durationMillis
      });
      this.addDebugStatement(`RECORDING: ${status.durationMillis}`);
    } else if (status.isDoneRecording) {
      this.setState({
        recordStatus: 'RECORDING_COMPLETE',
        recordingDuration: status.durationMillis
      });
      this.addDebugStatement(`isDoneRecording: ${status.durationMillis}`);

      /* if (!this.state.isLoading) {
        this.stopRecordingAndEnablePlayback();
      } */
    }
  };

  /*
  Record sound
   */
  async stopPlaybackAndBeginRecording() {
    // check to see if there is already a sound object loaded and unload if it
    // if there is
    if (this.sound !== null) {
      try {
        this.sound.setOnPlaybackStatusUpdate(null);
        await this.sound.unloadAsync().then(() => {
          this.addDebugStatement('******** sound unloaded ********');
        });
      } catch (error) {
        this.addDebugStatement(`Error: unloadAsync ${error}`);
      }
      this.sound.setOnPlaybackStatusUpdate(null);
      this.sound = null;
    }

    // check to see if there is already a recording object loaded and unload if it
    // if there is
    try {
      await Audio.setAudioModeAsync(this.props.audioMode);
      if (this.recording !== null) {
        this.recording.setOnRecordingStatusUpdate(null);
        this.recording = null;
      }
    } catch (error) {
      this.addDebugStatement(`Error: setAudioModeAsync ${error}`);
    }

    // create a new recording object
    const recording = new Audio.Recording();
    try {
      await recording.prepareToRecordAsync(this.props.prepareToRecordParams);
      recording.setOnRecordingStatusUpdate(
        this.updateScreenForRecordingStatus.bind(this)
      );

      // await recording.setProgressUpdateInterval(100);

      await recording.startAsync();

      this.setState({
        recordStatus: 'RECORDING',
        maxSliderValue: this.props.maxDurationMillis
      });
      this.recording = recording;
    } catch (error) {
      if (error.includes) console.log(`Error: startAsync: ${error}`);
      this.addDebugStatement(`Error: startAsync: ${error}`);
      this.setState({ recordStatus: 'ERROR' });
    }
  }

  /*
  Stop recording, enable playback, and write sound file information to redux store
   */
  async stopRecordingAndEnablePlayback() {
    this.setState({
      playStatus: 'LOADING',
      recordStatus: 'BUFFERING'
    });
    // stop and unload ongoing recording
    try {
      await this.recording.stopAndUnloadAsync();
      this.recording.setOnRecordingStatusUpdate(null);
      this.addDebugStatement(' +++ unloading recording before playing +++');
      this.setState({
        playStatus: 'STOPPED',
        recordStatus: 'RECORDING_COMPLETE'
      });
    } catch (error) {
      this.addDebugStatement(`Error: stopAndUnloadAsync ${error}`);
      this.setState({
        recordStatus: 'ERROR'
      });
    }

    // get the file info
    let info;
    try {
      info = await FileSystem.getInfoAsync(this.recording.getURI());
    } catch (error) {
      this.addDebugStatement(`Error: FileSystem.getInfoAsync ${error}`);
      this.setState({
        recordStatus: 'ERROR'
      });
    }

    this.addDebugStatement(`FILE INFO: ${JSON.stringify(info)}`);

    try {
      await Audio.setAudioModeAsync(this.props.audioMode);
      this.setState({
        recordStatus: 'RECORDING_COMPLETE'
      });
    } catch (error) {
      this.addDebugStatement(`Error: Audio.setAudioModeAsync ${error}`);
      this.setState({
        recordStatus: 'ERROR'
      });
    }

    // now that recording is complete, create and load a new sound object
    // to save to component state so that it can be played back later
    try {
      const { sound, status } = await this.recording.createNewLoadedSoundAsync(
        null,
        this.onPlaybackStatusUpdate
      );
      this.setState({
        soundFileInfo: { ...info, durationMillis: status.durationMillis }
      });

      this.setState({
        positionMillis: status.positionMillis,
        durationMillis: status.durationMillis,
        maxSliderValue: status.durationMillis,
        currentSliderValue: 0
      });
      this.sound = sound;
    } catch (error) {
      this.addDebugStatement(`Error: createNewLoadedSound ${error}`);
    }
    this.setState({
      playStatus: 'STOPPED',
      recordStatus: 'RECORDING_COMPLETE'
    });
  }

  /*
  Function used to update the UI during playback
  */
  onPlaybackStatusUpdate = (playbackStatus) => {
    if (this.state.recordStatus !== 'RECORDING') {
      if (!playbackStatus.isLoaded) {
        // Update your UI for the unloaded state
        if (playbackStatus.error) {
          this.addDebugStatement(
            `Encountered a fatal error during playback: ${playbackStatus.error}
          Please report this error as an issue.  Thank you!`
          );
          // Send Expo team the error on Slack or the forums so we can help you debug!
          this.setState({
            playStatus: 'ERROR'
          });
        }
      } else {
        // Update the UI for the loaded state
        if (playbackStatus.isPlaying) {
          this.addDebugStatement(
            `playbackStatus.positionMillis (here): ${
              playbackStatus.positionMillis
            }`
          );

          // Update  UI for the playing state
          this.setState({
            playStatus: 'PLAYING',
            positionMillis: playbackStatus.positionMillis,
            currentSliderValue: playbackStatus.positionMillis
          });
        } else {
          if (
            this.state.playStatus !== 'STOPPED' &&
            this.state.playStatus !== 'BUFFERING' &&
            this.state.playStatus !== 'LOADING' &&
            this.state.playStatus !== 'NO_SOUND_FILE_AVAILABLE' &&
            this.state.playStatus !== 'PLAYING'
          ) {
            // Update your UI for the paused state
            this.addDebugStatement('playStatus is paused');
            this.setState({
              positionMillis: playbackStatus.positionMillis,
              currentSliderValue: playbackStatus.positionMillis,
              durationMillis: playbackStatus.durationMillis
            });
          }
        }

        if (playbackStatus.isBuffering) {
          // Update your UI for the buffering state
          this.addDebugStatement('playbackStatus is buffering');
          this.setState({ playStatus: 'BUFFERING' });
        }

        if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
          this.addDebugStatement('playbackStatus is stopped');
          this.setState({
            positionMillis: playbackStatus.durationMillis,
            currentSliderValue: playbackStatus.durationMillis,
            durationMillis: playbackStatus.durationMillis,
            playStatus: 'STOPPED',
            isPlaying: false
          });
        }
      }
    }
  };

  onReset = () => {
    this.resetRecordingState();
  };

  resetRecordingState = () => {
    this.sound = null;
    this.recording = null;
    this.setState({
      ...initialState
    });
  };

  // perform this action when the user presses the "done" key
  onComplete = async () => {
    // need to check if sound has been set to null in case the user
    // has recorded something, then did a reset, and then clicks the finish button
    if (this.sound !== null) {
      try {
        await this.sound.unloadAsync().then(() => {
          this.addDebugStatement('******** sound unloaded ********');
          this.props.onComplete(this.state.soundFileInfo);
        });
      } catch (error) {
        this.addDebugStatement(`Error: unloadAsync ${error}`);
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

  onSliderValueChange = (value) => {
    // set the postion of the actual sound object
    this.addDebugStatement(`onSliderValueChange: ${value}`);
    this.sound.setPositionAsync(value);
  };

  onStartRecordingPress = () => {
    this.stopPlaybackAndBeginRecording();
  };

  onStopRecordingPress = () => {
    this.stopRecordingAndEnablePlayback();
  };

  onPlayPress = () => {
    if (this.state.playStatus === 'PAUSED') {
      this.sound.playAsync().then(() => {
        this.setState({ playStatus: 'PLAYING' });
      });
    } else if (this.state.playStatus === 'STOPPED') {
      // check to see if the entire audio has finished playing, and if so
      // reset to the beginning and play it
      if (this.state.positionMillis === this.state.durationMillis) {
        this.sound.stopAsync().then(() => {
          this.sound.playAsync().then(() => {
            this.setState({ playStatus: 'PLAYING' });
          });
        });
      } else {
        // just play from wherever we are
        this.sound.playAsync().then(() => {
          this.setState({ playStatus: 'PLAYING' });
        });
      }
    } else {
      this.addDebugStatement(
        `Error onPlayPress: unexpected state.playStatus ${
          this.state.playStatus
        }`
      );
    }
  };

  onPausePress = () => {
    if (this.sound != null) {
      if (this.state.playStatus === 'PLAYING') {
        this.sound.pauseAsync().then(() => {
          this.setState({ playStatus: 'PAUSED' });
        });
      }
    }
  };

  renderTimeStamp = () => {
    if (this.state.playStatus === 'PLAYING') {
      return (
        <PlayTimeStamp
          playStatus={this.state.playStatus}
          recordStatus={this.state.recordStatus}
          sound={this.sound}
          positionMillis={this.state.positionMillis}
          durationMillis={this.state.durationMillis}
          timeStampStyle={this.props.timeStampStyle}
        />
      );
    } else if (this.state.recordStatus === 'RECORDING') {
      return (
        <RecordTimeStamp
          recordStatus={this.state.recordStatus}
          playStatus={this.state.playStatus}
          sound={this.sound}
          timeStampStyle={this.props.timeStampStyle}
          recordingDuration={this.state.recordingDuration}
        />
      );
    }
    return <Text style={this.props.timeStampStyle}> </Text>;
  };

  render() {
    return (
      <View style={styles.container}>
        {this.props.showTimeStamp ? this.renderTimeStamp() : null}
        <GetRecordButtonByStatus
          onStartRecordingPress={this.onStartRecordingPress.bind(this)}
          onStopRecordingPress={this.onStopRecordingPress.bind(this)}
          recordStatus={this.state.recordStatus}
          playStatus={this.state.playStatus}
        />

        <GetPlayButtonByStatus
          recordStatus={this.state.recordStatus}
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
            
          </View>
        ) : null}

        <View style={{ alignSelf: 'stretch' }}>
          {this.props.resetButton({
            onPress: this.onReset
          })}
          {this.props.showBackButton
            ? this.props.recordingCompleteButton({
                onPress: this.onComplete
              })
            : null}
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

Recorder.propTypes = {
  onComplete: PropTypes.func,
  maxDurationMillis: PropTypes.number,
  audioMode: PropTypes.object,
  timeStampStyle: PropTypes.object,
  showTimeStamp: PropTypes.bool,
  showPlaybackSlider: PropTypes.bool,
  showDebug: PropTypes.bool,
  showBackButton: PropTypes.bool,
  resetButton: PropTypes.func,
  recordingCompleteButton: PropTypes.func,
  playbackSlider: PropTypes.func
};

Recorder.defaultProps = {
  audioMode: {
    allowsRecordingIOS: true,
    interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
    playsInSilentModeIOS: true,
    playsInSilentLockedModeIOS: true,
    shouldDuckAndroid: true,
    interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    playThroughEarpieceAndroid: false
  },
  prepareToRecordParams: Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
  maxDurationMillis: 60000,
  timeStampStyle: {
    color: 'white',
    fontSize: 24
  },
  showTimeStamp: true,
  showPlaybackSlider: true,
  showDebug: false,
  showBackButton: true
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});
