import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  Platform,
  useColorScheme,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TextInput, Button, List, useTheme} from 'react-native-paper';
import Iiicon from 'react-native-vector-icons/Feather';
import remoteConfig from '@react-native-firebase/remote-config';

import Header from '../../components/common/Header';
import Dropdown from '../../components/common/Dropdown';
import { colors } from '../../utils/styles/gobalstyle';
import { useAuthState } from '../../services/auth';
import Toaster from '../../components/common/Toaster';

const HelpCenters = ({navigation}) => {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const bgColor = colorScheme === 'dark' ? theme.colors.surface : theme.colors.surfaceVariant;
  const options = [
    {id: 1, title: 'Option 1'},
    {id: 2, title: 'Option 2'},
    {id: 3, title: 'Option 3'},
    {id: 4, title: 'Option 4'},
  ];

  const {userData} = useAuthState();

  const [queryText, setQueryText] = useState('');
  const [helpCenterEmail, setHelpCenterEmail] = useState('');
  const [helpCenterPhone, setHelpCenterPhone] = useState('');

  const handleWhatsAppPress = () => {
    const phoneNumber = helpCenterPhone.replace('+', '');
    const query = encodeURIComponent(queryText);
  
    if (phoneNumber && queryText) {
      const url = `https://wa.me/${phoneNumber}?text=${query}`;
      Linking.openURL(url);
    } else {
      Toaster({ message: 'Please enter a query before WhatsApp.' });
    }
  };
  
  const handleEmailPress = () => {
    const emailAddress = helpCenterEmail;
    const subject = 'Help Query';
    const body = encodeURIComponent(queryText);
  
    if (emailAddress && queryText) {
      if (Platform.OS === 'ios') {
        Linking.openURL(`mailto:${emailAddress}?subject=${subject}&body=${body}`);
      } else if (Platform.OS === 'android') {
        Linking.openURL(`mailto:${emailAddress}?subject=${subject}&body=${body}`);
      } else {
        console.log('Email is not supported on this platform.');
      }
    } else {
        Toaster({ message: 'Please enter a query before Email.' });
    }
  };

  const configVals = async() => {
    const email = await remoteConfig().getValue('helpCenterEmail');
    const phone = await remoteConfig().getValue('helpCenterPhone');
    setHelpCenterEmail(email.asString());
    setHelpCenterPhone(phone.asString());
  }

  useEffect(() => {
    configVals();
  }, []);
  
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: bgColor}}>
       <Header navigation={navigation} type='back' options={{title: 'Help Center', dark:true}}></Header>
      <ScrollView style={{paddingHorizontal: 30, marginTop: 30}}>
        <View>
          <Text style={{fontSize: 15, color: theme.colors.onSurface}}>Find answers to your question and get assistance from our dedicated support team</Text>
        </View>
        <View style={{marginTop: 15}}>
          <TextInput
            label='Name'
            mode='outlined'
            value={userData.collaboratorName}
            editable={false}
            placeholderTextColor="#8391A1"
          />
        </View>
        <View style={{marginTop: 15}}>
          <TextInput
            label='Phone'
            mode='outlined'
            value={userData.mobile}
            editable={false}
            placeholderTextColor="#8391A1"
          />
        </View>
        <View style={{marginTop: 15}}>
          <TextInput
            label='Query'
            mode='outlined'
            placeholder="Enter your query or submit your feedback"
            placeholderTextColor="#8391A1"
            multiline={true}
            numberOfLines={5}
            onChangeText={setQueryText}
          />
        </View>
      </ScrollView>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 40}}>
        <Button mode='elevated' icon={() => <Iiicon name="mail" size={20} color={'#ffffff'} />}buttonColor={colors.primary} textColor={colors.white} onPress={handleEmailPress}>Email</Button>
        <Button mode='elevated' icon={() => <Iiicon name="phone-call" size={20} color={'#ffffff'} />} buttonColor={colors.green} textColor={colors.white} onPress={handleWhatsAppPress}>WhatsApp</Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  inputContainerquery: {
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  UserInfoLabel: {fontWeight: 400, fontSize: 18},
});

export default HelpCenters;
