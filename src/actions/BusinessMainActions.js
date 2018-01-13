import firebase from 'firebase';
import { Alert } from 'react-native';
import { BUSINESS_MAIN_UPDATE, VALIDATE_STATE_UPDATE, CREATE_PROMO_UPDATE, CREATE_COUPON_UPDATE,
  CREATE_COUPON_RESET, REVIEWS_UPDATE, BUSINESS_PROFILE_UPDATE, PROMOS_UPDATE,
  COUPONS_UPDATE, BUSINESS_METRICS_UPDATE, SET_PROFILE_UPDATE, LOGIN_USER_SUCCESS } from './types';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import { ShareDialog } from 'react-native-fbsdk';
var Utils = require('../components/common/Utils');
var moment = require('moment');
const LINK_ACCOUNT = 'https://us-central1-puntos-capstone2017.cloudfunctions.net/linkAccount';
const UNLINK_ACCOUNT = 'https://us-central1-puntos-capstone2017.cloudfunctions.net/unlinkAccount';
const SWITCH_ACCOUNT = 'https://us-central1-puntos-capstone2017.cloudfunctions.net/switchAccount';

export const businessMainUpdate = ({ prop, value }) => {
  return {
    type: BUSINESS_MAIN_UPDATE,
    payload: { prop, value }
  };
};

export const validateStateUpdate = ({ prop, value }) => {
  return {
    type: VALIDATE_STATE_UPDATE,
    payload: { prop, value }
  };
};

export const createPromoStateUpdate = ({ prop, value }) => {
  return {
    type: CREATE_PROMO_UPDATE,
    payload: { prop, value }
  };
};

export const createCouponStateUpdate = ({ prop, value }) => {
  return {
    type: CREATE_COUPON_UPDATE,
    payload: { prop, value }
  };
};

export const businessProfileUpdate = ({ prop, value }) => {
  return {
    type: BUSINESS_PROFILE_UPDATE,
    payload: { prop, value }
  };
};

export const updateProfilePic = (image_path, uid) =>{
  return (dispatch) => {
    dispatch({type: BUSINESS_MAIN_UPDATE, payload: {prop: 'uploadLoading', value: true}});
    dispatch({type: BUSINESS_MAIN_UPDATE, payload: {prop: 'uploadError', value: ''}});
    const _today = new Date().getTime();
    Utils.uploadImage(image_path, `${_today+uid}.jpg` ).then((response) => {
      firebase.database().ref(`/users/${uid}`).update({image: response}).then(()=>{
        dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'uploadLoading', value: false}});
        dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'showPhotos', value: false}});
        dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'photoSelected', value: null}});
        dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'photoSelectedKey', value: null}});
      }).catch((error)=>{
        dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'uploadLoading', value: false}});
        //dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'uploadError', value: error}});
        dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'uploadError', value: 'Could not upload image.'}});
      });

  }).catch((error)=>{
    dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'uploadLoading', value: false}});
    dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'uploadError', value: 'Could not upload image.'}});
    //dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'uploadError', value: error}});
  });
};
};

export const businessExists = (uid) => {
      return (dispatch) => {
      firebase.database().ref(`/users/${uid}`).once('value', snapshot => {
        const user = snapshot.val();
        //console.log(user.email)
        if(user){
          Actions.UserBusinessProfile();
        } else {
          Alert.alert('User not Found!','This business Account No Longer Exists', {text: 'OK'});
        }
      });
        };
      };


export const getBusinessProfile = (uid) => {
      return (dispatch) => {
      firebase.database().ref(`/users/${uid}`).on('value', snapshot => {
        const user = snapshot.val();
        //console.log('getBusinessProfile ' + uid)
        //console.log(user)
        userObj = {...user, uid: uid};
        //console.log(userObj);
        dispatch({ type: BUSINESS_MAIN_UPDATE, payload: { prop: 'user', value: userObj }});
      });
        };
      };

export const getReviews = (uid) => {
  return (dispatch) => {
    //firebase.database().ref(`/Reviews`).orderByChild(`businessID`).equalTo(uid).on('value', snapshot => {
    firebase.database().ref(`/Reviews`).orderByChild(`businessID`).equalTo(uid).on('value', snapshot => {
      let reviewList = [];
      let counter = 0;
      snapshot.forEach(child_node => {
        reviewList.splice(0,0,{...child_node.val(), id: counter, isCoupon: false});
        counter++;
      });
      //console.log(reviewList)
      dispatch({ type: REVIEWS_UPDATE, payload: reviewList});
  });
};
};

export const getCoupons = (uid) => {
  return (dispatch) => {
    //firebase.database().ref(`/Reviews`).orderByChild(`businessID`).equalTo(uid).on('value', snapshot => {
    firebase.database().ref(`/Coupons`).orderByChild(`businessID`).equalTo(uid).on('value', snapshot => {
      let couponsList = [];
      let counter = 0;
      snapshot.forEach(child_node => {
        var child_key = child_node.key;
        couponsList.splice(0,0,{...child_node.val(), id: counter, isCoupon: true, pid: child_key});
        counter++;
      });
      //console.log(couponsList)
      dispatch({ type: COUPONS_UPDATE, payload: couponsList});
  });
};
};

export const setExpired = (pid) => {
  return (dispatch) => {
    firebase.database().ref(`/Coupons/${pid}`).update({expired: true});
};
};

export const getCheckinsToday = (uid) => {
      return (dispatch) => {
      const _today = new Date().toISOString().substring(0,10);
      firebase.database().ref(`/Checkins`).orderByChild(`queryparam`).equalTo(uid+_today).on('value', snapshot => {
        //console.log(snapshot.val())
        const checkins_today = snapshot.val();
        if (checkins_today != null){
        dispatch({ type: BUSINESS_MAIN_UPDATE, payload: { prop: 'checkin_count', value: Object.keys(checkins_today).length }});
      }
        //dispatch({ type: BUSINESS_MAIN_UPDATE, payload: { prop: 'user', value: user }});
      });
        };
      };

export const getCouponsToday = (uid) => {
      return (dispatch) => {
      const _today = new Date().toISOString().substring(0,10);
      firebase.database().ref(`/Redeems`).orderByChild(`queryparam`).equalTo(uid+_today).on('value', snapshot => {
        const coupons_today = snapshot.val();
        if ( coupons_today != null){
        dispatch({ type: BUSINESS_MAIN_UPDATE, payload: { prop: 'coupon_count', value: Object.keys(coupons_today).length }});
      }
        //dispatch({ type: BUSINESS_MAIN_UPDATE, payload: { prop: 'user', value: user }});
      });
        };
      };

export const createPromo = (promo_text, promo_media, business_name, uid, category, user_image) => {
  return (dispatch) => {
    var user_icon = user_image;
    if(!user_icon){
      user_icon = '';
    }
    const image_path = promo_media;
    dispatch({ type: CREATE_PROMO_UPDATE, payload: { prop: 'loading', value: true }});
    dispatch({ type: CREATE_PROMO_UPDATE, payload: { prop: 'error', value: '' }});
    const _today = new Date();
    const _todayISO = _today.toISOString();
    const _todayMil = _today.getTime();
    if(image_path) {
      Utils.uploadImage(image_path, `${_todayMil+uid}.jpg` ).then((response) => {
      firebase.database().ref(`/posts`).once('value', snapshot => {
      const new_post = { text: promo_text, image: response, businessID: uid, date: _todayISO,
        name: business_name, icon: user_icon, likedBy: '', sharedBy: '', category: category };
      snapshot.ref.push(new_post).then(() => {
        dispatch({ type: CREATE_PROMO_UPDATE, payload: {prop: 'loading', value: false}});
        Alert.alert('Promotion Posted!','', {text: 'OK'})
        dispatch({ type: CREATE_PROMO_UPDATE, payload: {prop: 'promo_text', value: ''}})
        dispatch({ type: CREATE_PROMO_UPDATE, payload: {prop: 'promo_media', value: ''}})
      }).catch((error) => {
        dispatch({ type: CREATE_PROMO_UPDATE, payload: { prop: 'loading', value: false }});
        dispatch({ type: CREATE_PROMO_UPDATE, payload: { prop: 'error', value: 'Could not post promotion' }});
      });}).catch((error) => {
        dispatch({ type: CREATE_PROMO_UPDATE, payload: { prop: 'loading', value: false }});
        dispatch({ type: CREATE_PROMO_UPDATE, payload: { prop: 'error', value: 'Could not access data' }});
      });}).catch((error) => {
        dispatch({ type: CREATE_PROMO_UPDATE, payload: { prop: 'loading', value: false }});
        dispatch({ type: CREATE_PROMO_UPDATE, payload: { prop: 'error', value: 'Could not upload image.' }});
      });
    } else{
      firebase.database().ref(`/posts`).once('value', snapshot => {
      const new_post = { text: promo_text, image: '', businessID: uid, date: _todayISO,
        name: business_name, icon: user_icon, likedBy: '', sharedBy: '', category: category };
      snapshot.ref.push(new_post).then(() => {
        dispatch({ type: CREATE_PROMO_UPDATE, payload: {prop: 'loading', value: false}});
        Alert.alert('Promotion Posted!','', {text: 'OK'})
        dispatch({ type: CREATE_PROMO_UPDATE, payload: {prop: 'promo_text', value: ''}})
        dispatch({ type: CREATE_PROMO_UPDATE, payload: {prop: 'promo_media', value: ''}})
      }).catch((error) => {
        dispatch({ type: CREATE_PROMO_UPDATE, payload: { prop: 'loading', value: false }});
        dispatch({ type: CREATE_PROMO_UPDATE, payload: { prop: 'error', value: 'Could not post promotion' }});
      });}).catch((error) => {
        dispatch({ type: CREATE_PROMO_UPDATE, payload: { prop: 'loading', value: false }});
        dispatch({ type: CREATE_PROMO_UPDATE, payload: { prop: 'error', value: 'Could not access data' }});
      });
    }
  };
};

export const createCoupon = (coupon_state, business_name, uid, category, user_image) => {
  return (dispatch) => {
    var user_icon = user_image;
    if(!user_icon){
      user_icon = '';
    }
    const image_path = coupon_state.coupon_media;
    dispatch({ type: CREATE_COUPON_UPDATE, payload: { prop: 'loading', value: true }});
    dispatch({ type: CREATE_COUPON_UPDATE, payload: { prop: 'error', value: '' }});
    const _today = new Date();
    const _todayISO = _today.toISOString();
    const _todayMil = _today.getTime();
    if(image_path){
      Utils.uploadImage(image_path, `${_todayMil+uid}.jpg` ).then((response) => {
      firebase.database().ref(`/Coupons`).once('value', snapshot => {
      const post_date = _todayISO;
      //console.log(post_date.toISOString())
      let expiration_date = new Date();
      if( coupon_state.coupon_expiration_type === 'minutes'){
          expiration_date = moment(expiration_date).add(coupon_state.coupon_expiration, 'm');
      } else if( coupon_state.coupon_expiration_type === 'hours'){
          expiration_date = moment(expiration_date).add(coupon_state.coupon_expiration, 'h');
      } else if( coupon_state.coupon_expiration_type === 'days') {
          expiration_date = moment(expiration_date).add(coupon_state.coupon_expiration, 'd');
      }
      const expire_coupon = expiration_date.toISOString();
      const new_coupon = { text: coupon_state.coupon_text , image: response , businessID: uid, category: category,
        date: post_date, name: business_name, icon: user_icon, likedBy: '', sharedBy: '', expires: expire_coupon, expired: false,
        pointsValue: coupon_state.points_value, title: coupon_state.coupon_title, claimLimit: coupon_state.claim_limit, claimedBy: '' };
      snapshot.ref.push(new_coupon).then(() => {
        dispatch({ type: CREATE_COUPON_UPDATE, payload: {prop: 'loading', value: false}});
        Alert.alert('Coupon Posted!','Coupon will expire on ' + expire_coupon.substring(0,10) + ' at ' + expire_coupon.substring(11,16), {text: 'OK'})
        dispatch({ type: CREATE_COUPON_RESET });
        dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'showPhotos', value: false}});
        dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'photoSelected', value: null}});
        dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'photoSelectedKey', value: null}});
      }).catch((error) => {
        dispatch({ type: CREATE_COUPON_UPDATE, payload: { prop: 'loading', value: false }});
        dispatch({ type: CREATE_COUPON_UPDATE, payload: { prop: 'error', value: 'Could not post coupon' }});
      });}).catch((error) => {
        dispatch({ type: CREATE_COUPON_UPDATE, payload: { prop: 'loading', value: false }});
        dispatch({ type: CREATE_COUPON_UPDATE, payload: { prop: 'error', value: 'Could not access data' }});
      });}).catch((error) => {
    dispatch({ type: CREATE_COUPON_UPDATE, payload: { prop: 'loading', value: false }});
    dispatch({ type: CREATE_COUPON_UPDATE, payload: { prop: 'error', value: 'Could not upload image.' }});
  });} else {
    firebase.database().ref(`/Coupons`).once('value', snapshot => {
    const post_date = _todayISO;
    //console.log(post_date.toISOString())
    let expiration_date = new Date();
    if( coupon_state.coupon_expiration_type === 'minutes'){
        expiration_date = moment(expiration_date).add(coupon_state.coupon_expiration, 'm');
    } else if( coupon_state.coupon_expiration_type === 'hours'){
        expiration_date = moment(expiration_date).add(coupon_state.coupon_expiration, 'h');
    } else if( coupon_state.coupon_expiration_type === 'days') {
        expiration_date = moment(expiration_date).add(coupon_state.coupon_expiration, 'd');
    }
    const expire_coupon = expiration_date.toISOString();
    const new_coupon = { text: coupon_state.coupon_text , image: '', businessID: uid, category: category,
      date: post_date, name: business_name, icon: user_icon, likedBy: '', sharedBy: '', expires: expire_coupon, expired: false,
      pointsValue: coupon_state.points_value, title: coupon_state.coupon_title, claimLimit: coupon_state.claim_limit, claimedBy: '' };
    snapshot.ref.push(new_coupon).then(() => {
      dispatch({ type: CREATE_COUPON_UPDATE, payload: {prop: 'loading', value: false}});
      Alert.alert('Coupon Posted!','Coupon will expire on ' + expire_coupon.substring(0,10) + ' at ' + expire_coupon.substring(11,16), {text: 'OK'})
      dispatch({ type: CREATE_COUPON_RESET });
      dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'showPhotos', value: false}});
      dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'photoSelected', value: null}});
      dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'photoSelectedKey', value: null}});
    }).catch((error) => {
      dispatch({ type: CREATE_COUPON_UPDATE, payload: { prop: 'loading', value: false }});
      dispatch({ type: CREATE_COUPON_UPDATE, payload: { prop: 'error', value: 'Could not post coupon' }});
    });}).catch((error) => {
      dispatch({ type: CREATE_COUPON_UPDATE, payload: { prop: 'loading', value: false }});
      dispatch({ type: CREATE_COUPON_UPDATE, payload: { prop: 'error', value: 'Could not access data' }});
    });}
  };
};

export const likeItem = (uid, pid, isCoupon) => {
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

export const shareItem = (uid, pid, isCoupon, image, text, businessName) => {
  const like_obj = {[uid]: 1};
  var shareContent = {
    contentType: 'link',
    contentUrl: 'https://firebasestorage.googleapis.com/v0/b/puntos-capstone2017.appspot.com/o/logo%2FLogoSmall.png?alt=media&token=08d5bd23-ddfe-435c-8a35-b9cce394c13c',
    quote: '',
    title: ''
  };
  const share_obj = {[uid]: 1};
  return (dispatch) => {
  if (isCoupon){
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



export const unlikeItem = (uid, pid, isCoupon) => {
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

export const editItem = (pid, isCoupon, expired) => {
  return (dispatch) => {
    if(isCoupon){
      dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'itemToEditType', value: 'Coupon'}});
      dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'itemToEditStatus', value: expired }});
    } else {
      dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'itemToEditType', value: 'Promo'}});
    }
    dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'itemToEdit', value: pid }});
    dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'edit', value: true }});
  };
};

export const viewImageBusiness = (image) => {
  return (dispatch) => {
      dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'viewImage', value: true}});
      dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'imageToView', value: image }});
  };
};

export const deactivateCoupon = (pid) => {
  return (dispatch) => {
    firebase.database().ref(`Coupons/${pid}`).once('value',snapshot=> {
      const set_expired = { expired: true };
      snapshot.ref.update(set_expired).then(()=>{
        Alert.alert('Coupon Deactivated!', 'People are no longer able to claim this coupon.', {text: 'OK'})
        dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'itemToEdit', value: null}});
        dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'edit', value: false }});
        dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'itemToEditType', value: ''}});
      }).catch(() => {
        Alert.alert('Error!', 'We were unable to deactivate your coupon. Try again later.', {text: 'OK'})
        dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'itemToEdit', value: null}});
        dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'edit', value: false }});
        dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'itemToEditType', value: ''}});
      });
    }).catch(()=>{
      Alert.alert('Error!', 'Unable to access coupon. Try again later.', {text: 'OK'})
      dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'itemToEdit', value: null}});
      dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'edit', value: false }});
      dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'itemToEditType', value: ''}});
    });
  };
};


export const deletePost = (pid) => {
  return(dispatch) => {
  firebase.database().ref(`posts/${pid}`).once('value',snapshot=> {
  snapshot.ref.remove().then(()=>{
    Alert.alert('Post Deleted!', 'People are no longer able to see this post.', {text: 'OK'})
    dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'itemToEdit', value: null}});
    dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'edit', value: false }});
    dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'itemToEditType', value: ''}});
  }).catch(() => {
    Alert.alert('Error!', 'We were unable to delete your post. Try again later.', {text: 'OK'})
    dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'itemToEdit', value: null}});
    dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'edit', value: false }});
    dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'itemToEditType', value: ''}});
  });
}).catch(()=>{
  Alert.alert('Error!', 'Unable to access post. Try again later.', {text: 'OK'})
  dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'itemToEdit', value: null}});
  dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'edit', value: false }});
  dispatch({type: BUSINESS_MAIN_UPDATE, payload:{prop: 'itemToEditType', value: ''}});
});
};
};


export const getPosts = (uid) => {
  return (dispatch) => {
    //firebase.database().ref(`/Reviews`).orderByChild(`businessID`).equalTo(uid).on('value', snapshot => {
    firebase.database().ref(`/posts`).orderByChild(`businessID`).equalTo(uid).on('value', snapshot => {
      let promoList = [];
      let counter = 0;
      snapshot.forEach(child_node => {
        var child_key = child_node.key;
        promoList.splice(0,0,{...child_node.val(), id: counter, pid: child_key});
        counter++;
      });

      dispatch({ type: PROMOS_UPDATE, payload: promoList});
  });
};
};

export const validateCoupon = (coupon_code, uid) => {
  return (dispatch) => {
  dispatch({ type: VALIDATE_STATE_UPDATE, payload: { prop: 'loading', value: true }});
  dispatch({ type: VALIDATE_STATE_UPDATE, payload: { prop: 'error', value: '' }});
  firebase.database().ref(`/Redeems`).orderByChild(`code`).equalTo(coupon_code).once('value', snapshot => {
    //console.log(snapshot.val())
    let redeemObj = '';
    let redeem_id = '';
    let coupon_id = '';
    snapshot.forEach(child_node => {
      redeemObj = child_node.val();
      redeem_id = child_node.key;
      coupon_id = redeemObj.couponID;
    });
    if(!redeemObj){
      dispatch({ type: VALIDATE_STATE_UPDATE, payload: {prop: 'loading', value: false}});
      dispatch({ type: VALIDATE_STATE_UPDATE, payload: {prop: 'error', value: 'Coupon code not found'}});
    } else if(redeemObj.businessID !== uid){
      dispatch({ type: VALIDATE_STATE_UPDATE, payload: {prop: 'loading', value: false}});
      dispatch({ type: VALIDATE_STATE_UPDATE, payload: {prop: 'error', value: 'Coupon not from this business.'}});
    } else if(redeemObj.used){
      dispatch({ type: VALIDATE_STATE_UPDATE, payload: {prop: 'loading', value: false}});
      dispatch({ type: VALIDATE_STATE_UPDATE, payload: {prop: 'error', value: 'Coupon code already used'}});
    }else if(!redeemObj.used){
      snapshot.ref.child(redeem_id).update({ used: true}).then(() => {
      firebase.database().ref(`/Coupons/${coupon_id}`).once('value', snapshot => {
        const response = snapshot.val();
        if(response) {
        const description = response.text;
        dispatch({ type: VALIDATE_STATE_UPDATE, payload: {prop: 'loading', value: false}});
        Alert.alert('Code Verified!', description, {text: 'OK'})
        dispatch({ type: VALIDATE_STATE_UPDATE, payload: {prop: 'code', value: ''}})
        }
        else {
          dispatch({ type: VALIDATE_STATE_UPDATE, payload: {prop: 'loading', value: false}});
          dispatch({ type: VALIDATE_STATE_UPDATE, payload: {prop: 'error', value: 'Coupon valid, error parsing response'}});
        }
      }
      )}).catch(() => {
      dispatch({ type: VALIDATE_STATE_UPDATE, payload: {prop: 'loading', value: false}});
      dispatch({ type: VALIDATE_STATE_UPDATE, payload: {prop: 'error', value: 'Could not verify code'}});})
    }
    //dispatch({ type: BUSINESS_MAIN_UPDATE, payload: { prop: 'user', value: user }});
  });
    };
};
/*
export const getMetrics = (uid) => {
  return (dispatch) => {
    firebase.database().ref(`/Metrics/${uid}`).on('value', snapshot => {
      const metrics = snapshot.val();
      dispatch({ type: BUSINESS_METRICS_UPDATE, payload: { prop: 'metrics', value: metrics }});
    });
  };
};
*/
export const unlinkAccount = (uid, linked_id) => {
  return (dispatch) => {
  const req_url = UNLINK_ACCOUNT+'?uid='+uid+'&linkedId='+linked_id;
  axios.get(req_url)
    .then(response => {
      const data = response.data;
      if(data.success){
        Alert.alert('Account Unlinked!',data.message,{text: 'OK'});
      } else{
        Alert.alert('Unable to Unlink!',data.message, {text: 'OK'});
      }
  });
};
};

export const switchAccount = (email, password) => {
  return (dispatch) => {
  dispatch({ type: BUSINESS_MAIN_UPDATE, payload: {prop: 'switchLoading', value: true}});
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
            dispatch({ type: BUSINESS_MAIN_UPDATE, payload: {prop: 'switchLoading', value: false}});
            Actions.settingProfile({type: 'reset'});
          }).catch((error) => {
            console.log(error)
          });
        //Alert.alert('Account Unlinked!',data.message,{text: 'OK'});
      } else{
        dispatch({ type: BUSINESS_MAIN_UPDATE, payload: {prop: 'switchLoading', value: false}});
        dispatch({ type: BUSINESS_MAIN_UPDATE, payload: {prop: 'switchPassword', value: ''}});
        Alert.alert('Unable to Switch!',data.message, {text: 'OK'});
      }
  });
};
};

export const linkAccount = (email, password, uid) => {
  return (dispatch) => {
  dispatch({ type: BUSINESS_MAIN_UPDATE, payload: {prop: 'linkLoading', value: true}});
  const req_url = LINK_ACCOUNT+'?uid='+uid+'&email='+email+'&password='+password;
  axios.get(req_url)
    .then(response => {
      dispatch({ type: BUSINESS_MAIN_UPDATE, payload: {prop: 'linkLoading', value: false}});
      dispatch({ type: BUSINESS_MAIN_UPDATE, payload: {prop: 'linkPassword', value: ''}});
      const data = response.data;
      if(data.success){
        Alert.alert('Account Linked!',data.message,{text: 'OK'});
      } else{
        Alert.alert('Unable to Link!',data.message, {text: 'OK'});
      }
  });
};
};

export const resetLocation = (uid) => {
  return (dispatch) => {
    navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      firebase.database().ref(`/users/${uid}`).on('value', snapshot => {
        snapshot.ref.update({longitude: longitude, latitude: latitude}).then(()=>{
          Alert.alert('Success!','Your business was relocated in our system.',{text: 'OK'});
        }).catch(()=>{
          Alert.alert('Error!','We were unable to relocate your business, try again later.',{text: 'OK'});
        });
      });
    });
    };
  };

  function getAgeDistribution(ageList) {
  var ageDistribution = {};
  var youngAgeCount = 0;
  var midAgeCount = 0;
  var seniorAgeCount = 0;
  for (age in ageList) {
    if (ageList[age] <= 25) {
      youngAgeCount++;
    }
    else if (ageList[age] >= 26 && ageList[age] <= 49) {
      midAgeCount++;
    }
    else {
      seniorAgeCount++;
    }
  }
  ageDistribution = {
    ['young']: youngAgeCount,
    ['mid']: midAgeCount,
    ['senior']: seniorAgeCount
  }
  return ageDistribution;
}

function getRegionDistribution(cityList) {
  var regionDistribution = {};
  var metroRegion = ['San Juan', 'Bayamon', 'Carolina', 'Trujillo Alto', 'Catano', 'Guaynabo'];
  var northRegion = ['Camuy', 'Hatillo', 'Arecibo', 'Barceloneta', 'Manati', 'Vega Baja', 'Vega Alta', 'Dorado', 'Toa Alta'];
  var southRegion = ['Guayanilla', 'Ponce', 'Santa Isabel', 'Salina', 'Arroyo', 'Patillas', 'Yauco', 'Penuelas', 'Villalba', 'Juana Diaz', 'Coamo', 'Guayama'];
  var eastRegion= ['Vieques', 'Culebra', 'Loiza', 'Gurabo', 'Juncos', 'Las Piedras', 'Canovanas', 'Rio Grande', 'Luquillo', 'Fajardo', 'Ceiba', 'Humacao', 'Naguabo', 'Maunabo', 'Yabucoa'];
  var westRegion = ['Aguadilla', 'Isabela', 'Rincon', 'Aguada', 'Moca', 'San Sebastian', 'Anasco', 'Las Marias', 'Mayaguez', 'Hormigueros', 'Maricao', 'Cabo Rojo', 'San German', 'Lajas', 'Sabana Grande'];
  var centerRegion = ['Aibonito', 'Aguas Buena', 'Cidra', 'Comerio', 'Corozal', 'Cayey', 'Naranjito', 'Barranquitas', 'Orocovis', 'Morovis', 'Ciales', 'Adjuntas', 'Florida', 'Lares', 'Utuado'];
  var metroRegionCount = 0;
  var northRegionCount = 0;
  var southRegionCount = 0;
  var eastRegionCount = 0;
  var westRegionCount = 0;
  var centerRegionCount = 0;
  var otherRegionCount = 0;

  for (city in cityList) {
    //console.log('The city: ' + cityList[city]);
    //console.log('RegionList: ');
    //console.log(metroRegion);
    if (metroRegion.includes(cityList[city])) {
      metroRegionCount++;
    }
    else if (northRegion.includes(cityList[city])) {
      northRegionCount++;
    }
    else if (southRegion.includes(cityList[city])) {
      southRegionCount++;
    }
    else if (eastRegion.includes(cityList[city])) {
      eastRegionCount++;
    }
    else if (westRegion.includes(cityList[city])) {
      westRegionCount++;
    }
    else if (centerRegion.includes(cityList[city])) {
      centerRegionCount++;
    }
    else {
      otherRegionCount++;
    }
  }
  regionDistribution = {
    ['metroRegion']: metroRegionCount,
    ['northRegion']: northRegionCount,
    ['southRegion']: southRegionCount,
    ['eastRegion']: eastRegionCount,
    ['westRegion']: westRegionCount,
    ['centerRegion']: centerRegionCount,
    ['otherRegion']: otherRegionCount,
  }
  return regionDistribution;
}

function getTimeDistribution(timeList) {
  var timeDistribution = {};
  var morningCount = 0; //This is the time from midnight to midday.
  var afternoonCount = 0; //From 12:00 hours to approximately 18:00 hours.
  var eveningCount = 0; //From approximately 18:00 hours to 00:00 hours.
  for (time in timeList) {
    let hour = timeList[time].substring(11,13);
    console.log(hour)
    hour = parseInt(hour);
    console.log('The hour: ' + hour);

    if (hour >= 0 && hour < 10) {
      morningCount++;
    }
    else if (hour >= 12 && hour < 18) {
      afternoonCount++;
    }
    else if (hour >= 18 && hour <= 23) {
      eveningCount++;
    }
  }
  timeDistribution = {
    ['morning']: morningCount,
    ['afternoon']:afternoonCount,
    ['evening']: eveningCount
  }
  return timeDistribution;
}

  export const getMetrics = (bid) => {
  return (dispatch) => {
  console.log('Getting business metrics for: ' + bid);
    var metricsObject = {};
    var ci_ageList = [];
    var ci_cityList = [];
    var ci_timeList = [];
    var s_ageList = [];
    var s_cityList = [];
    var r_ageList = [];
    var r_cityList = [];
    firebase.database().ref(`/Events`).orderByChild('businessID').equalTo(bid).on('value', snapshot => {
      snapshot.forEach(child_node => {
        let currentEventItem = child_node.val();
        if(currentEventItem.eventType == 'sharePromo' || currentEventItem.eventType == 'shareCoupon') {
          if(currentEventItem.businessID == bid) {
            s_ageList.push(currentEventItem.age);
            s_cityList.push(currentEventItem.city);
          }
        }
        else if (currentEventItem.eventType == 'redeem') {
          if(currentEventItem.businessID == bid) {
            r_ageList.push(currentEventItem.age);
            r_cityList.push(currentEventItem.city);
          }
        }
        else if (currentEventItem.eventType == 'checkIn') {
          if(currentEventItem.businessID == bid) {
            ci_ageList.push(currentEventItem.age);
            ci_cityList.push(currentEventItem.city);
            ci_timeList.push(currentEventItem.date);
          }
        }
      });
      console.log('Checkin ages:');
      console.log(ci_ageList);
      console.log('Checkin cities:');
      console.log(ci_cityList);
      console.log('Checkin times:');
      console.log(ci_timeList);
      console.log('Share ages:');
      console.log(s_ageList);
      console.log('Share cities:');
      console.log(s_cityList);
      console.log('Redeem ages:');
      console.log(r_ageList);
      console.log('Redeem cities:');
      console.log(r_cityList);

      //PERFORM ANALYTICS AND STORE IN METRICS OBJECT
      metricsObject = {
        ['checkinAgeDist']: getAgeDistribution(ci_ageList),
        ['checkinRegionDist']: getRegionDistribution(ci_cityList),
        ['checkinTimeDist']: getTimeDistribution(ci_timeList),
        ['shareAgeDist']: getAgeDistribution(s_ageList),
        ['shareRegionDist']: getRegionDistribution(s_cityList),
        ['redeemAgeDist']: getAgeDistribution(r_ageList),
        ['redeemRegionDist']: getRegionDistribution(r_cityList)
      }

      //CONFIRM METRICS OBJECT IS OK
      console.log('The metrics object before dispatching...');
      console.log(metricsObject);
      console.log('dispatching')
      dispatch({type: BUSINESS_METRICS_UPDATE, payload: metricsObject});
    });

    //DISPATCH THE METRICS OBJECT
    };

  };
