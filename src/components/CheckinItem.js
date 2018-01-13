import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { Card, CardSection } from './common';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { businessMainUpdate, businessExists } from '../actions';
import Icon from 'react-native-vector-icons/Ionicons';
var moment = require('moment');

class CheckinItem extends Component {

  renderDate(date) {
      const post_date = moment(new Date(date));
      const _today = moment(new Date());
      const minutes_diff = _today.diff(post_date, 'minutes');

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
                <Image style={styles.authorIconStyle} source={{uri: image }} />
              );
          }
          else {
          return ( <Image style={styles.authorIconStyle} source={require('../assets/no-user-image.gif')} />);
          }
          //if not, return default icon
      }

    render() {
        const { name, businessName, date, businessID, image } = this.props.checkin;
        return (
          <View>
              <Card>
                  <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff', paddingTop: 5, paddingBottom: 5, alignSelf: 'stretch' }}>
                      <View style={{justifyContent: 'flex-end', alignItems: 'flex-end', paddingRight: 5, flex: 1 }}>
                        <Text style={{fontSize: 10}}>{this.renderDate(date)}</Text>
                      </View>
                      <View style={{ flex: 4, flexDirection: 'row', backgroundColor: '#fff', paddingTop: 5, paddingBottom: 5 }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingLeft: 5, flex: 1 }}>
                        {/*
                        <Icon name='md-home' size= {40} color='#0084b4' style={{ alignSelf: 'center' }} />
                        */}
                        {this.renderIcon(image)}
                        </View>
                        <View style={{ flexDirection: 'column' ,justifyContent: 'center', alignItems: 'center', paddingLeft: 5, flex: 6 }}>
                            <Text style={{
                              fontSize: 16,
                              flex: 1}}>{name} checked in at </Text>
                              <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: -10}} onPress={ () => {
                                  this.props.businessMainUpdate({ prop: 'uid', value: businessID});
                                  this.props.businessMainUpdate({ prop: 'businessName', value: businessName});
                                  this.props.businessExists(businessID);
                                  //Actions.UserBusinessProfile();
                              }}>
                                  <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                                      {businessName}
                                  </Text>
                              </TouchableOpacity>
                        </View>
                        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingLeft: 15, flex: 2, paddingRight: 10 }}>
                        <Icon name='md-pin' size= {35} color='#ee5050' style={{ alignSelf: 'center' }} />
                        <Text style={{fontSize: 12}}>checked-in</Text>
                        </View>
                      </View>
                  </View>
              </Card>
          </View>
        );
    }
}

const styles = {
    authorIconStyle: {
        height: 40,
        width: 40,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#ababab',
        resizeMode: 'contain'
    }
  }

export default connect(null,{businessMainUpdate, businessExists})(CheckinItem);
