import { Platform } from 'react-native';
import tinyColorImport from 'tinycolor2';

export const tinyColor = tinyColorImport;

export const os = Platform.OS;
export const isServer = !!(typeof module !== 'undefined' && module.exports);
export const isIos = os === 'ios';
export const isBrowser = !isServer && os === 'web';
export const isAndroid = os === 'android';

export * from './colors';
export * from './helpers';
export * from './screen';
export * from './icons';