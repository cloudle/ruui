import { Platform, Dimensions } from 'react-native';

export const ScreenSize = Dimensions.get('window');

export function screenWidthPadding(padding, maxSize): Number {
	const paddedSize = ScreenSize.width - (padding * 2);
	return paddedSize > maxSize ? maxSize : paddedSize;
}

/**
 * @deprecated Since version 0.0.76.
 * Will be deleted in version 0.1.0. Use screenWidthPadding (camelCase) instead.
 */
export const ScreenWidthPadding = screenWidthPadding;

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