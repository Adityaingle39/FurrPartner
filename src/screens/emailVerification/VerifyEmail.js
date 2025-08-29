import { View, Text, ScrollView, Image, StyleSheet ,TextInput} from 'react-native'
import React from 'react'
import {SafeAreaView} from 'react-native-safe-area-context';
import Button from '../../components/common/Button'
import { spacingProperty } from '../../utils/styles/gobalstyle'

const VerifyEmail = ({navigation}) => {

  const navigateButton=()=>{
    navigation.navigate('Dashboard')
  }

  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#FFFFFF'}}>
        <ScrollView>
            <View style={styles.emailImage}>
                <Image source={require('../../assets/verifyEmail.png')}/>
            </View>
            <View style={{marginLeft:35}}>
                <Text style={styles.headingText}>Verify your Email</Text>
                <Text style={styles.subText}>Hey! Kindly verify your email and start enjoying FurrCrew.</Text>
            </View>
            <View style={styles.textinputView}>
            <TextInput 
         style={styles.textInput}
         keyboardType="numeric"
         maxLength={1}
         >
         </TextInput>
         <TextInput 
         style={styles.textInput}
         keyboardType="numeric"
         maxLength={1}>
         </TextInput>

         <TextInput 
         style={styles.textInput}
         keyboardType="numeric"
         maxLength={1}>
         </TextInput>
         <TextInput 
         style={styles.textInput}
         keyboardType="numeric"
         maxLength={1}>
         </TextInput>
         
            </View>
            <View style={{flexDirection:'row', justifyContent:'center' ,alignItems:'center', marginBottom:30}}>
                <Text style={styles.notRecievedText}>Not recieved OTP?</Text>
                <Text style={styles.resendText}> Resend  </Text>
                </View>
            <View style={spacingProperty['m-20']}>
                <Button title='Verify Email' onPress={navigateButton}></Button>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

const styles=StyleSheet.create({
  emailImage:{
    justifyContent:'center',
    alignItems:'center',
    marginTop:150,
    marginBottom:40
  },
  headingText:{
     fontSize:23,
     fontWeight:800,
     color:'#000000'
  },
  subText:{
     fontSize:15,
     color:'#898A8D',
     marginTop:5,
     marginBottom:25
  },
  textInput:{
    height:50,
    width:50,
    fontSize:20,
    borderRadius:10,
    borderWidth:1,
    textAlign:'center'
  },
  textinputView:{
      flexDirection:'row',
      justifyContent:'space-around',
      marginHorizontal:60,
      marginBottom:20
  },
  notRecievedText:{
    fontSize:17,
    color:'#979797'
},
resendText:{
    fontSize:17,
    color:'#01C4FF'
}
})

export default VerifyEmail