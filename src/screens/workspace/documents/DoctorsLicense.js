import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {Button} from 'react-native-paper'
import {useRoute, useTheme} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Toaster from '../../../components/common/Toaster';
import Loader from '../../../components/common/Loader';
import {
  btn,
  alignItemsCenter,
  colors,
  container,
  spacingProperty,
} from '../../../utils/styles/gobalstyle';
import {documentName, documentDescription, documentText} from './documentStyle';
import ImagePicker from 'react-native-image-crop-picker';
import Apis from '../../../utils/apis';
import {useAuthState} from '../../../services/auth';
import { randomString, requestCameraPermission } from '../../../utils/helpers';

const DoctorsLicense = ({navigation}) => {
  const api = new Apis();
  const theme=useTheme();
  const route = useRoute();
  const {userData} = useAuthState();
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigateButton = () => {
    if (!selectedImage) {
      Toaster({ message: `Please select license from gallery.` });
    } else if (selectedImage.length === 0) {
      Toaster({ message: `Please select license from gallery.` });
    } else {
      /**Start loader */
      setIsLoading(true);
      /**Create form data for files */
      const form_data = new FormData();
      form_data.append('files', selectedImage);
      /**API Call */
      api.uploadWorkspaceDocuments(userData.id, 'DOCTOR_LICENSE', form_data)
        .then(res => {
          // console.log("uploadWorkspaceDocuments", res);
          setIsLoading(false);
          Toaster({ message: `License submitted successfully.` });
          navigation.navigate('Verification', { uploaded: [...route.params.docs, 'doc-license'] });
        }).catch(err => {
          setIsLoading(false);
          console.log(err);
        });
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
  return (
    <SafeAreaView style={container}>
      {isLoading == true ? <Loader visible={isLoading}></Loader> : null}
      <ScrollView>
        <View style={[spacingProperty['m-15']]}>
          <View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={30} color={theme.colors.onSurface}></Icon>
            </TouchableOpacity>
          </View>

          <View style={[spacingProperty['p-20']]}>
          <Text style={[documentName, spacingProperty['pb-25'],{color:theme.colors.onSurface}]}>
              Doctor’s License
            </Text>
            <View style={[alignItemsCenter, spacingProperty['mb-20']]}>
              <Image
                source={require('../../../assets/doctorLicense.png')}
                style={{width: '100%'}}
              />
            </View>

            <View>
              <View style={[documentDescription, spacingProperty['mb-20']]}>
                <Icon
                  name="check"
                  size={23}
                  color={colors.green}
                  style={spacingProperty['mr-10']}></Icon>
                <Text style={[documentText, spacingProperty['pr-20'],{color:theme.colors.outline}]}>
                  Ensure that you have a clear and legible copy of your Aadhaar
                  card in either JPG, JPEG, PNG or PDF format.
                </Text>
              </View>
              <View style={[documentDescription, spacingProperty['mb-20']]}>
                <Icon
                  name="check"
                  size={23}
                  color={colors.green}
                  style={spacingProperty['mr-10']}></Icon>
                <Text style={[documentText, spacingProperty['pr-20'],{color:theme.colors.outline}]}>
                  Before uploading, ensure that all the details on the Aadhaar
                  card, such as your name, date of birth, address, and Aadhaar
                  number are clearly visible.
                </Text>
              </View>
              <View style={[documentDescription, spacingProperty['mb-20']]}>
                <Icon
                  name="check"
                  size={23}
                  color={colors.green}
                  style={spacingProperty['mr-10']}></Icon>
                <Text style={[documentText, spacingProperty['pr-20'],{color:theme.colors.outline}]}>
                  Ensure that your Aadhaar card is not a black and white or
                  grayscale scan of the original document, as these may not be
                  accepted.
                </Text>
              </View>
              <View style={[documentDescription, spacingProperty['mb-20']]}>
                <Icon
                  name="check"
                  size={23}
                  color={colors.green}
                  style={spacingProperty['mr-10']}></Icon>
                <Text style={[documentText, spacingProperty['pr-20'],{color:theme.colors.outline}]}>
                  After uploading, check that the document has been uploaded
                  correctly and is easily visible and readable.
                </Text>
              </View>
            </View>
            <TouchableOpacity
                onPress={openCamera}
                style={[styles.uploadButton, spacingProperty['mt-10'],{backgroundColor:colors.primary}]}>
                <Text style={[styles.uploadButtonText,{color:colors.white,}]}>Upload</Text>
              </TouchableOpacity>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {selectedImage ? (
                <Image
                  source={{uri: selectedImage.uri}}
                  style={{width: 200, height: 200, marginBottom: 20}}
                />
              ) : null}
            </View>
            <View>
              <Button style={[btn, {flexGrow: 1, width: '100%',backgroundColor:colors.primary}]} textColor={colors.white} icon="file-document-multiple-outline" mode="contained" onPress={navigateButton}>Done</Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  uploadButton: {
    height: 45,
    width: '35%',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: 600,
  },
});

export default DoctorsLicense;
