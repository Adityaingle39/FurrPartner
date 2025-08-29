import {View, Text, ScrollView, Image, StyleSheet} from 'react-native';
import React from 'react';
import Button from '../components/common/Button';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  container,
  justifyContentCenter,
  alignItemsCenter,
  colors,
  flexOne
} from '../utils/styles/gobalstyle';

const Loading = ({navigation}) => {
  const loadingImage = Image.resolveAssetSource(require('../assets/wait.gif')).uri;
  const navigateButton = () => {
    navigation.navigate('CreateWorkspace');
  };

  return (
    <SafeAreaView style={container}>
      <View style={[justifyContentCenter, alignItemsCenter,flexOne]}>
        <Image source={loadingImage} />
        <Text style={styles.loadingText}>Creating Account ...</Text>
      </View>

      {/* just for ui designing */}
      <View
        style={{alignItems: 'center', marginBottom: 40, marginHorizontal: 20}}>
        <Button title="NEXT" onPress={navigateButton} />
      </View>
      {/* just for ui designing */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingText: {
    fontSize: 23,
    fontWeight: 700,
    color: colors.black,
  },
});
export default Loading;
