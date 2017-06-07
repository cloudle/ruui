import Intro from './scenes/intro';
import Welcome from './scenes/welcome';
import Login from './scenes/login';

export default {
	Index: {
		component: Welcome,
	},
	Welcome: {
		component: Intro,
	},
	Login: {
		component: Login,
	},
};