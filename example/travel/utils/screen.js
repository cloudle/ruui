import { Dimensions } from 'react-native';

export let ScreenSize = Dimensions.get('window');

export function ScreenWidthPadding (padding, maxSize): Number {
	let paddedSize = ScreenSize.width - (padding * 2);
	return paddedSize > maxSize ? maxSize : paddedSize;
}