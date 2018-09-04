// Import libraries to help create a component
import React, { Component } from 'react';
import { View } from 'react-native';

import moment from 'moment';
import 'moment/locale/pt-br';

import ProfileStatementPartialList from './ProfileStatementPartialList';

// Make a component
class ProfileStatementList extends Component {

  getListMonths(currentDate, minimumDate) {
    const dateStart = moment(minimumDate);
    const dateEnd = moment(currentDate);

    dateStart.set('date', 1);
    dateEnd.set('date', 1);

    const months = [];

    while (dateEnd > dateStart || dateStart.format('M') === dateEnd.format('M')) {
      months.push(moment(dateStart));
      dateStart.add(1, 'month');
    }

    months.sort((a, b) => {
      if (a.isAfter(b)) {
        return -1;
      }

      if (a.isBefore(b)) {
        return 1;
      }

      return 0;
    });

    return months;
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  renderPartialList() {
    const headers = this.getListMonths(new Date(), new Date(this.props.statements.MinDate));

    return headers.map(date => {
      if (date.isSame(new Date(), 'month')) {
        return (
          <ProfileStatementPartialList
            userId={this.props.userId}
            key={date.format('MM/YYYY')}
            date={'Esse mês'}
            utc={date.format()}
            extract={this.props.statements.Extract}
            onClickHandler={this.props.onClickHandler}
          />
        );
      }
      return (
        <ProfileStatementPartialList
          userId={this.props.userId}
          key={date.format('MM/YYYY')}
          date={this.capitalizeFirstLetter(date.format('MMMM YYYY'))}
          utc={date.format()}
          extract={null}
          onClickHandler={this.props.onClickHandler}
        />
      );
    });
  }

  render() {
    console.log('ProfileStatementList_props', this.props);

    return (
        <View style={{ paddingTop: 10, paddingBottom: 71 }}>
          {this.renderPartialList()}
        </View>
    );
  }
}

// Make the component available to other parts of the app
export default ProfileStatementList;
