// Import libraries to help create a component
import React, { Component } from 'react';
import { View, Text } from 'react-native';

import moment from 'moment';

// Make a component
class ProfileStatementDetail extends Component {

  renderStatement(statement) {
    switch (statement.Type) {
      case 'Score':
        return (
          <View style={styles.containerStyle}>
            <Text style={styles.firstStyle}>{statement.Description}</Text>
            <Text style={styles.secondStyle}>+ {statement.Scored} pontos</Text>
            <Text style={styles.thirdStyle}>{statement.Name}</Text>
            <Text style={styles.dateStyle}>{moment(statement.At).format('DD/MM/YYYY')}</Text>
          </View>
        );
      case 'Acquire':
        return (
          <View style={styles.containerStyle}>
            <Text style={styles.firstStyle}>{statement.Description}</Text>
            <Text style={styles.secondStyle}>{statement.Qtd} - {statement.Title}</Text>
            <Text style={styles.thirdStyle}>
              {statement.Scored === 0 ? null : `- ${Math.abs(statement.Scored)} pontos`}
            </Text>
            <Text style={styles.dateStyle}>{moment(statement.At).format('DD/MM/YYYY')}</Text>
          </View>
        );
      case 'Rescue':
        return (
          <View style={styles.containerStyle}>
            <Text style={styles.firstStyle}>{statement.Description}</Text>
            <Text style={styles.secondStyle}>{statement.Title}</Text>
            <Text style={styles.thirdStyle}>{statement.Name}</Text>
            <Text style={styles.dateStyle}>{moment(statement.At).format('DD/MM/YYYY')}</Text>
          </View>
        );
      default:
        return null;
    }
  }

  render() {
    const { statement } = this.props;

    return this.renderStatement(statement);
  }
}

const styles = {
  containerStyle: {
    justifyContent: 'flex-start',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
  },
  firstStyle: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: 'bold',
    color: '#222'
  },
  secondStyle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#aaa'
  },
  thirdStyle: {
    fontSize: 14,
    color: '#aaa'
  },
  dateStyle: {
    fontSize: 14,
    lineHeight: 22,
    color: '#aaa',
    position: 'absolute',
    right: 20,
    top: 10
  }
};

// Make the component available to other parts of the app
export default ProfileStatementDetail;
