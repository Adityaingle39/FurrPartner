import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
  useColorScheme,
  Alert,
  Linking
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import { TextInput, Button, useTheme } from 'react-native-paper';

import Apis from '../../utils/apis';
import Header from '../../components/common/Header';
import Loader from '../../components/common/Loader';
import Toaster from '../../components/common/Toaster';
import IconCustom from '../../components/common/IconCustom';
import CameraGallery from '../../components/common/CameraGallery';

import { useAuthState } from '../../services/auth';
import { getIconTextName, saveUserSession, randomString,requestCameraPermission, requestAndroidGalleryPermission } from '../../utils/helpers';
import { btn, container, spacingProperty, flexDirectionRow, alignItemsCenter, colors, justifyContentCenter } from '../../utils/styles/gobalstyle';

const BasicInformation = ({ navigation }) => {
  const api = new Apis();
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const actionSheetRef = useRef(null);
  const {width, height} = Dimensions.get('window');
  const bgColor = colorScheme === 'dark' ? theme.colors.surface : theme.colors.surfaceVariant;

  const { userData, setUserData, setUserImage } = useAuthState();

  const [resourcePath, setResourcePath] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileInfo, setProfileInfo] = useState({ collaboratorName: '', email: '', city: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);

  // Function to validate email format
  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };
  const fetchInformation = () => {
    setProfileInfo(userData);
  };

  const fetchProfile = async () => {
    api.getProfile(userData.id)
      .then(res => {
        console.log('all getProfile', res);
      }).catch(err => {
        console.log('all getProfile', err.message);
      });
  };

  const handleImageUpload = () => {
    if (selectedImage !== null) {
      setIsLoading(true);

      const form_data = new FormData();
      form_data.append('file', selectedImage);
      api.uploadProfileImages(userData.id, form_data)
        .then(res => {
          console.log("uploadWorkspaceimage", res);
          Toaster({ message: `Profile picture Updated successfully.` });
          handleFormData(res.image);
        })
        .catch(err => {
          setIsLoading(false);
          throw err;
        });
    }
  }

  const handleFormData = async (image) => {
    if (
      profileInfo.collaboratorName !== userData.collaboratorName ||
      profileInfo.email !== userData.email ||
      profileInfo.city !== userData.city
    ) {
      await api.updateProfile(userData.id, {
        email: profileInfo.email,
        countryCode: '+91',
        mobile: userData.mobile,
        collaboratorName: profileInfo.collaboratorName,
        city: profileInfo.city,
        verified: profileInfo.verified,
        emailVerified: profileInfo.emailVerified,
      })
        .then(res => {
          const newData = Object.assign(userData, res);
          let sessionData = { ...newData };
          
          if (image) {
            sessionData = { ...newData, imageUrl: image };
            sessionData = { ...userData, ...sessionData };
          }
          saveUserSession(sessionData);
          setUserData(sessionData);
          setIsLoading(false);
          Toaster({ message: 'Profile Information updated successfully' });
          navigation.goBack();
        })
        .catch(err => {
          setIsLoading(false);
          throw err;
        });
    } else if (image) {
      const newData = Object.assign({}, userData);
      const sessionData = { ...newData, imageUrl: image };
      saveUserSession(sessionData);
      setUserData(sessionData);
    } else {
      Toaster({ message: `Ooops! You haven't modified any details.` });
    }
  }

  const handleSaveChanges = async () => {
    try {
      if (!validateEmail(profileInfo.email)) {
        Toaster({ message: 'Enter Valid Email!' });
        setIsValidEmail(false);
        return;
      }

      setIsValidEmail(true);
      setIsSaving(true); // Set the button loading state to true

      if (selectedImage !== null) {
        handleImageUpload();
      } else {
        await handleFormData();
      }

      setIsSaving(false); // Set the button loading state to false after successful save
    } catch (error) {
      setIsSaving(false); // Set the button loading state to false in case of an error
      throw error;
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

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

  // const openCamera = () => {
  //   ImagePicker.openCamera({
  //     width: 500,
  //     height: 500,
  //     cropping: true,
  //     writeTempFile: true
  //   }).then(image => {
  //     setSelectedImage({ uri: image.path, type: image.mime, name: `${randomString(16)}.jpg` });
  //   }).catch(error => {
  //     console.log('ImagePicker Error: ', error);
  //   });
  // };

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


  const onRefresh = React.useCallback(() => {
    fetchInformation();
    setRefreshing(false); // Set refreshing to false after data is fetched
  }, []);

  useEffect(() => {
    fetchInformation();
  }, []);
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor}}>
      {isLoading == true ? <Loader visible={isLoading}></Loader> : null}
      <Header navigation={navigation} type='back' options={{ title: 'Basic Information', dark: true }}></Header>
      <ScrollView refreshing={refreshing} onRefresh={onRefresh}>
        <View style={[container, { paddingHorizontal: 20 }]}>
          <View style={[justifyContentCenter, alignItemsCenter]}>
            <View
              style={[
                { width: 100, height: 100 },
                justifyContentCenter,
                alignItemsCenter,
                spacingProperty['mt-25'],
                spacingProperty['mb-25'],
              ]}>
              {selectedImage ? (
                <Image
                  source={{ uri: selectedImage.uri }}
                  style={{
                    width: 100,
                    height: 100,
                    backgroundColor: 'black',
                    borderRadius: 400 / 2,
                  }}
                />
              ) : (
                userData && "imageUrl" in userData && userData.imageUrl !== null ? <IconCustom type="image" source={userData.imageUrl} size={95} square={false}></IconCustom> :
                  <IconCustom type="text" source={getIconTextName(userData.collaboratorName)} size={95} square={true}></IconCustom>
              )}
              <View
                style={{
                  backgroundColor: colors.primary,
                  position: 'absolute',
                  top: 70,
                  left: 70,
                  borderRadius: 20,
                }}>
                <TouchableOpacity onPress={() => actionSheetRef.current?.show()}>
                  <Icon
                    name="edit-2"
                    size={15}
                    color="#FFFFFF"
                    style={{ padding: 10 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View>
            <Text style={[styles.basicInfoSubHeading, { color: theme.colors.onSurface }]}>General</Text>
          </View>
          <View>
            <TextInput
              mode='outlined'
              label='Name*'
              placeholder='Enter your name'
              style={[styles.basicInfoInputText, { marginBottom: 15, color: theme.colors.onSurface }]}
              value={profileInfo.collaboratorName}
              onChangeText={text =>
                setProfileInfo({ ...profileInfo, collaboratorName: text })
              }
            />
            <TextInput
              mode='outlined'
              label='Email*'
              multiline={true}
              placeholder='Enter your email'
              style={[styles.basicInfoInputText, { marginBottom: 15, color: theme.colors.onSurface }]}
              value={profileInfo.email}
              onChangeText={(text) => {
                setProfileInfo({ ...profileInfo, email: text });
                setIsValidEmail(true); // Reset the email validation status
              }}
            />
            <TextInput
              mode='outlined'
              label='City*'
              placeholder='Enter your city'
              style={[styles.basicInfoInputText, { color: theme.colors.onSurface }]}
              value={profileInfo.city}
              onChangeText={text =>
                setProfileInfo({ ...profileInfo, city: text })
              }
            />
          </View>
        </View>
      </ScrollView>
      <View style={{margin: 20, justifyContent: 'center', alignItems: 'center'}}>
        <Button 
          mode='elevated'
          style={[btn, {flexGrow: 1, width: '100%'}]}
          disabled={isSaving}
          loading={isSaving}
          buttonColor={isSaving ? theme.colors.surfaceVariant : colors.primary}
          textColor={colors.white}
          onPress={handleSaveChanges}>SAVE CHANGES</Button>
        <Button style={{marginTop: 10}} icon="trash-can-outline" textColor={colors.red} onPress={() => navigation.navigate('DeleteAccount')}>
          Delete Account
        </Button>
      </View>
      <CameraGallery actionSheetRef={actionSheetRef} id="settings-edit-profile" options={{ gallery: true, camera: true, galleryCallback: openGallery, cameraCallback: openCamera }}></CameraGallery>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputPreText: {
    fontSize: 16,

    marginRight: 15,
  },

  basicInfoSubHeading: {

    fontSize: 20,
    fontWeight: 600,
  },
  textInput: {
    fontSize: 13,
    // color: '#B3B3B3',
    borderWidth: 1,

    borderRadius: 5,
    paddingLeft: 20,
    fontSize: 15,
    height: 45,
  },
  preText: {
    fontSize: 18,
  },
  basicInfoInputText: {
    fontSize: 16,
    // flexGrow: 1,
  },
  galleryPhoto: {
    backgroundColor: '#F3F3F3',
    width: '40%',
    height: 65,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  editProfilePopup: {
    flexDirection: 'row',
  },
});

export default BasicInformation;
