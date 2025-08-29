import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, {useState,useEffect} from 'react';
import { Divider, useTheme } from 'react-native-paper';
import Icons from 'react-native-vector-icons/Feather';
import Header from '../../components/common/Header';
import Apis from '../../utils/apis';
import { useWorspaceState } from '../../services/workspace';
const Analytics = ({navigation}) => {
  const [getSelectionMode, setSelectionMode] = useState(1);
  const [ViewArea, setViewArea] = useState(1);
  const [analyticsData,setAnalyticsData]=useState();
  const [isLoading, setLoading] = React.useState(false);
  const {defaultWorkspace} = useWorspaceState();
  //   const [showValue, setShowValue] = useState(false);

  // const updateSwitchData = value => {
  //   setSelectionMode(value);
  //   onSelectSwitch(value);
  // };

  // const onSelectSwitch = value => {
  //   setViewArea(value);
  // };
  const api = new Apis()
  const getAnalticsData = () => {
    try {
      setLoading(true);
      api.getAnaltics(defaultWorkspace.collaboratorId,defaultWorkspace.id)
      .then(res => {
        console.log("anaytics",res);
        setAnalyticsData(res);
      }).catch(error => {
        throw error;
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAnalticsData();
  }, []);
 const theme=useTheme()
  return (
    <SafeAreaView style={{flex: 1}}>
      <Header navigation={navigation}></Header>
      <ScrollView style={{marginHorizontal: 20}}>
        <View style={{marginBottom: 10}}>
          <Text style={[styles.listViewText,{color:theme.colors.onSurface}]}>Monthly Analytics</Text>
        </View>
        <Divider />
        <View
          style={{
            marginTop: 10,
            marginBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity>
            {/* <Icons name="chevron-down" size={25} color={theme.colors.onSurface} /> */}
          </TouchableOpacity>
          <Text style={[styles.sublistViewText,{color:theme.colors.onSurface}]}>Patient Analytics</Text>
          <Icons />
        </View>

        <View>
          <View style={{flexDirection: 'row'}}>
            <View style={[styles.dashboardCard, {flexGrow: 1, marginLeft: 0}]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: 15,
                  marginVertical: 10,
                  alignItems: 'center',
                }}>
                <Text style={[styles.dashboardtitle,{color:theme.colors.onSurface}]}>Total Patients</Text>
                <Image
                  source={require('../../assets/dashImg1.png')}></Image>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: 15,
                  marginVertical: 10,
                  alignItems: 'center',
                }}>
              <Text style={[styles.dashboardtitleNo,{color:theme.colors.onSurface}]}>
                {analyticsData?.totalPatient ?? 0}
              </Text>

                <View style={{alignItems: 'center'}}>
                  <Text style={styles.innerdashupperText}>0 more</Text>
                  <Text style={[styles.innerdashText,{color:theme.colors.onSurface}]}>from last month</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',

                  marginHorizontal: 15,
                  marginVertical: 10,
                  alignItems: 'center',
                }}>
                <Icons
                  name="trending-up"
                  size={15}
                  style={{color: '#28B446'}}></Icons>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    marginLeft: 5,
                    color: '#28B446',
                  }}>
                  Trends Up
                </Text>
              </View>
            </View>
            <View style={[styles.dashboardCard, {flexGrow: 1, marginRight: 0}]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: 15,
                  marginVertical: 10,
                  alignItems: 'center',
                }}>
                <Text style={[styles.dashboardtitle,{color:theme.colors.onSurface}]}>Return Patients</Text>
                <Image
                  source={require('../../assets/dashImg2.png')}></Image>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: 15,
                  marginVertical: 10,
                  alignItems: 'center',
                }}>
                <Text style={[styles.dashboardtitleNo,{color:theme.colors.onSurface}]}>{analyticsData?.returnedPatient ?? 0}</Text>
                <View style={{alignItems: 'center'}}>   
                  <Text style={[styles.innerdashupperText,{color:theme.colors.onSurface}]}>0 less</Text>
                  <Text style={[styles.innerdashText,{color:theme.colors.onSurface}]}>from last month</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',

                  marginHorizontal: 15,
                  marginVertical: 10,
                  alignItems: 'center',
                }}>
                <Icons
                  name="trending-up"
                  size={15}
                  style={{color: '#666666'}}></Icons>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    marginLeft: 5,
                    color: '#28B446',
                  }}>
                  Trends Down
                </Text>
              </View>
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={[styles.dashboardCard, {flexGrow: 1, marginLeft: 0}]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: 15,
                  marginVertical: 10,
                  alignItems: 'center',
                }}>
                <Text style={[styles.dashboardtitle,{color:theme.colors.onSurface}]}>New Patients</Text>
                <Image
                  source={require('../../assets/dashImg3.png')}></Image>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: 15,
                  marginVertical: 10,
                  alignItems: 'center',
                }}>
                <Text style={[styles.dashboardtitleNo,{color:theme.colors.onSurface}]}>{analyticsData?.newPatient ?? 0}</Text>
                <View style={{alignItems: 'center'}}>
                  <Text style={[styles.innerdashupperText,{color:'#9747FF'}]}>0 more</Text>
                  <Text style={[styles.innerdashText,{color:theme.colors.onSurface}]}>from last month</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',

                  marginHorizontal: 15,
                  marginVertical: 10,
                  alignItems: 'center',
                }}>
                <Icons
                  name="trending-up"
                  size={15}
                  style={{color: '#28B446'}}></Icons>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    marginLeft: 5,
                    color: '#28B446',
                  }}>
                  Trends Up
                </Text>
              </View>
            </View>
            <View style={[styles.dashboardCard, {flexGrow: 1, marginRight: 0}]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: 15,
                  marginVertical: 10,
                  alignItems: 'center',
                }}>
                <Text style={[styles.dashboardtitle,{color:theme.colors.onSurface}]}>
                  Patients Reviews
                </Text>
                <Image
                  source={require('../../assets/dashImg4.png')}></Image>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: 15,
                  marginVertical: 10,
                  alignItems: 'center',
                }}>
                <Text style={[styles.dashboardtitleNo, {color: '#FCBB00'}]}>
                 {analyticsData?.reviewCount ?? 0}
                  <Text style={{fontSize: 20, color:theme.colors.onSurface}}>/5</Text>
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',

                  marginHorizontal: 15,
                  marginVertical: 10,
                  alignItems: 'center',
                }}>
                <Icons
                  name="trending-up"
                  size={15}
                  style={{color: '#28B446'}}></Icons>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    marginLeft: 5,
                    color: '#28B446',
                  }}>
                  Trends Up
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            marginTop: 20,
            marginBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity>
            {/* <Icons name="chevron-down" size={25} color={theme.colors.onSurface} /> */}
          </TouchableOpacity>
          <Text style={[styles.sublistViewText,{color:theme.colors.onSurface}]}>Appointment Analytics</Text>
          <Icons />
        </View>
        <View style={{alignItems:'center',paddingBottom:60}}>
        <View style={styles.appoanalyticsView}>
          <Text style={{fontSize:20,color:theme.colors.onSurface,fontWeight:600}}>Visits</Text>
          <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:20}}>
          <Text style={{color:theme.colors.onSurface,fontWeight:600,fontSize:13}}>OFFLINE</Text>
          <Text style={{fontSize:15,color:theme.colors.onSurface,fontWeight:500,marginRight:'20%'}}>{analyticsData?.offline ?? 0}</Text>
          </View>
          <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:20}}>
            <Text style={{color:theme.colors.onSurface,fontWeight:600,fontSize:13}}>ONLINE</Text>
            <Text style={{fontSize:15,color:theme.colors.onSurface,fontWeight:500,marginRight:'20%'}}>{analyticsData?.online ?? 0}</Text>
          </View>
          <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:20}}>
            <Text style={{color:theme.colors.onSurface,fontWeight:600,fontSize:13}}>CANCELLED</Text>
            <Text style={{fontSize:15,color:theme.colors.onSurface,fontWeight:500,marginRight:'20%'}}>{analyticsData?.cancelled ?? 0}</Text>
          </View>
          <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:20}}>
            <Text style={{color:theme.colors.onSurface,fontWeight:600,fontSize:13}}>REJECTED</Text>
            <Text style={{fontSize:15,color:theme.colors.onSurface,fontWeight:500,marginRight:'20%'}}>{analyticsData?.rejected ?? 0}</Text>

          </View>
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  profileName: {
    fontSize: 15,
    fontWeight: 600,
    color: '#000000',
  },
  profileDes: {
    fontWeight: 500,
    color: '#898A8D',
  },
  listViewText: {
    fontSize: 18,
    fontWeight: 500,
    color: '#000000',
    marginLeft: 5,
  },
  sublistViewText: {
    fontSize: 17,
    fontWeight: 500,
    color: '#000000',
    marginLeft: 5,
  },
  dashboardCard: {
    height: 150,
    width: '45%',
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DADADA',
  },
  dashboardImage: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dashboardText: {
    textAlign: 'center',
    marginTop: 5,
    color: '#8391A1',
    fontSize: 15,
    fontWeight: 500,
  },
  dashboardtitle: {
    fontSize: 15,
    fontWeight: 600,
    color: '#000000',
  },
  dashboardtitleNo: {
    fontSize: 30,
    color: '#000000',
    fontWeight: 800,
  },
  innerdashText: {
    fontSize: 10,
  },
  innerdashupperText: {
    color: '#3193EC',
    fontSize: 12,
    fontWeight: 500,
  },
  appoanalyticsView:{
    width:"100%",
    borderWidth:1,
    borderColor:'#DADADA',
    borderRadius:10,
    padding:20,
   
  }
});

export default Analytics;
