import _ from 'lodash';
import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { getNotifications } from '../actions';
import UserNotificationItem from './UserNotificationItem';

class UserNotificationList extends Component {

    componentWillMount() {

        this.props.getNotifications(this.props.uid);
      }

    render() {

        return (
            <FlatList
                data={this.props.notifications}
                renderItem={({item}) => <UserNotificationItem notifications={item} />}
            />
        );
    }
}

const mapStateToProps = state => {
    var { user, uid } = state.userMain;
    const notifications = _.map(state.userMain.notificationList, (val, key) => {
        return {...val, key};
    });
    return { uid, notifications };
}

export default connect(mapStateToProps, { getNotifications }) (UserNotificationList);
