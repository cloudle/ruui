import { Platform } from 'react-native';
import tinyColorImport from 'tinycolor2';

export const tinyColor = tinyColorImport;

export const os = Platform.OS;
export const isIos     = os === 'ios';
export const isBrowser = os === 'web';
export const isAndroid = os === 'android';

export * from './colors';
export * from './helpers';
export * from './store';
export * from './screen';