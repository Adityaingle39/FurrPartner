import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import {
  container,
  spacingProperty,
  colors,
  heading,
  flexDirectionRow,
  alignItemsCenter,
  pageHeading,
} from '../../utils/styles/gobalstyle';
import Apis from '../../utils/apis';
import Empty from '../../components/common/Empty';
import Header from '../../components/common/Header';
import ServiceTask from '../../components/common/ServiceTask';

import {useAuthState} from "../../services/auth";
import {useWorspaceState} from '../../services/workspace';
import {useAppointmentState} from '../../services/appointments';

const ServiceList = ({navigation}) => {
  const api = new Apis();

  const {userData} = useAuthState();
  const {defaultWorkspace} = useWorspaceState();
  const {appointments, setAppointments} = useAppointmentState();

  const [statusType, setStatusType] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getServicesList = (type) => {
    try {
      if (type !== 'reload') {
        setIsLoading(true);
      }
      api.getWorkspaceAppointments(userData.id, defaultWorkspace.id, { status: statusType })
        .then(res => {
          setAppointments(res);
          (type === 'reload') ? setRefreshing(false) : setIsLoading(false);
        })
        .catch(err => {
          throw err
        });
    } catch (error) {
    console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const onRefresh = React.useCallback(() => {
    getServicesList('reload');
  });

  useEffect(() => {
    if (appointments && appointments.length == 0) {
      getServicesList('');
    }
  }, [appointments]);

  return (
    <SafeAreaView style={container}>
      <Header navigation={navigation} type='back' options={{title: 'Service History',dark:true}}></Header>
      <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{paddingHorizontal: 20}}>
          <View>
            {appointments.length > 0 ? appointments.map((task, index) => { return (<ServiceTask key={`service-history-list-${index}`} navigation={navigation} task={task}></ServiceTask>) }) : <Empty title="" subtitle="You don't have any appointment/service history yet!"></Empty>}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  serviceDisplay: {
    borderWidth: 1,
    padding: 20,
    borderColor: '#DADADA',
    borderRadius: 10,
  },
});

export default ServiceList;
