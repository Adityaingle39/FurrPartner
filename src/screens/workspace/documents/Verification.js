import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  Alert
} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import Icons from 'react-native-vector-icons/Feather';
import {Button} from 'react-native-paper';
import {useIsFocused, useRoute, useTheme} from '@react-navigation/native';
import Header from '../../../components/common/Header';
import Toaster from '../../../components/common/Toaster';
import Stepper from '../../../components/common/Stepper';
import {spacingProperty, btn, flexDirectionRow, alignItemsCenter, colors, heading, subHeading } from '../../../utils/styles/gobalstyle';
import RNExitApp from 'react-native-exit-app';
const Verification = ({ navigation }) => {
  const theme = useTheme();
  const route = useRoute();
  const [workspaceType] = useState(route.params.selectedName);
  console.log(workspaceType);
  const [uploaded, setUploaded] = useState([]);
  const [documents, setDocuments] = useState([
    { id: 'doc-aadhar', title: 'Aadhar Card', component: 'AadharCard', iconRight: 'chevron-right' },
    { id: 'doc-pan', title: 'PAN Card', component: 'PanCard', iconRight: 'chevron-right' },
    { id: 'doc-Gst', title: 'Gst', component: 'GstVerification', iconRight: 'chevron-right' },
    { id: 'doc-license', title: 'Doctor’s License', component: 'DoctorsLicense', iconRight: 'chevron-right' },
    { id: 'doc-education-cert', title: 'Education Certificate', component: 'EducationCertificates', iconRight: 'chevron-right' },
    { id: 'doc-bank', title: 'Bank Details', component: 'BankDetails', iconRight: 'chevron-right' },
  ]);
  useEffect(() => {
    // Filter out the "Doctor’s License" document if workspaceType is 'Groomers'
    if (workspaceType === 'Groomers') {
      setDocuments(documents.filter(doc => doc.id !== 'doc-license'));
    }
  }, [workspaceType]);
  const navigateButton = () => {
    if (uploaded && uploaded.length > 0 && uploaded.includes('doc-aadhar') && uploaded.includes('doc-pan')) {
      navigation.navigate('LoadingSetting')
    } else {
      Toaster({ message: `Aadhar & PAN card documents required!` });
    }
  }
  const navigateDocument = (document) => {
    if (document.iconRight == 'chevron-right') {
      navigation.navigate(document.component, { docs: uploaded })
    } else {
      Toaster({ message: `${document.title} already uploaded!` });
    }
  }
  const isFocused = useIsFocused();
  useEffect(() => {
    const backAction = () => {
      if (isFocused) {
        Alert.alert('Hold On!', 'Are you sure you want to exit?', [
          {
            text: 'CANCEL',
            onPress: () => 'Null',
          },
          {text: 'Yes', onPress: () => RNExitApp.exitApp()},
        ]);
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [isFocused]);
  useEffect(() => {
    if (route && 'params' in route && route.params && 'uploaded' in route.params && route.params.uploaded !== '') {
      setUploaded(route.params.uploaded);
      const updatedDocuments = documents.map(i => { i.iconRight = route.params.uploaded.includes(i.id) ? 'check-circle' : 'chevron-right'; return i; });
      setDocuments(updatedDocuments);
    }
  }, [route]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header navigation={navigation} type='back' options={{ title: 'Create Workspace' }}></Header>
      <ScrollView>
        <View style={{ marginHorizontal: 20 }}>
          {/* <Stepper steps={3} active={3}></Stepper> */}
          <View style={{ marginVertical: 20, marginLeft: 20 }}>
            <Text style={[styles.titleText, { color: theme.colors.onSurface }]}>KYC Documents</Text>
            <Text style={[styles.subHeadingText, { color: theme.colors.onSurface }]}>Upload Documents to Continue</Text>
            <View>
              {documents.map((document, index) => (
                <View key={`documents-list-item-${index}-${document.id}`} style={{ marginTop: 25 }}>
                  <TouchableOpacity
                    onPress={() => navigateDocument(document)}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      borderBottomWidth: 1,
                      borderBottomColor: '#DADADA',
                      paddingBottom: 15,
                    }}>
                    <Text
                      style={{ fontSize: 18, marginRight: 100, color: theme.colors.onSurface }}>
                      {document.title}
                    </Text>
                    <Icons
                      color={theme.colors.onSurface}
                      name={document.iconRight}
                      size={20}
                      style={{ marginRight: 15 }}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={[spacingProperty['m-20']]}>
        <Button style={[btn, {flexGrow: 1, width: '100%'}]} textColor={colors.white} buttonColor={colors.primary} icon="file-document-multiple-outline" mode="contained" onPress={navigateButton}>Next</Button>
        <Button style={{marginTop: 10}} icon="debug-step-over" onPress={() => navigation.navigate('LoadingSetting')}>Skip</Button>
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  titleText: {
    fontSize: 22,
    fontWeight: 600,
    marginTop: 20,
    color: '#0F172A',
  },
  subHeadingText: {
    fontSize: 15,
    color: '#898A8D',
  }
});
export default Verification