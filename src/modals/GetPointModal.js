import React, { Component } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import Colors from '../constants/Color';

class GetPointModal extends Component {
  renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    const { isVisible, store, date, points, finishModal } = this.props;

    return (
      <Modal isVisible={isVisible}>
        <View style={styles.modalContent}>
          <View
            style={{
              backgroundColor: Colors.modal_top_circle,
              width: 100,
              height: 100,
              position: 'absolute',
              borderRadius: 50,
              left: -50,
              top: -50,              
            }}
          />
          <View
            style={{
              backgroundColor: Colors.modal_bottom_circle,
              width: 200,
              height: 200,
              position: 'absolute',
              borderRadius: 100,
              right: -100,
              bottom: -100,              
            }}
          />
          <View
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Text style={styles.header}>Você pontuou!</Text>
            <Text style={styles.date}>{date}</Text>
          </View>
          <Text style={styles.sender}>
            Enviado por:{' '}
            <Text style={styles.senderName}>{store}</Text>
          </Text>
          <Text style={styles.plus}>
            +
            <Text style={styles.points}>
              {points}
              <Text style={styles.pointsText}>{' '}pts</Text>
            </Text>
          </Text>
          {this.renderButton('Ok', () => finishModal())}
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 4,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary
  },
  date: {
    fontSize: 12,
    color: '#aaa'
  },
  sender: {
    marginTop: 10,
    fontSize: 14,
    color: 'black',
  },
  senderName: {
    color: 'darkcyan'
  },
  plus: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#DAB54E'
  },
  points: {
    fontSize: 60,
    color: Colors.primary
  },
  pointsText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#DAB54E'
  },
  button: {
    backgroundColor: Colors.button_background_primary,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  buttonText: {
    color: 'white'
  }
});

export default GetPointModal;
