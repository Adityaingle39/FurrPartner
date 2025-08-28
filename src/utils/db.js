import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_DB_KEY_PREFIX } from '@env';

export const setData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    return await AsyncStorage.setItem(`${REACT_APP_DB_KEY_PREFIX}_${key}`, jsonValue);
  } catch (e) {
    return e;
  }
};

export const getData = async (key) => {
  // console.log(REACT_APP_DB_KEY_PREFIX)
  try {
    const jsonValue = await AsyncStorage.getItem(`${REACT_APP_DB_KEY_PREFIX}_${key}`);
    return jsonValue != null && jsonValue !== `${{ "_h": 0, "_i": 0, "_j": null, "_k": null }}` ? JSON.parse(jsonValue) : null;
  } catch (e) {
    return e;
  }
};

export const removeData = async (key) => {
  try {
    return await AsyncStorage.removeItem(`${REACT_APP_DB_KEY_PREFIX}_${key}`);
  } catch (e) {
    return e;
  }
};
