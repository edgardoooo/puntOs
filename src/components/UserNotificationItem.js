import _ from 'lodash';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card, CardSection } from './common';
var moment = require('moment');

class UserNotificationItem extends Component {

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

    renderNotification(businessID, businessName,date, text, ntype, invited) {
        console.log(businessID);

        var type_color = '#0084b4';
        var type_text = text
        var type_icon = '';
        var action_text = '';
        var action_icon = '';
        var action_color = '';
         if (ntype === "coupon") {
           type_color = '#0084b4';
           type_text = businessName + ': ' + text+ '.';
           type_icon = 'md-pricetag';
         }
         else {
           type_color = '#0084b4';
           type_text =  invited + ' just joined puntOs and you got 200 points!';
           type_icon = 'md-checkmark-circle';

         }

         return(
           <View>
               <Card>
                   <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff', paddingTop: 5, paddingBottom: 5, alignSelf: 'stretch' }}>
                       <View style={{justifyContent: 'flex-end', alignItems: 'flex-end', paddingRight: 5, flex: 1 }}>
                         <Text style={{fontSize: 10}}>{this.renderDate(date)}</Text>
                       </View>
                       <View style={{ flex: 4, flexDirection: 'row', backgroundColor: '#fff', paddingTop: 5, paddingBottom: 5 }}>
                         <View style={{ justifyContent: 'center', alignItems: 'center', paddingLeft: 5, flex: 1 }}>
                         <Icon name={type_icon} size= {40} color={type_color} style={{ alignSelf: 'center' }} />
                         </View>
                         <View style={{ justifyContent: 'center', alignItems: 'center', paddingLeft: 5, flex: 6 }}>
                             <Text style={{
                               fontSize: 16,
                               flex: 1}}>{type_text}</Text>
                         </View>
                       </View>
                   </View>
               </Card>
           </View>
         );
    }

    render() {
        const { businessID, businessName, date, ntype, uid, invited, text } = this.props.notifications;
        return this.renderNotification(businessID, businessName, date, text, ntype, invited);
    }
}

export default UserNotificationItem;
