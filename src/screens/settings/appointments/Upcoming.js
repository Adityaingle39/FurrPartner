import React, {useRef, useState, useEffect} from "react";
import moment from "moment";
import {  RefreshControl, View, Text, StyleSheet, VirtualizedList, useColorScheme, Dimensions } from "react-native";
import { IconButton, Card, Divider, List, useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

import Apis from "../../../utils/apis";
import Empty from "../../../components/common/Empty";
import Header from "../../../components/common/Header";
import ListAddress from "../../../components/skeleton/listAddress";
import AppointmentCard from "../../../components/cards/appointment";

import { useAuthState } from "../../../services/auth";
import { useWorspaceState } from "../../../services/workspace";
import { useAppointmentState } from "../../../services/appointments";

const api = new Apis();

export default AppointmentsUpcoming = ({navigation}) => {
	const theme = useTheme();
	const colorScheme = useColorScheme();
	const listRef = useRef(null);
	const {width, height} = Dimensions.get('window');

	const {userData}  = useAuthState();
	const {defaultWorkspace} = useWorspaceState();
	const {appointments, activeAppointments, setAppointments} = useAppointmentState();

	const [activeItemIndex, setActiveIndexItem] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
	const [allAppointments, setAllAppointments] = useState(null);

	const getAllAppointments = (type) => {
		api.getWorkspaceAppointments(userData.id, defaultWorkspace.id, { status: 'all' })
		.then(res => {
			const responseData = res && res.length > 0 ? res : [];
			setAppointments(responseData);
			setRefreshing(false);
			setIsLoading(false);
			setAllAppointments(activeAppointments());
		}).catch(err => {
			console.log("getAllAppointments Error: ", err);
			setRefreshing(false);
			setIsLoading(false);
		});
	}

	const onViewableItemsChanged = useRef(({ viewableItems, index }) => {
		if (viewableItems.length > 0) {
			setActiveIndexItem(viewableItems[0].index)
		}
	}).current;

	const init = () => {
		if (!(defaultWorkspace.status == 'PENDING')) {
			if (appointments && appointments.length === 0 && allAppointments !== undefined && allAppointments !== null) {
				getAllAppointments('');
			}
		}
	}

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		getAllAppointments('');
	}, []);

	useFocusEffect(
		React.useCallback(() => {
			if (!(defaultWorkspace.status == 'PENDING')) {
				setAllAppointments(activeAppointments());
			}
		}, [])
	);

	useEffect(() => {
		init();
	}, []);

	return (
		<SafeAreaView style={{flex:1, backgroundColor: colorScheme === 'dark' ? theme.colors.surface : theme.colors.surfaceVariant}}>
			<Header navigation={navigation} type='back' options={{title: 'Appointments', subTitle: 'Upcoming'}}></Header>
			<View style={{marginHorizontal: 10, marginTop: 10, marginBottom: allAppointments && allAppointments.length > 0 ? 105 : 0}} showsVerticalScrollIndicator={false}>
				{defaultWorkspace.status == 'PENDING' ? 
					<View style={{marginHorizontal: 30}}><Empty top={(height / 2) - (width / 1.5)} title="Verification Pending!" subtitle={`We have recieved your request, it may take upto 2-3 working days to complete the verification process.\n\nContact our support team for further queries`} /></View> : <>
					{allAppointments === null ? <ListAddress nos={7} /> : <VirtualizedList
						decelerationRate={0}
						snapToAlignment="center"
						// contentInset={{top: 0, left: 0, bottom: 0, right: 0}}
						ref={listRef}
						data={allAppointments 
							? allAppointments
								.filter(item => !(item.serviceType === 'GROOMING' && item.status === 'Complete')) // Filter out completed grooming appointments
								.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)) // Sort by appointmentDate in descending order
							: []}						
						horizontal={false}
						initialNumToRender={10}
						maxToRenderPerBatch={10}
						indicatorStyle="black"
						persistentScrollbar={false}
						// progressViewOffset={30}
						removeClippedSubviews={true}
						keyExtractor={item => item.id}
						getItemCount={data => data.length}
						showsVerticalScrollIndicator={false}
						getItem={(data, index) => data[index]}
						onViewableItemsChanged={onViewableItemsChanged}
						refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} />}
						getItemLayout={(data, index) => ({length: (width / 2), offset: (width / 3) * index, index})}
						renderItem={({ item, index }) => <AppointmentCard type='Active' navigation={navigation} item={item} />}
						contentContainerStyle={{ justifyContent: 'space-between' }}
						ListFooterComponent={<View style={{marginBottom: 20}}></View>}
						ListHeaderComponent={<Text style={{ fontSize: 18, marginLeft: 5, color: theme.colors.onSurface }}>All Appointments</Text>}
						ListEmptyComponent={<Empty style={{width: width - 30}} title="Empty!" subtitle="Ooops! Currently you don't have any upcoming appointments." />}
					/>}
					</>
				}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
 
})