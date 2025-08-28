import { View, Text,StyleSheet, TextInput } from 'react-native'
import React from 'react'
import {textInputContainer,textInputLabel} from '../../utils/styles/gobalstyle'

const Input = ({label,subText,keyboardType}) => {
  return (
    <View style={{ marginLeft:30 }}>
     <Text style={textInputLabel}>{label}</Text>
     <View 
     style={textInputContainer}>
    
    <Text style={styles.inputPreText}>{subText}</Text>

     <TextInput
       style={{fontSize:18}}
       keyboardType={keyboardType}
     />
     </View>
    </View>
  )
}

const styles=StyleSheet.create({
     
})

export default Input