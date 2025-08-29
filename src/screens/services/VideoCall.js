import { 
	View,
	Dimensions,
	StyleSheet
  } from 'react-native';
  import {SafeAreaView} from 'react-native-safe-area-context';
  import React, {useState, useRef, useEffect} from 'react';
  import { IconButton, useTheme } from 'react-native-paper';
  import {REACT_APP_TOKBOX_API_KEY} from '@env';
  import { OTSession, OTPublisher, OTSubscriber } from 'opentok-react-native';
  import { useRoute } from '@react-navigation/native';
  
  import Apis from '../../utils/apis';
  import Loader from '../../components/common/Loader';
  import Toaster from '../../components/common/Toaster';
  
  import { useAuthState } from '../../services/auth';
  import { useWorspaceState } from '../../services/workspace';
  import { useAppointmentState } from '../../services/appointments';
  import { container, colors } from '../../utils/styles/gobalstyle';
  
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  
  const VideoCall = ({navigation}) => {
	  const api = new Apis();
	  const theme = useTheme();
	  const route = useRoute();
	  const sessionRef = useRef(null);
  
	  const {userData} = useAuthState();
	  const {defaultWorkspace} = useWorspaceState();
	  const {setAppointments} = useAppointmentState();
  
	  const [apiKey, setApiKey] = useState(REACT_APP_TOKBOX_API_KEY);
	  const [sessionId, setSessionId] = useState(null);
	  const [token, setToken] = useState(null);
	  const [isLoading, setLoading] = useState(true);
	  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
	  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
	  const [camera, setCamera] = useState('front');
  
	  const getAllAppointments = async () => {
		  api.getWorkspaceAppointments(userData.id, defaultWorkspace.id, { status: 'all' })
		  .then(res => {
			  const responseData = res && res.length > 0 ? res : [];
			  setAppointments(responseData);
			  if (sessionRef.current) {
				  sessionRef.current.disconnectSession();
			  }
			  navigation.pop(2);
		  }).catch(err => {
			  console.log("getAllAppointments Error: ", err);
			  Toaster({message: `Oops! An error occurred, please try again later.`});
			  if (sessionRef.current) {
				  sessionRef.current.disconnectSession();
			  }
			  navigation.pop(2);
		  });
	  }
  
	  const startCall = async() => {
		  try {
			  setLoading(true);
			  const res = await api.startVideoCall(userData.id, route.params.appointmentId);
			  setApiKey(REACT_APP_TOKBOX_API_KEY);
			  setSessionId(res.sessionId);
			  setToken(res.token);
			  setLoading(false);
		  } catch (error) {
			  console.log(error);
			  setLoading(false);
		  }
	  };
  
	  const handleCallDisconnect = async () => {
		  await getAllAppointments();
		  setSessionId(null); // Clear sessionId on disconnect to avoid rendering OTSession with null
		  setToken(null); // Clear token as well
	  };
  
	  const handleSessionEvent = {
		  streamCreated: event => {
			  console.log('Stream created!', event);
		  },
		  streamDestroyed: event => {
			  console.log('Stream destroyed!', event);
			  setIsAudioEnabled(false);
			  setIsVideoEnabled(false);
		  },
		  sessionConnected: event => {
			  console.log(event);
		  }
	  };
  
	  const publisherProperties = {
		  publishAudio: isAudioEnabled,
		  publishVideo: isVideoEnabled,
		  cameraPosition: camera
	  };
  
	  const subscriberEventHandlers = {
		  connected: event => {
			  console.log('Subscriber connected!', event);
		  },
		  disconnected: event => {
			  console.log('Subscriber disconnected!', event);
		  },
		  error: event => {
			  console.log('Subscriber error!', event);
		  }
	  };
  
	  useEffect(() => {
		  startCall();
		  return () => {
			  if (sessionRef.current) {
				  sessionRef.current.disconnectSession(); // Ensure the session is disconnected on unmount
			  }
		  };
	  }, []);
  
	  return (
		  <SafeAreaView style={container}>
			  {isLoading ? (
				  <Loader visible={isLoading} />
			  ) : (
				  sessionId && token && (
					  <OTSession ref={sessionRef} apiKey={apiKey} sessionId={sessionId} token={token} eventHandlers={handleSessionEvent}>
						  <View style={{flex: 1, backgroundColor: colors.black}}>
							  <OTSubscriber
								  eventHandlers={subscriberEventHandlers}
								  style={{ width: width, height: height }}
							  />
							  <OTPublisher
								  properties={publisherProperties}
								  error={(error) => console.log(error)}
								  style={{ width: width, height: height }}
							  />
							  <View style={{position: 'absolute', bottom: 10, flexGrow: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', zIndex: 99999}}>
								  <IconButton
									  icon={isAudioEnabled ? 'microphone-off' : 'microphone'}
									  iconColor={isAudioEnabled ? colors.white : colors.green}
									  size={40}
									  onPress={() => setIsAudioEnabled(preVal => !preVal)}
								  />
								  <IconButton
									  icon={isVideoEnabled ? 'video-off' : 'video'}
									  iconColor={isVideoEnabled ? colors.white : colors.green}
									  size={40}
									  onPress={() => setIsVideoEnabled(preVal => !preVal)}
									  style={{marginLeft: 20}}
								  />
								  <IconButton
									  icon="camera-flip"
									  iconColor={colors.yellow}
									  size={40}
									  onPress={() => setCamera(preVal => (preVal === 'front' ? 'back' : 'front'))}
									  style={{marginLeft: 20}}
								  />
								  <IconButton
									  icon="phone-hangup"
									  iconColor={colors.red}
									  size={40}
									  onPress={handleCallDisconnect}
									  style={{marginLeft: 20}}
								  />							
							  </View>
						  </View>
					  </OTSession>
				  )
			  )}
		  </SafeAreaView>
	  );
  };
  
  const styles = StyleSheet.create({});
  
  export default VideoCall;
  