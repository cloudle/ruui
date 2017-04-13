import React, { Component } from 'react';
import { Image, View, ScrollView, Text, StyleSheet } from 'react-native';
import { Input, Button, utils } from '../../../../src';
const { appAction } = utils;
import { connect } from 'react-redux';

import { colors } from '../../utils';
import { ScreenWidthPadding } from '../../utils/screen';
import * as manager from './manager';
import Welcome from '../welcome';

@connect(({app}) => {
	return {

	}
})

class LoginScene extends Component {
  render () {
    return <ScrollView contentContainerStyle={styles.container}>
      <Image
        resizeMode={Image.resizeMode.contain}
        style={styles.appIcon}
        source={require('./beep.png')}/>

      <Text style={styles.loginText}>
		    {this.props.localize.titles.signIn}
      </Text>

      <View style={styles.formWrapper}>
        <Input floatingLabel={this.props.localize.placeholders.userAccount}
               ref="username" maxLength={128}/>
        <Input floatingLabel={this.props.localize.placeholders.password}
               wrapperStyle={{borderBottomWidth: 0}}
               underLineStyle={{backgroundColor: '#fca638', bottom: 0}}
               ref="password" password={true}/>
      </View>

	    <Text style={styles.forgotPasswordText}>
		    {this.props.localize.titles.forgotPassword}
	    </Text>

	    <View style={styles.commandWrapper}>
		    <Button
			    onPress={this::manager.navigateLogin}
			    wrapperStyle={[styles.buttonWrapper, styles.registerButton]}
			    title={this.props.localize.titles.register}
			    tooltip="This is tooltip"
			    raise={false}/>
		    <Button
					wrapperStyle={[styles.buttonWrapper, styles.loginButton]}
					textStyle={{color: '#444444', fontWeight: '500'}}
					raise={false} ripple={false}
					title={this.props.localize.titles.login}
					onPress={toggleModal.bind(this)}
					tooltip="This is a stupid tooltip"/>
			</View>

			<Text style={styles.supportText}>
				{this.props.localize.titles.support}
			</Text>
		</ScrollView>
  }
}

function toggleSelector () {
	this.props.dispatch(appAction.toggleSelector(true, {
		options: selects,
		value: selects[2],
	}));
}

function toggleLoading () {
	this.props.dispatch(appAction.toggleLoading(true, {tapToClose: true}))
}

function toggleModal () {
	this.props.dispatch(appAction.toggleModal(true, {Component: Welcome}))
}

const selects = [{
	title: 'Option 1',
}, {
	title: 'Option 2',
}, {
	title: 'Option 3',
}, {
	title: 'Option 4',
}, {
	title: 'Option 5',
},  {
	title: 'Option 6',
},  {
	title: 'Option 7',
},  {
	title: 'Option 8',
},  {
	title: 'Option 9',
}, ];

export default connect(state => {
  return {
    localize: state.app.localize,
  }
})(LoginScene);

const styles = StyleSheet.create({
  container: {
	  flex: 1,
    backgroundColor: colors.main,
	  justifyContent: 'center',
	  alignItems: 'center',
  },
	appIcon: {
		width: 300, height: 100,
		resizeMode: Image.resizeMode.contain,
		marginBottom: 30,
	},
	loginText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '500',
		marginBottom: 10,
	},
	formWrapper: {
		width: ScreenWidthPadding(40, 260),
		backgroundColor: 'white',
		borderRadius: 2,
		marginBottom: 10,
		overflow: 'hidden',
	},
	commandWrapper: {
		width: ScreenWidthPadding(40, 270),
		flexDirection: 'row'
	},
	errorText: {
		color: 'orange',
	},
	forgotPasswordText: {
		color: 'white',
		marginTop: 20,
		marginBottom: 15,
		textDecorationLine: 'underline',
	},
	supportText: {
		color: 'white',
		marginTop: 20,
		fontSize: 12,
	},
	buttonWrapper: {
		flex: 1,
		marginLeft: 5, marginRight: 5,
	},
	registerButton: {
		backgroundColor: "#9E9E9E",
	},
	loginButton: {
		backgroundColor: "#FFFFFF",
	}
});