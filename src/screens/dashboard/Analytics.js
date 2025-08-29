import {
	View,
	Text,
	ScrollView,
	Image,
	TouchableOpacity,
	StyleSheet,
	useColorScheme
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { RadioButton, Chip, Avatar, IconButton, Divider, useTheme } from 'react-native-paper';
import Icons from 'react-native-vector-icons/Feather';
import {SafeAreaView} from 'react-native-safe-area-context';
import Apis from '../../utils/apis';
import Header from '../../components/common/Header';

import { useWorspaceState } from '../../services/workspace';
import { colors, flexDirectionRow } from '../../utils/styles/gobalstyle';

const Analytics = ({ navigation }) => {
	const api = new Apis();
	const theme = useTheme();
	const colorScheme = useColorScheme();
	const bgColor = colorScheme === 'dark' ? theme.colors.surface : theme.colors.surfaceVariant;
	const filterTypes = [{type: 'WEEKLY', title: 'Weekly'}, {type: 'MONTHLY', title: 'Monthly'}];
	const data = {
    "patient": { title: 'Patients', total: 0, current: 0, previous: 0 },
    "reviews": { title: 'Reviews', total: 0, current: 0, previous: 0 },
    "appointments": { title: 'Appointments', total: 0, current: 0, previous: 0 },
    "status": { title: 'Status', cancelled: 0, rejected: 0, accepted: 0 },
		"services": [], //Appointments
	};
	const { defaultWorkspace } = useWorspaceState();

	const [filterType, setFilterType] = useState('MONTHLY');
	const [getSelectionMode, setSelectionMode] = useState(1);
	const [ViewArea, setViewArea] = useState(1);
	const [analyticsData, setAnalyticsData] = useState(data);
	const [isLoading, setLoading] = React.useState(false);
	
	const getAnalticsData = (type) => {
		try {
			setLoading(true);
			api.getAnaltics(defaultWorkspace.collaboratorId, defaultWorkspace.id, type ? type : filterType)
			.then(res => {
				// console.log("res", res);
				setAnalyticsData(res);
			}).catch(error => {
				throw error;
			});
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	};

	const getData = (type) => {
		setFilterType(type);
		getAnalticsData(type);
	}

	const init = () => {
		// setAnalyticsData(data);
		getAnalticsData();
	}

	useEffect(() => {
		init();
	}, []);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
			<Header navigation={navigation} options={{title: 'Analytics', subTitle: 'Report'}}></Header>
			<ScrollView style={{ marginHorizontal: 15, marginTop: 20 }}>
				<View style={{marginTop: 0, marginBottom: 10, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
					<Text style={[styles.sublistViewText, { color: theme.colors.onSurface }]}>Daily Analytics</Text>
					
					<View style={{flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'flex-end'}}>
						{filterTypes.map(filter => <View key={`filter-${filter.type}`} style={{marginLeft: 15}}>
							<Chip selected={filter.type === filterType} showSelectedOverlay={true} selectedColor={colorScheme === 'dark' ? colors.white : colors.primary} disabled={false} onPress={() => getData(filter.type)}>{filter.title}</Chip>
						</View>)}
					</View>
				</View>

				<View>
					<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
						<InfoBlock navigation={navigation} item={analyticsData.patient} />
						<InfoBlock navigation={navigation} item={analyticsData.reviews} />
					</View>
					<InfoBlock navigation={navigation} item={analyticsData.appointments} style={{width: 'auto'}} />
				</View>

				<View style={{ alignItems: 'center', marginTop: 10 }}>
					<View style={styles.appoanalyticsView}>
						{analyticsData && analyticsData.services && analyticsData.services.length > 0 && <Text style={{ fontSize: 20, color: theme.colors.onSurface, fontWeight: 600 }}>Service Based</Text>}
						{analyticsData && analyticsData.services && analyticsData.services.length > 0 && analyticsData?.services.map((serivce) => <><View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
							<Text style={{ color: theme.colors.onSurface, fontSize: 15 }}>{serivce?.name}</Text>
							<Text style={{ fontSize: 15, color: theme.colors.onSurface, fontWeight: 500, marginRight: 10 }}>{serivce.value}</Text>
						</View>
						<Divider style={{marginVertical: 10}} /></>)}
						<Text style={{ fontSize: 20, color: theme.colors.onSurface, fontWeight: 600, marginTop: 0 }}>Status Based</Text>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
							<Text style={{ color: theme.colors.onSurface, fontSize: 15 }}>Accepted</Text>
							<Text style={{ fontSize: 15, color: theme.colors.onSurface, fontWeight: 500, marginRight: 10 }}>{analyticsData?.status?.accepted ?? 0}</Text>
						</View>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
							<Text style={{ color: theme.colors.onSurface, fontSize: 15 }}>Rejected</Text>
							<Text style={{ fontSize: 15, color: theme.colors.onSurface, fontWeight: 500, marginRight: 10 }}>{analyticsData?.status?.rejected ?? 0}</Text>
						</View>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
							<Text style={{ color: theme.colors.onSurface, fontSize: 15 }}>Cancelled</Text>
							<Text style={{ fontSize: 15, color: theme.colors.onSurface, fontWeight: 500, marginRight: 10 }}>{analyticsData?.status?.cancelled ?? 0}</Text>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const InfoBlock = ({navigation, item, style}) => {
	const theme = useTheme();
	const colorScheme = useColorScheme();
	const trend = item?.previous && item?.current ? (item?.current < item?.previous ? 'down' : 'up') : 'neutral';
	const trendColor = trend == 'down' ? colors.red : (trend == 'neutral' ? colors.orange : colors.green);

	return (<View style={[styles.dashboardCard, style, { flexGrow: 1 }]}>
		<View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15, marginVertical: 10, alignItems: 'center'}}>
			<Text style={[styles.dashboardtitle, { color: theme.colors.onSurface }]}>{item.title}</Text>
			<Image source={require('../../assets/dashImg1.png')}></Image>
		</View>
		<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15, marginVertical: 10, alignItems: 'center'}}>
			<Text style={[styles.dashboardtitleNo, { color: theme.colors.onSurface }]}>
				{item?.total ?? 0}
			</Text>

			<View style={{ alignItems: 'center' }}>
				<Text style={styles.innerdashupperText}>{item?.current ?? 0} {item?.current < item?.previous ? 'less' : 'more'}</Text>
				<Text style={[styles.innerdashText, { color: theme.colors.onSurface }]}>from last month</Text>
			</View>
		</View>
		<View style={{flexDirection: 'row', marginHorizontal: 15, marginVertical: 10, justifyContent: 'space-between'}}>
			<Text style={{fontSize: 12, fontWeight: 500, marginLeft: 5, color: trendColor}}>
				Trends
			</Text>
			<Text style={{color: theme.colors.onSurface}}><Icons name={`trending-${trend}`} size={20} style={{ color: trendColor }}></Icons></Text>
		</View>
	</View>)
}

const styles = StyleSheet.create({
	profileName: {
		fontSize: 15,
		fontWeight: 600,
		color: '#000000',
	},
	profileDes: {
		fontWeight: 500,
		color: '#898A8D',
	},
	listViewText: {
		fontSize: 18,
		fontWeight: 500,
		color: '#000000',
		marginLeft: 5,
	},
	sublistViewText: {
		fontSize: 16,
		fontWeight: 500,
		color: '#000000',
		marginLeft: 5,
	},
	dashboardCard: {
		height: 'auto',
		flexGrow: 1,
		// width: '45%',
		margin: 5,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#DADADA',
	},
	dashboardImage: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 10,
	},
	dashboardText: {
		textAlign: 'center',
		marginTop: 5,
		color: '#8391A1',
		fontSize: 15,
		fontWeight: 500,
	},
	dashboardtitle: {
		fontSize: 15,
		fontWeight: 600,
		color: '#000000',
	},
	dashboardtitleNo: {
		fontSize: 30,
		color: '#000000',
		fontWeight: 800,
	},
	innerdashText: {
		fontSize: 10,
	},
	innerdashupperText: {
		color: '#3193EC',
		fontSize: 12,
		fontWeight: 500,
	},
	appoanalyticsView: {
		width: "100%",
		borderWidth: 1,
		borderColor: '#DADADA',
		borderRadius: 10,
		padding: 20,

	}
});

export default Analytics;
