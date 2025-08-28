import moment from "moment";
import React, {useEffect, useState, useRef} from "react";
import { Text, View, StyleSheet, Dimensions, useColorScheme } from "react-native";
import { IconButton, Card, Divider, List, useTheme } from 'react-native-paper';

import IconCustom from "../common/IconCustom";

import { getIconTextName } from "../../utils/helpers";

const AppointmentCard = ({navigation, type, item}) => {
	const theme = useTheme();
	const colorScheme = useColorScheme();
	const { width, height } = Dimensions.get('window');
	const cardWidth = width - 30;
	const cardHeight = width / 1.7;

	const [icon, setIcon] = useState('chevron-right');
	const [isHomeVisit, setIsHomeVisit] = useState(false);

	const setIconType = () => {
		switch(item.status) {
			case 'Created': return 'alert-circle-outline';
			// case 'Active': return '';
			case 'Partner_Rejected': return 'cancel';
			case 'Admin_Rejected' : return 'cancel';
			case 'Auto_Rejected' : return 'cancel';
			case 'Rejected' : return 'cancel';
			case 'Complete': return item.serviceType === "GROOMING" ? 'check-all' : 'check';
			case 'Completed': return 'check-all';
			case 'Admin_Completed': return 'check-all';
			case 'AUTO_COMPLETED' : return 'check-all';
			case 'User_cancelled' : return 'close-circle-outline';
			case 'Cancelled' : return 'close-circle-outline';
			case 'Partner_Cancelled': return 'close-circle-outline';
			case 'Admin_Cancelled' : return 'close-circle-outline';
			default: return 'chevron-right';
		}
	}

	useEffect(() => {
		if (item.serviceType === 'GROOMING') {
			let bookedServices = [];
			
			// Check if bookedServices exists and is valid JSON
			if (item.bookedServices) {
				try {
					const parsedServices = JSON.parse(item.bookedServices);
					// Ensure that parsedServices is an array
					if (Array.isArray(parsedServices)) {
						bookedServices = parsedServices;
					}
				} catch (error) {
					console.error('Invalid JSON in bookedServices:', error);
				}
			}
	
			setIsHomeVisit(bookedServices.findIndex(i => i.isHomeVisit) > -1);
		} else {
			setIsHomeVisit(item.type === 'Home Visit');
		}
	}, [item]);
	console.log(item)
	

	return (<Card key={`appointment-${type}-${item.id}`} elevation={1} style={{marginVertical: 5, marginHorizontal: 5}} onPress={() => navigation.navigate('AppointmentDetails', {id: item.id})}>
		<Card.Title
			title={item.petName}
			subtitle={`${item.petType} - ${item.petBreed}`}
			subtitleStyle={{textTransform: 'capitalize'}}
			left={(props) => item && "petImage" in item && item.petImage !== null ?
				<IconCustom {...props} type="image" style={{justifyContent: 'center', alignSelf: 'center'}} source={item.petImage} size={45} square={false}></IconCustom> :
				<IconCustom {...props} type="text" style={{justifyContent: 'center', alignSelf: 'center'}} source={getIconTextName(item.petName.toUpperCase())} size={45} square={false}></IconCustom>
			}
			right={(props) => <IconButton {...props} icon={setIconType()} onPress={() => {}} />}
		/>
		<Card.Content>
			<View style={{flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center'}}>
				<Text style={{ color: theme.colors.onSurface, fontSize: 15 }}>Booking #</Text>
				<Text style={{ color: theme.colors.onSurface, marginTop: 5, textTransform: 'uppercase' }}>{`${item.id.split('-')[4]}`}</Text>
			</View>
			{item.serviceType !== 'VETERINARY' && <View style={{flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center'}}>
				<Text style={{fontSize: 15, color: theme.colors.onSurface}}>Booked Services</Text>
				<Text style={{fontSize: 15, color: theme.colors.onSurface}}>{item.bookedServices ? JSON.parse(item.bookedServices).length : 0}</Text>
			</View>}
			<View style={{flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center'}}>
				<Text style={{fontSize: 15, color: theme.colors.onSurface}}>Type</Text>
				<Text style={{fontSize: 15, color: theme.colors.onSurface, textTransform: 'capitalize'}}>{isHomeVisit ? 'Home Visit' : item.type}</Text>
			</View>
			<View style={{flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center'}}>
				<Text style={{fontSize: 15, color: theme.colors.onSurface}}>Date</Text>
				<Text style={{fontSize: 15, color: theme.colors.onSurface}}>{moment.unix(item.appointmentDate / 1000).local().format('Do MMMM, YYYY - hh:mm A')}</Text>
			</View>
		</Card.Content>
	</Card>);
}

const styles = StyleSheet.create({});

export default AppointmentCard;