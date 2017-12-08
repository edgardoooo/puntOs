import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import BusinessSignUpReducer from './BusinessSignUpReducer';
import UserSignUpReducer from './UserSignUpReducer';

export default combineReducers({
  auth: AuthReducer,
  businessSignUp: BusinessSignUpReducer,
  userSignUp: UserSignUpReducer
});
