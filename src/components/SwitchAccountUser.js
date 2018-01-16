import React, { Component } from 'react';
import { View, Text, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { InputLine, Button, Spinner } from './common';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { switchAccountUser, userMainUpdate } from '../actions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Actions } from 'react-native-router-flux';

class SwitchAccountUser extends Component {

  onPress(){
    this.props.switchAccountUser(this.props.user.linked.email, this.props.switchPassword);
  }

  renderButton(){
    if(this.props.switchLoading){
      return (
        <Spinner size='large' />
      );
    }
    else {
      return <Button onPress={this.onPress.bind(this)} overStyle={{ width: 150, borderColor: '#ecedee' }}>Switch</Button>;
    }
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

  render() {
    const { user } = this.props;
    return (
      <KeyboardAwareScrollView
      style={{ backgroundColor: '#ecedee', flex: 1 }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={styles.backgroundStyle}
      scrollEnabled={true}
      >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.backgroundStyle}>
        <View style={{ flex: 5, justifyContent: 'center'}}>
              <View style={{ flex: 8, justifyContent: 'center'}}>
              {this.renderIcon(user.image)}
              </View>
              <View style={{ flex: 2 , flexDirection: 'column', justifyContent: 'center', marginTop: -30 }}>
              <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 25 }}>{user.name}</Text>
              </View>
        </View>
        <View style={{ flex: 9, justifyContent: 'center'}}>
        <View style={{ flex: 4, justifyContent: 'center'}}>
        <Text style={styles.normalTextStyle}>Enter your business password below to change to business mode.</Text>
        <Icon name='ios-switch' size= {120} color='#000' style={{ alignSelf: 'center' }} />
        </View>
        <View style={{ flex: 5, justifyContent: 'center'}}>
        <Text style={styles.normalTextStyle}>{this.props.user.linked.email}</Text>
        <InputLine
          onChangeText={value => this.props.userMainUpdate({ prop: 'switchPassword', value })}
          placeholder='password'
          placeholderTextColor='grey'
          selectionColor='#0084b4'
          secureTextEntry
          overStyle={{ borderBottomColor: '#0084b4', color: '#0084b4' }}
          value={this.props.switchPassword}
        />
        {this.renderButton()}
        </View>
        </View>
      </View>
      </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    );
  }
}

const styles ={
backgroundStyle: {
  flex: 1,
  backgroundColor: '#ecedee'
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
normalTextStyle: {
  fontSize: 20,
  alignSelf: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  paddingLeft: 25,
  paddingRight: 25,
  marginBottom: 10,
  color: '#000',
  fontWeight: 'normal',
  textAlign: 'center'
},
errorTextStyle: {
  fontSize: 20,
  alignSelf: 'center',
  color: '#f97171'
}
}

const mapStateToProps = state => {
  const { user, uid, switchLoading, switchPassword } = state.userMain;
  return { user, uid, switchLoading, switchPassword };
}

export default connect(mapStateToProps, { switchAccountUser, userMainUpdate })(SwitchAccountUser);
