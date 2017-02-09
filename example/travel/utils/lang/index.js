import english from './eng';
import japanese from './jp';
import vietnamese from './vi';

export function localize(lang = 'jp') {
	switch (lang.toLowerCase()) {
		case 'jp':
			return japanese;
		case 'vi':
			return vietnamese;
		default:
			return english;
	}
}