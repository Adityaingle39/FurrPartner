import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  Linking,
  StyleSheet,
  Dimensions,
  Keyboard,
  Platform,
  ImageBackground,
  BackHandler,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {StackActions, useNavigation,useIsFocused} from '@react-navigation/native';
import {Button, TextInput, Checkbox, useTheme} from 'react-native-paper';
import Apis from '../../utils/apis';
import Loader from '../../components/common/Loader';
import Toaster from '../../components/common/Toaster';
import {isAlreadyLogged} from '../../utils/helpers';
import Stepper from '../../components/common/Stepper';
import {
  btn,
  heading,
  subHeading,
  alignItemsCenter,
  container,
  colors,
  flexDirectionRow,
  textInputContainer,
  inputText,
  spacingProperty,
} from '../../utils/styles/gobalstyle';
import {useAuthState} from '../../services/auth';
import RNExitApp from 'react-native-exit-app';

const SignIn = ({route}) => {
  const api = new Apis();
  const navigation = useNavigation();
  const {userData, setPhone, setOtpId, setUserData} = useAuthState();
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phone, onChangePhone] = useState('');
  const [isArgee, setIsAgree] = useState(true);

  const navigateButton = () => {
    if (phone === '') {
      Toaster({message: 'Please enter phone number'});
    } else if (phone.length < 10) {
      Toaster({message: 'Please enter a valid phone number'});
    } else if (isArgee === false) {
      Toaster({message: 'Please check for terms & conditions'});
    } else {
      api.setAuth(null);
      setIsLoading(true);
      setPhone(phone);
      api
        .getOtp({countryCode: '+91', mobile: phone})
        .then(res => {
          setIsLoading(false);
          const otpId = res.id;
          setOtpId(otpId);
          navigation.navigate('OTPVerify',{otpId});
        })
        .catch(err => {
          console.log(err);
          setIsLoading(false);
        });
    }
  };

  const theme = useTheme();
  const {width, height} = Dimensions.get('window');

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  const isFocused = useIsFocused();
  useEffect(() => {
  }, [isFocused]);
  useEffect(() => {
    const backAction = () => {
      if (isFocused) {
        Alert.alert(
          "Hold On!",
          "Are you sure you want to exit?",
          [
            {
              text: "CANCEL", onPress: () => "Null",
            },
            { text: "Yes", onPress: () => RNExitApp.exitApp() }
          ]
        );
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction);
    return () => backHandler.remove();
  }, [isFocused]);

  // useEffect(() => {
  //   const backAction = () => true; 
  //   const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
  //   return () => backHandler.remove();
  // }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'position' : 'position'}
      style={container}>
      {isLoading && <Loader visible={isLoading} />}
      <View style={{flexDirection: 'column'}}>
        <View
          style={{
            backgroundColor: colors.secondary,
            flexDirection: 'column',
            height: height / 1.7,
          }}>
          {keyboardStatus === true && (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={require('../../assets/furrcrew-main.png')}
                resizeMode="contain"
                style={{
                  width: '65%',
                  height: 70,
                  position: 'absolute',
                  top: Platform.OS === 'ios' ? height / 2.25 : height / 2.57,
                }}
              />
            </View>
          )}
          {keyboardStatus === false && (
            <ImageBackground
              source={require('../../assets/get-started.png')}
              resizeMode="cover"
              style={{width: width, height: height / 1.7}}>
              <Image
                source={require('../../assets/furrcrew-white.png')}
                resizeMode="contain"
                style={{width: '65%', height: 70, marginTop: 50, alignSelf: 'center'}}
              />
            </ImageBackground>
          )}
        </View>
        <View style={{padding: 20}}>
          <View style={spacingProperty['m-20']}>
            <View style={[alignItemsCenter, {marginBottom: 20}]}>
              <Text style={[heading, {color: theme.colors.onSurface}]}>Hey There!</Text>
              <Text style={[subHeading, {color: theme.colors.onSurface}]}>
                Enter mobile number to proceed
              </Text>
            </View>
            <TextInput
              mode="outlined"
              style={[inputText, {color: theme.colors.onSurface}]}
              label="Phone Number"
              placeholder="Enter your phone number"
              onChangeText={onChangePhone}
              maxLength={10}
              left={<TextInput.Affix text="+91" />}
              right={<TextInput.Icon icon="phone" />}
              keyboardType="numeric"
              enterKeyHint="done"
            />
          </View>
          <View style={[alignItemsCenter, {paddingHorizontal: 20}]}>
            <Button
              style={[btn, {width: '100%'}]}
              labelStyle={{fontSize: 20}}
              mode="contained"
              buttonColor={colors.primary}
              textColor={colors.white}
              onPress={navigateButton}>
              Get OTP
            </Button>
            <View style={[flexDirectionRow, alignItemsCenter, spacingProperty['mt-5']]}>
              <View
                >
                <Checkbox.Android
                  status={isArgee ? 'checked' : 'unchecked'}
                  onPress={() => setIsAgree(!isArgee)}
                  color={theme.colors.primary}
                  uncheckColor={'red'}
                />
              </View>
              <Text style={[styles.checkboxText, {color: theme.colors.outline}]} onPress={() => setIsAgree(!isArgee)}>
                I agree to all{' '}
              </Text>
              <Text style={{color: '#5A6BED'}} onPress={() => Linking.openURL('https://furrcrew.com/terms-conditions')}>
                Terms & Conditions.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputPreText: {
    fontSize: 16,
    color: '#263238',
  },
});

export default SignIn;
