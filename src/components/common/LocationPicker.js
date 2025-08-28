import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Platform, View, Image, PanResponder, Text, TouchableOpacity, Dimensions, StyleSheet, PermissionsAndroid, useColorScheme } from 'react-native';
import ActionSheet from "react-native-actions-sheet";
import Geolocation from 'react-native-geolocation-service';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { FAB, Divider, IconButton, Searchbar, SegmentedButtons, useTheme } from 'react-native-paper';
import { colors } from '../../utils/styles/gobalstyle';
import { setCurrentLocation, requestLocationAccess } from '../../utils/helpers';

const LocationPicker = ({ sheetId, payload }) => {
	const theme = useTheme();
	const colorSheme = useColorScheme();
	const locationSheetRef = useRef(null);
	const width = Dimensions.get('window').width;
	const height = Dimensions.get('window').height;
	const mapHeight = (height / 100) * 70;
	const markerImage = Image.resolveAssetSource(require('../../assets/marker.png'));

	const [region, setRegion] = useState({
		latitude: 18.492642812814694,
		longitude: 73.84691339654461,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421,
	});
	const [selectedRegion, setSelectedRegion] = useState(region);

	const onCancel = () => {
		locationSheetRef?.current?.hide();
	}

	const onSelected = () => {
		try {
			if (payload && "onChange" in payload && typeof payload.onChange == 'function') {
				// console.log(selectedRegion);
				payload.onChange(selectedRegion.latitude, selectedRegion.longitude);
			}
			locationSheetRef?.current?.hide();
		} catch (error) {
			console.error('Error in onSelected:', error);
		}
	};

	const setCurrentLocation = useCallback(async () => {
		try {
			Geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					console.log(latitude, longitude);
					if (latitude && longitude) {
						setRegion({
							latitude: latitude,
							longitude: longitude,
							latitudeDelta: 0.0922,
							longitudeDelta: 0.0421,
						});
						setSelectedRegion(position.coords);
					}
				},
				(error) => {
					console.log('Failed to get current location', error);
				},
				{ enableHighAccuracy: true, timeout: 300000, maximumAge: 240000 }
			);
		} catch (error) {
			console.error('Error in setCurrentLocation:', error);
		}
	}, [setRegion]);


	const handleMapDrag = (coords) => {
		setSelectedRegion(coords);
		setRegion(coords);
	}

	useEffect(() => {
		const location = async () => {
			const location = null; //await getLocation();
			if (location) {
				setRegion({
					latitude: location.latitude,
					longitude: location.longitude,
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421,
				});
			}
		}
		requestLocationAccess();
		location();
		// return () => actionSheetRef.current?.hide();
	}, [setRegion, requestLocationAccess]);

	return (
		<ActionSheet
			style={{ padding: 0, margin: 0 }}
			containerStyle={{ paddingBottom: 0, marginBottom: 0, backgroundColor: colorSheme === 'dark' ? theme.colors.surfaceVariant : theme.colors.background }}
			closeOnTouchBackdrop={false}
			ref={locationSheetRef}
			id={sheetId}
		>
			<View style={styles.header}>
				<View style={{ flexGrow: 1 }}>
					<IconButton icon="close" iconColor={colors.red} size={30} onPress={onCancel} />
				</View>
				<Text style={[styles.heading, { color: theme.colors.onSurface }]}>Select Location</Text>
				<View>
					<IconButton icon="check" iconColor={colors.green} size={30} onPress={onSelected} />
				</View>
			</View>
			<View style={{ ...StyleSheet.absoluteFillObject, height: (height / 100) * 70, width: width, position: 'relative' }}>
				{/* <View style={{ zIndex: 9999, position: 'absolute', top: (height - 80) / 2, left: (width - 50) / 2 }}>
					<Image source={markerImage} style={{ width: 38, height: 47 }} />
				</View> */}
				<MapView
					mapType={Platform.OS == "android" ? "standard" : "standard"}
					style={{ ...StyleSheet.absoluteFillObject, height: mapHeight, width: width, flex: 1 }}
					provider={PROVIDER_GOOGLE}
					onRegionChange={handleMapDrag}
					initialRegion={region}
				// region={region}
				>
					<Marker draggable={true} coordinate={{ latitude: parseFloat(region.latitude.toFixed(3)), longitude: parseFloat(region.longitude.toFixed(3)) }} onDragEnd={(e) => setSelectedRegion(e.nativeEvent.coordinate)} />
				</MapView>
				<FAB
					icon="crosshairs-gps"
					style={[styles.fab, { backgroundColor: theme.colors.onPrimaryContainer }]}
					color={theme.colors.primaryContainer}
					onPress={setCurrentLocation}
				/>
			</View>
		</ActionSheet>
	)
}

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		padding: 10
	},
	fab: {
		position: 'absolute',
		margin: 16,
		borderRadius: 50,
		// backgroundColor: colors.primary,
		right: 10,
		bottom: 10,
	},
	heading: { flexGrow: 1, alignSelf: 'center', fontSize: 20, fontWeight: '600', color: '#000000' }
});

export default LocationPicker;