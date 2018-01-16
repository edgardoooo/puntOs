import React from 'react';
import { Scene, Router, Drawer } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import LoginForm from './components/LoginForm';
import PreSignUp from './components/PreSignUp';
import BusinessSignUpForm from './components/BusinessSignUpForm';
import UserSignUpForm from './components/UserSignUpForm';
import SuccessBusinessView from './components/SuccessBusinessView';
import SuccessUserView from './components/SuccessUserView';
import SettingProfile from './components/SettingProfile';
import BusinessMain from './components/BusinessMain';
import BusinessProfile from './components/BusinessProfile';
import TabIcon from './components/TabIcon';
import ValidateCoupon from './components/ValidateCoupon';
import CouponsView from './components/CouponsView';
import CreateCoupon from './components/CreateCoupon';
import CreatePromo from './components/CreatePromo';
import PromosView from './components/PromosView';
import ReviewsView from './components/ReviewsView';
import UserMain from './components/UserMain';
import UserProfile from './components/UserProfile';
import PostReviewView from './components/PostReviewView';
import NotificationsView from './components/NotificationsView';
import QRCheckInView from './components/QRCheckInView';
import UserBusinessProfile from './components/UserBusinessProfile';
import RedeemCouponView from './components/RedeemCouponView';
import { Actions } from 'react-native-router-flux';
import UserNavBar from './components/UserNavBar';
import UserSocialFeed from './components/UserSocialFeed';
import LinkAccount from './components/LinkAccount';
import SwitchAccount from './components/SwitchAccount';
import SwitchAccountUser from './components/SwitchAccountUser';
import Leaderboard from './components/Leaderboard';
import MyCoupons from './components/MyCoupons';
import Favorites from './components/Favorites';
import UserStats from './components/UserStats';
import MenuContent from './components/MenuContent';
import UserCheckinResult from './components/UserCheckinResult';
import UserPreScanner from './components/UserPreScanner';
import InviteFriends from './components/InviteFriends';
import GetPoints from './components/GetPoints';

const RouterComponent = () => {

  state = {tabSelected: 'UserMain'};

  /*renderSelected(tab){
    if(tab === this.state.tabSelected){
      return '#0084b4';
    } else {
      return 'grey';
    }
  }*/
  return (
    <Router>
      <Scene key='root' >
        {/*These are Login Related Views}*/}

        <Scene
          initial
          key='login'
          navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomWidth: 0, elevation: 0 }}
          component={LoginForm}
          back='false'
          hideBackImage
          panHandlers={null}
        />
        <Scene
          key='preSignUp'
          navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
          navBarButtonColor='white'
          onBack={() => Actions.login()}
          component={PreSignUp}
          title='Create Account'
        />
        <Scene
          key='businessSignUp'
          navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
          navBarButtonColor='white'
          onBack={() => Actions.preSignUp()}
          component={BusinessSignUpForm}
          title='Sign Up'
        />
        <Scene
          key='userSignUp'
          navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
          navBarButtonColor='white'
          onBack={() => Actions.preSignUp()}
          component={UserSignUpForm}
          title='Sign Up'
        />
        <Scene
          key='signUpSuccessBusiness'
          navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomWidth: 0 }}
          component={SuccessBusinessView}
          back='false'
          hideBackImage
          panHandlers={null}
        />
        <Scene
          key='signUpSuccessUser'
          navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomWidth: 0 }}
          component={SuccessUserView}
          back='false'
          hideBackImage
          panHandlers={null}
        />
         <Scene
          key='UserCheckinResult'
          navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomWidth: 0 }}
          component={UserCheckinResult}
          back='false'
          hideBackImage
          panHandlers={null}
        />
        <Scene
          key='settingProfile'
          navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomWidth: 0 }}
          back='false'
          hideBackImage
          component={SettingProfile}
          title=' '
          panHandlers={null}
        />

        {/*These are Business Related Views}*/}

        <Scene
          key='BusinessMain'
          navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
          navBarButtonColor='white'
          hideNavBar
          back='false'
          hideBackImage
          component={BusinessMain}
          panHandlers={null}
        />
        <Scene
          key='BusinessProfile'
          navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
          navBarButtonColor='white'
          hideNavBar
          back='false'
          hideBackImage
          component={BusinessProfile}
        />
        <Scene
          key='ReviewsView'
          navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
          navBarButtonColor='white'
          onBack={() => Actions.BusinessMain()}
          component={ReviewsView}
          title='My Reviews'
        />
        <Scene
          key='CouponsView'
          navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
          navBarButtonColor='white'
          onBack={() => Actions.BusinessMain()}
          component={CouponsView}
          title='My Coupons'
        />
        <Scene
          key='PromosView'
          navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
          navBarButtonColor='white'
          onBack={() => Actions.BusinessMain()}
          component={PromosView}
          title='My Promos'
        />
        <Scene
          key='CreateCoupon'
          navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
          navBarButtonColor='white'
          onBack={() => Actions.BusinessMain()}
          component={CreateCoupon}
          title='Create Coupon'
        />
        <Scene
          key='CreatePromo'
          navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
          navBarButtonColor='white'
          onBack={() => Actions.BusinessMain()}
          component={CreatePromo}
          title='Create Promo'
        />
        <Scene
          key='ValidateCoupon'
          navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
          navBarButtonColor='white'
          onBack={() => Actions.BusinessMain()}
          component={ValidateCoupon}
          title='Validate Coupon'
        />
        <Scene
          key='linkAccount'
          navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
          navBarButtonColor='white'
          onBack={() => Actions.BusinessMain()}
          component={LinkAccount}
          title='Link Account'
        />
        <Scene
          key='switchAccount'
          navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
          navBarButtonColor='white'
          onBack={() => Actions.BusinessMain()}
          component={SwitchAccount}
          title='Switch Account'
        />

        {/*These are User Related Views*/}
        <Scene key='burgerMenu' drawer contentComponent={MenuContent} hideNavBar panHandlers={null} open={false}>
        {/* Tab Container */}
        <Scene
          hideNavBar
          back='false'
          key="tabbar"
          tabs={true}
          tabBarStyle=
          {{
            backgroundColor: 'white',
            borderTopWidth: 2,
            height: 60,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginBottom: -10,
            paddingTop: 5,
            borderTopColor: '#000',
            borderTopWidth:0.5
          }}
          tabBarPosition="bottom"
          navBar = {UserNavBar}
          swipeEnabled={false}
        >
          {/* User Main Tab(Promo Feed) and its scenes */}
          <Scene key="Main" title="Promo Feed">
            <Scene
              key='UserMain'
              title='UserMain'
              component={UserMain}
              icon={TabIcon}
            />
          </Scene>
          {/* User Social Feed Tab and its scenes */}
          <Scene key="Social Feed" title="Social Feed">
            <Scene
              key='UserSocialFeed'
              title='SocialFeed'
              component={UserSocialFeed}
              icon={TabIcon}
            />
          </Scene>
          {/* User QR Check In Tab and its scenes */}
          <Scene key="UserPreScanner" title="Check-In">
            <Scene
              icon={TabIcon}
              key='UserPreScanner'
              title='Check-In'
              component={UserPreScanner}
            />
          </Scene>
          {/* User Notifications Tab and its scenes */}
          <Scene key="Notifications" title="Notifications">
            <Scene
              key='NotificationsView'
              title='Notifications'
              component={NotificationsView}
              icon={TabIcon}
            />
          </Scene>
          {/* User Profile Tab and its scenes */}
          <Scene key="Profile" title="My Profile">
            <Scene
              key='UserProfile'
              title='MyProfile'
              component={UserProfile}
              icon={TabIcon}
            />
          </Scene>
        </Scene>
    </Scene>
        <Scene
          key="PostReviewView"
          navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray'}}
          navBarButtonColor='white'
          component={PostReviewView}
          onBack={() => Actions.pop()}
          title="Post Review"
        />
        <Scene
          key="UserBusinessProfile"
          navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray'}}
          navBarButtonColor='white'
          hideNavBar
          onBack={() => Actions.burgerMenu('UserMain')}
          component={UserBusinessProfile}
          title="UserBusinessProfile"
        />
        <Scene
          key="QRCheckInView"
          navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray'}}
          navBarButtonColor='white'
          onBack={() => Actions.burgerMenu('UserPreScanner')}
          component={QRCheckInView}
          title="QR Scanner"
        />
        <Scene
          key="RedeemCouponView"
          navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray'}}
          navBarButtonColor='white'
          onBack={() => Actions.pop()}
          component={RedeemCouponView}
          title="Claim Coupon"
        />
        <Scene
          key='switchAccountUser'
          navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
          navBarButtonColor='white'
          onBack={() => Actions.burgerMenu('UserMain')}
          component={SwitchAccountUser}
          title='Switch Account'
        />
        <Scene
          key='Leaderboard'
          navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
          navBarButtonColor='white'
          onBack={() => Actions.pop()}
          component={Leaderboard}
          title='Leaderboard'
        />
        <Scene
          key='myCoupons'
          navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
          navBarButtonColor='white'
          onBack={() => Actions.pop()}
          component={MyCoupons}
          title='My Coupons'
        />
        <Scene
          key='Favorites'
          navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
          navBarButtonColor='white'
          onBack={() => Actions.pop()}
          component={Favorites}
          title='Favorites'
        />
        <Scene
          key='userStats'
          navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
          navBarButtonColor='white'
          onBack={() => Actions.pop()}
          component={UserStats}
          title='My Stats'
        />
        <Scene
          key='inviteFriends'
          navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
          navBarButtonColor='white'
          onBack={() => Actions.pop()}
          component={InviteFriends}
          title='Invite Friends'
        />
        <Scene
          key='getPoints'
          navigationBarStyle={{ backgroundColor: '#0084b4', borderBottomColor: 'gray' }}
          navBarButtonColor='white'
          onBack={() => Actions.pop()}
          component={GetPoints}
          title='Get Points'
        />
      </Scene>
    </Router>
  );
}

export default RouterComponent;
