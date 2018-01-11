import React, { Component } from 'react';
import { View, Text, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { InputLine, Button, Spinner } from './common';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getPoints, userMainUpdate } from '../actions';
import { Actions } from 'react-native-router-flux';

class GetPoints extends Component {

  onPress(){
    this.props.getPoints(this.props.uid, this.props.promoCode, this.props.user.email);
  }

  renderButton(){
    if(this.props.promoLoading){
      return (
        <Spinner size='large' />
      );
    }
    else {
      return <Button onPress={this.onPress.bind(this)} overStyle={{ width: 150, borderColor: '#ecedee' }}>Get Points</Button>;
    }
  }

  renderIcon(image) {
    if (image) {
        return (
          <Image
          style={styles.thumbnailStyle}
          source={{uri: image }}
          />
        );
    }
    else {
      return(
      <Image
      style={styles.thumbnailStyle}
      source={require('../assets/no-user-image.gif')}
      />);
    }
}


  render() {
    const { user, promoCode } = this.props;
    //console.log(user)
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
              {this.renderIcon(this.props.user.image)}
              </View>
              <View style={{ flex: 2 , flexDirection: 'column', justifyContent: 'center', marginBottom: 10, marginTop: -30 }}>
              <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 25 }}>{this.props.user.name}</Text>
              </View>
        </View>
        <View style={{ flex: 9, justifyContent: 'center'}}>
        <View style={{ flex: 5, justifyContent: 'center'}}>
        <Text style={styles.normalTextStyle}>Enter your unique invite or promo code below to claim your points!</Text>
        <Icon name='ios-pricetags' size= {150} color='#000' style={{ alignSelf: 'center' }} />
        </View>
        <View style={{ flex: 4, justifyContent: 'center'}}>
        <InputLine
          onChangeText={value => this.props.userMainUpdate({ prop: 'promoCode', value })}
          placeholder='A04F765GH'
          placeholderTextColor='gray'
          selectionColor='#0084b4'
          overStyle={{ borderBottomColor: '#0084b4', color: '#0084b4', textAlign: 'center' }}
          value={this.props.promoCode}
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
  marginTop: 10,
  marginBottom: 10,
  color: '#000',
  fontWeight: 'normal',
  textAlign: 'center'
}
}

const mapStateToProps = state => {
  const { user, uid, promoCode, promoLoading } = state.userMain;
  return { user, uid, promoCode, promoLoading};
}

export default connect(mapStateToProps, { getPoints, userMainUpdate })(GetPoints);
