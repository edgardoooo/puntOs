import firebase from 'firebase';
import { Alert } from 'react-native';
import {
  USER_MAIN_UPDATE,
  USER_PROFILE_UPDATE,
  USER_MAIN_SET_PROFILE,
  USER_CHECKINS_UPDATE,
  USER_REVIEWS_UPDATE,
  USER_PROMOS_UPDATE,
  USER_PRIMARY_FILTER_UPDATE,
  USER_SECONDARY_FILTER_UPDATE,
  USER_SOCIALS_UPDATE,
  SET_PROFILE_UPDATE,
  GET_FOLLOWING,
  LOGIN_USER_SUCCESS,
  LEADERBOARD_UPDATE,
  POST_REVIEW_CHANGE,
  USER_MAIN_RESET} from './types';
import { Actions } from 'react-native-router-flux';
import { ShareDialog } from 'react-native-fbsdk';
import axios from 'axios';
const levels = [1000, 2500, 3750, 5625, 8450, 12650];
const SWITCH_ACCOUNT = 'https://us-central1-puntos-capstone2017.cloudfunctions.net/switchAccount';
var Utils = require('../components/common/Utils');
var haversine = require('haversine');
var moment = require('moment');

export const userMainUpdate = ({ prop, value }) => {
  return {
    type: USER_MAIN_UPDATE,
    payload: { prop, value }
  };
};

export const getUserProfile = (uid) => {
  return (dispatch) => {
    firebase.database().ref(`/users/${uid}`).on('value', snapshot => {
      const user = snapshot.val();
      dispatch({ type: USER_MAIN_UPDATE, payload: { prop: 'user', value: user }});
      if(user.image){
        dispatch({ type: USER_MAIN_UPDATE, payload: { prop: 'userImage', value: user.image }});
      } else {
        dispatch({ type: USER_MAIN_UPDATE, payload: { prop: 'userImage', value: '' }});
      }
    });
  };
};

export const userProfileUpdate = ({ prop, value }) => {
  return {
    type: USER_PROFILE_UPDATE,
    payload: { prop, value }
  };
};

export const userPrimaryFilterUpdate = ({ prop, value }) => {
  return {
    type: USER_PRIMARY_FILTER_UPDATE,
    payload: { prop, value }
  };
};

export const userSecondaryFilterUpdate = ({ prop, value }) => {
  return {
    type: USER_SECONDARY_FILTER_UPDATE,
    payload: { prop, value }
  };
};

export const getCheckins = (uid) => {
    return (dispatch) => {
      firebase.database().ref(`/Checkins/`).orderByChild('uid').equalTo(uid).on('value', snapshot => {
        let checkinList = [];
        let counter = 0;
        snapshot.forEach(child_node => {
          var child_key = child_node.key;
          checkinList.splice(0,0,{...child_node.val(), id: counter });
          counter++;
        });
        dispatch({type: USER_MAIN_UPDATE, payload: {prop: 'totalCheckins', value: Object.keys(checkinList).length}});
        //var shortList = checkinList.slice(0,3);
        //console.log(shortList)
        checkinList.forEach( checkin => {
          const businessID = checkin.businessID;
          var image = '';
          firebase.database().ref(`/users/${businessID}`).once('value', snapshot =>{
            if(snapshot.val().image){
              image = snapshot.val().image;
            }
            checkin['image'] = image;
          });
        });
        console.log(checkinList)
        //dispatch({ type: USER_CHECKINS_UPDATE, payload: checkinList});
        //var shortList = checkinList.slice(0,3);
        dispatch({type: USER_MAIN_UPDATE, payload: {prop: 'checkins', value: checkinList}});
      });
    };
};

export const getMyReviews = (uid) => {
  return (dispatch) => {
    firebase.database().ref(`/Reviews`).orderByChild(`uid`).equalTo(uid).on('value', snapshot => {
      let reviewList = [];
      let counter = 0;
      snapshot.forEach(child_node => {
        reviewList.splice(0,0,{ ...child_node.val(), id: counter});
        //reviewList.push({...child_node.val(), id: counter});
        counter++;
      });
      //console.log(reviewList)
      dispatch({ type: USER_REVIEWS_UPDATE, payload: reviewList});
    });
  };
};

export const userMainSetProfile = ({user, uid}) => {
  return {
    type: USER_MAIN_SET_PROFILE,
    payload: {user, uid}
  };
}

export const userSetExpired = (pid) => {
  return (dispatch) => {
    firebase.database().ref(`/Coupons/${pid}`).update({expired: true});
  };
};


//---------------------------------------------------------------//
//                      FEED QUERY & FILTER                      //
//---------------------------------------------------------------//
export const userGetPromos = (uid, pf, sf, fol) => {
  return (dispatch) => {
    console.log('pf ' + pf)
    console.log('sf ' + sf)
    //FILTERING BY PROMOTIONS
    if (pf == 'Promos') {
      //NO FILTER
      if (sf == 'All') {
        firebase.database().ref(`/posts`).on('value', snapshot => {
          let promoList = [];
          let counter = 0;
          snapshot.forEach(child_node => {
            var child_key = child_node.key;
            promoList.splice(0,0,{ ...child_node.val(), id: counter, pid: child_key});
            counter++;
          });
          dispatch({ type: USER_PROMOS_UPDATE, payload: promoList});
        });
      }
      else {
        //FILTERING BY FAVORITES(FOLLOWS)
        if (sf == 'Favorites') {
          firebase.database().ref(`/posts`).on('value', snapshot => {
            let promoList = [];
            let counter = 0;
            snapshot.forEach(child_node => {
              //console.log(child_node.val().businessID)
              if(fol){
              var child_key = child_node.key;
              //console.log('Looking at filtering by favorites...-----------');
              //console.log(fol);
              //console.log(child_node.val().businessID);
              if (child_node.val().businessID in fol) {
                promoList.splice(0,0,{ ...child_node.val(), id: counter, pid: child_key});
                counter++;
              }
            }});
            //console.log(promoList)
            //console.log("Dispatching Promos...");
            dispatch({ type: USER_PROMOS_UPDATE, payload: promoList});
          });
        }
        //FILTERING BY LOCATION
        else if (sf == 'Location') {
          //console.log('Filtering by location...');
          return dispatch(userGetPromosByLocation(uid, pf, sf, fol));
        }
        //FILTER BY CATEGORY
        else {
          firebase.database().ref(`/posts`).orderByChild(`category`).equalTo(sf).on('value', snapshot => {
            let promoList = [];
            let counter = 0;
            snapshot.forEach(child_node => {
              var child_key = child_node.key;
              promoList.splice(0,0,{ ...child_node.val(), id: counter, pid: child_key});
              counter++;
            });
            //console.log(promoList)
            dispatch({ type: USER_PROMOS_UPDATE, payload: promoList});
          });
        }
      }
    }

    //FILTERING BY COUPONS
    else {
      //NO FILTER
      if (sf == 'All') {
        firebase.database().ref(`/Coupons`).on('value', snapshot => {
          let couponList = [];
          let counter = 0;
          snapshot.forEach(child_node => {
            var child_key = child_node.key;
            couponList.splice(0,0,{ ...child_node.val(), id: counter, isCoupon: true, pid: child_key});
            counter++;
          });
          dispatch({ type: USER_PROMOS_UPDATE, payload: couponList});
        });
      }
      //FILTER BY CATEGORY
      else {
        //FILTERING BY FAVORITES(FOLLOWS)
        if (sf == 'Favorites') {
          firebase.database().ref(`/Coupons`).on('value', snapshot => {
            let promoList = [];
            let counter = 0;
            snapshot.forEach(child_node => {
              if(fol){
              var child_key = child_node.key;
              //console.log('Looking at filtering by favorites...-----------');
              //console.log(fol);
              //console.log(child_node.val().businessID);
              if (child_node.val().businessID in fol) {
                promoList.splice(0,0,{ ...child_node.val(), id: counter, isCoupon: true, pid: child_key});
                counter++;
              }
            }});
            //console.log(promoList)
            //console.log("Dispatching Promos...");
            dispatch({ type: USER_PROMOS_UPDATE, payload: promoList});
          });
        }
        //FILTERING BY LOCATION
        else if (sf == 'Location') {
          console.log('Filtering Coupons by location...');
          return dispatch(userGetCouponsByLocation(uid, pf, sf, fol));
        }
        //
        else {
          firebase.database().ref(`/Coupons`).orderByChild(`category`).equalTo(sf).on('value', snapshot => {
            let couponList = [];
            let counter = 0;
            snapshot.forEach(child_node => {
              var child_key = child_node.key;
              couponList.splice(0,0,{ ...child_node.val(), id: counter, isCoupon: true, pid: child_key});
              counter++;
            });
            //console.log(promoList)
            dispatch({ type: USER_PROMOS_UPDATE, payload: couponList});
          });
        }
      }
    }
  }
}

//Filter promos by user location, locations near user first
export const userGetPromosByLocation = (uid, pf, sf, fol) => {
  return (dispatch) => {
  //console.log('at user get promos by location');
  navigator.geolocation.getCurrentPosition(
    (position) => {
    //console.log("Getting user location...");
    //console.log('Getting User lat...');
    var lat1 = position.coords.latitude; //user latitude
    //console.log('User lat ' + lat1);
    //console.log('Getting User long...');
    var lon1 = position.coords.longitude; //user longitude
    //console.log('User long ' + lon1);
    //console.log('User Location OK');
    //console.log('Entering user get promos by location');
    firebase.database().ref(`/users`).on('value', snapshot => {
      var businessList = [];
      var counter = 0;
      snapshot.forEach(child_node => {
        var child_key = child_node.key;
        var business = child_node.val();
        var lat2 = 0; //business latitude
        var lon2 = 0; //business longitude
        if (business.type == 'Business') {
          counter++;
          //businessList.splice(0,0,{...business});
          lat2 = business.latitude;
          lon2 = business.longitude;
          //console.log('business lat ' + lat2);
          //console.log('business long ' + lon2);
          const d = haversine({latitude: lat2, longitude: lon2}, {latitude: lat1, longitude: lon1}, {unit: 'meter'})*3.28084;
          //console.log('distance from business: ' + d);
          businessList.splice(0,0,{ ...child_node.val(), id: counter, pid: child_key, disFromUser: d});
        }
      }
    );
    firebase.database().ref(`posts/`).on('value', snapshot2 => {
      let promoList = [];
      let counter2 = 0;
      //console.log(businessList)
      snapshot2.forEach(child_node2 => {
        counter2++;
        for (var i = 0, l = businessList.length; i < l; i++) {
          var obj = businessList[i];
          //console.log(child_node2.val().businessID)
          //console.log(obj.pid)
          if ( child_node2.val().businessID === obj.pid) {
            promoList.splice(0,0,{ ...child_node2.val(), id: counter2, dfu: obj.disFromUser})
          }
        }
      })
      //console.log('list before sorting by distance from usr: ');
      //console.log(promoList)
      promoList = sortObj(promoList, 'dfu');
      //console.log('list after sorting by distance from usr ');
      //console.log(promoList)
      //  console.log('Dispatching')
      dispatch({ type: USER_PROMOS_UPDATE, payload: promoList });
    });
    });
          });
};
};

//Filter coupons by user location, locations near user first
export const userGetCouponsByLocation = (uid, pf, sf, fol) => {
  return (dispatch) => {
  //console.log('at user get promos by location');
  navigator.geolocation.getCurrentPosition(
    (position) => {
    //console.log("Getting user location...");
    //console.log('Getting User lat...');
    var lat1 = position.coords.latitude; //user latitude
    //console.log('User lat ' + lat1);
    //console.log('Getting User long...');
    var lon1 = position.coords.longitude; //user longitude
    //console.log('User long ' + lon1);
    //console.log('User Location OK');
    //console.log('Entering user get promos by location');
    firebase.database().ref(`/users`).on('value', snapshot => {
      var businessList = [];
      var counter = 0;
      snapshot.forEach(child_node => {
        var child_key = child_node.key;
        var business = child_node.val();
        var lat2 = 0; //business latitude
        var lon2 = 0; //business longitude
        if (business.type == 'Business') {
          counter++;
          //businessList.splice(0,0,{...business});
          lat2 = business.latitude;
          lon2 = business.longitude;
          //console.log('business lat ' + lat2);
          //console.log('business long ' + lon2);
          const d = haversine({latitude: lat2, longitude: lon2}, {latitude: lat1, longitude: lon1}, {unit: 'meter'})*3.28084;
          //console.log('distance from business: ' + d);
          businessList.splice(0,0,{ ...child_node.val(), id: counter, pid: child_key, disFromUser: d});
        }
      }
    );
    firebase.database().ref(`Coupons/`).on('value', snapshot2 => {
      let couponList = [];
      let counter2 = 0;
      //console.log(businessList)
      snapshot2.forEach(child_node2 => {
        counter2++;
        for (var i = 0, l = businessList.length; i < l; i++) {
          var obj = businessList[i];
          //console.log(child_node2.val().businessID)
          //console.log(obj.pid)
          if ( child_node2.val().businessID === obj.pid) {
            couponList.splice(0,0,{ ...child_node2.val(), id: counter2, dfu: obj.disFromUser, isCoupon: true})
          }
        }
      })
      //console.log('list before sorting by distance from usr: ');
      //console.log(promoList)
      couponList = sortObj(couponList, 'dfu');
      //console.log('list after sorting by distance from usr ');
      console.log(couponList)
      console.log('Dispatching')
      dispatch({ type: USER_PROMOS_UPDATE, payload: couponList });
    });
    });
          });
};
};

export const inviteFriend = (email, uid, name) => {
  return (dispatch) => {
    const email_invite = encodeURIComponent(email.trim());
    const username = encodeURIComponent(name.trim());
    const req_url = 'https://us-central1-puntos-capstone2017.cloudfunctions.net/sendInviteEmail?uid=' + uid + '&username=' + username + '&email=' + email;
    dispatch({ type: USER_MAIN_UPDATE, payload: { prop: 'inviteLoading', value: true }});
    //console.log(req_url)
    axios.get(req_url)
      .then(response => {

        if(response.data.inviteSent){
         dispatch({ type: USER_MAIN_UPDATE, payload: { prop: 'inviteLoading', value: false }});
         dispatch({ type: USER_MAIN_UPDATE, payload: { prop: 'inviteEmail', value: '' }});
         Alert.alert('Invite Sent!',response.data.message,
         {text: 'OK'});
      } else {
        dispatch({ type: USER_MAIN_UPDATE, payload: { prop: 'inviteLoading', value: false }});
        dispatch({ type: USER_MAIN_UPDATE, payload: { prop: 'inviteEmail', value: '' }});
        Alert.alert('Error!',response.data.message,
        {text: 'OK'});
      }
  }).catch((error)=>{
    //console.log(error)
    dispatch({ type: USER_MAIN_UPDATE, payload: { prop: 'inviteLoading', value: false }});
    dispatch({ type: USER_MAIN_UPDATE, payload: { prop: 'inviteEmail', value: '' }});
    Alert.alert('Error!','Failed request. Try again later.',
    {text: 'OK'});
  });
};
};

export const getPoints = (uid, code, email) => {
  return (dispatch) => {
    const code_trimmed = encodeURIComponent(code.trim());
    const req_url = 'https://us-central1-puntos-capstone2017.cloudfunctions.net/getPoints?uid=' + uid + '&code=' + code_trimmed + '&email=' + email;
    dispatch({ type: USER_MAIN_UPDATE, payload: { prop: 'promoLoading', value: true }});
    //console.log(req_url)
    axios.get(req_url)
      .then(response => {
        if(response.data.gotPoints){
         dispatch({ type: USER_MAIN_UPDATE, payload: { prop: 'promoLoading', value: false }});
         dispatch({ type: USER_MAIN_UPDATE, payload: { prop: 'promoCode', value: '' }});
         Alert.alert('Congratulations!','You just collected ' + response.data.points + '! Keep it up!',
         {text: 'OK'});
      } else {
        dispatch({ type: USER_MAIN_UPDATE, payload: { prop: 'promoLoading', value: false }});
        dispatch({ type: USER_MAIN_UPDATE, payload: { prop: 'promoCode', value: '' }});
        Alert.alert('Error!',response.data.message,
        {text: 'OK'});
      }
  }).catch((error)=>{
    console.log(error)
    dispatch({ type: USER_MAIN_UPDATE, payload: { prop: 'promoLoading', value: false }});
    dispatch({ type: USER_MAIN_UPDATE, payload: { prop: 'promoCode', value: '' }});
    Alert.alert('Error!','Failed request. Try again later.',
    {text: 'OK'});
  });
};
};


//---------------------------------------------------------------//
//                                                               //
//---------------------------------------------------------------//

export const verifyCheckin = (user_id, businessID) => {
  return (dispatch) => {
    firebase.database().ref('/Checkins').orderByChild('uid').equalTo(user_id).on('value', snapshot => {
      snapshot.forEach(child_node => {
        if(businessID === child_node.val().businessID){
          dispatch({ type: USER_MAIN_UPDATE, payload: {prop: 'hasCheckedIn', value: true }});
        }
      });
    });
  }
}

export const shareItemUser = (uid, pid, isCoupon, image, text, businessID, businessName, username, birthdate, city) => {
  const like_obj = {[uid]: 1};
  var shareContent = {
    contentType: 'link',
    contentUrl: 'https://firebasestorage.googleapis.com/v0/b/puntos-capstone2017.appspot.com/o/logo%2FLogoSmall.png?alt=media&token=08d5bd23-ddfe-435c-8a35-b9cce394c13c',
    quote: '',
    title: ''
  };
  const today = new Date().toISOString();
  const age = (moment(new Date(today)).diff(moment(new Date(birthdate)), 'minutes')/525600).toFixed(0);
  var new_event = { businessName: businessName, date: new Date().toISOString() ,
    eventType: '', username: username, city: city, age: age, businessID: businessID };
  const share_obj = {[uid]: 1};
  return (dispatch) => {
  if (isCoupon){
    new_event.eventType = 'shareCoupon';
    shareContent.title = businessName;
    shareContent.quote = text + '\n' + 'Get the puntOs app now and start saving with this coupon by ' + businessName ;
    if(image){
      shareContent.contentUrl = image;
    }
    ShareDialog.canShow(shareContent).then((canShow)=> {
      if(canShow){
        ShareDialog.show(shareContent).then((response)=>{
          if(response.isCancelled){
            Alert.alert('Share was cancelled', '', {text: 'OK'});
          }
          else {
            firebase.database().ref(`/Coupons/${pid}`).child('sharedBy').update(share_obj).then(()=>{
              firebase.database().ref('/Events/').push(new_event);
              Alert.alert('Coupon Shared!', 'You can review the post in your facebook app.', {text: 'OK'});
            }).catch((error) => {
              Alert.alert('Error!', 'Could not share coupon.', {text: 'OK'});
          });
        }}).catch((error)=>{
          Alert.alert('Error!', 'Could not share coupon.', {text: 'OK'});
        });
      }
    })
  } else {
    new_event.eventType = 'sharePromo';
    shareContent.title = businessName;
    shareContent.quote = text + '\n' + 'Never miss a beat!' + '\n' + 'Get the puntOs app now and follow your favorite businesses for promotions, events and coupons!' +'\n'+ businessName ;
    if(image){
      shareContent.contentUrl = image;
    }
    ShareDialog.canShow(shareContent).then((canShow)=> {
      if(canShow){
        ShareDialog.show(shareContent).then((response)=>{
          if(response.isCancelled){
            Alert.alert('Share was cancelled', '', {text: 'OK'});
          }
          else {
            firebase.database().ref(`/posts/${pid}`).child('sharedBy').update(share_obj).then(()=>{
              firebase.database().ref('/Events/').push(new_event);
              Alert.alert('Promo Shared!', 'You can review the post in your facebook app.', {text: 'OK'});
            }).catch((error) => {
              Alert.alert('Error!', 'Could not share coupon.', {text: 'OK'});
          });
      }
    }).catch((error)=>{
      Alert.alert('Error!', 'Could not share promo.', {text: 'OK'});
    });
  }
  });}
  };
};


export const checkin = (user_id, businessID, username) => {
  return (dispatch) => {navigator.geolocation.getCurrentPosition(
  (position) => {
    //console.log(businessID)
    //console.log(user_id)
    //console.log(username)
    const user_name = encodeURIComponent(username.trim())
    const req_url = 'https://us-central1-puntos-capstone2017.cloudfunctions.net/checkIn?uid=' + user_id + '&bid=' + businessID + '&latitude=' + position.coords.latitude + '&longitude=' + position.coords.longitude + '&username=' + user_name;
    //console.log(req_url)
    axios.get(req_url)
      .then(response => {
        if( response.data.checkedIn){
         dispatch({ type: USER_MAIN_UPDATE, payload: { prop: 'checkinError', value: '' }});
         dispatch({ type: USER_MAIN_UPDATE, payload: { prop: 'checkin', value: false }});
         Alert.alert('Check-in:','Check-in Successful!',
         [{text: 'OK', onPress: () => {

         }}]);
         Actions.UserBusinessProfile();

      } else {
         dispatch({ type: USER_MAIN_UPDATE, payload: { prop: 'checkinError', value: response.data.message } });
         dispatch({ type: USER_MAIN_UPDATE, payload: { prop: 'checkin', value: false}});
         Alert.alert('Check-in:','Check-in failed: '+ response.data.message,
         [{text: 'OK', onPress: () => {

         }}]);
         Actions.UserBusinessProfile();
      }
    }).catch((error)=>{
      console.log(error)
    });})
  };
};

export const userLikeItem = (uid, pid, isCoupon) => {
  const like_obj = {[uid]: 1};
  if (isCoupon){
    return (dispatch) => {
      firebase.database().ref(`/Coupons/${pid}`).child('likedBy').update(like_obj).catch((error) => {
      Alert.alert('Could not process like at this time', 'Sorry', {text: 'OK'});
    });};
  } else {
  return (dispatch) => {
    firebase.database().ref(`/posts/${pid}`).child('likedBy').update(like_obj).catch((error) => {
    Alert.alert('Could not process like at this time', 'Sorry', {text: 'OK'});
  });};}
};

export const userUnlikeItem = (uid, pid, isCoupon) => {
  if(isCoupon){
    return (dispatch) => {
      firebase.database().ref(`/Coupons/${pid}`).child('likedBy').child(uid).remove().catch((error) => {
      Alert.alert('Could not process unlike at this time', 'Sorry', {text: 'OK'});
    });};
  }else {
  return (dispatch) => {
    firebase.database().ref(`/posts/${pid}`).child('likedBy').child(uid).remove().catch((error) => {
    Alert.alert('Could not process unlike at this time', 'Sorry', {text: 'OK'});
  });};}
};

export const getSocialPosts = () => {
  return (dispatch) => {
    let socialList =[];
    firebase.database().ref(`/Events`).on('value', snapshot =>  {
      let counter = 0;
      snapshot.forEach(child_node => {
        var child_key = child_node.key;
        socialList.splice(0,0,{ ...child_node.val(), id: counter, isCoupon: true, pid: child_key});
        counter++;
      });
      socialList = sortObj(socialList, 'date');
      socialList.reverse();
      dispatch({ type: USER_SOCIALS_UPDATE, payload: socialList});
    });
  };
};

export const getLeaderboard = (uid) => {
  return (dispatch) => {
    let leaderList = [];
    firebase.database().ref(`/userRewards`).orderByChild(`points`).on('value', snapshot => {
      let counter = 0;
      snapshot.forEach(child_node => {
          var child_key = child_node.key;
          var current_level = 0;
          var points = child_node.val().points;
          counter++;
          for(var i=0; i<levels.length; i++){
            if(points>=levels[i] && points<levels[i+1]){
              current_level = i+1;}
            }
          leaderList.splice(0,0,{...child_node.val(), key: child_key, level: current_level});
      });
      leaderList = sortObj(leaderList, 'points');
      leaderList.reverse();
      //console.log("Leaderboard list:");
      //console.log(leaderList);
      var count = 0;
      leaderList.forEach(user => {
        if(user.key === uid){
          dispatch({ type: USER_MAIN_UPDATE, payload: {prop: 'rank', value: count+1} });
        }
        count++;
      })
      dispatch({ type: LEADERBOARD_UPDATE, payload: leaderList });
    });
  };
};

export const getFollowing = (uid) => {
  return (dispatch) => {
    //console.log('running it get following - inside action')
    let followingList = {};
    firebase.database().ref(`/users/${uid}/following`).on('value', snapshot => {
      //console.log('following list-------------');
      followingList = snapshot.val();
      //console.log('The following list at action: ' + followingList);
      dispatch({ type: GET_FOLLOWING, payload: followingList });
    });
  };
};

export const userFollowBusiness = (uid, bid, bname, bicon) => {
  var imgToUse = bicon;
  if (!bicon) {
    imgToUse = '';
  }
  const user_follow_obj = {[bid]: {['name']: bname, ['icon']: imgToUse}};
  const business_follow_obj = {[uid]: {['name']: bname, ['icon']: imgToUse}};
  //console.log('The like object: ' + like_obj);


  firebase.database().ref(`/users/${bid}`).child('followers').update(business_follow_obj).catch((error) => {
    Alert.alert('Could not process follow at this time', 'Sorry', {text: 'OK'});
  });


  return (dispatch) => {
    firebase.database().ref(`/users/${uid}`).child('following').update(user_follow_obj).catch((error) => {
      Alert.alert('Could not process follow at this time', 'Sorry', {text: 'OK'});
    });
  };
};

export const userUnfollowBusiness = (uid, bid) => {

  firebase.database().ref(`/users/${bid}`).child('following').child(uid).remove().catch((error) => {
    Alert.alert('Could not process unfollow at this time', 'Sorry', {text: 'OK'});
  });

  return (dispatch) => {
    firebase.database().ref(`/users/${uid}`).child('following').child(bid).remove().catch((error) => {
      Alert.alert('Could not process unfollow at this time', 'Sorry', {text: 'OK'});
    });
  };
};

export const switchAccountUser = (email, password) => {
  return (dispatch) => {
  dispatch({ type: USER_MAIN_UPDATE, payload: {prop: 'switchLoading', value: true}});
  const req_url = SWITCH_ACCOUNT+'?email='+email+'&password='+password;
  axios.get(req_url)
    .then(response => {
      const data = response.data;
      if(data.success){
        firebase.auth().signInWithEmailAndPassword(email, password)
          .then(user => {
            dispatch(
              { type: LOGIN_USER_SUCCESS, payload: user }
            );
            dispatch(
              { type: SET_PROFILE_UPDATE, payload: { prop: 'uid', value: user.uid } }
            );
            dispatch({ type: USER_MAIN_UPDATE, payload: {prop: 'switchLoading', value: false}});
            dispatch({ type: USER_MAIN_UPDATE, payload: {prop: 'switchPassword', value: ''}});
            Actions.settingProfile({type: 'reset'});
            //dispatch({type: USER_MAIN_UPDATE, payload: {prop: 'userType', value: ''}});
            //dispatch({type: USER_MAIN_UPDATE, payload: {prop: 'uid', value: ''}});
          }).catch((error) => {
            console.log(error)
          });
        //Alert.alert('Account Unlinked!',data.message,{text: 'OK'});
      } else{
        dispatch({ type: USER_MAIN_UPDATE, payload: {prop: 'switchLoading', value: false}});
        dispatch({ type: USER_MAIN_UPDATE, payload: {prop: 'switchPassword', value: ''}});
        Alert.alert('Unable to Switch!',data.message, {text: 'OK'});
      }
  });
};
};

export const getStats = (uid) => {
  return (dispatch) => {
    firebase.database().ref(`/userRewards/${uid}`).on('value', pointsObj => {
      var db_level = 0;
      firebase.database().ref(`/users/${uid}`).once('value', user=>{
        db_level = user.val().level;
      });
      const rewards = pointsObj.val();
      var accumulated = 0;
      if(rewards){
      if(rewards.hasOwnProperty('points')){
        accumulated = rewards.points;
      }
    }
      //console.log('points: ' + accumulated)
      dispatch({ type: USER_MAIN_UPDATE, payload: {prop: 'overallPoints', value: accumulated}});
      for(var i=0; i<levels.length; i++){
        if(accumulated>=levels[i] && accumulated<levels[i+1]){
          var current_level = i+1;
          dispatch({ type: USER_MAIN_UPDATE, payload: {prop: 'level', value: current_level }});
          //console.log('db level:' + db_level)
          //console.log('local level: ' + current_level)
          if(current_level != db_level){
            firebase.database().ref(`/users/${uid}`).once('value', user => {
              user.ref.update({level: current_level});
            }).then(()=>{
              Alert.alert('Level Up!','You are now in level'+current_level, {text: 'OK'});
            });}
          const percentage = (((accumulated - levels[i])/(levels[i+1]-levels[i]))*100).toFixed(0);
          dispatch({ type: USER_MAIN_UPDATE, payload: {prop: 'levelPercentage', value: percentage }});
          const remaining = (levels[i+1]-levels[i])-(accumulated - levels[i]);
          dispatch({ type: USER_MAIN_UPDATE, payload: {prop: 'pointsToNext', value: remaining }});
          return;
          }
        }
      });
    };
  };

export const getMyCheckins = (uid) => {
    return (dispatch) => {
      firebase.database().ref(`/Checkins/`).orderByChild('uid').equalTo(uid).on('value', snapshot => {
        let checkinList = [];
        let counter = 0;
        snapshot.forEach(child_node => {
          var child_key = child_node.key;
          checkinList.splice(0,0,{...child_node.val(), id: counter, key: child_key});
          counter++;
        });
        dispatch({type: USER_MAIN_UPDATE, payload: {prop: 'totalCheckins', value: Object.keys(checkinList).length}});
        //var shortList = checkinList.slice(0,3);
        //console.log(shortList)
        checkinList.forEach( checkin => {
          const businessID = checkin.businessID;
          var image = '';
          firebase.database().ref(`/users/${businessID}`).once('value', snapshot =>{
            if(snapshot.val().image){
              image = snapshot.val().image;
            }
            checkin['image'] = image;
          });
        });
        //dispatch({ type: USER_CHECKINS_UPDATE, payload: checkinList});
        var shortList = checkinList.slice(0,3);
        dispatch({type: USER_MAIN_UPDATE, payload: {prop: 'lastCheckins', value: shortList}});
      });
    };
};

export const viewImage = (image) => {
  return (dispatch) => {
      dispatch({type: USER_MAIN_UPDATE, payload:{prop: 'viewImage', value: true}});
      dispatch({type: USER_MAIN_UPDATE, payload:{prop: 'imageToView', value: image }});
  };
};

export const getMyCoupons = (uid) => {
    return (dispatch) => {
      firebase.database().ref(`/Redeems/`).orderByChild('uid').equalTo(uid).on('value', snapshot => {
        let couponList = [];
        let counter = 0;
        snapshot.forEach(child_node => {
          var child_key = child_node.key;
          couponList.splice(0,0,{...child_node.val(), id: counter, key: child_key});
          counter++;
        });
        dispatch({type: USER_MAIN_UPDATE, payload: {prop: 'totalCoupons', value: Object.keys(couponList).length}});
        //console.log(shortList)
        couponList.forEach( coupon => {
          const couponID = coupon.couponID;
          var image = '';
          firebase.database().ref(`/Coupons/${couponID}`).once('value', snapshot =>{
            if(snapshot.val().icon){
              image = snapshot.val().icon;
            }
            coupon['image'] = image;
            coupon['businessName'] = snapshot.val().name;
            coupon['text'] = snapshot.val().text;
          });
        });
        dispatch({type: USER_MAIN_UPDATE, payload: {prop: 'my_coupons', value: couponList}});
        var shortList = couponList.slice(0,3);
        dispatch({type: USER_MAIN_UPDATE, payload: {prop: 'lastCoupons', value: shortList}});
        //console.log('shortList: ')
        //console.log(shortList)
      })
    };
};

export const getMyReviewCount = (uid) => {
    return (dispatch) => {
      firebase.database().ref(`/Reviews/`).orderByChild('uid').equalTo(uid).on('value', snapshot => {
        let reviewList = [];
        let counter = 0;
        snapshot.forEach(child_node => {
          var child_key = child_node.key;
          reviewList.splice(0,0,{...child_node.val(), id: counter, key: child_key});
          counter++;
        });
        dispatch({type: USER_MAIN_UPDATE, payload: {prop: 'totalReviews', value: Object.keys(reviewList).length}});
      });
    };
  };

export const updateUserProfilePic = (image_path, uid) =>{
  return (dispatch) => {
    dispatch({type: USER_MAIN_UPDATE, payload: {prop: 'uploadLoading', value: true}});
    dispatch({type: USER_MAIN_UPDATE, payload: {prop: 'uploadError', value: ''}});
    const _today = new Date().getTime();
    Utils.uploadImage(image_path, `${_today+uid}.jpg` ).then((response) => {
      firebase.database().ref(`/users/${uid}`).update({image: response}).then(()=>{
        dispatch({type: USER_MAIN_UPDATE, payload:{prop: 'uploadLoading', value: false}});
        dispatch({type: USER_MAIN_UPDATE, payload:{prop: 'showPhotos', value: false}});
        dispatch({type: USER_MAIN_UPDATE, payload:{prop: 'photoSelected', value: null}});
        dispatch({type: USER_MAIN_UPDATE, payload:{prop: 'photoSelectedKey', value: null}});
      }).catch((error)=>{
        dispatch({type: USER_MAIN_UPDATE, payload:{prop: 'uploadLoading', value: false}});
        dispatch({type: USER_MAIN_UPDATE, payload:{prop: 'uploadError', value: 'Could not upload image.'}});
      });

      firebase.database().ref(`/userRewards/${uid}`).update({icon: response});
  }).catch((error)=>{
    dispatch({type: USER_MAIN_UPDATE, payload:{prop: 'uploadLoading', value: false}});
    dispatch({type: USER_MAIN_UPDATE, payload:{prop: 'uploadError', value: 'Could not upload image.'}});
  });
};
};

export const verifyForPreviouslyReview = (user_id, businessID) => {
  return (dispatch) => {
    var flag = 0;
    firebase.database().ref('/Reviews').orderByChild('uid').equalTo(user_id).on('value', snapshot => {
      snapshot.forEach(child_node => {
        if(businessID === child_node.val().businessID){
           flag =1;
        }
      });
      if(flag === 0 ){
        dispatch({type: POST_REVIEW_CHANGE, payload: {prop: "businessID", value: businessID}});
        dispatch({type: USER_MAIN_UPDATE, payload: {prop: 'hasReviewed', value: false}});
        dispatch({ type: POST_REVIEW_CHANGE, payload: { prop: 'uid', value: user_id}});
        console.log('Has not reviewed')
        //dispatch({ type: POST_REVIEW_CHANGE, payload: { prop: 'businessName', value: businessName }});
      //  Actions.PostReviewView();
      } else {
        console.log('Has reviewed')
        dispatch({type: USER_MAIN_UPDATE, payload: {prop: 'hasReviewed', value: true }});
        //Alert.alert('Notification:','Already Posted a Review on Business',
        //[{text: 'OK', onPress: () => {

        //}}]);
      }
    });
  };
};

export const getNotifications = (user_id) => {
  return (dispatch) => {
    let notifications = [];
    firebase.database().ref(`/Notifications/${user_id}`).on('value', snapshot => {
      let counter = 0;
      snapshot.forEach(child_node => {
        if(child_node.val().uid === user_id){
          notifications.splice(0,0,{ ...child_node.val(), id: counter });
          counter++;
        }
      });
      notifications = sortObj(notifications, 'date');
      notifications.reverse();
      dispatch({ type: USER_MAIN_UPDATE, payload: {prop: 'notificationList', value: notifications }});
    });
  }
};

function sortObj(list, key) {
  function compare(a, b) {
      a = a[key];
      b = b[key];
      var type = (typeof(a) === 'string' ||
                  typeof(b) === 'string') ? 'string' : 'number';
      var result;
      if (type === 'string') result = a.localeCompare(b);
      else result = a - b;
      return result;
  }
  return list.sort(compare);
}
