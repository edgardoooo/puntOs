import { BUSINESS_MAIN_UPDATE, VALIDATE_STATE_UPDATE } from '../actions/types';

const INITIAL_STATE = {
user: {},
coupons: {},
reviews: {},
promos: {},
scene: 'home',
metrics: {},
uid: '',
coupon_count: 0,
checkin_count: 0,
validateState: { loading: false, code: '', error: ''}
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case BUSINESS_MAIN_UPDATE:
      //action.payload === { prop: 'name', value: 'jane' }
      return { ...state, [action.payload.prop]: action.payload.value };
    case VALIDATE_STATE_UPDATE:{
      const new_state = { ...state.validateState, [action.payload.prop]: action.payload.value };
      return { ...state, validateState: new_state};
    }
    default:
      return state;
  }
};
