import Welcome from '../scenes/welcome';
import Login from '../scenes/login';
import Register from '../scenes/register';

import { colors } from '../utils';

export let welcome = {
	key: 'welcome',
	component: Welcome,
};

export let login = {
	key: 'login',
	component: Login,
	hideNavigation: true,
	style: {
		backgroundColor: colors.main,
	}
};

export let register = {
	key: 'register',
	component: Register,
	transitionDirection: 'vertical',
};

export let initialRoute = login;