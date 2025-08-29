import React, {createContext, useReducer} from 'react';

const initialState = {
  auth: {},
  workspaces: [],
  rolls: [],
  services: [],
  appointments: [],
  banks: [],
  requests: [],
  notifications: [],
  token: {},
};

function reducer(state, action) {
  switch (action.type) {
    case 'auth':
      return {...state, auth: action.payload};
    case 'rolls':
      return {...state, rolls: action.payload};
    case 'workspaces':
      return {...state, workspaces: action.payload};
    case 'services':
      return {...state, services: action.payload};
    case 'appointments':
      return {...state, appointments: action.payload};
    case 'banks':
      return {...state, banks: action.payload};
    case 'requests':
      return {...state, requests: action.payload};
    case 'notifications':
      return {...state, notifications: action.payload};
    case 'token':
      return {...state, token: action.payload};
    
    case 'logout':
      return {...state, auth: {},
      workspaces: [],
      rolls: [],
      services: [],
      appointments: [],
      banks: [],
      requests: [],
      notifications: [],
      token: {}}
    default:
      return state;
  }
}

export const AppContext = createContext([initialState, () => {}]);

export const AppProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={[state, dispatch]}>
      {children}
    </AppContext.Provider>
  );
};
