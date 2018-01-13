import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { userMainUpdate, getUserProfile } from '../actions';
import UserNotificationList from './UserNotificationList';

class UserNotificationView extends Component {
  componentWillMount(){
    currentUser = firebase.auth().currentUser.uid;
    this.props.getUserProfile(currentUser);
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
        <UserNotificationList />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { user, uid } = state.userMain;
  return { user, uid };
};

export default connect(mapStateToProps, { getUserProfile })(UserNotificationView);
