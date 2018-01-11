import React, { Component } from 'react';
import { View, Text, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { InputLine, Button, Spinner } from './common';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { inviteFriend, userMainUpdate } from '../actions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Actions } from 'react-native-router-flux';

class InviteFriends extends Component {

  onPress(){
    this.props.inviteFriend(this.props.inviteEmail, this.props.uid, this.props.user.name);
  }

  renderButton(){
    if(this.props.inviteLoading){
      return (
        <Spinner size='large' />
      );
    }
    else {
      return <Button onPress={this.onPress.bind(this)} overStyle={{ width: 150, borderColor: '#ecedee' }}>Invite</Button>;
    }
  }

  render() {
    const { user, inviteEmail } = this.props;
    return (
      <KeyboardAwareScrollView
      style={{ backgroundColor: '#ecedee', flex: 1 }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={styles.backgroundStyle}
      scrollEnabled={true}
      >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.backgroundStyle}>
        <View style={{ flex: 7, justifyContent: 'center'}}>
              <View style={{ flex: 5, justifyContent: 'center'}}>
              <Image
              style={styles.thumbnailStyle}
              source={{uri: user.image }}
              defaultSource={require('../assets/no-user-image.gif')}
              />
              </View>
              <View style={{ flex: 3 , flexDirection: 'column', justifyContent: 'center', marginTop: -30 }}>
              <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 25 }}>Invite a Friend!</Text>
              </View>
        </View>
        <View style={{ flex: 8, justifyContent: 'center'}}>
        <View style={{ flex: 4, justifyContent: 'center'}}>
        <Text style={styles.normalTextStyle}>Enter the email of your friend below to invite them to the app and get 200 points!</Text>
        <Icon name='md-mail' size= {120} color='#000' style={{ alignSelf: 'center' }} />
        </View>
        <View style={{ flex: 5, justifyContent: 'center'}}>
        <InputLine
          onChangeText={value => this.props.userMainUpdate({ prop: 'inviteEmail', value })}
          placeholder='email@mail.com'
          placeholderTextColor='grey'
          selectionColor='#0084b4'
          overStyle={{ borderBottomColor: '#0084b4', color: '#0084b4' }}
          value={inviteEmail}
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
  const { user, uid, inviteLoading, inviteEmail } = state.userMain;
  return { user, uid, inviteLoading, inviteEmail };
}

export default connect(mapStateToProps, { inviteFriend, userMainUpdate })(InviteFriends);
