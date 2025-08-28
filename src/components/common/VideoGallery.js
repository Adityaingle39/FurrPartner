import {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, useColorScheme} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import ActionSheet from 'react-native-actions-sheet';
import { useTheme } from 'react-native-paper';

const VideoGallery = ({actionSheetRef, id, options}) => {
  const theme= useTheme();
  const colorScheme = useColorScheme();
  const bgColor = colorScheme === 'dark' ? theme.colors.surface : theme.colors.surfaceVariant;
  let isGalleryPickerRequired = options.gallery == true ? true : false;
  let isCameraPickerRequired = options.camera == true ? true : false;
  
  return (
    <ActionSheet
			id={id}
			ref={actionSheetRef}
			style={{ padding: 0, margin: 0 }}
			containerStyle={{paddingBottom: 0, marginBottom: 0, backgroundColor: bgColor}}
		>
			<View style={{flexDirection: 'row'}}>
				{isGalleryPickerRequired == true ? <View style={styles.optionCol}>
					<TouchableOpacity style={styles.galleryPhoto} onPress={options.galleryCallback}>
						<Icons name="photo-size-select-actual" size={30} color="#979797"></Icons>
					</TouchableOpacity>
					<Text style={{color: theme.colors.onSurface}}>From Gallery</Text>
				</View> : null}
				{isCameraPickerRequired ? <View style={styles.optionCol}>
					<TouchableOpacity style={styles.galleryPhoto} onPress={options.cameraCallback}>
						<Icons name="camera-alt" size={30} color="#979797"></Icons>
					</TouchableOpacity>
					<Text style={{color: theme.colors.onSurface}}>Take Video</Text>
				</View> : null}
			</View>
		</ActionSheet>
  );
};

const styles = StyleSheet.create({
  galleryPhoto: {
    backgroundColor: '#FFFFFF',
    width: '40%',
    height: 65,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
	optionCol: {
		flexGrow: 1,
		justifyContent: 'center',
		alignItems: 'center',
		margin: 20,
	},
});
export default VideoGallery;
