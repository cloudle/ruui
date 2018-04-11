# Hello App Display Name

[react-native-url]: https://facebook.github.io/react-native/
[react-native-web-url]: https://github.com/necolas/react-native-web
[react-universal-ui-url]: https://npmjs.org/package/react-universal-ui
[react-native-windows-url]: https://github.com/Microsoft/react-native-windows

#### A cross-platform React project - which run on Native Mobile (iOs, Android), Native Windows and Web (Browser).

Extending [React Native][react-native-url]'s initial structure using [react-native-web][react-native-web-url] and UI components form [react-universal-ui][react-universal-ui-url].

## Getting started
```
yarn vendor #run once only, to boot rebuild speed
yarn web
```

### Boost first-launch and hot-reload time!
Run `yarn vendor` once before run our `yarn web` make our development server rebuild faster (should be under `200 milliseconds`)!
That really save our time and brain energy :p.

##### *note: `yarn vendor` cache our common library (e.g react, react-dom) into reusable chunks, that also mean it won't get update when we install newer version of those packages (see webpack.vendor.js for more information) - and we must re-run `yarn vendor` anytime those common libraries got updated.

## Windows
Structure of this boilerplate including supports to run on Windows (Native).
 
It's pretty straight forward to add Windows build to our project (boilerplate) by follow the instruction by Microsoft [here][react-native-windows-url]..

## Full command list
- `yarn vendor` build common chunks to reuse to boost our rebuild time ;)
- `yarn web` launch our development server.
- `yarn bundle` release our production build under `web` directory.
- `yarn ios`, `yarn android` quick alias which launch our `iOs` or `Android` emulator.
- `yarn test`, `yarn start`