import { Text ,Pressable, View} from 'react-native'
import React from 'react'
import {btn, btnText, colors} from '../../utils/styles/gobalstyle'
import { useTheme } from 'react-native-paper'


const Button = ({title, disabled, onPress = () => {}}) => {
  const theme=useTheme();
  return (
    
    <Pressable
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.7}
      style={[btn, {backgroundColor: disabled ? colors.lightBlue : colors.primary}]}
      >
      <Text style={btnText}>
        {title}
      </Text>
    </Pressable>

  )
}


export default Button