import { Platform, Dimensions } from 'react-native';

export let ScreenSize = Dimensions.get('window');

export function ScreenWidthPadding (padding, maxSize): Number {
	let paddedSize = ScreenSize.width - (padding * 2);
	return paddedSize > maxSize ? maxSize : paddedSize;
}

export function isTouchDevice() {
	if (['android', 'ios'].indexOf(Platform.OS) >= 0) {
		return true;
	} else {
		try {
			document.createEvent("TouchEvent");
			return true;
		} catch (e) {
			return false;
		}
	}
}