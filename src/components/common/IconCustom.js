import { StyleSheet } from 'react-native';
import { Avatar } from 'react-native-paper';

const IconCustom = ({type, source, size, square}) => {
    let defaultSize = size && typeof size == 'number' ? size : 24;
    let styleType = square === true ? 'square' : 'regular';
    // console.log(type, size, square, source);

    if (type == 'icon') {
        return (<Avatar.Icon style={styles[styleType]} size={defaultSize} icon="folder" />);
    } else if (type == 'image') {
        return (<Avatar.Image style={styles[styleType]} size={defaultSize} source={{uri: source}} />);
    } else {
        return (<Avatar.Text style={styles[styleType]} size={defaultSize} label={`${typeof source == 'string' ? source : 'FP'}`} />);
    }
}

const styles = StyleSheet.create({
    square: {
        borderRadius: 10
    },
    regular: {
        // borderRadius: 10
    }
});

export default IconCustom;