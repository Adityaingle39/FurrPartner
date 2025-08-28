import React, { useState, useRef, useEffect } from 'react';
import { View, SafeAreaView, KeyboardAvoidingView, Text, Image, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, BackHandler, Alert,Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Iicon from 'react-native-vector-icons/AntDesign';
import { useIsFocused, useRoute, useTheme } from '@react-navigation/native';
import { Button, TextInput } from 'react-native-paper';
import { container, btn, bgColors, justifyContentCenter, alignItemsCenter, spacingProperty, heading, subHeading, textInputLabel, inputText, textInputContainer, flexDirectionRow } from '../../utils/styles/gobalstyle';
import Apis from '../../utils/apis';
import Toaster from '../../components/common/Toaster';
import Loader from '../../components/common/Loader';
import ImagePicker from 'react-native-image-crop-picker';
import CameraGallery from '../../components/common/CameraGallery';
import { useAuthState } from '../../services/auth';
import { requestLocationAccess, saveUserSession, randomString,requestCameraPermission, requestAndroidGalleryPermission } from "../../utils/helpers";
import { colors } from '../../utils/styles/gobalstyle';
import RNExitApp from 'react-native-exit-app';
import { getData, setData } from '../../utils/db';
const BasicInfo = ({ navigation }) => {
  const api = new Apis();
  const theme = useTheme()
  const colorScheme = useColorScheme();
  const actionSheetRef = useRef(null);
  const { userData, setUserData } = useAuthState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isEmailValid = (email) => {
    return emailRegex.test(email);
  };
  const navigateButton = () => {
    try {
      if (name === '' || email === '' || city === '') {
        Toaster({ message: "Please enter all required fields." });
      } else if (!isEmailValid(email)) {
        Toaster({ message: "Please enter a valid email address." });
      } else {
        setIsLoading(true);
        api.register({
          id: userData.id,
          email: email,
          countryCode: '+91',
          mobile: userData.mobile,
          collaboratorName: name,
          city: city,
        }).then(res => {
          if (res && 'error' in res) {
            Toaster({ message: 'An account is already created with this email address, please try diffrent email address.' });
          } else {
            setIsLoading(false);
            const mergedUserData = { ...userData, ...res };
            saveUserSession(mergedUserData);
            setUserData(mergedUserData);
            if (selectedImage !== null) {
              uploadUserImage(res);
            } else {
              setIsLoading(false);
            }
            navigation.navigate('CreateWorkspace');
          }
        }).catch(err => {
          throw err;
        });
      }
    } catch (error) {
      console.log("An error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const uploadUserImage = (user) => {
    if (selectedImage && selectedImage !== null) {
      const form_data = new FormData();
      form_data.append('file', selectedImage);
      api.uploadProfileImages(userData.id, form_data)
        .then(res => {
          console.log("img", res)
          if (res.isUploaded) {
            const mergedUserData = { ...userData, ...res };
            setUserData({ ...mergedUserData, imageUrl: res.image });
            saveUserSession({ ...mergedUserData, imageUrl: res.image });
            Toaster({ message: "Bingo! Your account created successfully." });
            navigation.navigate('CreateWorkspace');
          }
          setIsLoading(false);
          // Toaster({message: 'Profile image uploaded.'});
        }).catch(error => {
          console.log(error);
          setIsLoading(false);
        })
    } else {
      setIsLoading(false);
    }
  }
  const openImagePicker = () => {
    actionSheetRef.current?.show();
  };
  useEffect(() => {
    const checkToasterDisplay = async () => {
      const hasDisplayedToaster = await getData('hasDisplayedToaster');
      if (!hasDisplayedToaster) {
        Toaster({ message: 'OTP Verified!' });
        await setData('hasDisplayedToaster', true); // Set the flag in AsyncStorage
      }
    };
    requestLocationAccess();
    checkToasterDisplay();
  }, []);
  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      launchCamera();
    } else {
      Alert.alert(
        'Camera Permission Denied',
        'To use the camera, please enable camera permissions in settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: () => Linking.openSettings(),
          },
        ]
      );
    }
  };
  const launchCamera = () => {
    ImagePicker.openCamera({
      width: 500,
      height: 500,
      cropping: true,
      writeTempFile: true,
    })
      .then((image) => {
        actionSheetRef.current?.hide();
        setSelectedImage({
          uri: image.path,
          type: image.mime,
          name: `${randomString(16)}.jpg`,
        });
      })
      .catch((error) => {
        console.log('ImagePicker Error: ', error);
      });
  };
  const openGallery = async () => {
    const hasPermission = await requestAndroidGalleryPermission();
    if (hasPermission) {
      launchGallery();
    } else {
      Alert.alert(
        'Galary Permission Denied',
        'To use the Gallery, please enable Gallery permissions in settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: () => Linking.openSettings(),
          },
        ]
      );
    }
  };
  const launchGallery = () => {
    ImagePicker.openPicker({
      cropping: true,
    }).then(image => {
      setSelectedImage({ uri: image.path, type: image.mime, name: `${randomString(16)}.jpg` });
      actionSheetRef?.current?.hide();
    }).catch(error => {
      console.log('ImagePicker Error: ', error);
      actionSheetRef?.current?.hide();
    });
  };

  const isFocused = useIsFocused();
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
  return (
    <SafeAreaView style={container}>
      <ScrollView >
        {/* <View style={[bgColors, justifyContentCenter, alignItemsCenter, { paddingBottom: 30, paddingTop: 30 }]}>
          <View style={[spacingProperty['pt-20']]}>
            <Image style={{ height: 60, width: 300 }} source={require('../../assets/furrLogo.png')}></Image>
          </View>
        </View> */}
        <View style={spacingProperty['m-20']}>
          <View style={[alignItemsCenter, spacingProperty['pb-20']]}>
            <Text style={[heading, { color: theme.colors.onSurface }]}>Enter Basic Info</Text>
            <Text style={[subHeading, { color: theme.colors.outline }]}>Enter your information to continue</Text>
          </View>
          <View>
            <View>
              <View>
                <View style={{ alignItems: 'center', paddingVertical: '10%' }}>
                  <TouchableOpacity onPress={openImagePicker}>
                    {selectedImage ? (<Image source={{ uri: selectedImage.uri }} style={styles.userProfileImage} />) : (<View><Image style={styles.userProfileImage} source={require('../../assets/AddUserProfileImageSquare.jpeg')} /></View>)}
                    <View style={{ position: 'absolute', bottom: 8, left: '25%' }}><Iicon name='pluscircle' style={{ borderColor: 'white' }} size={25} color={colors.primary} /></View>
                  </TouchableOpacity>
                </View>
                {/* <Text style={[textInputLabel, spacingProperty['pb-10'], { color: theme.colors.onSurface }]}>
                  Name*
                </Text> */}
              </View>
              <TextInput
                mode='outlined'
                left={<TextInput.Icon icon="account-outline" />}
                lebel="Name*"
                placeholder='Enter your name*'
                style={[inputText, { color: theme.colors.onSurface, marginBottom: 15 }]}
                value={name}
                onChangeText={setName}
              />
              <TextInput
                mode='outlined'
                left={<TextInput.Icon icon="email-outline" />}
                lebel="Email*"
                placeholder='Enter your email address*'
                style={[inputText, { color: theme.colors.onSurface, marginBottom: 15 }]}
                value={email}
                onChangeText={(text) => { setEmail(text); }}
              />
              <TextInput
                mode='outlined'
                left={<TextInput.Icon icon="home-city-outline" />}
                lebel="City*"
                placeholder='Enter your city*'
                style={[inputText, { color: theme.colors.onSurface }]}
                value={city}
                onChangeText={(text) => {
                  const alphabeticText = text.replace(/[^a-zA-Z\s]/g, '');
                  setCity(alphabeticText);
                }}
              />
            </View>
          </View>
          <Text style={{ color: theme.colors.onSurface }}>*All marked fields are required</Text>
        </View>
      </ScrollView>
      <View style={[alignItemsCenter, { marginVertical: 20, paddingHorizontal: 30 }]}>
        <Button disabled={isLoading} style={[btn, { flexGrow: 1, width: '100%' }]} buttonColor={colors.primary} textColor={colors.white} mode='contained' onPress={navigateButton}>NEXT</Button>
      </View>
      <CameraGallery actionSheetRef={actionSheetRef} id="settings-edit-profile" options={{ gallery: true, camera: true, galleryCallback: openGallery, cameraCallback: openCamera }}></CameraGallery>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  userProfileImage: {
    width: 130,
    height: 130,
    borderRadius: 10,
    borderWidth: 1
  },
  inputPreText: {
    fontSize: 25,
    marginRight: 10,
  },
});
export default BasicInfo;