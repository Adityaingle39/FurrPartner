import React, { useContext, useReducer } from 'react';
import { AppContext } from './states';

export function useBankState() {
    const [state, dispatch] = useContext(AppContext);
    const dbData = state?.banks;

    let returnData = {
        id: null,
        name: null,
        ifsc: null,
        accountNumber: null,
        pan: null,
        gst: null,
        workspaceId: null,
        createdBy: null,
        active: false,
        verified: false
    };

    return {
        banks: dbData,
        setBanks: data => {
            dispatch({ type: 'banks', payload: data });
        },
    };
}
