import React, { Component } from 'react';
import firebase from 'firebase';
import {
    View,
    Text,
    Image,
    TouchableWithoutFeedback,
    LayoutAnimation,
    ScrollView,
    CameraRoll,
    TouchableOpacity,
    Alert,
    Keyboard
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import StarRating from 'react-native-star-rating';
import { InputBox, InputLine, Button, Spinner } from './common';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import PhotoGrid from 'react-native-photo-grid';
import Modal from 'react-native-modal';
import { postReviewChange, submitReview, resetPostReview, givePointsForReview } from '../actions';
var Utils = require('./common/Utils');

class PostReviewView extends Component {

 constructor(props){
     super(props);
     this.renderItem = this.renderItem.bind(this);
 }

 componentWillMount() {
    this.props.postReviewChange({ prop: 'uid', value: firebase.auth().currentUser.uid});
 }

 /*componentWillUpdate() {
        LayoutAnimation.spring();
  }*/

  render() {

      const {
          thumbnailStyle,
          containerStyle,
          textStyle,
          ratingContainer,
          backgroundStyle,
          lineInputOverstyle,
          inputBoxOverstyle,
          scrollStyle,
          modalStyle,
          headerStyle,
          gridStyle,
          buttonOverstyle,
          messageStyle,
          errorStyle
         } = styles;

      const {
          postReviewChange,
          submitReview
      } = this.props

    return (
      <KeyboardAwareScrollView
      style={{ backgroundColor: '#fff', flex: 1 }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={false}
      >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.backgroundStyle}>
        <View style={containerStyle}>
          {/*
            <View style={{ flex: 1, alignItems: 'center' }}>
                <Text
                    style={{
                        fontSize: 25,
                        paddingTop: 5,
                        paddingBottom: 15,
                    }}
                >
                    Post Review
                </Text>

            </View>
            */}
            <View style={{ flex: 2 }}>
                <TouchableWithoutFeedback onPress={this._handleUploadPress}>
                    <Image
                        style={thumbnailStyle}
                        source={require('../assets/uploadImageVector.png')}
                    />
                </TouchableWithoutFeedback>
                <Text style={textStyle}>Upload Image</Text>
            </View>
            <View style={{ flex: 3 }}>
            <Modal
                                isVisible={this.props.modalIsVisible}
                                onCloseRequest={() => {}}
                                style={{ flex: 1 }}
                            >
                                <ScrollView>
                                    <View style={modalStyle}>
                                        <View style={headerStyle}>
                                            <Text style={{fontSize: 25, color: 'white'}}>Choose Picture</Text>
                                        </View>
                                        <View style={gridStyle}>
                                            <PhotoGrid
                                                data = { this.props.images }
                                                itemsPerRow = { 3 }
                                                itemMargin = { 1 }
                                                renderItem = {this.renderItem}
                                            />
                                        </View>
                                        <View style={ {flex:3, flexDirection: 'row', alignItems: 'center', paddingLeft: 17 } }>
                                            <Button
                                                overStyle={buttonOverstyle}
                                                onPress ={() => {
                                                    this.togleModal();
                                                    if(!this.props.attached){
                                                        this.props.postReviewChange({ prop: 'selectedImage', value: null });
                                                    }
                                                }}
                                            >
                                                Close
                                            </Button>
                                            <Button
                                                overStyle={buttonOverstyle}
                                                onPress ={() => {
                                                    this.togleModal();
                                                    this.props.postReviewChange({prop: 'attached', value: true});
                                                    Alert.alert('Notification:','Image Attached!',
                                                    [{text: 'OK', onPress: () => {

                                                    }}]);
                                                }}
                                            >
                                                Continue
                                            </Button>
                                        </View>
                                    </View>
                                </ScrollView>
                            </Modal>
            </View>
            <View style={{ flex: 4, flexDirection: 'row', marginTop: 10}}>
                <StarRating
                disabled={false}
                maxStars={5}
                rating={this.props.rating}
                starSize={30}
                starStyle={{ paddingLeft: 5 }}
                selectedStar={(value) => postReviewChange({ prop: 'rating', value})}
                starColor={'#f2d733'}
                halfStarEnabled={true}
                />
                <Text style={{ fontSize: 23, paddingLeft: 5 }}>{this.props.rating}</Text>
            </View>
            <View style={{ flex: 5, alignSelf: 'stretch', marginTop: 10 }}>
               <View style={{ alignSelf: 'stretch' }}>
                <InputLine
                    onChangeText={value => postReviewChange({ prop: 'caption', value })}
                    placeholder='Caption'
                    maxLength={20}
                    placeholderTextColor='gray'
                    overStyle={lineInputOverstyle}
                    value={this.props.caption}
                />
                <InputBox
                    onChangeText={value => postReviewChange({ prop: 'text', value })}
                    multiline={true}
                    numberOfLines={2}
                    maxLength={150}
                    placeholderTextColor='gray'
                    placeholder='Review'
                    overStyle={inputBoxOverstyle}
                    value={this.props.text}
                />
                </View>
            </View>
            {/*
            <View style={{ flex: 6 }}>
                    <Text style={messageStyle}>{this.props.message}</Text>
                    <Text style={errorStyle}>{this.props.error}</Text>
            </View>
          */}
            <View style={{ flex: 7 }}>
                {this.renderFooter()}
            </View>
       </View>
      </View>
      </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    );
  }


// =============================== Redering Methods ================================
renderItem( item, itemSize ) {
    return (
        <TouchableOpacity
          key = { item.id }
          style = {{ width: itemSize, height: itemSize}}
          onPress = {() => this.setSelected(item)}
        >
          <Image
              resizeMode = 'cover'
              style = {{ flex: 1 }}
              source = {{ uri: item.src }}
          />
        </TouchableOpacity>
    );
}

renderFooter() {
  if(this.props.loading){
    return (
      <View>
        <Spinner size='large'  />
      </View>
    );
  } else {
    return (
      <View>
        <Button onPress={() => this.onReviewSubmission()  }>Post It</Button>
      </View>
    );
  }
}





//================================= Camera Roll Helper Functions =====================================

_handleUploadPress = () => {
    CameraRoll.getPhotos({
        first: 20,
        assetType: 'All',
    })
    .then(r => {
        this.props.postReviewChange({ prop: 'images', value: r.edges });
        this.FetchPhotosArray();
        this.togleModal();
    })
    .catch((err) => {
      console.log(err);
    });
}

FetchPhotosArray () {
    var images = [];
    images = this.props.images.map((p,i) => {
      return {id: i, src: p.node.image.uri }
    });
    this.props.postReviewChange({ prop: 'images', value: images });
}

togleModal = () => {
    this.props.postReviewChange({ prop: 'modalIsVisible', value: !this.props.modalIsVisible });
}

setSelected = (selectedImage) => {
  this.props.postReviewChange({ prop: 'selectedImage', value: selectedImage });
  //this.togleModal();
  //this.props.postReviewChange({ prop: 'message', value: 'Photo Selected!'});
}






// =================================== Helper Submission Method =====================================
onReviewSubmission () {
    //this.props.postReviewChange({ prop: 'error', value: ''});
    //this.props.postReviewChange({ prop: 'message', value: ''});
    this.props.postReviewChange({ prop: 'loading', value: true});
    //console.log(this.props.businessName);
    if(this.props.selectedImage.src){
      if(this.props.caption && this.props.text && this.props.rating){
        Utils.uploadImage(this.props.selectedImage.src, `${this.props.uid+this.businessID}.jpg` )
           .then((responseData) => {
             if(!this.props.hasReviewed){
               this.props.submitReview({
                   businessID: this.props.businessID,
                   uid: this.props.uid,
                   username: this.props.username,
                   image: responseData,
                   rating: this.props.rating,
                   date: this.props.date,
                   caption: this.props.caption,
                   text: this.props.text,
                   tallied: this.props.tallied,
                   userIcon: this.props.userIcon,
                   businessName: this.props.businessName
               });
               this.props.givePointsForReview(this.props.uid, this.props.user);
               Alert.alert('Posted!','Your review to' + this.props.businessName + ' was posted!',
               {text: 'OK'});
               this.props.resetPostReview();
               Actions.pop();
               //this.props.postReviewChange({ prop: 'message', value: 'Review Posted Successfully'});
             } else {
               //console.log('You already reviewed')
               Alert.alert('Error!','Your already reviewed ' + this.props.businessName,
               {text: 'OK'});
               //this.props.postReviewChange({ prop: 'error', value: 'You have already reviewed this business.'});
               this.props.postReviewChange({ prop: 'loading', value: false });
             }
           });}
      else{
        //console.log('Missing inputs')
        this.props.postReviewChange({ prop: 'loading', value: false });
        Alert.alert('Error!','Missing inputs in your review post',
        {text: 'OK'});
        //this.props.postReviewChange({ prop: 'error', value: 'Missing Inputs'});
      }
    } else if (this.props.caption && this.props.text && this.props.rating){
      if(!this.props.hasReviewed){
      this.props.submitReview({
          businessID: this.props.businessID,
          uid: this.props.uid,
          username: this.props.username,
          image: '',
          rating: this.props.rating,
          date: this.props.date,
          caption: this.props.caption,
          text: this.props.text,
          tallied: this.props.tallied,
          userIcon: this.props.userIcon,
          businessName: this.props.businessName,
      });
      this.props.givePointsForReview(this.props.uid, this.props.user);
      Alert.alert('Posted!','Your review to ' + this.props.businessName + ' was posted!',
      {text: 'OK'});
      this.props.resetPostReview();
      Actions.pop();
      //this.props.postReviewChange({ prop: 'message', value: 'Review Posted Successfully'});
    } else {
      //console.log('You already reviewed')
      Alert.alert('Error!','Your already reviewed ' + this.props.businessName,
      {text: 'OK'});
      //this.props.postReviewChange({ prop: 'error', value: 'You have already reviewed this business.'});
      this.props.postReviewChange({ prop: 'loading', value: false });
    }
    } else {
      //console.log('Missing inputs')
      Alert.alert('Error!','Missing inputs in your review post',
      {text: 'OK'});
      this.props.postReviewChange({ prop: 'loading', value: false });
      //this.props.postReviewChange({ prop: 'error', value: 'Missing Inputs'});
    }
 }

}




//====================================Stylesheets=============================================
const styles = {
    thumbnailStyle: {
        height: 100,
        width: 100,
        alignSelf: 'center',
        resizeMode: 'contain'
    },
    containerStyle: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#fff',
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      },
    textStyle: {
        fontSize: 16,
        color: '#0084b4'
    },
    ratingContainer: {
        alignSelf: 'center',
        flexDirection: 'row',
        marginTop: 10
    },
    backgroundStyle: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'column',
      },
    lineInputOverstyle: {
        borderWidth: 3,
        borderColor: '#0084b4',
        borderBottomWidth: 3,
        borderBottomColor: '#0084b4',
        width: 330,
    },
    inputBoxOverstyle: {
         color: '#000',
         width: 330,
         backgroundColor: '#fff',
         height: 200,
         alignSelf: 'center',
         marginTop:5,
         borderWidth: 3,
         borderColor: '#0084b4',
         borderBottomWidth: 3,
         borderTopWidth: 3,
         borderBottomColor: '#0084b4',
         borderRightWidth: 3,
         borderLeftWidth: 3,
    },
    modalStyle: {
        borderRadius: 5,
        backgroundColor: '#fff'
    },
    headerStyle: {
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 5,
        borderBottomWidth: 3,
        borderBottomColor: '#0084b4',
        flex: 1,
        backgroundColor: '#0084b4'
    },
    gridStyle: {
        backgroundColor: 'gray',
        borderBottomWidth: 3,
        borderBottomColor: '#0084b4',
        flex: 2
    },
    buttonOverstyle: {
        marginBottom: 15,
        width: 150,
        borderRadius: 10
    },
    messageStyle: {
        fontSize: 18,
        color: '#0084b4'
    },
    errorStyle: {
        fontSize: 18,
        color: 'red'
    }
}

const mapStateToProps = state => {
 const {
    businessID,
    date,
    text,
    rating,
    caption,
    uid,
    username,
    images,
    loading,
    error,
    modalIsVisible,
    selectedImage,
    tallied,
    message,
    userIcon,
    businessName,
    attached
 } = state.postReview;

  var { user, hasReviewed } = state.userMain;

 return {
    businessID,
    date,
    text,
    rating,
    caption,
    uid,
    username,
    images,
    loading,
    modalIsVisible,
    selectedImage,
    tallied,
    message,
    businessName,
    userIcon,
    user,
    hasReviewed,
    attached
 }

}
export default connect(mapStateToProps, { postReviewChange, submitReview, resetPostReview, givePointsForReview })(PostReviewView);
