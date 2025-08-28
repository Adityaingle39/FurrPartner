import React, { useContext, useReducer } from 'react';
import { AppContext } from './states';

export function useServiesState() {
    const [state, dispatch] = useContext(AppContext);
    const dbData = state?.services;

    let returnData = {
        id: null,
        name: null,
        createdBy: null,
        active: false
    };

    return {
        services: dbData,
        setServices: data => {
            dispatch({ type: 'services', payload: data });
        },
    };
}
