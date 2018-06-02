
import { Audio,   } from 'expo';

export const completeButtonText = 'Finished';

export const audioMode = {
  allowsRecordingIOS: true,
  interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
  playsInSilentModeIOS: true,
  playsInSilentLockedModeIOS: true,
  shouldDuckAndroid: true,
  interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
};

export const prepareToRecordParams = Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY

export const timeStampStyle = {
    color: 'blue',
    fontSize: 24
}

