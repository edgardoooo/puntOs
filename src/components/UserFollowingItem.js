import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { businessMainUpdate, businessExists } from '../actions';
import { Card } from './common';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

class UserFollowingItem extends Component {

    renderIcon(image) {
        if (image) {
            return (
              <Image
              style={styles.iconStyle}
              source={{uri: image }}
              />
            );
        }
        else {
          return(
            <Image
            style={styles.iconStyle}
            source={require('../assets/no-user-image.gif')}
            />
          );
        }
    }

    render() {

        const { name, icon, key } = this.props.following;

        return (
            <Card>

                <View style={styles.itemContainer}>

                    <View>
                        {this.renderIcon(icon)}
                    </View>
                    <TouchableOpacity style={{marginLeft: 15, justifyContent: 'center'}} onPress={ () => {
                      this.props.businessMainUpdate({ prop: 'uid', value: businessID});
                      this.props.businessExists(businessID);
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold'}}>
                            {name}
                        </Text>
                    </TouchableOpacity>
                </View>

            </Card>
        );
    }
}

const styles = {
    iconStyle: {
        height: 40,
        width: 40,
        borderRadius: 20,
        resizeMode: 'contain',
        borderColor: '#ababab'
    },
    itemContainer:{
        flex: 1,
        height: 50,
        alignSelf: 'stretch',
        flexDirection: 'row',
        paddingBottom: 5,
        paddingTop: 5,
        paddingLeft: 5,
        backgroundColor: '#fff'
      }
}

export default connect(null,{businessMainUpdate, businessExists})(UserFollowingItem);
