import firebase from 'firebase';
import { SET_COUPON_PROFILE, CLAIM_COUPON, UPDATE_COUPON_PROFILE } from './types'
import { Actions } from 'react-native-router-flux';
var uuid = require('react-native-uuid');
var moment = require('moment');


export const setCouponProfile = (coupon) => {
    return {
        type: SET_COUPON_PROFILE,
        payload: coupon
    };
};

export const updateCouponProfile = ({ prop, value }) => {
    return {
        type: UPDATE_COUPON_PROFILE,
        payload: { prop, value }
    };
};

export const claimCoupon = (props) => {
    return (dispatch) => {
        dispatch({ type: CLAIM_COUPON});
        dispatch({ type: UPDATE_COUPON_PROFILE, payload: { prop: 'message', value: "" } });
        const today = new Date().toISOString();
        const age = (moment(new Date(today)).diff(moment(new Date(props.user.birthdate)), 'minutes')/525600).toFixed(0);
        var new_event = { businessName: props.name, date: new Date().toISOString() ,
          eventType: 'redeem', username: props.user.name, city: props.user.hometown, age: age };
        firebase.database().ref(`/Redeems`).once('value', snapshot => {
            const _today = new Date().toISOString();
            const mycode = uuid.v1().substring(0,8);
            const new_redeem = {
                businessID: props.coupon.businessID,
                code: mycode,
                couponID: props.coupon.pid,
                date: _today,
                pointsSpent: props.coupon.pointsValue,
                queryparam: props.coupon.businessID+_today,
                uid: props.uid,
                used: false
            }
            snapshot.ref.push(new_redeem).then(()=>{
                var result = props.user.points - props.coupon.pointsValue;
                firebase.database().ref(`/users/${props.uid}`).update({points: result})
                    .then(() => {
                        firebase.database().ref(`Events/`).push(new_event);
                        dispatch({ type: UPDATE_COUPON_PROFILE, payload: { prop: 'message', value: "Transaction successfull!" } });
                        dispatch({ type: UPDATE_COUPON_PROFILE, payload: { prop: 'loading', value: false } });
                    })
                    .catch((error) => {
                      console.log(error)
                        dispatch({ type: UPDATE_COUPON_PROFILE, payload: { prop: 'message', value: "Error on transaction, try again " } });
                        dispatch({ type: UPDATE_COUPON_PROFILE, payload: { prop: 'loading', value: false } });
                    });
            }).catch((error) => {
                dispatch({ type: UPDATE_COUPON_PROFILE, payload: { prop: 'message', value: "Error on transaction, try again"  } });
                dispatch({ type: UPDATE_COUPON_PROFILE, payload: { prop: 'loading', value: false } });
            })
        })

    };
};

export const updateClaimBy = (uid, pid) => {
    return (dispatch) => {
        const claim_objt= {[uid]: 1};
        firebase.database().ref(`/Coupons/${pid}`).child('claimedBy').update(claim_objt)
            .catch((error) => {
                dispatch({ type: UPDATE_COUPON_PROFILE, payload: { prop: 'message', value: error }});
            });
    };
};

export const setCouponToExpired = (pid) => {
    return (dispatch) => {
        firebase.database().ref(`/Coupons/${pid}`).update({expired: true})
            .catch((error) => {
                dispatch({ type: UPDATE_COUPON_PROFILE, payload: { prop: 'message', value: error}});
            });
    };
};
