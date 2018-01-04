# React Native Sound Recorder (No Native)

## A simple drop in sound recorder component for react native applications.

[![npm](https://img.shields.io/npm/v/react-native-sound-recorder-no-native.svg)](https://www.npmjs.com/package/react-native-sound-recorder-no-native)
[![npm](https://img.shields.io/npm/dm/react-native-sound-recorder-no-native.svg)](https://www.npmjs.com/package/react-native-sound-recorder-no-native)
[![npm](https://img.shields.io/npm/dt/react-native-sound-recorder-no-native.svg)](https://www.npmjs.com/package/react-native-sound-recorder-no-native)
[![npm](https://img.shields.io/npm/l/react-native-sound-recorder-no-native.svg)](https://github.com/react-native-component/react-native-sound-recorder-no-native/blob/master/LICENSE)

## Why Use This?

This module is useful if you need a drop in sound recording component for an application in which using platform specific native code is prohibited; for example an application created using expo.io.

## Why Not Use This?

You are not restricted from using native code, and can find a better module to use.

## Installation

npm install --save react-native-sound-recorder-no-native

## Usage

This package can be used to create both an editor and a viewer

### Example

~~~
 <SoundRecorder
    style={{ flex: 1 }}
    onComplete={this.soundRecorderComplete.bind(this)}
    maxDurationMillis={150000}
    completeButtonText={'Finished'}
/>
~~~

This component accepts the following props:
| Name                   | type |Required | Default    | Description |
| ---------------------- | ------------- | ----------- |
|onComplete|function | yes| none| callback function executed when the user presses the finish recording button.  Is passed sound file information (see below)|
|maxDurationMillis|number| no | 999999999999 | maximum length of the recording in milliseconds|
|completeButtonText| string| no | finished | text dsplayed on the button that executes the onComplete callback|
|audioMode| object | no |  ~~~allowsRecordingIOS: false,
interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
playsInSilentModeIOS: true,
playsInSilentLockedModeIOS: true,
shouldDuckAndroid: true,
interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX~~~| an set of key value pairs used to customize recording see [Expo documentation](https://docs.expo.io/versions/latest/sdk/audio.html)|
|timeStampStyle| object | no |  ~~~{
    color: 'blue',
    fontSize: 40
}~~~ | style of the timestamp displayed while playing and recording|
|showTimeStamp|boolean|no|true|determines whether or not to display timestamp|