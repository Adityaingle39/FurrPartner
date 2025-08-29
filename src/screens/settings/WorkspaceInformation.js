import {
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Alert,
  Linking,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, {useState, useEffect, useRef} from 'react';
import {
  TextInput,
  Switch,
  Avatar,
  Checkbox,
  List,
  IconButton,
  Button,
} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import {
  SheetProvider,
  SheetManager,
  registerSheet,
} from 'react-native-actions-sheet';
import DatePicker from 'react-native-date-picker';
import ImagePicker from 'react-native-image-crop-picker';
import moment from 'moment';

import Apis from '../../utils/apis';
import Dropdown from '../../components/common/Dropdown';
import Toaster from '../../components/common/Toaster';
import Loader from '../../components/common/Loader';
import Header from '../../components/common/Header';
import CameraGallery from '../../components/common/CameraGallery';
import LocationPicker from '../../components/common/LocationPicker';

import {useAuthState} from '../../services/auth';
import {useWorspaceState} from '../../services/workspace';
import {
  randomString,
  requestCameraPermission,
  requestLocationAccess,
} from '../../utils/helpers';
import {setData, getData} from '../../utils/db';
import {
  spacingProperty,
  container,
  colors,
  btn,
  justifyContentCenter,
  defaultInputContainer,
  subHeading,
} from '../../utils/styles/gobalstyle';

const WorkspaceInformation = ({navigation}) => {
  const api = new Apis();
  const theme = useTheme();
  const colorScheme = useColorScheme();

  const actionSheetRef = useRef(null);
  const coverImageSheetRef = useRef(null);

  const {userData} = useAuthState();
  const {defaultWorkspace, workspacesData, setWorkspaces} = useWorspaceState();

  // console.log("defaultWorkspace", defaultWorkspace)
  let workplaceTiming =
    defaultWorkspace.workplaceTime &&
    typeof defaultWorkspace.workplaceTime == 'object'
      ? defaultWorkspace.workplaceTime
      : null;

  const [allDay, setAllDay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serviceList, setServiceList] = useState([]);
  const [selectedName, setSelectedName] = useState('');
  const [selectedValue, setSelectedValue] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);

  const [designationName, onChangeDesignationName] = useState(null);
  const [phone, onChangeMobile] = useState(null);
  const [experience, onChangeExperience] = useState(null);

  const [workplaceName, onChangeWorkplaceName] = useState(null);
  const [address, onChangeAddress] = useState(null);
  const [town, onChangeTown] = useState(null);

  const [city, onChangeCity] = useState(null);
  const [pincode, onChangePincode] = useState(null);
  const [state, onChangeState] = useState(null);
  const [location, setLocation] = useState(null);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [educationList, setEducationList] = useState([]);
  const [expertiseList, setExpertiseList] = useState([]);
  //schedule time
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [openStartTime, setOpenStartTime] = useState(false);
  const [openEndTime, setOpenEndTime] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [breakStartTime, setBreakStartTime] = useState(null);
  const [breakEndTime, setBreakEndTime] = useState(null);
  const [openBreakStartTime, setOpenBreakStartTime] = useState(false);
  const [openBreakEndTime, setOpenBreakEndTime] = useState(false);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [isLoadingMap, setIsLoadingMap] = useState(false);
  const [manualLocationInput, setManualLocationInput] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [workspaceAbout, setWorkspaceAbout] = useState('');
  const [characterCountText, setcharacterCountText] =
    useState(`0/1000 characters`);
  const [remainingCharacters, setRemainingCharacters] = useState(1000);
  const [dirty, setDirty] = useState(false);

  const onAboutTextChange = text => {
    if (text) {
      setCharacterCount(text.length);
      setRemainingCharacters(1000 - text.length);
      setcharacterCountText(`${characterCount}/1000 characters`);
    }

    if (characterCount > 1000) {
      // Display toaster message for exceeding character limit
      Toaster({message: 'You have exceeded the character limit.'});
    } else {
      setWorkspaceAbout(text);
    }
  };

  //console.log("defaultWorkspace", defaultWorkspace.workplaceTime.days);
  const init = async () => {
    setSelectedValue(defaultWorkspace.serviceId);
    onChangeDesignationName(defaultWorkspace.designationName);
    onChangeMobile(defaultWorkspace.phone);
    onChangeExperience(defaultWorkspace.experience);
    onAboutTextChange(defaultWorkspace.about);
    onChangeWorkplaceName(defaultWorkspace.workplaceName);
    onChangeAddress(defaultWorkspace.address);
    // onChangeTown(defaultWorkspace.town);
    onChangeCity(defaultWorkspace.city);
    onChangePincode(defaultWorkspace.pincode);
    onChangeState(defaultWorkspace.state);
    setSelectedCheckboxes(
      workplaceTiming !== null && 'days' in workplaceTiming
        ? workplaceTiming.days
        : [],
    );
    setImages(
      (
        defaultWorkspace?.workspaceImages ||
        defaultWorkspace?.uploadImages ||
        []
      ).map(image => ({
        uri: defaultWorkspace?.uploadImages ? image.uri : image.value,
      })),
    );
    setEducationList(defaultWorkspace.education);
    setExpertiseList(defaultWorkspace.expertise);
    setLocation({
      latitude: defaultWorkspace.latitude,
      longitude: defaultWorkspace.longitude,
    });
    //schedule time
    // setImages(defaultWorkspace.workspaceImages ? defaultWorkspace.workspaceImages.map(image => image.value) : []);
    setStartTime(
      workplaceTiming !== null && workplaceTiming.start_time !== ''
        ? moment(workplaceTiming.start_time, 'hh:mm A')
        : null,
    );
    setEndTime(
      workplaceTiming !== null && workplaceTiming.end_time !== ''
        ? moment(workplaceTiming.end_time, 'hh:mm A')
        : null,
    );

    setBreakStartTime(
      workplaceTiming !== null &&
        typeof workplaceTiming.lunch_break == 'object' &&
        workplaceTiming.lunch_break.start_time !== ''
        ? moment(workplaceTiming.lunch_break.start_time, 'hh:mm A')
        : null,
    );
    setBreakEndTime(
      workplaceTiming !== null &&
        typeof workplaceTiming.lunch_break == 'object' &&
        workplaceTiming.lunch_break.end_time !== ''
        ? moment(workplaceTiming.lunch_break.end_time, 'hh:mm A')
        : null,
    );
    setAllDay(defaultWorkspace.workplaceTime.days.length == 7 ? true : false);
    // try {
    //   const uploadedImages = await getData(`uploaded_images_${defaultWorkspace.id}`);
    //   if (uploadedImages) {
    //     setImages(uploadedImages);
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  };
  useEffect(() => {
    init();
  }, []);

  const fetchServices = async () => {
    if (serviceList && serviceList.length == 0) {
      api
        .getServices(userData.id)
        .then(res => {
          console.log('fetchServices', res);
          setServiceList(res);
        })
        .catch(err => {
          console.log('all services', err.message);
        });
    }
  };

  // Select Location
  const selectLocation = async () => {
    setIsLoadingMap(true);
    const permissionGranted = await requestLocationAccess();
    setHasLocationPermission(permissionGranted);

    if (permissionGranted) {
      await SheetManager.show('select-location', {
        payload: {
          onChange: (lat, long) => {
            handleLocationChange(lat, long);
            setIsLoadingMap(false);
          },
        },
      });
    } else {
      setIsLoadingMap(false);
    }
  };

  const selectedServiceName = serviceList.find(
    service => service.id === selectedValue,
  );
  if (selectedServiceName && selectedServiceName.name !== selectedName) {
    setSelectedName(selectedServiceName.name);
  }

  const addMoreEducation = () => {
    setEducationList([...educationList, '']);
  };

  const removeMoreEducation = index => {
    const tmpListing = [...educationList];
    tmpListing.splice(index, 1);
    setEducationList(tmpListing);
  };

  const handle24by7 = checked => {
    if (!checked) {
      setSelectedCheckboxes(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    } else {
      setSelectedCheckboxes([]);
    }
    setAllDay(preState => !preState);
  };

  const handleCheckboxClick = (day, status) => {
    let timingArray = Object.assign([], selectedCheckboxes);
    if (!timingArray.includes(day)) {
      timingArray.push(day);
    } else {
      timingArray.splice(timingArray.indexOf(day), 1);
    }
    setSelectedCheckboxes(timingArray);

    if (allDay && selectedCheckboxes.length == 7) {
      setAllDay(preState => !preState);
    } else if (!allDay && status == false && selectedCheckboxes.length == 6) {
      setAllDay(preState => !preState);
    }
  };

  const handleEducationChange = (index, value) => {
    const updatedList = [...educationList];
    updatedList[index] = value;
    setEducationList(updatedList);
  };

  const handleLocationChange = (lat, long) => {
    setLocation({latitude: lat, longitude: long});
  };

  // added for new input expertise feild on add more
  const addMoreExpertise = () => {
    setExpertiseList([...expertiseList, '']);
  };

  const removeMoreExpertise = index => {
    const tmpListing = [...expertiseList];
    tmpListing.splice(index, 1);
    setExpertiseList(tmpListing);
  };

  const handleExpertiseChange = (index, value) => {
    const updatedList = [...expertiseList];
    updatedList[index] = value;
    setExpertiseList(updatedList);
  };

  const getMyWorkspaces = async () => {
    let workData = await api.getAllWorkspaces(userData.id);
    setWorkspaces(workData);
    setIsLoading(false);
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
        setNewImages(newImages);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const removeUploadedImage = async index => {
    const uploadsTmp = images.filter((item, i) => i !== index);
    setImages(uploadsTmp);
    setNewImages(uploadsTmp);
    try {
      await setData(`uploaded_images_${uploadsTmp}`, images);
      return true;
    } catch (error) {
      console.log(error);
      return false;
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
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Open Settings',
            onPress: () => Linking.openSettings(),
          },
        ],
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
      .then(image => {
        setSelectedImage({
          uri: image.path,
          type: image.mime,
          name: `${randomString(16)}.jpg`,
        });
        coverImageSheetRef?.current?.hide();
      })
      .catch(error => {
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
  //     setSelectedImage({ uri: image.path, type: image.mime, name: `cover-${randomString(16)}.jpg` });
  //     coverImageSheetRef?.current?.hide();
  //   }).catch(error => {
  //     console.log('ImagePicker Error: ', error);
  //   });
  // };

  const openGallery = () => {
    ImagePicker.openPicker({
      cropping: true,
    })
      .then(image => {
        setSelectedImage({
          uri: image.path,
          type: image.mime,
          name: `cover-${randomString(16)}.jpg`,
        });
        coverImageSheetRef?.current?.hide();
      })
      .catch(error => {
        console.log('ImagePicker Error: ', error);
        actionSheetRef?.current?.hide();
      });
  };

  const uploadImages = async workspaceId => {
    if ((newImages && newImages.length > 0) || selectedImage) {
      const formData = new FormData();
      newImages.forEach((image, index) => {
        formData.append('files', {
          uri: image.uri,
          type: image.type,
          name: image.name,
        });
      });

      if (selectedImage) {
        formData.append('coverImage', selectedImage);
      }

      try {
        await api.uploadWorkspaceImages(userData.id, workspaceId, formData);
        await setData(`uploaded_images_${workspaceId}`, newImages);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    } else {
      return false;
    }
  };

  const updateWorkSpace = async () => {
    setIsLoading(true);

    try {
      if (phone.length < 10) {
        Toaster({message: 'Phone number must be 10 digits'});
        return;
      } else if (pincode.length < 6) {
        Toaster({message: 'Pincode must be 6 digits'});
        return;
      } else if (designationName.length == 0) {
        Toaster({message: 'Please Fill Designation name'});
        return;
      } else if (workplaceName.length == 0) {
        Toaster({message: 'Please Fill workplace name'});
        return;
      } else if (address.length == 0) {
        Toaster({message: 'Please Fill address'});
        return;
      } else if (city.length == 0) {
        Toaster({message: 'Please Fill city'});
        return;
      } else if (state.length == 0) {
        Toaster({message: 'Please Fill state'});
        return;
      }

      let payload = {
        designationName: designationName,
        about: workspaceAbout,
        workplaceName: workplaceName,
        experience: experience,
        phone: phone,
        collaboratorId: userData.id,
        serviceId: defaultWorkspace.serviceId,
        address: address,
        // town: town,
        city: city,
        pincode: pincode,
        state: state,
        latitude: location.latitude,
        longitude: location.longitude,
        services: defaultWorkspace.services,
        workplaceTime: {
          days: selectedCheckboxes,
          start_time: moment(startTime).format('hh:mm A'),
          end_time: moment(endTime).format('hh:mm A'),
          lunch_break: {
            start_time: moment(breakStartTime).format('hh:mm A'),
            end_time: moment(breakEndTime).format('hh:mm A'),
          },
        },
      };

      if (selectedName === 'Veterinary') {
        payload.education = educationList;
        payload.expertise = expertiseList;
      }

      await api.updateWorkspaceChanges(
        userData.id,
        defaultWorkspace.id,
        payload,
      );
      getMyWorkspaces();
      Toaster({message: 'Workspace information updated!', duration: 'SHORT'});
      navigation.goBack();
    } catch (error) {
      console.log('An error occurred:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    init();
    registerSheet('select-location', LocationPicker);
  }, []);
  const handleManualLocationInput = text => {
    setManualLocationInput(text);
    setLocation(null);
  };
  useEffect(() => {
    const checkLocationPermission = async () => {
      const hasPermission = await requestLocationAccess();
      setHasLocationPermission(hasPermission);
    };
    checkLocationPermission();
  }, []);
  const renderLocationInput = () => {
    if (hasLocationPermission) {
      return (
        <SheetProvider>
          <Pressable onPress={Platform.OS == 'ios' ? null : selectLocation}>
            <TextInput
              style={[spacingProperty['mb-0']]}
              mode="outlined"
              label="Location"
              editable={false}
              // error={dirty && (location === null || location === '')}
              value={
                location !== null
                  ? `${location.latitude
                      .toString()
                      .substring(0, 12)}, ${location.longitude
                      .toString()
                      .substring(0, 12)}`
                  : null
              }
              placeholder="Select your location"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              onPressIn={Platform.OS == 'ios' ? selectLocation : null}
            />
          </Pressable>
        </SheetProvider>
      );
    } else {
      return (
        <TextInput
          style={[spacingProperty['mb-0']]}
          mode="outlined"
          label="Location"
          // error={dirty && !manualLocationInput}
          value={manualLocationInput}
          placeholder="Enter your location manually"
          placeholderTextColor={theme.colors.onSurfaceVariant}
          onChangeText={handleManualLocationInput}
        />
      );
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          colorScheme === 'dark'
            ? theme.colors.surface
            : theme.colors.surfaceVariant,
      }}>
      {isLoading == true ? <Loader visible={isLoading}></Loader> : null}
      <Header
        navigation={navigation}
        type="back"
        options={{title: 'Workspace Information', dark: true}}></Header>
      <ScrollView>
        <View style={{paddingHorizontal: 20}}>
          <View>
            <Text
              style={[
                styles.listViewText,
                spacingProperty['mt-15'],
                {color: theme.colors.onSurface},
              ]}>
              Basic Information
            </Text>
            <View style={[spacingProperty['mt-20'], {flexDirection: 'row'}]}>
              <Text
                style={[
                  styles.listViewText,
                  spacingProperty['mb-15'],
                  {color: theme.colors.onSurface},
                ]}>
                Service Type:
              </Text>
              <Text
                style={{
                  color: theme.colors.onSurface,
                  fontSize: 16,
                  marginLeft: 15,
                }}>
                {selectedName}
              </Text>
            </View>

            <TextInput
              mode="outlined"
              label="Designation*"
              style={[
                {
                  marginBottom: 15,
                  color: theme.colors.onSurfaceVariant,
                  borderColor: theme.colors.onSurfaceVariant,
                },
              ]}
              placeholder="Enter your designation"
              value={designationName}
              error={designationName === ''}
              onChangeText={onChangeDesignationName}
            />
            <TextInput
              style={[spacingProperty['mb-15']]}
              mode="outlined"
              label="Phone*"
              error={phone === '' || phone?.length < 10}
              placeholder="Enter Mobile Number"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              onChangeText={onChangeMobile}
              keyboardType="numeric"
              value={phone}
              maxLength={10}
              helperText={
                phone?.length < 10 ? 'Phone number must be 10 digits' : ''
              }
            />
            <View style={spacingProperty['mb-15']}>
              {selectedName == 'Veterinary' ? (
                <TextInput
                  mode="outlined"
                  label="Experience*"
                  error={experience === ''}
                  style={[
                    {
                      marginBottom: 15,
                      color: theme.colors.onSurfaceVariant,
                      borderColor: theme.colors.onSurfaceVariant,
                    },
                  ]}
                  placeholder="Enter your experience (Years)"
                  value={experience}
                  onChangeText={onChangeExperience}
                  maxLength={2}
                />
              ) : null}
            </View>
            {/* workspaceAbout
            onChangeText={setWorkspaceAbout} */}
            <View style={spacingProperty['mb-15']}>
              <TextInput
                mode="outlined"
                label="About"
                style={[
                  {
                    color: theme.colors.onSurfaceVariant,
                    borderColor: theme.colors.onSurfaceVariant,
                  },
                ]}
                placeholder="Write about yourself*"
                onChangeText={onAboutTextChange}
                value={workspaceAbout}
                multiline={true}
                numberOfLines={4}
                maxLength={1000}
              />
              <View style={{alignItems: 'flex-end'}}>
                <Text style={subHeading}>{characterCountText}</Text>
              </View>
              {remainingCharacters <= 0 &&
                Toaster({message: 'You have exceeded the character limit.'})}
            </View>

            {selectedName == 'Veterinary' ? (
              <View style={spacingProperty['mb-15']}>
                {educationList &&
                  educationList.map((education, index) => (
                    <View key={index} style={spacingProperty['mb-10']}>
                      <TextInput
                        mode="outlined"
                        label="Education"
                        error={education === ''}
                        style={[
                          {
                            color: theme.colors.onSurfaceVariant,
                            borderColor: theme.colors.onSurfaceVariant,
                          },
                        ]}
                        placeholder="Enter Education Completed*"
                        value={education}
                        onChangeText={text =>
                          handleEducationChange(index, text)
                        }
                      />
                      {index > 0 && (
                        <View style={{alignItems: 'flex-end'}}>
                          <TouchableOpacity
                            onPress={() => removeMoreEducation(index)}>
                            <Text
                              style={[styles.addMoreText, {color: colors.red}]}>
                              x Remove
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  ))}
                <View style={{alignItems: 'flex-end'}}>
                  <TouchableOpacity onPress={addMoreEducation}>
                    <Text style={styles.addMoreText}>+ Add More</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}

            {selectedName == 'Veterinary' ? (
              <View style={spacingProperty['mb-15']}>
                {expertiseList &&
                  expertiseList.map((expertise, index) => (
                    <View key={index} style={spacingProperty['mb-10']}>
                      <TextInput
                        mode="outlined"
                        label="Expertise"
                        error={expertise === ''}
                        style={[
                          {
                            color: theme.colors.onSurfaceVariant,
                            borderColor: theme.colors.onSurfaceVariant,
                          },
                        ]}
                        placeholder="Enter Area of Expertise*"
                        value={expertise}
                        onChangeText={text =>
                          handleExpertiseChange(index, text)
                        }
                      />
                      {index > 0 && (
                        <View style={{alignItems: 'flex-end'}}>
                          <TouchableOpacity
                            onPress={() => removeMoreExpertise(index)}>
                            <Text
                              style={[styles.addMoreText, {color: colors.red}]}>
                              x Remove
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  ))}
                <View style={{alignItems: 'flex-end'}}>
                  <TouchableOpacity onPress={addMoreExpertise}>
                    <Text style={styles.addMoreText}>+ Add More</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </View>
          <Text
            style={[
              styles.listViewText,
              spacingProperty['mb-20'],
              {color: theme.colors.onSurface},
            ]}>
            Workplace Details
          </Text>

          <TextInput
            mode="outlined"
            label="Name*"
            error={workplaceName === ''}
            style={[
              {
                marginBottom: 15,
                color: theme.colors.onSurfaceVariant,
                borderColor: theme.colors.onSurfaceVariant,
              },
            ]}
            placeholder="Enter workplace name"
            value={workplaceName}
            onChangeText={onChangeWorkplaceName}
          />
          <TextInput
            mode="outlined"
            label="Address*"
            error={address === ''}
            style={[
              {
                marginBottom: 15,
                color: theme.colors.onSurfaceVariant,
                borderColor: theme.colors.onSurfaceVariant,
              },
            ]}
            placeholder="Address (Office No. Building, Street Area)*"
            value={address}
            onChangeText={onChangeAddress}
          />
          {/* <TextInput
            mode='outlined'
            label='Area*'
            style={[{ marginBottom: 15, color: theme.colors.onSurfaceVariant, borderColor: theme.colors.onSurfaceVariant }]}
            placeholder="Enter Area"
            value={town}
            onChangeText={onChangeTown}
          /> */}

          <TextInput
            mode="outlined"
            label="City / District*"
            error={city === ''}
            style={[
              {
                marginBottom: 15,
                color: theme.colors.onSurfaceVariant,
                borderColor: theme.colors.onSurfaceVariant,
              },
            ]}
            placeholder="Enter city"
            value={city}
            onChangeText={onChangeCity}
          />
          <TextInput
            mode="outlined"
            label="Pincode*"
            error={pincode === '' || pincode?.length < 6}
            style={[
              {
                marginBottom: 15,
                color: theme.colors.onSurfaceVariant,
                borderColor: theme.colors.onSurfaceVariant,
              },
            ]}
            placeholder="Enter postal code"
            inputMode="numeric"
            value={`${pincode}`}
            onChangeText={onChangePincode}
            maxLength={6}
            helperText={pincode?.length < 6 ? 'Pincode must be 6 digits' : ''}
            onSelectionChange={({nativeEvent}) => {
              if (nativeEvent.selection.end - nativeEvent.selection.start > 0) {
                setTimeout(() => {
                  const currentText = pincode;
                  onChangePincode(currentText);
                }, 0);
              }
            }}
          />
          <TextInput
            mode="outlined"
            label="State*"
            error={state === ''}
            style={[
              {
                marginBottom: 15,
                color: theme.colors.onSurfaceVariant,
                borderColor: theme.colors.onSurfaceVariant,
              },
            ]}
            placeholder="Enter state"
            value={state}
            onChangeText={onChangeState}
          />
          <View style={spacingProperty['mb-0']}>{renderLocationInput()}</View>
          {/* <SheetProvider>
            <Pressable onPress={Platform.OS == 'ios' ? null : selectLocation}>
              <TextInput
                style={[spacingProperty['mt-15']]}
                mode="outlined"
                label="Location*"
                editable={false}
                // error={dirty && (location === null || location === '')}
                value={location !== null ? `${location?.latitude?.toString()?.substring(0, 12)}, ${location?.longitude?.toString()?.substring(0, 12)}` : null}
                placeholder="Select your location"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                onPressIn={Platform.OS == 'ios' ? selectLocation : null}
              />
            </Pressable>
          </SheetProvider> */}
          {/* <TouchableOpacity
            title="Open"
            onPress={() => actionSheetRef.current?.show()}
            style={[defaultInputContainer, {alignItems: 'flex-start', marginBottom: 20,borderColor:theme.colors.onSurfaceVariant}]}>
            <Text style={{color:theme.colors.onSurfaceVariant}}>
              {location && location !== null
                ? `${location.latitude}, ${location.longitude}`
                : 'Select a Location'}
            </Text>
          </TouchableOpacity> */}

          <View>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={[
                  styles.listViewText,
                  spacingProperty['mb-10'],
                  {marginTop: 5},
                  {color: theme.colors.onSurface},
                ]}>
                Working Days
              </Text>
              <View
                style={[
                  styles.checkboxRow,
                  {flexGrow: 1, justifyContent: 'flex-end'},
                ]}>
                <Switch
                  value={allDay}
                  onValueChange={() => handle24by7(allDay)}
                />
                <Text
                  style={[
                    styles.checkboxText,
                    {color: theme.colors.onSurface},
                  ]}>
                  All Days
                </Text>
              </View>
            </View>
            <View style={styles.container}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <View key={day} style={styles.checkboxRow}>
                  <Checkbox.Android
                    status={
                      selectedCheckboxes.includes(day) ? 'checked' : 'unchecked'
                    }
                    onPress={() =>
                      handleCheckboxClick(day, selectedCheckboxes.includes(day))
                    }
                    color={colors.primary}
                    style={{marginLeft: 0, paddingLeft: 0}}
                    label={day}
                  />
                  <Text
                    style={[
                      styles.checkboxText,
                      {color: theme.colors.onSurface},
                    ]}>
                    {day}
                  </Text>
                </View>
              ))}
            </View>

            <View style={[styles.container, {marginBottom: 15}]}>
              <Text
                style={[
                  styles.listViewText,
                  spacingProperty['mb-10'],
                  {marginTop: 5},
                  {color: theme.colors.onSurface},
                ]}>
                Start & End Time
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{flexGrow: 1}}>
                  <TouchableOpacity
                    title="Open"
                    onPress={() => setOpenStartTime(true)}
                    style={[
                      defaultInputContainer,
                      {
                        justifyContent: 'flex-start',
                        borderColor: theme.colors.onSurfaceVariant,
                      },
                    ]}>
                    <Text style={{color: theme.colors.onSurfaceVariant}}>
                      {startTime && startTime !== null
                        ? moment(startTime).format('hh:mm A')
                        : 'Select a start time'}
                    </Text>
                  </TouchableOpacity>
                  <DatePicker
                    modal
                    open={openStartTime}
                    date={startTime ? moment(startTime).toDate() : new Date()}
                    mode="time"
                    onConfirm={date => {
                      setOpenStartTime(false);
                      setStartTime(date);
                    }}
                    onCancel={() => {
                      setOpenStartTime(false);
                    }}
                  />
                </View>
                <View
                  style={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{fontWeight: 600, color: theme.colors.onSurface}}>
                    -
                  </Text>
                </View>
                <View style={{flexGrow: 1}}>
                  <TouchableOpacity
                    title="Open"
                    onPress={() => setOpenEndTime(true)}
                    style={[
                      defaultInputContainer,
                      {borderColor: theme.colors.onSurfaceVariant},
                    ]}>
                    <Text style={{color: theme.colors.onSurfaceVariant}}>
                      {endTime && endTime !== null
                        ? moment(endTime).format('hh:mm A')
                        : 'Select an end time'}
                    </Text>
                  </TouchableOpacity>
                  <DatePicker
                    modal
                    open={openEndTime}
                    date={endTime ? moment(endTime).toDate() : new Date()}
                    mode="time"
                    onConfirm={date => {
                      setOpenEndTime(false);
                      setEndTime(date);
                    }}
                    onCancel={() => {
                      setOpenEndTime(false);
                    }}
                  />
                </View>
              </View>
            </View>
            <View style={[styles.container, {marginBottom: 15}]}>
              <Text
                style={[
                  styles.listViewText,
                  spacingProperty['mb-10'],
                  {marginTop: 5},
                  {color: theme.colors.onSurface},
                ]}>
                Add Break Time (eg. lunch break)
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{flexGrow: 1}}>
                  <TouchableOpacity
                    title="Open"
                    onPress={() => setOpenBreakStartTime(true)}
                    style={[
                      defaultInputContainer,
                      {borderColor: theme.colors.onSurfaceVariant},
                    ]}>
                    <Text style={{color: theme.colors.onSurfaceVariant}}>
                      {breakStartTime && moment(breakStartTime).isValid()
                        ? moment(breakStartTime).format('hh:mm A')
                        : 'Select a start time'}
                    </Text>
                  </TouchableOpacity>
                  <DatePicker
                    modal
                    open={openBreakStartTime}
                    date={
                      moment(breakStartTime).isValid()
                        ? moment(breakStartTime).toDate()
                        : new Date()
                    }
                    mode="time"
                    onConfirm={date => {
                      setOpenBreakStartTime(false);
                      setBreakStartTime(date);
                    }}
                    onCancel={() => {
                      setOpenBreakStartTime(false);
                    }}
                  />
                </View>
                <View
                  style={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{fontWeight: 600, color: theme.colors.onSurface}}>
                    -
                  </Text>
                </View>
                <View style={{flexGrow: 1}}>
                  <TouchableOpacity
                    title="Open"
                    onPress={() => setOpenBreakEndTime(true)}
                    style={[
                      defaultInputContainer,
                      {borderColor: theme.colors.onSurfaceVariant},
                    ]}>
                    <Text style={{color: theme.colors.onSurfaceVariant}}>
                      {breakEndTime && moment(breakEndTime).isValid()
                        ? moment(breakEndTime).format('hh:mm A')
                        : 'Select an end time'}
                    </Text>
                  </TouchableOpacity>
                  <DatePicker
                    modal
                    open={openBreakEndTime}
                    date={
                      moment(breakEndTime).isValid()
                        ? moment(breakEndTime).toDate()
                        : new Date()
                    }
                    mode="time"
                    onConfirm={date => {
                      setOpenBreakEndTime(false);
                      setBreakEndTime(date);
                    }}
                    onCancel={() => {
                      setOpenBreakEndTime(false);
                    }}
                  />
                </View>
              </View>
            </View>
            <Text
              style={[
                styles.listViewText,
                spacingProperty['mb-10'],
                spacingProperty['mt-20'],
                {color: theme.colors.onSurface},
              ]}>
              Cover Image*
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: theme.colors.outline,
                fontStyle: 'italic',
                justifyContent: 'flex-start',
                alignSelf: 'flex-start',
              }}>
              To modify cover image, please contact support team.
            </Text>
            {/* <TouchableOpacity
              onPress={() => coverImageSheetRef.current?.show()}
              style={[styles.uploadButton, spacingProperty['mt-10']]}>
              <Text style={styles.uploadButtonText}>Choose File</Text>
            </TouchableOpacity> */}
            <View
              style={[
                styles.imagesBorder,
                {
                  marginTop: 10,
                  borderWidth:
                    defaultWorkspace && defaultWorkspace.coverImage ? 1 : 0,
                  borderColor: theme.colors.onSurfaceVariant,
                },
              ]}>
              <List.Item
                key="uploaded-workspace-cover-image"
                title={'Cover Image'}
                style={{
                  paddingRight: 0,
                  paddingVertical: 5,
                  borderTopWidth: 0,
                  borderColor: '#e8e8e8',
                }}
                contentStyle={{marginBottom: 10}}
                left={props => {
                  // Determine if coverImage is a URL string or an object with a uri property
                  let imageUri;
                  if (typeof defaultWorkspace?.coverImage === 'string') {
                    imageUri = defaultWorkspace.coverImage;
                  } else if (defaultWorkspace?.coverImage?.uri) {
                    imageUri = defaultWorkspace.coverImage.uri;
                  }

                  if (imageUri) {
                    return <Avatar.Image size={54} source={{uri: imageUri}} />;
                  }
                  return null; // Ensure null is returned if no image is found
                }}
              />
            </View>

            <Text
              style={[
                styles.listViewText,
                spacingProperty['mb-10'],
                spacingProperty['mt-20'],
                {color: theme.colors.onSurface},
              ]}>
              Workplace Images*
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: theme.colors.outline,
                fontStyle: 'italic',
                justifyContent: 'flex-start',
                alignSelf: 'flex-start',
              }}>
              To modify image(s), please contact support team.
            </Text>
            {/* <TouchableOpacity
              onPress={selectImages}
              style={[styles.uploadButton, spacingProperty['mt-10']]}>
              <Text style={styles.uploadButtonText}>Choose File(s)</Text>
            </TouchableOpacity> */}
            <View
              style={[
                styles.imagesBorder,
                {
                  marginTop: 10,
                  borderWidth: images && images.length > 0 ? 1 : 0,
                  borderColor: theme.colors.onSurfaceVariant,
                },
              ]}>
              {Array.isArray(images) && images.length > 0
                ? images.map((image, index) => (
                    <List.Item
                      key={`uploaded-workspace-image-${index}`}
                      title={`Image ${index + 1}`}
                      style={{
                        paddingRight: 0,
                        paddingVertical: 5,
                        borderTopWidth: index > 0 ? 1 : 0,
                        borderColor: '#E8E8E8',
                      }}
                      contentStyle={{marginBottom: 10}}
                      left={props =>
                        image?.uri ||
                        (defaultWorkspace?.uploadImages ? image.uri : null) ? (
                          <Avatar.Image
                            size={54}
                            source={{
                              uri:
                                image?.uri ||
                                (defaultWorkspace?.uploadImages
                                  ? image.uri
                                  : null),
                            }}
                          />
                        ) : null
                      }
                    />
                  ))
                : null}
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={spacingProperty['m-20']}>
        <Button
          mode="elevated"
          disabled={
            defaultWorkspace.locked ||
            isLoading ||
            defaultWorkspace.status == 'PENDING'
          }
          loading={isLoading}
          style={[btn, {flexGrow: 1}]}
          buttonColor={isLoading ? theme.colors.surfaceVariant : colors.primary}
          textColor={colors.white}
          onPress={() => updateWorkSpace()}>
          Save Changes
        </Button>
      </View>
      <LocationPicker
        actionSheetRef={actionSheetRef}
        id="edit-profile-location"
        onChange={handleLocationChange}></LocationPicker>
      <CameraGallery
        actionSheetRef={coverImageSheetRef}
        id="settings-edit-profile"
        options={{
          gallery: true,
          camera: true,
          galleryCallback: openGallery,
          cameraCallback: openCamera,
        }}></CameraGallery>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    borderRadius: 5,
    borderColor: '#B3B3B3',
    padding: 10,
  },
  listViewText: {
    fontSize: 16,
    fontWeight: 500,
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
    // color: '#000000',
    borderWidth: 1,
    // borderColor: '#B3B3B3',
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
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: 600,
  },
});

export default WorkspaceInformation;
