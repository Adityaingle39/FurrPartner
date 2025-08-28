import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft } from 'iconsax-react-native';
import { IconButton } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ImageViewer from 'react-native-image-zoom-viewer';
const { width, height } = Dimensions.get('window');
const FullScreenPrescription = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { images } = route.params;

  const imageUrls = images.map((image) => ({ url: image }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <ImageViewer
        imageUrls={imageUrls}
        backgroundColor="black"
        renderIndicator={() => null} // Hide default indicator
        enableSwipeDown={true}
        onSwipeDown={() => navigation.goBack()}
        style={styles.imageViewer}
        saveToLocalByLongPress={false}
      />
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
        <IconButton icon={() => <ArrowLeft size={25} color={"white"} />} />
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 10,
  },
  imageViewer: {
    width: '100%',
    height: '100%',
  },
});
export default FullScreenPrescription;