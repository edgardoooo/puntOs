import React from 'react';
import { Scene, Router } from 'react-native-router-flux';
import LoginForm from './components/LoginForm';
import PreSignUp from './components/PreSignUp';
import BusinessSignUpForm from './components/BusinessSignUpForm';
import UserSignUpForm from './components/UserSignUpForm';
import SuccessBusinessView from './components/SuccessBusinessView';
import UserMainView from './components/UserMainView';
import { Actions } from 'react-native-router-flux';

const RouterComponent = () => {
  return (
    <Router>
    <Scene key='root' >
      <Scene key='login'
      navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomWidth: 0, elevation: 0 }}
      component={LoginForm}
      back='false'
      hideBackImage
      initial
      />
      <Scene key='preSignUp'
      navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
      navBarButtonColor='white'
      onBack={() => Actions.login()}
      component={PreSignUp}
      title='Create Account'
      />
      <Scene key='businessSignUp'
      navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
      navBarButtonColor='white'
      onBack={() => Actions.preSignUp()}
      component={BusinessSignUpForm}
      title='Sign Up'
      />
      <Scene key='userSignUp'
      navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
      navBarButtonColor='white'
      onBack={() => Actions.preSignUp()}
      component={UserSignUpForm}
      title='Sign Up'
      />
      <Scene key='signUpSuccessBusiness'
      navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomWidth: 0 }}
      component={SuccessBusinessView}
      back='false'
      hideBackImage
      />
      <Scene key='userMainView'
      navigationBarStyle={{ backgroundColor: '#008b4', borderBottomWidth: 0 }}
      component={UserMainView}
      back='false'
      hideBackImage
      />
    </Scene>
    </Router>
  );

};

export default RouterComponent;
