import React, { Component } from 'react';
import { View, BackHandler, Modal, TouchableWithoutFeedback, Image } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { userMainUpdate, getUserProfile, getStats, getMyCheckins, getMyCoupons,
  getMyReviewCount, getFollowing } from '../actions';
import Icon from 'react-native-vector-icons/Ionicons';
import UserPromoList from './UserPromoList';
import UserMainFilterHeader from './UserMainFilterHeader';
import PostFeed from './PostFeed';
import UserMainFooter from './UserMainFooter';
import CheckinsView from './CheckinsView';
import UserReviewsView from './UserReviewsView';
import UserProfile from './UserProfile';
import { Actions }  from 'react-native-router-flux';
import { Button, Spinner } from './common';

class UserMain extends Component {
  componentWillMount(){
    currentUser = firebase.auth().currentUser.uid;
    this.props.getUserProfile(currentUser);
    this.props.getStats(currentUser);
    this.props.getMyCheckins(currentUser);
    this.props.getMyCoupons(currentUser);
    this.props.getMyReviewCount(currentUser);
    this.props.userMainUpdate({ prop: 'loading', value: true});
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backHandler );
    this.props.userMainUpdate({ prop: 'loading', value: false });
  }

  backHandler () {
    return true;
  }

  toggleViewImage(){
    this.props.userMainUpdate({prop: 'viewImage', value: false});
  }


  renderViewImageModal(){
    return (
      <Modal transparent={true} animationType={'slide'} visible={this.props.viewImage} style={{ justifyContent: 'flex-end', margin: 0 }}>
        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#000' }}>
        <TouchableWithoutFeedback onPress={() => {this.toggleViewImage();}}>
          <Icon name='md-close' size= {25} color='#0084b4' style={{ alignSelf: 'flex-start' ,paddingTop: 15, paddingLeft: 10 }} />
        </TouchableWithoutFeedback>
        <Image
        style={styles.viewImageStyle}
        source={{uri: this.props.imageToView }}
        />
        </View>
      </Modal> );
  }

  render() {
    if(this.props.loading){
      return(
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
         <Spinner size="large" />
      </View>
      );
    }
    else{
      return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
          {this.renderViewImageModal()}
          <UserPromoList />
        </View>
      );
    }
  }
}

const styles = {
viewImageStyle: {
flex: 1,
resizeMode: 'contain'
}
}

const mapStateToProps = state => {
  const { user, uid, loading, viewImage, imageToView } = state.userMain;
  return { user, uid, loading, viewImage, imageToView };
};

export default connect(mapStateToProps, { getUserProfile, getStats, getMyCoupons, getMyCheckins, getMyReviewCount, userMainUpdate, getFollowing })(UserMain);
