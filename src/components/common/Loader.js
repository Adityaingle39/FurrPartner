import React from 'react';
import { Modal, StyleSheet, View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';

const Loader = ({ visible, title, helpText }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Animated GIF Loader */}
          <FastImage
            source={require('../../assets/wait.gif')}
            style={{ width: 150, height: 150 }}
            resizeMode={FastImage.resizeMode.contain}
          />

          {/* Optional Title */}
          {title ? <Text style={styles.modalText}>{title}</Text> : null}

          {/* Optional Help Text */}
          {helpText ? <Text style={styles.modalSubText}>{helpText}</Text> : null}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)', // dim background
  },
  modalView: {
    alignItems: 'center',
  },
  modalText: {
    color: 'white',
    fontSize: 18,
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  modalSubText: {
    color: '#ddd',
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
  },
});

export default Loader;
