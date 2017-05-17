import type  {
	NavigationAnimatedValue
} from './NavigationTypeDefinition';

class NavigationAnimatedValueSubscription {
	_value: NavigationAnimatedValue;
	_token: string;

	constructor(value: NavigationAnimatedValue, callback: Function) {
		this._value = value;
		this._token = value.addListener(callback);
	}

	remove(): void {
		this._value.removeListener(this._token);
	}
}

export default NavigationAnimatedValueSubscription;
