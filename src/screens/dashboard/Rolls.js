import {
	Alert,
	AppState,
	View,
	Text,
	StyleSheet,
	Image,
	Linking,
	Dimensions,
	FlatList,
	VirtualizedList,
	RefreshControl,
	ScrollView,
	useColorScheme,
	Platform
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, { useRef, useState, useEffect, useContext, useCallback } from 'react';
import { Card, FAB, SegmentedButtons, Chip, IconButton, Button, List, Menu, Divider, Provider as PaperProvider, useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

import Apis from '../../utils/apis';
import Empty from '../../components/common/Empty';
import Header from '../../components/common/Header';
import Toaster from '../../components/common/Toaster';
import ListAddress from '../../components/skeleton/listAddress';

import { useAuthState } from '../../services/auth';
import { useRollsState } from '../../services/rolls';
import { useWorspaceState } from '../../services/workspace';
import { colors } from '../../utils/styles/gobalstyle';

const Rolls = ({ navigation, currentLocation }) => {
	const api = new Apis();
	const theme = useTheme();
	const colorScheme = useColorScheme();
	const bgColor = colorScheme === 'dark' ? theme.colors.surface : theme.colors.surfaceVariant;
	const groomerItemsRef = useRef(null);
	const { width, height } = Dimensions.get('window');

	const { userData } = useAuthState();
	const { rolls, setRolls } = useRollsState();
	const { defaultWorkspace } = useWorspaceState();

	const [reels, setReels] = useState(null);
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	
	const deleteRoll = async (rollId) => {
		Alert.alert('Delete', 'Are you sure you want to delete this roll?',
      [{
				text: 'Cancel',
				style: 'cancel',
			},
			{
				text: 'Delete',
				style: 'destructive',
				onPress: () => {
					api.deleteRoll(rollId)
					.then((res) => {
						Toaster({message: `Roll deleted successfully!`});
						fetchInfo();
					}).catch((error) => {
						console.log('deleteRoll', error);
					})
				}
			}]
		)
	}

	const fetchInfo = () => {
		setLoading(true);
		api.getRolls(userData.id, defaultWorkspace.id)
		.then(res => {
			if (res !== null) {
				if (Array.isArray(res) && res.length > 0){
					setRolls(res);
				}
				setReels(res);
			}
			setLoading(false);
			setRefreshing(false);
		})
		.catch(err => {
			setLoading(false);
			setRefreshing(false);
		});
	}

	const init = () => {
		if (rolls && rolls.length === 0 && reels === null) {
			fetchInfo();
		} else {
			setReels(rolls);
		}
	}

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		fetchInfo();
	}, []);

	useFocusEffect(
    React.useCallback(() => {
			init();
    }, [])
	);

	// useEffect(() => {
	// 	init();
	// },[]);

	return (
		<SafeAreaView style={{flex: 1, backgroundColor: bgColor}}>
			<Header navigation={navigation} type="main" options={{title: 'Rolls', subTitle: defaultWorkspace.workplaceName}} />
			<View style={{ flexGrow: 1, marginHorizontal: 15, borderRadius: 15, marginTop: 20 }}>
				{defaultWorkspace?.status?.toUpperCase() === 'PENDING' ? 
					<View style={{marginHorizontal: 30}}><Empty top={(height / 2) - (width / 1.5)} title="Verification Pending!" subtitle={`We have received your request, it may take upto 2-3 working days to complete the verification process.\n\nContact our support team for further queries.`} /></View> : <PaperProvider>
					<FlatList
						ref={groomerItemsRef}
						data={reels}
						numColumns={2}
						initialNumToRender={10}
						maxToRenderPerBatch={10}
						keyExtractor={item => item.id}
						showsVerticalScrollIndicator={false}
						// getItemCount={data => data.length}
						// getItem={(data, index) => data[index]}
						refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} />}
						renderItem={({ item, index }) => <Card style={{ position: 'relative', display: 'flex', width: (width - 50) / 2, marginHorizontal: 5, marginBottom: 10 }} onPress={() => navigation.navigate('PreviewRolls', { id: item.id })}>
							<Card.Cover
								style={{ height: width / 1.7, resizeMode: 'cover' }}
								key={index}
								source={{ uri: item?.coverImage ? item.coverImage : item.uploaderImage, resizeMode: 'contain' }}
							/>
							<View style={{position: 'absolute', zIndex: 99999, right: 0}}>
								<View style={{flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', alignItems: 'center'}}>
									<Text style={{color: theme.colors.onSurface, backgroundColor: colorScheme === 'dark' ? theme.colors.surfaceVariant : theme.colors.background, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, textTransform: 'capitalize'}}>{item.status === 'Inactive' ? 'Pending' : item.status}</Text>
									<IconButton mode='contained' style={{position: 'relative', left: 0, right: 0}} icon="trash-can-outline" iconColor={colors.red} onPress={() => deleteRoll(item.id)} />
								</View>
							</View>
						</Card>}
						ListEmptyComponent={() => <View style={{ paddingHorizontal: 40 }}>
							<Empty title="Empty" subtitle="Ooops! Currently you don't have any created rolls." />
						</View>}
					>
					</FlatList>
				</PaperProvider>}
			</View>
			<FAB
				icon="plus"
				disabled={defaultWorkspace?.status?.toUpperCase() === 'PENDING'}
				color={colors.white}
				style={[styles.fab, {backgroundColor: defaultWorkspace?.status?.toUpperCase() === 'PENDING' ? colors.lightGrey : colors.primary}]}
				onPress={() => navigation.navigate('CreateRoll')}
			/>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: Platform.OS == 'ios' ? 80 : 60,
	borderRadius: 50
  },
});

export default Rolls;