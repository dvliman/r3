import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Button = (props) => {
  const { onPress, title, iconName, customStyles, iconColor, customTextStyles } = props;
  return (
    <Pressable
      style={({ pressed }) => [{
        backgroundColor: pressed ? '#333333' : 'black',
      },
      styles.button,
        customStyles
      ]}
      onPress={onPress}
    >
      {iconName && <Ionicons name={iconName} size={18} color={iconColor} style={{ marginRight: title ? 8 : 0 }} />}
      <Text style={[styles.text, customTextStyles]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3,
    flexDirection: 'row'
  },
  text: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});

Button.defaultProps = {
  iconColor: 'white',
}

export default Button;