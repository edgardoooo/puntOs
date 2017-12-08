import firebase from 'firebase';
import { LOGIN_USER_SUCCESS, LOGIN_USER_FAIL, LOGIN_USER, AUTH_FORM_UPDATE, BUSINESS_SIGNUP_UPDATE } from './types';
import { Actions } from 'react-native-router-flux';

export const authFormUpdate = ({ prop, value }) => {
  return {
    type: AUTH_FORM_UPDATE,
    payload: { prop, value }
  };
};

export const loginUser = ({ email, password }) => {
  return (dispatch) => {
  dispatch({ type: LOGIN_USER });
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(user => loginUserSuccess(dispatch, user))
    .catch((error) => {
      if (error.code === 'auth/user-not-found' && email != '') {
        dispatch({ type: AUTH_FORM_UPDATE, payload: { prop: 'loading', value: false}});
        Actions.preSignUp();
      }
      else if (error.code === 'auth/wrong-password') {
        loginUserFail(dispatch);
      }
      else {
        loginUserFail(dispatch);
      }
    });
  };
};

const loginUserFail = (dispatch) => {
  dispatch({ type: LOGIN_USER_FAIL });
};

const loginUserSuccess = (dispatch, user) => {
  dispatch(
    { type: LOGIN_USER_SUCCESS, payload: user }
  );
};

export const forgotPassword = (email) => {
  return (dispatch) => {
  dispatch({ type: AUTH_FORM_UPDATE, payload: { prop: 'loading', value: true}});
  firebase.auth().sendPasswordResetEmail(email)
  .then((response) => {
    console.log(response)
    dispatch({ type: AUTH_FORM_UPDATE, payload: { prop: 'error', value: 'Go to email to reset password.'}});
    dispatch({ type: AUTH_FORM_UPDATE, payload: { prop: 'loading', value: false}});})
  .catch(() => {
    dispatch({ type: AUTH_FORM_UPDATE, payload: { prop: 'error', value: 'Cannot find email.'}});
    dispatch({ type: AUTH_FORM_UPDATE, payload: { prop: 'loading', value: false}});}
  );};
};
