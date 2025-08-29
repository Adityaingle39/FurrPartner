import React, { useRef, useState, useEffect } from "react";
import moment from "moment";
import ImagePicker from 'react-native-image-crop-picker';
import remoteConfig from '@react-native-firebase/remote-config';
import {  Image, View, Text, StyleSheet, FlatList, VirtualizedList, useColorScheme, Dimensions, ScrollView } from "react-native";
import { Avatar, Button, TextInput, IconButton, Card, Divider, List, useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

import Apis from "../utils/apis";
import Empty from "../components/common/Empty";
import Header from "../components/common/Header";
import Toaster from "../components/common/Toaster";
import ProfileCards from "../components/skeleton/cards";
import VideoGallery from "../components/common/VideoGallery";
import DetailsCards from "../components/skeleton/details";
import AppointmentCard from "../components/cards/appointment";
import Loader from "../components/common/Loader";

import { useAuthState } from "../services/auth";
import { useWorspaceState } from "../services/workspace";
import { useAppointmentState } from "../services/appointments";
import { randomString, openLocationDirection } from "../utils/helpers";
import { btn, colors } from "../utils/styles/gobalstyle";
const api = new Apis();

const HomeVisit = ({ navigation, item }) => {
	const theme = useTheme();
	const colorScheme = useColorScheme();
	const { width, height } = Dimensions.get('window');

	function goToYosemite() {
		const latitude = item.appointmentLatitude;
		const longitude = item.appointmentLongitude;

		if (latitude && longitude) {
			openLocationDirection(latitude, longitude, item.appointmentAddress);
		} else {
			Toaster({ message: 'Missing location co-ordinates for this Groomer.' });
		}
	}

	return (<Card onPress={goToYosemite} elevation={0.5} style={{ borderRadius: 16, shadowColor: theme.colors.onSurface, shadowOffset: { width: 0, height: 0 }, width: width - 30, backgroundColor: colorScheme == 'dark' ? theme.colors.surface : theme.colors.background }}>
		<Card.Cover style={{ opacity: 0.4, height: width / 3 }} source={require('../assets/ServiceMap.png')}></Card.Cover>
		<Card.Content>
			<Text style={{ marginTop: 10, fontSize: 15, color: theme.colors.outline }}>{item.appointmentAddress}</Text>
		</Card.Content>
	</Card>)
}

const DisabledButton = ({ navigation, item, status, icon }) => {
	const theme = useTheme();
	const colorScheme = useColorScheme();
	const { width, height } = Dimensions.get('window');

	const [statusLabel, setStatusLabel] = useState(status ? status : 'Not Available');
	const [iconType, setIconType] = useState(icon ? icon : 'close');

	return (
		<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15, marginBottom: 15 }}>
			<Button style={[btn, { flexGrow: 1 }]} textColor={colors.red} icon={iconType} mode='outlined' disabled={true}>
				{statusLabel}
			</Button>
		</View>
	)
}

const Complete = ({ navigation, item, config, onChange }) => {
	const theme = useTheme();
	const colorScheme = useColorScheme();
	const { width, height } = Dimensions.get('window');
	const actionSheetRef = useRef(null);

	const { userData } = useAuthState();
	const { defaultWorkspace } = useWorspaceState();

	const [uploads, setUploads] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [prescription, setPrescription] = useState(null);

	const removeUploadedImage = (index) => {
		const uploadsTmp = uploads.filter((item, i) => i !== index);
		setUploads(uploadsTmp);
	}

	const openCamera = () => {
		ImagePicker.openCamera({
			compressImageQuality: 2
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
			compressImageQuality: 1
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

	const uploadPrescription = async () => {
		if (item?.serviceType === 'VETERINARY') {
			if (prescription == null) {
				Toaster({ message: "Please add prescription details." });
			} else if ((uploads && uploads.length === 0) || uploads === null) {
				Toaster({ message: "No documents or videos uploaded." });
			} else {
				if (!isLoading) {
					setIsLoading(true);
					try {
						// Create form data
						const formData = new FormData();
						uploads.forEach(image => {
							formData.append('files', image);
						});
						const uploadPromises = uploads.map(image =>
							api.updateAppointmentPrescriptions(item.id, item.petId, prescription, formData)
						);
	
						await Promise.all(uploadPromises);
	
						Toaster({ message: `Great! Prescription details uploaded successfully.` });
						updateStatus('Completed');
					} catch (err) {
						console.log(err);
						Toaster({ message: `Oops! Getting error, please try after sometime.` });
					} finally {
						setIsLoading(false);
					}
				}
			}
		} else {
			updateStatus('Completed');
		}
	};
	

	const updateStatus = (status) => {
		setIsLoading(true);
		api.updateWorkspaceAppointment(userData.id, defaultWorkspace.id, item.id, status)
			.then(res => {
				if (res) {
					Toaster({ message: `Bingo! Your appointment completed successfully.` });
					onChange(status);
					navigation.navigate("AppointmentsUpcoming");
				}
				
				setIsLoading(false);
			})
			.catch(err => {
				console.log(err);
				setIsLoading(false);
			});
	};
	return (<>
		{item?.serviceType == 'VETERINARY' && <View style={{ marginHorizontal: 15 }}>
			<Text style={{ color: theme.colors.onSurface }}>Priscription Details</Text>
			<View style={{ marginTop: 10 }}>
				<View style={{ marginBottom: 0, justifyContent: 'center' }}>
					<Button icon="camera" mode="contained" buttonColor={colors.lightGrey} style={{ flexGrow: 1 }} onPress={() => actionSheetRef.current?.show()}>
						Upload Image/Videos
					</Button>
				</View>
				<View style={{ marginVertical: 10, borderRadius: 15, paddingHorizontal: 10, borderWidth: uploads && uploads.length > 0 ? 1 : 0 }}>
					{uploads && uploads.length > 0 ? uploads.map((image, index) => (<List.Item
						key={`uploaded-appointment-active-image-${index}`}
						title={image.name}
						style={{ paddingRight: 0 }}
						left={props => <Avatar.Image size={54} source={{ uri: image.uri }} />}
						right={props => <IconButton icon="close" style={{ marginRight: 0 }} onPress={() => removeUploadedImage(index)} />}
					></List.Item>)) : null}
				</View>
			</View>
			<View style={{ marginBottom: 20 }}>
				<TextInput
					mode='outlined'
					placeholderTextColor={theme.colors.onSurface}
					label='Prescription'
					placeholder='Please enter prescription here...'
					style={{ color: theme.colors.onSurface }}
					inputMode="text"
					multiline={true}
					numberOfLines={4}
					onChangeText={setPrescription}
				/>
			</View>
		</View>}
		{item?.serviceType == 'VETERINARY'&&
		<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15, marginBottom: 15 }}>
			<Button disabled={isLoading} loading={isLoading} style={[btn, { flexGrow: 1 }]} buttonColor={colors.primary} textColor={colors.white} icon="check-all" mode='contained' onPress={uploadPrescription}>
				Submit
			</Button>
		</View>
		}
		<VideoGallery actionSheetRef={actionSheetRef} id="appointment-upload-prescription" options={{ gallery: true, camera: true, galleryCallback: openGallery, cameraCallback: openCamera }}></VideoGallery>
	</>)
}

const Accepted = ({ navigation, item, config, onChange }) => {
	const theme = useTheme();
	const colorScheme = useColorScheme();
	const { width, height } = Dimensions.get('window');

	const { userData } = useAuthState();
	const { defaultWorkspace } = useWorspaceState();

	const [isLoading, setIsLoading] = useState(false);
	const [isDisabled, setDisabled] = useState(false);
	const [isVideoDisabled, setIsVideoDisabled] = useState(false);
	const [isCancelDisabled, setIsCancelDisabled] = useState(false);

	const updateStatus = (status) => {
		setIsLoading(true);
		api.updateWorkspaceAppointment(userData.id, defaultWorkspace.id, item.id, status)
			.then(res => {
				setIsLoading(false);
				Toaster({ message: status == 'Complete' ? `Bingo! Your appointment completed successfully, please enter prescription details.` : `Oh! You have cancelled the appointment.` });
				onChange(status);
			})
			.catch(err => {
				console.log(err);
				setIsLoading(false);
			});
	};

	const applyConfig = () => {
		if (!!config && Object.keys(config).includes('complete')) {
			const beforeTime = moment.unix(item.appointmentDate / 1000).subtract(config.complete.before, 'm').unix()
			const afterTime = moment.unix(item.appointmentDate / 1000).add(config.complete.after, 'm').unix()

			setIsCancelDisabled(beforeTime <= moment().unix());
			setDisabled((beforeTime >= moment().unix() || afterTime <= moment().unix()) && item.videoCall == false);
		}
		if (!!config && Object.keys(config).includes('videoCall')) {
			const beforeTime = moment.unix(item.appointmentDate / 1000).subtract(config.videoCall.before, 'm').unix()
			const afterTime = moment.unix(item.appointmentDate / 1000).add(config.videoCall.after, 'm').unix()

			setIsVideoDisabled(beforeTime >= moment().unix() || afterTime <= moment().unix());
		}
	}

	useEffect(() => {
		applyConfig();
	}, []);

	return (<View style={{ flexGrow: 0, paddingBottom: 15 }}>
		{item?.serviceType == 'VETERINARY' && item?.type == 'Online' && <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15, marginBottom: 0, paddingTop: 15 }}>
			<Button disabled={isLoading || isVideoDisabled} style={[btn, { flexGrow: 1 }]} buttonColor={colors.primary} textColor={colors.white} icon="check" mode="contained" onPress={() => navigation.navigate('VideoCall', { appointmentId: item.id })}>
				Join Meeting
			</Button>
		</View>}
		<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15, paddingTop: 15 }}>
			<Button disabled={isLoading || isCancelDisabled} style={[btn, { flexGrow: 1 }]} textColor={colors.red} icon="cancel" mode='outlined' onPress={() => updateStatus('Partner_Cancelled')}>
				Cancel
			</Button>
			<Button disabled={isLoading || isDisabled}  style={[btn, { marginLeft: 15, flexGrow: 1 }]} buttonColor={colors.primary} textColor={colors.white} icon="check" mode="contained" onPress={() => updateStatus('Complete')}>
				Complete
			</Button>
		</View>
	</View>)
}

const Created = ({ navigation, item, onChange }) => {
	const theme = useTheme();
	const colorScheme = useColorScheme();
	const { width, height } = Dimensions.get('window');

	const { userData } = useAuthState();
	const { defaultWorkspace } = useWorspaceState();

	const [isLoading, setIsLoading] = useState(false);

	const updateStatus = (status) => {
		setIsLoading(true);
		api.updateWorkspaceAppointment(userData.id, defaultWorkspace.id, item.id, status)
			.then(res => {
				setIsLoading(false);
				Toaster({ message: status === 'Active' ? `Appointment accepted successfully!` : `Oh! You have rejected the appointment.` });
				onChange(status);
			})
			.catch(err => {
				console.log(err);
				setIsLoading(false);
			});
	};

	return (
		<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15, marginBottom: 15, paddingTop: 15 }}>
			<Button disabled={isLoading} style={[btn, { flexGrow: 1 }]} textColor={colors.red} icon="cancel" mode='outlined' onPress={() => updateStatus('Partner_Rejected')}>
				Reject
			</Button>
			<Button disabled={isLoading} style={[btn, { marginLeft: 15, flexGrow: 1 }]} buttonColor={colors.green} textColor={colors.white} icon="check" mode="contained" onPress={() => updateStatus('Active')}>
				Accept
			</Button>
		</View>
	)
}

export class CalculatePrice {
	appointment = null;
	paymentDetails = null;
	couponDetails = null;
	bookedServices = null;

	constructor(appointment, paymentDetails) {
		this.appointment = appointment;
		this.bookedServices = JSON.parse(appointment.bookedServices);
		this.paymentDetails = paymentDetails;
		this.couponDetails = appointment.couponDetail;
	}

	getPriceObject() {
		return {
			items: this.getItems(),
			gst: parseFloat(this.getGstAmount()).toFixed(2),
			platformFee: parseFloat(this.getPlatformFee()).toFixed(2),
			amountPaid: parseFloat(this.getAmountPaid()).toFixed(2),
			inHandAmount: parseFloat(this.getInHandAmount()).toFixed(2),
		}
	}

	getItems() {
		return this.bookedServices.map(i => ({ title: i.name, price: i.rate }));
	}

	isDiscountApplicable() {
		return this.couponDetails;
	}

	getPlatformFee() {
		return this.bookedServices.reduce((a, b) => a + b.convenienceFee, 0);
	}

	getAmountPaid() {
		const isDisountApplied = this.isDiscountApplicable();
		const amountPaidByUser = this.paymentDetails.total;

		if (isDisountApplied) {
			return parseFloat(amountPaidByUser);
		} else if (this.couponDetails) {
			const partnerRate = this.bookedServices.reduce((a, b) => a + b.rate, 0);
			return parseFloat(partnerRate);
		} else {
			return parseFloat(amountPaidByUser);
		}
	}

	getInHandAmount() {
		const isDisountApplied = this.isDiscountApplicable();
		const platformFee = this.getPlatformFee();
		const amountPaid = this.getAmountPaid();
		const isInHandAmountAvailable = this.bookedServices.findIndex(i => Object.keys(i).includes('total'));
		const partnerRate = this.bookedServices.reduce((a, b) => a + b.rate, 0);
		const partnerFee = this.bookedServices.reduce((a, b) => a + b.convenienceFee, 0);
		const partnerInHandAmount = this.bookedServices.reduce((a, b) => a + b.inHandAmount, 0);

		const partnerFinalInHandAmount = isInHandAmountAvailable > -1 ? partnerInHandAmount : partnerRate - partnerFee;
		if (isDisountApplied) {
			return parseFloat(amountPaid - platformFee);
		} else {
			return parseFloat(partnerFinalInHandAmount);
		}
	}

	getGstAmount() {
		const isDisountApplied = this.isDiscountApplicable();
		if (this.appointment.serviceType == 'VETERINARY') {
			return null;
		} else if (isDisountApplied) {
			return parseFloat(this.paymentDetails.gst);
		} else {
			const partnerGst = this.bookedServices.reduce((a, b) => a + (b?.gstPrice ? b.gstPrice : (b?.gst ? b.gst : 0)), 0);
			const appGst = this.paymentDetails.gst;

			return appGst > partnerGst ? parseFloat(appGst) : parseFloat(partnerGst);
		}
	}
}

export default AppointmentDetails = ({ navigation, route }) => {
	const theme = useTheme();
	const colorScheme = useColorScheme();
	const listRef = useRef(null);
	const { width, height } = Dimensions.get('window');
	const defaultImage = Image.resolveAssetSource(require('../assets/GstCert.png')).uri;

	const { userData } = useAuthState();
	const { defaultWorkspace } = useWorspaceState();
	const { appointments, activeAppointments, setAppointments } = useAppointmentState();
   
	const [isLoading, setIsLoading] = useState(false);
	const [appointment, setAppointment] = useState(null);
	const [bookedServices, setBookedServices] = useState([]);
	const [paymentDetails, setPaymentDetails] = useState({});
	const [discountDetails, setDiscountDetails] = useState(null);
	const [configParams, setConfigParams] = useState(null);
	const [isHomeVisit, setIsHomeVisit] = useState(false);
	const [priceDetails, setPriceDetails] = useState(null);
    // console.log(appointment)
	const configVals = async () => {
		const appointmentConfig = await remoteConfig().getValue('appointment');
		setConfigParams(JSON.parse(appointmentConfig.asString()));
		return JSON.parse(appointmentConfig.asString());
	}

	const getAllAppointments = (type) => {
		api.getWorkspaceAppointments(userData.id, defaultWorkspace.id, { status: 'all' })
			.then(res => {
				const responseData = res && res.length > 0 ? res : [];
				setAppointments(responseData);
				setCurrentAppointment(responseData);
				setIsLoading(false);

			}).catch(err => {
				console.log("getAllAppointments Error: ", err);
				// setRefreshing(false);
				setIsLoading(false);
			});
	}

	const getDiscount = (appData) => {
		if (appData?.couponDetail) {
			if (appData.couponDetail.refId == defaultWorkspace.id) {
				return appData.couponDetail;
			} else {
				return null;
			}
		} else {
			return null;
		}
	}

	const setCurrentAppointment = (data) => {
		const currentData = data ? data : appointments;
		if (currentData && currentData.length > 0) {
			const appData = currentData.find(i => i.id === route.params.id);
			const bookedServices = JSON.parse(appData.bookedServices);
			setAppointment(appData);
			setBookedServices(bookedServices);
			setPaymentDetails({ "coupon": "CPGC90", "discount": 5, "gst": 0.9, "itemCost": 10, "itemLabel": "Grooming Fee", "platformFee": "0.20", "total": 5.9 })

			const priceObj = new CalculatePrice(appData, appData.paymentDetails);
			const priceDataObj = priceObj.getPriceObject()

			setPriceDetails(priceDataObj);
			setDiscountDetails(getDiscount(appData));

			if (appData.serviceType == 'GROOMING') {
				setIsHomeVisit(bookedServices.findIndex(i => i.isHomeVisit) > -1 ? true : false)
			} else {
				setIsHomeVisit(appData.type == 'Home Visit');
			}
		} else {
			getAllAppointments();
		}
	}

	const onChange = (status) => {
		getAllAppointments();
		if (status !== 'Complete') {
			navigation.goBack();
		}
	}

	const init = async () => {
		const configSet = await configVals();
		if (appointments && appointments.length == 0) {
			await getAllAppointments();
		} else {
			await setCurrentAppointment();
		}
	}

	// console.log("appointment", appointment, defaultWorkspace.id, defaultWorkspace.collaboratorId, userData.id);

	useEffect(() => {
		init();
	}, []);

	const getTempStatus = (temp,serviceType) => {
		switch(temp) {
			case 'Created': return 'Pending Partner Acceptance';
			case 'Active' : return 'Active';
			case 'Partner_Cancelled' : return 'Cancelled By Self';
			case 'Partner_Rejected' : return 'Rejected By Self';
			case 'Auto_Rejected' : return 'Auto Rejected';
			case 'Cancelled' : return 'Cancelled By Self';
			case 'Rejected' : return 'Rejected By Self';
			case 'AUTO_COMPLETED' : return 'AUTO COMPLETED';
			case 'Admin_Rejected' : return 'Rejected By Admin';
			case 'User_cancelled' : return 'Cancelled By User';
			case 'User_Cancelled' : return 'Cancelled By User';
			case 'Admin_cancelled' : return 'Cancelled By Admin';
			case 'Admin_Cancelled' : return 'Cancelled By Admin';
			case 'Complete': return serviceType !== 'VETERINARY' ? 'Completed' : 'Prescription Pending';
			case 'Completed' : return 'Completed';
			case 'AUTO_REJECTED': return 'AUTO REJECTED';
			default: return 'None';
		}
	}
	
	// Determine color based on status
	const getStatusColor = (temp) => {
		switch(temp) {
			case 'Active':
			case 'AUTO_COMPLETED':
			case 'Complete':
			case 'Completed':
				return 'green'; // Green for these statuses	
			case 'Created':
				return 'orange'
			default:
				return '#FF0000'; // Red for all other statuses
		}
	}
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? theme.colors.surface : theme.colors.surface }}>
			<Header navigation={navigation} type='back' options={{ title: 'Details', subTitle: appointment ? appointment.id.split('-')[4].toUpperCase() : null }} />
			<ScrollView>
				<View style={{ marginHorizontal: 15, marginTop: 15 }}>
					{appointment == null ? <DetailsCards /> : <View>
						<Card.Cover
							style={{ height: width / 1.7, resizeMode: 'cover' }}
							source={{ uri: appointment?.petImage ? appointment.petImage : defaultImage, resizeMode: 'contain' }}
						/>
						<View style={{ marginTop: 10 }}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
								<Text style={{ color: theme.colors.onSurface }}>Status</Text>
								<Text style={{ textTransform: 'uppercase',color: getStatusColor(appointment.status), fontWeight:'bold'}}>{getTempStatus(appointment.status, appointment.serviceType)}</Text>
							</View>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
								<Text style={{ color: theme.colors.onSurface }}>Pet ID</Text>
								<Text style={{ textTransform: 'uppercase', color: theme.colors.onSurface }}>{`${appointment.petId.split('-')[4]}`}</Text>
							</View>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
								<Text style={{ color: theme.colors.onSurface }}>Type</Text>
								<Text style={{ textTransform: 'capitalize', color: theme.colors.onSurface }}>{appointment.petType}</Text>
							</View>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
								<Text style={{ color: theme.colors.onSurface }}>Breed</Text>
								<Text style={{ color: theme.colors.onSurface }}>{appointment.petBreed}</Text>
							</View>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
								<Text style={{ color: theme.colors.onSurface }}>Name</Text>
								<Text style={{ color: theme.colors.onSurface }}>{appointment.petName}</Text>
							</View>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
								<Text style={{ color: theme.colors.onSurface }}>Gender</Text>
								<Text style={{ color: theme.colors.onSurface, textTransform: 'capitalize' }}>{appointment.gender}</Text>
							</View>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
								<Text style={{ color: theme.colors.onSurface }}>Age</Text>
								<Text style={{ color: theme.colors.onSurface }}>{`${appointment.year}.${appointment.month} year(s)`}</Text>
							</View>
						</View>
						<View style={{ marginTop: 10 }}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
								<Text style={{ color: theme.colors.onSurface }}>Appointment Date</Text>
								<Text style={{ color: theme.colors.onSurface }}>{moment.unix(appointment.appointmentDate / 1000).local().format('Do MMMM, YYYY - hh:mm A')}</Text>
							</View>
						</View>
						{/* <Divider bold style={{marginTop: 10}} />
						<View style={{marginTop: 10}}>
							<Text style={{color: theme.colors.onSurface}}>Selected Service(s)</Text>
							{bookedServices && bookedServices.length > 0 && bookedServices.map((service) => <Card key={`appointment-service-${service.name}`} style={{marginVertical: 5}}>
								<Card.Content>
									<View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5}}>
										<Text style={{color: theme.colors.onSurface}}>{service.name}</Text>
										<Text style={{color: theme.colors.onSurface}}>₹{parseFloat(service.rate).toFixed(2)}</Text>
									</View>
									<View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5}}>
										<Text style={{color: theme.colors.onSurface}}>Convenience Fee</Text>
										<Text style={{color: theme.colors.onSurface}}>- ₹{parseFloat(service.convenienceFee).toFixed(2)}</Text>
									</View>
									<View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5}}>
										<Text style={{color: theme.colors.onSurface}}>In-Hand Amount</Text>
										<Text style={{color: theme.colors.onSurface}}>₹{'inHandAmount' in service ? parseFloat(service.inHandAmount).toFixed(2) : parseFloat(parseFloat(service.rate) - parseFloat(service.convenienceFee)).toFixed(2)}</Text>
									</View>
								</Card.Content>
							</Card>)}
						</View> */}
						{isHomeVisit && <Divider bold style={{ marginTop: 10 }} />}
						{isHomeVisit && <View style={{ marginVertical: 10 }}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5, marginBottom: 10 }}>
								<Text style={{ color: theme.colors.onSurface }}>Customer Location</Text>
							</View>
							<HomeVisit navigation={navigation} item={appointment} />
						</View>}
						<Divider bold style={{ marginTop: 10 }} />
						<View style={{ marginTop: 10 }}>
							<Text style={{ color: theme.colors.onSurface }}>Payment Details(s)</Text>
							<Divider bold style={{ marginTop: 10 }} />
							{priceDetails == null ? <ProfileCards nos={1} /> : <Card style={{ marginVertical: 5, marginBottom: 10 }}>
								<Card.Content>
									<Text style={{ color: theme.colors.onSurface }}>Item(s)</Text>
									<Divider bold style={{ marginVertical: 5 }} />
									{/** List Items - Start */}
									{bookedServices.map((service) => <View key={`service-${service.name}`} style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
										<Text style={{ color: theme.colors.onSurface, width: '85%' }} ellipsizeMode='tail' numberOfLines={3}>{service.name}</Text>
										<Text style={{ color: theme.colors.onSurface, width: '15%', textAlign: 'right' }}>₹{parseFloat(service.rate).toFixed(2)}</Text>
									</View>)}
									{/** List Items - End */}

									{/** Discount - Start */}
									{discountDetails && discountDetails.refId == defaultWorkspace.id && <>
										<Divider bold style={{ marginVertical: 5 }} />
										<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
											<Text style={{ color: theme.colors.onSurface, fontStyle: 'italic' }}>Item(s) Total</Text>
											<Text style={{ color: theme.colors.onSurface, fontStyle: 'italic' }}>₹{parseFloat(paymentDetails?.itemCost).toFixed(2)}</Text>
										</View>
										<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
											<Text style={{ color: theme.colors.onSurface }}>Discount {paymentDetails?.discount ? `(${paymentDetails?.coupon})` : ``}</Text>
											<Text style={{ color: theme.colors.onSurface }}>- ₹{paymentDetails?.discount ? parseFloat(paymentDetails?.discount).toFixed(2) : `0.00`}</Text>
										</View>
										<Divider bold style={{ marginVertical: 5 }} />
										<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
											<Text style={{ color: theme.colors.onSurface, fontStyle: 'italic' }}>Gross Total</Text>
											<Text style={{ color: theme.colors.onSurface, fontStyle: 'italic' }}>₹{parseFloat(paymentDetails?.itemCost - paymentDetails?.discount).toFixed(2)}</Text>
										</View>
									</>}
									{/** Discount - End */}
									{/** GST - Start */}
									{appointment.serviceType !== 'VETERINARY' && <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
										<Text style={{ color: theme.colors.onSurface }}>GST</Text>
										<Text style={{ color: theme.colors.onSurface }}>₹{parseFloat(priceDetails.gst).toFixed(2)}</Text>
									</View>}
									{/** GST - END */}
									{/** Amount Paid - Start */}
									<Divider bold style={{ marginVertical: 5 }} />
									<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
										<Text style={{ color: theme.colors.onSurface, fontWeight: '600' }}>Amount Paid</Text>
										<Text style={{ color: theme.colors.onSurface, fontWeight: '600' }}>₹{parseFloat(priceDetails?.amountPaid).toFixed(2)}</Text>
									</View>

									{/** Amount Paid - End */}
									{/** Platform Fee - Start */}
									<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
										<Text style={{ color: theme.colors.onSurface }}>Convenience Fee</Text>
										<Text style={{ color: theme.colors.onSurface }}>- ₹{parseFloat(priceDetails.platformFee).toFixed(2)}</Text>
									</View>
									{/** Platform Fee - End */}


									{/** In Hand Amount - Start */}
									<Divider bold style={{ marginVertical: 5 }} />
									<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
										<Text style={{ color: theme.colors.onSurface, fontWeight: '600', fontStyle: 'italic' }}>In Hand Amount</Text>
										<Text style={{ color: theme.colors.onSurface, fontWeight: '600', fontStyle: 'italic' }}>₹{parseFloat(priceDetails?.inHandAmount).toFixed(2)}</Text>
									</View>
									{/** In Hand Amount - End */}
								</Card.Content>
							</Card>}

						</View>
						{Object.keys(appointment).includes('petPrescription') && appointment.status == 'Completed' && appointment.serviceType == 'VETERINARY' && <>
							<Divider bold style={{ marginTop: 10 }} />
							<View style={{ marginTop: 10 }}>
								<Text style={{ color: theme.colors.onSurface, marginBottom: 10 }}>Prescription Details</Text>
								<FlatList
									ref={listRef}
									data={appointment.petPrescription.images}
									numColumns={2}
									initialNumToRender={10}
									maxToRenderPerBatch={10}
									keyExtractor={item => item.id}
									showsVerticalScrollIndicator={false}
									renderItem={({ item, index }) => <Card onPress={()=>navigation.navigate('FullScreenPrescription',{images:appointment.petPrescription.images})} style={{ position: 'relative', display: 'flex', flexGrow: 1, marginHorizontal: 5, marginBottom: 10 }}>
										<Card.Cover
											style={{ height: width / 1.7,width:width / 1.1, resizeMode: 'cover' }}
											key={index}
											source={{ uri: item, resizeMode: 'contain' }}
										/>
									</Card>}
								/>
								<Text style={{ color: theme.colors.onSurface, marginBottom: 10 }}>Notes</Text>
								<Text style={{ color: theme.colors.onSurface, marginBottom: 10, fontStyle: 'italic', fontWeight: '600' }}>{appointment.petPrescription.prescription}</Text>
							</View>
						</>}
					</View>}
				</View>
				{appointment && appointment.status === 'Complete' && <><Divider bold style={{ marginVertical: 10 }} /><Complete navigation={navigation} item={appointment} onChange={onChange} /></>}
			</ScrollView>
			{appointment && appointment.status === 'Created' && <Created navigation={navigation} item={appointment} config={configParams} onChange={onChange} />}
			{appointment && appointment.status === 'Active' && <Accepted navigation={navigation} item={appointment} config={configParams} onChange={onChange} />}
			{appointment && appointment.status === 'Completed' && <DisabledButton navigation={navigation} item={appointment} config={configParams} status='Completed' icon='check-all' onChange={onChange} />}
			{appointment && appointment.status === 'Partner_Rejected' && <DisabledButton navigation={navigation} item={appointment} config={configParams} status='Rejected By self' onChange={onChange} />}
			{appointment && appointment.status === 'Partner_Cancelled' && <DisabledButton navigation={navigation} item={appointment} config={configParams} status='Cancelled By self' onChange={onChange} />}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
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
})