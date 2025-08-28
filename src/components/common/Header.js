import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  useColorScheme,
} from 'react-native';
import { useState, useEffect, useRef } from "react";
import { hasNotch } from 'react-native-device-info';
import { IconButton, Divider, Button, Badge, useTheme } from 'react-native-paper';

import IconCustom from './IconCustom';

import { useAuthState } from '../../services/auth';
import { useWorspaceState } from '../../services/workspace';
import { colors } from '../../utils/styles/gobalstyle';
import { getIconTextName } from '../../utils/helpers';
import { Trash } from 'iconsax-react-native';

const hadDeviceNotch = hasNotch();

const BackHeader = ({ navigation, options, isNotificationScreen, clearNotificationButton }) => {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const defaultOptions = Object.assign(
    {
      title: null,
      light: false,
      subTitle: null,
      rightIcon: false,
      rightIconName: 'dots-vertical',
      rightCallback: null,
    },
    options
  );

  const defaultColor = defaultOptions.light
    ? colors.white
    : colorScheme === 'dark'
    ? colors.white
    : theme.colors.onBackground;

  return (
    <View style={[styles.container]}>
      <View style={{ flexDirection: 'row' }}>
        <IconButton
          iconColor={defaultColor}
          size={30}
          icon="chevron-left"
          onPress={() => navigation.goBack()}
        ></IconButton>
        <View
          style={{ flexGrow: 1, alignSelf: 'stretch', justifyContent: 'center' }}
        >
          <Text style={[styles.heading, { color: defaultColor }]}>
            {defaultOptions.title}
          </Text>
          {defaultOptions.subTitle ? (
            <Text
              style={{
                textAlign: 'center',
                color: theme.colors.onSurfaceVariant,
              }}
            >
              {defaultOptions.subTitle}
            </Text>
          ) : null}
        </View>

        {isNotificationScreen ? (
          <Trash
            icon="delete" // Use the delete icon when on the notification screen
            color={defaultColor}
            style={{alignItems:'center',marginTop:12,marginRight:10}}
            size={30}
            onPress={() => {
              clearNotificationButton(); // Call the clear notification function here
            }}
          />
        ) : defaultOptions.rightIcon ? (
          <IconButton
            style={{ marginTop: -5, marginRight: -5 }}
            size={30}
            icon={defaultOptions.rightIconName}
            onPress={defaultOptions.rightCallback}
          ></IconButton>
        ) : (
          <IconButton />
        )}
      </View>
    </View>
  );
};

const MainHeader = ({ navigation, options, notificationCount, }) => {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const actionSheetRef = useRef(null);
  const iconUrl = colorScheme === 'dark' ? require('../../assets/furrpartner.png') : require('../../assets/furrpartner.png');
  const headerOptions = Object.assign({title: null, subTitle: null, dark: false, transparent: false, hideBackBtn: false, menuIcon: false, rightIcon: false, rightBtn: false}, options);

  const { defaultWorkspace } = useWorspaceState();
  const { userData } = useAuthState();

	return (
		<View style={[styles.container]}>
			<View style={{flexDirection: 'row'}}>
        <View style={{flexDirection: 'row', marginLeft: 5, justifyContent: 'space-between', alignItems: 'center'}}>
          {/* <Image source={iconUrl} style={{ marginBottom: 3, width: 45, height: 35}} /> */}
          {userData && "imageUrl" in userData && userData.imageUrl !== null ?
            <IconCustom type="image" source={userData.imageUrl} size={45} square={false}></IconCustom> :
            <IconCustom type="text" source={getIconTextName(userData.collaboratorName)} size={45} square={false}></IconCustom>
          }
        </View>
        <View style={{flexGrow: 1, alignItems: 'center', alignSelf: 'center', maxWidth: '75%'}}>
          {headerOptions && headerOptions.title ? (<View style={{alignItems: 'center', alignSelf: 'center'}}>
            <Text style={[styles.heading, {color: theme.colors.onSurface}]}>{headerOptions.title}</Text>
            {headerOptions && headerOptions.subTitle !== null ? <Text style={styles.subText}>{headerOptions.subTitle}</Text> : null}
          </View>) : <View style={{ paddingRight: 15, justifyContent: 'center', alignItems: 'center' }}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.heading, { color: theme.colors.onSurface }]}>{defaultWorkspace.workplaceName}</Text>
            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.profileDes}>{defaultWorkspace.designationName}</Text>
          </View>}
        </View>
    
        <View style={{flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
          <IconButton onPress={() => navigation.navigate('Notification')} icon='bell-outline' size={30} />
          {notificationCount > 0 && <Badge size={10} style={{right: 15, top: 15, position: 'absolute', backgroundColor: colors.red }}></Badge>}
        </View>
      </View>
		</View>
	)
}

const Header = ({ navigation, type, options,isNotificationScreen,clearNotificationButton }) => {
  const headerType = type && type == 'back' ? type : 'main';
  return (
    <>
      {headerType == 'main' ? <MainHeader navigation={navigation} options={options} notificationCount={0}></MainHeader> : null}
      {headerType == 'back' ? <BackHeader navigation={navigation} options={options}isNotificationScreen={isNotificationScreen} clearNotificationButton={clearNotificationButton} ></BackHeader> : null}
      <Divider bold={true} />
    </>
  );
}

const styles = StyleSheet.create({
  dark: { color: '#000000' },
  light: { color: '#ffffff' },
  title: {
    fontWeight: '600',
    fontFamily: 'Helvetica',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 23,
    lineHeight: 29,
  },
  subText: {
    color: '#8391A1',
  },
  heading: {
    fontSize: 18,
    fontWeight: 500,
    textAlign: 'center'
  },
  profileName: {
    fontSize: 15,
    fontWeight: 600,
    color: '#000000',
  },
  profileDes: {
    fontWeight: 500,
    color: '#898A8D',
    // textTransform: 'capitalize'
  },
  container: {
    justifyContent: 'space-between',
    marginVertical: 0,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    // borderBottomWidth: 1,
  },
  containerTransparent: {
    position: 'absolute',
    zIndex: 999,
  }
});

export default Header;