import React, { useRef, useState, useEffect } from "react";
import moment from "moment";
import {  RefreshControl, View, Text, StyleSheet, VirtualizedList, useColorScheme, Dimensions,TouchableOpacity} from "react-native";
import { RadioButton, Avatar, Button, Divider, List, useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

import Apis from "../../utils/apis";
import Empty from "../../components/common/Empty";
import Toaster from "../../components/common/Toaster";
import Header from "../../components/common/Header";
import ListAddress from "../../components/skeleton/listAddress";
import AppointmentCard from "../../components/cards/appointment";

import { useAuthState } from "../../services/auth";
import { useRollsState } from '../../services/rolls';
import { useWorspaceState } from "../../services/workspace";
import { useAppointmentState } from "../../services/appointments";
import { btn, colors } from "../../utils/styles/gobalstyle";

const api = new Apis();

export default ChangeWorkspace = ({ navigation }) => {
	const theme = useTheme();
	const colorScheme = useColorScheme();
	const listRef = useRef(null);
	const { width, height } = Dimensions.get('window');

	const { userData } = useAuthState();
	const { setRolls } = useRollsState();
	const { setAppointments } = useAppointmentState();
	const { defaultWorkspace, workspacesData, setWorkspaces } = useWorspaceState();

	const [isLoading, setIsLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [defaultSpace, setDetaultSpace] = useState(defaultWorkspace.id);

	const getMyWorkspaces = async (callback) => {
		let workData = await api.getAllWorkspaces(userData.id);
		setWorkspaces(workData);
		callback(true);
	};

	const setAsDefaultWorkSpace = async (workspaceId) => {
		setIsLoading(true);
		api.setDefaultWorkspace(userData.id, workspaceId)
			.then(res => {
				getMyWorkspaces(() => {
					setIsLoading(false);
					setRolls([]);
					setAppointments([]);
					Toaster({ message: 'Default workspace updated!' });
					navigation.goBack();
				});
			}).catch(err => {
				console.log(err);
				setIsLoading(false);
			});
	};

	const onViewableItemsChanged = useRef(({ viewableItems, index }) => {
		if (viewableItems.length > 0) {
			// setActiveIndexItem(viewableItems[0].index)
		}
	}).current;

	// useEffect(() => {
	// 	init();
	// }, []);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? theme.colors.surface : theme.colors.surface }}>
			<Header navigation={navigation} type='back' options={{ title: 'Default Workspace', subTitle: defaultWorkspace.workplaceName }}></Header>
			<View style={{ flex: 1, marginHorizontal: 10, marginTop: 10, marginBottom: 0 }} showsVerticalScrollIndicator={false}>
				{workspacesData && workspacesData.length == 0 ? <ListAddress nos={7} /> : <>
					<VirtualizedList
						decelerationRate={0}
						snapToAlignment="center"
						// contentInset={{top: 0, left: 0, bottom: 0, right: 0}}
						ref={listRef}
						data={workspacesData}
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
						// refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} />}
						getItemLayout={(data, index) => ({ length: (width / 2), offset: (width / 3) * index, index })}
						renderItem={({ item, index }) => <List.Item
							title={item.workplaceName}
							description={item.designationName}
							left={() => (<Avatar.Image size={45} source={{ uri: item.coverImage }} />)}
							right={() => (<RadioButton.Android value={item.id}
								status={defaultSpace === item.id ? 'checked' : 'unchecked'}
								onPress={() => setDetaultSpace(item.id)}
								style={{ marginLeft: 10 }} />)}
							onPress={() => setDetaultSpace(item.id)}
						/>}
						contentContainerStyle={{ justifyContent: 'space-between' }}
						ListFooterComponent={<View style={{ marginBottom: 20 }}></View>}
						ListHeaderComponent={<Text style={{ fontSize: 18, marginLeft: 5, color: theme.colors.onSurface }}>All My Workspaces</Text>}
						ListEmptyComponent={<Empty style={{ width: width - 30 }} title="Empty!" subtitle="Ooops! Currently you don't have any upcoming appointments." />}
					/>
				</>
				}
			</View>
			<View style={{ marginHorizontal: 20, marginBottom: 20 }}>
				<TouchableOpacity 
				mode='elevated'
				disabled={isLoading}
				loading={isLoading}
				style={[btn, { flexGrow: 1 },{alignItems:'center'},{backgroundColor: colors.primary},{borderRadius:50}]}
				onPress={() => setAsDefaultWorkSpace(defaultSpace)}>
					<Text>Change Workspace</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({

})