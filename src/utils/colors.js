import tinyColor from 'tinycolor2';

const main = '#F0871A';
const lighterMain = tinyColor(main).lighten(15).toHexString();
const darkerMain = tinyColor(main).darken(10).toHexString();

export let colors = {
	main,
	darkerMain,
	lighterMain,
	danger: '#ff8142',
	blue: '#2196F3',
	orange: '#FF9800',
	green: '#8daf7e',
	text: '#444444',
};
