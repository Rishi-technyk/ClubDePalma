import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../../components/Header';
import {Avatar, Card, Icon} from 'react-native-paper';
import {FONT_FAMILY} from '../../util/constant';

const Profile = () => {
  const [data] = useSelector(state => state?.auth?.userData?.data?.data);
  console.log(data);

  var arr = [
    {
      id: 1,
      name: 'Member ID:',
      detail: data?.MemberID || '0001A',
    },
    {
      id: 2,
      name: 'Status:',
      detail: data?.Status || 'In-Active',
    },
    {
      id: 3,
      name: 'C ID:',
      detail: data?.SC_ID || 'A-0001B',
    },
    {
      id: 3,
      name: 'DOB:',
      detail: data?.DOB || '00-00-00',
    },
    {
      id: 4,
      name: 'Mobile:',
      detail: data?.Mobile || 'N/A',
      // url: url?.cancellation_policy,
    },
    {
      id: 5,
      name: 'Category:',
      detail: data?.Category || 'N/A',
    },
    {
      id: 6,
      name: 'Email:',
      detail: data?.Email || 'N/A',
      // url: url?.contact_us,
    },
    {
      id: 7,
      name: 'Gender:',
      detail: data?.Gender || 'N/A',
      // url: url?.contact_us,
    },
  ];

  return (
    <View style={styles.container}>
      <Header title={'Profile'} />

      <ScrollView>
        <View style={styles.body}>
          <Avatar.Image
            size={100}
            source={{uri: 'https://randomuser.me/api/portraits/men/1.jpg'}}
            style={{backgroundColor: 'white', margin: 20}}
          />
          <Text
            style={{
              fontFamily: FONT_FAMILY.semiBold,
              fontSize: 20,
              color: 'black',
            }}>
            {data.DisplayName || 'User'}
          </Text>
        </View>
        <FlatList data={arr} numColumns={2} renderItem={renderUserDate} />
      </ScrollView>
    </View>
  );
};
const renderUserDate = ({item}) => {
  return (
    <Card style={styles.card}>
      <Card.Title title={item.name} style={styles.titleText}/>
      <Card.Title title={item.detail}  style={styles.headerText}/>
    </Card>
  );
};
const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerlogo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerText: {
    flex:1,
    fontSize: 17,
    fontFamily: FONT_FAMILY.bold,
  },

  body: {
    margin: 20,
    alignItems: 'center',
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    margin: 20,
 
  },
  titleText: {
    fontFamily: FONT_FAMILY.normal,
  },
});
export default Profile;
