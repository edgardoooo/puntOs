import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { InputLine, Button, Spinner } from './common';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { authFormUpdate, loginUser, forgotPassword } from '../actions';
import { Actions } from 'react-native-router-flux';

class LoginForm extends Component {


onButtonPress() {
  const { email, password } = this.props;
  this.props.loginUser({email, password})
}

renderError() {
  if (this.props.error) {
    return (
      <View style={{ backgroundColor: '#0084b4' }}>
        <Text style={styles.errorTextStyle}>
          {this.props.error}
        </Text>
      </View>
    );
  }
}

renderButton() {
  if (this.props.loading){
    return (
      <Spinner size='large' />
    );
  }
  return (
    <Button onPress={this.onButtonPress.bind(this)}>
    Login
    </Button>
  );
}

  render() {
    return (
      <KeyboardAwareScrollView
      style={{ backgroundColor: '#0084b4' }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={styles.backgroundStyle}
      scrollEnabled={false}
      >
      {//<View style={styles.backgroundStyle}>}
      }
      <Text style={styles.logoStyle}>
      puntOs
      </Text>
      <View style={styles.containerStyle}>
          <InputLine
            placeholder='email@gmail.com'
            onChangeText={value => this.props.authFormUpdate({ prop: 'email', value })}
            value={this.props.email}
            placeholderTextColor='#c6e4f2'
            selectionColor='white'
          />
          <InputLine
            secureTextEntry
            placeholder='password'
            onChangeText={value => this.props.authFormUpdate({ prop: 'password', value })}
            value={this.props.password}
            maxLength={16}
            placeholderTextColor='#c6e4f2'
            selectionColor='white'
          />
        {this.renderError()}
        {this.renderButton()}
        <TouchableOpacity onPress={() => this.props.forgotPassword(this.props.email)}>
        <Text style={styles.linkStyle}>
        Forgot your password?
        </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Actions.preSignUp()}>
        <Text style={styles.linkStyle}>
        Sign up
        </Text>
        </TouchableOpacity>
      </View>
      {//</View>}
      }
      </KeyboardAwareScrollView>
    );
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: '#f97171'
  },
  backgroundStyle: {
    flex: 1,
    backgroundColor: '#0084b4',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  containerStyle: {
    height: 300,
    backgroundColor: '#0084b4',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  logoStyle: {
    fontSize: 60,
    fontFamily: 'Futura',
    color: 'white',
    marginBottom: 50
  },
  linkStyle: {
  fontSize: 14,
  color: 'black',
  textDecorationLine: 'underline',
  marginTop: 10,
  alignSelf: 'center'
}
}
const mapStateToProps = state => {
  const { email, password, error, loading } = state.auth;
  return { email, password, error, loading};
};

export default connect(mapStateToProps, { authFormUpdate, loginUser, forgotPassword })(LoginForm);
