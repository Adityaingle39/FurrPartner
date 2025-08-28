import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  TextInput
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Divider, Checkbox, useTheme } from 'react-native-paper';
import Dropdown from '../../components/common/Dropdown';
import { container, spacingProperty, alignItemsCenter, heading, colors, flexDirectionRow, justifyContentCenter, } from '../../utils/styles/gobalstyle';
import Apis from '../../utils/apis.js';
import bankNames from '../../assets/banknames.json';
import { Button } from 'react-native-paper';
import Loader from '../../components/common/Loader';
import Toaster from '../../components/common/Toaster';
import Header from '../../components/common/Header';
import { useAuthState } from '../../services/auth';
import { useBankState } from '../../services/banks';
import { useWorspaceState } from '../../services/workspace';

const BankInformation = ({ navigation }) => {
  const api = new Apis();
  const theme = useTheme();

  const { userData } = useAuthState();
  const { banks, setBanks } = useBankState();
  const { defaultWorkspace } = useWorspaceState();
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [bankNumber, setBankNumber] = useState('');
  const [confirmBankNumber, setConfirmBankNumber] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [panNo, setPanNo] = useState('');
  const [gstNo, setGstNo] = useState('');
  const [isArgee, setIsAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // const allBankList = [];
  // bankNames.map(bank => { allBankList.push(<Picker.Item key={bank.id} label={bank.name} value={bank.name}></Picker.Item>); })
  const panRegex = /^[A-Z]{5}\d{4}[A-Z]{1}$/;
  const validatePan = (pan) => {

  };
  const validateAccountNumber = (number) => {
    if (!/^\d+$/.test(number)) {
      Toaster({ message: 'Account Number must only contain digits.' });
      return false;
    }
    return true;
  };
  const validateIFSCCode = (code) => {
    if (!/^[A-Za-z]{4}\d{7}$/.test(code)) {
      Toaster({ message: 'Invalid IFSC code format. Please enter a valid IFSC code.' });
      return false;
    }
    return true;
  };
  const validateGSTNumber = (gst) => {
    // Modify this regex as per your GST number validation requirements
    const gstRegex = /^(\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Za-z]{1}Z[0-9A-Za-z]{1})$/;
    if (!gstRegex.test(gst)) {
      Toaster({ message: 'Invalid GST Number. Please enter a valid GST number.' });
      return false;
    }
    return true;
  };
  const validateAccountName = (name) => {
    const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (specialChars.test(name)) {
      Toaster({ message: 'Account Name must not contain special characters.' });
      return false;
    }
    return true;
  };

  const getWorkspaceBankDetails = async () => {
    try {
      let tmpBankData = Object.assign({}, banks);
      if (banks && banks.workspaceId == null) {
        setIsLoading(true);
        let bankData = await api.getBankDetails(userData.id, defaultWorkspace.id);
        console.log(bankData);
        if (bankData && !("error" in bankData)) {
          tmpBankData = Object.assign(banks, bankData);
          setBanks(tmpBankData);

          setBankName(tmpBankData.name);
          setAccountName(userData.collaboratorName);
          setBankNumber(tmpBankData.accountNumber);
          setBankIfsc(tmpBankData.ifsc);
          setPanNo(tmpBankData.pan);
          setIsFirstTime(!banks || banks.workspaceId === null);
          if (tmpBankData && 'gst' in tmpBankData) {
            setGstNo(tmpBankData.gst);
          }
        } else {
          throw bankData;
        }
        // setIsLoading(false);
      }
    } catch (error) {
      console.error('Error in getWorkspaceBankDetails:', error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleSaveChanges = () => {
    try {
      if (accountName === '') {
        Toaster({ message: `Account Name is required.` });
      } else if (!validateAccountName(accountName)) {
         Toaster({ message: 'Invalid Account Name. Please enter a valid Name.' });
      } else if (bankNumber === '') {
        Toaster({ message: `Account Number is required.` });
      } else if (isFirstTime && bankNumber !== confirmBankNumber) {
        Toaster({ message: `Account Number & Confirm Number don't match.` });
      } else if (bankIfsc === '') {
        Toaster({ message: `Bank IFSC is required.` });
      } else if (panNo === '') {
        Toaster({ message: `PAN is required.` });
      } else if (!isArgee) {
        Toaster({ message: `Please check for Terms & Conditions.` });
      } else if (!panRegex.test(panNo)) {
        Toaster({ message: 'Invalid PAN format. Please enter a valid PAN.' });
      } else if (!validateAccountNumber(bankNumber)) {
        Toaster({ message: 'Invalid Account Number. Please enter a valid number.' });
      } else if (!validateIFSCCode(bankIfsc)) {
        Toaster({ message: 'Invalid IFSC Code. Please enter a valid code.' });
      } else if (!validateGSTNumber(gstNo)) {
        Toaster({ message: 'Invalid GST Number. Please enter a valid number.' });
      } else {
        setIsLoading(true);
        setIsSaving(true);
        let payload = {
          name: bankName,
          ifsc: bankIfsc,
          accountNumber: bankNumber,
          pan: panNo,
          gst: gstNo,
          workspaceId: defaultWorkspace.id,
          createdBy: userData.id,
          accountHolderName: accountName,
        };
        if (!isFirstTime) {
          // Update existing bank details
          api.updateWorkspaceBankDetails(defaultWorkspace.id, payload)
            .then(res => {
              setBanks([res]);
              setIsLoading(false);
              setIsSaving(false);
              Toaster({ message: `Your bank account details have been updated successfully!` });
              navigation.goBack();
            })
            .catch(err => {
              throw err;
            });
        } else {
          // Add new bank details
          api.addWorkspaceBankDetails(defaultWorkspace.id, payload)
            .then(res => {
              setBanks([res]);
              setIsLoading(false);
              setIsSaving(false);
              Toaster({ message: `Bingo! Your bank account details added successfully!` });
              navigation.goBack();
            })
            .catch(err => {
              throw err;
            });
        }
      }
    } catch (error) {
      console.log("An error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(isFirstTime ){
    getWorkspaceBankDetails();
    }
  }, []);
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading == true && <Loader visible={isLoading}></Loader>}
      <Header navigation={navigation} type='back' options={{ title: 'Bank Details', dark: true }}></Header>
      <ScrollView>
        <View style={{ paddingHorizontal: 20 }}>
          <View>
            <View
              style={[
                flexDirectionRow,
                alignItemsCenter,
                spacingProperty['mr-10'],
              ]}>
              <Icons name="bank" size={30} color={theme.colors.onSurface}></Icons>
              <Text style={[styles.bankHeading, { color: theme.colors.onSurface }]}>Account Details</Text>
            </View>
            <View>
              <Text style={[styles.bankSubHeading, { color: theme.colors.outline }]} >
                "All the details entered over are secure with end-to-end
                encryption and stored information over server are also
                encrypted."
              </Text>
            </View>
          </View>
          <View>
            <View style={spacingProperty['mb-20', 'mt-10']}>

            <Dropdown options={bankNames} onChange={setBankName} label="name" placeholder={bankName ? bankName : 'Select a bank'} value="id" selected={bankName}/>
                 </View>
            {/* <View
              style={[
                justifyContentCenter,
                styles.textInput,
                spacingProperty['mt-20'],
                spacingProperty['mb-20'],
              ]}>
              <Picker
                enabled={true}
                selectedValue={bankName}
                onValueChange={(itemValue, itemIndex) => {
                  setBankName(itemValue);
                }}>
                {allBankList}
              </Picker>
            </View> */}
            <TextInput value={bankNumber} onChangeText={setBankNumber} placeholderTextColor={theme.colors.onSurfaceVariant} placeholder='Account Number*' secureTextEntry={true} style={[styles.textInput, spacingProperty['mb-15', 'mt-10'], { borderColor: theme.colors.onSurfaceVariant, color: theme.colors.onSurface }]} />
           
            {isFirstTime && (
              <TextInput value={confirmBankNumber} onChangeText={setConfirmBankNumber} placeholderTextColor={theme.colors.onSurfaceVariant} placeholder='Confirm Account Number*' style={[styles.textInput, spacingProperty['mb-15', 'mt-10'], { borderColor: theme.colors.onSurfaceVariant, color: theme.colors.onSurface }]} />
            )}            
            <TextInput value={bankIfsc} onChangeText={setBankIfsc} placeholderTextColor={theme.colors.onSurfaceVariant} placeholder='Bank IFSC code*' style={[styles.textInput, spacingProperty['mb-15', 'mt-10'], { borderColor: theme.colors.onSurfaceVariant, color: theme.colors.onSurface }]} />
            <TextInput value={accountName} onChangeText={setAccountName} placeholderTextColor={theme.colors.onSurfaceVariant} placeholder='Account Name*' style={[styles.textInput, spacingProperty['mb-15', 'mt-10'], { borderColor: theme.colors.onSurfaceVariant, color: theme.colors.onSurface }]} />
            <Divider />
            <TextInput value={panNo} onChangeText={(pan) => {
              const formattedPan = pan.toUpperCase();
              setPanNo(formattedPan);
              validatePan(formattedPan); 
             }}
             placeholderTextColor={theme.colors.onSurfaceVariant}
             placeholder='PANumber*'
              style={[
                styles.textInput,
                spacingProperty['mb-15', 'mt-10'],
                { borderColor: theme.colors.onSurfaceVariant, color: theme.colors.onSurface },
              ]}
            />
            <TextInput value={gstNo} onChangeText={setGstNo} placeholderTextColor={theme.colors.onSurfaceVariant} placeholder='GST Number' style={[styles.textInput, spacingProperty['mb-15', 'mt-10'], { borderColor: theme.colors.onSurfaceVariant, color: theme.colors.onSurface }]} />
          </View>
          {isFirstTime && <View style={[flexDirectionRow, alignItemsCenter,spacingProperty['mt-20']]}>
            <Checkbox.Android  status={isArgee ? 'checked' : 'unchecked'}  onPress={() => setIsAgree(!isArgee)}  color={colors.primary}  uncheckColor={'red'}  style={{marginLeft:0,paddingLeft:0}} label='Mon'/>
            <Text style={[styles.checkboxText,{color:theme.colors.onSurface}]} onPress={() => { setIsAgree(!isArgee) }}>I agree to all </Text>
            <Text style={{color: '#5A6BED'}} onPress={() => Linking.openURL('https://furrcrew.com/terms-conditions')}>Terms & Conditions.</Text>
          </View>}
        </View>
      </ScrollView>
      {isFirstTime && <View  style={[spacingProperty['m-20'],{backgroundColor:colors.primary,borderRadius:5}]}>
        <Button disabled={isSaving} loading={isSaving}   onPress={handleSaveChanges} ><Text style={{color:'#ffffff'}}>SAVE CHANGES </Text></Button>
      </View>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bankHeading: {

    fontSize: 18,
    fontWeight: 600,
    marginLeft: 10,
  },
  bankSubHeading: {
    fontSize: 12,

  },
  inputText: {
    color: '#B3B3B3'
  },
  textInputContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#B3B3B3',
    height: 45,
    width: '100%',
  },
  textInput: {
    fontSize: 13,
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 20,
    fontSize: 15,
    height: 45,
  },
});
export default BankInformation;
