import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
  } from 'react-native';
  import React from 'react';
  import Icon from 'react-native-vector-icons/Feather';
  import {SafeAreaView} from 'react-native-safe-area-context';
  
  
  const OfflineConsultation = ({navigation}) => {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <ScrollView style={{padding: 20}}>
          <View style={{marginVertical: 10}}>
            <TouchableOpacity onPress={() => navigation.goBack("HomeListView")}>
              <Icon name="arrow-left" size={30} color="#0F172A"></Icon>
            </TouchableOpacity>
            <Text style={styles.titleText}>Offline Consultation</Text>
          </View>
          <View
            style={{
              marginVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 10,
              paddingBottom:15,
              borderBottomColor: '#D9D9D9',
              borderBottomWidth: 1,
            }}>
            <Image source={require('../../assets/petProfile.png')} />
            <View style={{marginLeft: 20}}>
              <Text style={{fontSize: 15, color: '#000000', fontWeight: 600}}>
                Oscar
              </Text>
              <Text style={{fontSize: 13, fontWeight: 500}}>
                Bulldog
              </Text>
            </View>
          </View>
          <View style={{ 
              marginVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 10,
              paddingBottom:15,
              paddingLeft:20,
              borderBottomColor: '#D9D9D9',
              borderBottomWidth: 1,}}
              >
  
              <Icon name='loader' size={25} />
              <Text style={[styles.onlineList,{color:'#EC5E59'}]}>Cancelled</Text>
            </View>
            <View style={{ 
              marginVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 10,
              paddingBottom:15,
              paddingLeft:20,
              borderBottomColor: '#D9D9D9',
              borderBottomWidth: 1,}}
              >
  
              <Icon name='clock' size={25} />
              <Text style={styles.onlineList}>Feb 8, 2023   12:30 PM</Text>
            </View>
            <View style={{ 
              marginVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 10,
              paddingBottom:15,
              paddingLeft:20,
              borderBottomColor: '#D9D9D9',
              borderBottomWidth: 1,}}
              >
  
              <Icon name='video' size={25} />
              <Text style={styles.onlineList}>Offline</Text>
            </View>
            <View style={{ 
              marginVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 10,
              paddingBottom:15,
              paddingLeft:20,
              borderBottomColor: '#D9D9D9',
              borderBottomWidth: 1,}}
              >
  
              <Icon name='dollar-sign' size={25} />
              <Text style={styles.onlineList}>₹450.00</Text>
            </View>
            <View style={{marginTop:50 ,alignItems:'center'}}>
              <TouchableOpacity>
                  <Text style={{
                      color:'#EC5E59',
                      fontWeight:600,
                      borderStyle:"dashed",
                      borderBottomWidth:2,
                      borderBottomColor:'#EC5E59',
                      marginTop:10
                  }}>Cancel Appointment</Text>
              </TouchableOpacity>
            </View>
        </ScrollView>
      </SafeAreaView>
    );
  };
  const styles = StyleSheet.create({
    titleText: {
      fontSize: 20,
      fontWeight: 600,
  
      marginTop: 15,
      color: '#000000',
    },
    onlineList:{
      fontSize:15,
      fontWeight:400,
      marginLeft:35,
      
    }
  });
  export default OfflineConsultation;
  