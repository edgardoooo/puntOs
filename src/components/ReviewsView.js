import React, { Component } from 'react';
import { View, Text, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import { InputLine } from './common';
import { businessMainUpdate } from '../actions';
import Icon from 'react-native-vector-icons/Ionicons';
import ReviewItem from './ReviewItem';
import ReviewList from './ReviewList';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';


class ReviewsView extends Component {

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
    return (
      <View style={{ flex: 1 }}>
        {this.renderViewImageModal()}
        <ReviewList />
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
  const { imageToView, viewImage } = state.businessMain;
  return { imageToView, viewImage };
};

export default connect(mapStateToProps,{ businessMainUpdate })(ReviewsView);
