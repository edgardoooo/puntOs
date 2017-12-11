import React from 'react';
import { Scene, Router } from 'react-native-router-flux';
import LoginForm from './components/LoginForm';
import PreSignUp from './components/PreSignUp';
import BusinessSignUpForm from './components/BusinessSignUpForm';
import UserSignUpForm from './components/UserSignUpForm';
import SuccessBusinessView from './components/SuccessBusinessView';
import SettingProfile from './components/SettingProfile';
import BusinessMain from './components/BusinessMain';
import BusinessProfile from './components/BusinessProfile';
import ValidateCoupon from './components/ValidateCoupon';
import CouponsView from './components/CouponsView';
import CreateCoupon from './components/CreateCoupon';
import CreatePromo from './components/CreatePromo';
import PromosView from './components/PromosView';
import ReviewsView from './components/ReviewsView';
import UserMain from './components/UserMain';
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
      panHandlers={null}
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
      panHandlers={null}
      />
      <Scene key='settingProfile'
      navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomWidth: 0 }}
      back='false'
      hideBackImage
      component={SettingProfile}
      title=' '
      panHandlers={null}
      />
      <Scene key='BusinessMain'
      navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
      navBarButtonColor='white'
      hideNavBar
      back='false'
      hideBackImage
      component={BusinessMain}
      panHandlers={null}
      />
      <Scene key='UserMain'
      navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
      navBarButtonColor='white'
      back='false'
      hideBackImage
      component={UserMain}/>
      <Scene key='BusinessProfile'
      navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
      navBarButtonColor='white'
      hideNavBar
      back='false'
      hideBackImage
      component={BusinessProfile}
      />
      <Scene key='ReviewsView'
      navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
      navBarButtonColor='white'
      onBack={() => Actions.BusinessMain()}
      component={ReviewsView}
      title='My Reviews'
      />
      <Scene key='CouponsView'
      navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
      navBarButtonColor='white'
      onBack={() => Actions.BusinessMain()}
      component={CouponsView}
      title='My Coupons'
      />
      <Scene key='PromosView'
      navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
      navBarButtonColor='white'
      onBack={() => Actions.BusinessMain()}
      component={PromosView}
      title='My Promos'
      />
      <Scene key='CreateCoupon'
      navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
      navBarButtonColor='white'
      onBack={() => Actions.BusinessMain()}
      component={CreateCoupon}
      title='Create Coupon'
      />
      <Scene key='CreatePromo'
      navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
      navBarButtonColor='white'
      onBack={() => Actions.BusinessMain()}
      component={CreatePromo}
      title='Create Promo'
      />
      <Scene key='ValidateCoupon'
      navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
      navBarButtonColor='white'
      onBack={() => Actions.BusinessMain()}
      component={ValidateCoupon}
      title='Validate Coupon'
      />
    </Scene>
    </Router>
  );

};

export default RouterComponent;
