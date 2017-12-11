import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button } from './common';
import { Actions } from 'react-native-router-flux';

class SuccessBusinessView extends Component {

  render() {
    return (
      <View style={styles.backgroundStyle}>
      <Text style={styles.logoStyle}>
      puntOs
      </Text>
      <Text style={styles.topTextStyle}>
      Welcome to our team!
      </Text>
      <Text style={styles.normalTextStyle}>
      Business accounts need to be verified and approved. Please
      allow at least 24 hrs for this process before you attempt to
      log in the application. Monitor your email for updates and more
      info about your account.
      </Text>
      <View style={styles.containerStyle}>
      <Button onPress={() => Actions.login({ type: 'reset' })} >Back to Login</Button>
      </View>
      </View>
    );
  }
}

const styles = {
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
    fontSize: 80,
    fontFamily: 'Futura',
    color: 'white',
    marginBottom: 50,
    paddingTop: 30
  },
  normalTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: 30,
    color: 'white',
    fontWeight: 'normal',
    textAlign: 'justify'
  },
  topTextStyle: {
    fontSize: 25,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 25,
    paddingRight: 25,
    color: 'white',
    fontWeight: 'bold'
  }
}


export default SuccessBusinessView;
