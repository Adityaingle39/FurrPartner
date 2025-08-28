import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Pressable,
  useColorScheme,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import remoteConfig from '@react-native-firebase/remote-config';
import { useRoute } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import AddService from '../../components/common/AddService';
import { randomString } from '../../utils/helpers';

import {
  Chip,
  Card,
  Divider,
  List,
  IconButton,
  Button as BtnPaper,
  useTheme,
} from 'react-native-paper';

import Stepper from '../../components/common/Stepper';
import Apis from '../../utils/apis';
import Empty from '../../components/common/Empty';
import Toaster from '../../components/common/Toaster';
import Loader from '../../components/common/Loader';
import Header from '../../components/common/Header';
import GroomerPriceCard from '../../components/common/GroomerPriceCard';

import {
  container,
  spacingProperty,
  heading,
  subHeading,
  formTextInput,
  inputText,
  colors,
  flexDirectionRow,
  alignItemsCenter,
  justifyContentCenter,
  btn,
} from '../../utils/styles/gobalstyle';
import config from '../../utils/config';
import { useWorspaceState } from '../../services/workspace';
import { useAuthState } from '../../services/auth';

import { inHandAmount, gst, totalPrice, convenFee } from '../../utils/helpers';

const PricingDetails = ({ navigation }) => {
  const api = new Apis();
  const theme = useTheme();
  const route = useRoute();
  const colorScheme = useColorScheme();
  const bgColor = colorScheme === 'dark' ? theme.colors.surface : theme.colors.surfaceVariant;

  const { userData } = useAuthState();
  const { newWorkspace, defaultWorkspace, workspacesData, setWorkspaceId, setWorkspaces } = useWorspaceState();

  const [service, setService] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [modifyServiceIndex, setModifyServiceIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [groomerServiceDescription, setGroomerServiceDescription] = useState('');
  const [groomerServicePrice, setGroomerServicePrice] = useState('');
  const [groomerServiceGst, setGroomerServiceGst] = useState('');
  const [groomerServiceTotalCost, setGroomerServiceTotalCost] = useState('');
  const [groomerServiceConvenienceFee, setGroomerServiceConvenienceFee] = useState('');
  const [groomerServiceInHandAmount, setGroomerServiceInHandAmount] = useState('');

  const [groomerServiceName, setServiceName] = useState('');
  const [modifyServiceItem, setModifyServiceItem] = useState(null);
  const [platformFee, setPlatformFee] = useState(null);
  const [videoCallFee, setVideoCallFee] = useState(null);
  const [key, setKey] = useState(randomString(8));

  const [workspaceType] = useState(route.params.selectedName);
  const items = config.vetServiceOptions;

  const configVals = async () => {
    const platformFeeObj = await remoteConfig().getValue('platformFee');
    const videoCallFeeObj = await remoteConfig().getValue('videoCallFee');
    setPlatformFee(JSON.parse(platformFeeObj.asString()));
    setVideoCallFee(JSON.parse(videoCallFeeObj.asString()));
  }

  const handleServiceModification = (item) => {
    setModalVisible(false);
    setModifyServiceItem(null);
    setKey(randomString(8));
    if (item) {
      const tmpService = [...service];
      const existingService = tmpService.findIndex(i => i.name == item.name);
      if (existingService > -1) {
        tmpService.splice(existingService, 1, item);
      } else {
        tmpService.push(item);
      }

      setService(tmpService);
    }
  }

  const groomerModifyService = (item) => {
    setModifyServiceItem(item);

    setModalVisible(true);
  };

  const groomerAddService = () => {
    const serviceObj = {
      name: groomerServiceName,
      description: groomerServiceDescription,
      rate: parseFloat(groomerServicePrice),
      gstPrice: parseFloat(groomerServiceGst),
      totalCost: parseFloat(groomerServiceTotalCost),
      convenienceFee: parseFloat(groomerServiceConvenienceFee),
    };
    if (modifyServiceIndex !== null) {
      let newServiceObjs = Object.assign([], service);
      newServiceObjs[modifyServiceIndex] = serviceObj;
      setService(newServiceObjs);
      Toaster({ message: 'Service information updated.' });
    } else {
      if (service.findIndex(i => i.name == groomerServiceName) > -1) {
        Toaster({ message: 'Already exists service with similar name!' });
      } else {
        if (groomerServiceName == '' || groomerServicePrice == '') {
          Toaster({ message: 'Please Complete Details' });
          setModalVisible(modalVisible);
        } else {
          setModalVisible(!modalVisible);
          setService(prevServices => [...prevServices, serviceObj]);
          Toaster({ message: 'New service added successfully!' });
        }
      }
    }

    setModifyServiceIndex(null);
  };

  // const groomerModifyService = item => {
  //   const serviceIndex = service.findIndex(i => i == item);
  //   setModifyServiceIndex(serviceIndex);

  //   setGroomerServiceName(item.name);
  //   setGroomerServiceDescription(item.description);
  //   setGroomerServicePrice(item.rate);
  //   setGroomerServiceGst(gst(item.rate));
  //   setGroomerServiceTotalCost(totalPrice(item.rate));
  //   setGroomerServiceConvenienceFee(convenFee(item.rate));
  //   setGroomerServiceInHandAmount(inHandAmount(item.rate));

  //   setModalVisible(true);
  // };

  const groomerRemoveService = item => {
    const serviceIndex = service.findIndex(i => i == item);
    let newServiceObjs = Object.assign([], service);
    newServiceObjs.splice(serviceIndex, 1);
    setService(newServiceObjs);
    Toaster({ message: 'Service removed!' });
  };

  const handleSelectedItemsChange = item => {
    const existingService = service.find(i => i.name == item);
    if (existingService) {
      Toaster({ message: 'Already exists service with similar name!' });
    } else {
      setServiceName(item);
      setModalVisible(true);
    }
  };

  const handleRemovedItemsChange = item => {
    let items = Object.assign([], selectedItems);
    let itemIndex = items.indexOf(item);
    items.splice(itemIndex, 1);
    setSelectedItems(items);

    let tmpService = Object.assign([], service);
    let serviceIndex = tmpService.findIndex(i => i.name == item);
    tmpService.splice(serviceIndex, 1);
    setService(tmpService);
  };

  const handlePriceChange = (index, rate) => {
    const updatedService = [...service];
    updatedService[index].rate = rate;
    setService(updatedService);
  };
  const calculateTotal = (groomerServicePrice) => {
    setGroomerServiceGst(gst(groomerServicePrice));
    setGroomerServiceTotalCost(totalPrice(groomerServicePrice));
    setGroomerServiceConvenienceFee(convenFee(groomerServicePrice));
    setGroomerServiceInHandAmount(inHandAmount(groomerServicePrice));
  };

  const handleGroomerPriceChange = (text) => {
    setGroomerServicePrice(text);
    calculateTotal(text);
  };

  useEffect(() => {
    configVals();
  }, []);


  const renderInputBoxes = () => {
    return service.map((item, index) => (
      <View key={index} style={{ marginBottom: 20 }}>
        <Text>Service {item.name}:</Text>
        <View
          style={[
            styles.serviceAddContentInput,
            { width: '100%', marginLeft: 0, marginTop: 10 },
          ]}>
          <View
            style={[
              justifyContentCenter,
              alignItemsCenter,
              spacingProperty['m-5'],
            ]}>
            <Text style={{ fontSize: 18 }}> ₹</Text>
          </View>
          <View style={{ flexGrow: 1 }}>
            <TextInput
              placeholder="Enter price"
              value={item.rate}
              style={[
                formTextInput,
                {
                  paddingHorizontal: 15,
                  borderWidth: 0,
                  height: 40,
                  fontSize: 18,
                },
              ]}
              onChangeText={rate => handlePriceChange(index, rate)}
            />
          </View>
        </View>
      </View>
    ));
  };

  const uploadImages = workspaceId => {
    let workspace = Object.assign({}, newWorkspace);
    if (workspace.uploadImages && workspace.uploadImages.length > 0) {
      const formData = new FormData();
      workspace.uploadImages.forEach(image => {
        formData.append('files', {
          uri: image.uri,
          type: image.type,
          name: image.name,
        });
      });
      
      if (workspace.coverImage && workspace.coverImage !== null) {
        formData.append('coverImage', workspace.coverImage);
      }
      api.uploadWorkspaceImages(userData.id, workspaceId, formData)
        .then(res => {
          console.log('resImages', res);
          setIsLoading(false);
          Toaster({ message: 'Bingo! Your account created successfully.' });
          navigation.pop(4);
          // navigation.navigate('Verification',selectedName);
          navigation.navigate('Verification', { selectedName: workspaceType });
        }).catch(err => {
          setIsLoading(false);
          Toaster({message: 'Oops! Something went wrong, please try after sometime.'});
        });
    }
  };

  const navigateButton = () => {
    setIsLoading(true);
    let payload = Object.assign({}, newWorkspace);
    payload.services = service;
    console.log("userData.id",userData);
    console.log("payload",payload);
    
    api.createWorkspace(userData.id, payload)
      .then(res => {
        let updatedNewWorkspace = Object.assign(payload, res);
        let newAllWorkspacesData = Object.assign([], workspacesData);
        let alreadyExistsNewIndex = newAllWorkspacesData.findIndex(
          i => i.new == true,
        );
        newAllWorkspacesData.splice(alreadyExistsNewIndex, 1);
        newAllWorkspacesData.push(updatedNewWorkspace);
        setWorkspaces(newAllWorkspacesData);
        if (updatedNewWorkspace.uploadImages && updatedNewWorkspace.uploadImages.length > 0) {
          uploadImages(res.id);
        } else {
          Toaster({ message: 'Bingo! Your account created successfully.' });
          setIsLoading(false);
          navigation.pop(4);
          navigation.navigate('Verification',{ selectedName: route.params.selectedName });
        }
      }).catch(err => {
        console.log(err);
        setIsLoading(false);
        Toaster({
          message: 'Oops! Something went wrong, please try after sometime.',
        });
      });
  };

  useEffect(() => {
    configVals();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: bgColor}}>
          {isLoading == true ? <Loader visible={isLoading}></Loader> : null}
      <Header navigation={navigation} type="back" options={{title: 'Create Workspace', subtitle: 'Services Offered'}}></Header>
      {/* <Stepper steps={3} active={2}></Stepper> */}
      <ScrollView style={{ marginHorizontal: 20 }}>
        <View style={{marginTop: 10}}>
          {/* <Text style={[styles.listViewText, { marginBottom: 10, color: theme.colors.onSurface }]}>
            Services Offered
          </Text> */}

          {workspaceType == 'Veterinary' ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {items.map((item, index) => (
                <View
                  key={`vet-service-${index}`}
                  style={[styles.chip, flexDirectionRow]}>
                  <Chip
                    key={`services-item-${index}`}
                    mode="outlined"
                    // selectedColor={selectedItems.includes(item.name)?colors.green:colors.black}
                    elevated={true}
                    closeIcon="close"
                    icon="information"
                    // onClose={x => {selectedItems.includes(item.name)?handleRemovedItemsChange(item.name):null}}
                    onPress={() => handleSelectedItemsChange(item.name)}>
                    {item.name}
                  </Chip>
                </View>
              ))}
            </View>
          ) : (
            <View style={{marginHorizontal: 60}}>
              <Pressable
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={() => setModalVisible(true)}>
                <Text style={styles.textStyle}>+ Add New service</Text>
              </Pressable>
            </View>
          )}
          <Divider style={{ marginBottom: 20, marginTop: 10 }} />
          <View style={{ paddingBottom: 20 }}>
            {service && service.length > 0 ? (
              service.map((item, index) => (
                <GroomerPriceCard
                  key={`groomer-service-${index}`}
                  item={item}
                  index={index}
                  onModify={groomerModifyService}
                  onDelete={groomerRemoveService}
                />
              ))
            ) : (
              <Empty
                title="No Services!"
                subtitle="Please add few services, so that you can start your business."></Empty>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={{ padding: 20 }}>
        <Button disabled={isLoading} style={[btn, {flexGrow: 1}]} mode='contained' buttonColor={colors.primary} textColor={colors.white} onPress={navigateButton}>Next</Button>
      </View>
      {modalVisible && <AddService 
        key={key}
        isVisible={true}
        platformFee={platformFee}
        videoCallFee={videoCallFee}
        serviceName={groomerServiceName}
        options={modifyServiceItem}
        isGstApplicable={defaultWorkspace?.gstEnabled}
        workspaceType={workspaceType}
        onChange={handleServiceModification}
      />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textStylebutton: {
    color: colors.green,
    fontSize: 20,
    marginRight: 15,
  },
  animalSizePicker: {
    borderWidth: 1,
    height: 45,
    width: '30%',
    justifyContent: 'center',
    borderColor: '#B3B3B3',
    borderRadius: 5,
  },
  textInput: {
    fontSize: 13,
    color: colors.black,
    borderWidth: 1,
    borderColor: '#B3B3B3',
    borderRadius: 5,
    paddingLeft: 20,
    fontSize: 15,
    height: 45,
    justifyContent: 'center',
    marginBottom: 10,
  },
  listViewText: {
    fontSize: 16,
    fontWeight: 500,

    marginVertical: 20,
  },
  serviceAddContent: {
    color: colors.black,
    fontWeight: 500,
    marginLeft: 15,
  },
  serviceAddContentInput: {
    flexDirection: 'row',
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    color: '#B3B3B3',
    borderColor: '#B3B3B3',
    width: '40%',
    marginLeft: 20,
  },

  modalView: {

    borderRadius: 20,
    padding: 35,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },

  buttonClose: {
    backgroundColor: '#01C4FF',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  priceTagText: {
    fontSize: 16,

  },
  hrLine: {
    borderWidth: 0.5,

    marginVertical: 10,
  },
  inhandText: {
    fontSize: 18,
    fontWeight: 500,

  },
  chip: {
    marginRight: 10,
    marginBottom: 10,
  },
});
export default PricingDetails;
