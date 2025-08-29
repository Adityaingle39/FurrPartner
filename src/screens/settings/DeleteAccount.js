import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
  ImageBackground,
  useColorScheme,

} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { Button, List, useTheme,IconButton } from 'react-native-paper';
import { ArrowLeft } from 'iconsax-react-native';
import Iiicon from 'react-native-vector-icons/AntDesign';
import remoteConfig from '@react-native-firebase/remote-config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/common/Header';
import Dropdown from '../../components/common/Dropdown';
import { colors } from '../../utils/styles/gobalstyle';
import { useAuthState } from '../../services/auth';
import Toaster from '../../components/common/Toaster';
import Apis from '../../utils/apis';
import { useWorspaceState } from '../../services/workspace';
import { logout } from '../../utils/helpers';

const DeleteAccount = ({ navigation }) => {
  const api = new Apis();
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const { width, height } = Dimensions.get('window');

  const { userData } = useAuthState();
  const { defaultWorkspace } = useWorspaceState();

  const [isLoading, setIsLoading] = useState(true);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account?',
      `Are you sure you want to delete your account?\n\nThis action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => { deleteWorkspace(); },
        },
      ],
      { cancelable: true }
    );
  };

  const deleteWorkspace = async () => {
    try {
      const response = await api.deleteUser(userData.id);
      if (response.status === 500) {
        Alert.alert('An error occurred while deleting the workspace.');
      } else {
        Toaster({ message: 'Account Deleted Successfully!' });
        logout(navigation, 'delete');
        console.log(response);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('An error occurred while deleting the workspace.');
    }
  };

  return (
    <ImageBackground source={require("../../assets/Deleteacc.png")} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* <Header navigation={navigation} type='back' options={{ title: 'Delete Account', light: true }}></Header> */}
        <View style={{flexDirection:'row',alignItems: 'center', justifyContent: 'space-between',marginTop:20}}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
           <ArrowLeft size={25} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <Text style={{fontSize:19,color:'white' }}>Delete Account</Text>
          <Text>               </Text>
        </View>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ flexGrow: 1, paddingTop: 40 }}>
            <View style={{ paddingHorizontal: 20 }}>
              <Text style={{ fontSize: 35, fontWeight: '600', color: colors.white }}>Are you sure?</Text>
              <Text style={{ fontSize: 30, fontWeight: '600', color: colors.white, fontStyle: 'italic' }}>You want to delete your account?</Text>
            </View>
            <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
              <Text style={{ fontSize: 18, fontWeight: '500', color: colors.white }}><Icon size={25} name='alert-circle-outline' /> Note</Text>
              <Text style={{ fontSize: 16, fontWeight: '400', fontStyle: 'italic', color: colors.white, marginTop: 5 }}>You won’t be able to recover your account once deleted.</Text>
            </View>
          </View>
        </ScrollView>
        <View style={{ marginBottom: 40 }}>
          <View style={{ paddingHorizontal: 20, alignSelf: 'flex-start', marginTop: 40, marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', fontStyle: 'italic', color: colors.white }}>Kindly contact us for further queries.</Text>
            </View>
            <View style={{ width: width, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button mode='elevated' buttonColor={colors.white} textColor={colors.black} onPress={() => navigation.navigate('HelpCenters')}>HELP CENTER</Button>
              <Button mode='text' textColor={colors.white} onPress={handleDeleteAccount}>Delete Account</Button>
            </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    // borderColor: '#DADADA',
    borderRadius: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#F7F8F9',
    marginVertical: 10,
  },
  inputContainerquery: {
    width: '100%',
    height: 100,
    borderWidth: 1,
    // borderColor: '#DADADA',
    borderRadius: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#F7F8F9',
    marginVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    // color: '#F7F8F9',
    // color: '#000000',
  },
  UserInfoLabel: { fontWeight: 400, fontSize: 18 },
});

export default DeleteAccount;
