import React, { Component } from 'react';
import { Text, TouchableOpacity, StyleSheet, View, Image } from 'react-native';
import Modal from 'react-native-modal';
import Colors from '../constants/Color';

class ReclaimRewardModal extends Component {
  renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress} style={{ marginTop: 10 }}>
      <View style={styles.buttonStyle}>
        <Text style={styles.buttonTextStyle}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    const {
      isVisible,
      date,
      rewardImage,
      rewardName,
      rewardDescription,
      hideModal,
      checkReward
    } = this.props;

    const {
      topCircleStyle,
      bottomCircleStyle,
      modalContentStyle,
      headerStyle,
      dateStyle,
      subheaderStyle,
      imageStyle,
      nameStyle,
      descriptionStyle,
      backStyle
    } = styles;

    return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={hideModal}
      >
        <View style={modalContentStyle}>
          <View
            style={topCircleStyle}
          />
          <View
            style={bottomCircleStyle}
          />
          <View
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Text style={headerStyle}>Resgatada!</Text>
            <Text style={dateStyle}>{date}</Text>
          </View>
          <Text style={subheaderStyle}>
            Você acabou de resgatar uma recompensa
          </Text>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Image style={imageStyle} source={{ uri: rewardImage }} />
            <View
              style={{ justifyContent: 'space-between', flex: 9 }}
            >
              <Text style={nameStyle}>
                {rewardName}
              </Text>
              <Text style={descriptionStyle}>
                {rewardDescription}
              </Text>
            </View>
          </View>
          {this.renderButton('Ver recompensa', () => checkReward())}
          <TouchableOpacity onPress={() => hideModal()}>
            <Text style={backStyle}>
              Voltar para o app
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  topCircleStyle: {
    backgroundColor: Colors.modal_top_circle,
    width: 100,
    height: 100,
    position: 'absolute',
    borderRadius: 50,
    left: -50,
    top: -50,
  },
  bottomCircleStyle: {
    backgroundColor: Colors.modal_bottom_circle,
    width: 200,
    height: 200,
    position: 'absolute',
    borderRadius: 100,
    right: -100,
    bottom: -100
  },
  modalContentStyle: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 4,
    overflow: 'hidden'
  },
  headerStyle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary,
    backgroundColor: 'transparent'
  },
  dateStyle: {
    fontSize: 12,
    color: '#aaa'
  },
  subheaderStyle: {
    marginTop: 5,
    fontSize: 14,
    color: 'black',
    backgroundColor: 'transparent'
  },
  imageStyle: {
    flex: 11,
    height: 150,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
    borderRadius: 5,
    resizeMode: 'stretch'
  },
  buttonStyle: {
    backgroundColor: Colors.button_background_primary,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  buttonTextStyle: {
    color: 'white'
  },
  backStyle: {
    textDecorationLine: 'underline',
    marginTop: 5,
    fontSize: 12,
    color: '#aaa',
    fontWeight: '500',
    alignSelf: 'center',
    backgroundColor: 'transparent'
  },
  nameStyle: {
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
  },
  descriptionStyle: {
    fontSize: 14,
    color: '#ccc',
  }
});

export default ReclaimRewardModal;
