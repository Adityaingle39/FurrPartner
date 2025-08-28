import { View, Text, SafeAreaView, ScrollView, Image, StyleSheet ,TextInput} from 'react-native'
import React from 'react'
import Button from '../components/common/Button';
import {
    navigatorLink,
    navigatorText,
    heading,
    subHeading,
    alignItemsCenter,
    container,
    bgColors,
    justifyContentCenter,
    flexDirectionRow,
    textInputContainer,
    textInputLabel,
    inputText,
    spacingProperty
  } from '../utils/styles/gobalstyle';

const SignUp = ({navigation}) => {

    const navigateButton=()=>{
        navigation.navigate('OTPVerify')
    }

  return (
   <SafeAreaView style={container}>
        <ScrollView>
            <View style={[bgColors, justifyContentCenter, alignItemsCenter]}>
                <View style={[spacingProperty['pt-55'],spacingProperty['pb-55']]}>
                <Image source={require('../assets/furrLogo.png')}></Image>
                </View>
             
              <Image source={require('../assets/signUpImage.png')} style={{width:"95%"}}></Image>
            </View>
            <View style={spacingProperty['m-20']}>
            <View style={[alignItemsCenter,spacingProperty['pb-20']]}>
                <Text style={heading}>Get Started !</Text>
                <Text style={subHeading}>Enter mobile number to sign up</Text>
            </View>

            <View>
            <Text style={[textInputLabel,spacingProperty['pb-10']]}>Enter Mobile Number</Text>
          </View>

          <View style={[textInputContainer,flexDirectionRow]}>
            <Text style={styles.inputPreText}>+91 |</Text>
            <TextInput style={inputText} keyboardType="numeric" />
          </View>
           
            <View style={alignItemsCenter}>
                <Button title="GET OTP" onPress={navigateButton}/>
                <View style={[flexDirectionRow, alignItemsCenter,spacingProperty['mt-20']]}>
                {/* <Text style={navigatorText}>Already have an account? </Text> */}
                {/* <Text style={navigatorLink}>Sign in </Text> */}
                </View>
            </View>
            </View>
        </ScrollView>
   </SafeAreaView>
  )
}
const styles=StyleSheet.create({
    inputPreText: {
        fontSize: 18,
        color: '#263238',
      },
})
export default SignUp