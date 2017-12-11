import React from 'react';
import { View } from 'react-native';

const Tile = (props) => {
  return (
    <View style={styles.containerStyle}>
      {props.children}
    </View>
  );
};

const styles = {
  containerStyle: {
    backgroundColor: '#0084b4',
    alignSelf: 'stretch',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#0084b4',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
    position: 'relative',
    flexDirection: 'row'
  }
};

export { Tile };
