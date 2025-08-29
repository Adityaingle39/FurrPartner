import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context';
import React from 'react'
import { Button } from 'react-native-paper';
import Icons from 'react-native-vector-icons/Feather';
import { btn, container, spacingProperty, flexDirectionRow, alignItemsCenter, colors, heading, subHeading } from '../../../utils/styles/gobalstyle';

const RequiredVerification = ({ navigation }) => {
  const navigateButton = () => {
    navigation.navigate('LoadingSetting')
  }
  return (

    <SafeAreaView style={container}>
      <ScrollView>
        <View style={spacingProperty['m-20']}>
          <View
            style={[
              spacingProperty['pb-20'],
              spacingProperty['mt-20'],
              flexDirectionRow,
              alignItemsCenter,
            ]}>
            <View style={{ flex: 0.5 }}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icons name="arrow-left" size={30} color={colors.black}></Icons>
              </TouchableOpacity>
            </View>
            <View style={[alignItemsCenter, { flex: 5 }]}>
              <Text style={heading}>Create Workspace</Text>
              <Text style={subHeading}>Enter your information to continue</Text>
            </View>
          </View>

          <Text style={styles.titleText}>Required Documents</Text>
          <Text style={styles.subHeadingText}>Enter your information to continue</Text>

          <View>



            <View style={{ marginTop: 25 }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('SettingEditProfile')}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomWidth: 1,
                  borderBottomColor: '#DADADA',
                  paddingBottom: 15,
                }}>
                <Text
                  style={{ fontSize: 18, marginRight: 100, color: '#484848' }}>
                  Doctor’s License
                </Text>
                <Icons
                  name="chevron-right"
                  size={20}
                  style={{ marginRight: 15 }}
                />
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 25 }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('SettingEditProfile')}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomWidth: 1,
                  borderBottomColor: '#DADADA',
                  paddingBottom: 15,
                }}>
                <Text
                  style={{ fontSize: 18, marginRight: 100, color: '#484848' }}>
                  Qualification Certificate
                </Text>
                <Icons
                  name="chevron-right"
                  size={20}
                  style={{ marginRight: 15 }}
                />
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 25 }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('SettingEditProfile')}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomWidth: 1,
                  borderBottomColor: '#DADADA',
                  paddingBottom: 15,
                }}>
                <Text
                  style={{ fontSize: 18, marginRight: 100, color: '#484848' }}>
                  Bank Details
                </Text>
                <Icons
                  name="chevron-right"
                  size={20}
                  style={{ marginRight: 15 }}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.titleText}>Required Documents</Text>
            <View style={{ marginTop: 25 }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('SettingEditProfile')}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomWidth: 1,
                  borderBottomColor: '#DADADA',
                  paddingBottom: 15,
                }}>
                <Text
                  style={{ fontSize: 18, color: '#484848' }}>
                  Aadhar Card
                </Text>
                <Icons
                  name="chevron-right"
                  size={20}
                  style={{ marginRight: 15 }}
                />
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 25 }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('SettingEditProfile')}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomWidth: 1,
                  borderBottomColor: '#DADADA',
                  paddingBottom: 15,
                }}>
                <Text
                  style={{ fontSize: 18, marginRight: 100, color: '#484848' }}>
                  Pan Card
                </Text>
                <Icons
                  name="chevron-right"
                  size={20}
                  style={{ marginRight: 15 }}
                />
              </TouchableOpacity>
            </View>
          </View>


        </View>
      </ScrollView>
      <View style={[spacingProperty['m-20']]}>
        <Button style={[btn, {flexGrow: 1, width: '100%'}]} textColor={colors.white} icon="file-document-multiple-outline" mode="contained" onPress={navigateButton}>Next</Button>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 22,
    fontWeight: 600,

    marginTop: 20,
    color: '#0F172A',
  },
  subHeadingText: {
    fontSize: 15,
    color: '#898A8D',

  }
});

export default RequiredVerification