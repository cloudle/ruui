import 'react-native';
import React from 'react';
import Index from '../example';
import configureStore from '../example/store';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

const store = configureStore();
it('renders correctly', () => {
  const tree = renderer.create(
    <Index store={store}/>
  );
});
