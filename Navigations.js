import React, { useEffect, useState, useContext } from 'react';
import { IconButton, useTheme } from 'react-native-paper';
import { Linking, Platform, Alert, BackHandler, StyleSheet, useColorScheme } from 'react-native';
import { NavigationContainer, createNavigationContainerRef, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getDeviceId } from 'react-native-device-info';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import messaging from '@react-native-firebase/messaging';
import { useNetInfoInstance } from "@react-native-community/netinfo";

//Authentication Screens
import SignIn from './src/screens/auth/SignIn';
import OTPVerify from './src/screens/auth/OTPVerify';
import BasicInfo from './src/screens/auth/BasicInfo';

import Loading from './src/screens/Loading';

import Home from './src/screens/dashboard/Home';
import Appointments from './src/screens/dashboard/Appointments';
import Analytics from './src/screens/dashboard/Analytics';
import Settings from './src/screens/dashboard/Settings';
import AppointmentsUpcoming from './src/screens/settings/appointments/Upcoming';
import AppointmentsPrevious from './src/screens/settings/appointments/Previous';
import RequestsAccepted from './src/screens/settings/requests/Accepted';
import RequestsRejected from './src/screens/settings/requests/Rejected';
import RequestsCancelled from './src/screens/settings/requests/Cancelled';
import AppointmentDetails from './src/screens/AppointmentDetails';
import MyView from './src/screens/MyView';

import ChangeWorkspace from './src/screens/settings/ChangeWorkspace';
import CreateWorkspace from './src/screens/workspace/CreateWorkspace';
import InformationDetails from './src/screens/workspace/InformationDetails';
import WorkDetails from './src/screens/workspace/WorkDetails';
import PricingDetails from './src/screens/workspace/PricingDetails';
import AadharCard from './src/screens/workspace/documents/AadharCard';
import PanCard from './src/screens/workspace/documents/PanCard';
import DoctorsLicense from './src/screens/workspace/documents/DoctorsLicense';
import EducationCertificates from './src/screens/workspace/documents/EducationCertificates';
import BankDetails from './src/screens/workspace/documents/BankDetails';
import Verification from './src/screens/workspace/documents/Verification';
import RequiredVerification from './src/screens/workspace/documents/RequiredVerification';

import LoadingSetting from './src/screens/LoadingSetting';
import Notification from './src/screens/dashboard/Notification';
import Rolls from './src/screens/dashboard/Rolls';
import HomeListView from './src/navigation/screens/HomeListView';
import WelcomeScreen from './src/screens/WelcomeScreen';
import VerifyEmail from './src/screens/emailVerification/VerifyEmail';
// Setting Screens
import BasicInformation from './src/screens/settings/BasicInformation';
import BankInformation from './src/screens/settings/BankInformation';
import WorkspaceInformation from './src/screens/settings/WorkspaceInformation';
import WorkspaceServices from './src/screens/settings/WorkspaceServices';
import VideoCall from './src/screens/services/VideoCall';

import EmailVerification from './src/screens/emailVerification/EmailVerification';

import ServiceList from './src/screens/services/List';
import ListDetails from './src/screens/services/ListDetails';
import VacationStatus from './src/screens/settings/VacationStatus';
import CreateRoll from './src/screens/rolls/CreateRoll';
import HelpCenters from './src/screens/settings/HelpCenters';
import Faqs from './src/screens/settings/FaqS';
import PreviewRolls from './src/screens/rolls/PreviewRolls';
import GstVerification from './src/screens/workspace/documents/GstVerification';

import NoInternet from './src/screens/NoInternet';
import DeleteAccount from './src/screens/settings/DeleteAccount';

import { colors } from './src/utils/styles/gobalstyle';
import { useDeviceState } from './src/services/device';
import { setData } from './src/utils/db';
import FullScreenPrescription from './src/components/common/FullScreenPrescription';

export const navigationRef = createNavigationContainerRef();

const Navigations = ({ initialRoute, theme }) => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const screenOptions = { headerShown: false, unmountOnBlur: true, animation: 'fade' };

  const { netInfo: { type: internetType, isConnected }, refresh } = useNetInfoInstance();
  /**Dvice Information */
	const { setDeviceData } = useDeviceState();
	const [initialRouteName, setInitialRouteName] = useState(initialRoute);
	/** Device Information */

  /** LINKING */
  const configLinking = {
    screens: {
      SignIn: 'login',
      // OTPScreen: 'verify',
      // BasicInfo: 'info',
      HomeListView: 'home',
      Rolls: 'rolls',
      Notification: 'notifications',
      Setting: 'settings',
    },
  };

  const linking = {
    prefixes: ['furrpartner://', 'https://partner.furrcrew.com'],
    // Custom function to get the URL which was used to open the app
    async getInitialURL() {
      const url = await Linking.getInitialURL();
      return url;
    },

    // Custom function to subscribe to incoming links
    subscribe(listener: any) {
      // Listen to incoming links from deep linking
      const linkingSubscription = Linking.addEventListener('url', ({ url }) => {
        listener(url);
      });

      return () => {
        // Clean up the event listeners
        linkingSubscription.remove();
      };
    },
    configLinking,
  };
  /** LINKING */

  /** Handle Hardware Back Button Press */
  const handleBackButton = () => {
    if (exitApp) {
      BackHandler.exitApp();
    } else {
      setExitApp(true);
      Alert.alert(
        'Exit App',
        'Are you sure you want to exit the app?',
        [
          {
            text: 'Cancel',
            onPress: () => setExitApp(false),
            style: 'cancel',
          },
          { text: 'YES', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false },
      );
    }
    return true;
  };
  /** Handle Hardware Back Button Press */

  useEffect(() => {
    /**Handle Notification */
    requestUserPermission(async (token) => {
			const deviceInfo = {
				deviceId: getDeviceId(),
				// buildId: getBuildId(),
				// deviceName: getDeviceName(),
				// manufacturer: getManufacturer(),
				// model: getModel(),
				// systemVersion: getSystemVersion(),
				registerToken: token,
				fcmRegistered: true
			};
			// console.log('On Register', deviceInfo);
			setDeviceData(deviceInfo);
		});

    handleNotifications((type, notification) => {
			// console.log('handleNotifications', notification);
			if (notification && 'data' in notification && 'screen' in notification.data) {
				if (type == 'init') {
					setInitialRouteName(notification.data?.screen);
				} else {
					navigationRef.navigate(notification.data?.screen);
				}
			}

			if (notification && 'data' in notification && 'ad' in notification.data) {
				setData('AD', {
					email: notification.data?.adEmail,
					phone: notification.data?.adPhone,
					link: notification.data?.adLink,
					image: notification.data?.adImage,
					description: notification.data?.adDescription
				});
			}
		});
  }, []);

  const BottomTabs = () => {
    const theme = useTheme();
    const colorScheme = useColorScheme();

    return (
      <Tab.Navigator initialRouteName="Home" screenOptions={{
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.lightGrey,
        tabBarStyle: { position: Platform.OS === 'ios' ? 'absolute' : 'absolute' },
        tabBarBackground: () => (<LinearGradient
          colors={[colors.primary, colors.darkPrimary, '#010745']}
          style={styles.linearGradient}></LinearGradient>)
      }}>
        <Tab.Screen name="Home" component={Home}
          options={{
            unmountOnBlur: false,
            tabBarLabel: () => null,
            tabBarIcon: ({ color, size }) => (
              <Icon name="view-dashboard" color={color} size={30} />
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen name="Appointments" component={Appointments}
          options={{
            unmountOnBlur: true,
            tabBarLabel: () => null,
            tabBarIcon: ({ color, size }) => (
              <Icon name="calendar-clock" color={color} size={30} />
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen name="Rolls" component={Rolls}
          options={{
            unmountOnBlur: true,
            tabBarLabel: () => null,
            tabBarIcon: ({ color, size }) => (
              <Icon name="video" color={color} size={30} />
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen name="Analytics" component={Analytics}
          options={{
            // unmountOnBlur: false,
            tabBarLabel: () => null,
            tabBarIcon: ({ color, size }) => (
              <Icon name="finance" color={color} size={30} />
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen name="Settings" component={Settings}
          options={{
            // unmountOnBlur: false,
            tabBarLabel: () => null,
            tabBarIcon: ({ color, size }) => (
              <Icon name="cog-outline" color={color} size={30} />
            ),
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <>
    {!isConnected && <NoInternet />}
    <NavigationContainer
      linking={linking}
      ref={navigationRef}
      theme={theme}
    >
      <Stack.Navigator
        screenOptions={screenOptions}
        initialRouteName={initialRouteName}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="OTPVerify" component={OTPVerify} />
        <Stack.Screen name="BasicInfo" component={BasicInfo} options={{ gestureEnabled: false }} />
        <Stack.Screen name="Loading" component={Loading} />
        <Stack.Screen name="CreateWorkspace" component={CreateWorkspace} />
        <Stack.Screen name="InformationDetails" component={InformationDetails} />
        <Stack.Screen name="WorkDetails" component={WorkDetails} />

        <Stack.Screen name="AadharCard" component={AadharCard} />
        <Stack.Screen name="PanCard" component={PanCard} />
        <Stack.Screen name="GstVerification" component={GstVerification} />
        <Stack.Screen name="DoctorsLicense" component={DoctorsLicense} />
        <Stack.Screen name="EducationCertificates" component={EducationCertificates} />
        <Stack.Screen name="BankDetails" component={BankDetails} />
        <Stack.Screen name="RequiredVerification" component={RequiredVerification} />
        <Stack.Screen name="PricingDetails" component={PricingDetails} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="AppointmentDetails" component={AppointmentDetails} />

        <Stack.Screen name="Verification" component={Verification} />
        <Stack.Screen name="EmailVerification" component={EmailVerification} />

        <Stack.Screen name="LoadingSetting" component={LoadingSetting} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
        <Stack.Screen options={{ headerShown: false, unmountOnBlur: true, gestureEnabled: false }} name="Dashboard" component={BottomTabs} />
        <Stack.Screen name="HomeListView" component={HomeListView} options={{ gestureEnabled: false }} />
        <Stack.Screen name="CreateRoll" component={CreateRoll} />

        {/* SettingScreens */}
        <Stack.Screen options={{ headerShown: false }} name="MyView" component={MyView} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="BasicInformation" component={BasicInformation} />
        <Stack.Screen name="AppointmentsUpcoming" component={AppointmentsUpcoming} />
        <Stack.Screen name="AppointmentsPrevious" component={AppointmentsPrevious} />
        <Stack.Screen name="RequestsAccepted" component={RequestsAccepted} />
        <Stack.Screen name="RequestsRejected" component={RequestsRejected} />
        <Stack.Screen name="RequestsCancelled" component={RequestsCancelled} />
        <Stack.Screen name="BankInformation" component={BankInformation} />
        <Stack.Screen name="WorkspaceInformation" component={WorkspaceInformation} />
        <Stack.Screen name="WorkspaceServices" component={WorkspaceServices} />
        <Stack.Screen name="ChangeWorkspace" component={ChangeWorkspace} />
        <Stack.Screen name="ServiceList" component={ServiceList} />
        <Stack.Screen name="ListDetails" component={ListDetails} />
        <Stack.Screen name="VideoCall" component={VideoCall} />
        <Stack.Screen name="VacationStatus" component={VacationStatus} />
        <Stack.Screen name="HelpCenters" component={HelpCenters} />
        <Stack.Screen name="Faqs" component={Faqs} />
        <Stack.Screen name="PreviewRolls" component={PreviewRolls} />
        <Stack.Screen name="DeleteAccount" component={DeleteAccount} />
        <Stack.Screen name="FullScreenPrescription" component={FullScreenPrescription} />
      </Stack.Navigator>
    </NavigationContainer>
    </>
  );
};

async function requestUserPermission(callback) {
	const authorizationStatus = await messaging().requestPermission();

	// console.log('Permission status:', authorizationStatus);
	if (authorizationStatus) {
		// await messaging().registerDeviceForRemoteMessages();
		const token = await messaging().getToken();

		// console.log('requestUserPermission', token);
		callback(token);
	}
}

async function handleNotifications(callback) {
	messaging().onNotificationOpenedApp(remoteMessage => {
		console.log(
			'Notification caused app to open from background state:',
			remoteMessage,
		);
		callback('background', remoteMessage);
	});

	// Check whether an initial notification is available
	messaging()
		.getInitialNotification()
		.then(remoteMessage => {
			if (remoteMessage) {
				console.log(
					'Notification caused app to open from quit state:',
					remoteMessage,
				);
				// setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
				callback('init', remoteMessage);
			}
			// setLoading(false);
		});
}

const styles = StyleSheet.create({
  linearGradient: {
      flex: 1,
      paddingLeft: 15,
      paddingRight: 15,
      borderRadius: 0,
  },
});

export default Navigations;