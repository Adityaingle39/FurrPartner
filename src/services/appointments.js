import React, { useContext, useReducer } from 'react';
import { AppContext } from './states';

export function useAppointmentState() {
    const [state, dispatch] = useContext(AppContext);
    const dbData = state?.appointments;

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
        workspaceId: null,
        paymentAmount: null,
    };

    let newAppointmentData = dbData.length > 0 ? dbData.filter(o => o.new == true) : [];

    return {
        newAppointment: newAppointmentData.length > 0 ? newAppointmentData[0] : returnData,
        appointments: dbData,
        createdAppointments: (tmpData) => {
            const newData = tmpData ? tmpData : dbData;
            return newData && newData.length > 0 ? newData.filter(i => i.status === 'Created') : [];
        },
        activeAppointments: (tmpData) => {
            const newData = tmpData ? tmpData : dbData;
            return newData && newData.length > 0 ? newData.filter(i => i.status === 'Complete' || i.status === 'Active') : [];
        },
        previousAppointments: (tmpData) => {
            const newData = tmpData ? tmpData : dbData;
            return newData && newData.length > 0 ? newData.filter(i =>i.status === 'Complete'|| i.status === 'Completed' || i.status === 'AUTO_COMPLETED') : [];
        },
        requestsAccepted: (tmpData) => {
            const newData = tmpData ? tmpData : dbData;
            return newData && newData.length > 0 ? newData.filter(i => i.status === 'Active' || i.status === 'Complete' || i.status === 'Completed') : [];
        },
        rejectedRequests: (tmpData) => {
            const newData = tmpData ? tmpData : dbData;
            return newData && newData.length > 0 ? newData.filter(i => i.status === 'Partner_Rejected' || i.status === 'Rejected' || i.status === 'Auto_Rejected'|| i.status === 'AUTO_REJECTED' || i.status === 'Admin_Rejected') : [];
        },
        cancelledRequests: (tmpData) => {
            const newData = tmpData ? tmpData : dbData;
            return newData && newData.length > 0 ? newData.filter(i => i.status === 'Partner_Cancelled' || i.status === 'Cancelled' || i.status === 'User_Cancelled'|| i.status === 'Admin_Cancelled') : [];
        },
        setAppointments: data => {
            dispatch({ type: 'appointments', payload: data });
        },
    };
}
