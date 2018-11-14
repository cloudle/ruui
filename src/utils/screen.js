import { Platform, Dimensions } from 'react-native';

export const ScreenSize = Dimensions.get('window');

export function screenWidthPadding(padding, maxSize): Number {
	const paddedSize = ScreenSize.width - (padding * 2);
	return paddedSize > maxSize ? maxSize : paddedSize;
}

export function horizontalPaddings(padding, maxSize): Number {
	const paddedSize = ScreenSize.width - (padding * 2);
	return paddedSize > maxSize ? { width: maxSize, } : {
		width: paddedSize,
		marginLeft: padding, marginRight: padding,
	};
}

export function horizontalSnappings(padding, minSize): Number {
	const paddedSize = ScreenSize.width - (padding * 2);
	return paddedSize > minSize ? {
		width: minSize,
		marginLeft: padding, marginRight: padding,
	} : { width: ScreenSize.width };
}

export function isTouchDevice() {
	if (['android', 'ios'].indexOf(Platform.OS) >= 0) {
		return true;
	} else {
		try {
			document.createEvent('TouchEvent');
			return true;
		} catch (e) {
			return false;
		}
	}
}
