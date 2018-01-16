import firebase from 'firebase';
import axios from 'axios';
import { Alert } from 'react-native';
import {
    USER_SIGNUP_RESET,
    USER_SIGNUP_UPDATE,
    SIGNUP_USER,
    SIGNUP_USER_FAIL,
    SIGNUP_USER_SUCCESS
} from "./types";
import { Actions } from 'react-native-router-flux';
const DELETE_USER = 'https://us-central1-puntos-capstone2017.cloudfunctions.net/deleteUser';

export const userSignUpUpdate = ({ prop, value }) => {
    return {
        type: USER_SIGNUP_UPDATE,
        payload: { prop, value }
    };
};

export const signUpUserFail = (dispatch, error) => {
    dispatch({type: SIGNUP_USER_FAIL, payload: error });
};

export const signUpUserSuccess = (dispatch, user) => {
    dispatch({type: SIGNUP_USER_SUCCESS, payload: user});
};

export const userSignUpReset = () => {
    return {
        type: USER_SIGNUP_RESET
    };
};

export const signUpUser = (props) => {
    return (dispatch) => {
        dispatch({ type: SIGNUP_USER });
        firebase.auth().createUserWithEmailAndPassword(props.email, props.password)
            .then((user) => {
              user.sendEmailVerification().then(() => {
                firebase.database().ref(`/users/${user.uid}`)
                    .set(props)
                        .then((response) => {
                            const new_entry = {
                                username: props.name,
                                points: 1000,
                                icon: "",
                                uid: user.uid
                            };
                            firebase.database().ref(`/userRewards/${user.uid}`)
                                .set(new_entry)
                                .catch((error) => {
                                    signUpUserFail(dispatch, 'Error Setting Rewards');
                                });
                            signUpUserSuccess(dispatch, user);
                            dispatch({ type: USER_SIGNUP_RESET });
                            Alert.alert('Notification:','Sign Up Successful',
                            [{text: 'OK', onPress: () => {

                            }}]);
                            Actions.signUpSuccessUser();
                        });}).catch(() => {
                          signUpBusinessFail(dispatch, 'Could not send verification email. Try Again.');
                          axios.get(DELETE_USER+`?uid=${user.uid}`);
                        });}).catch( (response) =>{
                if( response.code === 'auth/invalid-email'){
                    signUpUserFail(dispatch, 'Invalid Email')
                }
                else {
                    signUpUserFail(dispatch, response.code)
                }
            });
    };
};
