import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, LayoutAnimation, TouchableWithoutFeedback, Tabbar, TouchableHighlight,
  CameraRoll, ScrollView, Modal, Alert } from 'react-native';
import StarRating from 'react-native-star-rating';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button } from './common';
import { businessProfileUpdate, businessMainUpdate, deactivateCoupon, deletePost, viewImageBusiness } from '../actions';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import PhotoGrid from 'react-native-photo-grid';
import ReviewList from './ReviewList';
import CouponsList from './CouponsList';
import PostList from './PostList';

class BusinessProfile extends Component {

  constructor(props){
      super();
      this.renderItem = this.renderItem.bind(this);
  }
/*
  componentWillUpdate(){
    LayoutAnimation.spring();
  }
*/
  toggleEditCoupon(){
    this.props.businessMainUpdate({prop: 'edit', value: !this.props.edit});
  }

  deactivateAction(){
    this.props.deactivateCoupon(this.props.itemToEdit);
  }

  toggleEditPost(){
    this.props.businessMainUpdate({prop: 'edit', value: !this.props.edit});
  }

  deleteAction(){
    this.props.deletePost(this.props.itemToEdit);
  }

  renderEditItemModal(){
      if(this.props.itemToEditType === 'Coupon'){
    return( <Modal transparent={true} animationType={'slide'} onRequestClose={()=>{}} visible={this.props.edit} style={{ justifyContent: 'flex-end', margin: 0 }}>
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
      </Modal>);} else if(this.props.itemToEditType === 'Promo'){
        return (
          <Modal transparent={true} animationType={'slide'} visible={this.props.edit} style={{ justifyContent: 'flex-end', margin: 0 }}>
            <View style={{ flex: 1, flexDirection: 'column', alignSelf: 'stretch' }}>
              <TouchableWithoutFeedback onPress={() => {this.toggleEditPost()}}>
              <View style={{flex:9}}></View>
              </TouchableWithoutFeedback>
              <View style={{ flex: 1, justifyContent: 'center' , backgroundColor: '#fff', shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.1,shadowRadius: 2,elevation: 1, paddingTop: -10, paddingBottom: 10 }}>
              <TouchableWithoutFeedback onPress={() => {this.toggleEditPost()}}>
              <Icon name='ios-arrow-down' size= {30} color='grey' style={{ alignSelf: 'center' }} />
              </TouchableWithoutFeedback>
              <TouchableOpacity onPress={() => {
                Alert.alert('Delete this promotion?','Doing this will remove your promotion from our records. No one will be able to see it agian.',
                [{text: 'Cancel', onPress: () => this.toggleEditPost(), style: 'cancel'},
                {text: 'OK', onPress: () => {
                  this.deleteAction(); this.toggleEditPost()}}]);
              }}>
                <Text style={{fontSize: 20, color: '#000', paddingLeft:5}}>Delete Promo</Text>
              </TouchableOpacity>
              </View>
            </View>
          </Modal>
        );
      }
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

modalContinue(){
  this.props.updateProfilePic(this.props.photoSelected.src, this.props.uid);
}

renderProfileButtons(){
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
                  <Button onPress={()=> this.closeModalProfile()} overStyle={{ width: 150 }}>Cancel</Button>
                  <Button onPress={()=> this.modalContinue()} overStyle={{ width: 150 }}>Continue</Button>
      </View>
    );} else {
    return (
      <View style={{ width: 100, flexDirection: 'row', justifyContent: 'center', paddingTop: 10, paddingBottom: 10}}>
        <Button overStyle={{  width: 150 }} onPress={()=> this.closeModalProfile()} >
        Cancel
        </Button>
        <Button disbaled overStyle={{ backgroundColor: 'gray', borderColor: 'gray', width: 150 }} >
        Continue
        </Button>
      </View>
          );
  }
}

  renderProfileModal(){
    return (
      <Modal transparent={false} animationType={'slide'} visible={this.props.showPhotosProfile}>
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
          {this.renderProfileButtons()}
        </View>
      </Modal> );
  }

  openModalProfile(){
    console.log('estoy aqui')
    CameraRoll.getPhotos({
        first: 20,
        assetType: 'All',
    })
    .then(response => {
        var paths = response.edges;
        var photos = [];
        photos = paths.map((photo , key) => {
          return { id: key+1, src: photo.node.image.uri }
        });
        this.props.businessMainUpdate({prop: 'showPhotosProfile', value: true});
        this.props.businessMainUpdate({prop: 'photos', value: photos});
        console.log(this.props.showPhotosProfile)
    })
    .catch((err) => {
      console.log(err);
    });
  }

  closeModalProfile(){
    this.props.businessMainUpdate({prop: 'showPhotosProfile', value: false});
    this.props.businessMainUpdate({prop: 'photoSelected', value: null});
    this.props.businessMainUpdate({prop: 'photoSelectedKey', value: null});
  }


  renderContent(){
    const { businessProfileState } = this.props;
    if (businessProfileState.tab_selected === 'Promos'){
      return (<View style= {{ flex: 8, flexDirection: 'column' }}>
    <PostList />
    </View>);
    } else if( businessProfileState.tab_selected === 'Coupons'){
      return (
      <View style= {{ flex: 8, flexDirection: 'column' }}>
      <CouponsList />
      </View>);
    } else if(businessProfileState.tab_selected === 'Reviews'){
        return (<View style= {{ flex: 8, flexDirection: 'column' }}>
      <ReviewList />
      </View>);
    }
  }

  renderIcon(image) {
          if (image) {
              return (
                <TouchableWithoutFeedback onPress={() => { this.openModalProfile()}}>
                <Image
                style={styles.thumbnailStyle}
                source={{uri: image }}
                />
                </TouchableWithoutFeedback>
              );
          }
          else {
            return(
              <TouchableWithoutFeedback onPress={() => this.openModalProfile()}>
              <Image
              style={styles.thumbnailStyle}
              source={require('../assets/no-user-image.gif')}
              />
              </TouchableWithoutFeedback>
            );
          }
      }

  renderTabs() {
    const { businessProfileState } = this.props;
    var selectedStyle = { alignSelf: 'center', fontWeight: 'bold', color: '#fff', fontSize: 18 };
    var notSelectedStyle = { alignSelf: 'center', color: '#fff', fontSize: 15 };
    var selectedContainer = { borderBottomWidth: 5, borderColor: "#fff"};
    var notSelectedContainer = { borderBottomWidth: 5, borderColor: "#0084b4"};

    var promo_tab = null;
    var coupon_tab = null;
    var review_tab = null;
    var promo_cont = notSelectedContainer;
    var coupon_cont = notSelectedContainer;
    var review_cont = notSelectedContainer;
    if (businessProfileState.tab_selected === 'Promos'){
      promo_tab = selectedStyle;
      promo_cont = selectedContainer;
      coupon_tab = notSelectedStyle;
      review_tab = notSelectedStyle;
    } else if( businessProfileState.tab_selected === 'Coupons'){
      promo_tab = notSelectedStyle;
      coupon_tab = selectedStyle;
      coupon_cont = selectedContainer;
      review_tab = notSelectedStyle;
    } else if(businessProfileState.tab_selected === 'Reviews'){
      promo_tab = notSelectedStyle;
      coupon_tab = notSelectedStyle;
      review_tab = selectedStyle;
      review_cont = selectedContainer;
    }
    return(
    <View style={{ flex:1, flexDirection: 'row', backgroundColor: '#0084b4',
    shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.1,shadowRadius: 2,elevation: 1 }}>
    <View style={[coupon_cont,{flex: 1, justifyContent: 'center'}]}>
    <Text onPress={()=> this.props.businessProfileUpdate({prop:'tab_selected', value: 'Coupons'})} style={coupon_tab} >Coupons</Text>
    </View>
    <View style={[promo_cont, {flex: 1, justifyContent: 'center'}]}>
    <Text onPress={()=> this.props.businessProfileUpdate({prop:'tab_selected', value: 'Promos'})} style={promo_tab} >Promos</Text>
    </View>
    <View style={[review_cont, {flex: 1, justifyContent: 'center'}]}>
    <Text onPress={()=> this.props.businessProfileUpdate({prop:'tab_selected', value: 'Reviews'})} style={review_tab} >Reviews</Text>
    </View>
    </View>
  );
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

  render() {
    const { user, coupon_count, checkin_count, scene, businessProfileState } = this.props;
    return (
      <View style={styles.backgroundStyle}>
        {this.renderViewImageModal()}
        {this.renderProfileModal()}
        {this.renderEditItemModal()}
        <View style={{ flex:4, backgroundColor:'#fff' }}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <View style={{ flex: 1, flexDirection: 'row', paddingTop: 20 }}>
            <View style={{ flex: 1, justifyContent: 'center'}} >
            <Icon name='ios-arrow-back' size= {30} color='#0084b4' onPress={()=> Actions.pop()} style={{ alignSelf: 'flex-start', paddingLeft: 5 }} />
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
          {this.renderTabs()}
          {this.renderContent()}
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
},
viewImageStyle: {
flex: 1,
resizeMode: 'contain'
}
}

const mapStateToProps = state => {
  const { user, uid, metrics, scene, coupon_count, checkin_count, businessProfileState,
  photos, photoSelectedKey, showPhotosProfile, photoSelected, edit, itemToEdit, itemToEditType, itemToEditStatus, viewImage, imageToView } = state.businessMain;
  return { user, uid, metrics, scene, coupon_count, checkin_count, businessProfileState,
    photos, photoSelectedKey, showPhotosProfile, photoSelected, edit, itemToEdit, itemToEditType, itemToEditStatus, viewImage, imageToView };
};
export default connect(mapStateToProps,{ businessProfileUpdate, businessMainUpdate, deactivateCoupon, deletePost, viewImageBusiness })(BusinessProfile);
