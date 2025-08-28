import axios from 'axios';
import { unauthorizedHandler, isAlreadyLogged, getLocation } from './helpers';
import { REACT_APP_API_URL, REACT_APP_WEB_URL } from '@env';
theAxios = axios.create({
    baseURL:process.env.REACT_APP_API_URL,
    headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
    }
});
export default class Apis {

    myAxios = axios.create({
        baseURL:process.env.REACT_APP_API_URL
    });

    constructor() {
        this.myAxios = theAxios;

        /** Insterceptor - Response */
        this.myAxios.interceptors.response.use((response) => {
            // console.log('this.myAxios.interceptors', response);
            return response;
        }, (error) => {
            // console.log('this.myAxios.interceptors', error);
            return Promise.reject(error);
        });
        /** Insterceptor - Response */
        console.log("appi",REACT_APP_API_URL)
        this.getAuth();
    }

    getAuth() {
        try {
            const userData = isAlreadyLogged();
            if (userData && 'token' in userData && userData.token !== null) {
                const headers = this.myAxios.defaults.headers;
                headers['Authorization'] = `Bearer ${userData.token}`;
                this.myAxios.defaults.headers = headers;
            }
        } catch (e) {
            console.log(e);
        }
    }

    setAuth(token) {
        if (token) {
            const headers = this.myAxios.defaults.headers;
            headers['Authorization'] = `Bearer ${token}`;
            this.myAxios.defaults.headers = headers;
        } else {
            const headers = this.myAxios.defaults.headers;
            delete headers['Authorization'];
            this.myAxios.defaults.headers = headers;
        }
    }

    async getOtp(payload, resend) {
        let newPayload = {
            params: {},
        };
        if (resend) {
            newPayload.params = { resend: true }
        }
        const apiResponse = await this.myAxios.post(`/v1/admin/otp`, payload, newPayload)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }

    async resendOtp(payload) {
        let newPayload = { params: { resend: true }, data: payload };
        return await this.getOtp(newPayload);
    }

    async verifyOtp(otpId, otp) {
        const apiResponse = await this.myAxios.post(`/v1/admin/verify/otp/${otpId}/${otp}`)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }

    //** ROLLS - START */
    async uploadRolls(userId, payload, workspaceId, serviceType) {
        let newPayload = {
            params: { userId: userId, workspaceId: workspaceId, type: serviceType },
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const apiResponse = await this.myAxios.post(`/v1/admin/upload/roll`, payload, newPayload)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }

    async getRolls(userId, workspaceId) {
        let newPayload = {
            params: { userId: userId, workspaceId: workspaceId },
        }
        const apiResponse = await this.myAxios.get(`/v1/admin/rolls`, newPayload)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }
    //** Rolls - END */

    async getServices(userId) {
        const apiResponse = await this.myAxios.get(`/v1/admin/services/${userId}`)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }

    //** WORKSPACE APIs - START */
    async createWorkspace(userId, payload) {
        let newPayload = {
            params: { userId: userId }
        }
        // console.log(newPayload);
        const apiResponse = await this.myAxios.post(`/v1/admin/workspace/create`, payload, newPayload)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }

    async setDefaultWorkspace(userId, workspaceId) {
        let newPayload = {
            params: { collaboratorId: userId, workspaceId: workspaceId }
        }
        const apiResponse = await this.myAxios.put(`/v1/admin/workspace/default`, {}, newPayload)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }

    async updateWorkspace(userId, workspaceId, payload) {
        let newPayload = {
            params: { userId: userId }
        }
        const apiResponse = await this.myAxios.put(`/v1/admin/workspace/${workspaceId}/modify`, payload, newPayload)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }

    async updateWorkspaceChanges(userId, workspaceId, payload) {
        let newPayload = {
            params: { userId: userId }
        }
        const apiResponse = await this.myAxios.put(`/v1/admin/workspace/${workspaceId}/version/add`, payload, newPayload)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }

    getWorkspace() {

    }

    async getAllWorkspaces(userId) {
        let newPayload = {
            params: { collaboratorId: userId },
        }
        const apiResponse = await this.myAxios.get(`/v1/admin/workspace`, newPayload)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }

    async getAllNotifications(userId, workspaceId) {
        let newPayload = {
            params: {workspaceId: workspaceId},
        }
        const apiResponse = await this.myAxios.get(`/v1/admin/${userId}/notifications`, newPayload)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }
    async clearNotification(collaboratorId) {
       
        const apiResponse = await this.myAxios.put(`/v1/admin/${collaboratorId}/notifications?clearAll=true`)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }


    async uploadWorkspaceDocuments(userId, type, payload, docNumber,) {
        let newPayload = {
            params: { userId: userId, type: type, docNumber: docNumber },
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const apiResponse = await this.myAxios.post(`/v1/admin/collaborator/documents/images`, payload, newPayload)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }

    async uploadWorkspaceImages(userId, workSpaceId, payload) {
        let newPayload = {
            params: { userId: userId },
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const apiResponse = await this.myAxios.post(`/v1/admin/workspace/${workSpaceId}/create/images`, payload, newPayload)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }

    async deviceToken(deviceId, token, userId) {
        const payload = {
          deviceId: deviceId,
          token: token,
          userId: userId
        }
        const apiResponse = await this.myAxios
          .post(`/v1/admin/register/device/token`, payload)
          .then(resp => {
            if (resp.status === 200) {
              return resp.data;
            } else {
              return [];
            };
          })
          .catch(({ response }) => {
            unauthorizedHandler(response?.data);
            return response?.data;
          });
        return apiResponse;
      }

    async deleteWorkspace(userId, workSpaceId) {
        let newPayload = {
            params: { userId: userId, type: 'all' }
        }
        const apiResponse = await this.myAxios.delete(`/v1/admin/workspace/${workSpaceId}/modify`, newPayload)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }
    //** WORKSPACE APIs - END */

    //** WORKSPACE Appointment APIs - START */
    // async startVideoCall (appointmentId) {
    //     let newPayload = {
    //         // params: {collaboratorId: collaboratorId},
    //     }
    //     const apiResponse = await this.myAxios.get(`https://furrcrew.com/api/v1/user/video/call/${appointmentId}/session`, {}, newPayload)
    //     .then(resp => {
    //         const data = resp.data;
    //         if (data.statusCode == 200) {
    //             return data.data;
    //         }

    //         return resp.data;
    //     }).catch(({ response }) => {
    //         unauthorizedHandler(response.data);
    //         return response.data;
    //     });
    //     return apiResponse;
    // }
    async startVideoCall(collaboratorId, appointmentId) {
        let newPayload = {
            params: { collaboratorId: collaboratorId },
        }
        const apiResponse = await this.myAxios.post(`/v1/admin/video/call/${appointmentId}`, {}, newPayload)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }

    async getWorkspaceAppointments(userId, workSpaceId, options) {
        let newPayload = {
            params: { collaboratorId: userId, type: options.status },
        }
        const apiResponse = await this.myAxios.get(`/v1/admin/appointment/workspace/${workSpaceId}`, newPayload)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }

    async updateAppointmentPrescriptions(appointmentId, petId, prescription, payload) {
        let newPayload = {
            params: { prescription: prescription },
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const apiResponse = await this.myAxios.post(`/v1/admin/appointment/${appointmentId}/pet/${petId}/prescription`, payload, newPayload)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }

    async updateWorkspaceAppointment(userId, workspaceId, appointmentId, status) {
        let newPayload = {
            params: { collaboratorId: userId, type: status, appointmentId: appointmentId }
        }
        const apiResponse = await this.myAxios.put(`/v1/admin/appointment/workspace/${workspaceId}`, {}, newPayload)
            .then(resp => {
                console.log(resp);
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }

    async addWorkspaceBankDetails(workspaceId, payload) {
        let newPayload = {
            params: {}
        }
        const apiResponse = await this.myAxios.post(`/v1/admin/workspace/${workspaceId}/bank/detail`, payload)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }
    async updateWorkspaceBankDetails(workspaceId, payload) {
        let newPayload = {
            params: {}
        }
        const apiResponse = await this.myAxios.put(`/v1/admin/workspace/${workspaceId}/bank/detail`, payload)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }
    //** WORKSPACE Appointment APIs - END */

    //** COLLABORATOR Profile - START */
    async register(payload) {
        const apiResponse = await this.myAxios.post('/v1/admin/register', payload)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }

    async getProfile(userId) {
        const apiResponse = await this.myAxios.get(`/v1/admin/${userId}/profile`)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }

    async updateProfile(userId, payload) {
        let newPayload = {
            data: payload
        }
        const apiResponse = await this.myAxios.put(`/v1/admin/${userId}/profile`, payload)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }
    //** COLLABORATOR Profile - START */

    async getNotifications(userId, workspaceId) {
        let newPayload = {
            params: { workspaceId: workspaceId }
        }
        const apiResponse = await this.myAxios.get(`/v1/admin/${userId}/notifications`, newPayload)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }

    async getBankDetails(userId, workspaceId) {
        // console.log("userId, workspaceId", userId, workspaceId)
        let newPayload = {
            params: { collaboratorId: userId },
        }
        const apiResponse = await this.myAxios.get(`/v1/admin/workspace/${workspaceId}/bank/detail`, newPayload)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }

    async setDefaultVacationStatus(userId, workspaceId, vacation) {
        let newPayload = {
            params: { collaboratorId: userId, vacation: vacation }
        }
        const apiResponse = await this.myAxios.put(`/v1/admin/workspace/${workspaceId}/vacation`, {}, newPayload)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }

    async uploadProfileImages(userId, payload) {
        // console.log("payload", payload)
        let newPayload = {
            params: { userId: userId },
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const apiResponse = await this.myAxios.post(`/v1/admin/profile/image`, payload, newPayload)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }

    async getFaqs() {
        const apiResponse = await this.myAxios
            .get(`v1/admin/faqs`)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            })
            .catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }
    async getAnaltics(collaboratorId, workSpaceId, type) {
        const apiResponse = await this.myAxios.get(`/v1/admin/${collaboratorId}/workspace/${workSpaceId}/dashboard?type=${type}`)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }

    async deleteUser(collaboratorId) {

        const apiResponse = await this.myAxios.delete(`/v1/admin/${collaboratorId}/delete`)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }

    async deleteRoll(rollId) {
        const apiResponse = await this.myAxios.delete(`/v1/admin/upload/roll?rollId=${rollId}`)
            .then(resp => {
                return (resp.status == 200) ? resp.data : null;
            }).catch(({ response }) => {
                unauthorizedHandler(response.data);
                return response.data;
            });
        return apiResponse;
    }
}
