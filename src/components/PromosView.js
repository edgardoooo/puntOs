import React, { Component } from 'react';
import { View, Text, Image, TouchableWithoutFeedback, TouchableOpacity, Modal, Alert } from 'react-native';
import { InputLine } from './common';
import { deletePost, businessMainUpdate } from '../actions';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import PostList from './PostList';
import { Actions } from 'react-native-router-flux';

class PromosView extends Component {

  toggleEditPost(){
    this.props.businessMainUpdate({prop: 'edit', value: !this.props.edit});
  }

  deleteAction(){
    this.props.deletePost(this.props.itemToEdit);
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

  renderEditPost(){
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
      </Modal> );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderViewImageModal()}
        {this.renderEditPost()}
        <PostList />
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
  const { edit, itemToEdit, itemToEditType, itemToEditStatus, imageToView, viewImage } = state.businessMain;
  return { edit, itemToEdit, itemToEditType, itemToEditStatus, imageToView, viewImage };
};

export default connect(mapStateToProps,{ deletePost, businessMainUpdate })(PromosView);
