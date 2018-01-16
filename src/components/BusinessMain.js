import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, LayoutAnimation,
  TouchableWithoutFeedback, ScrollView, Modal, TouchableHighlight, CameraRoll, Alert } from 'react-native';
import { Tile, Button, Spinner } from './common';
import StarRating from 'react-native-star-rating';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { unlinkAccount, businessMainUpdate, getBusinessProfile, getCheckinsToday,
  getCouponsToday, updateProfilePic, logoutUser, resetLocation, getMetrics } from '../actions';
import { Actions } from 'react-native-router-flux';

import BusinessDashboard from './BusinessDashboard';

import PhotoGrid from 'react-native-photo-grid';


class BusinessMain extends Component {
  constructor(props){
      super();
      this.renderItem = this.renderItem.bind(this);
  }

  componentWillMount(){
      this.props.getBusinessProfile(this.props.uid);
      this.props.getCheckinsToday(this.props.uid);
      this.props.getCouponsToday(this.props.uid);
      this.props.getMetrics(this.props.uid);
    }

  setSelected(key){
    this.props.businessMainUpdate({prop: 'photoSelectedKey', value: key});
    this.props.businessMainUpdate({prop: 'photoSelected', value: this.props.photos[key-1]});
  }

  renderItem(item, itemSize){
//    this.props.photos.map((photo, key) => {
  if(item){
      return (
        <TouchableHighlight
        style={{opacity: item.id === this.props.photoSelectedKey ? 0.5 : 1, width: itemSize, height: itemSize}}
        key={item.id}
        underlayColor='transparent'
        onPress={()=> this.setSelected(item.id)}>
          <Image resizeMode = 'cover' style = {{ flex: 1 }} source = {{ uri: item.src }}  />
        </TouchableHighlight>
      );
    }
  //  })
}

modalContinueMain(){
  this.props.updateProfilePic(this.props.photoSelected.src, this.props.uid);
}

renderButtonsMain(){
  const { photoSelectedKey, uploadLoading } = this.props;
  if(uploadLoading){
    return (
      <View style={{ width: 100, flexDirection: 'row', justifyContent: 'center', paddingTop: 10, paddingBottom: 10}}>
      <Spinner />
      </View>
    );
  }
  else if (photoSelectedKey){
    return (
      <View style={{ width: 100, flexDirection: 'row', justifyContent: 'center', paddingTop: 10, paddingBottom: 10}}>
                  <Button onPress={()=> this.closeModalMain()} overStyle={{ width: 150 }}>Cancel</Button>
                  <Button onPress={()=> this.modalContinueMain()} overStyle={{ width: 150 }}>Continue</Button>
      </View>
    );} else {
    return (
      <View style={{ width: 100, flexDirection: 'row', justifyContent: 'center', paddingTop: 10, paddingBottom: 10}}>
        <Button overStyle={{  width: 150 }} onPress={()=> this.closeModalMain()} >
        Cancel
        </Button>
        <Button disbaled overStyle={{ backgroundColor: 'gray', borderColor: 'gray', width: 150 }} >
        Continue
        </Button>
      </View>
          );
  }
}

toggleInfo(){
  this.props.businessMainUpdate({prop: 'info', value: !this.props.info});
}

renderQRID(qrcode){
  if (qrcode) {
      return (
        <Image
        style={styles.qrStyle}
        source={{uri: qrcode }}
        />
      );
  } else {
    return (
      <Text>No QRID</Text>
    );
  }
}

renderInfo(){
  return (
    <Modal transparent={true} animationType={'slide'} visible={this.props.info} style={{ justifyContent: 'flex-end', margin: 0 }}>
      <View style={{ flex: 10, flexDirection: 'column', alignSelf: 'stretch' }}>
      <TouchableWithoutFeedback onPress={() => {this.toggleInfo()}}>
        <View style={{flex:2}}></View>
      </TouchableWithoutFeedback>
        <View style={{ flex: 5, justifyContent: 'center' , backgroundColor: '#fff', shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },shadowOpacity: 0.1,shadowRadius: 2,elevation: 1, paddingTop: -10, paddingBottom: 10 }}>
        <TouchableWithoutFeedback onPress={() => {this.toggleInfo()}}>
        <Icon name='ios-arrow-down' size= {30} color='grey' style={{ alignSelf: 'center' }} />
        </TouchableWithoutFeedback>
          {this.renderQRID(this.props.user.qrid)}
          <Text style={{fontSize: 25, color: '#000', paddingLeft:5, fontWeight: 'bold', marginBottom: 5}}>Your Info</Text>
          <Text style={{ fontSize: 22, paddingLeft: 5, marginBottom: 5, fontWeight: 'bold' }}>Address</Text>
          <Text style={{ fontSize: 20, paddingLeft: 5, marginBottom: 5 }}> {this.props.user.addressLine},{this.props.user.city} {this.props.user.country}</Text>
          <Text style={{ fontSize: 22 ,paddingLeft: 5, marginBottom: 5, fontWeight: 'bold' }}>Phone Number</Text>
          <Text style={{ fontSize: 20, paddingLeft: 5, marginBottom: 5 }}>{this.props.user.phoneNumber}</Text>
          <Text style={{ fontSize: 22,paddingLeft: 5 , marginBottom: 5, fontWeight: 'bold'}}>Category</Text>
          <Text style={{ fontSize: 20, paddingLeft: 5, marginBottom: 5 }}>{this.props.user.category}</Text>
        </View>
      </View>
    </Modal> );
}

renderLinkUser(){
  if(this.props.user.linked){
    return(
      <View>
      <TouchableOpacity onPress={() => {
        Actions.switchAccount(); this.toggleSettings();
      }}>
        <Text style={{fontSize: 20, color: '#000', paddingLeft:5, paddingTop: 2, paddingBottom: 2}}>Switch to User</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {
        Alert.alert('Unlink User Account?','By unlinking yous account you will not be able to swicth to user mode again.',
        [{text: 'Cancel', onPress: () => this.toggleSettings(), style: 'cancel'},
        {text: 'Continue', onPress: () => {this.props.unlinkAccount(this.props.uid, this.props.user.linked.uid); this.toggleSettings()}}]);
      }}>
        <Text style={{fontSize: 20, color: '#000', paddingLeft:5, paddingTop: 2, paddingBottom: 2}}>Unlink User</Text>
      </TouchableOpacity>
      </View>
    );
  } else {
    return(
      <View>
    <Text style={{fontSize: 20, color: 'grey', paddingLeft:5, paddingTop: 2, paddingBottom: 2}}>Switch to User</Text>
    <TouchableOpacity onPress={() => {
      Alert.alert('Link User Account?','This will allow you to switch from your business account to your user account providing your user password.',
      [{text: 'Cancel', onPress: () => this.toggleSettings(), style: 'cancel'},
      {text: 'Yes', onPress: () => {Actions.linkAccount(); this.toggleSettings()}}]);
    }}>
      <Text style={{fontSize: 20, color: '#000', paddingLeft:5, paddingTop: 2, paddingBottom: 2}}>Link User</Text>
    </TouchableOpacity>
    </View>
  );
  }
}

toggleSettings(){
  this.props.businessMainUpdate({prop: 'settings', value: !this.props.settings});
}

renderSettings(){
  return (
    <Modal transparent={true} onRequestClose={()=>{}} animationType={'slide'} visible={this.props.settings} style={{ justifyContent: 'flex-end', margin: 0 }}>
      <View style={{ flex: 1, flexDirection: 'column', alignSelf: 'stretch' }}>
        <TouchableWithoutFeedback onPress={() => {this.toggleSettings()}}>
        <View style={{flex:7}}></View>
        </TouchableWithoutFeedback>
        <View style={{ flex: 2, justifyContent: 'center' , backgroundColor: '#fff', shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.1,shadowRadius: 2,elevation: 1, paddingTop: -10, paddingBottom: 10 }}>
        <TouchableWithoutFeedback onPress={() => {this.toggleSettings()}}>
        <Icon name='ios-arrow-down' size= {30} color='grey' style={{ alignSelf: 'center' }} />
        </TouchableWithoutFeedback>
        <TouchableOpacity onPress={() => {
          Alert.alert('Reset Business Location?','By choosing \'ok\' your business\' location will be reset to your CURRENT location. This can help with check-in accuracy inconsistency.',
          [{text: 'Cancel', onPress: () => this.toggleSettings(), style: 'cancel'},
          {text: 'OK', onPress: () => {this.props.resetLocation(this.props.uid);this.toggleSettings()}}]);
        }}>
          <Text style={{fontSize: 20, color: '#000', paddingLeft:5, paddingTop: 2, paddingBottom: 2 }}>Reset Business Location</Text>
        </TouchableOpacity>
        {this.renderLinkUser()}
        <TouchableOpacity onPress={() => {
          Alert.alert('Sign out?','',
          [{text: 'Cancel', onPress: () => this.toggleSettings(), style: 'cancel'},
          {text: 'OK', onPress: () => {Actions.login({ type: 'reset' });this.props.logoutUser(); this.toggleSettings()}}]);
        }}>
          <Text style={{fontSize: 20, color: '#000', paddingLeft:5, paddingTop: 2, paddingBottom: 2 }}>Sign Out</Text>
        </TouchableOpacity>
        </View>
      </View>
    </Modal> );
}

  renderPhotosModal(){
    return (
      <Modal transparent={false} onRequestClose={()=>{}} animationType={'slide'} visible={this.props.showPhotos}>
        <View style={{ flex:1, paddingTop: 20, flexDirection: 'column', alignItems: 'center' }}>
          <Text style={{fontSize: 20, color: '#000', paddingBottom:10}}>Camera Roll</Text>
          <ScrollView style={{flexWrap: 'wrap', flexDirection: 'row'}}>
            <PhotoGrid
                data = { this.props.photos }
                itemsPerRow = { 3 }
                itemMargin = { 1 }
                renderItem = {this.renderItem}
            />
          </ScrollView>
          {this.renderButtonsMain()}
        </View>
      </Modal> );
  }

  openModalMain(){
    CameraRoll.getPhotos({
        first: 20,
        assetType: 'All'
    })
    .then(response => {
        var paths = response.edges;
        var photos = [];
        photos = paths.map((photo , key) => {
          return { id: key+1, src: photo.node.image.uri }
        });
        this.props.businessMainUpdate({prop: 'showPhotos', value: true});
        this.props.businessMainUpdate({prop: 'photos', value: photos});

    })
    .catch((err) => {
      console.log(err);
    });
  }

  closeModalMain(){
    this.props.businessMainUpdate({prop: 'showPhotos', value: false});
    this.props.businessMainUpdate({prop: 'photoSelected', value: null});
    this.props.businessMainUpdate({prop: 'photoSelectedKey', value: null});
  }


  renderIcon(image) {
            if (image) {
                return (
                  <TouchableWithoutFeedback onPress={() => {this.openModalMain()}} >
                  <Image
                  style={styles.thumbnailStyle}
                  source={{uri: image }}
                  />
                  </TouchableWithoutFeedback>
                );
            }
            else {
              return(
              <TouchableWithoutFeedback onPress={() => {this.openModalMain()}} >
              <Image
              style={styles.thumbnailStyle}
              source={require('../assets/no-user-image.gif')}
              />
              </TouchableWithoutFeedback>);
            }
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
      <TouchableWithoutFeedback onPress={() => { this.props.businessMainUpdate({ prop: 'scene', value: 'metrics'});}}>
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
          <Icon name='ios-person' size={50} color='#fff' style={{ alignSelf: 'center' }} />
          <Text style={[styles.textStyle, {alignSelf: 'center'}]}>My Profile</Text>
      </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tileStyle} onPress={() => Actions.ReviewsView()} >
      <View>
          <Icon name='ios-star-half' size={50} color='#fff' style={{ alignSelf: 'center' }} />
          <Text style={[styles.textStyle, {alignSelf: 'center'}]}>My Reviews</Text>
      </View>
      </TouchableOpacity>
      </View>
      <View style={{ flex:4, flexDirection: 'row' }}>
      <TouchableOpacity style={styles.tileStyle} onPress={() => Actions.CreatePromo()} >
      <View>
          <Icon name='ios-megaphone' size={50} color='#fff' style={{ alignSelf: 'center' }} />
          <Text style={[styles.textStyle, {alignSelf: 'center'}]}>Create Promo</Text>
      </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tileStyle} onPress={() => Actions.PromosView()} >
      <View>
        <Icon name='ios-paper' size={50} color='#fff' style={{ alignSelf: 'center' }} />
        <Text style={[styles.textStyle, {alignSelf: 'center'}]}>My Promos</Text>
      </View>
      </TouchableOpacity>
      </View>
      <View style={{ flex:4, flexDirection: 'row' }}>
      <TouchableOpacity style={styles.tileStyle} onPress={() => Actions.CreateCoupon()} >
      <View>
        <Icon name='ios-create' size={50} color='#fff' style={{ alignSelf: 'center' }} />
        <Text style={[styles.textStyle, {alignSelf: 'center'}]}>Create Coupon</Text>
      </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tileStyle} onPress={() => Actions.CouponsView()} >
      <View>
        <Icon name='md-pricetag' size={50} color='#fff' style={{ alignSelf: 'center' }} />
        <Text style={[styles.textStyle, {alignSelf: 'center'}]}>My Coupons</Text>
      </View>
      </TouchableOpacity>
      </View>
      <View style={{ flex:3, alignSelf: 'stretch', alignItems: 'center' }}>
      <TouchableOpacity style={[styles.tileStyle, {justifyContent: 'center'}]} onPress={() => Actions.ValidateCoupon()} >
      <View>
        <Icon name='md-barcode' size={40} color='#fff' style={{ alignSelf: 'center' }} />
        <Text style={[styles.textStyle, {alignSelf: 'center'}]}>Validate Coupon</Text>
      </View>
      </TouchableOpacity>
      </View>
    </View>
  );}
  else if (scene==='metrics'){
    return(
      <View style={{ flex: 8 }}>
        <BusinessDashboard />
      </View>
    );
  }
  }
  render() {
    const { user, coupon_count, checkin_count } = this.props;
    return (
      <View style={styles.backgroundStyle}>
        <View style={{ flex:4, marginBottom: 5, borderBottomWidth: 0.5, borderColor: '#000', backgroundColor:'#fff', shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.1,shadowRadius: 2,elevation: 1}}>
          {this.renderPhotosModal()}
          {this.renderSettings()}
          {this.renderInfo()}
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <View style={{ flex: 1, flexDirection: 'row', paddingTop: 20 }}>
            <View style={{ flex: 1, justifyContent: 'center'}} >
              <TouchableWithoutFeedback onPress={()=> this.toggleInfo()}>
                <Icon name='ios-information-circle' size= {25} color='#0084b4' style={{ alignSelf: 'flex-start', paddingLeft: 5 }} />
              </TouchableWithoutFeedback>
            </View>
            <View style={{ flex: 1, justifyContent: 'center'}}>
              <TouchableWithoutFeedback onPress={()=> this.toggleSettings()}>
                <Icon name='ios-settings' size= {25} color='#0084b4' style={{ alignSelf: 'flex-end', paddingRight: 5 }} />
              </TouchableWithoutFeedback>
            </View>
            </View>
            <View style={{ flex: 5, flexDirection: 'row' }}>
              <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
              <Text style={{ alignSelf: 'center', fontSize: 30 }}>{coupon_count}</Text>
              <Text style={{ alignSelf: 'center' }}>coupons</Text>
              </View>
              <View style={{ flex: 1, justifyContent: 'center'}}>
              {this.renderIcon(user.image)}
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
            rating={parseFloat(user.rating)}
            starSize={25}
            starColor={'#f2d733'}
            />
            <Text style={{ fontSize: 20, paddingLeft: 5 }}>{user.rating}</Text>
            </View>
            </View>
          </View>
        </View>
        {this.renderContent()}
        <View style={{ flex:1, flexDirection: 'row', borderColor: '#000', borderTopWidth:0.5 , marginTop: 5, backgroundColor: '#fff' }}>
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
  borderWidth:1,
  borderRadius: 5,
  marginTop: 2,
  marginLeft: 2,
  marginBottom: 2,
  marginRight: 2,
  paddingTop: 4,
  paddingLeft: 6,
  paddingRight: 4,
  paddingBottom: 4,
  backgroundColor:'#0084b4',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2
},
textStyle:{
  fontSize: 20,
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
},
qrStyle: {
height: 150,
width: 150,
borderRadius: 5,
borderWidth: 1,
borderColor: 'black',
alignSelf: 'center',
resizeMode: 'contain',
marginBottom: 20
},
errorTextStyle: {
  fontSize: 20,
  alignSelf: 'center',
  color: '#f97171'
}
}

const mapStateToProps = state => {
  const { user, uid, metrics, scene, coupon_count,
    checkin_count, photos, photoSelectedKey, showPhotos, photoSelected, uploadError, uploadLoading, settings, info } = state.businessMain;
  return { user, uid, metrics, scene, coupon_count, checkin_count,
     photos, photoSelectedKey, showPhotos, photoSelected, uploadLoading, uploadError, settings, info };
};

export default connect(mapStateToProps,{unlinkAccount, businessMainUpdate, getBusinessProfile, getCheckinsToday,
  getCouponsToday, updateProfilePic, logoutUser, resetLocation, getMetrics})(BusinessMain);
