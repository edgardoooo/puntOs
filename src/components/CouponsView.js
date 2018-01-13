import React, { Component } from 'react';
import { View, Text, Image, LayoutAnimation, TouchableWithoutFeedback, TouchableOpacity, Modal, Alert } from 'react-native';
import { InputLine } from './common';
import CouponsList from './CouponsList';
import Icon from 'react-native-vector-icons/Ionicons';
import { deactivateCoupon, businessMainUpdate } from '../actions';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

class CouponsView extends Component {
  componentWillUpdate() {
  LayoutAnimation.spring();
  }

  toggleEditCoupon(){
    this.props.businessMainUpdate({prop: 'edit', value: !this.props.edit});
  }

  deactivateAction(){
    this.props.deactivateCoupon(this.props.itemToEdit);
  }

  toggleViewImage(){
    this.props.businessMainUpdate({prop: 'viewImage', value: false});
  }


  renderViewImageModal(){
    return (
      <Modal transparent={true} animationType={'slide'} visible={this.props.viewImage} style={{ justifyContent: 'flex-end', margin: 0 }}>
        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#000' }}>
        <TouchableWithoutFeedback onPress={() => {this.toggleViewImage();}}>
          <Icon name='md-close' size= {25} color='#0084b4' style={{ alignSelf: 'flex-start' ,paddingTop: 15, paddingLeft: 10 }} />
        </TouchableWithoutFeedback>
        <Image
        style={styles.viewImageStyle}
        source={{uri: this.props.imageToView }}
        />
        </View>
      </Modal> );
  }

  renderEditCoupon(){
    return (
      <Modal transparent={true} animationType={'slide'} visible={this.props.edit} style={{ justifyContent: 'flex-end', margin: 0 }}>
        <View style={{ flex: 1, flexDirection: 'column', alignSelf: 'stretch' }}>
          <TouchableWithoutFeedback onPress={() => {this.toggleEditCoupon()}}>
          <View style={{flex:9}}></View>
          </TouchableWithoutFeedback>
          <View style={{ flex: 1, justifyContent: 'center' , backgroundColor: '#fff', shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.1,shadowRadius: 2,elevation: 1, paddingTop: -10, paddingBottom: 10 }}>
          <TouchableWithoutFeedback onPress={() => {this.toggleEditCoupon()}}>
          <Icon name='ios-arrow-down' size= {30} color='grey' style={{ alignSelf: 'center' }} />
          </TouchableWithoutFeedback>
          <TouchableOpacity onPress={() => {
            console.log(this.props.itemToEditStatus)
            if(this.props.itemToEditStatus){
              Alert.alert('Error!', 'Coupon is already expired.', {text: 'OK'});
            }else{
            Alert.alert('Deactivate this coupon?','Doing this will expire your coupon offering. All coupons claimed to date will still be valid for use.',
            [{text: 'Cancel', onPress: () => this.toggleEditCoupon(), style: 'cancel'},
            {text: 'OK', onPress: () => {
              this.deactivateAction(); this.toggleEditCoupon()}}]);
          }}}>
            <Text style={{fontSize: 20, color: '#000', paddingLeft:5}}>Deactivate Coupon</Text>
          </TouchableOpacity>
          </View>
        </View>
      </Modal> );
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderViewImageModal()}
        {this.renderEditCoupon()}
        <CouponsList />
      </View>
    );
  }
}

const styles = {
viewImageStyle: {
flex: 1,
resizeMode: 'contain'
}
}

const mapStateToProps = state => {
  const { edit, itemToEdit, itemToEditType, itemToEditStatus, viewImage, imageToView } = state.businessMain;
  return { edit, itemToEdit, itemToEditType, itemToEditStatus, viewImage, imageToView };
};

export default connect(mapStateToProps,{ deactivateCoupon, businessMainUpdate })(CouponsView);
