import { Platform } from 'react-native';
import tinyColorImport from 'tinycolor2';

export const tinyColor = tinyColorImport;

export const os = Platform.OS;
export const isWeb = os === 'web';
export const isServer = isWeb && typeof window === 'undefined';
export const isBrowser = isWeb && !isServer;
export const isIos = os === 'ios';
export const isAndroid = os === 'android';

export * from './colors';
export * from './helpers';
export * from './screen';
export * from './icons';