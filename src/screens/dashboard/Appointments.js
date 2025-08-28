import React, {useRef, useState, useEffect} from "react";
import moment from "moment";
import { SafeAreaView, RefreshControl, View, Text, StyleSheet, VirtualizedList, useColorScheme, Dimensions } from "react-native";
import { IconButton, Card, Divider, List, useTheme } from 'react-native-paper';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

import Apis from "../../utils/apis";
import Empty from "../../components/common/Empty";
import Header from "../../components/common/Header";
import ListAddress from "../../components/skeleton/listAddress";
import AppointmentCard from "../../components/cards/appointment";

import { useAuthState } from "../../services/auth";
import { useWorspaceState } from "../../services/workspace";
import { useAppointmentState } from "../../services/appointments";

const api = new Apis();
let interval = null;

export default Appointments = ({navigation}) => {
	const theme = useTheme();
	const colorScheme = useColorScheme();
	const listRef = useRef(null);
	const {width, height} = Dimensions.get('window');

	const {userData}  = useAuthState();
	const {defaultWorkspace} = useWorspaceState();
	const {appointments, activeAppointments, setAppointments} = useAppointmentState();

	const [activeItemIndex, setActiveIndexItem] = useState(null);
  	const [refreshing, setRefreshing] = useState(false);
	const [allAppointments, setAllAppointments] = useState(null);
	const isFocused = useIsFocused();

	const getAllAppointments = (type) => {
		api.getWorkspaceAppointments(userData.id, defaultWorkspace.id, { status: 'all' })
		.then(res => {
			// console.log("res",res)
			const responseData = res && res.length > 0 ? res : [];
			setAppointments(responseData);
			setRefreshing(false);
			setAllAppointments(activeAppointments());
		}).catch(err => {
			console.log("getAllAppointments Error: ", err);
			setRefreshing(false);
		});
	}

	const onViewableItemsChanged = useRef(({ viewableItems, index }) => {
		if (viewableItems.length > 0) {
			setActiveIndexItem(viewableItems[0].index)
		}
	}).current;

	const init = () => {
		if (!(defaultWorkspace?.status?.toUpperCase() === 'PENDING'|| defaultWorkspace.locked == true)) {
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
			if (!(defaultWorkspace?.status?.toUpperCase() === 'PENDING')) {
				setAllAppointments(activeAppointments());
			}
		}, [])
	);

	useEffect(() => {
		if (!interval) {
			getAllAppointments('');
			interval = setInterval(() => {  getAllAppointments(''); }, 5000);
		}
		

		return () => {
			setTimeout(() => {
				if (interval) {
					clearInterval(interval);
					interval = null;
				}
			}, 30000);
		}
	}, [isFocused]);

	return (
		<SafeAreaView style={{flex:1, backgroundColor: colorScheme === 'dark' ? theme.colors.surface : theme.colors.surfaceVariant}}>
			<Header navigation={navigation} type='main' options={{title: 'Appointments', subTitle: 'Upcoming'}}></Header>
			<View style={{marginHorizontal: 10, marginTop: 10, marginBottom: allAppointments && allAppointments.length > 0 ? 105 : 0}} showsVerticalScrollIndicator={false}>
				{defaultWorkspace?.status?.toUpperCase() === 'PENDING' ? 
					<View style={{marginHorizontal: 30}}><Empty top={(height / 2) - (width / 1.5)} title="Verification Pending!" subtitle={`We have received your request, it may take upto 2-3 working days to complete the verification process.\n\nContact our support team for further queries.`} /></View> : <>
					{allAppointments === null ? <ListAddress nos={7} /> : <VirtualizedList
						decelerationRate={0}
						snapToAlignment="center"
						// contentInset={{top: 0, left: 0, bottom: 0, right: 0}}
						ref={listRef}
						data={allAppointments.filter(item => !(item.serviceType === 'GROOMING' && item.status === 'Complete'))} 
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
						ListHeaderComponent={<Text style={{ fontSize: 18, marginLeft: 5, color: theme.colors.onSurface }}>My Appointments</Text>}
						ListEmptyComponent={<Empty style={{width: width - 30}} title="Empty!" subtitle="Ooops! Currently, you don't have any upcoming appointments." />}
					/>}
					</>
				}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
 
})