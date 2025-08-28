import React, {useContext} from 'react';
import {AppContext} from './states';
import Apis from '../utils/apis';
  
export function useLogoutState() {
  const [state, dispatch] = useContext(AppContext);

  return {
    logoutSystem: () => {

      return new Promise((resolve, reject) => {
        try {
          dispatch({type: 'logout'});
          resolve(true);
        } catch (error) {
          reject(error);
        }
      })
    },
  };
}
