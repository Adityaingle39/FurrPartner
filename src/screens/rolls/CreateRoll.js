import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Dimensions,
  useColorScheme,
  Platform
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { TextInput, Button, Checkbox, Divider, useTheme } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { SheetProvider, SheetManager, registerSheet } from "react-native-actions-sheet";
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/Feather'
import Video from 'react-native-video';

import Apis from '../../utils/apis';
import Loader from '../../components/common/Loader';
import Header from '../../components/common/Header';
import Toaster from '../../components/common/Toaster';
import VideoGallery from '../../components/common/VideoGallery';
import CameraGallery from '../../components/common/CameraGallery';

import { randomString } from '../../utils/helpers';
import { useAuthState } from '../../services/auth';
import { useRollsState } from '../../services/rolls';
import { useWorspaceState } from '../../services/workspace';
import { useServiesState } from '../../services/services';
import {
  container,
  spacingProperty,
  heading,
  colors,
  flexDirectionRow,
  alignItemsCenter,
  btn,
} from '../../utils/styles/gobalstyle';

const CreateRoll = ({ navigation }) => {
  const api = new Apis();
  const route = useRoute();
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const bgColor = colorScheme === 'dark' ? theme.colors.surface : theme.colors.surfaceVariant;
  const iosImage = Image.resolveAssetSource(require('../../assets/Active.png')).uri;

  const actionSheetRef = useRef(null);
  const coverImageSheetRef = useRef(null);
  const {width, height} = Dimensions.get('window');
  
  const { userData } = useAuthState();
  const { rolls, setRolls } = useRollsState();
  const { defaultWorkspace } = useWorspaceState();
  const { services, setServices } = useServiesState();

  const [isLoading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [serviceType, setServiceType] = useState(null);
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const openCameraForVideo = () => {
    ImagePicker.openCamera({
      mediaType: 'video',
    }).then((video) => {
      if (video) {
        // console.log("video", video);
        if (video.duration > 300000) {
          Toaster({message: `Video should not be more than 5 minutes`})
        } else {
          const imageObject = {
            uri: video.path,
            type: video.mime,
            name: `video-${randomString(16)}.mp4`,
          };
          setSelectedVideo(imageObject);
        }
        actionSheetRef?.current?.hide();
      }
    }).catch((error) => {
      console.log('ImagePicker Error:', error);
    });
  };

  const openGalleryForVideo = () => {
    ImagePicker.openPicker({
      mediaType: 'video',
    }).then((video) => {
      // console.log("video", video);
      if (video.duration > 300000) {
        Toaster({message: `Video should not be more than 5 minutes`})
      } else {
        const imageObject = {
          uri: video.path,
          type: video.mime,
          name: `video-${randomString(16)}.mp4`, 
        };
        setSelectedVideo(imageObject);
      }
      
      actionSheetRef?.current?.hide();
    }).catch((error) => {
      console.log('ImagePicker Error:', error);
    });
  };

  // console.log("services", services && services.length > 0 ? services?.find(i => i.id == defaultWorkspace.serviceId) : null);

  const fetchServices = async () => {
    api.getServices(userData.id)
    .then(res => {
      const service = res.find(i => i.id === defaultWorkspace.serviceId);
      setServices(res);
      setServiceType(service.type);
      // console.log("services", res.length, service.type);
    })
    .catch(err => {
      console.log('all services', err.message);
    });
  };

  const openCameraForImage = () => {
    ImagePicker.openCamera({
      width: 500,
      height: 500,
      cropping: true,
      writeTempFile: true
    }).then(image => {
      setSelectedImage({ uri: image.path, type: image.mime, name: `cover-${randomString(16)}.jpg` });
      coverImageSheetRef?.current?.hide();
    }).catch(error => {
      console.log('ImagePicker Error: ', error);
    });
  };

  const openGalleryForImage = () => {
    ImagePicker.openPicker({
      cropping: true,
    }).then(image => {
      console.log("response :", image);
      setSelectedImage({ uri: image.path, type: image.mime, name: `cover-${randomString(16)}.jpg` });
      coverImageSheetRef?.current?.hide();
    }).catch(error => {
      console.log('ImagePicker Error: ', error);
      actionSheetRef?.current?.hide();
    });
  };

  const uploadButton = () => {
    if (description === '') {
      Toaster({ message: 'Please add roll description.' });
    } else {
      setIsUploading(true);
      const form_data = new FormData();
      form_data.append('file', selectedVideo);
      form_data.append('coverImage', selectedImage);
      form_data.append('description', description);
      form_data.append('tag', tags);

      api.uploadRolls(userData.id, form_data, defaultWorkspace.id, serviceType)
      .then(res => {
        const response = res;
        console.log("response :", response);
        if (response && response.status === 200 || ('isUploaded' in response && response.isUploaded)) {
          navigation.goBack();
          Toaster({ message: 'Roll uploaded successfully!' });
        }
        setTimeout(() => {
          setIsUploading(false);
        }, 1000);
      }).catch(err => {
        setTimeout(() => {
          setIsUploading(false);
        }, 1000);
        console.log("error", err);
      });
    }
  };
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const handleVideoLoad = (data) => {
    const videoDuration = data.duration;
    if (videoDuration > 2) {
      setIsVideoPlaying(true);
    } else {

      setIsVideoPlaying(false);
    }
  };

  const init = () => {
    if (services && services.length === 0) {
      fetchServices();
    } else {
      const service = services.find(i => i.id === defaultWorkspace.serviceId);
      setServiceType(service.type);
    }
  }

  useEffect(() => {
    init();
  }, []);
  
  return (
    <SafeAreaView style={[container, {backgroundColor: bgColor}]}>
      <Header navigation={navigation} type='back' options={{ title: 'Create Roll', dark: true }}></Header>
      {isLoading == true ? <Loader visible={isLoading}></Loader> : null}
      <ScrollView style={{flex: 1}}>
        <View style={[spacingProperty['p-20']]}>
          {(selectedVideo !== null || selectedImage !== null) && <View style={[flexDirectionRow, {marginBottom: 15, justifyContent: 'space-between'}]}>
            <Image source={{uri: Platform.OS == 'ios' ? iosImage : selectedVideo?.uri}} style={{width: width / 2.5, height: width / 2.2, borderRadius: 1, borderColor: theme.colors.surfaceVariant}} />
            <Image source={{uri: selectedImage?.uri}} style={{width: width / 2.5, height: width / 2.2}} />
          </View>}
          <View style={[flexDirectionRow, {marginBottom: 15, justifyContent: 'space-between'}]}>
            <TouchableOpacity
              onPress={() => actionSheetRef.current?.show()}
              style={[styles.uploadButton, spacingProperty['mt-10'], {backgroundColor: colorScheme == 'dark' ? theme.colors.surfaceVariant : theme.colors.background}]}>
              <Text style={{color: theme.colors.onSurface}}>Upload Video*</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => coverImageSheetRef.current?.show()}
              style={[styles.uploadButton, spacingProperty['mt-10'], {backgroundColor: colorScheme == 'dark' ? theme.colors.surfaceVariant : theme.colors.background, marginLeft: 15}]}>
              <Text style={{color: theme.colors.onSurface}}>Upload Cover Image*</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            mode='outlined'
            label='Caption*'
            style={{ color: theme.colors.onSurface, marginBottom: 15}}
            placeholder="Write Caption..."
            placeholderTextColor={theme.colors.onSurface}
            value={description}
            multiline={true}
            numberOfLines={4}
            maxLength={254}
            onChangeText={text => setDescription(text)}
          />
          <TextInput
            mode='outlined'
            label="Tags"
            onChangeText={setTags}
            multiline={true}
            numberOfLines={4}
            maxLength={254}
            style={[{ borderColor: theme.colors.onSurface }]}
            placeholderTextColor={theme.colors.onSurface}
            placeholder='Add keywords for tagging'
          />
          <Divider style={{ marginVertical: 10 }} />
          {/* <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', flexGrow: 1}} onPress={() => { setIsAdult(!isAdult); }}>
              <Checkbox
                color={colors.lightBlue} uncheckColor={'red'}
                status={isAdult ? 'checked' : 'unchecked'}
                onPress={() => {
                  setIsAdult(!isAdult);
                }}
              />
              <Text style={[styles.checkboxText, { color: theme.colors.onSurface }]}>This video is </Text>
              <Text style={styles.checkboxSubText}>18+</Text>
            </TouchableOpacity>
          </View>
          <Divider style={{ marginVertical: 10 }} /> */}
        </View>
      </ScrollView>
      <Button disabled={isUploading} loading={isUploading} style={[btn, {marginBottom: 20, marginHorizontal: 20}]} mode='contained' onPress={uploadButton} buttonColor={isUploading ? null : colors.primary} textColor={colors.white}>Upload</Button>
      <VideoGallery actionSheetRef={actionSheetRef} id="roll-upload-video" options={{gallery: true, camera: true, galleryCallback: openGalleryForVideo, cameraCallback: openCameraForVideo}} />
      <CameraGallery actionSheetRef={coverImageSheetRef} id="roll-upload-image" options={{ gallery: true, camera: true, galleryCallback: openGalleryForImage, cameraCallback: openCameraForImage }}></CameraGallery>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  uploadButton: {
    height: 45,
    flexGrow: 1,
    borderRadius: 10,
    // backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: 17,
    fontWeight: 600,
    color: colors.blue,
  },
  hrLine: {
    borderWidth: 0.5,
    borderColor: '#B3B3B3',
  },
  captionText: {
    fontSize: 16,
    marginLeft: 25,
    paddingRight: 10
  },
  rollHeading: {
    fontSize: 18,
    fontWeight: 600,
    color: colors.black
  },
  tagTextInput: {
    height: 55,
    borderRadius: 10,

    paddingLeft: 25,
    color: '#B3B3B3',
    fontSize: 16,
    marginVertical: 20
  },
  checkboxText: {
    fontSize: 18,
    fontWeight: 500,
    color: colors.black
  },
  checkboxSubText: {
    color: colors.blue,
    fontSize: 18,
    fontWeight: 500
  }
});

export default CreateRoll;
