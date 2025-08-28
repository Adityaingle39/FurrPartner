import * as React from 'react';
import {Alert, Modal, StyleSheet, Text, Image, View, ActivityIndicator} from 'react-native';
import { Modal as ModalPaper } from 'react-native-paper';
import {textInputContainer, textInputLabel} from '../../utils/styles/gobalstyle'

const Loader = ({ visible, title, helpText }) => {
    const loaderImage = Image.resolveAssetSource(require('../../assets/wait.gif')).uri;

    return (
        <View>
            {/* <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.centeredView}>

            </Modal> */}
            <Modal
                style={styles.centeredView}
                animationType={'fade'}
                transparent={true}
                visible={visible}
                // onRequestClose={() => {
                //     Alert.alert('Modal has been closed.');
                //     setModalVisible(!visible);
                // }}
            >
                <View style={styles.centeredView}>
                    <View>
                        <Image source={{uri: loaderImage}} height={150} width={150} />
                        {/* <ActivityIndicator size="large" color="#B8EF5D" /> */}
                        {/* <Text style={styles.modalText}>{title ? title : 'Loading...'}</Text> */}
                        {/* { this.helpText != undefined ? <Text style={styles.modalSubText}>{helpText}</Text> : null } */}
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.65)'
    },
    modalView: {
        margin: 20,
        backgroundColor: '#01C4FFE6',
        borderRadius: 10,
        paddingHorizontal: 45,
        paddingVertical: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        color: 'white',
        fontSize: 20,
        marginTop: 15,
        textAlign: 'center',
    },
    modalSubText: {
        color: 'white',
        marginTop: 15,
        textAlign: 'center',
    },
});

export default Loader;