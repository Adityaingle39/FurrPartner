import {
  View,
  Text,
  ScrollView,
  Image,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import {RadioButton, Button as ButtonPaper, SegmentedButtons, List, useTheme} from 'react-native-paper';

import CustomSwitch from '../../components/common/CustomSwitch';
import Icons from 'react-native-vector-icons/Feather';
import Loader from '../../components/common/Loader';
import Header from '../../components/common/Header';
import Toaster from '../../components/common/Toaster';
import Calendar from '../../components/common/Calender';
import Apis from '../../utils/apis';
import Ad from '../../components/Ad';
import Empty from '../../components/common/Empty';
import ServiceTask from '../../components/common/ServiceTask';
import {getAd, removeAd} from '../../utils/helpers';
import {useAuthState} from '../../services/auth';
import {useWorspaceState} from '../../services/workspace';
import {useAppointmentState} from '../../services/appointments';

import {
  customTwinButton,
  colors,
  searchInputView,
} from '../../utils/styles/gobalstyle';
import moment from 'moment';


const HomeListView = ({ navigation }) => {
  const api = new Apis();
  const theme=useTheme();
  const {userData} = useAuthState();
  const {defaultWorkspace} = useWorspaceState();
  console.log(defaultWorkspace)
  const {appointments, setAppointments} = useAppointmentState();

  /** Accordion Events */
  const [tasksTypeList, setTasksTypeList] = useState('1');
  const handleTaskPress = (id) => { setTasksTypeList(id) };
  /** Accordion Events */

  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [todaysTask, setTodaysTask] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [ViewArea, setViewArea] = useState(1);
  const [isAdAvailable, setIsAdAvailable] = useState(false);
  const [adData, setAdData] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const onSelectSwitch = value => {
    setViewArea(value);
  };

  const getServicesList = (type) => {
    if (type !== 'reload') {
      setIsLoading(true);
    }
  
    try {
      api.getWorkspaceAppointments(userData.id, defaultWorkspace.id, { status: 'Active' })
        .then(res => {
          if (type === 'reload') {
            setRefreshing(false);
          } else {
            setIsLoading(false);
          }
          const tmpAppointments = appointments.filter(i => i.status !== 'Active');
          setAppointments(tmpAppointments.concat(res));
  
          const todayTasks = res.length > 0 ? res.filter(o => moment.utc(o.appointmentTime, 'DD-MMM-YYYY HH:mm:ss z').isSame(moment(), 'day')) : [];
          const upcomingTasks = res.length > 0 ? res.filter(o => moment.utc(o.appointmentTime, 'DD-MMM-YYYY HH:mm:ss z').isAfter(moment(), 'day')) : [];
          setTodaysTask(todayTasks);
          setUpcomingTasks(upcomingTasks);
        })
        .catch(err => {
          console.log("getServicesList Error: ", err);
          throw err;
        });
    } catch (err) {
      console.log( err);
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  }

  const closeAdvertisement = () => {
    setIsAdAvailable(false);
    removeAd();
  }
  
  const getAdvertisement = async() => {
    let ad = await getAd();
    if (ad) {
      console.log(ad, typeof ad);
      setIsAdAvailable(true);
      setAdData(ad);

      console.log("getAdvertisement", isAdAvailable);
    }
  }
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getServicesList('reload');
  }, []);

  useEffect(() => {
    getServicesList('');

    getAdvertisement();
  }, [])

  return (
    <SafeAreaView style={{ flex: 1}}>
      {isLoading == true ? <Loader visible={isLoading}></Loader> : null}
      <Ad show={isAdAvailable} ad={adData} onClose={closeAdvertisement} />
      <Header navigation={navigation}> </Header>
      <ScrollView style={{ marginHorizontal: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        
        {/* <View style={[customTwinButton,{backgroundColor:theme.colors.outline}]}> */}
          <SegmentedButtons
            value={viewMode}
            onValueChange={setViewMode}
           style={{paddingHorizontal:30,}}
            buttons={[
              {
                icon: 'view-list',
                value: 'list',
                label: 'List View',
                uncheckedColor: '#808080',
                checkedColor:'#808080',
                style: {borderColor: '#D9D9D9', backgroundColor: viewMode == 'list' ? colors.white : '#D9D9D9'}
              },
              {
                icon: 'calendar-month',
                value: 'calendar',
                label: 'Calendar View',
                uncheckedColor: '#808080',
                checkedColor:'#808080',
                style: {borderColor: '#D9D9D9', backgroundColor: viewMode == 'calendar' ? colors.white : '#D9D9D9'}
              },
            ]}
          />
        {/* </View> */}
        <View style={[searchInputView,{backgroundColor:"transparent",borderColor:theme.colors.onSurfaceVariant,borderWidth:1}]}>
          <Icons
            name="search"
            size={20}
            color={theme.colors.onSurface}
            style={{ marginHorizontal: 5, marginTop: 10 }}
          />
          <TextInput style={{flexGrow:1}} placeholderTextColor={theme.colors.onSurface} placeholder="Search Tasks..." />
        </View>

        <View>
          {viewMode == 'list' && (
            <View>
              <List.AccordionGroup expandedId={tasksTypeList} onAccordionPress={handleTaskPress}>
                <List.Accordion expanded={tasksTypeList === '1'} titleStyle={[styles.sectionTitle,{color:theme.colors.onSurface}]} title="Today's Tasks" id="1">
                  {todaysTask.length > 0 ? todaysTask.map((task, index) => { return (<ServiceTask key={`todays-task-list-${index}`} navigation={navigation} task={task}></ServiceTask>) }) : <Empty style={{marginVertical: '5%'}} title="" subtitle="No appointments for today!"></Empty> }
                </List.Accordion>
                <List.Accordion expanded={tasksTypeList === '2'} titleStyle={[styles.sectionTitle,{color:theme.colors.onSurface}]} title="Upcoming Tasks" id="2">
                  {upcomingTasks.length > 0 ? upcomingTasks.map((task, index) => { return (<ServiceTask key={`upcoming-task-list-${index}`} navigation={navigation} task={task}></ServiceTask>) }) : <Empty title="" subtitle="No upcoming appointments found!"></Empty>}
                </List.Accordion>
              </List.AccordionGroup>
              {/* <TasksList navigation={navigation}></TasksList> */}
            </View>
          )}
          {viewMode == 'calendar' && <View>
            <Calendar></Calendar>
          </View>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    
  },
  profileName: {
    fontSize: 15,
    fontWeight: 600,

  },
  profileDes: {
    fontWeight: 500,
    color: '#898A8D',
  },
  listViewText: {
    fontSize: 18,
    fontWeight: 500,
    
    marginLeft: 5,
  },
  todaystask: {
    borderWidth: 1,
    padding: 20,
    borderColor: '#DADADA',
    borderRadius: 10,
    marginTop: 15
  },
});

export default HomeListView;
