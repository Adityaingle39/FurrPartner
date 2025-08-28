import * as React from 'react';
import { Dimensions, View, Image, Linking, StyleSheet, TouchableOpacity } from 'react-native';
import { Modal, Portal, Text, Button, IconButton, useTheme } from 'react-native-paper';

const Ad = ({navigation, show, ad, onClose}) => {
    const theme = useTheme();
    const {width, height} = Dimensions.get('window');

    const [visible, setVisible] = React.useState(false);
    const [myAd, setAd] = React.useState(ad);

    const showModal = () => setVisible(true);
    const hideModal = () => {
        setVisible(false);
        onClose();
    };
    const containerStyle = { backgroundColor: 'white', padding: 20 };

    const handleClickEvent = () => {
        hideModal();

        if (ad && 'phone' in ad) {
            Linking.openURL(`tel:${ad.phone}`);
        }

        if (ad && 'email' in ad) {
            Linking.openURL(`mailto:${ad.email}`)
        }

        if (ad && 'link' in ad) {
            Linking.openURL(ad.link);
        }
    }

    React.useEffect(() => {
        // const myad = JSON.parse(ad);

        console.log('Ad - ', ad.image);
        // setVisible(show);
        // setAd(JSON.parse(JSON.stringify(ad)));
    }, []);

    return (
        <Portal>
            <Modal
                style={{ marginHorizontal: 40 }}
                visible={show}
                dismissable={false}
                // onDismiss={}
                dismissableBackButton={false}
                contentContainerStyle={containerStyle}
            >
                <IconButton
                    icon="close"
                    size={25}
                    mode={'contained'}
                    style={{ position: 'absolute', top: -20, right: -20 }}
                    onPress={hideModal}
                />
                {(ad && ad.image) && <View>
                    {('phone' in ad || 'email' in ad || 'link' in ad) ? <TouchableOpacity onPress={handleClickEvent}><Image style={{ width: '100%', height: width}} source={{ uri: ad.image }} /></TouchableOpacity> : <Image style={{ width: '100%', height: width}} source={{ uri: ad.image }} />}
                </View>}
                {(ad && ad.description) && <Text style={{marginTop: 10, color: theme.colors.surface}}>{ad.description}</Text>}
            </Modal>
        </Portal>
    );
};

export default Ad;