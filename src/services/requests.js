import React, { useContext, useReducer } from 'react';
import { AppContext } from './states';

export function useRequestState() {
    const [state, dispatch] = useContext(AppContext);
    const dbData = state?.requests;

    let returnData = {
        appointmentTime: null,
        breed: null,
        id: null,
        petId: null,
        petImageUrl: null,
        petName: null,
        status: null,
        subType: null,
        type: null,
        userId: null,
        userName: null,
        workspaceId: null
    };

    let newAppointmentData = dbData && dbData.length > 0 ? dbData.filter(o => o.new == true) : [];

    return {
        newAppointment: newAppointmentData.length > 0 ? newAppointmentData[0] : returnData,
        appointments: dbData,
        setAppointments: data => {
            dispatch({ type: 'requests', payload: data });
        },
    };
}
