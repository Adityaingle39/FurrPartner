import * as React from 'react';
import moment from 'moment';
import { Platform, Linking, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { getData, setData, removeData } from './db';
import config from './config';
import Toaster from '../components/common/Toaster';
import { CommonActions } from '@react-navigation/native';
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
export const unauthorizedHandler = error => {
    if (error && error.message === "Network Error") {
        // window.alertify('error', 'Server is down for maintenance!');
    }
    if (error && error.status === 500) {
        Toaster({ message: error.message });
    }
    if (error && error.status === 400) {
        Toaster({ message: error.message });
    }
    if (error && error.data && error.status === 404) {
        setTimeout(() => {
            Toaster({ message: "Platform APIs " + error.statusText });
        });
    }
    if (error && error.status === 403) {
        window.location = "/";
        Toaster({ message: error.message });
        logout(null);
        // localStorage.setItem("unauthorized", true);
    }
};
export const isAlreadyLogged = async () => {
    let data = await getData(config.keys.user);
    const jsonData = JSON.parse(data);
    if (jsonData === null) {
        return null;
    } else if (jsonData && 'id' in jsonData && 'mobile' in jsonData) {
        return jsonData;
    } else {
        return false;
    }
};
export const openLocationDirection = async (latitude, longitude, title) => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${latitude},${longitude}`;
    const label = title ? title : `Direction`;
    const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`
    });
    if (Platform.OS == 'ios') {
        const googleChrome = `comgooglemaps://?q=${label}&daddr=${latLng}&zoom=14`;
        const canOpenGoogleChrome = await Linking.canOpenURL(googleChrome);
        if (canOpenGoogleChrome) {
            Linking.openURL(googleChrome);
        } else {
            Linking.openURL(url);
        }
    } else {
        Linking.openURL(url);
    }
}
export const logout = (navigation, type) => {
    try {
        removeData(config.keys.user);
        if (navigation) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'SignIn' }],
            });
            Toaster({
                message: type === 'delete' ? `Deleted Account Successfully` : `Logged Out Successfully`,
            });
        } else {
            Linking.openURL("furrpartner://");
        }
    } catch (e) {
        console.log("logout ---- ", e);
    }
};

export const saveUserSession = async (data) => {
    return await setData(config.keys.user, JSON.stringify(data))
        .then(res => {
            console.log("saveUserSession:response", res);
        }).catch(err => {
            console.log(err);
        });
}

export function randomNumber(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}
export function randomString(length) {
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
export const isWelcomeVisited = async () => {
    let data = await getData(config.keys.welcome);
    return data === null ? false : JSON.parse(data);
}
export const welcomeScreenVisited = async () => {
    return setData(config.keys.welcome, true)
        .then(res => {
            console.log('saveUserSession:response', res);
        })
        .catch(err => {
            console.log(err);
        });
}
export const convertUTCToIST = (utcDate, format) => {
    const istDate = moment.utc(utcDate, 'DD-MMM-YYYY HH:mm:ss [UTC]').utcOffset('+05:30').format(format);
    return istDate;
};
export function getIconTextName(name) {
    if (name) {
        let names = name.split(" ");
        if (names.length > 1) {
            return names[0].charAt(0) + names[1].charAt(0);
        } else {
            return names[0].charAt(0);
        }
    } else {
        return 'FP';
    }
}
export class Calculate {
    isGstApplicable = true;
    feeVideoCall = null; //{"type": "%", "value": 10}
    feePlatform = null; //{"type": "$", "value": 20}
    gstPrice = 18;
    rate;
    constructor(platformFee, videoCallFee, isGstApplicable) {
        this.feePlatform = platformFee;
        this.feeVideoCall = videoCallFee;
        this.isGstApplicable = isGstApplicable;
    }
    setRate(price) {
        this.rate = parseFloat(price);
        console.log('setRate', this.rate);
    }
    get gst() {
        const gstValue = ((this.rate - this.platformFee) / 100) * this.gstPrice;
        // const gstValue = (this.rate / 100) * this.gstPrice;
        return parseFloat(gstValue.toFixed(2));
    }
    get platformFee() {
        if (this.feePlatform?.type == '%') {
            const feeValue = (this.rate / 100) * this.feePlatform.value;
            return parseFloat(feeValue.toFixed(2));
        } else {
            return parseFloat(this.feePlatform.value.toFixed(2));
        }
    }
    get inHandAmount() {
        const inHandValue = (this.rate - this.platformFee);
        return parseFloat(inHandValue.toFixed(2));
    }
    get customerAmount() {
        if (this.isGstApplicable) {
            return this.rate;
        } else {
            const gst = this.gst;
            return (this.rate + gst);
        }
    }
}
export const gst = (price) => {
    const gstPrice = parseFloat(price) * 0.18;
    return gstPrice.toFixed(2);
}
export const convenFee = (price) => {
    const fee = parseFloat(price) * 0.10;
    return fee.toFixed(2);
}
export const inHandAmount = (price) => {
    const gstPrice = gst(price);
    const convenienceFee = convenFee(price);
    return parseFloat(price - convenienceFee).toFixed(2)
}
export const totalPrice = (price) => {
    const gstPrice = gst(price);
    const total = parseFloat(price) + parseFloat(gstPrice);
    return total.toFixed(2);
}
export const getAd = async () => {
    let data = await getData('AD');
    if (data === null || data === undefined) {
        return false;
    } else {
        return data;
    }
}
export const removeAd = async () => {
    removeData('AD')
}
/** Geo Location */
export const requestLocationAccess = async () => {
    if (Platform.OS === 'ios') {
        const status = await Geolocation.requestAuthorization("whenInUse");
        // setLocationPermissionGranted(status === "granted");
        if (status === "granted") {
            setCurrentLocation();
        }
        return true;
    }
    if (Platform.OS === 'android') {
        const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        // setLocationPermissionGranted(status === PermissionsAndroid.RESULTS.GRANTED);
        if (status === PermissionsAndroid.RESULTS.GRANTED) {
            setCurrentLocation();
        }
        return true;
    }
}
export const setCurrentLocation = async () => {
    Geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            if (latitude !== undefined && longitude !== undefined) {
                setLocation({ latitude, longitude });
            }
        },
        (error) => {
            console.log('Failed to get current location', error);
        },
        { enableHighAccuracy: true, timeout: 300000, maximumAge: 240000 }
    );
};
export const getLocation = async () => {
    try {
        const location = await getData('location');
        if (location !== null) {
            return { latitude: location.latitude, longitude: location.longitude };
        } else {
            return null;
        }
    } catch (error) {
        console.log('getLocation sers', error);
        return null;
    }
};
export const setLocation = async (latitude, longitude) => {
    try {
        const location = { latitude: latitude, longitude: longitude };
        await setData('location', location);
        console.log('Location saved successfully');
    } catch (error) {
        console.log(error);
    }
};
export const requestAndroidNotificationAccess = async (type) => {
    if (Platform.OS === 'android') {
        const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        return status === PermissionsAndroid.RESULTS.GRANTED;
    }
}
export const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Camera Permission',
                    message: 'This app needs access to your camera to take photos.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (error) {
            console.warn('Permission error:', error);
            return false;
        }
    } else {
        return true;
    }
};
export const requestAndroidGalleryPermission = async () => {
    if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                {
                    title: 'Galary Permission',
                    message: 'This app needs access to your Galary to pick photos.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (error) {
            console.warn('Permission error:', error);
            return false;
        }
    } else {
        return true;
    }
};