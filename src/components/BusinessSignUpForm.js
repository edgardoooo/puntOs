import React, { Component } from 'react';
import { View, Text, Image, ScrollView, LayoutAnimation, TouchableOpacity } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import { InputLine, Button, Spinner } from './common';
import { businessFormUpdate, businessSignUp } from '../actions';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

class BusinessSignUpForm extends Component {

  componentWillUpdate() {
  LayoutAnimation.spring();
  }
  renderContent(){
    const { businessName,username,addressLine,city,country,zipCode,phoneNumber,email,
    password,type,step,size,error,loading,businessFormUpdate, businessSignUp} = this.props;
    if (step === 1){
      return (
      <View style={styles.containerStyle}>
      <Text style={{ fontSize: 14,color: 'black', fontWeight: 'bold', paddingBottom: 10 }}>
      1 of 3
      </Text>
      <ProgressBar
      progress={0}
      width={300}
      color='#0084b4'
      />
      <Text style={{ fontSize: 20,color: 'black', fontWeight: 'bold', paddingTop: 30 }}>
      Credentials
      </Text>
      <InputLine
        onChangeText={value => businessFormUpdate({ prop: 'businessName', value })}
        placeholder='Business Name'
        placeholderTextColor='gray'
        selectionColor='#0084b4'
        overStyle={{ borderBottomColor: '#0084b4', color: '#0084b4' }}
        value={businessName}
      />
      <InputLine
        onChangeText={value => businessFormUpdate({ prop: 'email', value })}
        placeholder='email@gmail.com'
        placeholderTextColor='gray'
        selectionColor='#0084b4'
        overStyle={{ borderBottomColor: '#0084b4', color: '#0084b4' }}
        value={email}
      />
      <InputLine
        onChangeText={value => businessFormUpdate({ prop: 'username', value })}
        placeholder='username'
        placeholderTextColor='gray'
        selectionColor='#0084b4'
        overStyle={{ borderBottomColor: '#0084b4', color: '#0084b4' }}
        value={username}
      />
      <InputLine
        onChangeText={value => businessFormUpdate({ prop: 'password', value })}
        secureTextEntry
        placeholder='password'
        placeholderTextColor='gray'
        selectionColor='#0084b4'
        overStyle={{ borderBottomColor: '#0084b4', color: '#0084b4' }}
        value={password}
      />
      </View>
    );
    } else if (step === 2){
      return (
      <View style={styles.containerStyle}>
      <Text style={{ fontSize: 14,color: 'black', fontWeight: 'bold', paddingBottom: 10 }}>
      2 of 3
      </Text>
      <ProgressBar
      progress={0.33}
      width={300}
      color='#0084b4'
      />
      <Text style={{ fontSize: 20,color: 'black', fontWeight: 'bold', paddingTop: 30 }}>
      Contact Information
      </Text>
      <InputLine
        onChangeText={value => businessFormUpdate({ prop: 'addressLine', value })}
        placeholder='AddressLine'
        placeholderTextColor='gray'
        selectionColor='#0084b4'
        overStyle={{ borderBottomColor: '#0084b4', color: '#0084b4' }}
        value={addressLine}
      />
      <InputLine
        onChangeText={value => businessFormUpdate({ prop: 'city', value })}
        placeholder='City'
        placeholderTextColor='gray'
        selectionColor='#0084b4'
        overStyle={{ borderBottomColor: '#0084b4', color: '#0084b4' }}
        value={city}
      />
      <InputLine
        onChangeText={value => businessFormUpdate({ prop: 'zipCode', value })}
        placeholder='Zipcode'
        placeholderTextColor='gray'
        selectionColor='#0084b4'
        overStyle={{ borderBottomColor: '#0084b4', color: '#0084b4' }}
        value={zipCode}
      />
      <InputLine
        onChangeText={value => businessFormUpdate({ prop: 'country', value })}
        placeholder='Country'
        placeholderTextColor='gray'
        selectionColor='#0084b4'
        overStyle={{ borderBottomColor: '#0084b4', color: '#0084b4' }}
        value={country}
      />
      <InputLine
        onChangeText={value => businessFormUpdate({ prop: 'phoneNumber', value })}
        placeholder='Phone Number'
        placeholderTextColor='gray'
        selectionColor='#0084b4'
        overStyle={{ borderBottomColor: '#0084b4', color: '#0084b4' }}
        value={phoneNumber}
      />
      </View>
    );
    } else if (step === 3) {
      return (
      <View style={styles.containerStyle}>
      <Text style={{ fontSize: 14,color: 'black', fontWeight: 'bold', paddingBottom: 10 }}>
      3 of 3
      </Text>
      <ProgressBar
      progress={0.66}
      width={300}
      color='#0084b4'
      />
      <Text style={{ fontSize: 20,color: 'black', fontWeight: 'bold', paddingTop: 30 }}>
      Business Size
      </Text>
      <View style={{ flex: 1, flexDirection: 'column', alignSelf: 'center', alignItems: 'center'}}>
        <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'center', alignItems: 'center', paddingTop: 20, paddingBottom: 10}}>
        <TouchableOpacity onPress={() => businessFormUpdate({ prop: 'size', value: 'Small'})} >
        <Image
          style={styles.thumbnailStyle}
          source={require('../assets/smallRadIcon.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => businessFormUpdate({ prop: 'size', value: 'Medium'})}>
          <Image
          style={styles.thumbnailStyle}
          source={require('../assets/mediumRadIcon.png')}
          />
        </TouchableOpacity>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'center', alignItems: 'center', paddingTop: 10, paddingBottom: 10}}>
        <TouchableOpacity onPress={() => businessFormUpdate({ prop: 'size', value: 'Large'})}>
          <Image
            style={styles.thumbnailStyle}
            source={require('../assets/largeRadIcon.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => businessFormUpdate({ prop: 'size', value: 'XLarge'})}>
          <Image
            style={styles.thumbnailStyle}
            source={require('../assets/xlargeRadIcon.png')}
          />
        </TouchableOpacity>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'center', alignItems: 'center' }}>
          <Text style={styles.normalTextStyle}>{size}</Text>
        </View>
      </View>
      </View>
    );
  }
  }

  onNextPress(){
    const { businessName,username,email,addressLine,city, country, zipCode, phoneNumber,
    password,step,error,type,businessFormUpdate, businessSignUp } = this.props;
    if (step === 1) {
      if (email != '' && password != '' && username != '' && businessName != '' ){
        businessFormUpdate({ prop: 'step', value: 2})
        businessFormUpdate({ prop: 'error', value: ''})
      }
      else {
        businessFormUpdate({ prop: 'error', value: 'Missing Inputs' })
      }
    }
    else if (step === 2) {
      businessFormUpdate({ prop: 'step', value: 3 })
      businessFormUpdate({ prop: 'error', value: ''})
    }
    else {
      businessSignUp({businessName,username,addressLine,city,country,zipCode,phoneNumber,email,
      password,type});
    }
  }

  onBackPress(){
    const { step,error,businessFormUpdate, businessSignUp} = this.props;
    if (step === 2) {
        businessFormUpdate({ prop: 'step', value: 1})
        businessFormUpdate({ prop: 'error', value: ''})
    }
    if (step === 3) {
      businessFormUpdate({ prop: 'step', value: 2 })
      businessFormUpdate({ prop: 'error', value: ''})
    }
  }

  renderButtons(){
    const { step, loading } = this.props;
    if (loading){
      return (
        <Spinner size='large' />
      );} else if (step > 1) {
      return (  <View style={{ width: 100, flexDirection: 'row', justifyContent: 'center'}}>
                  <Button onPress={this.onBackPress.bind(this)} overStyle={{ width: 150 }}>Back</Button>
                  <Button onPress={this.onNextPress.bind(this)} overStyle={{ width: 150 }}>Next</Button>
                </View>
            );
    }
    else {
      return (
                <View style={{ width: 100, flexDirection: 'row', justifyContent: 'center'}}>
                  <Button disabled overStyle={{ backgroundColor: 'gray', borderColor: 'gray', width: 150 }}>Back</Button>
                  <Button onPress={this.onNextPress.bind(this)} overStyle={{ width: 150 }}>Next</Button>
                </View>
              );
    }
  }

  renderError() {
    const { error } = this.props;
    if (error) {
      return (
        <View>
          <Text style={styles.errorTextStyle}>
            {error}
          </Text>
        </View>
      );
    }
  }

  render() {
    return (
      <ScrollView style={{ backgroundColor: '#fff' }}>
      <View style={styles.backgroundStyle}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 10, paddingBottom: 10 }}>
          <Text style={styles.normalTextStyle}>
          Register your
          </Text>
          <Text style={styles.bigStyle}>
          Business
          </Text>
        </View>
      <View style={styles.containerStyle}>
          {this.renderContent()}
          {this.renderError()}
          {this.renderButtons()}
      </View>
      </View>
      </ScrollView>
    );
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: '#f97171'
  },
  backgroundStyle: {
    flex: 1,
    backgroundColor: '#fff',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  containerStyle: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#fff',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  normalTextStyle: {
    fontSize: 20,
    color: 'black'
  },
bigStyle: {
  fontSize: 50,
  fontFamily: 'Futura',
  color: '#0084b4'
},
thumbnailStyle: {
height: 110,
width: 110,
flex:1,
alignSelf: 'center',
resizeMode: 'contain'
}
}

const mapStateToProps = state => {
  const {
    businessName,
    username,
    addressLine,
    city,
    country,
    zipCode,
    phoneNumber,
    email,
    password,
    error,
    loading,
    step,
    size,
    type} = state.businessSignUp;
  return {
      businessName,
      username,
      addressLine,
      city,
      country,
      zipCode,
      phoneNumber,
      email,
      password,
      error,
      loading,
      step,
      size,
      type};
};

export default connect(mapStateToProps, { businessFormUpdate, businessSignUp })(BusinessSignUpForm);
