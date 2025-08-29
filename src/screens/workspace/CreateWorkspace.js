import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import React,{useEffect} from 'react';
import {
  spacingProperty,
  heading,
  subHeading,
  container,
  btn,
  btnText,
  colors,
} from '../../utils/styles/gobalstyle';
import { Button, useTheme } from 'react-native-paper';
import { BackHandler,Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import RNExitApp from 'react-native-exit-app';

const CreateWorkspace = ({navigation}) => {
  const colorScheme = useColorScheme();
  const welcomeLight = Image.resolveAssetSource(require('../../assets/welcome-pet.png')).uri;
  const welcomeDark = Image.resolveAssetSource(require('../../assets/welcome-pet-dark.png')).uri;
  const navigateButton = () => {
    navigation.navigate('InformationDetails');
  };
  const theme = useTheme();

  const isFocused = useIsFocused();
  useEffect(() => {
  }, [isFocused]);
  useEffect(() => {
    const backAction = () => {
      if (isFocused) {
        Alert.alert(
          "Hold On!",
          "Are you sure you want to exit?",
          [
            {
              text: "CANCEL", onPress: () => "Null",
            },
            { text: "Yes", onPress: () => RNExitApp.exitApp() }
          ]
        );
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction);
    return () => backHandler.remove();
  }, [isFocused]);

  return (
    <SafeAreaView style={[container, { justifyContent: 'center' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View>
          {useColorScheme() === 'dark' ? (
            <Image
              style={{ width: 300, height: 300 }}
              source={{ uri: welcomeDark }}
              resizeMode="contain"
            />
          ) : (
            <Image
              style={{ width: 300, height: 300 }}
              source={{ uri: welcomeLight }}
              resizeMode="contain"
            />
          )}
        </View>
        <View style={spacingProperty['m-30']}>
          <View style={styles.textContainer}>
            <Text style={[heading, { color: theme.colors.onSurface }]}>Hey! Welcome</Text>
            <Text style={[subHeading, { color: theme.colors.outline, textAlign: 'center' }]}>
              Let’s create your workspace now for easy and efficient management
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button style={btn} buttonColor={colors.primary} textColor={colors.white} icon="plus-circle-outline" mode="contained" onPress={navigateButton}>
              Create Workspace
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  iconStyle: {
    color: colors.white,
    fontSize: 25,
  },
  skipText: {
    fontSize: 17,
  },
});

export default CreateWorkspace;
