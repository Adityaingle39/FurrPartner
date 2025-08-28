import React, { useContext, useReducer } from 'react';
import { AppContext } from './states';

export function useNotificationState() {
    const [state, dispatch] = useContext(AppContext);
    const dbData = state?.notifications;

    let returnData = {
        id: null,
        userId: null,
        type: null,
        time: null,
        collaboratorId: null,
        message: null,
        petId: null,
        workspaceId: null,
        active: false,
        read: false
    };

    let newAppointmentData = dbData && dbData.length > 0 ? dbData.filter(o => o.new == true) : [];

    return {
        newNotification: newAppointmentData.length > 0 ? newAppointmentData[0] : returnData,
        notifications: dbData,
        setNotifications: data => {
            dispatch({ type: 'notifications', payload: data });
        },
    };
}
