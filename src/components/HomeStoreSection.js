import React, { Component } from 'react';

import HomeStoreList from './HomeStoreList';
import { Section } from './common';

class HomeStoreSection extends Component {  
  render() {
    const {
      header = 'Lojas Favoritas',
      subHeader = 'As lojas que conquistaram seu coração',
      stores,
      onClickHandler
    } = this.props;    

    if (stores && stores.length > 0) {
      return (
        <Section
          header={header}
          subHeader={subHeader}
        >
          <HomeStoreList
            stores={stores}
            onClickHandler={onClickHandler}
          />
        </Section>
      );
    }

    return null;
  }
}

export default HomeStoreSection;
