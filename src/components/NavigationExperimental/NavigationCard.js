import React, { PropTypes } from 'react';
import { Animated, StyleSheet } from 'react-native';

import NavigationCardStackPanResponder from './NavigationCardStackPanResponder';
import NavigationCardStackStyleInterpolator from './NavigationCardStackStyleInterpolator';
import NavigationPagerPanResponder from './NavigationPagerPanResponder';
import NavigationPagerStyleInterpolator from './NavigationPagerStyleInterpolator';
import NavigationPointerEventsContainer from './NavigationPointerEventsContainer';
import NavigationPropTypes from './NavigationPropTypes';

import type  {
  NavigationPanPanHandlers,
  NavigationSceneRenderer,
  NavigationSceneRendererProps,
} from './NavigationTypeDefinition';

type Props = NavigationSceneRendererProps & {
  onComponentRef: (ref: any) => void,
  onNavigateBack: ?Function,
  panHandlers: ?NavigationPanPanHandlers,
  pointerEvents: string,
  renderScene: NavigationSceneRenderer,
  style: any,
};

/**
 * Component that renders the scene as card for the <NavigationCardStack />.
 */
class NavigationCard extends React.Component<any, Props, any> {
  props: Props;

  static propTypes = {
    ...NavigationPropTypes.SceneRendererProps,
    onComponentRef: PropTypes.func.isRequired,
    onNavigateBack: PropTypes.func,
    panHandlers: NavigationPropTypes.panHandlers,
    pointerEvents: PropTypes.string.isRequired,
    renderScene: PropTypes.func.isRequired,
    style: PropTypes.any,
  };

  render(): React.Element<any> {
    const {
      panHandlers,
      pointerEvents,
      renderScene,
      style,
      ...props /* NavigationSceneRendererProps */
    } = this.props;

    const viewStyle = style === undefined ?
      NavigationCardStackStyleInterpolator.forHorizontal(props) :
      style;

    const viewPanHandlers = panHandlers === undefined ?
      NavigationCardStackPanResponder.forHorizontal({
        ...props,
        onNavigateBack: this.props.onNavigateBack,
      }) :
      panHandlers;

    return (
      <Animated.View
        {...viewPanHandlers}
        pointerEvents={pointerEvents}
        ref={this.props.onComponentRef}
        style={[styles.main, viewStyle]}>
        {renderScene(props)}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#E9E9EF',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    // shadowColor: 'black',
    // shadowOffset: {width: 0, height: 0},
    // shadowOpacity: 0.4,
    // shadowRadius: 10,
    top: 0,
  },
});

NavigationCard = NavigationPointerEventsContainer.create(NavigationCard);

NavigationCard.CardStackPanResponder = NavigationCardStackPanResponder;
NavigationCard.CardStackStyleInterpolator = NavigationCardStackStyleInterpolator;
NavigationCard.PagerPanResponder = NavigationPagerPanResponder;
NavigationCard.PagerStyleInterpolator = NavigationPagerStyleInterpolator;

export default NavigationCard;
