import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  RefreshControl,
  VirtualizedList,
  StyleSheet,
  useColorScheme,
  Alert,
} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/AntDesign';
import Icons from 'react-native-vector-icons/Feather';
import React, {useState, useEffect, useCallback, useRef} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {List, SegmentedButtons, useTheme} from 'react-native-paper';

import Apis from '../../utils/apis';
import Empty from '../../components/common/Empty';
import Loader from '../../components/common/Loader';
import Header from '../../components/common/Header';
import ListAddress from '../../components/skeleton/listAddress';
import ServiceEvent from '../../components/common/ServiceEvent';

import {useAuthState} from '../../services/auth';
import {useRequestState} from '../../services/requests';
import {useWorspaceState} from '../../services/workspace';
import {useNotificationState} from '../../services/notifications';
import {
  scrollView,
  colors,
  customTwinButton,
} from '../../utils/styles/gobalstyle';
import {requestAndroidNotificationAccess} from '../../utils/helpers';

const RenderElement = ({navigation, item}) => {
  const api = new Apis();
  const theme = useTheme();
  const {width, height} = Dimensions.get('window');

  const {userData} = useAuthState();

  const getType = () => {
    if (item) {
      switch (item.type) {
        case 'VETERINARY':
          return 'Vet';
          break;
        case 'GROOMING':
          return 'Groomer';
          break;
        case 'COURSE':
          return 'Course';
          break;
        case 'WEBINAR':
          return 'Webinar';
          break;
        case 'EVENT':
          return 'Event';
          break;
        case 'NGO':
          return 'NGO';
          break;
        case 'ADOPTION':
          return 'Adoption';
          break;
        case 'BLOG':
          return 'Blog';
          break;
        case 'ARTICLE':
          return 'Educational Blog';
          break;
        default:
          return 'New';
      }
    }
  };

  const getSubType = () => {
    if (item) {
      switch (item.subType) {
        case 'APPOINTMENT':
          return 'Appointment';
          break;
        case 'ORDER':
          return 'Order';
          break;
        case 'NEW':
          return 'New';
          break;
        default:
          return 'Notification!';
      }
    }
  };

  const getDate = () => {
    const format = 'DD-MMM-YYYY hh:mm A';
    const istDate = moment
      .utc(item.time, 'DD-MMM-YYYY HH:mm:ss [UTC]')
      .utcOffset('+05:30')
      .format(format);
    return istDate;
  };

  const getIcon = () => {
    if (item) {
      switch (item.type) {
        case 'VETERINARY':
          return 'doctor';
          break;
        case 'GROOMING':
          return 'hair-dryer';
          break;
        case 'COURSE':
          return 'book-education-outline';
          break;
        case 'WEBINAR':
          return 'book-education-outline';
          break;
        case 'EVENT':
          return 'calendar-check-outline';
          break;
        case 'NGO':
          return 'handshake-outline';
          break;
        case 'ADOPTION':
          return 'handshake-outline';
          break;
        case 'BLOG':
          return 'book-open-variant-outline';
          break;
        case 'ARTICLE':
          return 'book-open-variant-outline';
          break;
        default:
          return 'bell-outline';
      }
    }
  };

  const handleClick = () => {
    if (item) {
      switch (item.type) {
        case 'VETERINARY':
          {
            if ((item.subType = 'APPOINTMENT')) {
              navigation.navigate('AppointmentDetails', {id: item.refId});
            } else {
              navigation.navigate('AppointmentDetails', {id: item.refId});
            }
          }
          break;
        case 'GROOMING':
          {
            if ((item.subType = 'APPOINTMENT')) {
              navigation.navigate('AppointmentDetails', {id: item.refId});
            } else {
              navigation.navigate('AppointmentDetails', {id: item.refId});
            }
          }
          break;
        case 'COURSE':
          navigation.navigate('CourseDetails', {id: item.refId});
          break;
        case 'WEBINAR':
          navigation.navigate('WebinarDetails', {id: item.refId});
          break;
        case 'EVENT':
          {
            if (item.subType === 'ORDER') {
              navigation.navigate('EventTicket', {
                id: item.refId,
                bookingId: item.petId,
              });
            } else {
              navigation.navigate('EventDetails', {id: item.refId});
            }
          }
          break;
        case 'NGO':
          navigation.navigate('NgoDetails', {id: item.refId});
          break;
        case 'ADOPTION':
          navigation.navigate('InfoAdoption', {id: item.refId});
          break;
        case 'BLOG':
          navigation.navigate('BlogDetails', {id: item.refId});
          break;
        case 'ARTICLE':
          navigation.navigate('BlogDetails', {id: item.refId});
          break;
        default:
          return '';
      }
    }
  };

  return (
    <List.Item
      title={`${getType()} - ${getSubType()}`}
      onPress={handleClick}
      descriptionNumberOfLines={3}
      descriptionEllipsizeMode="tail"
      description={`${item.message}`}
      left={props => (
        <List.Icon {...props} icon={getIcon()} color={colors.blue} />
      )}
      right={props => <List.Icon {...props} icon="chevron-right" />}
    />
  );
};

const Notifications = ({navigation}) => {
  const api = new Apis();
  const theme = useTheme();
  const upcomingRef = useRef(null);
  const {width, height} = Dimensions.get('window');

  const {userData} = useAuthState();
  const {defaultWorkspace} = useWorspaceState();

  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState(null);
  const [isLoadingNotifications, setIsLoading] = useState(false);

  console.log('notifications', notifications);
  const getNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAllNotifications(
        userData.id,
        defaultWorkspace.id,
      );
      console.log('Fetched Notifications:', res);
      setNotifications(res && res.length > 0 ? res : []);
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  };

  //  console.log("userData",userData)
  // console.log("UserData",userData.id)
  const clearNotificationButton = () => {
    Alert.alert(
      'Clear Notifications',
      'Are you sure you want to clear all notifications?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            setIsLoading(true);
            const res = await api.clearNotification(userData.id);
            console.log('Clear API Response:', res);

            if (res && res.result) {
              setNotifications([]);
              await getNotifications();
            } else {
              console.log('Failed to clear notifications.');
            }
            setIsLoading(false);
          },
        },
      ],
      {cancelable: true},
    );
  };

  const init = () => {
    if (notifications && notifications.length === 0) {
      getNotifications();
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getNotifications();
    }, []),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getNotifications();
  }, []);

  useEffect(() => {
    init();
    requestAndroidNotificationAccess();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Header
        type="back"
        navigation={navigation}
        options={{
          title: 'Notifications',
          subTitle: defaultWorkspace.workplaceName,
        }}
        isNotificationScreen={true}
        clearNotificationButton={clearNotificationButton}
      />

      <View>
        {notifications !== null ? (
          <VirtualizedList
            ref={upcomingRef}
            data={notifications}
            initialNumToRender={3}
            maxToRenderPerBatch={5}
            removeClippedSubviews={true}
            updateCellsBatchingPeriod={1}
            persistentScrollbar={true}
            progressViewOffset={4}
            keyExtractor={item => item.id}
            getItemCount={data => data.length}
            getItem={(data, index) => data[index]}
            refreshing={true}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => onRefresh()}
              />
            }
            renderItem={({item, index}) => (
              <RenderElement navigation={navigation} item={item} />
            )}
            ListEmptyComponent={() => (
              <View style={{paddingHorizontal: 20}}>
                <Empty
                  title="Empty"
                  subtitle="Ooops! You don't have any notifications."
                />
              </View>
            )}
          />
        ) : (
          <View style={{marginHorizontal: 15}}>
            <ListAddress nos={7} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  itemFrame: {
    // marginVertical: 10,
    // paddingBottom: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    // padding: 20,

    // backgroundColor: 'yellow'
  },
  itemImage: {width: 80, height: 80, marginRight: 10, borderRadius: 10},
  itemTitle: {fontSize: 18, fontWeight: '600', flexGrow: 1},
  itemTitleMsg: {fontSize: 16, fontWeight: '600', flexGrow: 1},
  itemSubTitle: {fontSize: 14, paddingBottom: 5, fontWeight: '600'},
});
export default Notifications;
