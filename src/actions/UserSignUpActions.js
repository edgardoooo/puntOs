import firebase from 'firebase';
import {
    USER_SIGNUP_RESET,
    USER_SIGNUP_UPDATE,
    SIGNUP_USER,
    SIGNUP_USER_FAIL,
    SIGNUP_USER_SUCCESS
} from "./types";
import Actions from 'react-native-router-flux';

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
        console.log("email:"+props.email);
        firebase.auth().createUserWithEmailAndPassword(props.email, props.password)
            .then((user) => {
                firebase.database().ref(`/users/${user.uid}`)
                    .set(props)
                        .then((response) => {
                            signUpUserSuccess(dispatch, user)
                            dispatch({ type: USER_SIGNUP_RESET });
                        })})
            .catch( (response) =>{
                if( response.code === 'auth/invalid-email'){
                    signUpUserFail(dispatch, 'Invalid Email')
                }
                else {
                    signUpUserFail(dispatch, response.code)
                }
            });
                        
    };
};
