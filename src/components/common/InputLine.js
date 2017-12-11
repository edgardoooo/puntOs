import React from 'react';
import { TextInput, View, Text } from 'react-native';

const InputLine = ({ label, value, onChangeText, placeholder, secureTextEntry, overStyle, placeholderTextColor, selectionColor }) => {
  const { inputStyle, labelStyle, containerStyle } = styles;

  return (
    <View style={containerStyle}>
      <TextInput
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        autoCorrect={false}
        style={[inputStyle, overStyle]}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize='none'
        placeholderTextColor={placeholderTextColor}//'#c6e4f2'
        selectionColor= {selectionColor}
        underlineColorAndroid="transparent"
      />
    </View>
  );
};

const styles = {
  inputStyle: {
    color: '#000',
    borderBottomWidth: 1.5,
    borderBottomColor: 'white',
    paddingRight: 5,
    paddingLeft: 5,
    paddingBottom: 5,
    marginLeft: 40,
    marginRight: 40,
    fontSize: 18,
    lineHeight: 23,
    flex: 2
  },
  containerStyle: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10
  }
};

export { InputLine };
