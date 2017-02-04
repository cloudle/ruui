import React, { PropTypes } from 'react';
import ReactNative, { Animated, Platform, StyleSheet, View } from 'react-native';

import NavigationHeaderTitle from './NavigationHeaderTitle';
import NavigationHeaderBackButton from './NavigationHeaderBackButton';
import NavigationPropTypes from './NavigationPropTypes';
import NavigationHeaderStyleInterpolator from './NavigationHeaderStyleInterpolator';
import ReactComponentWithPureRenderMixin from 'react/lib/ReactComponentWithPureRenderMixin';

import type  {
  NavigationSceneRendererProps,
  NavigationStyleInterpolator,
} from './NavigationTypeDefinition';

type SubViewProps = NavigationSceneRendererProps & {
  onNavigateBack: ?Function,
};

type SubViewRenderer = (subViewProps: SubViewProps) => ?React.Element<any>;

type DefaultProps = {
  renderLeftComponent: SubViewRenderer,
  renderRightComponent: SubViewRenderer,
  renderTitleComponent: SubViewRenderer,
  statusBarHeight: number | Animated.Value,
};

type Props = NavigationSceneRendererProps & {
  onNavigateBack: ?Function,
  renderLeftComponent: SubViewRenderer,
  renderRightComponent: SubViewRenderer,
  renderTitleComponent: SubViewRenderer,
  style?: any,
  viewProps?: any,
  statusBarHeight: number | Animated.Value,
};

type SubViewName = 'left' | 'title' | 'right';

const APPBAR_HEIGHT = new Set(['ios', 'web']).has(Platform.OS) ? 44 : 56;
const STATUSBAR_HEIGHT = new Set(['ios', 'web']).has(Platform.OS) ? 20 : 0;

class NavigationHeader extends React.Component<DefaultProps, Props, any> {
  props: Props;

  static defaultProps = {

    renderTitleComponent: (props: SubViewProps) => {
      const title = String(props.scene.route.title || '');
      return <NavigationHeaderTitle>{title}</NavigationHeaderTitle>;
    },

    renderLeftComponent: (props: SubViewProps) => {
      if (props.scene.index === 0 || !props.onNavigateBack) {
        return null;
      }
      return (
        <NavigationHeaderBackButton
          onPress={props.onNavigateBack}
        />
      );
    },

    renderRightComponent: (props: SubViewProps) => {
      return null;
    },

    statusBarHeight: STATUSBAR_HEIGHT,
  };

  static propTypes = {
    ...NavigationPropTypes.SceneRendererProps,
    onNavigateBack: PropTypes.func,
    renderLeftComponent: PropTypes.func,
    renderRightComponent: PropTypes.func,
    renderTitleComponent: PropTypes.func,
    style: View.propTypes.style,
    statusBarHeight: PropTypes.number,
    viewProps: PropTypes.shape(View.propTypes),
  };

  shouldComponentUpdate(nextProps: Props, nextState: any): boolean {
    return ReactComponentWithPureRenderMixin.shouldComponentUpdate.call(
      this,
      nextProps,
      nextState
    );
  }

  render(): React.Element<any> {
    const { scenes, style, viewProps } = this.props;

    const scenesProps = scenes.map(scene => {
      const props = NavigationPropTypes.extractSceneRendererProps(this.props);
      props.scene = scene;
      return props;
    });

    const barHeight = (this.props.statusBarHeight instanceof Animated.Value)
      ? Animated.add(this.props.statusBarHeight, new Animated.Value(APPBAR_HEIGHT))
      : APPBAR_HEIGHT + this.props.statusBarHeight;

    return (
      <Animated.View style={[
          styles.appbar,
          { height: barHeight },
          style
        ]}
        {...viewProps}
      >
        {scenesProps.map(this._renderLeft, this)}
        {scenesProps.map(this._renderTitle, this)}
        {scenesProps.map(this._renderRight, this)}
      </Animated.View>
    );
  }

  _renderLeft(props: NavigationSceneRendererProps): ?React.Element<any> {
    return this._renderSubView(
      props,
      'left',
      this.props.renderLeftComponent,
      NavigationHeaderStyleInterpolator.forLeft,
    );
  }

  _renderTitle(props: NavigationSceneRendererProps): ?React.Element<any> {
    return this._renderSubView(
      props,
      'title',
      this.props.renderTitleComponent,
      NavigationHeaderStyleInterpolator.forCenter,
    );
  }

  _renderRight(props: NavigationSceneRendererProps): ?React.Element<any> {
    return this._renderSubView(
      props,
      'right',
      this.props.renderRightComponent,
      NavigationHeaderStyleInterpolator.forRight,
    );
  }

  _renderSubView(
    props: NavigationSceneRendererProps,
    name: SubViewName,
    renderer: SubViewRenderer,
    styleInterpolator: NavigationStyleInterpolator,
  ): ?React.Element<any> {
    const {
      scene,
      navigationState,
    } = props;

    const {
      index,
      isStale,
      key,
    } = scene;

    const offset = navigationState.index - index;

    if (Math.abs(offset) > 2) {
      // Scene is far away from the active scene. Hides it to avoid unnecessary
      // rendering.
      return null;
    }

    const subViewProps = {...props, onNavigateBack: this.props.onNavigateBack};
    const subView = renderer(subViewProps);
    if (subView === null) {
      return null;
    }

    const pointerEvents = offset !== 0 || isStale ? 'none' : 'box-none';
    return (
      <Animated.View
        pointerEvents={pointerEvents}
        key={name + '_' + key}
        style={[
          styles[name],
          { marginTop: this.props.statusBarHeight },
          styleInterpolator(props),
        ]}>
        {subView}
      </Animated.View>
    );
  }

  static HEIGHT = APPBAR_HEIGHT + STATUSBAR_HEIGHT;
  static Title = NavigationHeaderTitle;
  static BackButton = NavigationHeaderBackButton;

}

const styles = StyleSheet.create({
  appbar: {
    alignItems: 'center',
    backgroundColor: new Set(['ios', 'web']).has(Platform.OS) ? '#EFEFF2' : '#FFF',
    borderBottomColor: 'rgba(0, 0, 0, .15)',
    borderBottomWidth: new Set(['ios', 'web']).has(Platform.OS) ? StyleSheet.hairlineWidth : 0,
    // elevation: 4,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  title: {
    bottom: 0,
    left: APPBAR_HEIGHT,
    position: 'absolute',
    right: APPBAR_HEIGHT,
    top: 0,
  },

  left: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
  },

  right: {
    bottom: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});

export default NavigationHeader;
