// Import libraries to help create a component
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import Colors from '../constants/Color';

// Make a component
const ShownGiftModal = (props) => {
  const {
    date,
    giftImage,
    giftEstablishmentName,
    giftTitle,
    giftDescription,
    closeModal
  } = props;

  const {
    topCircleStyle,
    bottomCircleStyle,
    modalContentStyle,
    headerStyle,
    subheaderEstablishmentStyle,
    dateStyle,
    subheaderStyle,
    imageStyle,
    nameStyle,
    descriptionStyle
  } = styles;

  return (
    <View style={modalContentStyle}>
      <View
        style={topCircleStyle}
      />
      <View
        style={bottomCircleStyle}
      />
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Text style={headerStyle}>Presente para você:</Text>
        <Text style={dateStyle}>{date}</Text>
      </View>
      <Text style={subheaderStyle}>
        Enviado por: <Text style={subheaderEstablishmentStyle}>{giftEstablishmentName}</Text>
      </Text>
      <View
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Image style={imageStyle} source={{ uri: giftImage }} />
        <View
          style={{ justifyContent: 'space-between', flex: 9 }}
        >
          <Text style={nameStyle}>
            {giftTitle}
          </Text>
          <Text style={descriptionStyle}>
            {giftDescription}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => closeModal()} style={{ marginTop: 10 }}>
        <View style={styles.buttonStyle}>
          <Text style={styles.buttonTextStyle}>Ok</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

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
    padding: 20,
    borderRadius: 4,
    overflow: 'hidden',
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
    color: Colors.primary,
    fontWeight: 'bold',
    backgroundColor: 'transparent'
  },
  subheaderEstablishmentStyle: {
    color: Colors.primary,
  },
  imageStyle: {
    height: 150,
    width: 150,
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

// Make the component available to other parts of the app
export default ShownGiftModal;
