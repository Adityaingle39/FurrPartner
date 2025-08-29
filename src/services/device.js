import React, {useContext} from 'react';
import {AppContext} from './states';

export function useDeviceState() {
  const context = useContext(AppContext);
  if (!context) {
    // This can happen if the component is rendered outside the AppProvider
    // Return a default state and a no-op function to prevent crashes.
    return {
      deviceData: {},
      setDeviceData: () => {},
    };
  }
  const [state, dispatch] = context;
  const currentTokenData = state?.token;
  let returnData = {
    deviceId: null,
    buildId: null,
    deviceName: null,
    manufacturer: null,
    model: null,
    systemVersion: null,
    registerToken: null,
    fcmRegistered: null,
  };
  let tokenData = Object.assign({}, currentTokenData);
  return {
    deviceData: Object.assign(returnData, currentTokenData),
    setDeviceData: data => {
      dispatch({type: 'token', payload: data});
    },
  };
}