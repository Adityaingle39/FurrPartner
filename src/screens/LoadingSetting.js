import {View, Text, ScrollView, Image, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import React from 'react';
import {
  btn,
  container,
  justifyContentCenter,
  alignItemsCenter,
  colors,
  flexOne
} from '../utils/styles/gobalstyle';
import { Button, useTheme } from 'react-native-paper';

const LoadingSetting = ({navigation}) => {
  const theme=useTheme();
  const loadingImage = Image.resolveAssetSource(require('../assets/workspaceCreatedSuccefull.gif')).uri;
  
  const navigateButton = () => {
    navigation.navigate('Dashboard');
  };
  
  return (
    <SafeAreaView style={container}>
      <View style={[justifyContentCenter, alignItemsCenter,flexOne]}>
        <Image style={{width: '100%', height: 400}} source={{uri: loadingImage}} />
        <Text style={[styles.loadingText,{color:theme.colors.onSurface}]}>Your Workspace is ready!</Text>
      </View>

      {/* just for ui designing */}
      <View
        style={{alignItems: 'center', marginBottom: 40, marginHorizontal: 20}}>
        {/* <Button title="NEXT" onPress={navigateButton} /> */}
        <Button style={btn} buttonColor={colors.primary} textColor={colors.white} icon="check-all" mode="contained" onPress={navigateButton}>
          Next
        </Button>
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
export default LoadingSetting;
