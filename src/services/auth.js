import React, {useContext, useReducer} from 'react';
import {AppContext} from './states';

export function useAuthState() {
  const service = 'auth';
  const [state, dispatch] = useContext(AppContext);

  const currentUserData = state?.auth;

  let returnData = {
    count: 0,
    isLoggedIn: false,
    id: null,
    email: null,
    countryCode: '+91',
    mobile: null,
    collaboratorName: null,
    city: null,
    otpId: null,
    verified: false,
    emailVerified: false,
    imageUrl: null,
  };

  let userData = Object.assign({}, currentUserData);
  return {
    userData: Object.assign(returnData, currentUserData),
    setUserData: data => {
      dispatch({type: 'auth', payload: Object.assign(returnData, data)});
    },
    setUserImage: data => {
      userData.imageUrl = data;
      dispatch({type: 'auth', payload: userData});
    },
    toggleLogIn: () => {
      userData.isLoggedIn = !userData.isLoggedIn;
      dispatch({type: 'auth', payload: userData});
    },
    setVerified: verified => {
      userData.verified = verified;
      dispatch({type: 'auth', payload: userData});
    },
    setId: id => {
      userData.id = id;
      dispatch({type: 'auth', payload: userData});
    },
    setEmail: email => {
      userData.email = email;
      dispatch({type: 'auth', payload: userData});
    },
    setCountryCode: code => {
      userData.countryCode = code;
      dispatch({type: 'auth', payload: userData});
    },
    setPhone: phone => {
      userData.mobile = phone;
      dispatch({type: 'auth', payload: userData});
    },
    setCollaboratorName: name => {
      userData.collaboratorName = name;
      dispatch({type: 'auth', payload: userData});
    },
    setCity: city => {
      userData.city = city;
      dispatch({type: 'auth', payload: userData});
    },
    setOtpId: id => {
      userData.otpId = id;
      dispatch({type: 'auth', payload: userData});
    },
  };
}
