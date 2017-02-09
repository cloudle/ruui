import Welcome from '../scenes/welcome';
import Login from '../scenes/login';

export const initialRoute = {
	key: 'welcome',
	component: Welcome,
};

export const routes = [
	initialRoute,
	{ key: 'login', component: Login },
];