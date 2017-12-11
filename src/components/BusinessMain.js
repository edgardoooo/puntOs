import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, LayoutAnimation, TouchableWithoutFeedback } from 'react-native';
import { Tile } from './common';
import StarRating from 'react-native-star-rating';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { businessMainUpdate, getBusinessProfile, getCheckinsToday, getCouponsToday } from '../actions';
import { Actions } from 'react-native-router-flux';

class BusinessMain extends Component {
  componentWillMount(){
      this.props.getBusinessProfile(this.props.uid);
      this.props.getCheckinsToday(this.props.uid);
      this.props.getCouponsToday(this.props.uid);
    }

  renderHomeIcon(){
    const { scene } = this.props;
    if (scene==='home'){
    return (
      <Icon name='ios-home' size= {30} color='#299cc5' style={{ alignSelf: 'center' }} />
  );
  }
  else {
    return (
      <TouchableWithoutFeedback onPress={() => { this.props.businessMainUpdate({ prop: 'scene', value: 'home'})}}>
      <Icon name='ios-home-outline' size= {30} color='grey' style={{ alignSelf: 'center' }} />
      </TouchableWithoutFeedback>
  );
  }
  }
  renderMetricsIcon(){
    const { scene } = this.props;
    if (scene==='metrics'){
    return <Icon name='ios-stats' size= {30} color='#299cc5' style={{ alignSelf: 'center' }} />;
  }
  else {
    return (
      <TouchableWithoutFeedback onPress={() => { this.props.businessMainUpdate({ prop: 'scene', value: 'metrics'})}}>
      <Icon name='ios-stats-outline' size= {30} color='grey' style={{ alignSelf: 'center' }} />
      </TouchableWithoutFeedback>
  );
  }
  }
  renderContent(){
    const { user, coupon_count, checkin_count, scene } = this.props;
    if (scene==='home'){
    return (<View style= {{ flex: 8, flexDirection: 'column' }}>
      <View style={{ flex:4, flexDirection: 'row' }}>
      <TouchableOpacity style={styles.tileStyle} onPress={() => Actions.BusinessProfile()} >
      <View>
          <Text style={styles.textStyle}>My</Text>
          <Text style={styles.textStyle}>Profile</Text>
      </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tileStyle} onPress={() => Actions.ReviewsView()} >
      <View>
          <Text style={styles.textStyle}>My</Text>
          <Text style={styles.textStyle}>Reviews</Text>
      </View>
      </TouchableOpacity>
      </View>
      <View style={{ flex:4, flexDirection: 'row' }}>
      <TouchableOpacity style={styles.tileStyle} onPress={() => Actions.CreatePromo()} >
      <View>
          <Text style={styles.textStyle}>Create</Text>
          <Text style={styles.textStyle}>Promo</Text>
      </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tileStyle} onPress={() => Actions.PromosView()} >
      <View>
          <Text style={styles.textStyle}>My</Text>
          <Text style={styles.textStyle}>Promos</Text>
      </View>
      </TouchableOpacity>
      </View>
      <View style={{ flex:4, flexDirection: 'row' }}>
      <TouchableOpacity style={styles.tileStyle} onPress={() => Actions.CreateCoupon()} >
      <View>
          <Text style={styles.textStyle}>Create</Text>
          <Text style={styles.textStyle}>Coupon</Text>
      </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tileStyle} onPress={() => Actions.CouponsView()} >
      <View>
          <Text style={styles.textStyle}>My</Text>
          <Text style={styles.textStyle}>Coupons</Text>
      </View>
      </TouchableOpacity>
      </View>
      <View style={{ flex:3, alignSelf: 'stretch', alignItems: 'center' }}>
      <TouchableOpacity style={[styles.tileStyle, {justifyContent: 'center'}]} onPress={() => Actions.ValidateCoupon()} >
      <View>
          <Text style={ [styles.textStyle, {alignSelf: 'center'}] }>Validate Coupon</Text>
      </View>
      </TouchableOpacity>
      </View>
    </View>
  );}
  else if (scene==='metrics'){
    return(
      <View style={{ flex: 8 }}>
      <Text>Metrics Dashboard</Text>
      </View>
    );
  }
  }
  render() {
    const { user, coupon_count, checkin_count } = this.props;
    return (
      <View style={styles.backgroundStyle}>
        <View style={{ flex:4, marginBottom: 5, borderBottomWidth: 1, borderColor: 'gray', backgroundColor:'#ecedee' }}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <View style={{ flex: 1, flexDirection: 'row', paddingTop: 20 }}>
            <View style={{ flex: 1, justifyContent: 'center'}} >
            <Icon name='ios-information-circle' size= {20} color='#299cc5' style={{ alignSelf: 'flex-start', paddingLeft: 5 }} />
            </View>
            <View style={{ flex: 1, justifyContent: 'center'}}>
            <Icon name='ios-settings' size= {20} color='#299cc5' style={{ alignSelf: 'flex-end', paddingRight: 5 }} />
            </View>
            </View>
            <View style={{ flex: 5, flexDirection: 'row' }}>
              <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
              <Text style={{ alignSelf: 'center', fontSize: 30 }}>{coupon_count}</Text>
              <Text style={{ alignSelf: 'center' }}>coupons</Text>
              </View>
              <View style={{ flex: 1, justifyContent: 'center'}}>
              <Image
              style={styles.thumbnailStyle}
              source={require('../assets/jarana.jpg')}
              />
              </View>
              <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
              <Text style={{ alignSelf: 'center', fontSize: 30 }}>{checkin_count}</Text>
              <Text style={{ alignSelf: 'center'}}>visits</Text>
              </View>
            </View>
            <View style={{ flex: 3 , flexDirection: 'column', justifyContent: 'center', marginBottom: 10, marginTop: 5 }}>
            <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 25 }}>{user.businessName}</Text>
            <View style={{ alignSelf: 'center', flexDirection: 'row' }}>
            <StarRating
            disabled={true}
            maxStars={5}
            rating={user.rating}
            starSize={25}
            starColor={'#f2d733'}
            />
            <Text style={{ fontSize: 20, paddingLeft: 5 }}>{user.rating}</Text>
            </View>
            </View>
          </View>
        </View>
        {this.renderContent()}
        <View style={{ flex:1, flexDirection: 'row', borderColor: 'grey', borderTopWidth:1 , marginTop: 5, backgroundColor: '#ecedee' }}>
          <View style={{ flex: 1, justifyContent: 'center'}}>
          {this.renderHomeIcon()}
          </View>
          <View style={{ flex: 1, justifyContent: 'center'}}>
          {this.renderMetricsIcon()}
          </View>
        </View>
      </View>
    );
  }
}

const styles ={
backgroundStyle: {
  flex: 1,
  backgroundColor: '#e3e3e3'
},
tileStyle:{
  alignSelf: 'stretch',
  flex:1,
  borderColor:'#000',
  borderRadius: 5,
  borderWidth:1,
  marginTop: 2,
  marginLeft: 2,
  marginBottom: 2,
  marginRight: 2,
  paddingTop: 6,
  paddingLeft: 6,
  paddingRight: 4,
  paddingBottom: 4,
  backgroundColor:'#299cc5',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2
},
textStyle:{
  fontSize: 25,
  color: '#fff'
},
thumbnailStyle: {
height: 100,
width: 100,
borderRadius: 5,
borderWidth: 1,
borderColor: 'black',
alignSelf: 'center',
resizeMode: 'contain'
}
}

const mapStateToProps = state => {
  const { user, uid, metrics, scene, coupon_count, checkin_count } = state.businessMain;
  return { user, uid, metrics, scene, coupon_count, checkin_count };
};

export default connect(mapStateToProps,{businessMainUpdate, getBusinessProfile, getCheckinsToday, getCouponsToday})(BusinessMain);
