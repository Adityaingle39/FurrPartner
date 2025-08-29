import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Dimensions,
    Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { Card, useTheme } from 'react-native-paper';

const Empty = ({title, subtitle, icon, style, top}) => {
    const theme = useTheme();
    const { width, height } = Dimensions.get('window');
    const topMargin = top && typeof top == 'number' && top >= 0 ? top : (height / 2) - (width / 2);
    const myTitle = title != "" ? title : 'Empty!';
    const myDescription = subtitle != "" ? subtitle : 'No records found';
    
    return (
        <View style={[{justifyContent: 'center', alignItems: 'center', alignContent: 'center', alignSelf: 'auto', marginTop: topMargin, marginVertical: 'auto'}, style]}>
            {icon ? icon : <Image style={{alignSelf: 'center', width:200, height:100, resizeMode:'contain'}} source={require('../../assets/empty.png')} />}
            <Text style={[styles.heading,{color: theme.colors.onSurface}]}>{myTitle}</Text>
            <Text style={[styles.subheading,{color:theme.colors.onSurfaceVariant}]}>{myDescription}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    heading: {
        // marginVertical: 20,
        marginTop:10,
        fontSize: 25,
        fontWeight: '700',
        textAlign: 'center'
    },
    subheading: {
        marginTop: 20,
        fontSize: 20,
        // fontWeight: '700',
        textAlign: 'center'
    }
});

export default Empty;