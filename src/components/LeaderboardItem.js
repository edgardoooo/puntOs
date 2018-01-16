import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { Card, CardSection } from './common';

class LeaderboardItem extends Component {
  renderIcon(){
          if (this.props.lbentries.icon) {
              return (
                <Image style={styles.authorIconStyle} source={{uri: this.props.lbentries.icon }} />
              );
          }
          else {
          return ( <Image style={styles.authorIconStyle} source={require('../assets/no-user-image.gif')} />);
          }
          //if not, return default icon
  }
    renderItem() {
        const { textStyle, viewStyle } = styles

        return (
            <View>
                <Card>
                    <View style={{ flex: 1, flexDirection: 'row', height: 50, backgroundColor: '#fff', paddingTop: 5, paddingBottom: 5 }}>
                        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                            <Text style={{
                                  fontWeight: 'bold',
                                  fontSize: 20}}>{this.props.lbentries.key+1}</Text>
                        </View>

                        {this.renderIcon()}

                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 15, flex: 5 }}>
                            <Text style={{
                              fontSize: 18,
                              flexWrap: 'wrap',
                              flex: 1 }}>{this.props.lbentries.username}</Text>
                        </View>

                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 5, flex: 2 }}>
                            <Text style={{
                              fontSize: 18,
                              flexWrap: 'wrap',
                              flex: 1,
                              textAlign: 'center',
                              fontWeight: 'bold' }}>{this.props.lbentries.points}</Text>
                        </View>

                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 5, flex: 1 }}>
                            <Text style={{
                              fontSize: 20,
                              flexWrap: 'wrap',
                              flex: 1,
                              textAlign: 'center' }}>{this.props.lbentries.level}</Text>
                        </View>

                    </View>
                </Card>
            </View>
        );
    }

    render() {
        //const {key, rank, image, name, points, level} = this.props.lbentries;
        return (
            <View>
                {this.renderItem()}
            </View>
        );
    }

}

const styles = {
    textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    viewStyle: {
        marginLeft:15,
        padding: 10
    },
    authorIconStyle: {
            height: 40,
            width: 40,
            borderWidth: 1,
            borderRadius: 20,
            borderColor: '#ababab',
            resizeMode: 'contain'
    }
}

  export default LeaderboardItem;
