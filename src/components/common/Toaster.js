// import Toast from 'react-native-simple-toast';
import Snackbar from '../../utils/SnackbarManager';

const Toaster = ({message, duation, gravity}) => {
    // let toastDuration = duation == 'LONG' || duation == 'SORT' ? Toast[duation] : Toast.LONG;
    // let toastGravity = gravity == 'TOP' || gravity == 'BOTTOM' ? Toast[gravity] : Toast.BOTTOM;
    // Toast.showWithGravity(message, toastDuration, toastGravity, {backgroundColor: 'green'});
    Snackbar.show(message);
}
export default Toaster;