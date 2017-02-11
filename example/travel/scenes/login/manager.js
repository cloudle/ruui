import { nativeRouteAction } from '../../../../src/utils/route';
import { register } from '../../utils/routes';

export function navigateLogin () {
	this.props.dispatch(nativeRouteAction.push(register));
}