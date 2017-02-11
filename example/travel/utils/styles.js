import { StyleSheet, Platform } from 'react-native';
import { colors } from './colors';

export let iStyles = StyleSheet.create({
	scrollContainer: {
		backgroundColor: '#ededed',
	},
	container: {
		flex: 1,
		backgroundColor: '#ededed',
	},
	dualHeadingContainer: {
		flexDirection: 'row',
	},
	dualHeadingTitle: {
		flex: 1,
	},
	dualHeadingCommand: {
		paddingLeft: 10,
		paddingRight: 10,
		height: 70,
		justifyContent: 'center',
		alignItems: 'center',
	},
	headingText: {
		color: '#444',
		fontSize: 16,
		fontWeight: '300',
		padding: 15,
		paddingLeft: 10,
	},
	headingTextContinued: {
		color: '#444',
		fontSize: 16,
		fontWeight: '300',
		padding: 15,
		paddingLeft: 10,
		paddingBottom: 0,
	},
	subheadingText: {
		color: '#444',
		fontSize: 12,
		fontWeight: '300',
		paddingTop: 5,
		paddingBottom: 15,
		paddingLeft: 10
	},
	pureHeadingText: {
		color: '#444',
		fontSize: 12,
		fontWeight: '300',
	},
	sectionContainer: {
		backgroundColor: 'white',
	},
	sectionContainerSpaced: {
		backgroundColor: 'white',
		minHeight: 120,
	},
	dropdownContainer: {
		flexDirection: 'row',
		borderBottomColor: '#efefef',
		borderBottomWidth: 1,
	},
	dropdownTitle: {
		flex: 1,
	},
	dropdownIcon: {
		paddingLeft: 10,
		paddingRight: 10,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
	},
	dialogContentContainer: {
		paddingLeft: 15, paddingRight: 15,
	},
	dialogCommandContainer: {
		borderTopWidth: 1,
		borderColor: '#f2f2f2',
		flexDirection: 'row',
	},
	dialogCommandButtonContainer: {
		flex: 1,
	}
});

export let baseStyles = {
	text: {
		backgroundColor: 'transparent',
		color: colors.text,
		paddingLeft: 10,
	}
};
