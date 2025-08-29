import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Linking
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import {useRoute, useTheme} from '@react-navigation/native';
import {Button} from 'react-native-paper'
import Toaster from '../../../components/common/Toaster';
import Loader from '../../../components/common/Loader';
import {
  btn,
  alignItemsCenter,
  colors,
  container,
  spacingProperty,
} from '../../../utils/styles/gobalstyle';
import { documentName, documentDescription, documentText } from './documentStyle';
import { useAuthState } from '../../../services/auth';
import { randomString,requestCameraPermission } from '../../../utils/helpers';
import Apis from '../../../utils/apis';
const AadharCard = ({ navigation }) => {
  const api = new Apis();
  const route = useRoute();
  const { userData } = useAuthState();
  const [selectedImage, setSelectedImage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigateButton = () => {
    if (selectedImage.length == 0) {
      Toaster({message: `Please select AADHAR card from gallery or capture from camera.`});
    } else {
      /**Start loader */
      setIsLoading(true);
      /**Create form data for files */
      const form_data = new FormData();
      selectedImage.forEach(image => {
        form_data.append('files', image)
      });
      /**API Call */
      api.uploadWorkspaceDocuments(userData.id, 'AADHAR', form_data)
      .then(res => {
        console.log("uploadWorkspaceDocuments", res);
        setIsLoading(false);
        Toaster({message: `AADHAR card submitted successfully.`});
        navigation.navigate('Verification', {uploaded: [...route.params.docs, 'doc-aadhar']});
      })
      .catch(err => {
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
    let uploadedImages = Object.assign([], selectedImage);
    ImagePicker.openCamera({
      width: 500,
      height: 500,
      cropping: true,
      writeTempFile: true,
    })
      .then((image) => {
        let imageName = `aadhar-${randomString(6)}.jpg`;
        uploadedImages.push({ uri: image.path, type: image.mime, name: imageName })
        setSelectedImage(uploadedImages);
      })
      .catch((error) => {
        console.log('ImagePicker Error: ', error);
      });
  };
  const theme=useTheme();
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
              Aadhar Card
            </Text>
            <View style={[alignItemsCenter, spacingProperty['mb-20']]}>
              <Image
                source={require('../../../assets/aadhar.png')}
                style={{ width: '100%' }}
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
                  card in either JPG, JPEG, PNG.
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
              <TouchableOpacity
                onPress={openCamera}
                style={[styles.uploadButton, spacingProperty['mt-10'],{backgroundColor:colors.primary}]}>
                <Text style={[styles.uploadButtonText,{color:colors.white}]}>Upload</Text>
              </TouchableOpacity>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {selectedImage && selectedImage.length > 0 ? selectedImage.map((image, index) => (<Image
                  key={`selected-image-${index}`}
                  source={{ uri: image.uri }}
                  style={{ width: 200, height: 200,marginTop:20, marginBottom: 10 }}
                />)) : null}
              </View>
            </View>
            <View style={[alignItemsCenter, spacingProperty['pt-20']]}>
              <Button style={[btn, {flexGrow: 1, width: '100%'}]} textColor={colors.white} buttonColor={colors.primary} icon="file-document-multiple-outline" mode="contained" onPress={navigateButton}>Done</Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  aadharDescription: {
    flexDirection: 'row',
  },
  decText: {
    fontSize: 12,
    color: '#000000',
  },
  uploadButton: {
    height: 45,
    width: '35%',
    borderRadius: 10,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: 600,
  },
});
export default AadharCard;