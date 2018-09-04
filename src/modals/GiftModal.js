import React, { Component } from 'react';
import Modal from 'react-native-modal';

import ClosedGiftModal from './ClosedGiftModal';
import ShownGiftModal from './ShownGiftModal';

class GiftModal extends Component {

  state = {
    showContent: false
  }  

  toNextModal() {
    this.setState({ showContent: true });
  }

  closeModal() {
    this.setState({
      showContent: false
    });
    this.props.hideModal();
  }

  renderBody() {
    const {
      date,
      giftImage,
      giftEstablishmentName,
      giftTitle,
      giftDescription
    } = this.props;

    if (this.state.showContent === false) {
      return (
        <ClosedGiftModal
          giftEstablishmentName={giftEstablishmentName}
          toNextModal={this.toNextModal.bind(this)}
        />
      );
    }

    return (
      <ShownGiftModal
        date={date}
        giftImage={giftImage}
        giftEstablishmentName={giftEstablishmentName}
        giftTitle={giftTitle}
        giftDescription={giftDescription}
        closeModal={this.closeModal.bind(this)}        
      />
    );
  }

  render() {
    const {
      isVisible,
      hideModal
    } = this.props;

    return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={hideModal}
      >
        {this.renderBody()}
      </Modal>
    );
  }
}

export default GiftModal;
