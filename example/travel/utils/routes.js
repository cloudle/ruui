import Welcome from '../scenes/welcome';
import Login from '../scenes/login';

export let welcome = {
	key: 'welcome',
	component: Welcome,
};

export let login = {
	key: 'login',
	component: Login,
	hideNavigation: true
};

export let initialRoute = login;