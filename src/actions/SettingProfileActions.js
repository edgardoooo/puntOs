import firebase from 'firebase';
import { SET_PROFILE_UPDATE, GETTING_PROFILE, ACCOUNT_NOT_ACTIVE, ERROR_SETTING_CATEGORY, BUSINESS_MAIN_UPDATE } from './types';
import { Actions } from 'react-native-router-flux';

export const settingProfileUpdate = ({ prop, value }) => {
  return {
    type: SET_PROFILE_UPDATE,
    payload: { prop, value }
  };
};

export const gettingProfile = () =>{
  return {
    type: GETTING_PROFILE
  };
};

export const setCategory = (category, uid) => {
  return (dispatch) => {
    firebase.database().ref(`users/${uid}`).once('value', snapshot => {
    const set_category = { category: category };
    snapshot.ref.update(set_category).then(()=>{
    //dispatch({ type: SET_PROFILE_UPDATE, payload: { prop: 'category_set', value: true} });
    Actions.BusinessMain();
    }).catch((error) => {
      dispatch({ type: ERROR_SETTING_CATEGORY });
      console.log(error)});
  })};
}


export const getProfile = (uid) => {
  return (dispatch) => {
  dispatch({ type: GETTING_PROFILE });
    firebase.database().ref(`/users/${uid}`).once('value', snapshot => {
      const user = snapshot.val();
      if (user.type === 'Business'){
        if (user.active === '' || user.active === undefined){
          accountNotActive(dispatch);
        }
        else if (user.active){
          if (user.category === '' || user.category === undefined){
            dispatch({ type: SET_PROFILE_UPDATE, payload: { prop: 'loading', value: false} });
            dispatch({ type: SET_PROFILE_UPDATE, payload: { prop: 'category_set', value: false} });
          } else{
          dispatch({ type: BUSINESS_MAIN_UPDATE, payload: { prop: 'uid', value: uid }});
          //dispatch({ type: BUSINESS_MAIN_UPDATE, payload: { prop: 'user', value: user }});
          Actions.BusinessMain();
        }
        }
        else {
          accountNotActive(dispatch);
        }
    } else if(user.type === 'user'){
          Actions.UserMain();
    }
    }).catch((error) => {
      console.log(error)
    });
  };
};

const accountNotActive = (dispatch, user) => {
  dispatch(
    { type: ACCOUNT_NOT_ACTIVE, payload: user }
  );
};
