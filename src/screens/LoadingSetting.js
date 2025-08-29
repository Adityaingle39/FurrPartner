import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import FastImage from 'react-native-fast-image';

const LoadingSetting = ({ navigation }) => {
  const theme = useTheme();

  const navigateButton = () => {
    navigation.navigate('Dashboard');
  };

  return (
    <SafeAreaView style={container}>
      <View style={[justifyContentCenter, alignItemsCenter, flexOne]}>
        {/* ✅ FastImage ensures GIF plays properly */}
        <FastImage
          style={{ width: '100%', height: 400 }}
          source={require('../assets/workspaceCreatedSuccefull.gif')}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Text
          style={[
            styles.loadingText,
            { color: theme.colors.onSurface },
          ]}
        >
          Your Workspace is ready!
        </Text>
      </View>

      <View style={{ alignItems: 'center', marginBottom: 40, marginHorizontal: 20 }}>
        <Button
          style={btn}
          buttonColor={colors.primary}
          textColor={colors.white}
          icon="check-all"
          mode="contained"
          onPress={navigateButton}
        >
          Next
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingText: {
    fontSize: 23,
    fontWeight: '700', // must be string
    color: colors.black,
  },
});

export default LoadingSetting;
