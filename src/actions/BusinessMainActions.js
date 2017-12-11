import firebase from 'firebase';
import { Alert } from 'react-native';
import { BUSINESS_MAIN_UPDATE, VALIDATE_STATE_UPDATE } from './types';
import { Actions } from 'react-native-router-flux';

export const businessMainUpdate = ({ prop, value }) => {
  return {
    type: BUSINESS_MAIN_UPDATE,
    payload: { prop, value }
  };
};

export const getBusinessProfile = (uid) => {
      return (dispatch) => {
      firebase.database().ref(`/users/${uid}`).on('value', snapshot => {
        const user = snapshot.val();
        dispatch({ type: BUSINESS_MAIN_UPDATE, payload: { prop: 'user', value: user }});
      });
        };
      };

export const getCheckinsToday = (uid) => {
      return (dispatch) => {
      const _today = new Date().toISOString().substring(0,10);
      firebase.database().ref(`/Checkins/${uid}`).orderByChild(`date`).equalTo(_today).on('value', snapshot => {
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
      firebase.database().ref(`/Redeems/${uid}`).orderByChild(`date`).equalTo(_today).on('value', snapshot => {
        const coupons_today = snapshot.val();
        if ( coupons_today != null){
        dispatch({ type: BUSINESS_MAIN_UPDATE, payload: { prop: 'coupon_count', value: Object.keys(coupons_today).length }});
      }
        //dispatch({ type: BUSINESS_MAIN_UPDATE, payload: { prop: 'user', value: user }});
      });
        };
      };

export const validateStateUpdate = ({ prop, value }) => {
  return {
    type: VALIDATE_STATE_UPDATE,
    payload: { prop, value }
  };
}

export const validateCoupon = (coupon_code, uid) => {
  return (dispatch) => {
  dispatch({ type: VALIDATE_STATE_UPDATE, payload: { prop: 'loading', value: true }});
  dispatch({ type: VALIDATE_STATE_UPDATE, payload: { prop: 'error', value: '' }});
  firebase.database().ref(`/Redeems/${uid}`).orderByChild(`code`).equalTo(coupon_code).once('value', snapshot => {
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
    }
    else if(redeemObj.used){
      dispatch({ type: VALIDATE_STATE_UPDATE, payload: {prop: 'loading', value: false}});
      dispatch({ type: VALIDATE_STATE_UPDATE, payload: {prop: 'error', value: 'Coupon code already used'}});
    }
    else if(!redeemObj.used){
      snapshot.ref.child(redeem_id).update({ used: true}).then(() => {
      firebase.database().ref(`/Coupons/${uid}/${coupon_id}`).once('value', snapshot => {
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
