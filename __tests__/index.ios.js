import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import { Button, Input, } from '../src/components';

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