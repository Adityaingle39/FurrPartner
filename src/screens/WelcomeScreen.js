import React, { useRef, useState, useEffect } from 'react';
import { VirtualizedList, Image, View, Animated, StyleSheet, Text, ImageBackground, Dimensions, useColorScheme } from 'react-native';
import { StackActions } from '@react-navigation/native';
import { Button, useTheme } from 'react-native-paper';

import Apis from "../utils/apis";
import Toaster from '../components/common/Toaster';
import SignIn from './auth/SignIn';
import { isAlreadyLogged,welcomeScreenVisited ,isWelcomeVisited, saveUserSession} from '../utils/helpers';
import { useAuthState } from "../services/auth";
import { useWorspaceState } from '../services/workspace';
import { btn, colors, spacingProperty } from '../utils/styles/gobalstyle';

const Slide = ({slide}) => {
  const theme = useTheme();
  const {width, height} = Dimensions.get('screen');

  return (
    <View style={{flexDirection: 'column', width: width, justifyContent: 'center', alignItems: 'center'}}>
      <Image resizeMode="cover" source={{uri: slide.media}} width={width - 40} height={width / 1.3} />
      <Text style={{color: theme.colors.onSurface, fontSize: 30, fontWeight: Platform.OS === 'ios' ? 700 : 800, textAlign: 'center'}}>{slide.text}</Text>
    </View>
  )
}

const Slides = ({}) => {
  const theme = useTheme();
  const slideItemsRef = useRef(null);
  const colorScheme = useColorScheme();
  const {width, height} = Dimensions.get('screen');

  const [slides, setSlides] = useState([
    {id: 1, text: "Our companionship \nis furrreal", media: Image.resolveAssetSource(require('../assets/welcome-0.png')).uri},
    {id: 2, text: "Spread love, \none paw at a time", media: Image.resolveAssetSource(require('../assets/welcome-1.png')).uri},
    {id: 3, text: "All you need, \nfor your pets' needs", media: Image.resolveAssetSource(require('../assets/welcome-2.png')).uri}
  ]);
  const [activeItemIndex, setActiveIndexItem] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems, changed }) => {
    // console.log("viewableItems", viewableItems);
    if (viewableItems.length > 0) {
      setActiveIndexItem(viewableItems[0].index)
    }
  }).current;

  const renderDotsView = (array, ref) => {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        {array.map((_, i) => {
          return (<Animated.View key={`key-indicator-${i}`} style={{ opacity: activeItemIndex == i ? 1 : 0.5, height: 5, width: 15, backgroundColor: theme.colors.outline, margin: 2, borderRadius: 5 }} />);
        })}
      </View>
    )
  }

  return (<>
    <VirtualizedList
      pagingEnabled={true}
      snapToInterval={width}
      decelerationRate={0}
      snapToAlignment="center"
      contentInset={{top: 0, left: 0, bottom: 0, right: 0}}
      ref={slideItemsRef}
      data={slides}
      horizontal={true}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      indicatorStyle="black"
      persistentScrollbar={false}
      progressViewOffset={30}
      removeClippedSubviews={true}
      keyExtractor={item => item.id}
      getItemCount={data => data.length}
      showsHorizontalScrollIndicator={false}
      getItem={(data, index) => data[index]}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{ viewAreaCoveragePercentThreshold: 65 }}
      renderItem={({ item, index }) => <Slide key={`home-adoption-item-${activeItemIndex}-${item.id}`} slide={item} index={index} />}
      contentContainerStyle={{ justifyContent: 'space-between' }}
    ></VirtualizedList>
    {renderDotsView(slides, null)}
  </>)
}

const WelcomeScreen = ({navigation}) => {
  const api = new Apis();
  const colorScheme = useColorScheme();
  const {width, height} = Dimensions.get('screen');
  const logoImage = colorScheme === 'dark' ? Image.resolveAssetSource(require('../assets/furrcrew-white.png')).uri : Image.resolveAssetSource(require('../assets/furrcrew-main.png')).uri;
  const swiperRef = useRef(null);
  const images = [
    Image.resolveAssetSource(require('../assets/welcome-0.png')).uri,
    Image.resolveAssetSource(require('../assets/welcome-1.png')).uri,
    Image.resolveAssetSource(require('../assets/welcome-2.png')).uri
  ];

  const { setWorkspaces } = useWorspaceState();
  const { userData, setPhone, setOtpId, setUserData } = useAuthState();

  const [authLoaded, setAuthLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLogged, setIsAlreadyLogged] = useState(false);
  const [splashLoading, setSplashLoading] = useState(true);
  const [welcomeScreen, setWelcomeScreen] = useState(null);

  const getMyWorkspaces = async (id) => {
    let workData = await api.getAllWorkspaces(id);
    if (workData.length > 0) {
      setWorkspaces(workData);
      Toaster({ message: `Welcome ${userData.collaboratorName}` });
      navigation.navigate('Dashboard');
      // setToTop('Dashboard')
    } else {
      Toaster({ message: `Almost Ready! Setup your workspace` });
      navigation.navigate('CreateWorkspace');
    }
  };

  const getProfileInfo = async (data) => {
    // console.log("test", data);
    api.getProfile(data.id)
    .then(res => {
      let tmpUserData = Object.assign(userData, res);
      setUserData(tmpUserData);
      if (res.collaboratorName) {
        getMyWorkspaces(res.id)
      } else {
       
        navigation.navigate('BasicInfo');
        // setToTop('BasicInfo');
      }
    }).catch(error => {
      console.log(error);
    })
  }

  const setToTop = (screen) => {
    if (screen) {
      // Reset the stack and set the current screen as the top screen
      const resetAction = StackActions.replace(screen);

      // Dispatch the reset action
      navigation.dispatch(resetAction);
    }
  }

  const handleSkip = () => {
    welcomeScreenVisited();
    navigation.navigate('SignIn');
  };

  const handleSlideChange = index => {
    setActiveIndex(index);
  };

  const init = async () => {
    const loggedSession = await isAlreadyLogged();
    
    let isVisited = await isWelcomeVisited();
    const welcomeScreen = typeof isVisited == 'boolean' && isVisited ? false : true;
    setIsAlreadyLogged(loggedSession);
    if (welcomeScreen == false) {
      if (loggedSession) {
        api.setAuth(loggedSession.token);
        saveUserSession(loggedSession);
        setUserData(loggedSession);
        getProfileInfo(loggedSession);
      } else {
        handleSkip();
      }
      setSplashLoading(false);
    } else {
      setSplashLoading(false);
      handleSkip();
    }
  }

  useEffect(() => {
    isWelcomeVisited()
    .then(isVisited => {
      const welcomeScreen = typeof isVisited == 'boolean' && isVisited ? false : true;
      // console.log('isWelcomeVisited', welcomeScreen);
      setWelcomeScreen(welcomeScreen);
      if (isVisited) {
        init();
        setSplashLoading(false);
      } else {
        setTimeout(() => {
          init();
          setSplashLoading(false);
        }, 12100);
      }
    });
  }, [navigation, setSplashLoading, setWelcomeScreen]);
  
  // return (
  //   <View style={{flex: 1, backgroundColor: colorScheme == 'light' ? '#FFFFFF' : '#000000'}}>
  //   {(splashLoading == true && welcomeScreen == true) ? <View style={[styles.root, {flexDirection: 'column'}]}>
  //     <Image resizeMode="cover" source={require('../assets/splash.gif')} style={{width: width, height: height}} />
  //   </View> : (isLogged ? <View style={[styles.root, {backgroundColor: colorScheme == 'light' ? '#FFFFFF' : '#000000', flexDirection: 'column'}]}>
  //     <Image source={{uri: logoImage}} style={{width: 295, height: 59}} />
  //   </View> : 
  //   <View style={{flex: 1, marginBottom: 40}}>
  //     <View style={{marginTop: 0, padding: 40}}>
  //       <Image
  //         source={{uri: logoImage}}
  //         resizeMode="contain"
  //         style={{width: width / 1.7, height: 50}}
  //       />
  //     </View>
  //     <View style={{flex: 1, marginTop: 200, paddingHorizontal: 40, overflow: 'hidden'}}>
  //       <Slides />
  //     </View>
  //     <View style={{marginTop: 15, flexDirection: 'row', paddingHorizontal: 40, marginBottom: 10}}>
  //       <Button mode='contained' uppercase buttonColor={colors.primary} textColor={colors.white} onPress={handleSkip} style={[btn, {flexGrow: 1}]}>
  //         Log In
  //       </Button>
  //     </View>
  //   </View>
  //   )}
  // </View>
  // );

    return (
      <View style={{flex: 1, backgroundColor: colorScheme == 'light' ? '#FFFFFF' : '#000000'}}>
        {(splashLoading == true && welcomeScreen == true) ? <View style={[styles.root, {flexDirection: 'column'}]}>
          <Image resizeMode="cover" source={require('../assets/splash.gif')} style={{width: width, height: height}} />
        </View> : <View style={[styles.root, {backgroundColor: colorScheme == 'light' ? '#FFFFFF' : '#000000', flexDirection: 'column'}]}>
          <Image source={{uri: logoImage}} style={{width: 295, height: 59}} />
        </View>}
      </View>
    );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: "#000"
  },
  root: {
    flex: 1,
    // backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WelcomeScreen;