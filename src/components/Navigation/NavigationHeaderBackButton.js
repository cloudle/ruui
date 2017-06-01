import React from 'react';
import ReactNative, {
	I18nManager,
	Image,
	Platform,
	StyleSheet,
	TouchableOpacity
} from 'react-native';

type Props = {
	onPress: Function,
};

const backArrow = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAeElEQVR4Ae2UJxJCQRBEW3FCFAoUDkXcQD7OvyHhkcZhu1btqxo5eab1T6dTGCsz6MhIdioTJe5KoMJMVhJTZR4R/Ooey1yJ5zd4pshKZqEEYSs5+QaM4N9EVjIlgj+/IwqaJ2g/Iv+S25+p4dEyFwXtpcIudp3OC08lc/MlMM5BAAAAAElFTkSuQmCC';

const NavigationHeaderBackButton = (props: Props) => (
	<TouchableOpacity style={styles.buttonContainer} onPress={props.onPress}>
		<Image style={styles.button} source={{ uri: backArrow }}/>
	</TouchableOpacity>
);

NavigationHeaderBackButton.propTypes = {
	onPress: React.PropTypes.func.isRequired
};

const styles = StyleSheet.create({
	buttonContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	button: {
		height: 24,
		width: 24,
		margin: new Set(['ios', 'web']).has(Platform.OS) ? 10 : 16,
		resizeMode: 'contain',
		transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
	}
});

export default NavigationHeaderBackButton;
