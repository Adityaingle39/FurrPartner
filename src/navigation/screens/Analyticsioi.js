import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet
  } from 'react-native';
  import React, {useState} from 'react';
  import { Divider, useTheme } from 'react-native-paper';
  import Icons from 'react-native-vector-icons/Feather';
  import Header from '../../components/common/Header';
  
  const Analytics = ({navigation}) => {
    // const [getSelectionMode, setSelectionMode] = useState(1);
    // const [ViewArea, setViewArea] = useState(1);
    // //   const [showValue, setShowValue] = useState(false);
  
    // const updateSwitchData = value => {
    //   setSelectionMode(value);
    //   onSelectSwitch(value);
    // };
  
    // const onSelectSwitch = value => {
    //   setViewArea(value);
    // };
   const theme=useTheme()
    return (
      <SafeAreaView style={{flex: 1}}>
        <Header navigation={navigation}></Header>
        <Image style={{width:'100%'}} resizeMode='cover' source={require("../../assets/Dashboard.png")} />
        <Text style={{position:'absolute',top:'40%',left:'25%',fontSize:30,color:theme.colors.onSurface,fontWeight:'500'}}>Comming Soon</Text>
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
  