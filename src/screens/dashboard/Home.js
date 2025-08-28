import React, {useEffect, useRef, useState} from 'react';
import {BackHandler, Alert} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import {
  SafeAreaView,
  RefreshControl,
  View,
  Text,
  StyleSheet,
  VirtualizedList,
  useColorScheme,
  Dimensions,
} from 'react-native';
import {IconButton, Card, Divider, List, useTheme} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';

import {useAuthState} from '../../services/auth';
import {useWorspaceState} from '../../services/workspace';
import {useAppointmentState} from '../../services/appointments';
import RNExitApp from 'react-native-exit-app';
import Apis from '../../utils/apis';
import Empty from '../../components/common/Empty';
import Header from '../../components/common/Header';
import ListAddress from '../../components/skeleton/listAddress';
import AppointmentCard from '../../components/cards/appointment';
import {requestAndroidNotificationAccess} from '../../utils/helpers';

const api = new Apis();

const HomeTab = ({navigation}) => {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const listRef = useRef(null);
  const {width, height} = Dimensions.get('window');

  const {userData} = useAuthState();
  const {defaultWorkspace} = useWorspaceState();
  const {appointments, createdAppointments, setAppointments} =
    useAppointmentState();

  const [activeItemIndex, setActiveIndexItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeAppointments, setActiveAppointments] = useState(null);

  const getAllAppointments = type => {
    api
      .getWorkspaceAppointments(userData.id, defaultWorkspace.id, {
        status: 'all',
      })
      .then(res => {
        const responseData = res && res.length > 0 ? res : [];
        //console.log('getAllAppointments', responseData.length);
        setAppointments(responseData);
        setRefreshing(false);
        setIsLoading(false);
        setActiveAppointments(createdAppointments());
      })
      .catch(err => {
        //console.log("getAllAppointments Error: ", err);
        setRefreshing(false);
        setIsLoading(false);
      });
  };

  const onViewableItemsChanged = useRef(({viewableItems, index}) => {
    if (viewableItems.length > 0) {
      setActiveIndexItem(viewableItems[0].index);
    }
  }).current;

  const init = () => {
    if (!(defaultWorkspace?.status?.toUpperCase() === 'PENDING')) {
      if (
        appointments &&
        appointments.length === 0 &&
        activeAppointments !== undefined &&
        activeAppointments !== null
      ) {
        getAllAppointments('');
      } else {
        setActiveAppointments(createdAppointments());
      }
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getAllAppointments('');

  }, []);
  useFocusEffect(
    React.useCallback(() => {
      const interval = setInterval(() => {
        getAllAppointments();
      }, 3000);
  
      return () => clearInterval(interval);
    }, [])
  );
  useFocusEffect(
    React.useCallback(() => {
      if (!(defaultWorkspace?.status?.toUpperCase() === 'PENDING')) {
        setActiveAppointments(createdAppointments());
      }
    }, []),
  );

  useEffect(() => {
    init();
  }, []);

  const isFocused = useIsFocused();
  useEffect(() => {
    init();
  }, [isFocused]);

  useEffect(() => {
    const backAction = () => {
      if (isFocused) {
        Alert.alert('Hold On!', 'Are you sure you want to exit?', [
          {
            text: 'CANCEL',
            onPress: () => 'Null',
          },
          {text: 'Yes', onPress: () => RNExitApp.exitApp()},
        ]);
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [isFocused]);
  // console.log("userData",userData)
  useEffect(() => {
    requestAndroidNotificationAccess();
  }, []);
  
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          colorScheme === 'dark'
            ? theme.colors.surface
            : theme.colors.surfaceVariant,
      }}>
      <Header navigation={navigation} type="main" options={{title: ''}} />

      <View
        style={{
          marginHorizontal: 10,
          marginTop: 10,
          marginBottom: activeAppointments?.length ? 105 : 0,
        }}>
        {defaultWorkspace?.status?.toUpperCase() === 'PENDING' ? (
          <View style={{marginHorizontal: 30}}>
            <Empty
              top={height / 2 - width / 1.5}
              title="Verification Pending!"
              subtitle={"We have received your request, it may take upto 2-3 working days to complete the verification process.\n\nContact our support team for further queries."}
            />
          </View>
        ) : activeAppointments ? (
          <VirtualizedList
            ref={listRef}
            data={activeAppointments}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            keyExtractor={item => item.id}
            getItemCount={data => data.length}
            getItem={(data, index) => data[index]}
            getItemLayout={(data, index) => ({
              length: width / 2,
              offset: (width / 3) * index,
              index,
            })}
            renderItem={({item}) => (
              <AppointmentCard
                type="Created"
                navigation={navigation}
                item={item}
              />
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{paddingBottom: 20}}
            ListHeaderComponent={
              <Text
                style={{
                  fontSize: 18,
                  marginLeft: 5,
                  color: theme.colors.onSurface,
                }}>
                Pending Requests
              </Text>
            }
            ListEmptyComponent={
              <Empty
                style={{width: width - 30}}
                title="Empty!"
                subtitle="Ooops! Currently, you don't have any upcoming appointments."
              />
            }
          />
        ) : (
          <ListAddress nos={7} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default HomeTab;
