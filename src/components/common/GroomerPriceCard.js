import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Pressable,
  useColorScheme,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import {Provider as PaperProvider, Menu, Card, Divider, List, IconButton, Button as BtnPaper, useTheme} from 'react-native-paper';
import { inHandAmount, gst, totalPrice, convenFee } from '../../utils/helpers';
import { colors } from '../../utils/styles/gobalstyle';

const GroomerPriceCard = ({item, index, isGstApplicable, onModify, onDelete, type, handleGstSwitchChange}) => {
const [visible, setVisible] = useState(false);
  const theme = useTheme();
  const colorScheme = useColorScheme();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

	return (
		<PaperProvider key={`groomer-service-card-${index}`}>
			<Card style={{marginBottom: 20, marginHorizontal: 5, backgroundColor: colorScheme == 'dark' ? theme.colors.background : theme.colors.surface}}>
				<Card.Title title={`${item.name}${item.isHomeVisit ? ' - Home Visit' : ''}`} subtitle={item.description} right={(props) => <Menu
						visible={visible}
						style={{position: 'absolute', top: 10, left: 205}}
						onDismiss={closeMenu}
						anchor={<IconButton iconColor={theme.colors.onSurface} icon='dots-vertical' onPress={openMenu}></IconButton>}>
						<Menu.Item onPress={() => {setVisible(false);onModify(item)}} titleStyle={{color: colors.green}} title="Modify" leadingIcon='pencil' />
						<Divider />
						<Menu.Item onPress={() => {setVisible(false);onDelete(item)}} titleStyle={{color: colors.red}} title="Remove" leadingIcon='delete' />
					</Menu>} />
				<Card.Content style={{margin: 0, padding: 0}}>
					<View style={{flexDirection: 'row'}}>
						<Text style={{flexGrow: 1,color:theme.colors.onSurface}}>Service Cost</Text>
						<Text style={{color:theme.colors.onSurface}}>₹ {parseFloat(item.rate).toFixed(2)}</Text>
					</View>

					{isGstApplicable && <View style={{flexDirection: 'row'}}>
						<Text style={{flexGrow: 1,color:theme.colors.onSurface}}>18% GST</Text>
						<Text style={{color: theme.colors.onSurface}}>₹ {item.gstPrice}</Text>
					</View>}

					<View style={{flexDirection: 'row'}}>
						<Text style={{flexGrow: 1,color:theme.colors.onSurface}}>Convenience Fee</Text>
						<Text style={{color:theme.colors.onSurface}}>₹ {item?.convenienceFee?.toFixed(2)}</Text>
					</View>
					<View style={{flexDirection: 'row'}}>
						<Text style={{flexGrow: 1, fontWeight: '700',color:theme.colors.onSurface}}>In-Hand Amount</Text>
						<Text style={{fontWeight: '700',color:theme.colors.onSurface}}>₹ {parseFloat(item.rate - item.convenienceFee).toFixed(2)}</Text>
					</View>
				</Card.Content>
			</Card>
		</PaperProvider>
	)
};

export default GroomerPriceCard;