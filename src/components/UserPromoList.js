import _ from 'lodash';
import React, { Component } from 'react';
import { View, FlatList, ScrollView, TouchableWithoutFeedback, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
//import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import { userGetPromos, userPrimaryFilterUpdate, userSecondaryFilterUpdate, getFollowing } from '../actions';
import UserPromoItem from './UserPromoItem';
import { Card, CardSection } from './common/';
var pri_filter = 'Promos';
var sec_filter = 'All';

class UserPromoList extends Component {
  componentWillMount() {
    this.props.getFollowing(this.props.uid);
    this.props.userGetPromos(
      this.props.uid,
      this.props.userPrimaryFilterState.primaryFilterSelected,
      this.props.userSecondaryFilterState.secondaryFilterSelected
    );
  }

  renderPrimarySelectedStyle(filter){
    if(pri_filter === filter){
      return ({
      justifyContent: 'center',
      borderRadius: 50,
      backgroundColor: '#0084b4',
      flexDirection: 'column',
      borderColor: '#0084b4',
      borderWidth: 0.5,
      marginRight: 5,
      height: 40,
      width: 40
    });
  } else {
    return ({
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: '#fff',
    flexDirection: 'column',
    borderColor: '#0084b4',
    borderWidth: 0.5,
    marginRight: 5,
    height: 40,
    width: 40
  });
  }
  }

  renderSecondarySelectedStyle(filter){
    if(sec_filter === filter){
      return ({
      justifyContent: 'center',
      borderRadius: 50,
      backgroundColor: '#0084b4',
      flexDirection: 'column',
      borderColor: '#0084b4',
      borderWidth: 0.5,
      marginRight: 5,
      height: 40,
      width: 40
    });
  } else {
    return ({
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: '#fff',
    flexDirection: 'column',
    borderColor: '#0084b4',
    borderWidth: 0.5,
    marginRight: 5,
    height: 40,
    width: 40
  });
  }
  }

  filter(pf, sf) {
    //console.log("at Filter function")
    //console.log("Filtering by " + pf);
    var fol = this.props.following;
    var loc = 0;
    this.props.userGetPromos(this.props.uid, pf, sf, fol);
  }

  renderFilterCarousel() {
    const { filterStyle, filterContainer } = styles;
    const { userPrimaryFilterState, userSecondaryFilterState, pfilter, sfilter } = this.props;
    return (
      <View style={{ flexDirection: 'row', backgroundColor: '#f0eeee', borderTopColor: '#fff', borderBottomColor: '#e3e3e3',
      borderTopWidth: 0.5, borderBottomWidth: 0.5, height: 60, paddingLeft: 5, paddingRight: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2}}>
        <View style={{ flexDirection: 'row', flex: 3, alignSelf: 'stretch' }}>
          <View style={filterContainer}>
            <View style={this.renderPrimarySelectedStyle('Promos')}>
              <TouchableOpacity onPress={() => {
                //this.props.userPrimaryFilterUpdate({prop:'primaryFilterSelected', value: 'Promos'});
                //this.props.pfilter='Promos';
                pri_filter = 'Promos';
                //console.log("changed pfilter to: " + this.props.userPrimaryFilterState.primaryFilterSelected);
                this.filter(pri_filter, sec_filter);
                }}>
                <Icon name='ios-megaphone' size= {25} color={pri_filter === 'Promos' ? 'white' : '#0084b4'} style={{ alignSelf: 'center' }} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={filterContainer}>
            <View style={this.renderPrimarySelectedStyle('Coupons')}>
              <TouchableOpacity onPress={() => {
                //this.props.userPrimaryFilterUpdate({prop:'primaryFilterSelected', value: 'Coupons'});
                //this.props.pfilter='Coupons';

                pri_filter = 'Coupons';
                //console.log("changed pfilter to: " + this.props.userPrimaryFilterState.primaryFilterSelected);
                this.filter(pri_filter, sec_filter);
                }}>
                <Icon name='ios-pricetag' size= {25} color={pri_filter === 'Coupons' ? 'white' : '#0084b4'} style={{ alignSelf: 'center' }} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ height: 40, width: 0.5, backgroundColor: '#0084b4', marginRight: 5, alignSelf: 'center'}}></View>
        </View>

        <View style={{ flex: 8 }}>
            <ScrollView horizontal showVerticalScrollIndicator={false} contentContainerstyle={styles.carouselStyle}>
              <View style={filterContainer}>
                <View style={this.renderSecondarySelectedStyle('All')}>
                  <TouchableOpacity onPress={() => {
                    //this.props.userSecondaryFilterUpdate({prop:'secondaryFilterSelected', value: 'All'});
                    sec_filter = 'All';
                    this.filter(pri_filter, sec_filter);
                }}>
                    <Icon name='ios-apps' size= {25} color={sec_filter === 'All' ? 'white' : '#0084b4'} style={{ alignSelf: 'center' }} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={filterContainer}>
                <View style={this.renderSecondarySelectedStyle('Favorites')}>
                  <TouchableOpacity onPress={() => {
                    //this.props.userSecondaryFilterUpdate({prop:'secondaryFilterSelected', value: 'Favorites'});
                    sec_filter = 'Favorites';
                    this.filter(pri_filter, sec_filter);
                  }}>
                    <Icon name='md-star' size= {25} color={sec_filter === 'Favorites' ? 'white' : '#0084b4'} style={{ alignSelf: 'center' }} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={filterContainer}>
                <View style={this.renderSecondarySelectedStyle('Location')}>
                  <TouchableOpacity onPress={() => {
                    //this.props.userSecondaryFilterUpdate({prop:'secondaryFilterSelected', value: 'Location'});
                    sec_filter = 'Location';
                    this.filter(pri_filter, sec_filter);
                  }}>
                    <Icon name='md-pin' size= {25} color={sec_filter === 'Location' ? 'white' : '#0084b4'} style={{ alignSelf: 'center' }} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={filterContainer}>
                <View style={this.renderSecondarySelectedStyle('Cafe')}>
                  <TouchableOpacity onPress={() => {
                    //this.props.userSecondaryFilterUpdate({prop:'secondaryFilterSelected', value: 'Cafe'});
                    sec_filter = 'Cafe';
                    this.filter(pri_filter, sec_filter);
                  }}>
                    <Icon name='md-cafe' size= {25} color={sec_filter === 'Cafe' ? 'white' : '#0084b4'} style={{ alignSelf: 'center' }} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={filterContainer}>
                <View style={this.renderSecondarySelectedStyle('Bar')}>
                  <TouchableOpacity onPress={() => {
                    //this.props.userSecondaryFilterUpdate({prop:'secondaryFilterSelected', value: 'Bar'});
                    sec_filter = 'Bar';
                    this.filter(pri_filter, sec_filter);
                  }}>
                    <Icon name='md-beer' size= {25} color={sec_filter === 'Bar' ? 'white' : '#0084b4'} style={{ alignSelf: 'center' }} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={filterContainer}>
                <View style={this.renderSecondarySelectedStyle('Restaurant')}>
                  <TouchableOpacity onPress={() => {
                    //this.props.userSecondaryFilterUpdate({prop:'secondaryFilterSelected', value: 'Restaurant'});
                    sec_filter = 'Restaurant';
                    this.filter(pri_filter, sec_filter);
                  }}>
                    <Icon name='md-restaurant' size= {25} color={sec_filter === 'Restaurant' ? 'white' : '#0084b4'} style={{ alignSelf: 'center' }} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={filterContainer}>
                <View style={this.renderSecondarySelectedStyle('Entertainment')}>
                  <TouchableOpacity onPress={() => {
                    sec_filter = 'Entertainment';
                    //this.filter(pri_filter, sec_filter);
                   }}>
                    <Icon name='md-desktop' size= {25} color={sec_filter === 'Entertainment' ? 'white' : '#0084b4'} style={{ alignSelf: 'center' }} />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
        </View>
        </View>
    )
  }

  renderContent() {
    return (
      <FlatList
        data={this.props.promos}
        renderItem={({item}) => <UserPromoItem item={item} />}
      />
    );
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent:'space-around' }}>
        {this.renderFilterCarousel()}
        {this.renderContent()}
      </View>
    );
  }
}

const styles = {
  viewStyle: {
      flexDirection: 'row',
      backgroundColor: '#f0eeee',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: 30
  },
  lineSeparatorStyle: {
      backgroundColor: 'white',
      height: 2,
      shadowColor: 'white',
  },
  carouselStyle: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      height: 50,
      backgroundColor: '#f0eeee',
      alignItems: 'center',
      shadowColor: 'white',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      elevation: 2,
      position: 'relative',
  },
  textStyle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white'
  },
  filterButtonStyle: {
      height: 40,
      width: 40,
      backgroundColor: 'white',
      borderRadius: 50,
  },
  filterContainer: {
    justifyContent: 'center',
    backgroundColor: '#f0eeee',
    flexDirection: 'column',
    flex: 1
  },
  filterStyle: {
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: '#fff',
    flexDirection: 'column',
    borderColor: '#0084b4',
    borderWidth: 0.5,
    marginRight: 5,
    height: 40,
    width: 40
  }
};

const mapStateToProps = state => {
  var { uid, userPrimaryFilterState, userSecondaryFilterState, pfilter, sfilter, following } = state.userMain;
  const promos = _.map(state.userMain.promos, (val, key) => {
    return {...val, key};
  });
  return { uid, promos, userPrimaryFilterState, userSecondaryFilterState, pfilter, sfilter, following };
}

export default connect(mapStateToProps, { userGetPromos, userPrimaryFilterUpdate, userSecondaryFilterUpdate, getFollowing })(UserPromoList);
