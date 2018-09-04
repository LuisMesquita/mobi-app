import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import Modal from 'react-native-modal';
import Colors from '../constants/Color';

class ConfirmationModal extends Component {

  state = {
    loading: false
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isVisible === false && nextProps.isVisible === true) {
      this.setState({ loading: false });
    }
  }

  onButtonPress(callback) {
    this.setState({ loading: true });
    callback();
  }

  hideModal() {
    this.setState({ loading: false });
    this.props.hideModal();
  }

  renderButton(text, onPress) { 
    if (this.state.loading) {
      return (
        <View style={{ padding: 17, }}>
          <ActivityIndicator size="small" color={Colors.loading_indicator} />
        </View>
      );
    }

    return (
      <TouchableOpacity onPress={() => this.onButtonPress(onPress)} style={{ marginTop: 10 }}>
        <View style={styles.buttonStyle}>
          <Text style={styles.buttonTextStyle}>{text}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const {
      title,
      description,
      confirmText,
      confirmAction,
      isVisible,
    } = this.props;

    const {
      topCircleStyle,
      bottomCircleStyle,
      modalContentStyle,
      headerStyle,
      subheaderStyle,
      backStyle
    } = styles;

    return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={this.hideModal.bind(this)}
      >
        <View style={modalContentStyle}>
          <View
            style={topCircleStyle}
          />
          <View
            style={bottomCircleStyle}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Text style={headerStyle}>{title}</Text>            
          </View>
          <Text style={subheaderStyle}>
            {description}
          </Text>
          {this.renderButton(confirmText, confirmAction)}
          <TouchableOpacity onPress={this.hideModal.bind(this)}>
            <Text style={backStyle}>
              Voltar para o app
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

const styles = {
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
  subheaderStyle: {
    marginTop: 5,
    fontSize: 14,
    color: 'black',
    backgroundColor: 'transparent'
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
  }
};

export default ConfirmationModal;
