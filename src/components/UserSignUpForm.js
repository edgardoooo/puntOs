import React, { Component } from 'react';
import { View, Text, Image, LayoutAnimation, ScrollView, Picker, TouchableWithoutFeedback, TouchableOpacity, Alert, Keyboard } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import TextInputMask from 'react-native-text-input-mask';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';
import { InputLine, Button, Spinner } from './common';
import { signUpUser, userSignUpUpdate } from './../actions';
import {
  EMAIL_REGEX,
  NAME_REGEX,
  PASSWORD_REGEX,
  PHONE_REGEX,
  HOMETOWN_REGEX,
  CITY_LIST
 } from './../constants';


class UserSignUpForm extends Component {
  state = { pickerOpen: false, cityItems: [] };

  componentWillMount(){
    var cityItems = CITY_LIST.map((value, index) => {
      return <Picker.Item key={index} value={value} label={value} />
      });
      this.setState({cityItems: cityItems});
  }

  componentWillUpdate() {
    LayoutAnimation.spring();
  }

  togglePicker(){
    this.setState({ pickerOpen: !this.state.pickerOpen });
  }

  renderSelected(){
    const { hometown } = this.props;
    if(!this.state.pickerOpen){
    return (
      <TouchableWithoutFeedback onPress={() => this.togglePicker()}>
      <View style={{ flexDirection: 'row', borderColor: '#0084b4', borderRadius: 2,
      borderWidth: 1, alignSelf: 'stretch', marginLeft: 40, marginRight: 40 }}>
      <Text style={{ flex: 9, fontSize: 20,color: '#0084b4' , alignSelf: 'flex-start', paddingLeft: 5, paddingTop: 2, paddingBottom: 2 }}>
      {hometown}
      </Text>
      <Icon name='ios-arrow-down' size={30} color='#0084b4' style={{ flex: 1, alignSelf: 'flex-end', paddingRight: 5 }} />
      </View>
      </TouchableWithoutFeedback>
    );
  }
  }

  renderPicker(){
    if(this.state.pickerOpen){
      console.log(this.state.cityItems)
      return(
      <View style={{ flex: 1, alignSelf: 'stretch', marginRight: 40, marginLeft: 40}}>
      <TouchableOpacity onPress={() => this.togglePicker()}>
      <Text style={{ alignSelf: 'flex-end', marginRight: 5, color: '#0084b4' }}>Done</Text>
      </TouchableOpacity>
      <Picker
       selectedValue={this.props.hometown}
       onValueChange={value => this.props.userSignUpUpdate({ prop: 'hometown', value })}
      >
      {this.state.cityItems}
      </Picker>
      </View>
    );
    }
  }

  render() {
    const {
      containerStyle,
      inputLineStyle,
      normalTextStyle,
      bigTextStyle,
      datePickerContainer,
      credentialsStyle,
      celphoneTextStyle
    } = styles;
    const {
      name,
      email,
      password,
      repassword,
      birthdate,
      hometown,
      telephone,
      loading,
      error,
      user,
      type,
      userSignUpUpdate,
      userSignUp
    } = this.props;

    return (
      <KeyboardAwareScrollView
      style={{ backgroundColor: '#ecedee', flex: 1 }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={containerStyle}
      scrollEnabled={true}
      >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={containerStyle}>


          <Text style={normalTextStyle}>Make your</Text>
          <Text style={bigTextStyle}>Account</Text>

          <Text style={credentialsStyle}> __________________ Credentials __________________ </Text>


          <InputLine
            onChangeText={value => userSignUpUpdate({ prop: 'name', value })}
            maxLength={70}
            placeholder='Full Name'
            placeholderTextColor='gray'
            overStyle={inputLineStyle}
            value={name}
          />
          <InputLine
            onChangeText={value => userSignUpUpdate({ prop: 'email', value })}
            placeholder='john.doe@gmail.com'
            placeholderTextColor='gray'
            overStyle={inputLineStyle}
            value={email}
          />
          <InputLine
            secureTextEntry
            onChangeText={value => userSignUpUpdate({ prop: 'password', value })}
            placeholder='Password'
            placeholderTextColor='gray'
            overStyle={inputLineStyle}
            value={password}
          />
           <InputLine
            secureTextEntry
            onChangeText={value => userSignUpUpdate({ prop: 'repassword', value })}
            placeholder='Re-type Password'
            placeholderTextColor='gray'
            overStyle={inputLineStyle}
            value={repassword}
          />
          <TextInputMask
            onChangeText={value => userSignUpUpdate({ prop: 'telephone', value })}
            placeholder='Telephone'
            placeholderTextColor='gray'
            style={celphoneTextStyle}
            value={telephone}
            mask={"[000]-[000]-[0000]"}
          />
          {this.renderSelected()}
          {this.renderPicker()}
          <View style={datePickerContainer}>
            <Text style={{fontSize: 18, alignSelf: 'flex-start'}}>Birthdate</Text>
            <DatePicker
              onDateChange={value => userSignUpUpdate({ prop: 'birthdate', value })}
              style={{width: 200, paddingLeft: 20 }}
              mode="date"
              placeholder="select date"
              androidMode='spinner'
              format="YYYY-MM-DD"
              minDate="1918-01-01"
              maxDate="2000-01-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              date={birthdate}
            />
          </View>
          {this.renderError()}
          {this.renderFooter()}
      </View>
      </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    );
  }

  renderFooter() {
    if(this.props.loading){
      return (
        <View>
          <Spinner size='large' />
        </View>
      );
    } else {
      return (
        <View>
          <Button onPress={this.SubmitForm.bind(this)}>Submit</Button>
        </View>
      );
    }
  }

  renderError () {
    if(this.props.error){
       return (
        <Text style={styles.errorMessageStyle}>{this.props.error}</Text>
       );
    }
  }

  passwordMatch () {
    return this.props.password === this.props.repassword;
  }
  SubmitForm(){

    const {
      name,
      email,
      password,
      repassword,
      telephone,
      hometown,
      birthdate,
      points,
      type,
      level,
      image
    } = this.props
    var passwordError = "";
    var nameError = "";
    var passwordMatchError ="";
    var telephoneError="";
    var hometownError= "";
    var emailError = "";
    var alertMessage = "";

    if(name&&email&&password&&telephone&&hometown&&birthdate&&repassword){

      if(!EMAIL_REGEX.test(email)){
        emailError="Email: Invalid Email";
        alertMessage += emailError + '\n\n';
      }
      if(!NAME_REGEX.test(name)){
        nameError="Name: Firstname and lastname are required, both should only contain letters.";
        alertMessage += nameError + '\n\n';
      }
      if(!PHONE_REGEX.test(telephone)){
        telephoneError="Telephone: Format Invalid";
        alertMessage += telephoneError + '\n\n';
      }
      if(!PASSWORD_REGEX.test(password)){
        passwordError="Password: Must contain at least 8 characters and at least 1 number, 1 special character from (!@#$%^&*)";
        alertMessage += passwordError + '\n\n';
      }
      if(!HOMETOWN_REGEX.test(hometown)){
        hometownError="Hometown: Not valid hometown";
        alertMessage += hometownError + '\n\n';
      }
      if(!this.passwordMatch()){
        passwordMatchError ="Password: Password doesn't match";
        alertMessage += passwordMatchError + '\n\n';
      }

      if(alertMessage === ""){
        this.props.signUpUser({name,email,password,telephone,hometown,birthdate,type,points,level,image});
      }else{
        Alert.alert('Fix Errors:',alertMessage,
        [{text: 'OK', onPress: () => {
          this.props.userSignUpUpdate({ prop: 'password', value: ''});
          this.props.userSignUpUpdate({ prop: 'repassword', value: ''});
        }}]);
      }

    }
    else{
      this.props.userSignUpUpdate({ prop: 'error', value: 'Missing Fields' });
      this.props.userSignUpUpdate({ prop: 'password', value: ''});
      this.props.userSignUpUpdate({ prop: 'repassword', value: ''});
    }
  }
}


const styles = {
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
  inputLineStyle: {
    borderBottomColor: '#0084b4',
    color: '#0084b4'
  },
  normalTextStyle: {
    fontSize: 20,
    color: 'black'
  },
  bigTextStyle: {
    fontSize: 50,
    fontFamily: 'Futura',
    color: '#0084b4'
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: 10,
    justifyContent: 'center'

  },
  credentialsStyle: {
    color: 'black',
    fontSize: 16,
    marginTop: 10
  },
  errorMessageStyle: {
    color: 'red',
    fontSize: 20,
    marginTop: 15
  },
  celphoneTextStyle: {
    borderBottomColor: '#0084b4',
    color: '#0084b4',
    fontSize: 18,
    borderBottomWidth: 1.5,
    width: 290,
    marginBottom: 10
  }
}

const mapStateToProps = state => {
  const {
    name,
    email,
    password,
    birthdate,
    hometown,
    telephone,
    loading,
    error,
    user,
    type,
    points,
    level,
    repassword,
    image
  } = state.userSignUp;

  return {
    name,
    email,
    password,
    birthdate,
    hometown,
    telephone,
    loading,
    error,
    user,
    type,
    points,
    level,
    repassword,
    image
  }
}

export default connect(mapStateToProps, { signUpUser, userSignUpUpdate })(UserSignUpForm);
