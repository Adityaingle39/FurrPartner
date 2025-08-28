import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
  ImageBackground
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';

import Apis from '../../utils/apis';
import Header from '../../components/common/Header';
import Loader from '../../components/common/Loader';
import Toaster from '../../components/common/Toaster';

import { useTheme } from 'react-native-paper';
import { getData, setData } from '../../utils/db';
import { useAuthState } from '../../services/auth';
import { useWorspaceState } from '../../services/workspace';
import { alignItemsCenter, colors, justifyContentCenter } from '../../utils/styles/gobalstyle';

const VacationStatus = ({ navigation }) => {
  const api = new Apis();
  const theme = useTheme();
  const { userData } = useAuthState();
  const { defaultWorkspace } = useWorspaceState();

  // console.log("defaultWorkspace", defaultWorkspace);

  const pan = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const containerWidth = Dimensions.get('window').width - 110;

  const [status, setStatus] = useState('Active');

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return gestureState.dx > 0 && Math.abs(gestureState.dy) < 5;
    },
    onPanResponderMove: (_, gestureState) => {
      const translatedX = Math.min(
        Math.max(gestureState.dx, 0),
        containerWidth,
      );
      pan.setValue(translatedX);
      const swipeProgress = translatedX / containerWidth;
      fadeOutText(swipeProgress);
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 250) {
        toggleStatus();
      }
      Animated.spring(pan, { toValue: 0, useNativeDriver: false }).start();
      fadeInText();
    },
  });

  useEffect(() => {
    // Fetch the stored vacation status when the component mounts
    const fetchVacationStatus = async () => {
      const storedStatus = await getData('vacationStatus');
      setStatus(storedStatus === 'Active' ? storedStatus : (defaultWorkspace.vacation ? 'Active' : 'Paused'));
    };
    fetchVacationStatus();
  }, []);

  const toggleStatus = () => {
    if (defaultWorkspace.status == 'PENDING') {
      Toaster({message: `Your account is not active, please wait while it's activated.`});
    } else if (defaultWorkspace.locked) {
      Toaster({message: `Your previous changes are not yet approved, please contact support team.`});
    } else {
      const newStatus = status === 'Active' ? 'Paused' : 'Active';
      setStatus(newStatus);
      setDefaultWorkSpaceVacationStatus(newStatus === 'Active');
      setData('vacationStatus', newStatus);
    }
  };

  const animatedStyle = {
    transform: [{ translateX: pan }],
  };

  const fadeOutText = swipeProgress => {
    Animated.timing(fadeAnim, {
      toValue: 1 - swipeProgress,
      duration: 0,
      useNativeDriver: false,
    }).start();
  };

  const setDefaultWorkSpaceVacationStatus = async (mode) => {
    api.setDefaultVacationStatus(userData.id, defaultWorkspace.id, mode)
      .then(res => {
        console.log(res)

      }).catch(err => {
        console.log(err);
      });
  };

  const fadeInText = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <ImageBackground
      source={status === 'Active' ? require("../../assets/Active.png") : require("../../assets/paused.png")}
      style={styles.container}
    >
      <SafeAreaView style={{ justifyContent: 'space-between', flex: 1 }} >
        <Header navigation={navigation} type='back' options={{ title: 'Vacation Mode', light: true }}></Header>
        <View
          style={[
            styles.flex,
            styles.justifySpaceBetween,
            styles.spacingProperty,
          ]}>
          <View
            style={[alignItemsCenter, { position: 'relative', top: '40%' }]
            }>
            <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', width: '40%', alignItems: 'center', paddingBottom: 20, borderRadius: 10 }}>
              <Text style={[styles.statusText, { color: 'white' }]}>Vacation</Text>
              <Text
                style={[
                  styles.statusModeText,
                  { color: status === 'Active' ? '#28B446' : '#EC5E58' },
                ]}>
                {status}
              </Text>
            </View>
          </View>

          <View>
            <View style={styles.flexDirectionRow}>
              <IconM name="note-alert-outline" size={20} color={'white'} />
              <Text style={[styles.noteText, { color: 'white' }]}>Note</Text>
            </View>
            {status === 'Active' ? (
              <Text style={[styles.statusDescription, { color: 'white' }]}>
                By swiping Right, you acknowledge and agree that your workspace
                will remain active for bookings. This means that other app users will be able to access
                your workspace and connect with you through the app as usual.
              </Text>
            ) : (
              <Text style={[styles.statusDescription, { color: 'white' }]}>
                By swiping right, you acknowledge and agree that your workspace
                will be temporarily paused for bookings. However, your listing will be visible
                to the users. This means that other app users will be able to access your profile.
              </Text>
            )}
          </View>
        </View>
        <View style={[styles.padding]}>
          <View
            style={[
              styles.swipeContainer,
              // status === 'Paused' && {
              //   backgroundColor: 'rgba(236, 94, 89, 0.2)',
              // },
            ]}>
            <Animated.View style={[styles.swipeButton, animatedStyle]}>
              <View
                style={{
                  backgroundColor: status === 'Paused' ? '#EC5E59' : '#01C4FF',
                  width: '20%',
                  height: '100%',
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  blurRadius: 1


                }}
                {...panResponder.panHandlers}>
                <Icon name="arrow-right" size={30} color="#ffffff" />
              </View>
              <View
                style={{
                  alignItems: 'center',
                  position: 'relative',
                  justifyContent: 'center',
                }}>
                <Animated.Text style={[styles.swipeText, { opacity: fadeAnim, color: 'white' }]}>
                  {status === 'Active'
                    ? 'Swipe right to Pause'
                    : 'Swipe right to Resume'}
                </Animated.Text>
              </View>
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  spacingProperty: {
    padding: 20,
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  flexGrow: {
    flexGrow: 1,
    alignSelf: 'stretch',
    marginLeft: '20%',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  flex: {
    flex: 1,
  },
  justifySpaceBetween: {
    justifyContent: 'space-between',
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',

    marginTop: 25,
  },
  statusModeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  noteText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,

  },
  statusDescription: {
    fontSize: 16,
    marginTop: 10,

  },
  padding: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  swipeContainer: {
    marginBottom: 10,
    // backgroundColor: 'rgba(1, 196, 255, 0.21)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  swipeButton: {
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
  },
  swipeText: {
    paddingLeft: '15%',
  },
});

export default VacationStatus;
