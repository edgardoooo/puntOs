import React, { Component } from 'react';
import { View, Text, Image, ScrollView, LayoutAnimation,
  TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert, Picker } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import { InputLine, Button, Spinner } from './common';
import { businessFormUpdate, businessSignUp, getLocation } from '../actions';
import Icon from 'react-native-vector-icons/Ionicons';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BUSINESS_NAME_REGEX, EMAIL_REGEX,
  USERNAME_REGEX, PASSWORD_REGEX, ZIP_REGEX, CITY_LIST, PHONE_REGEX } from './../constants';

class BusinessSignUpForm extends Component {
  state = { nameBorder: '#0084b4', passwordBorder: '#0084b4', emailBorder: '#0084b4',
   userBorder: '#0084b4', confirmBorder: '#0084b4', zipCodeBorder:'#0084b4', phoneBorder: '#0084b4',
   pickerOpen: false, cityItems: [] };

  componentWillMount(){
    var cityItems = CITY_LIST.map((value, index) => {
    return <Picker.Item key={index} value={value} label={value} />
    });
    this.setState({cityItems: cityItems});
  }

  componentWillUpdate() {
  LayoutAnimation.spring();
  }

  validateInput(input, value){
    switch(input){
      case 'BusinessName': {
          if(value.match(BUSINESS_NAME_REGEX)){
            this.setState({nameBorder: '#0084b4'});
            return;
          }
          else {
            this.setState({nameBorder: '#f97171'});
            return;
          }
      }
      case 'Email': {
        if(value.match(EMAIL_REGEX)){
          this.setState({emailBorder: '#0084b4'});
          return;
        } else {
          this.setState({emailBorder: '#f97171'});
          return;
        }
      }
      case 'Username': {
        if(value.match(USERNAME_REGEX)){
          this.setState({userBorder: '#0084b4'});
          return;
        } else {
          this.setState({userBorder: '#f97171'});
          return;
        }
      }
      case 'Password': {
        if(value.match(PASSWORD_REGEX)){
          this.setState({passwordBorder: '#0084b4'});
          return;
        } else {
          this.setState({passwordBorder: '#f97171'});
          return;
        }
      }
      case 'ConfirmPassword': {
        if(this.props.password === value){
          this.setState({confirmBorder: '#0084b4'});
          return;
        } else {
          this.setState({confirmBorder: '#f97171'});
          return;
        }
      }
      case 'zipCode': {
        if(value.match(ZIP_REGEX)){
          this.setState({zipCodeBorder: '#0084b4'});
          return;
        } else {
          this.setState({zipCodeBorder: '#f97171'});
          return;
        }
      }
      case 'phone': {
        if(value.match(PHONE_REGEX)){
          this.setState({phoneBorder: '#0084b4'});
          if(value.indexOf('.') === -1 && value.indexOf('-') === -1){
            const new_phone = value.slice(0,3) + '-' + value.slice(3,6) + '-' + value.slice(6);
            this.props.businessFormUpdate({ prop: 'phoneNumber', value: new_phone })
          }
          return;
        } else {
          this.setState({phoneBorder: '#f97171'});
          return;
        }
      }
    }
  }

  togglePicker(){
    this.setState({ pickerOpen: !this.state.pickerOpen });
  }

  renderSelected(){
    const { city } = this.props;
    if(!this.state.pickerOpen){
    return (
      <TouchableWithoutFeedback onPress={() => this.togglePicker()}>
      <View style={{ flexDirection: 'row', borderColor: '#0084b4', borderRadius: 2,
      borderWidth: 1, alignSelf: 'stretch', marginLeft: 40, marginRight: 40 }}>
      <Text style={{ flex: 9, fontSize: 20,color: '#0084b4' , alignSelf: 'flex-start', paddingLeft: 5, paddingTop: 2, paddingBottom: 2 }}>
      {city}
      </Text>
      <Icon name='ios-arrow-down' size={30} color='#0084b4' style={{ flex: 1, alignSelf: 'flex-end', paddingRight: 5 }} />
      </View>
      </TouchableWithoutFeedback>
    );
  }
  }

  renderPicker(){
    if(this.state.pickerOpen){
      //console.log(this.state.cityItems)
      return(
      <View style={{ flex: 1, alignSelf: 'stretch', marginRight: 40, marginLeft: 40}}>
      <TouchableOpacity onPress={() => this.togglePicker()}>
      <Text style={{ alignSelf: 'flex-end', marginRight: 5, color: '#0084b4' }}>Done</Text>
      </TouchableOpacity>
      <Picker
       selectedValue={this.props.city}
       onValueChange={value => this.props.businessFormUpdate({ prop: 'city', value })}
      >
      {this.state.cityItems}
      </Picker>
      </View>
    );
    }
  }

  renderContent(){
    const { businessName,username,addressLine,city,country,zipCode,phoneNumber,email,
    password,confirmPassword,type,step,size,error,loading,businessFormUpdate, businessSignUp, longitude, latitude} = this.props;
    if (step === 1){
      return (
      <View style={styles.containerStyle}>
      <Text style={{ fontSize: 14,color: 'black', fontWeight: 'bold', paddingBottom: 10 }}>
      1 of 4
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
        onChangeText={value => {
          businessFormUpdate({ prop: 'businessName', value });
          this.validateInput('BusinessName', value);
        }}
        placeholder='Business Name'
        placeholderTextColor='gray'
        maxLength={25}
        selectionColor='#0084b4'
        overStyle={{ borderBottomColor: this.state.nameBorder, color: '#0084b4' }}
        value={businessName}
      />
      <InputLine
        onChangeText={value => {
          businessFormUpdate({ prop: 'email', value });
          this.validateInput('Email', value);
        }}
        placeholder='email@gmail.com'
        placeholderTextColor='gray'
        selectionColor='#0084b4'
        overStyle={{ borderBottomColor: this.state.emailBorder, color: '#0084b4' }}
        value={email}
      />
      <InputLine
        onChangeText={value => {
        businessFormUpdate({ prop: 'username', value });
        this.validateInput('Username', value);
        }}
        placeholder='username'
        placeholderTextColor='gray'
        selectionColor='#0084b4'
        maxLength={15}
        overStyle={{ borderBottomColor: this.state.userBorder, color: '#0084b4' }}
        value={username}
      />
      <InputLine
        onChangeText={value => {
        businessFormUpdate({ prop: 'password', value });
        this.validateInput('Password', value);
        }}
        secureTextEntry
        placeholder='password'
        placeholderTextColor='gray'
        selectionColor='#0084b4'
        maxLength={16}
        overStyle={{ borderBottomColor: this.state.passwordBorder, color: '#0084b4' }}
        value={password}
      />
      <InputLine
        onChangeText={value => {
        businessFormUpdate({ prop: 'confirmPassword', value });
        this.validateInput('ConfirmPassword', value);
        }}
        secureTextEntry
        placeholder='confirm password'
        placeholderTextColor='gray'
        selectionColor='#0084b4'
        maxLength={16}
        overStyle={{ borderBottomColor: this.state.confirmBorder, color: '#0084b4' }}
        value={confirmPassword}
      />
      </View>
    );
    } else if (step === 2){
      return (
      <View style={styles.containerStyle}>
      <Text style={{ fontSize: 14,color: 'black', fontWeight: 'bold', paddingBottom: 10 }}>
      2 of 4
      </Text>
      <ProgressBar
      progress={0.25}
      width={300}
      color='#0084b4'
      />
      <Text style={{ fontSize: 20,color: 'black', fontWeight: 'bold', paddingTop: 30 }}>
      Contact Information
      </Text>
      <InputLine
        onChangeText={value => businessFormUpdate({ prop: 'addressLine', value })}
        placeholder='Street Apt#'
        placeholderTextColor='gray'
        selectionColor='#0084b4'
        maxLength={25}
        overStyle={{ borderBottomColor: '#0084b4', color: '#0084b4' }}
        value={addressLine}
      />
      {this.renderSelected()}
      {this.renderPicker()}
      <InputLine
        onChangeText={value => {
        businessFormUpdate({ prop: 'zipCode', value });
        this.validateInput('zipCode', value);
        }}
        placeholder='Zipcode'
        secureTextEntry={false}
        placeholderTextColor='gray'
        selectionColor='#0084b4'
        keyboardType = 'numeric'
        maxLength={5}
        overStyle={{ borderBottomColor: this.state.zipCodeBorder, color: '#0084b4' }}
        value={zipCode}
      />
     <InputLine
        onChangeText={value => businessFormUpdate({ prop: 'country', value })}
        secureTextEntry={false}
        placeholder='Country'
        placeholderTextColor='gray'
        maxLength={20}
        selectionColor='#0084b4'
        overStyle={{ borderBottomColor: '#0084b4', color: '#0084b4' }}
        value={country}
      />
      <InputLine
        onChangeText={value => {
        businessFormUpdate({ prop: 'phoneNumber', value });
        this.validateInput('phone', value);
        }}
        placeholder='Phone Number'
        placeholderTextColor='gray'
        selectionColor='#0084b4'
        overStyle={{ borderBottomColor: this.state.phoneBorder, color: '#0084b4' }}
        value={phoneNumber}
      />
      </View>
    );
    } else if (step === 3) {
      return (
      <View style={styles.containerStyle}>
      <Text style={{ fontSize: 14,color: 'black', fontWeight: 'bold', paddingBottom: 10 }}>
      3 of 4
      </Text>
      <ProgressBar
      progress={0.50}
      width={300}
      color='#0084b4'
      />
      <Text style={{ fontSize: 20,color: 'black', fontWeight: 'bold', paddingTop: 30 }}>
      Business Location
      </Text>
      <Text style={{ color: 'black', fontWeight: 'bold', paddingTop: 10, paddingBottom: 10 }}>
      Tap the pin icon to get your current location.
      </Text>
      <TouchableOpacity onPress={() => {this.props.getLocation()}}>
      <Icon name='md-pin' size= {80} color='#0084b4' style={{ alignSelf: 'center' }} />
      </TouchableOpacity>
      <View style={{ height: 40,
          width: 300,
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
          marginBottom: 10,
          borderBottomColor: '#0084b4',
          borderBottomWidth: 1.5}}>
      <Text
        style={{ paddingRight: 5,
            paddingLeft: 5,
            paddingBottom: 5,
            marginLeft: 40,
            marginRight: 40,
            fontSize: 18,
            lineHeight: 23,
            flex: 2,
            color: '#0084b4'}}
      >{latitude ? latitude: 'latitude'}</Text>
      </View>
      <View style={{ height: 40,
          width: 300,
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
          marginBottom: 10,
          borderBottomColor: '#0084b4',
          borderBottomWidth: 1.5}}>
      <Text
        style={{ paddingRight: 5,
            paddingLeft: 5,
            paddingBottom: 5,
            marginLeft: 40,
            marginRight: 40,
            fontSize: 18,
            lineHeight: 23,
            flex: 2,
            color: '#0084b4'}}
      >{longitude ? longitude: 'longitude'}</Text>
      </View>
      </View>

    );
  } else if (step === 4) {
    return (
    <View style={styles.containerStyle}>
    <Text style={{ fontSize: 14,color: 'black', fontWeight: 'bold', paddingBottom: 10 }}>
    4 of 4
    </Text>
    <ProgressBar
    progress={0.75}
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
      <View style={{ flex: 1, flexDirection: 'column', alignSelf: 'center', alignItems: 'center' }}>
        <Text style={styles.sizeTextStyle}>{size}</Text>
        {this.renderSizeValue()}
      </View>
    </View>
    </View>
  );
  }
  }

  onNextPress(){
    const { businessName,username,email,addressLine,city, country, zipCode, phoneNumber,
    password,step,error,type,size,businessFormUpdate, businessSignUp, latitude, longitude } = this.props;
    var emailError = '';
    var passwordError = '';
    var usernameError = '';
    var nameError = '';
    var confirmError = '';
    var phoneError = '';
    var zipError = '';
    var alertMessage = '';
    if (step === 1) {
      if (email != '' && password != '' && username != '' && businessName != '' ){
        if(this.state.nameBorder === '#f97171') {
          nameError = 'Business Name: Can only include letters, numbers and characters - or \'';
          alertMessage+= nameError + '\n';
        }
        if(this.state.emailBorder === '#f97171'){
          emailError= 'Email: Invalid Email';
          alertMessage+= emailError + '\n';
        }
        if(this.state.userBorder === '#f97171'){
          usernameError= 'Username: Can only include letters, numbers and charaters - , _ or .';
          alertMessage+= usernameError + '\n';
        }
        if(this.state.passwordBorder === '#f97171'){
          passwordError= 'Password: Must contain 6-15 characters and at least 1 number, 1 special character from (!@#$%^&*)';
          alertMessage+= passwordError + '\n';
        }
        if(this.state.confirmBorder === '#f97171'){
          confirmError= 'Confirm Password: passwords do not match.';
          alertMessage+= confirmError + '\n';
        }
        if (alertMessage === ''){
          businessFormUpdate({ prop: 'step', value: 2});
          businessFormUpdate({ prop: 'error', value: ''});
        } else {
          Alert.alert('Fix Errors!',alertMessage, {text: 'OK'});
        }
      }
      else {
        businessFormUpdate({ prop: 'error', value: 'Missing Inputs' })
      }
    }
    else if (step === 2) {
      if (addressLine != '' && city != '' && zipCode != '' && country != '' && phoneNumber != '' ){
        if(this.state.zipCodeBorder === '#f97171') {
          zipError = 'Zip Code: Must contain only 5 digits.';
          alertMessage+= zipError + '\n';
        }
        if(this.state.phoneBorder === '#f97171'){
          phoneError= 'Phone: Must contain 10 digits in the formats (xxx-xxx-xxxx or xxx.xxx.xxxx)';
          alertMessage+= phoneError + '\n';
        }
        if (alertMessage === ''){
          businessFormUpdate({ prop: 'step', value: 3});
          businessFormUpdate({ prop: 'error', value: ''});
        } else {
          Alert.alert('Fix Errors!',alertMessage, {text: 'OK'});
        }
      }
      else {
        businessFormUpdate({ prop: 'error', value: 'Missing Inputs' })
      }
    } else if (step === 3) {
          if (longitude === '' || latitude === ''){
            Alert.alert('No Location Set!','If you skip this step, our system will use your address to set your location.\
             This could cause the checkin system to be less accurate. You can always reset your business location later by going to the app settings.',
            [{text: 'Cancel', onPress: () => {}, style: 'cancel'},
            {text: 'Continue', onPress: () => {businessFormUpdate({ prop: 'step', value: 4});businessFormUpdate({ prop: 'error', value: ''});}}]);
          } else{
            businessFormUpdate({ prop: 'step', value: 4});
            businessFormUpdate({ prop: 'error', value: ''});
          }

          } else {
      businessSignUp({businessName,username,addressLine,city,country,zipCode,phoneNumber,email,
      password,type,size, latitude, longitude});
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
    if (step === 4) {
      businessFormUpdate({ prop: 'step', value: 3 })
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

  renderSizeValue() {
    const { step, size } = this.props;
    if (step === 4){
      switch(size){
        case 'Small':
          return <Text style={{ fontSize: 16, color: '#f97171', fontWeight: 'bold', marginBottom: -15 }}>40 ft. radius</Text>
        case 'Medium':
          return <Text style={{ fontSize: 16, color: '#f97171', fontWeight: 'bold', marginBottom: -15  }}>60 ft. radius</Text>
        case 'Large':
          return <Text style={{ fontSize: 16, color: '#f97171', fontWeight: 'bold', marginBottom: -15  }}>80 ft. radius</Text>
        case 'XLarge':
          return <Text style={{ fontSize: 16, color: '#f97171', fontWeight: 'bold', marginBottom: -15  }}>100 ft. radius</Text>
        default:
          return;
      }
    }
  }

  render() {
    return (

      <KeyboardAwareScrollView
      style={{ backgroundColor: '#fff', flex: 1 }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
      >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
      </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
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
  sizeTextStyle: {
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
    confirmPassword,
    error,
    loading,
    step,
    size,
    type,
    longitude,
    latitude} = state.businessSignUp;
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
      confirmPassword,
      error,
      loading,
      step,
      size,
      type,
      longitude,
      latitude};
};

export default connect(mapStateToProps, { businessFormUpdate, businessSignUp, getLocation })(BusinessSignUpForm);
