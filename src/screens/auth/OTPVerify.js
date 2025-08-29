import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  Pressable,
  Image,
  TextInput,
  Dimensions,
  Keyboard,
  ImageBackground,
  BackHandler
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {Button} from 'react-native-paper';
import {useRoute, useTheme} from '@react-navigation/native';

import Apis from '../../utils/apis.js';
import Toaster from '../../components/common/Toaster';
import Loader from '../../components/common/Loader';

import {useAuthState} from '../../services/auth';
import {useWorspaceState} from '../../services/workspace';
import {saveUserSession} from "../../utils/helpers";
import { useDeviceState } from '../../services/device.js';
import {
  btn, colors,
  container,
  bgColors,
  justifyContentCenter,
  alignItemsCenter,
  spacingProperty,
  heading,
  flexDirectionRow,
  navigatorText,
  navigatorLink,
} from '../../utils/styles/gobalstyle';
import { useAppointmentState } from '../../services/appointments.js';

const OTPVerify = ({navigation}) => {
  const api = new Apis();
  const { width, height } = Dimensions.get('window');
  const [keyboardStatus, setKeyboardStatus] = useState(false);

  const {userData, setUserData} = useAuthState();
  const {setWorkspaces} = useWorspaceState();
  const {setAppointments} = useAppointmentState();
  const { deviceData } = useDeviceState();

  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();
  const [otp, setOtp] = useState('');

  const [resendTime, setResendTime] = useState(60);

  const getAllAppointments = (userId, workspacId) => {
		api.getWorkspaceAppointments(userData.id, workspacId, { status: 'all' })
		.then(res => {
			const responseData = res && res.length > 0 ? res : [];
			setAppointments(responseData);

      setIsLoading(false);
      Toaster({message: `Welcome ${userData.collaboratorName}`});
      navigation.replace('Dashboard');
      navigation.replace("Dashboard", {screen: 'HomeTab'});
		}).catch(err => {
			console.log("getAllAppointments Error: ", err);
		});
	}

  const getMyWorkspaces = async(id, token) => {
    let workData = await api.getAllWorkspaces(id);
    // console.log("workData", workData);
    if (workData.length > 0) {
      const defaultWorkspace = workData.find(i => i.default == true);
      setWorkspaces(workData);
      if (defaultWorkspace) {
        getAllAppointments(id, defaultWorkspace.id);
      } else {
        setIsLoading(false);
        Toaster({message: `Welcome ${userData.collaboratorName}`});
        navigation.replace('Dashboard');
        navigation.replace("Dashboard", {screen: 'HomeTab'});
      }
    } else {
      setIsLoading(false);
      Toaster({message: `Almost Ready! Setup your workspace`});
      navigation.navigate('CreateWorkspace');
    }
  };

  const resendOtp = () => {
    setIsLoading(true);
    api.getOtp({countryCode: "+91", mobile: userData.mobile}, true)
    .then(res => {
      setIsLoading(false);
      Toaster({message: `OTP sent!`});
      setResendTime(60);
    }).catch(err => {
      console.log(err);
      setIsLoading(false);
    });
  }

  const registerDevice = (isRegisterd, userId) => {
    console.log("deviceData", deviceData);
    api.deviceToken(deviceData.deviceId, deviceData.registerToken, userId)
    .then(res => {
      console.log("Device Registered!", res);
      // handleRedirection(isRegisterd, userId);
    }).catch(e => {
      console.log(e);
      // handleRedirection(isRegisterd, userId);
    });
  }

  const navigationButton = () => {
    if (otp == '') {
      Toaster({message: 'Please enter otp'});
    } else if (otp < 6) {
      Toaster({message: 'Please enter valid otp'});
    } else {
      setIsLoading(true);
      api.verifyOtp(`${userData.otpId}`, `${otp}`)
      .then(res => {
        console.log("verify opt", res);
        if (res && "error" in res) {
          Toaster({message: 'Please enter a valid OTP!'});
        } else {
          saveUserSession(res);
          setUserData(res);
          api.setAuth(res?.token);
          registerDevice(true, res.id);
          if ('email' in res) {
            getMyWorkspaces(res.id, res?.token)
          } else {
            // setIsLoading(false);
            Toaster({message: 'OTP Verified!'});
            navigation.navigate('BasicInfo');
          }
        }
        setIsLoading(false);
      }).catch(err => {
        setIsLoading(false);
        console.log("OTPVerify", err.message);
      });
    }
  };

  const renderTimer = () => (
    <Text style={[navigatorText, {marginLeft: 10,marginTop:20,color:theme.colors.onSurface}]}>Resend another OTP in {resendTime}</Text>
  );
  const renderResendView = () => (
   
    <View style={{flexDirection: 'row'}}>
      <Text style={[navigatorText,{color:theme.colors.onSurface}]}>Not recieved OTP?</Text>
      <Pressable onPress={() => resendOtp()}>
        <Text style={[navigatorLink,{color:theme.colors.primary}]}> Resend </Text>
      </Pressable>
    </View>
  );
  const setRemaingTime = () => {
    setResendTime(preTime => {
      if (preTime !== null) {
        return typeof preTime !== 'number' && preTime.includes(":") ? (preTime !== '00:00' ? moment(preTime, 'mm:ss').subtract(1, 'seconds').format('mm:ss') : null) : moment(`00:${preTime-1}`, 'mm:ss').format('mm:ss');
      } else {
        return null;
      }
    });
  }

  useEffect(() => {
  
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
    });
    const timer = setInterval(setRemaingTime, 1000)
    return () => {
      clearInterval(timer);
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [navigation])

  const theme=useTheme();
  return (
    // <SafeAreaView style={container}>
     
    //   <View style={{flex: 1}}>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : 'position'} style={container}>
        {isLoading == true ? <Loader visible={isLoading}></Loader> : null}
        <View style={{ flexDirection: 'column' }}>
        <View style={{ backgroundColor: colors.secondary, flexDirection: 'column', height: height / 1.7 }}>
        {keyboardStatus == true && <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={require('../../assets/furrcrew-main.png')}
              resizeMode="contain"
              style={{width: '65%', height: 70, position: 'absolute', top: height / 2.25}}
            />
          </View>}
          {keyboardStatus == false && <ImageBackground
            source={require('../../assets/get-started.png')}
            resizeMode="cover"
            style={{width: width, height: height / 1.7}}
          >
            <Image
              source={require('../../assets/furrcrew-white.png')}
              resizeMode="contain"
              style={{width: '65%', height: 70, marginTop: 50, alignSelf: 'center'}}
            />
          </ImageBackground>}
        </View>
          <View style={spacingProperty['m-20']}>
            <View style={[alignItemsCenter, ]}>
              <Text style={[heading, {paddingHorizontal: 30, fontWeight: 600,color:theme.colors.onSurface}]}>
                Enter the 6-digit OTP sent to your mobile number
              </Text>
            </View>
            <View style={styles.container}>
              {/* <OtpInputs
                inputContainerStyles={styles.otpView}
                handleChange={(code) => { inputOtp(code); }}
                numberOfInputs={6}
              /> */}
            </View>
            <View style={styles.textinputView}>
              <TextInput
                onChangeText={setOtp}
                style={[styles.textInput,{borderColor:theme.colors.
                  outline,borderWidth:1,color:theme.colors.onSurface}]}
                enterKeyHint='done'
                maxLength={6}
                keyboardType="numeric"></TextInput>
            </View>
            <View
              style={[
                flexDirectionRow,
                alignItemsCenter,
                justifyContentCenter,
                
              ]}>
              {resendTime && typeof resendTime !== 'number' ? renderTimer() : renderResendView()}
            </View>
          </View>
          <View style={{paddingHorizontal: 30}}>
            <Button style={[btn, {width: '100%'}]} labelStyle={{fontSize: 20}} mode="contained" buttonColor={colors.primary} textColor={colors.white} onPress={navigationButton}>Next</Button>
            <Button title="Next" onPress={navigationButton} />
          </View>
          </View>
        </KeyboardAvoidingView>
    //   </View>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  otpView: {
    margin: 'auto',
    textAlign: 'center',
    alignContent: 'center',    
    paddingHorizontal: 10,
    backgroundColor: '#E7F9FF',
    borderRadius: 10,
  },
  textInput: {
    height: 50,
    width: 150,
    fontSize: 18,
    borderRadius: 10,
    marginTop:10,
    // backgroundColor: '#E7F9FF',
    textAlign: 'center',
  },
  textinputView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default OTPVerify;
