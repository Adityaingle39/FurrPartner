import React, {useState, useEffect} from 'react';
import {Badge, ProgressBar} from 'react-native-paper';
import {Dimensions, Modal, StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import {colors} from '../../utils/styles/gobalstyle'
import {SafeAreaView} from 'react-native-safe-area-context';

const Stepper = ({steps, active}) => {
    const {width, height} = Dimensions.get('window');
    const [stepper, setStepper] = useState(null);

    const setStepperData = () => {
        let stepsHtmlData = [];

        for (var x=1; x <= steps; x++) {
            let badgeColor = active <= x ? colors.blue : null;
            stepsHtmlData.push(
                <View key={`stpper-step-${x}`} style={{width: width / steps}}>
                    <ProgressBar indeterminate={false} visible={x < steps} color={x < active ? colors.primary : colors.lightGrey} progress={0} style={styles.progressBar}></ProgressBar>
                    <Badge style={[styles.badge, {backgroundColor: x <= active ? colors.primary : colors.lightGrey}]} size={30}>{x}</Badge>
                </View>
            )
        }

        setStepper(stepsHtmlData);
    }

    // console.log("here");

    useEffect(() => {
        setStepperData();
    }, []);

    return (
        <>
        <View style={{flexDirection: 'row', margin: 20, marginBottom: 10}}>
            {stepper}
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    badge: {
       color:"#ffffff",
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',
        marginTop: -17
    },
    progressBar: {
        justifyContent: 'flex-start',
        alignSelf: 'flex-start'
    }
});

export default Stepper;