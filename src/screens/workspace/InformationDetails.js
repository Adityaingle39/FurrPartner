import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Pressable,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Linking
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import moment from 'moment';
import React, { useState, useEffect, useRef } from 'react';
import { useRoute } from '@react-navigation/native';
import { Avatar, Checkbox, List, IconButton, TextInput, Switch, Button, useTheme } from 'react-native-paper';
import { SheetProvider, SheetManager, registerSheet } from "react-native-actions-sheet";
import ImagePicker from 'react-native-image-crop-picker';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/Feather';

import Apis from '../../utils/apis';
import Header from '../../components/common/Header';
import Toaster from '../../components/common/Toaster';
import Stepper from '../../components/common/Stepper';
import Dropdown from '../../components/common/Dropdown';
import IconCustom from '../../components/common/IconCustom';
import CameraGallery from '../../components/common/CameraGallery';
import LocationPicker from '../../components/common/LocationPicker';

import { useAuthState } from '../../services/auth';
import { useServiesState } from '../../services/services';
import { validateFields } from '../../utils/validations';
import { useWorspaceState } from '../../services/workspace';
import { randomString, requestLocationAccess,requestCameraPermission,requestAndroidGalleryPermission } from '../../utils/helpers';
import {
  spacingProperty,
  heading,
  subHeading,
  container,
  defaultInputContainer,
  alignItemsCenter,
  btn,
  colors,
  inputText,
  justifyContentCenter,
} from '../../utils/styles/gobalstyle';

const InformationDetails = ({ navigation }) => {
  const api = new Apis();
  const route = useRoute();
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const actionSheetRef = useRef(null);
  const locationSheetRef = useRef(null);
  const bgColor = colorScheme === 'dark' ? theme.colors.surface : theme.colors.surfaceVariant;

  const { userData } = useAuthState();
  const { services, setServices } = useServiesState();
  const { newWorkspace, workspacesData, setWorkspaces } = useWorspaceState();

  const [location, setLocation] = useState(null);
  const [allDay, setAllDay] = useState(false);

  //All services
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedValueObject, setSelectedValueObject] = useState(null);
  const [serviceList, setserviceList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dirty, setDirty] = useState(false);
  //schedule time
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [openStartTime, setOpenStartTime] = useState(false);
  const [openEndTime, setOpenEndTime] = useState(false);
  const [breakStartTime, setBreakStartTime] = useState(null);
  const [breakEndTime, setBreakEndTime] = useState(null);
  const [openBreakStartTime, setOpenBreakStartTime] = useState(false);
  const [openBreakEndTime, setOpenBreakEndTime] = useState(false);
  //form useState
  const [adminDesignationName, setDesignation] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminExperience, setExperience] = useState('');
  const [adminAbout, onChangeAbout] = useState('');
  const [adminWorkplaceName, onChangeWorkplaceName] = useState('');
  const [adminAddress, onChangeAddress] = useState('');
  const [adminTown, onChangeTown] = useState('');
  const [adminCity, onChangeCity] = useState('');
  const [adminPincode, onChangePincode] = useState('');
  const [adminState, onChangeState] = useState('');
  const [educationList, setEducationList] = useState(['']);
  const [expertiseList, setExpertiseList] = useState(['']);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [images, setImages] = useState([]);
  const [characterCountText, setCharacterCountText] = useState(0);
  const [remainingCharacters, setRemainingCharacters] = useState(1000);

  const handleLocationChange = (lat, long) => {
    setLocation({ latitude: lat, longitude: long });
    locationSheetRef.current?.hide();
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
        actionSheetRef?.current?.hide();
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
  //     actionSheetRef?.current?.hide();
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

  const fetchServices = async () => {
    api.getServices(userData.id)
    .then(res => {
      setserviceList(res);
      setServices(res);
    })
    .catch(err => {
      console.log('all services', err.message);
    });
  };

  const selectImages = () => {
    ImagePicker.openPicker({
      multiple: true,
      writeTempFile: true,
    })
      .then(selectedImages => {
        const newImages = selectedImages.map(image => {
          let imageName = `workspace-${randomString(6)}.jpg`;
          return {
            uri: image.path,
            type: image.mime,
            name: imageName,
          };
        });
        setImages(newImages);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const removeUploadedImage = (index) => {
    const uploadsTmp = images.filter((item, i) => i !== index);
    setImages(uploadsTmp);
  }

  const handleValueChange = itemValue => {
    setSelectedValue(itemValue);
    const selectedService = serviceList.find(
      service => service.id === itemValue,
    );
  };

  const addMoreEducation = () => {
    setEducationList([...educationList, '']);
  };

  const removeMoreEducation = (index) => {
    const tmpListing = [...educationList];
    tmpListing.splice(index, 1);
    setEducationList(tmpListing);
  }

  const handleEducationChange = (index, value) => {
    const updatedList = [...educationList];
    updatedList[index] = value;
    setEducationList(updatedList);
  };

  // added for new input expertise feild on add more
  const addMoreExpertise = () => {
    setExpertiseList([...expertiseList, '']);
  };

  const removeMoreExpertise = (index) => {
    const tmpListing = [...expertiseList];
    tmpListing.splice(index, 1);
    setExpertiseList(tmpListing);
  }

  const handleExpertiseChange = (index, value) => {
    const updatedList = [...expertiseList];
    updatedList[index] = value;
    setExpertiseList(updatedList);
  };

  // added for checkbox selection
  const handle24by7 = checked => {
    if (!checked) {
      setSelectedCheckboxes(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    } else {
      setSelectedCheckboxes([]);
    }
    setAllDay(preState => !preState);
  };

  const handleCheckboxClick = (label, status) => {
    if (selectedCheckboxes.includes(label)) {
      setSelectedCheckboxes(
        selectedCheckboxes.filter(value => value !== label),
      );
    } else {
      setSelectedCheckboxes([...selectedCheckboxes, label]);
    }

    if (allDay && selectedCheckboxes.length == 7) {
      setAllDay(preState => !preState);
    } else if (!allDay && status == false && selectedCheckboxes.length == 6) {
      setAllDay(preState => !preState);
    }
  };
  ///Character count

  const handleCharacterLimit = (text) => {
    // console.log("event", text);
    onChangeAbout(text);
    const characterCount = text.length;
    const remainingCharacters = 1000 - characterCount;
    // const characterCountText = `${characterCount}/1000 characters`;
    setCharacterCountText(characterCount);
    setRemainingCharacters(remainingCharacters)

    if (characterCount > 1000) {
      // Display toaster message for exceeding character limit
      Toaster({ message: 'You have exceeded the character limit.' });
    }
  }
  // Select Service
  const selectService = async () => {
    await SheetManager.show('select-service', {
      payload: {
        options: serviceList
          .filter(i => i.name === 'Veterinary' || i.name === 'Groomers')
          .map(i => ({ id: i.id, title: i.name })),
        label: 'name',
        selected: selectedValueObject,
        onChange: (response) => {
          handleValueChange(response.id);
          setSelectedValueObject(response);
        }
      },
    });
  };
  // Pincode validation
  const handlePincodeChange = text => {
    // Filter out non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, '');
    onChangePincode(numericValue);
  };
  const hasValidEntries = list => list.some(entry => entry.trim() !== "");
  const navigateButton = () => {
    setDirty(true);
    const validationError = validateFields({
      selectedValue,
      adminDesignationName,
      adminPhone,
      adminAbout,
      // adminWorkplaceName,
      // adminAddress,
      // adminTown,
      // adminCity,
      // adminPincode,
      // adminState,
      // startTime,
      // endTime,
      // selectedCheckboxes,
      selectedName: selectedValueObject?.title,
      educationList,
      expertiseList,
      // location
    });

    if (selectedImage == null) {
      Toaster({message: `Please select a workspace cover image`});
    }  else if (!selectedValueObject || !selectedValueObject.title) {
      Toaster({ message: "Please select a service" });
      return;
    }else if (
      !adminDesignationName 
    ) {
      Toaster({ message: "Please fill Designation" });
    }  else if (adminPhone.length < 10) {
      Toaster({message: 'Phone number must be 10 digits'});
    }else if (selectedValueObject?.title === "Veterinary" &&!adminExperience) {
      Toaster({ message: "Please fill experience" });
    }else if (!adminAbout ) {
      Toaster({ message: "Please fill About" });
    }  
     else if (
        selectedValueObject?.title === "Veterinary" &&
        (!hasValidEntries(educationList))
      ) {
        Toaster({ message: "Please fill education" });
    } else if (
      selectedValueObject?.title === "Veterinary" &&
      (!hasValidEntries(expertiseList))
    ) {
      Toaster({ message: "Please fill expertise" });
     }else if (validationError) {
      Toaster({message: validationError});
    } else {
      const userId = userData.id;
      let tmpWorkSpaces = [...workspacesData];
      let myWorkSpace = {
        designationName: adminDesignationName,
        phone: adminPhone,
        about: adminAbout,
        // workplaceName: adminWorkplaceName,
        collaboratorId: userId,
        serviceId: selectedValue,
        education: educationList,
        expertise: expertiseList,
        experience: adminExperience,
        coverImage: selectedImage,
        new: true,
      };
      tmpWorkSpaces.push(myWorkSpace);
      setWorkspaces(tmpWorkSpaces);
      navigation.navigate('WorkDetails', { selectedName: selectedValueObject?.title });
    }
  };

  useEffect(() => {
    if (
      services &&
      ((Array.isArray(services) && services.length == 0) ||
        (typeof services == 'object' && services.name == null))
    ) {
      fetchServices();
    }
    handle24by7(allDay)
    requestLocationAccess();
    registerSheet('select-service', Dropdown);
    setDirty(false);
  }, []);
  const handlePhoneChange = (text) => {
    const cleanedText = text.replace(/[^0-9]/g, '');
    setAdminPhone(cleanedText);
  };

  return (
    <SafeAreaView style={[container, { backgroundColor: bgColor }]}>
      <Header navigation={navigation} type="back" options={{ title: 'Create Workspace', subTitle: 'Basic Information'}}></Header>
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={{ flex: 1 }}
    >
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ marginHorizontal: 20 }}>
          <View style={[justifyContentCenter, alignItemsCenter, {marginTop: 30}]}>
            <View style={styles.imageContainer}>
              {selectedImage ? (
                <Image
                  source={{ uri: selectedImage.uri }}
                  style={styles.imageModified}
                />
              ) : (
                <Image
                  source={{ uri: Image.resolveAssetSource(require('../../assets/AddUserProfileImage.png')).uri }}
                  style={styles.imageModified}
                />
              )}
              <View
                style={{
                  backgroundColor: colors.primary,
                  position: 'absolute',
                  top: 60,
                  right: 5,
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
              <Text style={{color: theme.colors.onSurface}}>Cover Image*</Text>
            </View>
          </View>
          <View>
            <SheetProvider>
              <Pressable onPress={Platform.OS == 'ios' ? null : selectService}>
                <TextInput
                  style={[spacingProperty['mt-15']]}
                  mode="outlined"
                  label="Service*"
                  editable={false}
                  error={dirty && (selectedValueObject === null || selectedValueObject === '')}
                  value={selectedValueObject?.title}
                  placeholder="Select a service"
                  placeholderTextColor={theme.colors.onSurfaceVariant}
                  onPressIn={Platform.OS == 'ios' ? selectService : null}
                />
              </Pressable>
            </SheetProvider>

            {/* <Text style={[styles.listViewText, spacingProperty['mt-15'], { color: theme.colors.onSurface }]}>
              Basic Details
            </Text> */}
            <TextInput
              style={[spacingProperty['mb-15'], {marginTop: 15}]}
              mode="outlined"
              label="Name with Designation*"
              // error={dirty && adminDesignationName === ''}
              placeholder="Name with Designation"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              onChangeText={setDesignation}
            />
            <TextInput
              style={[spacingProperty['mb-15']]}
              mode="outlined"
              label="Phone*"
              error={dirty && (adminPhone === '' || adminPhone.length < 10)}
              placeholder="Enter Mobile Number"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              onChangeText={handlePhoneChange}
              keyboardType="numeric"
              maxLength={10}
              helperText={dirty && adminPhone.length < 10 ? "Phone number must be 10 digits" : ""}
            />
              {selectedValueObject?.title == 'Veterinary' && (
            <TextInput
              style={[spacingProperty['mb-15']]}
              mode="outlined"
              label="Experience*"
              error={dirty && adminExperience === ''}
              placeholder="Experience (In Years)"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              onChangeText={setExperience}
              keyboardType="numeric"
              maxLength={2}
            />
              )}
            <View style={spacingProperty['mb-15']}>
              <TextInput
                mode="outlined"
                label="About*"
                multiline={true}
                numberOfLines={4}
                error={dirty && adminAbout === ''}
                placeholder="Write about yourself"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                onChangeText={handleCharacterLimit}
                value={adminAbout}
                maxLength={1000}
              />
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[subHeading, { color: theme.colors.onSurface }]}>{`${characterCountText}/1000 characters`}</Text>
              </View>
              {remainingCharacters <= 0 && Toaster({ message: 'You have exceeded the character limit.' })}
            </View>

            {selectedValueObject?.title == 'Veterinary' ? (
              <View style={spacingProperty['mb-15']}>
                {educationList.map((education, index) => (
                  <View key={index} style={spacingProperty['mb-10']}>
                    <TextInput
                      style={[]}
                      mode="outlined"
                      error={dirty && !hasValidEntries(educationList)}
                      label="Education*"
                      placeholder="Enter Education Completed*"
                      placeholderTextColor={theme.colors.onSurfaceVariant}
                      value={education}
                      onChangeText={text => handleEducationChange(index, text)}
                    />
                    {index > 0 && <View style={{ alignItems: 'flex-end' }}>
                      <TouchableOpacity onPress={() => removeMoreEducation(index)}>
                        <Text style={[styles.addMoreText, { color: colors.red }]}>x Remove</Text>
                      </TouchableOpacity>
                    </View>}
                  </View>
                ))}
                <View style={{ alignItems: 'flex-end' }}>
                  <TouchableOpacity onPress={addMoreEducation}>
                    <Text style={styles.addMoreText}>+ Add More</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
            {selectedValueObject?.title == 'Veterinary' ? (
              <View style={spacingProperty['mb-15']}>
                {expertiseList.map((expertise, index) => (
                  <View key={index} style={spacingProperty['mb-10']}>
                    <TextInput
                      style={[]}
                      mode="outlined"
                      error={dirty && !hasValidEntries(expertiseList)}
                      label="Area of Expertise*"
                      placeholderTextColor={theme.colors.onSurfaceVariant}
                      placeholder="Enter Area of Expertise"
                      value={expertise}
                      onChangeText={text => handleExpertiseChange(index, text)}
                    />
                    {index > 0 && <View style={{ alignItems: 'flex-end' }}>
                      <TouchableOpacity onPress={() => removeMoreExpertise(index)}>
                        <Text style={[styles.addMoreText, { color: colors.red }]}>x Remove</Text>
                      </TouchableOpacity>
                    </View>}
                  </View>
                ))}
                <View style={{ alignItems: 'flex-end' }}>
                  <TouchableOpacity onPress={addMoreExpertise}>
                    <Text style={styles.addMoreText}>+ Add More</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
      <View style={[spacingProperty['m-20']]}>
        <Button style={[btn, {width: '100%'}]} labelStyle={{fontSize: 20}} mode="contained" buttonColor={colors.primary} textColor={colors.white} onPress={navigateButton}>Next</Button>
      </View>
      {/* <LocationPicker actionSheetRef={locationSheetRef} id="edit-profile-location" onChange={handleLocationChange} /> */}
      <CameraGallery actionSheetRef={actionSheetRef} id="settings-edit-profile" options={{ gallery: true, camera: true, galleryCallback: openGallery, cameraCallback: openCamera }}></CameraGallery>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageContainer: { width: 200, height: 100, justifyContent: 'center', alignItems: 'center', marginVertical: 25 },
  imageModified: {width: 200, height: 100, borderWidth: 2, borderColor: colors.yellow, borderRadius: 15},
  imagesBorder: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,

  },
  datePickerInput: {
    borderWidth: 1,
    height: 45,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    paddingHorizontal: 20,
    borderColor: '#919191'
  },
  listViewText: {
    fontSize: 16,
    fontWeight: 500,
    // color: '#000000',
  },
  checkboxx: {
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },
  textInput: {
    fontSize: 13,

    borderWidth: 1,

    borderRadius: 5,
    paddingLeft: 20,
    fontSize: 15,
    height: 45,
  },
  addMoreText: {
    fontSize: 15,
    color: colors.lightBlue,
  },

  inputPreText: {
    fontSize: 18,
    color: '#263238',
  },
  container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '25%', // Adjust the width to accommodate four checkboxes in a row
  },
  checkboxText: {
    fontSize: 15,
    fontWeight: 600,
    color: colors.black,
    // marginTop: 7,
  },
  uploadButton: {
    height: 45,
    width: '35%',
    borderRadius: 10,

    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: 600,
  },
});

export default InformationDetails;
