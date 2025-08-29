import {
	Alert,
	View,
	Text,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	Linking,
	Pressable,
	InteractionManager,
	useColorScheme
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, {useState} from 'react';
import Icons from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Iicon from 'react-native-vector-icons/Ionicons';
import { REACT_APP_WEB_URL } from '@env';
import { getVersion, getBuildNumber } from 'react-native-device-info';
import { List, useTheme } from 'react-native-paper';

import Header from '../../components/common/Header';
import Loader from '../../components/common/Loader';
import { logout } from '../../utils/helpers';
import { useLogoutState } from '../../services/logout';
import { useWorspaceState } from '../../services/workspace';
import { useAppointmentState } from '../../services/appointments';

const ListItem = ({ navigation, item, index }) => {
	const theme = useTheme();
	const colorScheme = useColorScheme();

	if (item.type == 'accordion') {
		return (<ListAccordion navigation={navigation} section={item} index={`child-accordion-${index}`}></ListAccordion>);
	} else {
		return (<List.Item
			key={index}
			style={{ borderBottomWidth: 1, backgroundColor: item.bgColor, borderBottomColor: theme.colors.outlineVariant, paddingBottom: 15, backgroundColor: item && 'bgColor' in item ? item.bgColor : null }}
			title={item.title}
			left={props => <List.Icon {...props} icon={item.icon} color={item.iconColor} />}
			right={props => <List.Icon {...props} icon={props.isExpanded ? 'chevron-down' : 'chevron-right'} />}
			onPress={() => { item.link !== null ? (item.type == 'component' ? navigation.navigate(`${item.link}`) : (item.type == 'click' ? item.link(navigation) : (item.type == 'webview' ? navigation.navigate('MyView', {url: item.link, title: item.title}) : Linking.openURL(item.link)))) : null; }}
		/>);
	}
};

const ListAccordion = ({ navigation, section, index }) => {
	const theme = useTheme();
	const colorScheme = useColorScheme();
	const bgColor = colorScheme === 'dark' ? theme.colors.surface : theme.colors.surfaceVariant;

	return (<List.Accordion
		key={`setting-item-accordion-${index}`}
		style={{ borderBottomWidth: 1, borderBottomColor: theme.colors.outlineVariant, paddingBottom: 15, paddingLeft: 15, backgroundColor: bgColor }}
		title={section.title}
		titleStyle={{marginLeft: 10}}
		left={props => <List.Icon {...props} icon={section.icon} color={section.iconColor} />}
		right={props => props.isExpanded === false ? <List.Icon {...props} icon="chevron-right" style={{ marginRight: 8 }} /> : <List.Icon {...props} icon="chevron-down" style={{ marginRight: 8 }} />}
	// onPress={() => { item.link !== null ? (item.component == 'component' ? navigation.navigate(`${item.link}`) : Linking.openURL(item.link)) : null; }}
	>
		{section.children.filter(i => i.hide === false).map((item, itemIndex) => {
			return (<ListItem key={`setting-accordion-item-${index}-${itemIndex}`} navigation={navigation} item={item} index={`setting-accordion-item-${index}-${itemIndex}`}></ListItem>);
		})}
	</List.Accordion>);
};

const Setting = ({ navigation }) => {
	const theme = useTheme();
	const colorScheme = useColorScheme();
	const bgColor = colorScheme === 'dark' ? theme.colors.surface : theme.colors.surfaceVariant;
	const childBgColor = colorScheme === 'dark' ? theme.colors.background : theme.colors.background;

	const [isLoading, setLoading] = useState(false);

	const { logoutSystem } = useLogoutState();
	const { workspacesData, defaultWorkspace, setWorkspaces } = useWorspaceState();
	const { setAppointments } = useAppointmentState();

	const handleLogoutEvent = () => {
		Alert.alert('Sign Out', `Would you like to logout from the app?`, [
		  {
			text: 'Cancel',
			onPress: () => null,
			style: 'cancel',
		  },
		  { text: 'Yes', onPress: () => {
			setLoading(true);
			InteractionManager.runAfterInteractions(() => {
			  logoutSystem()
				.then(res => {
				  setLoading(false);
				//   setWorkspaces([]);
				//   setAppointments([]);
				  logout(navigation, 'logout');
				})
				.catch(error => {
				  setLoading(false);
				});
			});
			setLoading(false);
		  }},
		]);
		return true;
	};
		
	const listItems = [
		{
			title: 'My Details', items: [
				{ hide: false, title: 'Edit Profile', iconColor: '#6B6BFF', icon: 'account-circle', type: 'component', link: 'BasicInformation' },
				{ hide: false, title: 'Appointments', iconColor: '#9db428', icon: 'calendar-clock', type: 'accordion', link: null, children: [
					{ hide: false, title: 'Upcoming', bgColor: childBgColor, iconColor: '#28b436', icon: 'calendar-arrow-right', type: 'component', link: 'AppointmentsUpcoming' },
					{ hide: false, title: 'Previous', bgColor: childBgColor, iconColor: '#b46e28', icon: 'calendar-arrow-left', type: 'component', link: 'AppointmentsPrevious' },
				] },
				{ hide: false, title: 'Requests', iconColor: '#FFA31A', icon: 'calendar-import', type: 'accordion', link: null, children: [
					{ hide: false, title: 'Accepted', bgColor: childBgColor, iconColor: '#018c0d', icon: 'calendar-arrow-right', type: 'component', link: 'RequestsAccepted' },
					{ hide: false, title: 'Rejected', bgColor: childBgColor, iconColor: '#ff1e1a', icon: 'calendar-arrow-left', type: 'component', link: 'RequestsRejected' },
					{ hide: false, title: 'Cancelled', bgColor: childBgColor, iconColor: '#FFA31A', icon: 'calendar-remove', type: 'component', link: 'RequestsCancelled' },
				] },
				{
					hide: false, title: 'Workspace Details', iconColor: '#9747FF', icon: 'office-building-marker', type: 'accordion', link: null, children: [
						{ hide: false, title: 'Information', bgColor: childBgColor, iconColor: '#9747FF', icon: 'office-building', type: 'component', link: 'WorkspaceInformation' },
						{ hide: false, title: 'Services', bgColor: childBgColor, iconColor: '#4753ff', icon: 'gift', type: 'component', link: 'WorkspaceServices' },
						// { title: 'Bank Details', bgColor: childBgColor, iconColor: '#FCBB00', icon: 'bank', type: 'component', link: "BankInformation" },
						{ hide: false, title: 'Vacation Mode', bgColor: childBgColor, iconColor: '#28B446', icon: 'tree', type: 'component', link: "VacationStatus" },
					],
				},
				{ hide: workspacesData.length === 1||workspacesData.length === 0, title: 'Set Default Workspace', iconColor: '#9747FF', icon: 'view-list', type: 'component', link: 'ChangeWorkspace'}
			]
		},
		{
			title: 'Account', items: [
				// {title: 'General Settings', iconColor: '#808080', icon: 'cog', type: 'component', link: null},
				{ hide: false, title: 'Help & Support Center', iconColor: '#28B446', icon: 'help-box', type: 'component', link: 'HelpCenters' },
				{ hide: false, title: 'FAQ', iconColor: '#08a3d8', icon: 'frequently-asked-questions', type: 'component', link: 'Faqs' },
				{ hide: false, title: 'Privacy Policy', iconColor: '#9747FF', icon: 'note-text-outline', type: 'webview', link: `https://furrcrew.com/privacy-policy` },
				{ hide: false, title: 'Terms & Conditions', iconColor: '#ccbf2b', icon: 'script-text', type: 'webview', link: `https://furrcrew.com/terms-conditions` },

				{ hide: false, title: 'Log Out', iconColor: '#EC5E58', icon: 'logout', type: 'click', link: handleLogoutEvent },
			]
		},
	];

	// console.log("REACT_APP_WEB_URL", REACT_APP_WEB_URL);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
			<Loader title="Please wait..." visible={isLoading}></Loader>
			<Header navigation={navigation} type='main' options={{ title: 'Settings', subTitle: defaultWorkspace ? defaultWorkspace.workplaceName : `Manage Workspace` }}></Header>
			<ScrollView style={{flex: 1, marginBottom: 40}}>
				<List.Section>
					{listItems.map((section, index) => {
						return (<View key={`settings-section-${index}`} style={{ marginBottom: 15 }}>
							<List.Subheader key={`settings-subheader-${index}`} style={{ fontSize: 22, fontWeight: '600', color: theme.colors.onSurface }}>{section.title}</List.Subheader>
							{section.type != 'accordion' ? section.items.filter(i => i.hide === false).map((item, itemIndex) => {
								return (<ListItem key={`settings-item-${index}-${itemIndex}`} navigation={navigation} item={item} index={`${index}-${itemIndex}`}></ListItem>);
							}) : null}
						</View>);
					})}
				</List.Section>
				<View style={{flexDirection:'row', justifyContent:'center', paddingBottom: 40, marginTop:0}}>
          <Text style={{color: theme.colors.onSurface}}>Version: {getVersion()}</Text>
        </View>
			</ScrollView>
		</SafeAreaView>
	);
};
const styles = StyleSheet.create({
	titleText: {
		fontSize: 22,
		fontWeight: 600,
		marginLeft: 20,
		marginTop: 20,
	},
});

export default Setting;
