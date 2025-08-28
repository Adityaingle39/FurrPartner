import React, { useState, useEffect, useMemo } from 'react';
import { Dimensions, ScrollView, Alert, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { RadioButton, Button, Modal, Portal, Divider, TextInput, Switch, Provider as PaperProvider, useTheme } from 'react-native-paper';

import Toaster from './Toaster';

import { Calculate, inHandAmount, randomString } from '../../utils/helpers';
import { inputText, justifyContentCenter, flexDirectionRow, alignItemsCenter, spacingProperty } from '../../utils/styles/gobalstyle';

const AddService = ({ isVisible, platformFee, videoCallFee, workspaceType, serviceName, options, isGstApplicable, onChange }) => {
	const theme = useTheme();
	const {width, height} = Dimensions.get('window');

	// const [calculate, setCalculate] = useState(new Calculate({"type": "%", "value": 10}, {"type": "$", "value": 20}, isGstApplicable));
	// const calculate = useMemo(() => new Calculate({"type": "%", "value": 10}, {"type": "$", "value": 20}, isGstApplicable), [Calculate])
	const calculate = useMemo(() => {
		let calcRef = new Calculate(platformFee, videoCallFee, isGstApplicable);
		// console.log("options", options.rate);
		if (options !== null) calcRef.setRate(parseFloat(options.rate));

		return calcRef;
	}, [Calculate, options]);

	const [name, setName] = useState(options?.name);
  const [serviceDescription, setServiceDescription] = useState(options?.description);
  const [servicePrice, setServicePrice] = useState(options?.rate?.toString());
	const [isHomeVisit, setIsHomeVisit] = useState(options?.isHomeVisit ? options.isHomeVisit : false);
	const [isVet, setIsVet] = useState(workspaceType === 'Veterinary');

	const handleCalculation = (price) => {
		if (price) {
			if (typeof price == 'string') {
				calculate.setRate(parseFloat(price));
				setServicePrice(price);
			} else {
				calculate.setRate(price);
				setServicePrice(price);
			}
		} else {
			setServicePrice(0);
		}
	}

	const handleSubmission = () => {
		console.log(isVet, ((name ? name : serviceName) == '' || (name ? name : serviceName) == null))
		if (servicePrice == '' || servicePrice == null || servicePrice == undefined) {
			Toaster({message: `Please enter a price`});
		} else if (isVet == false && ((name ? name : serviceName) == '' || (name ? name : serviceName) == null)) {
			Toaster({message: `Please enter service name`});
		} else {
			const response = {
				name: name ? name : serviceName,
				description: serviceDescription,
				rate: servicePrice,
				isHomeVisit: isHomeVisit,
				inHandAmount: calculate.inHandAmount,
				convenienceFee: calculate.platformFee
			}

			if (isGstApplicable) {
				response['gstPrice'] = calculate.gst;
			}
	
			// console.log("response", response);
			onChange(response);
		}
	}

	const handleClose = () => {
		setIsVet(workspaceType == 'Veterinary');
		setName(null);
		setServiceDescription(null);
		setServicePrice(null);
		setIsHomeVisit(false);

		onChange(false);
	}

	useEffect(() => {
	}, []);

	return (
		<Portal>
			<Modal
				style={styles.centeredView}
				animationType={'fade'}
				transparent={true}
				visible={isVisible}
				onDismiss={() => onChange(false)}
			>
				<View style={{flex: 1, zIndex: 99999, alignContent: 'center', flexDirection: 'column', minHeight: height / 2, maxHeight: height / 1.6, width: width * 0.8, backgroundColor: theme.colors.background}}>
					<ScrollView style={{flex: 1, overflow: 'scroll', padding: 15}}>
						<View>
							<Text style={{fontSize: 18, color: theme.colors.onSurface, marginBottom: 10}}>Service Details</Text>
							<Divider />
						</View>
						<View style={{marginVertical: 10, flex: 1}}>
							{isVet ? <Text style={{fontSize: 17, color: theme.colors.onSurfaceVariant, marginVertical: 10}}>{options !== null ? options.name : serviceName}</Text>: <TextInput mode='outlined' label='Name*' style={[{color: theme.colors.onSurfaceVariant, borderColor: theme.colors.outline}]} onChangeText={setName} value={name} placeholderTextColor={theme.colors.surfaceVariant} placeholder="Enter Service Name" />}
							<TextInput mode='outlined' label='Description' style={[{color: theme.colors.onSurfaceVariant, borderColor: theme.colors.outline}]} onChangeText={(text) => setServiceDescription(text)} value={serviceDescription} placeholderTextColor={theme.colors.surfaceVariant} placeholder="Enter Service Description" />
							{!isVet && <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 5}}>
								<Text style={{fontWeight: '600', color: theme.colors.onSurface, marginRight: 25}}>Visit Type</Text>
								{/* <Switch value={isHomeVisit} onValueChange={setIsHomeVisit} /> */}
								<RadioButton.Group onValueChange={newValue => setIsHomeVisit(newValue)} value={isHomeVisit}>
									<View style={{flexDirection: 'row', flexGrow: 1}}>
										<View style={{flexDirection: 'row', alignItems: 'center'}}>
											<Text style={{color: theme.colors.onSurfaceVariant}}>Center</Text>
											<RadioButton.Android value={false} />
										</View>
										<View style={{flexDirection: 'row', alignItems: 'center'}}>
											<Text style={{color: theme.colors.onSurfaceVariant}}>Home</Text>
											<RadioButton.Android value={true} />
										</View>
									</View>
								</RadioButton.Group>
							</View>}
							<View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 5,marginTop:10}}>
								<Text style={{fontWeight: '600', color: theme.colors.onSurface, marginRight: 25}}>Rate*: </Text>
								<TextInput mode='outlined' label='Price*' style={[{flexGrow: 1, color: theme.colors.onSurfaceVariant, borderColor: theme.colors.outline, fontSize: 16}]} onChangeText={(text) => handleCalculation(text)} value={servicePrice} placeholderTextColor={theme.colors.surfaceVariant} placeholder="Enter Service Price" keyboardType="numeric" returnKeyType="done" />
							</View>
							<Divider />
							<Text style={{fontSize: 15, color: theme.colors.onSurface, marginVertical: 10}}>Details</Text>
							<View style={{flexDirection: 'row', alignItems: 'center'}}>
								<Text style={{fontWeight: '600', color: theme.colors.onSurface, marginRight: 25}}>Platform Fee (10%):</Text>
								<Text style={{flexGrow: 1, textAlign: 'right', fontSize: 17, color: theme.colors.onSurface, marginRight: 25}}>₹ {calculate.platformFee ? calculate.platformFee : 0}</Text>
							</View>
							{(workspaceType !== 'Veterinary' && isGstApplicable) && <View style={{flexDirection: 'row', alignItems: 'center'}}>
								<Text style={{fontWeight: '600', color: theme.colors.onSurface, marginRight: 25}}>GST (18%):</Text>
								<Text style={{flexGrow: 1, textAlign: 'right', fontSize: 17, color: theme.colors.onSurface, marginRight: 25}}>₹ {calculate.gst ? calculate.gst : 0}</Text>
							</View>}
							<Divider style={{marginVertical: 5}} />
							<View style={{flexDirection: 'row', alignItems: 'center'}}>
								<Text style={{fontWeight: '600', color: theme.colors.onSurface, marginRight: 25}}>In-Hand Amount**:</Text>
								<Text style={{flexGrow: 1, textAlign: 'right', fontSize: 17, color: theme.colors.onSurface, marginRight: 25}}>₹ {calculate.inHandAmount ? calculate.inHandAmount : 0}</Text>
							</View>
							<Text style={{color: theme.colors.outline}}>*Amount will be charged to customer</Text>
							<Text style={{color: theme.colors.outline}}>**Amount will be transferred to your account</Text>
							<Divider style={{marginVertical: 10}} />
						</View>
					</ScrollView>
					
					<View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, paddingBottom: 15}}>
						<Button mode="outlined" onPress={handleClose}>Cancel</Button>
						<Button mode="contained" onPress={handleSubmission}>Submit</Button>
					</View>
				</View>
			</Modal>
		</Portal>
	)
};

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	inputStyle: {
		borderRadius: 5, borderWidth: 1, padding: 10
	}
});

export default AddService;