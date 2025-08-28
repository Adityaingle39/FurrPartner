import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	ScrollView,
	TouchableOpacity,
	Image,
	Pressable,
	useColorScheme,
	Platform,
	Alert,
	Linking
} from 'react-native';
import moment from 'moment';
import React, { useState, useEffect, useRef } from 'react';
import { useRoute } from '@react-navigation/native';
import { Avatar, Checkbox, List, IconButton, TextInput, Switch, Button, useTheme } from 'react-native-paper';
import { SheetProvider, SheetManager, registerSheet } from "react-native-actions-sheet";
import ImagePicker from 'react-native-image-crop-picker';
import DatePicker from 'react-native-date-picker';
import LocationPicker from '../../components/common/LocationPicker';

import Apis from '../../utils/apis';
import { randomString, requestAndroidGalleryPermission, requestLocationAccess } from '../../utils/helpers';
import { validateFields } from '../../utils/validations';
import Header from '../../components/common/Header';
import Toaster from '../../components/common/Toaster';
import Stepper from '../../components/common/Stepper';
import Dropdown from '../../components/common/Dropdown';
import { useAuthState } from '../../services/auth';
import { useServiesState } from '../../services/services';
import { useWorspaceState } from '../../services/workspace';
import {
	spacingProperty,
	heading,
	subHeading,
	container,
	defaultInputContainer,
	flexDirectionRow,
	btn,
	colors,
	inputText,
	justifyContentCenter,
} from '../../utils/styles/gobalstyle';

const WorkDetails = ({ navigation }) => {
	const api = new Apis();
	const route = useRoute();
	const theme = useTheme();
	const colorScheme = useColorScheme();
	const bgColor = colorScheme === 'dark' ? theme.colors.surface : theme.colors.surfaceVariant;

	const { userData } = useAuthState();
	const { services, setServices } = useServiesState();
	const { newWorkspace, workspacesData, setWorkspaces } = useWorspaceState();

	const [location, setLocation] = useState(null);
	const [allDay, setAllDay] = useState(false);

	//All services
	const [selectedValue, setSelectedValue] = useState('');
	const [selectedValueObject, setSelectedValueObject] = useState(null);
	const [serviceList, setserviceList] = useState([]);
	const [dirty, setDirty] = useState(false);
	const [isLoadingMap, setIsLoadingMap] = useState(false);
	//schedule time
	const [startTime, setStartTime] = useState(null);
	const [endTime, setEndTime] = useState(null);
	const [openStartTime, setOpenStartTime] = useState(false);
	const [openEndTime, setOpenEndTime] = useState(false);
	const [breakStartTime, setBreakStartTime] = useState(null);
	const [breakEndTime, setBreakEndTime] = useState(null);
	const [openBreakStartTime, setOpenBreakStartTime] = useState(false);
	const [openBreakEndTime, setOpenBreakEndTime] = useState(false);
	//form useState
	const [adminDesignationName, setDesignation] = useState('');
	const [adminPhone, setAdminPhone] = useState('');
	const [adminExperience, setExperience] = useState('');
	const [adminAbout, onChangeAbout] = useState('');
	const [adminWorkplaceName, onChangeWorkplaceName] = useState('');
	const [adminAddress, onChangeAddress] = useState('');
	const [adminTown, onChangeTown] = useState('');
	const [adminCity, onChangeCity] = useState('');
	const [adminPincode, onChangePincode] = useState('');
	const [adminState, onChangeState] = useState('');
	const [educationList, setEducationList] = useState(['']);
	const [expertiseList, setExpertiseList] = useState(['']);
	const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
	const [images, setImages] = useState([]);
	const [characterCountText, setCharacterCountText] = useState(0);
	const [remainingCharacters, setRemainingCharacters] = useState(1000);
	const [hasLocationPermission, setHasLocationPermission] = useState(false);
	const [manualLocationInput, setManualLocationInput] = useState('');

	const handleLocationChange = (lat, long) => {
		setLocation({ latitude: lat, longitude: long });
		// locationSheetRef.current?.hide();
	};

	const fetchServices = async () => {
		api
			.getServices(userData.id)
			.then(res => {
				setserviceList(res);
				setServices(res);
			})
			.catch(err => {
				console.log('all services', err.message);
			});
	};
	const openGallery = async () => {
		const hasPermission = await requestAndroidGalleryPermission();
		if (hasPermission) {
			selectImages();
		} else {
			Alert.alert(
				'Galary Permission Denied',
				'To use the Gallery, please enable Gallery permissions in settings.',
				[
					{ text: 'Cancel', style: 'cancel' },
					{
						text: 'Open Settings',
						onPress: () => Linking.openSettings(),
					},
				]
			);
		}
	};

	const selectImages = () => {
		ImagePicker.openPicker({
			multiple: true,
			writeTempFile: true,
			maxFiles: 5,
			mediaType: 'photo'
		})
			.then(selectedImages => {
				if (selectedImages.length > 5) {
					Toaster({ message: 'You can select a maximum of 5 images.' });
					return;
				}
				const newImages = selectedImages.map(image => {
					let imageName = `workspace-${randomString(6)}.jpg`;
					return {
						uri: image.path,
						type: image.mime,
						name: imageName,
					};
				});
				setImages(newImages);
			})
			.catch(error => {
				console.log(error);
			});
	};
	const removeUploadedImage = (index) => {
		const uploadsTmp = images.filter((item, i) => i !== index);
		setImages(uploadsTmp);
	}

	const handleValueChange = itemValue => {
		setSelectedValue(itemValue);
		const selectedService = serviceList.find(
			service => service.id === itemValue,
		);
	};

	const addMoreEducation = () => {
		setEducationList([...educationList, '']);
	};

	const removeMoreEducation = (index) => {
		const tmpListing = [...educationList];
		tmpListing.splice(index, 1);
		setEducationList(tmpListing);
	}

	const handleEducationChange = (index, value) => {
		const updatedList = [...educationList];
		updatedList[index] = value;
		setEducationList(updatedList);
	};

	// added for new input expertise feild on add more
	const addMoreExpertise = () => {
		setExpertiseList([...expertiseList, '']);
	};

	const removeMoreExpertise = (index) => {
		const tmpListing = [...expertiseList];
		tmpListing.splice(index, 1);
		setExpertiseList(tmpListing);
	}

	const handleExpertiseChange = (index, value) => {
		const updatedList = [...expertiseList];
		updatedList[index] = value;
		setExpertiseList(updatedList);
	};

	// added for checkbox selection
	const handle24by7 = checked => {
		if (!checked) {
			setSelectedCheckboxes(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
		} else {
			setSelectedCheckboxes([]);
		}
		setAllDay(preState => !preState);
	};

	const handleCheckboxClick = (label, status) => {
		if (selectedCheckboxes.includes(label)) {
			setSelectedCheckboxes(
				selectedCheckboxes.filter(value => value !== label),
			);
		} else {
			setSelectedCheckboxes([...selectedCheckboxes, label]);
		}

		if (allDay && selectedCheckboxes.length == 7) {
			setAllDay(preState => !preState);
		} else if (!allDay && status == false && selectedCheckboxes.length == 6) {
			setAllDay(preState => !preState);
		}
	};
	///Character count

	const handleCharacterLimit = (text) => {
		// console.log("event", text);
		onChangeAbout(text);
		const characterCount = text.length;
		const remainingCharacters = 1000 - characterCount;
		// const characterCountText = `${characterCount}/1000 characters`;
		setCharacterCountText(characterCount);
		setRemainingCharacters(remainingCharacters)

		if (characterCount > 1000) {
			// Display toaster message for exceeding character limit
			Toaster({ message: 'You have exceeded the character limit.' });
		}
	}

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
					}
				},
			});
		} else {
			setIsLoadingMap(false);
		}
	};

	// Pincode validation
	const handlePincodeChange = text => {
		// Filter out non-numeric characters
		const numericValue = text.replace(/[^0-9]/g, '');
		onChangePincode(numericValue);
	};
	const navigateButton = () => {

		if (adminWorkplaceName.length == 0) {
			Toaster({ message: 'Please Fill Workspace name' });
			return
		}
		else if (adminAddress.length == 0) {
			Toaster({ message: 'Please Fill Address' });
			return
		}
		// else if (adminTown.length == 0) {
		// 	Toaster({ message: 'Please Fill Area' });
		// 	return
		// }
		else if (adminCity.length == 0) {
			Toaster({ message: 'Please Fill city' });
			return
		}
		else if (adminPincode.length < 6) {
			Toaster({ message: 'Pincode must be 6 digits' });
			return
		}
		else if (adminState.length == 0) {
			Toaster({ message: 'Please Fill State' });
			return
		}
		setDirty(true);
		const validationError = validateFields({
			adminWorkplaceName,
			adminAddress,
			// adminTown,
			adminCity,
			adminPincode,
			adminState,
			startTime,
			endTime,
			breakStartTime,
			breakEndTime,
			selectedCheckboxes,
			location: location || manualLocationInput
		});

		if (validationError) {
			Toaster({ message: validationError });
			setDirty(false);
		} else {
			if (images.length === 0) {
				Toaster({ message: 'Please select at least one workspace image.' });
				setDirty(false);
				return;
			}
			const userId = userData.id;
			let tmpWorkSpaces = [...workspacesData];
			let myWorkSpace = {
				workplaceName: adminWorkplaceName,
				collaboratorId: userId,
				address: adminAddress,
				// town: adminTown,
				city: adminCity,
				pincode: adminPincode,
				state: adminState,
				latitude: location ? location.latitude : null,
				longitude: location ? location.longitude : null,
				manualLocation: !location ? manualLocationInput : null,
				uploadImages: images,
				workplaceTime: {
					days: selectedCheckboxes,
					start_time: moment(startTime).format('hh:mm A'),
					end_time: moment(endTime).format('hh:mm A'),
					lunch_break: {
						start_time:
							moment(breakStartTime).format('hh:mm A'),

						end_time:
							moment(breakEndTime).format('hh:mm A')

					},
				},
			};
			const tmpMyWorkSpace = Object.assign(newWorkspace, myWorkSpace);
			tmpWorkSpaces.push(tmpMyWorkSpace);
			setWorkspaces(tmpWorkSpaces);
			navigation.navigate('PricingDetails', { selectedName: route.params.selectedName });
			setDirty(false);
		}
	};

	useEffect(() => {
		if (
			services &&
			((Array.isArray(services) && services.length == 0) ||
				(typeof services == 'object' && services.name == null))
		) {
			fetchServices();
		}
		handle24by7(allDay)
		requestLocationAccess();
		registerSheet('select-location', LocationPicker);
		setDirty(false);
	}, []);


	const handleManualLocationInput = (text) => {
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
							error={dirty && (location === null || location === '')}
							value={location !== null ? `${location.latitude.toString().substring(0, 12)}, ${location.longitude.toString().substring(0, 12)}` : null}
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
					error={dirty && !manualLocationInput}
					value={manualLocationInput}
					placeholder="Enter your location manually"
					placeholderTextColor={theme.colors.onSurfaceVariant}
					onChangeText={handleManualLocationInput}
				/>
			);
		}
	};

	return (
		<SafeAreaView style={[container, { backgroundColor: bgColor }]}>
			<Header navigation={navigation} type="back" options={{ title: 'Create Workspace', subTitle: 'Workspace Details' }}></Header>
			<ScrollView>
				<View style={{ marginHorizontal: 20, paddingTop: 15 }}>
					{/* <Stepper steps={3} active={1}></Stepper> */}

					{/* <Text style={[styles.listViewText, spacingProperty['mb-5'], spacingProperty['mt-15'], { color: theme.colors.onSurface }]}>
						Workspace Details
					</Text> */}

					<View style={spacingProperty['mb-15']}>
						<TextInput
							style={[spacingProperty['mb-15']]}
							mode="outlined"
							label="Workspace Name*"
							error={dirty &&  adminWorkplaceName === ''}
							placeholder="Enter your workspace name"
							placeholderTextColor={theme.colors.onSurfaceVariant}
							onChangeText={onChangeWorkplaceName}
						/>
						<TextInput
							style={[spacingProperty['mb-15']]}
							mode="outlined"
							label="Address*"
							error={dirty && adminAddress === ''}
							placeholder="Enter Address (Office No. Building)"
							placeholderTextColor={theme.colors.onSurfaceVariant}
							multiline={true}
							onChangeText={onChangeAddress}
						/>
						{/* <TextInput
							style={[spacingProperty['mb-15']]}
							mode="outlined"
							label="Area*"
							error={dirty && adminTown === ''}
							placeholder="Enter Locality / Area"
							placeholderTextColor={theme.colors.onSurfaceVariant}
							onChangeText={onChangeTown}
						/> */}
						<TextInput
							style={[spacingProperty['mb-15']]}
							mode="outlined"
							label="City*"
							error={dirty &&  adminCity === ''}
							placeholder="Enter City"
							placeholderTextColor={theme.colors.onSurfaceVariant}
							value={adminCity}
							onChangeText={(text) => {
								const alphabeticText = text.replace(/[^a-zA-Z\s]/g, '');
								onChangeCity(alphabeticText);
							}}
						/>
						<TextInput
							style={[spacingProperty['mb-15']]}
							mode="outlined"
							label="Pincode*"
							error={dirty && (adminPincode === '' || adminPincode.length < 6)}
							placeholder="Enter Pincode"
							placeholderTextColor={theme.colors.onSurfaceVariant}
							onChangeText={handlePincodeChange}
							keyboardType="numeric"
							maxLength={6}
							helperText={dirty && adminPincode.length < 6 ? "Pincode must be 10 digits" : ""}
						/>

						<TextInput
							style={[spacingProperty['mb-15']]}
							mode="outlined"
							label="State*"
							error={dirty && adminState === ''}
							placeholder="Enter State"
							placeholderTextColor={theme.colors.onSurfaceVariant}
							onChangeText={onChangeState}
						/>

						<View style={spacingProperty['mb-0']}>
							{renderLocationInput()}
						</View>
					</View>

					<View style={{ marginTop: 10 }}>
						<View style={{ flexDirection: 'row' }}>
							<Text style={[styles.listViewText, spacingProperty['mb-10'], { marginTop: 5 }, { color: theme.colors.onSurface }]}>
								Working Days*
							</Text>
							<View
								style={[
									styles.checkboxRow,
									{ flexGrow: 1, justifyContent: 'flex-end' },
								]}>
								<Switch value={allDay} onValueChange={() => handle24by7(allDay)} />
								<Text style={[styles.checkboxText, { color: theme.colors.onSurface }]}>All Days</Text>
							</View>
						</View>
						<View style={[styles.container, { marginBottom: 15 }]}>
							<View style={styles.checkboxRow}>
								<Checkbox.Android
									status={
										selectedCheckboxes.includes('Mon') ? 'checked' : 'unchecked'
									}
									onPress={() => handleCheckboxClick('Mon', selectedCheckboxes.includes('Mon'))}
									color={colors.primary}
									uncheckColor={'red'}
								/>
								<Text style={[styles.checkboxText, { color: theme.colors.onSurface }]}>Mon</Text>
							</View>
							<View style={styles.checkboxRow}>
								<Checkbox.Android
									status={
										selectedCheckboxes.includes('Tue') ? 'checked' : 'unchecked'
									}
									onPress={() => handleCheckboxClick('Tue', selectedCheckboxes.includes('Tue'))}
									color={colors.primary}
									uncheckColor={'red'}
								/>
								<Text style={[styles.checkboxText, { color: theme.colors.onSurface }]}>Tue</Text>
							</View>
							<View style={styles.checkboxRow}>
								<Checkbox.Android
									status={
										selectedCheckboxes.includes('Wed') ? 'checked' : 'unchecked'
									}
									onPress={() => handleCheckboxClick('Wed', selectedCheckboxes.includes('Wed'))}
									color={colors.primary}
									uncheckColor={'red'}
								/>
								<Text style={[styles.checkboxText, { color: theme.colors.onSurface }]}>Wed</Text>
							</View>
							<View style={styles.checkboxRow}>
								<Checkbox.Android
									status={
										selectedCheckboxes.includes('Thu') ? 'checked' : 'unchecked'
									}
									onPress={() => handleCheckboxClick('Thu', selectedCheckboxes.includes('Thu'))}
									color={colors.primary}
									uncheckColor={'red'}
								/>
								<Text style={[styles.checkboxText, { color: theme.colors.onSurface }]}>Thu</Text>
							</View>
							<View style={styles.checkboxRow}>
								<Checkbox.Android
									status={
										selectedCheckboxes.includes('Fri') ? 'checked' : 'unchecked'
									}
									onPress={() => handleCheckboxClick('Fri', selectedCheckboxes.includes('Fri'))}
									color={colors.primary}
									uncheckColor={'red'}
								/>
								<Text style={[styles.checkboxText, { color: theme.colors.onSurface }]}>Fri</Text>
							</View>
							<View style={styles.checkboxRow}>
								<Checkbox.Android
									status={
										selectedCheckboxes.includes('Sat') ? 'checked' : 'unchecked'
									}
									onPress={() => handleCheckboxClick('Sat', selectedCheckboxes.includes('Sat'))}
									color={colors.primary}
									uncheckColor={'red'}
								/>
								<Text style={[styles.checkboxText, { color: theme.colors.onSurface }]}>Sat</Text>
							</View>
							<View style={styles.checkboxRow}>
								<Checkbox.Android
									status={
										selectedCheckboxes.includes('Sun') ? 'checked' : 'unchecked'
									}
									onPress={() => handleCheckboxClick('Sun', selectedCheckboxes.includes('Sun'))}
									color={colors.primary}
									uncheckColor={'red'}
								/>
								<Text style={[styles.checkboxText, { color: theme.colors.onSurface }]}>Sun</Text>
							</View>
						</View>
						<View style={[styles.container, { marginBottom: 15 }]}>
							<Text style={[styles.listViewText, spacingProperty['mb-10'], { marginTop: 5 }, { color: theme.colors.onSurface }]}>
								Start & End Time*
							</Text>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
								<View style={{ flexGrow: 1 }}>
									<TouchableOpacity
										title="Open"
										onPress={() => setOpenStartTime(true)}
										style={[defaultInputContainer, { borderColor: theme.colors.onSurfaceVariant }]}>
										<Text style={{ color: theme.colors.onSurface }}>
											{startTime
												? new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
												: 'Select a start time'}
										</Text>

									</TouchableOpacity>
									<DatePicker
										modal
										open={openStartTime}
										date={startTime ? moment(startTime).toDate() : new Date()}
										mode="time"
										onConfirm={date => { setOpenStartTime(false); setStartTime(date); }}
										onCancel={() => { setOpenStartTime(false); }}
									/>
								</View>
								<View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
									<Text style={{ fontWeight: 600, color: theme.colors.onSurface }}>-</Text>
								</View>
								<View style={{ flexGrow: 1 }}>
									<TouchableOpacity
										title="Open"
										onPress={() => setOpenEndTime(true)}
										style={[defaultInputContainer, { borderColor: theme.colors.onSurfaceVariant }]}>
										<Text style={{ color: theme.colors.onSurface }}>
											{endTime
												? new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
												: 'Select a end time'}
										</Text>
									</TouchableOpacity>
									<DatePicker
										modal
										open={openEndTime}
										date={endTime ? moment(endTime).toDate() : new Date()}
										mode="time"
										onConfirm={date => { setOpenEndTime(false); setEndTime(date); }}
										onCancel={() => { setOpenEndTime(false); }}
									/>
								</View>
							</View>
						</View>
						<View style={[styles.container, { marginBottom: 15 }]}>
							<Text style={[styles.listViewText, spacingProperty['mb-10'], { marginTop: 5 }, { color: theme.colors.onSurface }]}>
								Add Break Time (eg. lunch break)*
							</Text>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
								<View style={{ flexGrow: 1 }}>
									<TouchableOpacity
										title="Open"
										onPress={() => setOpenBreakStartTime(true)}
										style={[defaultInputContainer, { borderColor: theme.colors.onSurfaceVariant }]}>
										<Text style={{ color: theme.colors.onSurface }}>
											{breakStartTime
												? new Date(breakStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
												: 'Select a start time'}
										</Text>
									</TouchableOpacity>
									<DatePicker
										modal
										open={openBreakStartTime}
										date={breakStartTime ? moment(breakStartTime).toDate() : new Date()}
										mode="time"
										onConfirm={date => { setOpenBreakStartTime(false); setBreakStartTime(date); }}
										onCancel={() => { setOpenBreakStartTime(false); }}
									/>
								</View>
								<View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
									<Text style={{ fontWeight: 600, color: theme.colors.onSurface }}>-</Text>
								</View>
								<View style={{ flexGrow: 1 }}>
									<TouchableOpacity
										title="Open"
										onPress={() => setOpenBreakEndTime(true)}
										style={[defaultInputContainer, { borderColor: theme.colors.onSurfaceVariant }]}>
										<Text style={{ color: theme.colors.onSurface }}>
											{breakEndTime
												? new Date(breakEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
												: 'Select a start time'}
										</Text>
									</TouchableOpacity>
									<DatePicker
										modal
										open={openBreakEndTime}
										date={breakEndTime ? moment(breakEndTime).toDate() : new Date()}
										mode="time"
										onConfirm={date => { setOpenBreakEndTime(false); setBreakEndTime(date); }}
										onCancel={() => { setOpenBreakEndTime(false); }}
									/>
								</View>
							</View>
						</View>

						<Text
							style={[
								styles.listViewText,
								spacingProperty['mb-10'],
								spacingProperty['mt-20'], { color: theme.colors.onSurface }
							]}>
							Upload*
						</Text>
						<Text style={[subHeading, { color: theme.colors.outline, paddingLeft: 0 }]}>
							Upload Images of yourself and your workspace.
						</Text>
						<TouchableOpacity
							onPress={openGallery}
							style={[styles.uploadButton, spacingProperty['mt-10'], { backgroundColor: colors.primary }]}>
							<Text style={[styles.uploadButtonText, { color: colors.white },]}>Choose File..</Text>
						</TouchableOpacity>
						<View style={[styles.imagesBorder, { marginTop: 10, borderColor: theme.colors.outline, borderWidth: images && images.length > 0 ? 1 : 0 }]}>
							{images && images.length > 0 ? images.map((image, index) => (<List.Item
								key={`uploaded-workspace-image-${index}`}
								title={image.name}
								style={{ paddingRight: 0, borderTopWidth: index > 0 ? 1 : 0, borderColor: '#e8e8e8' }}
								left={props => <Avatar.Image size={54} source={{ uri: image.uri }} />}
								right={props => <IconButton icon="close" style={{ marginRight: 0 }} onPress={() => removeUploadedImage(index)} />}
							></List.Item>)) : null}
						</View>
					</View>
				</View>
			</ScrollView>
			<View style={[spacingProperty['m-20']]}>
				<Button disabled={dirty} style={[btn, { width: '100%' }]} labelStyle={{ fontSize: 20 }} mode="contained" buttonColor={colors.primary} textColor={colors.white} onPress={navigateButton}>Next</Button>
			</View>
			{/* <LocationPicker actionSheetRef={locationSheetRef} id="edit-profile-location" onChange={handleLocationChange} /> */}
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
		borderRadius: 6,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 10,
		paddingHorizontal: 20,
		borderColor: '#919191'
	},
	listViewText: {
		fontSize: 16,
		fontWeight: 500,
		// color: '#000000',
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

		borderWidth: 1,

		borderRadius: 5,
		paddingLeft: 20,
		fontSize: 15,
		height: 45,
	},
	addMoreText: {
		fontSize: 15,
		color: colors.primary,
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

		alignItems: 'center',
		justifyContent: 'center',
	},
	uploadButtonText: {
		fontSize: 14,
		fontWeight: 600,
	},
});

export default WorkDetails;
