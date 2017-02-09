import React, { Component } from 'react';
import { Image, View, ScrollView, Text, StyleSheet } from 'react-native';
import { Input, Button } from '../../../../src';
import { connect } from 'react-redux';

import { colors } from '../../utils';
import { ScreenWidthPadding } from '../../utils/screen';

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
               ref="password" password={true}/>
      </View>

    </ScrollView>
  }
}

export default connect(state => {
  return {
    localize: state.app.localize,
  }
})(LoginScene);

const styles = StyleSheet.create({
  container: {
	  flex: 1, paddingTop: 24,
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
  	// height: 200,
		width: ScreenWidthPadding(40, 280),
		backgroundColor: 'white',
		borderRadius: 2,
		marginBottom: 10,
		overflow: 'hidden',
	},
});