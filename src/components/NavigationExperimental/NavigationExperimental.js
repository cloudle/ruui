import NavigationCard from './NavigationCard';
import NavigationCardStack from './NavigationCardStack';
import NavigationHeader from './NavigationHeader';
import NavigationPropTypes from './NavigationPropTypes';
import NavigationStateUtils from './NavigationStateUtils';
import NavigationTransitioner from './NavigationTransitioner';

export const NavigationExperimental = {
  // Core
  StateUtils: NavigationStateUtils,

  // Views
  Transitioner: NavigationTransitioner,

  // CustomComponents:
  Card: NavigationCard,
  CardStack: NavigationCardStack,
  Header: NavigationHeader,

  PropTypes: NavigationPropTypes,
};

export default NavigationExperimental;
