import {
  USER_MAIN_UPDATE,
  USER_PROFILE_UPDATE,
  USER_CHECKINS_UPDATE,
  USER_PROMOS_UPDATE,
  USER_REVIEWS_UPDATE,
  USER_MAIN_SET_PROFILE,
  USER_SOCIALS_UPDATE,
  LEADERBOARD_UPDATE,
  GET_FOLLOWING,
  USER_PRIMARY_FILTER_UPDATE,
  USER_SECONDARY_FILTER_UPDATE,
  USER_MAIN_RESET} from '../actions/types';

const INITIAL_STATE = {
    name: '',
    email: '',
    password: '',
    birthdate: '',
    hometown: '',
    loading: '',
    error: '',
    telephone: '',
    user: {},
    type: 'user',
    uid:'',
    userImage: '',
    cameraActive: true,
    checkin: false,
    hasCheckedIn: false,
    openMenu: false,
    checkins: {},
    promos: {},
    coupons: {},
    reviews: {},
    socials: {},
    userProfileState: { tab_selected: 'Checkins' },
    userPrimaryFilterState: { primaryFilterSelected: 'Promos' },
    userSecondaryFilterState: { secondaryFilterSelected: 'All'},
    refresh: false,
    pfilter: 'Promos',
    sfilter: 'All',
    points: 0,
    level: 0,
    following: {},
    lbentries: {},
    switchLoading: false,
    switchPassword: '',
    pointsToNext: 0,
    levelPercentage: 0,
    overallPoints: 0,
    totalCoupons: 0,
    lastCoupons: {},
    totalCheckins: 0,
    lastCheckins: {},
    totalReviews: 0,
    my_coupons: {},
    uploadLoading: false,
    uploadError: false,
    photoSelected: null,
    photoSelectedKey: null,
    photos: [],
    showPhotos: false,
    checkinSuccessful: '',
    checkinError: '',
    inviteEmail: '',
    inviteLoading: '',
    rank: 0,
    promoCode: '',
    promoLoading: '',
    hasReviewed: false,
    viewImage: false,
    imageToView: '',
    notificationList: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_MAIN_UPDATE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case USER_PROFILE_UPDATE:
    {
      const new_state = { ...state.userProfileState, [action.payload.prop]: action.payload.value };
      return { ...state, userProfileState: new_state};
    }
    case USER_PRIMARY_FILTER_UPDATE:
    {
      const new_state = { ...state.userPrimaryFilterState, [action.payload.prop]: action.payload.value };
      return { ...state, userPrimaryFilterState: new_state};
    }
    case USER_SECONDARY_FILTER_UPDATE:
    {
      const new_state = { ...state.userSecondaryFilterState, [action.payload.prop]: action.payload.value };
      return { ...state, userSecondaryFilterState: new_state};
    }
    case USER_REVIEWS_UPDATE:
      const new_reviews = action.payload;
      return { ...state, reviews: new_reviews };
    case USER_CHECKINS_UPDATE:{
      console.log(action.payload)
      const new_checkins = action.payload;
      return { ...state, checkins: new_checkins };
    }
    case USER_MAIN_SET_PROFILE:
      {const new_state = {
        ...state,
        name: action.payload.user.name,
        birthdate: action.payload.user.birthdate,
        email: action.payload.user.email,
        hometown: action.payload.user.hometown,
        telephone: action.payload.user.telephone,
        password: action.payload.user.password,
        user: action.payload.user,
        uid: action.payload.uid,
        points: action.payload.points,
        level: action.payload.level,
        checkin_count: action.payload.checkin_count,
        following: action.payload.following
      }
      return new_state;
    }
    case USER_PROMOS_UPDATE:
    {
    const new_promos = action.payload;
    return { ...state, promos: new_promos };
    }
    case USER_SOCIALS_UPDATE:
    {
    const new_socials = action.payload;
    return { ...state, socials: new_socials};
    }
    case LEADERBOARD_UPDATE:
    {
      const new_lbentries = action.payload;
      return { ...state, lbentries: new_lbentries }
    }
    case GET_FOLLOWING:
    {
      const new_following = action.payload;
      console.log('In follow reducer: ' + new_following);
      return { ...state, following: new_following };
    }
    case USER_MAIN_RESET:
    {
      return INITIAL_STATE;
    }
    default:
      return state;
  }
};
