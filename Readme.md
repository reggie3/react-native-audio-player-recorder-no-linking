# React Native Sound Audio Player Recorder No Linking

## This package provide audio recorder and player components that you can drop into your application.  It does not require linking to native code, so it is suitable for React Native applications built using Expo.

### This package replaces and expands on the react-native-sound-recorder-no-native package.

This module makes extensive use of the Expo.io Audio SDK located [here](https://docs.expo.io/versions/latest/sdk/audio.html).  It includes a sensible set of audio setup defaults, but can be customized using the information contained in the expo.io documentation.

[![npm](https://img.shields.io/npm/v/react-native-audio-player-recorder-no-linking.svg)](https://www.npmjs.com/package/react-native-audio-player-recorder-no-linking)
[![npm](https://img.shields.io/npm/dm/react-native-audio-player-recorder-no-linking.svg)](https://www.npmjs.com/package/react-native-audio-player-recorder-no-linking)
[![npm](https://img.shields.io/npm/dt/react-native-audio-player-recorder-no-linking.svg)](https://www.npmjs.com/package/react-native-audio-player-recorder-no-linking)
[![npm](https://img.shields.io/npm/l/react-native-audio-player-recorder-no-linking.svg)](https://github.com/react-native-component/react-native-audio-player-recorder-no-linking/blob/master/LICENSE)

## Why Use This?

This module is useful if you need  drop in sound recorder or player components for an application in which using platform specific native code is prohibited; for example an application created using expo.io.

## Why Not Use This?

You are not restricted from using native code, and can find a better module to use.

## Installation

`npm install --save react-native-audio-player-recorder-no-linking`

## Usage

`import {Recorder, Player} from 'react-native-audio-player-recorder-no-linking';`

### Example

#### Recorder

```javascript
 <Recorder
    style={{ flex: 1 }}
    onComplete={this.recorderComplete}
    maxDurationMillis={150000}
    showDebug={true}
    showBackButton={true}
    audioMode={{
        allowsRecordingIOS: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        playsInSilentLockedModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid:
        Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false
    }}
    resetButton={(renderProps) => {
        return (
        <Button
            onPress={renderProps.onPress}
            danger
            block
            style={{ marginVertical: 5 }}
        >
            <Text>Reset</Text>
        </Button>
        );
    }}
    recordingCompleteButton={(renderProps) => {
        return (
            <Button
                onPress={renderProps.onPress}
                block
                success
                style={{ marginVertical: 5 }}
            >
                <Text>Finish</Text>
            </Button>
            );
    }}
    playbackSlider={(renderProps) => {
        console.log({'maximumValue: ': renderProps.maximumValue});
        return (
        <Slider
            minimimValue={0}
            maximumValue={renderProps.maximumValue}
            onValueChange={renderProps.onSliderValueChange}
            value={renderProps.value}
            style={{
            width: '100%'
            }}
        />
        );
    }}
/>
```

This component accepts the following props:

| Name                   | Type |  Default | Description |
| ---------------------- | ---- | -------- | ----------- |
| onComplete   | function |  none | callback function executed when the user presses the finish recording button.  Is passed sound file information (see below) |
| maxDurationMillis | number|  600000 (10 miniutes) | maximum length of the recording in milliseconds |
| audioMode | object |  see below | a set of key value pairs used to customize recording see [Expo documentation](https://docs.expo.io/versions/latest/sdk/audio.html) |
| timeStampStyle | object |  <pre>{<br>color: 'blue',<br>fontSize: 40<br>}</pre> | Object containing the style of the timestamp text that is displayed while playing and recording |
| showTimeStamp | boolean | true |determines whether or not to display timestamp |
| showDebug | boolean | false |shows debug related items in a view on the recorder screen |
| showBackButton | boolean | true | show a button the user can press to execute the onComplete function |

### Sound Clip information returned by this component

The onComplete callback receives an object similiar to the following
```javascript
"size":115824,
"modificationTime":1515107376,
"uri":"file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540reggie3%252Freact-native-expo-sound-recorder/Audio/recording-20cfc766-faba-47cf-9914-8fc81b149012.m4a",
"isDirectory":false,
"exists":true,
"durationMillis": 34535
```

### Default Audio Mode Object

<pre>allowsRecordingIOS:true<br>interruptionModeIOS:<br>Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,<br>playsInSilentModeIOS: true,<br>playsInSilentLockedModeIOS: true,<br>shouldDuckAndroid: true,<br>interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX</pre>

#### Player

```javascript
 <Player
    style={{ flex: 1 }}
    onComplete={this.playerComplete.bind(this)}
    completeButtonText={'Return Home'}
    uri={AUDIO_CLIP_URL}
    showDebug={true}
    showBackButton={true}
    playbackSlider={(renderProps) => {
        return (
        <Slider
            minimimValue={0}
            maximumValue={renderProps.maximumValue}
            onValueChange={renderProps.onSliderValueChange}
            value={renderProps.value}
            style={{
            width: '100%'
            }}
        />
        );
    }}
/>
```

| Name                   | Type |  Default | Description |
| ---------------------- | ---- | -------- | ----------- |
| onComplete   | function |  none | function called when user presses the complete button |
| completeButtonText | string|  finished | The text that is dsplayed on the button that executes the onComplete callback |
| timeStampStyle | object |  <pre>{<br>color: 'blue',<br>fontSize: 40<br>}</pre> | Object containing the style of the timestamp text that is displayed while playing and recording |
| showTimeStamp | boolean | true |determines whether or not to display timestamp |
| uri | string | none | URI location of the sound file to be played
| showDebug | boolean | false |shows debug related items in a view on the recorder screen |
| showBackButton | boolean | true | show a button the user can press to execute the onComplete function |

### Customize the UI

The Record and Play buttons badges can be customized by altering the package's GetRecordButtonByStatus and GetPlayButtonByStatus files.  Both of these files return default components displayed by the Recorder and Player components, respectively.  The default UI components make use of the UI Kitten library for buttons and FontAwesome for icons.

## Changelog

### 1.0.0

* User can pass controls for the playback slider, finish & reset buttons as render props.

### 0.1.0

* Updated UI

### 0.0.1

* First released version with basic functionality
* Replaces and expands upon react-native-sound-recorder-no-native package and library

## LICENSE

MIT