import {
    USER_SIGNUP_RESET,
    USER_SIGNUP_UPDATE,
    SIGNUP_USER,
    SIGNUP_USER_FAIL,
    SIGNUP_USER_SUCCESS
} from './../actions/types';

const INITIAL_STATE = {
    name: '',
    email: '',
    password: '',
    birthdate: '2017-01-01',
    hometown: '',
    loading: '',
    error: '',
    telephone: '',
    user: null,
    type: 'user'
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case USER_SIGNUP_RESET: 
            return INITIAL_STATE;
        case USER_SIGNUP_UPDATE:
            return { ...state, [action.payload.prop]: action.payload.value };
        case SIGNUP_USER_FAIL:
            return { ...state, error: action.payload, loading: false, password: '' };
        case SIGNUP_USER_SUCCESS:
            return { ...state, user: action.payload, loading: false, error: ''};
        case SIGNUP_USER:
            return { ...state, loading: true, error: ''}
        default:
            return state;
    }
};