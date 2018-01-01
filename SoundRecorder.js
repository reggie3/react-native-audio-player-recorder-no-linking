import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { RkButton, RkStyleSheet, RkText } from 'react-native-ui-kitten';
import { FontAwesome } from '@expo/vector-icons';
import Expo, { Audio, FileSystem, Permissions } from 'expo';
import Slider from "react-native-slider";

const GetRecordingButtonByStatus = props => {
  if (props.isRecording) {
    return (
      <View>
        <RkButton
          rkType="danger"
          style={styles.roundButton}
          onPress={this._onRecordPressed}
        >
          <FontAwesome name="stop" color="white" size={65} />
        </RkButton>
      </View>
    );
  } else {
    return (
      <View>
        <RkButton
          rkType="success"
          style={styles.roundButton}
          onPress={this._onRecordPressed}
        >
          <FontAwesome name="microphone" color="white" size={75} />
        </RkButton>
      </View>
    );
  }
};

const GetPlayButtonByStatus = props => {
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
    if (props.isPlaying) {
      return (
        <View>
          <RkButton
            rkType="danger"
            style={styles.roundButton}
            onPress={this._onPlayPausePressed}
          >
            <FontAwesome name="stop" color="white" size={65} />
          </RkButton>
        </View>
      );
    } else {
      return (
        <View>
          <RkButton
            rkType="success"
            style={[styles.roundButton, { paddingLeft: 25 }]}
            onPress={this._onPlayPausePressed}
          >
            <FontAwesome name="play" color="white" size={75} />
          </RkButton>
        </View>
      );
    }
  }
};

const PlaybackBar = props => {
  return (
    <View>
      <Slider
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
    this.state = {
      isRecording: false,
      durationMillis: 0,
      playbackMillis: 0,
      isLoading: false,
      recordingInformation: {},
      isRecordingComplete: false,
      playbackStatus: ''
    };
  }

  componentDidMount() {
    // ask for permissions to use the device's audio
    this.askForPermissions();
  }

  askForPermissions = async () => {
    const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.setState({
      haveRecordingPermissions: response.status === 'granted'
    });
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
        await this.sound.unloadAsync();
      } catch (error) {
        debugger;
        console.log('Error: unloadAsync ', error);
      }
      this.sound.setOnPlaybackStatusUpdate(null);
      this.sound = null;
    }

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
      });
      if (this.recording !== null) {
        this.recording.setOnRecordingStatusUpdate(null);
        this.recording = null;
      }
    } catch (error) {
      debugger;
      console.log('Error: setAudioModeAsync ', error);
    }

    const recording = new Audio.Recording();
    try {
      await recording.prepareToRecordAsync(this.recordingSettings);
    } catch (error) {
      debugger;
      console.log('Error: prepareToRecordAsync ', error);
    }
    recording.setOnRecordingStatusUpdate(this._updateScreenForRecordingStatus);

    this.recording = recording;
    try {
      await this.recording.startAsync(); // Will call this._updateScreenForRecordingStatus to update the screen.
    } catch (error) {
      debugger;
      console.log('Error: startAsync ', error);
    }
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
    } catch (error) {
      debugger;
      console.log('Error: stopAndUnloadAsync', error);
    }

    let info;
    try {
      info = await FileSystem.getInfoAsync(this.recording.getURI());
    } catch (error) {
      debugger;
      console.log('Error: FileSystem.getInfoAsync', error);
    }

    console.log(`FILE INFO: ${JSON.stringify(info)}`);
    try {
      await Audio.setAudioModeAsync();
    } catch (error) {
      debugger;
      console.log('Error: Audio.setAudioModeAsync', error);
    }

    // now that recording is complete, create a load a new sound object
    // to save to component state so that it can be played back later
    try {
      const { sound, status } = await this.recording.createNewLoadedSound(
        null,
        this._updateScreenForSoundStatus
      );

      // connect the playback status function to this sound
      sound.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
      debugger;
      this.setState({
        positionMillis: status.positionMillis,
        durationMillis: status.durationMillis
      });
      this.props.dispatch(
        actions.createStoryActions.saveAudioClipData({
          ...info,
          ...{ durationMillis: status.durationMillis }
        })
      );
      this.sound = sound;
    } catch (error) {
      debugger;
      console.log('Error: createNewLoadedSound', error);
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
          `Encountered a fatal error during playback: ${playbackStatus.error}`
        );
        // Send Expo team the error on Slack or the forums so we can help you debug!
      }
    } else {
      // Update your UI for the loaded state

      if (playbackStatus.isPlaying) {
        // Update your UI for the playing state
        console.log(
          'playbackStatus.isPlaying: ',
          playbackStatus.positionMillis
        );
        this.setState({
          playbackStatus: 'playing',
          positionMillis: playbackStatus.positionMillis
        });
        debugger;
      } else {
        // Update your UI for the paused state
        console.log('playbackStatus is paused');
        this.setState({
          playbackStatus: 'paused',
          positionMillis: playbackStatus.positionMillis
        });
      }

      if (playbackStatus.isBuffering) {
        // Update your UI for the buffering state
        console.log('playbackStatus is buffering');
        this.setState({ playbackStatus: 'buffering' });
      }

      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
        console.log('playbackStatus is buffering');
        this.setState({
          playbackStatus: 'stopped',
          positionMillis: playbackStatus.positionMillis
        });

        // The player has just finished playing and will stop. Maybe you want to play something else?
      }
    }
  };

  updateScreenForSoundStatus = status => {
    if (status.isLoaded) {
      this.setState({
        soundDuration: status.durationMillis,
        soundPosition: status.positionMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        rate: status.rate,
        muted: status.isMuted,
        volume: status.volume,
        shouldCorrectPitch: status.shouldCorrectPitch,
        isPlaybackAllowed: true
      });
    } else {
      this.setState({
        soundDuration: null,
        soundPosition: null,
        isPlaybackAllowed: false
      });
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  // update the status and progress of recording
  updateScreenForRecordingStatus = status => {
    if (status.canRecord) {
      this.setState({
        isRecording: status.isRecording,
        recordingDuration: status.durationMillis
      });
      console.log('canRecord: ', status.durationMillis);
    } else if (status.isDoneRecording) {
      this.setState({
        isRecording: false,
        recordingDuration: status.durationMillis,
        isRecordingComplete: true
      });
      console.log('isDoneRecording: ', status.durationMillis);

      if (!this.state.isLoading) {
        this.stopRecordingAndEnablePlayback();
      }
    }
  };

  resetPressed = () => {
    this.setState({
      isRecording: false,
      recordingDuration: 0,
      isLoading: false,
      recordingInformation: {},
      isRecordingComplete: false
    });
  };

  // perform this action when the user presses the "done" key
  onComplete = () => {
    props.onComplete();
  };

  onSliderValueChange = value => {
    debugger;
  };
  render() {
    return (
      <View style={styles.container}>
        <GetRecordingButtonByStatus isRecording={this.state.isRecording} />
        <GetPlayButtonByStatus
          isPlaying={this.state.isPlaying}
          isRecordingComplete={this.state.isRecordingComplete}
          playbackStatus={this.state.playbackStatus}
        />
        <PlaybackBar
          maximumValue={this.state.durationMillis}
          onValueChange={this.onSliderValueChange}
          value={this.state.playbackMillis}
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
            onPress={this.props.onComplete.bind(this)}
            style={{ marginVertical: 5 }}
          >
            {this.props.completeButtonText}
          </RkButton>
        </View>
      </View>
    );
  }
}

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
