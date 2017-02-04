# React Universal UI

[![Build Status][travis-image]][travis-url]
[![npm version][npm-image]][npm-url]

[React][react-url], [React Native][react-native-url]'s Core UI components to re-use everywhere.

Browser support: Chrome, Firefox, Safari >= 7, IE 10, Edge.

[npm-image]: https://badge.fury.io/js/react-universal-ui.svg
[npm-url]: https://npmjs.org/package/react-universal-ui
[travis-image]: https://travis-ci.org/cloudle/ruui.svg?branch=master
[travis-url]: https://travis-ci.org/cloudle/ruui
[react-url]: https://facebook.github.io/react/
[react-native-url]: https://facebook.github.io/react-native/
[react-native-web-url]: https://github.com/necolas/react-native-web
[react-wings-boilerplate-url]: https://github.com/cloudle/
[material-ui-url]: http://www.material-ui.com/
[ionic-url]: http://ionicframework.com/docs/v2/components/#overview
[react-native-vector-icon-url]: https://github.com/oblador/react-native-vector-icons
[cloud-vector-icons]: https://github.com/cloudle/react-native-vector-icons
[react-native-drawer-url]: https://github.com/root-two/react-native-drawer

## Overview
"React Universal UI" is a UI Kit based on [react-native-web][react-native-web-url] which could be run on both **Web** and **Native** environment.

**"Write your UI once and use everywhere"**

## Quick start
To install it in your app:
```
npm install --save react-universal-ui
```

Alternatively, you can start with [react-wings-boilerplate][react-wings-boilerplate-url] which have more complete structure to work on cross-platform [React Native][react-native-url] project.

*Note the wings-boilerplate is not ready - coming soon.

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
  - [ ] Raised style
  - [ ] Icon Button
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

## Demo (coming soon)
waiting for update..

## Documentation (coming soon)
waiting for update..

## References
* [Material UI][material-ui-url], I was inspired by their great component design for **Web**! My job is make it work in **Native** way.
* [Ionic 2][ionic-url], As a fan of Ionic - their **ecosystem** and **design** is a great reference for me when developing **this project**.
* [React Native Drawer][react-native-drawer-url]
* [React Native Vector Icons][react-native-vector-icon-url]

## License
React Universal UI is [BSD licensed](LICENSE).