import React, { useContext, useReducer } from 'react';
import { AppContext } from './states';

export function useRollsState() {
    const [state, dispatch] = useContext(AppContext);
    const dbData = state?.rolls;

    let returnData = {
        id:null,
        createdAt:null,
        createdBy: null,
        likeCount: 0,
        status:null,
        sharedCount: 0,
        viewCount:0,
        url:null,
    };

    let newRollData = dbData && dbData.length > 0 ? dbData.filter(o => o.new == true) : [];

    return {
        newRoll: newRollData.length > 0 ? newRollData[0] : returnData,
        rolls: dbData && dbData.length > 0 ? dbData : [],
        setRolls: data => {
            dispatch({ type: 'rolls', payload: data });
            return data;
        },
    };
}
