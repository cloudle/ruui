# React Universal UI

[![Build Status][travis-image]][travis-url]
[![npm version][npm-image]][npm-url]

Cross-platform (**React Native** and **Web Browser**) [React][react-url], [React Native][react-native-url]'s UI components to re-use everywhere.

## Platforms

**Native platforms**: **iOs, Android** (for **Mac**, **Windows** or **Linux** we could just use Atom to bring our React Native code on it's web and have that same code-base run on Native environment when they got better support for React Native building block).

**Browser support**: Chrome, Firefox, Safari >= 7, IE 10, Edge.

[npm-image]: https://badge.fury.io/js/react-universal-ui.svg
[npm-url]: https://npmjs.org/package/react-universal-ui
[travis-image]: https://travis-ci.org/cloudle/ruui.svg?branch=master
[travis-url]: https://travis-ci.org/cloudle/ruui
[github-url]: https://github.com/cloudle/ruui
[react-url]: https://facebook.github.io/react/
[react-native-url]: https://facebook.github.io/react-native/
[react-native-web-url]: https://github.com/necolas/react-native-web
[boilerplate-url]: https://github.com/cloudle/react-universal-ui-boilerplate
[next-boilerplate-url]: https://github.com/cloudle/universal-ui-next-boilerplate
[material-ui-url]: http://www.material-ui.com/
[ionic-url]: http://ionicframework.com/docs/v2/components/#overview
[react-native-vector-icon-url]: https://github.com/oblador/react-native-vector-icons
[react-native-tab-view-url]: https://github.com/react-native-community/react-native-tab-view
[cloud-vector-icons]: https://github.com/cloudle/react-native-vector-icons
[react-native-drawer-url]: https://github.com/root-two/react-native-drawer
[home-url]: http://ruui.cool
[rooxim-url]: https://www.rooxim.com/
[ruui-home]: https://github.com/cloudle/ruuiHome

## Overview
"**React Universal UI**" is a cross-platform **React's UI Kit** - which could be run on both **Web Browser** and **React Native** environment, **write once and use everywhere**.

#### **See [home page][home-url] for detailed documentation and tutorials (the site is under construction and will be ready soon)**

## require env
require `yarn`, `react-native-cli`

```
npm install -g yarn react-native-cli
```

## Quick start
### Existing Web or React Native project:
1. Install `react-universal-ui` package (no further config required)
```
npm install --save react-universal-ui
```
2. Install and configure react-native-web using [their instruction](https://github.com/necolas/react-native-web) (optional, only need on Web project)

3. Wrap your root component under RuuiProvider
```
import { RuuiProvider } from 'react-universal-ui';
import App from './app';

const AppContainer = () => {
  return <RuuiProvider>
    <App/>
  </RuuiProvider>;
};
```

### New project:
React Universal UI come with it's own `cli` (command line interface), install it by..
```
npm install -g ruui-cli
```

With `ruui-cli` installed globally.. we should now able to use `ruui` command to *create a new project*:
```
ruui init SuperCoolProject
```
_This will take a while when `cli` create the project structure for us as well as install necessary dependencies.._

Run `ruui dev` under your React Universal UI project folder..
```
cd SuperCoolProject
ruui dev
```
*note: the project totally generated using `react-native-cli`, which mean it is a valid `React Native` project.. we could run it normally with:
```
react-native run-ios
react-native run-android
```

## How it work
#### React Native:
Essentially this is just a normal [React Native][react-native-url] UI Library - which absolutely work with [React Native][react-native-url]'s ecosystem. Feel free to use those UI with your favorite [React Native][react-native-url] library *even if you don't care about* **Browser** *yet (but believe me, you'll love it - Browser run give us tons of cool stuff)*.

#### Browser:
[React Native Web][react-native-web-url] let us run our [React Native][react-native-url] code on **Browser** and **[React Universal UI][github-url]** (this project) cares about behavior of those components on **Browser**.

#### Universal:
There're some differences between **React Native** and **Web** building block - such as **Routing**, **Touch/Mouse handling**... this project cares and provide support for those differences (there're helpers under **utils** module), which save your time and let you focus on write your Universal App.

## Components and status
- [x] Cross-platform Navigation, Routing integration
  - [x] Native Navigation (based on React Native's ExperimentalNavigation)
  - [x] React-Router for Web/Native (Full-featured Browser support, fallback to Memory Navigation History for [React Native][react-native-url])
  - [x] Redux helpers
- [x] Context Provider
 - [x] Reactive device common info (e.g Network info, Screen size..)
 - [x] Configurable theme (skin)
- [x] Switches (exposed from [react-native-web][react-native-web-url])
- [x] Button Component
  - [x] Ripple effect
  - [x] Fade effect
  - [x] Raised style
  - [x] Icon Button
  - [x] Tooltip (from 12 directions - Web only)
- [x] Text Input Component (Material-inspired, but highly customizable)
  - [x] Underline effect
  - [x] Floating label
  - [x] Force label-floating
  - [ ] Field Error
  - [x] Hint
  - [ ] Multi-line
  - [ ] Number, currency, datetime masking
  - [x] Tooltip (Web only - Alpha implementation)
- [x] Multi layer modals
  - [x] Pop-up style (Alert, Prompt..)
  - [x] Full-screen style
- [x] Dropdown
  - [x] DropdownContainer (similar to a View, but could host a Dropdown component)
  - [x] Configurable dropdown from 12 directions, passing context..
- [x] Loading Mask
- [x] Snackbar
- [x] Selector Api, Select component
- [x] Animated Tab View
  - [x] Essential module export - for generic use case
  - [ ] App intro slider
  - [ ] Tab View scene with headers
  - [ ] Image slider
- [ ] Action sheets
- [ ] Swipe-able segments
- [ ] Datetime picker
- [ ] Radio
- [ ] Checkbox
- [x] Range Slider
- [x] Connection status (mask)

## Related projects
* [Material UI][material-ui-url], heavily inspired by their great component design for **Web**! My job is make it work in **Native** way.
* [Ionic 2][ionic-url], As a fan of Ionic - their **ecosystem** and **design** is a great reference for me when developing **this project**.
* [React Native Drawer][react-native-drawer-url]
* [React Native Vector Icons][react-native-vector-icon-url]
* [React Native Tab View][react-native-tab-view-url], their great Animated Tab View component was clone and customized inside this package.

# License

This project is licensed under the MIT License.

# Contributing
This project under main support of [Rooxim Company.](https://www.rooxim.com/) 

We're exciting to see more contribution from community, by contributing your code to [ruui][github-url] you agree to license your contribution under the MIT license.
