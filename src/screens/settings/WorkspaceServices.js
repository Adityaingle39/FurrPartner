import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  Pressable,
  useColorScheme,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, {useState, useEffect} from 'react';
import { useRoute } from '@react-navigation/native';
import { Button, TextInput, Chip, Divider, IconButton, Button as ButtonPaper, useTheme } from 'react-native-paper';
import remoteConfig from '@react-native-firebase/remote-config';

import Apis from '../../utils/apis';
import Empty from '../../components/common/Empty';
import Toaster from '../../components/common/Toaster';
import Loader from '../../components/common/Loader';
import Header from '../../components/common/Header';
import GroomerPriceCard from '../../components/common/GroomerPriceCard';

import {
  container,
  btn,
  spacingProperty,
  formTextInput,
  inputText,
  colors,
  flexDirectionRow,
  alignItemsCenter,
  justifyContentCenter,
} from '../../utils/styles/gobalstyle';
import config from '../../utils/config';
import { useWorspaceState } from '../../services/workspace';
import { useServiesState } from '../../services/services';
import { useAuthState } from '../../services/auth';
import AddService from '../../components/common/AddService';

import {inHandAmount, gst, totalPrice, convenFee, randomString} from '../../utils/helpers';

const WorkspaceServices = ({navigation}) => {
	const api = new Apis();
  const theme = useTheme();
  const colorScheme =  useColorScheme();

  const route = useRoute();
  const {userData} = useAuthState();
	const {services, setServices} = useServiesState();
  const {newWorkspace, defaultWorkspace, workspacesData, setWorkspaceId, setWorkspaces} = useWorspaceState();

  const [service, setService] = useState([defaultWorkspace.services||[]]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [groomerServiceName, setServiceName] = useState('');
  const [modifyServiceItem, setModifyServiceItem] = useState(null);
  const [modifyServiceItemIndex, setModifyServiceItemIndex] = useState(null);
  const [platformFee, setPlatformFee] = useState(null);
  const [videoCallFee, setVideoCallFee] = useState(null);
  const [key, setKey] = useState(randomString(8));
  const [workspaceType, setWorkspaceType] = useState(null);

  const items = config.vetServiceOptions;
  const [showSwitch, setShowSwitch] = useState(false);

  const configVals = async() => {
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
      } else if (modifyServiceItemIndex !== null) {
        tmpService.splice(modifyServiceItemIndex, 1, item);
        setModifyServiceItemIndex(null);
      } else {
        tmpService.push(item);
      }
      // console.log("service",service);
      // console.log("item",item);
      
      console.log("tmpService", tmpService);
      setService(tmpService);
    }
  }

  const groomerModifyService = (item, index) => {
    setModifyServiceItem(item);
    setModifyServiceItemIndex(index);

    setModalVisible(true);

    const newServiceObj = Object.assign([], service);
    newServiceObj[index] = item;
    setService(newServiceObj);
  };

  const groomerRemoveService = item => {
		Alert.alert('Are you sure?', `You would like to remove this ${item.name} service`, [
			{
				text: 'Cancel',
				onPress: () => console.log('Cancel Pressed'),
				style: 'cancel',
			},
			{text: 'OK', onPress: () => {
					const serviceIndex = service.findIndex(i => i == item);
					let newServiceObjs = Object.assign([], service);
					newServiceObjs.splice(serviceIndex, 1);
					setService(newServiceObjs);
					// updateService('Ahh! Your service removed successfully.', false);
			}},
		]);
  };

	const updateService = (message, navigate) => {
		setIsLoading(true);
		let payload = Object.assign({}, defaultWorkspace);
    payload.services = service;
    console.log(payload.services);
    api.updateWorkspaceChanges(userData.id, defaultWorkspace.id, payload)
    .then(res => {
      console.log("res", res);
      let updatedNewWorkspace = Object.assign(payload, res);
      let newAllWorkspacesData = Object.assign([], workspacesData);
      let alreadyExistsNewIndex = newAllWorkspacesData.findIndex(
        i => i.default == true,
      );
      newAllWorkspacesData.splice(alreadyExistsNewIndex, 1);
      newAllWorkspacesData.push(updatedNewWorkspace);
      setWorkspaces(newAllWorkspacesData);
			Toaster({message: message});

			setIsLoading(false);

			if (navigate) {
				navigation.goBack();
			}
      Toaster({message: 'Bingo! Service info updated successfully, will go live once approved by Admin.'});
    }).catch(err => {
      setIsLoading(false);
      Toaster({message: 'Oops! Something went wrong, please try after sometime.'});
    });
	}

  const handleSelectedItemsChange = item => {
    const existingService = service.find(i => i.name == item);
    if (existingService) {
      Toaster({message: 'Already exists service with similar name!'});
    } else {
      setServiceName(item);
      setModalVisible(true);
    }
  };

  const navigateButton = () => { 
		updateService('Bingo! Your services updated successfully.', true);
  };

	const fetchServices = async () => {
    api.getServices(userData.id)
		.then(res => {
			const workspaceServiceObject = res.find(i => i.id == defaultWorkspace.serviceId);
			setWorkspaceType(workspaceServiceObject.name);
			setServices(res);
			console.log('fetchServices', res);
		}).catch(err => {
			console.log('all services', err.message);
		});
  };

	useEffect(() => {
		if (typeof services == 'object' && Array.isArray(services) && services.length == 0) {
			fetchServices();
		} else {
			const workspaceServiceObject = services.find(i => i.id == defaultWorkspace.serviceId);
      console.log("workspaceServiceObject", defaultWorkspace.services);
			setWorkspaceType(workspaceServiceObject.name);
		}

		if (defaultWorkspace && 'services' in defaultWorkspace && defaultWorkspace.services !== null) {
			setService(defaultWorkspace.services);
		}
    configVals();
	}, []);

  return (
    <SafeAreaView style={{flex:1, backgroundColor: colorScheme === 'dark' ? theme.colors.surface : theme.colors.surfaceVariant}}>
      <Header
        navigation={navigation}
        type="back"
        options={{
          title: 'Workspace Services',
          subTitle: 'Create/Modify your serivce information',dark:true
        }}></Header>
      {isLoading == true ? <Loader visible={isLoading}></Loader> : null}
      <ScrollView style={{flex: 1}}>
        <View style={{flex: 1, marginHorizontal: 20}}>
          <Text style={[styles.listViewText, {marginBottom: 5,color:theme.colors.onSurface}]}>Services Offered</Text>

          {workspaceType === 'Veterinary' ? (
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              {items.map((item, index) => (
                <View
                  key={`vet-service-${index}`}
                  style={[styles.chip, flexDirectionRow]}>
                  <Chip
                    key={`services-item-${index}`}
                    mode="outlined"
                    elevated={true}
                    closeIcon="close"
                    icon="information"
                    onPress={() => handleSelectedItemsChange(item.name)}>
                    {item.name}
                  </Chip>
                </View>
              ))}
            </View>
          ) : (
            <View style={{marginHorizontal: 60}}>
							<ButtonPaper icon="plus" buttonColor={colors.green} mode="contained" onPress={() => setModalVisible(true)}>
								Add New service
							</ButtonPaper>
            </View>
          )}
          <Divider style={{marginBottom: 20, marginTop: 10}} />
          <View style={{paddingBottom: 20, marginHorizontal: -5}}>
            {service && service.length > 0 ? (
              service.map((item, index) => (
                <GroomerPriceCard
                  key={`groomer-service-${index}`}
                  item={item}
                  index={index}
                  type={workspaceType}
                  isGstApplicable={defaultWorkspace.gstEnabled}
                  onModify={() => groomerModifyService(item, index)}
                  onDelete={groomerRemoveService}
                  handleGstSwitchChange={showSwitch }
                />
              ))
            ) : (
              <Empty title="No Services!" subtitle="Please add few services, so that you can start your business."></Empty>
            )}
          </View>
        </View>
      </ScrollView>

			{service && service.length > 0 ? <View style={{padding: 20}}>
        <Button disabled={defaultWorkspace.locked || isLoading || defaultWorkspace.status == 'PENDING'} style={[btn, {width: '100%'}]} labelStyle={{fontSize: 20}} mode="contained" buttonColor={colors.primary} textColor={colors.white} onPress={navigateButton}>Save Changes</Button>
      </View>: null}
      {modalVisible && <AddService 
        key={key}
        isVisible={true}
        platformFee={platformFee}
        videoCallFee={videoCallFee}
        serviceName={groomerServiceName}
        options={modifyServiceItem}
        isGstApplicable={defaultWorkspace.gstEnabled}
        workspaceType={workspaceType}
        onChange={handleServiceModification}
      />}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  textStylebutton: {
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
  buttonOpen: {
    backgroundColor: '#01C4FF',
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
    color: colors.black,
  },
  hrLine: {
    borderWidth: 0.5,
    borderColor: '#B3B3B3',
    marginVertical: 10,
  },
  inhandText: {
    fontSize: 18,
    fontWeight: 500,
    color: colors.black,
  },
  chip: {
    marginRight: 10,
    marginBottom: 10,
  },
});
export default WorkspaceServices;