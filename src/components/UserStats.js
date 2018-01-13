import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { getMyCoupons, getMyCheckins } from '../actions';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { View, Text, Image, ScrollView, LayoutAnimation } from 'react-native';
import _ from 'lodash';
import ProgressCircle from 'react-native-progress-circle';
var moment = require('moment');

class UserStats extends Component {

//componentWillMount(){
  //this.props.getMyCheckins(currentUser);
  //this.props.getMyCoupons(currentUser);
//}

componentWillUpdate(){
    LayoutAnimation.spring();
}

renderImage(image) {
    console.log(image)
      if (image) {
          return (
            <Image style={styles.authorIconStyle} source={{uri: image }} />
          );
      }
      else {
      return ( <Image style={styles.authorIconStyle} source={require('../assets/no-user-image.gif')} />);
      }
      //if not, return default icon
  }

renderLevelProgress(overallPoints){
  return(
            <ProgressCircle
                percent={parseInt(this.props.levelPercentage)}
                radius={80}
                borderWidth={15}
                color="#0084b4"
                shadowColor="#e3e3e3"
                bgColor="#fff"
            >
            <View style={{ flex: 3 , flexDirection: 'column', justifyContent: 'center'}}>
            <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 40 }}>{this.props.user.level}</Text>
            <Text style={{ fontSize: 15, alignSelf: 'center' }}>{'Level'}</Text>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#0084b4', alignSelf: 'center' }}>{overallPoints} pts</Text>
            </View>
            </ProgressCircle>
  );
}

renderLatestCheckins(lastCheckins){
  if(lastCheckins){
    console.log(checkinItems)
    var checkinItems = _.map(lastCheckins, (val,key) => {
    //console.log(val)
    return  (
            <View style={{ marginTop: 5, marginBottom: 5}}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{paddingLeft: 5, paddingTop: 10}}>
                  {this.renderImage(val.image)}
                </View>
                <View style={{flex:1, flexDirection: 'column'}}>
                  <Text style={styles.authorNameStyle}>
                  {val.businessName}
                  </Text>
                  <Text style={styles.postDateTextStyle}>
                    {val.date}
                  </Text>
                </View>
              </View>
            </View>
                      );
    });
    return checkinItems;
  }
  else{
    return  (
      <Text style={{ marginTop: 10, alignSelf: 'center', fontWeight: 'bold', fontSize: 30, color: '#e3e3e3'}}>No Checkins</Text>
          );
  }
}

renderUsed(used){
  if(used){
    return(
      <View style={{ paddingTop: 5, paddingLeft: 5, paddingRight: 5, paddingBottom: 5, height: 20, width: 80, justifyContent: 'center', alignItems: 'center', marginRight: 5,
      borderColor: '#f97171', alignSelf: 'center',borderRadius: 10, borderWidth: 0.5, backgroundColor: '#f97171'}}>
      <Text style={{ alignSelf: 'center', fontSize: 15 }}>
      Used
      </Text>
      </View>
  );
  } else {
    return(
      <View style={{ paddingTop: 5, paddingLeft: 5, paddingRight: 5, paddingBottom: 5, height: 20, width: 80, justifyContent: 'center', alignItems: 'center', marginRight: 5,
      borderColor: '#60e591', alignSelf: 'center',borderRadius: 10, borderWidth: 0.5, backgroundColor: '#60e591'}}>
      <Text style={{ alignSelf: 'center',
      fontSize: 15 }}>
      Not Used
      </Text>
      </View>
  );
  }
}

renderLatestCoupons(lastCoupons){
  if(lastCoupons){
    var couponItems = _.map(lastCoupons, (val,key) => {
    //console.log(val)
    return  (
            <View style={{ marginTop: 5, marginBottom: 5}}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{paddingLeft: 5, paddingTop: 10}}>
                  {this.renderImage(val.image)}
                </View>
                <View style={{flex:1, flexDirection: 'column'}}>
                  <Text style={styles.authorNameStyle}>
                  {val.businessName}
                  </Text>
                  <Text style={styles.postDateTextStyle}>
                    {this.renderDate(val.date)}
                  </Text>
                  <Text style={styles.postTextStyle}>
                    Code: {val.code}
                  </Text>
                </View>
                {this.renderUsed(val.used)}
              </View>
            </View>
                      );
    });
    return couponItems;
  }
  else{
    return  (
      <Text style={{ marginTop: 10, alignSelf: 'center', fontWeight: 'bold', fontSize: 30, color: '#e3e3e3'}}>No Coupons</Text>
          );
  }
}

renderDate(date) {
  const post_date = moment(new Date(date));
  const _today = moment(new Date());
  const minutes_diff = _today.diff(post_date, 'minutes');
  //console.log(minutes_diff)
  if( minutes_diff < 59) {
    return minutes_diff + 'm ago';
  } else if ( minutes_diff < 1439 ) {
    const hours = (minutes_diff/60).toFixed(0);
    return hours + 'h ago';
  } else if ( minutes_diff < 44639 ) {
    const days = (minutes_diff/1440).toFixed(0);
    return days + 'd ago';
  } else if ( minutes_diff < 525599 ) {
    const months = (minutes_diff/44640).toFixed(0);
    return months + 'm ago';
  } else {
    const years = (minutes_diff/525600).toFixed(0);
    return years + 'y ago';
  }
}


renderIcon(image) {
        if (image) {
            return (
              <Image
              style={styles.thumbnailStyle}
              source={{uri: image }}
              />
            );
        }
        else {
          return(
            <Image
            style={styles.thumbnailStyle}
            source={require('../assets/no-user-image.gif')}
            />
          );
        }
    }

    render() {
        return (
          <ScrollView>
          <View style={styles.backgroundStyle}>
            <View style={{ flex: 6, flexDirection: 'column', backgroundColor: '#fff'}}>
              <View style={{ flex: 2, flexDirection: 'row', backgroundColor: '#fff', paddingBottom: 20 }}>
                <View style={{ flex: 1, alignItems: 'center', paddingTop: 20, alignSelf: 'flex-start', paddingLeft: 5}}>
                  {this.renderLevelProgress(this.props.overallPoints)}
                </View>
                <View style={{ flex: 1, alignItems: 'center', paddingTop: 25 }}>
                  {this.renderIcon(this.props.user.image)}
                  <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 22, marginTop: 2 }}>{this.props.name}</Text>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#0084b4' }}>{this.props.pointsToNext} to Next Level</Text>
                </View>
              </View>
            </View>
            <View style={{ flex: 9 , flexDirection: 'column', justifyContent: 'center', backgroundColor: '#fff'}}>
              <View style={{ flex: 2, flexDirection: 'row', backgroundColor: '#fff', borderColor: '#0084b4', borderBottomWidth: 4, paddingBottom: 10}}>
                <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#fff', alignSelf: 'center', justifyContent: 'center' }}>
                  <Icon name='md-pin' size= {60} color='#0084b4' style={{ paddingLeft: 5, paddingRight: 5, alignSelf: 'center' }} />
                  <View style={{ flexDirection: 'column', backgroundColor: '#fff' }}>
                    <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 40}}>{this.props.totalCheckins}</Text>
                    <Text style={{ fontSize: 15 }}>checkins</Text>
                  </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#fff', alignSelf: 'center'}}>
                  <Icon name='md-pricetag' size= {60} color='#0084b4' style={{ paddingRight: 5, alignSelf: 'center' }} />
                  <View style={{ flexDirection: 'column', backgroundColor: '#fff' }}>
                    <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 40}}>{this.props.totalCoupons}</Text>
                    <Text style={{ fontSize: 15 }}>coupons</Text>
                  </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#fff', alignSelf: 'center', paddingRight: 5 }}>
                  <Icon name='md-star' size= {60} color='#0084b4' style={{ paddingRight: 5, alignSelf: 'center' }} />
                  <View style={{ flexDirection: 'column', backgroundColor: '#fff' }}>
                    <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 40}}>{this.props.totalReviews}</Text>
                    <Text style={{ fontSize: 15 }}>reviews</Text>
                  </View>
                </View>
              </View>
              <View style={{ flex: 6 , flexDirection: 'column', justifyContent: 'center', paddingTop: 10}}>
              <View style={{ flex: 6 , flexDirection: 'column', justifyContent: 'center', paddingBottom: 10, borderColor: 'grey', borderBottomWidth: 0.5}}>
                <Text style={{ alignSelf: 'flex-start', fontSize: 15, fontWeight: 'bold', paddingLeft: 5 }}>Latest Checkins</Text>
                {this.renderLatestCheckins(this.props.lastCheckins)}
              </View>
              <View style={{ flex: 6 , flexDirection: 'column', justifyContent: 'center', paddingTop: 10}}>
                <Text style={{ alignSelf: 'flex-start', fontSize: 15, fontWeight: 'bold', paddingLeft: 5 }}>Latest Coupons</Text>
                {this.renderLatestCoupons(this.props.lastCoupons)}
              </View>
              </View>
            </View>
          </View>
          </ScrollView>
        );
    }
}

const styles ={
backgroundStyle: {
  flex: 1,
  backgroundColor: '#e3e3e3'
},
thumbnailStyle: {
height: 100,
width: 100,
borderRadius: 5,
borderWidth: 1,
borderColor: 'black',
alignSelf: 'center',
resizeMode: 'contain'
},
authorIconStyle: {
    height: 40,
    width: 40,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#ababab',
    resizeMode: 'contain'
},
authorNameStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 10,
},
postDateTextStyle: {
    fontSize: 14,
    marginLeft: 10,
},
postTextStyle: {
    fontSize: 16,
    marginLeft: 10,
    marginTop: 5,
    flexWrap: 'wrap',
    flex: 1
}
}
const mapStateToProps = state => {
  const { uid, pointsToNext, levelPercentage, totalCoupons, totalCheckins, totalReviews, overallPoints, lastCheckins, lastCoupons, level, user, name } = state.userMain;
  return { uid, pointsToNext, levelPercentage, totalCoupons, totalCheckins, totalReviews, overallPoints, lastCheckins, lastCoupons, level, user, name };
};
export default connect(mapStateToProps,{ getMyCoupons, getMyCheckins })(UserStats);
