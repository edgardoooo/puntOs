import _ from 'lodash';
import firebase from 'firebase';
import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { getFollowing } from '../actions';
import UserFollowingItem from './UserFollowingItem';

class UserFollowingList extends Component {
  componentWillMount() {
    currentUser = firebase.auth().currentUser.uid;
    this.props.getFollowing(currentUser);
  }

  render() {
    //console.log('Trying to render this in a list: ' + this.props.following);
    return (
      <FlatList
        data={this.props.following}
        renderItem={({item}) => <UserFollowingItem following={item} />}
      />
    );
  }
}

const mapStateToProps = state => {
  var { user } = state.userMain;
  //console.log('Following Display list: ' + state.userMain.following)
  const following = _.map(state.userMain.following, (val, key) => {
    return {...val, key};
  });
  return { user, following };
}

export default connect(mapStateToProps, { getFollowing })(UserFollowingList);
