import React, { Component } from 'react';
import { View, Text, ScrollView, Image, TouchableHighlight, LayoutAnimation } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Button, Spinner } from './common';
import { connect } from 'react-redux';
import { claimCoupon, updateCouponProfile, updateClaimBy, setCouponToExpired } from '../actions'


class RedeemCouponView extends Component {
    componentWillUpdate(){
        LayoutAnimation.spring();
      }

    render() {
        const {
            imageContainerStyle,
            couponDescriptionContainerStyle,
            backgroundStyle,
            nameStyle,
            descriptionStyle,
        } = styles

        const {
            name,
            text,
            pointsValue,
            image
        } = this.props.coupon;

        const { user, loading, message, uid } = this.props;

        return (
            <ScrollView style={backgroundStyle}>
                <View style={imageContainerStyle}>
                    <Image style={{ height: 250 }}
                        source={{ uri: image }}
                    />
                </View>
                <View style={couponDescriptionContainerStyle}>
                    <Text style={nameStyle}>{name}</Text>
                    <Text style={descriptionStyle}>
                     {text}
                    </Text>
                </View>
                {this.renderValue()}
            </ScrollView>
        );
    }

    renderPoints(){
      if(this.props.user.points){
        return this.props.user.points;
      }
      else{
        return 0;
      }
    }

    renderValue(){
        const {
            pointsStatusContainer,
            pointsStatusStyle,
            touchableStyle,
            buttonStyle,
            messageStyle
        } = styles

        const {
            name,
            text,
            pointsValue,
            image
        } = this.props.coupon;

        const { user, loading, message, uid } = this.props;

        if(loading){
            return (
                <View style={pointsStatusContainer}>
                <Spinner size="large" />
                </View>
            );
        }
        else {
            return (
                <View style={pointsStatusContainer}>
                <Text style={pointsStatusStyle}>Value:  {pointsValue}</Text>
                <Text style={pointsStatusStyle}>Available: {this.renderPoints()}</Text>
                <Text style={pointsStatusStyle}>{ calculatePointsAfterClaim(user, pointsValue)}</Text>
                <Text style={messageStyle}>{message}</Text>
                <TouchableHighlight style={touchableStyle} onPress={() => {
                    const coupon = this.props.coupon
                    var user_points = 0
                    if(user.points){
                      user_points = user.points;
                    }
                    if (user_points > pointsValue){
                        this.props.claimCoupon({ uid, coupon, user, name });
                        this.props.updateClaimBy(uid, coupon.pid);
                        if(coupon.claimedBy.length == coupon.claimLimit){
                            this.props.setCouponToExpired(coupon.pid);
                        }
                    }
                    else {
                        this.props.updateCouponProfile({ prop: 'message', value:'Not sufficient funds!' });
                    }
                }} >
                    <Text style={buttonStyle}>Redeem Now!</Text>
                </TouchableHighlight>
               </View>
            )
        }
    }
}

const  calculatePointsAfterClaim =(user, pointsValue) => {
      var user_points = 0;
      if(user.points){
        user_points = user.points;
      }
      var result = user_points - pointsValue;
        if(result > 0){
            return "After:    "+result;
        }
        else {
            return "Not Sufficient Funds!"
        }
    }



const styles = {
    backgroundStyle: {
        backgroundColor: '#fff'
    },
    imageContainerStyle: {
        flex: 1,
        alignItems: 'stretch',
        paddingTop: 15,
        paddingLeft: 15,
        paddingRight: 15,
    },
    couponDescriptionContainerStyle: {
        flex: 2,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 15,
        borderRadius: 5,
        backgroundColor: '#808080',
    },
    pointsStatusContainer: {
        flex: 3,
        paddingLeft: 15,
        marginTop: 15,
        marginBottom: 15,
        borderRadius: 10,

    },
    pointsStatusStyle: {
        fontSize: 20,
        paddingLeft: 10,
        paddingBottom: 15
    },
    touchableStyle: {
        backgroundColor: '#0084b4',
        alignItems: 'center',
        marginRight: 15
    },
    nameStyle: {
        fontSize: 25,
        color: 'white',
        fontWeight: 'bold',
        paddingLeft: 5,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: '#0084b4'
    },
    descriptionStyle: {
        fontSize: 18,
        color: 'white',
        paddingTop: 15,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 20,
    },
    buttonStyle: {
        fontSize: 20,
        paddingTop: 10,
        paddingBottom: 10,
        color: 'white'
    },
    messageStyle: {
        fontSize: 25,
        color: '#0084b4',
        textAlign: 'center'
    }
}

const mapStateToProps = state => {
    const { coupon, loading, message } = state.redeemCoupon;
    const { uid, user } = state.userMain;

    return {
        coupon,
        loading,
        message,
        uid,
        user
    };

};

export default connect(mapStateToProps,{ claimCoupon, updateCouponProfile,updateClaimBy, setCouponToExpired })(RedeemCouponView);
