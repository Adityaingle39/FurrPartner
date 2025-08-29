import * as React from 'react';
import { Dimensions, Image, useColorScheme, View } from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { Portal, Button, Text, useTheme } from 'react-native-paper';
import { useNetInfoInstance } from "@react-native-community/netinfo";

const NoInternet = () => {
	const theme = useTheme();
	const colorScheme = useColorScheme();
	const { width, height } = Dimensions.get('window');
	const { netInfo: { type: internetType, isConnected }, refresh } = useNetInfoInstance();
	const logoImage = colorScheme === 'dark' ? Image.resolveAssetSource(require('../assets/fc-icon-white.png')).uri : Image.resolveAssetSource(require('../assets/fc-icon-blue.png')).uri; 
  
	return (<Portal>
		<SafeAreaView style={{flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center', paddingHorizontal: 20, backgroundColor: colorScheme == 'dark' ? theme.colors.background : theme.colors.surfaceVariant}}>
			<View style={{flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
				<Image source={{uri: logoImage}} style={{width: 105, height: 75, marginBottom: 50}} />
				<Text style={{color: theme.colors.onSurface, fontSize: 25, textAlign: 'center', marginBottom: 15}}>Internet Down</Text>
				<Text style={{color: theme.colors.onSurface, fontSize: 18, textAlign: 'center', marginBottom: 15}}>Ooops! There is a problem with your internet connection.</Text>
				<Button icon="wifi-sync" mode="contained" onPress={() => refresh()}>
					Fix
				</Button>
			</View>
		</SafeAreaView>
  </Portal>);
};

export default NoInternet;