import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, SafeAreaView, StyleSheet, useColorScheme} from 'react-native';
import {List, Divider, useTheme} from 'react-native-paper';
import Apis from '../../utils/apis';
import HTMLView from 'react-native-htmlview';
import Header from '../../components/common/Header';


const Faqs = ({navigation}) => {
  const api = new Apis();
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const bgColor = colorScheme === 'dark' ? theme.colors.surface : theme.colors.surfaceVariant;
  const [faqs, setFaqs] = useState([]);

  const getFaqs = () => {
    api
      .getFaqs()
      .then(res => {
        console.log(res);
        setFaqs(res);
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    getFaqs();
  }, []);
  
  const styles = StyleSheet.create({
    p: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingTop: -20,
      margin:0,
      lineHeight: 23,
      color:theme.colors.onSurface
    },
    ul: {
      padding: 10,
      margin: 0,
      position:'relative',
      top:-70,
      fontSize: 16,
      color:theme.colors.onSurface
    },
    li: {
      fontSize: 16,
      padding: 0,
      margin: 0,
      display:'flex',
      color:theme.colors.onSurface


    },
    ol: {
      paddingHorizontal: 10,
      margin: 0,
      position:'relative',
      top:-70,
      fontSize: 16,
      color:theme.colors.onSurface

    },
  });
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: bgColor}}>
      <Header navigation={navigation} type='back' options={{title: 'FAQs'}}></Header>
      <ScrollView>
        <View style={{marginHorizontal: 0}}>
          <List.Section>
            {faqs.map((faq, index) => (
              <View key={`faq-${index}`}>
                <List.Accordion
                  key={index}
                  title={faq.title}
                  titleNumberOfLines={2}
                  style={{margin:0, paddingHorizontal:0, paddingVertical: 5, backgroundColor: bgColor}}
                  titleStyle={{
                    fontWeight: '500',
                    color: theme.colors.onSurface,
                  }}>
                  <List.Item title={()=><HTMLView addLineBreaks={true} value={faq.description} stylesheet={styles} />} />
                </List.Accordion>
                {index < faqs.length -1 && <Divider />}
              </View>
            ))}
          </List.Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}; 
export default Faqs;
