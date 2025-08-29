import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
  Linking
} from 'react-native';
import moment from 'moment';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, { useState, useRef } from 'react';
import { Avatar, Card, List, IconButton, Button as ButtonPaper } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import IconF from 'react-native-vector-icons/FontAwesome5'
import IconA from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';

import Apis from '../../utils/apis';
import Button from '../../components/common/Button';
import Empty from '../../components/common/Empty';
import IconCustom from '../../components/common/IconCustom';
import Toaster from '../../components/common/Toaster';
import Loader from '../../components/common/Loader';
import Header from '../../components/common/Header';
import VideoGallery from '../../components/common/VideoGallery';
import { useAuthState } from '../../services/auth';
import { useWorspaceState } from '../../services/workspace';
import { useAppointmentState } from '../../services/appointments';
import { randomString } from '../../utils/helpers';
import {
  container,
  spacingProperty,
  colors,
  heading,
  flexDirectionRow,
  alignItemsCenter,
  pageHeading,
} from '../../utils/styles/gobalstyle';

const ListDetails = ({ navigation, route }) => {
  const api = new Apis();
  const actionSheetRef = useRef(null);
  const theme = useTheme();
  const { userData } = useAuthState();
  const { appointments, setAppointments } = useAppointmentState();
  const { defaultWorkspace } = useWorspaceState();

  const [uploads, setUploads] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prescription, setPrescription] = useState(null);

  const appointment = appointments.find(o => o.id == route.params.id);

  if (!appointment == null || appointment == undefined || Object.keys(appointment).length == 0) {
    return (
      <SafeAreaView style={container}>
        <Header navigation={navigation} type='back' options={{ title: 'Appointment Details', dark: true }}></Header>
        <Empty title="" subtitle="No details found for the respective appointment." />
      </SafeAreaView>
    );
  }

  const lightColor = appointment.status == 'Active' ? colors.lightGreen : (appointment.status == 'Complete' ? colors.lightBlue : colors.lightRed);
  const darkColor = appointment.status == 'Active' ? colors.green : (appointment.status == 'Complete' ? colors.blue : colors.red);
  const txtColor = '#000000';
  const appointmentTime = moment.utc(appointment.appointmentTime, 'DD-MMM-YYYY HH:mm:ss Z').local();
  let appDiffMinutes = appointmentTime.diff(moment.utc().local(), 'minutes');
  console.log(appointmentTime, moment.utc(), appDiffMinutes)

  const removeUploadedImage = (index) => {
    const uploadsTmp = uploads.filter((item, i) => i !== index);
    setUploads(uploadsTmp);
  }

  const openCamera = () => {
    ImagePicker.openCamera({
      cropping: true,
      writeTempFile: true
    }).then(image => {
      if (image) {
        const imageObject = {
          uri: image.path,
          type: image.mime,
          name: `${randomString(16)}.jpg`,
        };
        setUploads(preVal => { return preVal == null ? [imageObject] : [...preVal, imageObject]; });
        actionSheetRef.current?.hide();
      }
    }).catch(error => {
      console.log('ImagePicker Error:', error);
      actionSheetRef.current?.hide();
    });
  };

  const openGallery = () => {
    ImagePicker.openPicker({
      mediaType: 'image',
    }).then(image => {
      const imageObject = {
        uri: image.path,
        type: image.mime,
        name: `${randomString(16)}.jpg`,
      };
      setUploads(preVal => preVal == null ? [imageObject] : [...preVal, imageObject]);
      actionSheetRef.current?.hide();
    }).catch(error => {
      console.log('ImagePicker Error:', error);
      actionSheetRef.current?.hide();
    });
  };

  const updatePrescription = () => {
    try {
      if (prescription == null) {
        Toaster({ message: "Please add prescription details." });
      } else {
        const formData = new FormData();
        if ((uploads && uploads.length === 0) || uploads === null) {
          Toaster({ message: "No documents or videos uploaded." });
          formData.append('files', []);
        } else if (uploads !== null) {
          uploads.forEach(image => {
            formData.append('files', image);
          });
        }
        setIsLoading(true);
        api.updateAppointmentPrescriptions(appointment.id, appointment.petId, prescription, formData)
          .then(res => {
            Toaster({ message: "Prescription details updated!" });
            updateStatus('Completed');
          })
          .catch(err => {
            console.log(err);
            setIsLoading(false);
          });
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false);
    }
  };


  const updateStatus = (status) => {
    try {
      setIsLoading(true);
      api.updateWorkspaceAppointment(userData.id, defaultWorkspace.id, appointment.id, status)
        .then(res => {
          setIsLoading(false);
          if (status === "Complete") {
            Toaster({ message: "Appointment completed successfully!" });
            const tmpAppointments = appointments.filter(i => i.id !== appointment.id);
            setAppointments(tmpAppointments);
          }
          if (status === "Cancelled") {
            Toaster({ message: "Ah! Appointment has been cancelled." });
          }
          navigation.navigate('HomeListView');
        })
        .catch(err => {
          throw err
        });
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  };


  let footer = null;
  /** Footer Content when Active */
  // console.log(appointment.status, appDiffMinutes);

  footer = (
    <View style={[{ alignItems: 'center' }, spacingProperty['mt-20']]}>
      {/** Join Meeting Help Text */}
      {appointment.status == 'Active' && <Text style={{ fontSize: 12, marginBottom: 10 }}>* Kindly join the meeting link before 5 minutes of scheduled time</Text>}
      {/** Cancel Help Text */}
      {appDiffMinutes >= 15 && <Text style={{ fontSize: 12, marginBottom: 10 }}>** Refund on cancel will be credited back to user account in 4-5 working days</Text>}
      {/** Join Meeting Button */}
      {(appointment.status === 'Active' && appointment.type.toLowerCase() === 'online') && ( <ButtonPaper disabled={appDiffMinutes <= 5 && appDiffMinutes >= -30 ? false : true} mode="contained-tonal" buttonColor={colors.blue} textColor={colors.white} onPress={() => navigation.navigate('VideoCall', { appointmentId: appointment.id })} style={{ marginVertical: 5, width: '70%' }}> Join Meeting </ButtonPaper>)}
      {/** Complete Button */}
      {/* disabled={(appDiffMinutes <= 5 && appDiffMinutes >= -30) ? false : true} */}
      {(appDiffMinutes <= -5 && appointment.status == 'Active') && <ButtonPaper mode="contained-tonal" buttonColor={colors.green} textColor={colors.white} onPress={() => updateStatus('Complete')} style={{ marginVertical: 5, width: '50%' }}>Complete</ButtonPaper>}
      {/** Cancel Button */}
      {appDiffMinutes >= -30 && <ButtonPaper mode="text" textColor={colors.red} backgroundColor={colors.red} onPress={() => updateStatus('Cancelled')} style={{ marginVertical: 5 }}>Cancel Appointment</ButtonPaper>}
    </View>
  );
  /** Footer Content when Active */

  /** Footer Content when Complete */
  if (appointment.status == "Complete") {
    footer = (
      <View>
        <View style={{ marginBottom: 20 }}>
          <View style={{ marginBottom: 10, justifyContent: 'center' }}>
            <Text style={[styles.uploadHeadingText,{color:theme.colors.onSurface}]}>Upload Image/Videos</Text>
            <ButtonPaper icon="camera" mode="contained" buttonColor={colors.lightGrey} style={{ width: '35%' }} onPress={() => actionSheetRef.current?.show()}>
              Upload
            </ButtonPaper>
          </View>
          <View style={[styles.uploadDes, { borderWidth: uploads && uploads.length > 0 ? 1 : 0 }]}>
            {uploads && uploads.length > 0 ? uploads.map((image, index) => (<List.Item
              key={`uploaded-appointment-active-image-${index}`}
              title={image.name}
              style={{ paddingRight: 0, borderTopWidth: index > 0 ? 1 : 0, borderColor: '#e8e8e8' }}
              left={props => <Avatar.Image size={54} source={{ uri: image.uri }} />}
              right={props => <IconButton icon="close" style={{ marginRight: 0 }} onPress={() => removeUploadedImage(index)} />}
            ></List.Item>)) : null}
          </View>
        </View>
        <View>
          <Text style={[styles.prescriptionText,{color:theme.colors.onSurface}]}>Prescription</Text>
          <View style={[styles.prescriptionContent,{borderColor:theme.colors.onSurface}]}>
            <TextInput placeholderTextColor={theme.colors.onSurface} placeholder='Please enter prescription here...' style={{color:theme.colors.onSurface}} inputMode="text" multiline={true} onChangeText={setPrescription}></TextInput>
            {/* <Text style={{ color: '#000000' }}>lorem Ipsum hjbvvy cksrjnce cernuiuvew corjjhjhjh ashbfvajhbdfv aisnivuht eufbvi</Text> */}
          </View>
        </View>
        <View style={{ paddingVertical: 20 }}>
          <Button title="Submit" onPress={() => updatePrescription()}></Button>
        </View>
        <VideoGallery
          actionSheetRef={actionSheetRef}
          id="settings-edit-profile"
          options={{
            gallery: true,
            camera: true,
            galleryCallback: openGallery,
            cameraCallback: openCamera,
          }}></VideoGallery>
      </View>
    );
  }
  /** Footer Content when Complete */

  /** Footer Content when Completed */
  if (appointment.status == "Completed") {
    footer = (
      <View>
        <View>
          <Text style={styles.uploadHeadingText}>Upload Image/Videos</Text>
          <View style={styles.uploadDes}>
            <View style={{ flexDirection: 'row', }}>
              <IconF name='photo-video' size={20}></IconF>
              <Text style={styles.uploadName}>imgName</Text>
            </View>
            <View>
              <IconA name='close' size={20}></IconA>
            </View>
          </View>
        </View>
        <View>
          <Text style={styles.prescriptionText}>Prescription</Text>
          <View style={styles.prescriptionContent}>
            <Text style={{ color: '#000000' }}>lorem Ipsum hjbvvy cksrjnce cernuiuvew corjjhjhjh ashbfvajhbdfv aisnivuht eufbvi</Text>
          </View>
        </View>
      </View>
    );
  }
  /** Footer Content when Completed */

  if (appointment.status == "Cancelled") {
    footer = (
      <View></View>
    );
  }

  const LeftContent = props => <Avatar.Icon {...props} icon="paw" />
  function goToYosemite() {
    const latitude = appointment.latitude;
    const longitude = appointment.longitude;
  
    if (latitude && longitude) {
      const url = `https://maps.apple.com/?q=${latitude},${longitude}&z=14&t=m`;
      Linking.openURL(url);
    } else {
      console.log('Missing latitude and longitude values for the appointment.');
    }
  }
  return (
    <SafeAreaView style={container}>
      <Header navigation={navigation} type='back' options={{ title: appointment.type, dark: true }}></Header>
      {isLoading == true ? <Loader visible={isLoading}></Loader> : null}
      <ScrollView style={{ padding: 20, marginTop: 0, paddingTop: 0 }}>
        <View>
          <Card>
            <Card.Cover source={{ uri: appointment.petImageUrl }} />
            <Card.Title title={appointment.petName} subtitle={appointment.breed} left={LeftContent} />
            <Card.Content>
              <List.Item
                title={appointment.status}
                left={props => <List.Icon {...props} icon="list-status" />}
              />
              <List.Item
                title={moment.utc(appointment.appointmentTime, 'DD-MMM-YYYY HH:mm:ss Z').local().format('Do MMM, YYYY')}
                description={moment.utc(appointment.appointmentTime, 'DD-MMM-YYYY HH:mm:ss Z').local().format('dddd - hh:mm A')}
                left={props => <List.Icon {...props} icon="clock-outline" />}
              />
              <List.Item
                title={appointment.subType}
                left={props => <List.Icon {...props} icon="cart" />}
              />
              <List.Item
                title={appointment && 'paymentAmount' in appointment ? appointment.paymentAmount : '0.00'}
                left={props => <List.Icon {...props} icon="currency-inr" />}
              />
              {appointment.address && (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 600, color: theme.colors.onSurface, fontSize: 15 }}>{appointment.address}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    {/* onPress={goToYosemite} */}
                    <Pressable onPress={goToYosemite}  >
                      <Image
                        source={require('../../assets/ServiceMap.png')}
                        resizeMode="contain"
                        style={{ width: '100%', height: 80 }}
                      />
                    </Pressable>
                  </View>
                </View>
              )}
            </Card.Content>

            {/* <Card.Actions>
              <ButtonPaper>Cancel</ButtonPaper>
              <ButtonPaper>Ok</ButtonPaper>
            </Card.Actions> */}
          </Card>

          {/* <Text>{appDiffMinutes} - {appointment.status}</Text> */}
            <View>
              {footer}
            </View>   

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    fontWeight: 600,
    marginVertical: 20,
    color: '#000000',
  },
  onlineList: {
    fontSize: 15,
    fontWeight: 400,
    marginLeft: 35,
  },
  hr: {
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 1,
  },
  uploadHeadingText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 600,
    marginTop: 20,
    marginBottom: 10,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 45,
    width: "35%",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#B3B3B3',
    backgroundColor: '#B3B3B3',
    paddingHorizontal: 10
  },
  uploadButtonText: {
    color: "#FFFFFF",
    fontWeight: 500
  },
  uploadDes: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e8e8e8'
  },
  uploadName: {
    marginLeft: 20
  },
  prescriptionContent: {
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  prescriptionText: {
    fontSize: 16,
    fontWeight: 600,
    color: '#000000',
    marginBottom: 20
  },
  cancelButton: {
    color: '#EC5E59',
    fontWeight: 500,
    borderStyle: "dashed",
    borderBottomWidth: 2,
    borderBottomColor: '#EC5E59',
    marginTop: 10
  },



});
export default ListDetails;
