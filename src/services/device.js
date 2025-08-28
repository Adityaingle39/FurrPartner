import React, {useContext} from 'react';
import {AppContext} from './states';

export function useDeviceState() {
  const [state, dispatch] = useContext(AppContext);
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