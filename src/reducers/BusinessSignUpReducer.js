import { BUSINESS_SIGNUP_UPDATE, SIGNUP_BUSINESS, SIGNUP_BUSINESS_FAIL, SIGNUP_BUSINESS_SUCCESS, BUSINESS_SIGNUP_RESET } from '../actions/types';

const INITIAL_STATE = {
  businessName: '',
  username: '',
  addressLine: '',
  city: '',
  country: '',
  zipCode: '',
  phoneNumber: '',
  email: '',
  password: '',
  error: '',
  loading: '',
  type: 'Business',
  step: 1,
  size: 'Small'
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case BUSINESS_SIGNUP_UPDATE:
      //action.payload === { prop: 'name', value: 'jane' }
      return { ...state, [action.payload.prop]: action.payload.value };
    case SIGNUP_BUSINESS:
        return { ...state, loading: true, error: '' };
    case SIGNUP_BUSINESS_SUCCESS:
        return { ...state, user: action.payload , error: ''};
    case SIGNUP_BUSINESS_FAIL:
        return { ...state, error: action.payload, loading: false, password: '' };
    case BUSINESS_SIGNUP_RESET:
        return INITIAL_STATE;
    default:
      return state;
  }
};
