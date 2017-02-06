# React Universal UI

[![Build Status][travis-image]][travis-url]
[![npm version][npm-image]][npm-url]

[React][react-url], [React Native][react-native-url]'s UI components to re-use everywhere.

**Native platforms**: **iOs, Android** (we'll need more customize to make it run on another native places like Mac, Windows or Linux - currently I got no plan for those platforms).

**Browser support**: Chrome, Firefox, Safari >= 7, IE 10, Edge.

[npm-image]: https://badge.fury.io/js/react-universal-ui.svg
[npm-url]: https://npmjs.org/package/react-universal-ui
[travis-image]: https://travis-ci.org/cloudle/ruui.svg?branch=master
[travis-url]: https://travis-ci.org/cloudle/ruui
[github-url]: https://github.com/cloudle/ruui
[react-url]: https://facebook.github.io/react/
[react-native-url]: https://facebook.github.io/react-native/
[react-native-web-url]: https://github.com/necolas/react-native-web
[react-wings-boilerplate-url]: https://github.com/cloudle/react-wings-boilerplate
[material-ui-url]: http://www.material-ui.com/
[ionic-url]: http://ionicframework.com/docs/v2/components/#overview
[react-native-vector-icon-url]: https://github.com/oblador/react-native-vector-icons
[cloud-vector-icons]: https://github.com/cloudle/react-native-vector-icons
[react-native-drawer-url]: https://github.com/root-two/react-native-drawer
[documentation-url]: https://cloudle.github.io/

## Overview
"**React Universal UI**" is a cross-platform **React's UI Kit** - which could be run on both **React Web** and **React Native** environment.

**"Write your UI once and use everywhere"**, checkout [demo and detailed documentations][documentation-url] for live example. 

## How it work
####React Native: 
Essentially this is just a normal [React Native][react-native-url] UI Library - which absolutely work with [React Native][react-native-url]'s ecosystem. Feel free to use those UI with your favorite [React Native][react-native-url] library *even if you don't care about* **Browser** *yet (but believe me, you'll love it - Browser run give us tons of cool stuff)*. 

####Browser:
[React Native Web][react-native-web-url] let us run our [React Native][react-native-url] code on **Browser** and **[React Universal UI][github-url]** (this project) cares about behavior of those components on **Browser**.

####Universal:
There're some differences between **React Native** and **Web** building block - such as **Routing**, **Touch/Mouse handling**... this project cares and provide support for those differences (there're helpers under **utils** module), which save your time and let you focus on write your Universal App.

## Quick start
To install it in your app:
```
npm install --save react-universal-ui
```

####Alternatively, you can start with [react-wings-boilerplate][react-wings-boilerplate-url] which have more complete structure to work on cross-platform [React Native][react-native-url] project.

## Status

This is a work in progress, right now here's what is done:

- [x] Cross-platform [react-native-vector-icon][react-native-vector-icon-url] with [my fork][cloud-vector-icons]
- [x] ResponsibleTouchArea (Reuseable Ripple Effect).
- [x] Cross-platform Drawer (Aka Side Menus - based on [react-native-drawer][react-native-drawer-url])
- [x] Cross-platform Navigation, Routing integration
  - [x] Native Navigation (based on React Native's ExperimentalNavigation)
  - [x] React-Router for Web/Native (Full-featured Browser support, fallback to Memory Navigation History for [React Native][react-native-url])
  - [x] Redux helpers
- [x] Switches (exposed from [react-native-web][react-native-web-url])
- [x] Button Component
  - [x] Ripple effect
  - [x] Flat style
  - [x] Raised style
  - [x] Icon Button
  - [ ] Tooltip (Web only)
- [x] Text Input Component (Material-inspired, but highly customizable)
  - [x] Underline effect
  - [x] Floating label
  - [x] Force label-floating
  - [ ] Field Error
  - [ ] Hint
  - [ ] Multi-line
  - [ ] Number, currency, datetime masking
  - [ ] Tooltip (Web only)
- [ ] Radio
- [ ] Slider
- [ ] Popover
- [ ] Snackbar
- [ ] Select field (mostly for **Web**)
- [ ] Picker Components
  - [ ] Datetime picker
  - [ ] Scroll Picker
- [ ] Table
- [ ] Tabs

## Related projects
* [Material UI][material-ui-url], this project was heavily inspired by their great component design for **Web**! My job is make it work in **Native** way.
* [Ionic 2][ionic-url], As a fan of Ionic - their **ecosystem** and **design** is a great reference for me when developing **this project**.
* [React Native Drawer][react-native-drawer-url]
* [React Native Vector Icons][react-native-vector-icon-url]

## License
React Universal UI is [BSD licensed](LICENSE).