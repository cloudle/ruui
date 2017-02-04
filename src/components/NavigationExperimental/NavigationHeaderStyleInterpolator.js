import { I18nManager } from 'react-native';

import type  {
  NavigationSceneRendererProps,
} from './NavigationTypeDefinition';

/**
 * Utility that builds the style for the navigation header.
 *
 * +-------------+-------------+-------------+
 * |             |             |             |
 * |    Left     |   Title     |   Right     |
 * |  Component  |  Component  | Component   |
 * |             |             |             |
 * +-------------+-------------+-------------+
 */

function forLeft(props: NavigationSceneRendererProps): Object {
  const {position, scene} = props;
  const {index} = scene;
  return {
    opacity: position.interpolate({
      inputRange: [ index - 1, index, index + 1 ],
      outputRange: ([ 0, 1, 0 ]: Array<number>),
    }),
  };
}

function forCenter(props: NavigationSceneRendererProps): Object {
  const {position, scene} = props;
  const {index} = scene;
  return {
    opacity:position.interpolate({
      inputRange: [ index - 1, index, index + 1 ],
      outputRange: ([ 0, 1, 0 ]: Array<number>),
    }),
    transform: [
      {
        translateX: position.interpolate({
          inputRange: [ index - 1, index + 1 ],
          outputRange: I18nManager.isRTL ?
            ([ -200, 200 ]: Array<number>) :
            ([ 200, -200 ]: Array<number>),
        }),
      }
    ],
  };
}

function forRight(props: NavigationSceneRendererProps): Object {
  const {position, scene} = props;
  const {index} = scene;
  return {
    opacity: position.interpolate({
      inputRange: [ index - 1, index, index + 1 ],
      outputRange: ([ 0, 1, 0 ]: Array<number>),
    }),
  };
}

module.exports = {
  forCenter,
  forLeft,
  forRight,
};
