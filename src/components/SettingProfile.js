import React, { Component } from 'react';
import { View, Text, Picker, LayoutAnimation } from 'react-native';
import { Button, Spinner } from './common';
import { settingProfileUpdate, getProfile, logoutUser, setCategory } from '../actions';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

class SettingProfile extends Component {
  componentWillMount() {
    this.props.getProfile(this.props.uid);
  }

    componentWillUpdate(){
      LayoutAnimation.spring();
    }

  renderButton(){
    if(this.props.error != ''){
      return (<View style={{ flex: 1 }}>
      <Button onPress={() => {
        Actions.login({ type: 'reset' })
        this.props.logoutUser();
      }
      } >Back to Login</Button>
      </View>);
    }
    else if(!this.category_set&&!this.props.loading){
      return (<View style={{ flex: 1 }}>
      <Button onPress={() => {
        this.props.setCategory(this.props.category, this.props.uid);
      }
    } >Submit</Button>
      </View>);
    }
    else {
      return;
    }

  }

  renderProgress(){
    if(this.props.loading){
      return (
        <View style={{ flex: 1 }}>
        <Text style={styles.normalTextStyle}>
        Gathering your profile information.
        </Text>
        <Spinner />
        </View>
      );
    }
  }

  renderError(){
    if (this.props.error) {
      return (
        <View style={{ flex: 1 }}>
          <Text style={styles.normalTextStyle}>
            {this.props.error}
          </Text>
        </View>
      );
  }
}

renderCategoryPicker(){
  if(!this.category_set&&!this.props.loading){
    return (
      <View style={{ flex: 1 }}>
      <Text style={{fontSize: 25,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: 25,
      paddingRight: 25 }}>Choose your category:</Text>
      <Picker
       selectedValue={this.props.category}
       onValueChange={value => this.props.settingProfileUpdate({ prop: 'category', value })}
      >
       <Picker.Item label='Restaurant' value='Restaurant' />
       <Picker.Item label='Cafe' value='Cafe' />
       <Picker.Item label='Bar' value='Bar' />
       <Picker.Item label='Club' value='Club' />
       <Picker.Item label='Food Truck' value='Food Truck' />
       <Picker.Item label='Entertainment' value='Entertaiment' />
       <Picker.Item label='Outdoor' value='Outdoor' />
      </Picker>
      </View>
    );
  }
}

  render() {
    return (
      <View style={styles.backgroundStyle}>
      <View style={{ flex:1 }}>
      <Text style={styles.logoStyle}>
      puntOs
      </Text>
      </View>
      <View style={{ flex: 3 }}>
      {this.renderError()}
      {this.renderProgress()}
      {this.renderCategoryPicker()}
      {this.renderButton()}
      </View>
      </View>
    );
  }
}

const styles = {
  backgroundStyle: {
    flex: 1,
    backgroundColor: '#0084b4',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  containerStyle: {
    height: 300,
    backgroundColor: '#0084b4',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  logoStyle: {
    fontSize: 80,
    fontFamily: 'Futura',
    color: 'white',
    marginBottom: 50,
    paddingTop: 30
  },
  normalTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: 30,
    color: 'white',
    fontWeight: 'normal',
    textAlign: 'justify'
  }
}
const mapStateToProps = state => {
  const {
    user,
    uid,
    loading,
    error,
    category_set,
    category} = state.profileSet;
  return {
    user,
    uid,
    loading,
    error,
    category_set,
    category
  };
};

export default connect(mapStateToProps, {settingProfileUpdate, getProfile, setCategory})(SettingProfile);
