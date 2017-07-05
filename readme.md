# React Universal UI

[![Build Status][travis-image]][travis-url]
[![npm version][npm-image]][npm-url]

Cross-platform (**React Native** and **Web Browser**) [React][react-url], [React Native][react-native-url]'s UI components to re-use everywhere.

<div>
  <img height="500" style="float: right;" alt="button" src="https://github.com/cloudle/ruui/blob/master/screenshot/button.png?raw=true">
  <img height="500" style="float: right;" alt="dx-01" src="https://github.com/cloudle/ruui/blob/master/screenshot/tabs.png?raw=true">
  <img height="500" style="float: right;" alt="dx-01" src="https://github.com/cloudle/ruui/blob/master/screenshot/drawer.png?raw=true">
  <img height="500" style="float: right;" alt="dx-01" src="https://github.com/cloudle/ruui/blob/master/screenshot/navigation-cardstack.png?raw=true">
  <img height="500" style="float: right;" alt="dx-01" src="https://github.com/cloudle/ruui/blob/master/screenshot/connection-mask.png?raw=true">
  <img height="500" style="float: right;" alt="dx-01" src="https://github.com/cloudle/ruui/blob/master/screenshot/modal.png?raw=true">
  <img height="500" style="float: right;" alt="dx-01" src="https://github.com/cloudle/ruui/blob/master/screenshot/selector.png?raw=true">
  <img height="500" style="float: right;" alt="dx-01" src="https://github.com/cloudle/ruui/blob/master/screenshot/snackbar.png?raw=true">
</div>

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
[documentation-url]: https://cloudle.github.io/

## Overview
"**React Universal UI**" is a cross-platform **React's UI Kit** - which could be run on both **Web Browser** and **React Native** environment, **write once and use everywhere**.

### **Checkout [demo and detailed documentations][documentation-url] for live example.**  
### **Checkout [react-universal-ui boilerplate][boilerplate-url] for a complete starter boilerplate for [React Native][react-native-url]-first project**
### **Checkout [universal-ui-next boilerplate][next-boilerplate-url] for Browser-first project**

## How it work
#### React Native: 
Essentially this is just a normal [React Native][react-native-url] UI Library - which absolutely work with [React Native][react-native-url]'s ecosystem. Feel free to use those UI with your favorite [React Native][react-native-url] library *even if you don't care about* **Browser** *yet (but believe me, you'll love it - Browser run give us tons of cool stuff)*. 

#### Browser:
[React Native Web][react-native-web-url] let us run our [React Native][react-native-url] code on **Browser** and **[React Universal UI][github-url]** (this project) cares about behavior of those components on **Browser**.

#### Universal:
There're some differences between **React Native** and **Web** building block - such as **Routing**, **Touch/Mouse handling**... this project cares and provide support for those differences (there're helpers under **utils** module), which save your time and let you focus on write your Universal App.

## Quick start
To install it in your app:
```
npm install --save react-universal-ui
```

## Status
Most of the Component is pretty solid.. we should already able to do production Mobile Apps, Sites on this.

I personally got dozen Apps built on this UI components. Next important thing for us is to make better Documentation, Demo (like IONIC does) - we do need reach there before back to those components.

- [x] Cross-platform [react-native-vector-icon][react-native-vector-icon-url] with [my fork][cloud-vector-icons]
- [x] ResponsibleTouchArea (Reuseable Ripple Effect).
- [x] Cross-platform Drawer (Aka Side Menus - based on [react-native-drawer][react-native-drawer-url])
- [x] Cross-platform Navigation, Routing integration
  - [x] Native Navigation (based on React Native's ExperimentalNavigation)
  - [x] React-Router for Web/Native (Full-featured Browser support, fallback to Memory Navigation History for [React Native][react-native-url])
  - [x] Redux helpers
- [x] Context Provider - configurable theme, reactive device common info via ReduxStore (e.g Network info, Screen size..)
- [x] Switches (exposed from [react-native-web][react-native-web-url])
- [x] Button Component
  - [x] Ripple effect
  - [x] Fade effect
  - [x] Raised style
  - [x] Icon Button
  - [x] Tooltip (Web only)
- [x] Text Input Component (Material-inspired, but highly customizable)
  - [x] Underline effect
  - [x] Floating label
  - [x] Force label-floating
  - [ ] Field Error
  - [x] Hint
  - [ ] Multi-line
  - [ ] Number, currency, datetime masking
  - [x] Tooltip (Web only - Alpha implementation)
- [x] Modals with multilayer support (mobile)
  - [x] Pop-up style (Alert, Prompt..)
  - [x] Full-screen style
- [x] Loading Mask
- [x] Snackbar
- [x] Selector Api, Select component (mobile)
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
- [ ] Range
- [ ] Select field (mostly for **Web**)
- [x] Connection status (mask)
- [ ] Theming..

## Related projects
* [Material UI][material-ui-url], heavily inspired by their great component design for **Web**! My job is make it work in **Native** way.
* [Ionic 2][ionic-url], As a fan of Ionic - their **ecosystem** and **design** is a great reference for me when developing **this project**.
* [React Native Drawer][react-native-drawer-url]
* [React Native Vector Icons][react-native-vector-icon-url]
* [React Native Tab View][react-native-tab-view-url], their great Animated Tab View component was clone and customized inside this package.

# License

MIT