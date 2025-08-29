import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Divider,
  Checkbox,
  Button,
  useTheme,
  TextInput,
} from 'react-native-paper';
import {
  btn,
  container,
  spacingProperty,
  alignItemsCenter,
  heading,
  colors,
  flexDirectionRow,
  justifyContentCenter,
} from '../../../utils/styles/gobalstyle';
import Header from '../../../components/common/Header';
import Apis from '../../../utils/apis';
import Dropdown from '../../../components/common/Dropdown';
import Toaster from '../../../components/common/Toaster';
import Loader from '../../../components/common/Loader';
import bankNames from '../../../assets/banknames.json';
import { useAuthState } from '../../../services/auth';
import { useBankState } from '../../../services/banks';
import { useWorspaceState } from '../../../services/workspace';
const BankInformation = ({ navigation }) => {
  const api = new Apis();
  const theme = useTheme();
  const route = useRoute();
  const { userData } = useAuthState();
  const { banks, setBanks } = useBankState();
  const { newWorkspace } = useWorspaceState();
  const [bankName, setBankName] = useState('ICICI Bank');
  const [accountName, setAccountName] = useState('');
  const [bankNumber, setBankNumber] = useState('');
  const [confirmBankNumber, setConfirmBankNumber] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [panNo, setPanNo] = useState('');
  const [gstNo, setGstNo] = useState('');
  const [isArgee, setIsAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const allBankList = [];
  // bankNames.map(bank => { allBankList.push(<Picker.Item key={bank.id} label={bank.name} value={bank.name}></Picker.Item>); })
  const isValidBankNumber = input => {
    return /^[a-zA-Z0-9]{0,16}$/.test(input);
  };
  const handleBankNumberChange = text => {
    if (isValidBankNumber(text) || text === '') {
      setBankNumber(text);
    }
  };
  const handleConfirmBankNumberChange = text => {
    if (isValidBankNumber(text) || text === '') {
      setConfirmBankNumber(text);
    }
  };
  const handleSaveChanges = () => {
    if (accountName == '') {
      Toaster({ message: `Account Name is required.` });
    } else if (bankNumber == '') {
      Toaster({ message: `Account Number is required.` });
    } else if (bankNumber !== confirmBankNumber) {
      Toaster({ message: `Account Number & Confirm Number doesn't match.` });
    } else if (bankIfsc == '') {
      Toaster({ message: `Bank IFSC is required.` });
    } else if (!/^[A-Za-z0-9]{4}[0-9A-Za-z]{7}$/.test(bankIfsc)) {
      Toaster({
        message: `Invalid Bank IFSC code. Please enter a valid 11-character code.`,
      });
    } else if (panNo == '') {
      Toaster({ message: `PAN is required.` });
    } else if (isArgee == false) {
      Toaster({ message: `Please check for Terms & Conditions.` });
    }
    else if (bankName == '') {
      Toaster({ message: `Bank Name is Required.` });
    } else {
      setIsLoading(true);
      let payload = {
        name: bankName,
        ifsc: bankIfsc,
        accountNumber: bankNumber,
        pan: panNo,
        gst: gstNo,
        workspaceId: newWorkspace.id,
        createdBy: userData.id,
        accountHolderName: accountName,
      };
      api
        .addWorkspaceBankDetails(newWorkspace.id, payload)
        .then(res => {
          setBanks([res]);
          setIsLoading(false);
          Toaster({
            message: `Bingo! Your bank account details added successfully!`,
          });
          navigation.navigate('Verification', {
            uploaded: [...route.params.docs, 'doc-bank'],
          });
        })
        .catch(err => {
          console.log(err);
          setIsLoading(false);
          Toaster({ message: `Oops! Please try after sometime.` });
        });
    }
  };
  // const getMyWorkspaces = async () => {
  //   let workData = await api.getAllWorkspaces(userData.id);
  //   console.log("workData.id", workData[0].id)
  //   setWorkspacesId(workData[0].id);
  //   setIsLoading(false);
  // };
  // useEffect(() => {
  //   getMyWorkspaces()
  // }, []);
  return (
    <SafeAreaView style={[container, { flex: 1 }]}>
      {isLoading == true ? <Loader visible={isLoading}></Loader> : null}
      <Header
        navigation={navigation}
        type="back"
        options={{ title: 'Bank Details', dark: true }}></Header>
      <ScrollView>
        <View style={{ paddingHorizontal: 20 }}>
          <View>
            <View
              style={[
                flexDirectionRow,
                alignItemsCenter,
                spacingProperty['mr-10'],
              ]}>
              <Icons
                name="bank"
                size={30}
                color={theme.colors.onSurface}></Icons>
              <Text
                style={[styles.bankHeading, { color: theme.colors.onSurface }]}>
                Account Details
              </Text>
            </View>
            <View>
              <Text
                style={[styles.bankSubHeading, { color: theme.colors.outline }]}>
                "All the details entered over are secure with end-to-end
                encryption and stored information over server are also
                encrypted."
              </Text>
            </View>
          </View>
          <View>
            <View style={spacingProperty[('mb-20', 'mt-10')]}>
              <Dropdown
                options={bankNames}
                onChange={setBankName}
                label="name"
                placeholder="Select a Bank"
                value="id"
                selected={bankName}
              />
            </View>
            {/* <TextInput
              style={[spacingProperty['mb-15']]}
              mode="outlined"
              label="Address*"
              error={dirty && adminAddress === ''}
              placeholder="Enter Address (Office No. Building)"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              multiline={true}
              onChangeText={onChangeAddress}
            /> */}
            <TextInput
              onChangeText={setBankName}
              mode="outlined"
              label="Bank Name*"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              placeholder="Enter Bank Name*"
              style={[spacingProperty['mb-15']]}
              value={bankName}
            />
            <TextInput
              onChangeText={handleBankNumberChange}
              mode="outlined"
              label="Account Number*"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              placeholder="Enter Account Number*"
              secureTextEntry={true}
              style={[spacingProperty['mb-15']]}
              value={bankNumber}
              maxLength={16}
            />
            <TextInput
              onChangeText={handleConfirmBankNumberChange}
              mode="outlined"
              label="Confirm Number*"
              style={[spacingProperty['mb-15']]}
              placeholderTextColor={theme.colors.onSurfaceVariant}
              placeholder="Confirm Account Number*"
              value={confirmBankNumber}
              maxLength={16}
            />
            <TextInput
              onChangeText={setBankIfsc}
              mode="outlined"
              label="Bank IFSC Code*"
              style={[spacingProperty['mb-15']]}
              placeholderTextColor={theme.colors.onSurfaceVariant}
              placeholder="Enter Bank IFSC code*"
              maxLength={11}
            />
            <TextInput
              onChangeText={setAccountName}
              mode="outlined"
              label="Account Holder Name*"
              style={[spacingProperty['mb-15']]}
              placeholderTextColor={theme.colors.onSurfaceVariant}
              placeholder="Enter Account Holder Name*"
            />
            <TextInput
              onChangeText={setPanNo}
              mode="outlined"
              label="PAN Number*"
              style={[spacingProperty['mb-15']]}
              placeholderTextColor={theme.colors.onSurfaceVariant}
              placeholder="Enter PAN Number*"
            />
            <TextInput
              onChangeText={setGstNo}
              mode="outlined"
              label="GST Number"
              style={[spacingProperty['mb-15']]}
              placeholderTextColor={theme.colors.onSurfaceVariant}
              placeholder="Enter GST Number"
            />
          </View>
          <View
            style={[
              flexDirectionRow,
              alignItemsCenter,
              spacingProperty['mt-20'],
            ]}>
            <Checkbox.Android
              status={isArgee ? 'checked' : 'unchecked'}
              onPress={() => setIsAgree(!isArgee)}
              color={colors.green}
              uncheckColor={'red'}
            />
            <Text
              style={[styles.checkboxText, { color: theme.colors.onSurface }]}
              onPress={() => {
                setIsAgree(!isArgee);
              }}>
              I agree to all{' '}
            </Text>
            <Text
              style={{ color: '#5A6BED' }}
              onPress={() =>
                Linking.openURL('https://furrcrew.com/terms-conditions')
              }>
              Terms & Conditions.
            </Text>
          </View>
        </View>
      </ScrollView>
      <View style={spacingProperty['m-20']}>
        <Button
          style={[btn, { flexGrow: 1, width: '100%' }]}
          textColor={colors.white}
          buttonColor={colors.primary}
          icon="file-document-multiple-outline"
          mode="contained"
          onPress={handleSaveChanges}>
          Done
        </Button>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  bankHeading: {
    color: colors.black,
    fontSize: 18,
    fontWeight: 600,
    marginLeft: 10,
  },
  bankSubHeading: {
    fontSize: 12,
    color: colors.black,
  },
  inputText: {
    color: '#B3B3B3',
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
    color: '#000000',
    borderWidth: 1,
    borderColor: '#B3B3B3',
    borderRadius: 5,
    paddingLeft: 20,
    fontSize: 15,
    height: 45,
  },
});
export default BankInformation;