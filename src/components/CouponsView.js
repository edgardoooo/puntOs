import React, { Component } from 'react';
import { View, Text, Image, LayoutAnimation } from 'react-native';
import { InputLine } from './common';
import { Actions } from 'react-native-router-flux';

class CouponsView extends Component {
  componentWillUpdate() {
  LayoutAnimation.spring();
  }
  render() {
    return (
      <View>
        <Text>Main View User</Text>
      </View>
    );
  }
}

export default CouponsView;
