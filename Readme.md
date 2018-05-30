# React Native Sound Recorder (No Native)

## A simple drop in sound recorder component for react native applications.  
This module makes extensive use of the Expo.io Audio SDK located [here](https://docs.expo.io/versions/latest/sdk/audio.html).  It includes a sensible set of audio setup defaults, but can be customised using the information contained in the expo.io documentation.

[![npm](https://img.shields.io/npm/v/react-native-sound-recorder-no-native.svg)](https://www.npmjs.com/package/react-native-sound-recorder-no-native)
[![npm](https://img.shields.io/npm/dm/react-native-sound-recorder-no-native.svg)](https://www.npmjs.com/package/react-native-sound-recorder-no-native)
[![npm](https://img.shields.io/npm/dt/react-native-sound-recorder-no-native.svg)](https://www.npmjs.com/package/react-native-sound-recorder-no-native)
[![npm](https://img.shields.io/npm/l/react-native-sound-recorder-no-native.svg)](https://github.com/react-native-component/react-native-sound-recorder-no-native/blob/master/LICENSE)

## Why Use This?

This module is useful if you need drop in sound recorder or player components for an application in which using platform specific native code is prohibited; for example an application created using expo.io.

## Why Not Use This?

You are not restricted from using native code, and can find a better module to use.

## Installation

`npm install --save react-native-sound-recorder-no-native`

## Usage

`import { Recorder, Player} from 'react-native-sound-recorder-no-native';`

### Example

~~~
 <Recorder
    style={{ flex: 1 }}
    onComplete={this.soundRecorderComplete.bind(this)}
    maxDurationMillis={150000}
    completeButtonText={'Finished'}
    showDebug={false}
/>

<Player
    style={{ flex: 1 }}
    onComplete={this.playerComplete.bind(this)}
    completeButtonText={'Return Home'}
    uri={AUDIO_CLIP_URL}
    showDebug={true}
/>
~~~

This component accepts the following props:

| Name                  | Type     | Default                                             | Description                                                                                                                        |
| --------------------- | -------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | undefined |
| onComplete for the Recorder Component(Recorder : required) | function | none                                                | callback function executed when the user presses the finish recording button.  Is passed sound file information (see below)        |
| onComplete for the Player Component ( : required) | function | none                                                | callback function executed when the user presses the finished playing button       |
| maxDurationMillis (Recorder Only)    | number   | 600000 (10 miniutes)                                | maximum length of the recording in milliseconds                                                                                    |
| completeButtonText   | string   | finished                                            | text dsplayed on the button that executes the onComplete callback                                                                  |
| audioMode  (Recorder ONly)           | object   | see below                                           | a set of key value pairs used to customize recording see [Expo documentation](https://docs.expo.io/versions/latest/sdk/audio.html) |
| timeStampStyle        | object   | <pre>{<br>color: 'blue',<br>fontSize: 40<br>}</pre> | style of the timestamp displayed while playing and recording                                                                       |
| showTimeStamp         | boolean  | true                                                | determines whether or not to display timestamp                                                                                     |
| showDebug             | boolean  | false                                               | shows debug related items in a view on the recorder screen                                                                         |
|uri (Player Only) | string | true | URI of the sound to be played |

### Sound Clip information returned by the Recorder component
The onComplete callback receives an object similiar to the following
~~~
"size":115824,
"modificationTime":1515107376,
"uri":"file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540reggie3%252Freact-native-expo-sound-recorder/Audio/recording-20cfc766-faba-47cf-9914-8fc81b149012.m4a",
"isDirectory":false,
"exists":true,
"durationMillis": 34535
~~~

### Default Audio Mode Object
<pre>allowsRecordingIOS:true<br>interruptionModeIOS:<br>Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,<br>playsInSilentModeIOS: true,<br>playsInSilentLockedModeIOS: true,<br>shouldDuckAndroid: true,<br>interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX</pre>
