import 'react-native';
import React from 'react';
import {
  Button,
  Input
} from '../src/components';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('Renders Button correctly', () => {
  const tree = renderer.create(
    <Button title="Button"/>
  );
});

it('Renders Input correctly', () => {
	const tree = renderer.create(
    <Input/>
	);
});