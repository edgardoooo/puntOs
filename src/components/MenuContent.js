import React, { Component } from 'react';
import { Text, View, Image, TouchableWithoutFeedback, TouchableOpacity, Alert} from 'react-native';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/Ionicons';
import { logoutUser } from '../actions';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

class MenuContent extends Component {

  IconImage(image){
    if (image) {
        return (
          <Image style={styles.IconStyle} source={{uri: image }} />
        );
    }
    else {
    return ( <Image style={styles.IconStyle} source={require('../assets/no-user-image.gif')} />);
    }
  }

  renderSwitch(){
    if(this.props.user.linked){
          return(
            <TouchableOpacity style={styles.itemContainer} onPress={() => {Actions.drawerClose(); Actions.switchAccountUser();}}>
                <View style={{ alignSelf: 'stretch', flexDirection: 'row' }}>
                  <View style={styles.itemIconStyle}>
                    <Icon name='md-switch' size= {25} color='#fff' style={{ alignSelf: 'center' }} />
                  </View>
                  <View style={styles.itemTextStyle}>
                      <Text style={{ alignSelf: 'flex-start', fontSize: 15}}>
                        Switch to Business
                      </Text>
                  </View>
                </View>
            </TouchableOpacity>
          );
        }
        else{
          return(
            <View style={styles.itemContainer}>
                <View style={{ alignSelf: 'stretch', flexDirection: 'row' }}>
                  <View style={styles.itemIconStyle}>
                    <Icon name='md-switch' size= {25} color='#fff' style={{ alignSelf: 'center' }} />
                  </View>
                  <View style={styles.itemTextStyle}>
                      <Text style={{ alignSelf: 'flex-start', fontSize: 15, color: 'grey' }}>
                        Switch to Business
                      </Text>
                      <Text style={{ alignSelf: 'flex-start', fontSize: 8, color: 'grey' }}>
                        No account linked
                      </Text>
                  </View>
                </View>
            </View>
          );
        }
    }

  render() {
    return (
      <View style={styles.container}>
      <View style={{alignSelf: 'stretch'}}>
      <TouchableWithoutFeedback onPress={() => {Actions.drawerClose();}}>
        <Icon name='md-close' size= {25} color='#0084b4' style={{ alignSelf: 'flex-end' ,paddingTop: 15, paddingRight: 10 }} />
      </TouchableWithoutFeedback>
      </View>
      <TouchableOpacity style={styles.itemContainer} onPress={() => {Actions.UserProfile();}}>
            <View style={{ flexDirection: 'row' }}>
            <View style={{ paddingTop: 10, justifyContent: 'center', alignItems: 'center'}}>
                {this.IconImage(this.props.user.image)}
            </View>
            <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.NameStyle}>
                    {this.props.user.name}
                </Text>
            </View>
          </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.itemContainer} onPress={() => {Actions.drawerClose();Actions.Leaderboard();}}>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.itemIconStyle}>
              <Icon name='md-stats' size= {25} color='#fff' style={{ alignSelf: 'center' }} />
            </View>
            <View style={styles.itemTextStyle}>
                <Text style={{ alignSelf: 'flex-start', fontSize: 15}}>
                  Leaderboard
                </Text>
            </View>
      </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.itemContainer} onPress={() => {Actions.drawerClose(); Actions.Favorites();}}>
          <View style={{ alignSelf: 'stretch', flexDirection: 'row' }}>
            <View style={styles.itemIconStyle}>
              <Icon name='md-star' size= {25} color='#fff' style={{ alignSelf: 'center' }} />
            </View>
            <View style={styles.itemTextStyle}>
                <Text style={{ alignSelf: 'flex-start', fontSize: 15}}>
                  Favorites
                </Text>
            </View>
          </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.itemContainer} onPress={() => {Actions.drawerClose(); Actions.myCoupons();}}>
          <View style={{ alignSelf: 'stretch', flexDirection: 'row' }}>
            <View style={styles.itemIconStyle}>
              <Icon name='md-pricetag' size= {25} color='#fff' style={{ alignSelf: 'center' }} />
            </View>
            <View style={styles.itemTextStyle}>
                <Text style={{ alignSelf: 'flex-start', fontSize: 15}}>
                  My Coupons
                </Text>
            </View>
          </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.itemContainer} onPress={() => {Actions.drawerClose(); Actions.userStats();}}>
          <View style={{ alignSelf: 'stretch', flexDirection: 'row' }}>
            <View style={styles.itemIconStyle}>
              <Icon name='md-stats' size= {25} color='#fff' style={{ alignSelf: 'center' }} />
            </View>
            <View style={styles.itemTextStyle}>
                <Text style={{ alignSelf: 'flex-start', fontSize: 15}}>
                  My Stats
                </Text>
            </View>
          </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.itemContainer} onPress={() => {Actions.drawerClose();Actions.inviteFriends();}}>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.itemIconStyle}>
              <Icon name='md-mail' size= {25} color='#fff' style={{ alignSelf: 'center' }} />
            </View>
            <View style={styles.itemTextStyle}>
                <Text style={{ alignSelf: 'flex-start', fontSize: 15}}>
                  Invite Friends
                </Text>
            </View>
          </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.itemContainer} onPress={() => {Actions.drawerClose();Actions.getPoints();}}>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.itemIconStyle}>
              <Icon name='md-ribbon' size= {25} color='#fff' style={{ alignSelf: 'center' }} />
            </View>
            <View style={styles.itemTextStyle}>
                <Text style={{ alignSelf: 'flex-start', fontSize: 15}}>
                  Get Points
                </Text>
            </View>
          </View>
      </TouchableOpacity>
      {this.renderSwitch()}
      <TouchableOpacity style={styles.itemContainer} onPress={() => {
        Alert.alert('Sign out?','',
        [{text: 'Cancel', onPress: () => Actions.drawerClose(), style: 'cancel'},
        {text: 'OK', onPress: () => { Actions.login({ type: 'reset' });this.props.logoutUser();}}]);
      }}>
          <View style={{ alignSelf: 'stretch', flexDirection: 'row' }}>
            <View style={styles.itemIconStyle}>
              <Icon name='md-exit' size= {25} color='#fff' style={{ alignSelf: 'center' }} />
            </View>
            <View style={styles.itemTextStyle}>
                <Text style={{ alignSelf: 'flex-start', fontSize: 15 }}>
                  Sign Out
                </Text>
            </View>
          </View>
      </TouchableOpacity>
      <View style={{ flex: 3 }}>
      </View>
    </View >
  );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'column'
  },
  IconStyle: {
      height: 40,
      width: 40,
      borderWidth: 1,
      borderRadius: 20,
      borderColor: '#ababab',
      resizeMode: 'contain',
      alignSelf: 'flex-start'
  },
  NameStyle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 10,
      marginTop: 10,
      alignSelf: 'flex-start'
  },
  itemTextStyle:{
    flex:4, justifyContent: 'center', alignItems: 'center',
    paddingBottom: 5, marginLeft: 10, flexDirection: 'column'
  },
  itemIconStyle:{
    height: 40, width: 40, alignSelf: 'center',
    alignItems: 'center', justifyContent: 'center',
    borderRadius: 50, backgroundColor: '#0084b4'
  },
  itemContainer:{
    flex: 1, alignSelf: 'stretch', flexDirection: 'row', paddingBottom: 5, paddingLeft: 5,
    borderBottomColor: 'grey',
    borderBottomWidth: 0.5,
    alignItems: 'center'
  }
};


const mapStateToProps = state => {
  const { user, uid } = state.userMain;
  return { user, uid };
};


export default connect(mapStateToProps,{ logoutUser })(MenuContent);
