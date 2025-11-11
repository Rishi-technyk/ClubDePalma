
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Linking,
  StyleSheet,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icons from 'react-native-vector-icons/Entypo';
import {
  DARK_BLUE,
  LIGHT_GREEN,
  SECONDARY_COLOR,
} from '../../util/colors';
import {ENDPOINT, FONT_FAMILY} from '../../util/constant';
import * as api from '../../util/api';
import {DrawerActions, useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import TransactionBoxImage from '../../assets/svg/TransactionBoxImage';
import DeviceInfo from 'react-native-device-info';
import SvgUri from 'react-native-svg-uri';
import {Card} from 'react-native-paper';
import OTPModal from '../../components/OTPModal';
import { Toast } from 'react-native-toast-notifications';
import { getMessaging } from '@react-native-firebase/messaging';
import NewButton from '../../components/Button';
import CancelButton from '../../components/CancelButton';

const HomeComponent = ({navigation}) => {
  const Version = DeviceInfo.getVersion().toUpperCase();
  const [balance, setBalance] = useState(0);

  const [otpModal, setOTPModal] = useState(false);
  const isFocused = useIsFocused();
  const userData = useSelector(state => state.auth.userData);
  const [update, setupdate] = useState(false);
  const [store, setStore] = useState('');
  const [account_summary, setAccount_summary] = useState(null);
  const [options, setOptions] = useState(null);
  const iOS = Platform.OS === 'ios';
  useEffect(() => {
    callAPI();
    fetchAccountsummery();
  }, [isFocused]);
  const fetchOptions = async () => {
    let body = {};
    body.ws_type = 'menus';
    const apiRequestObject = {
      path: '',
      body: body,
      Token: userData.data.token,
    };
    const response = await api.javascriptPost(apiRequestObject);

    if (response.status && response.data?.currentOptions)
      setOptions(response.data);
  };
  useEffect(() => {
    fetchVersion();
  }, []);

  function compareVersions(version1, version2) {
    const v1 = version1.split('.').map(Number);
    const v2 = version2.split('.').map(Number);
    const paddedV1 = v1.map(num => String(num).padStart(5, '0')).join('');
    const paddedV2 = v2.map(num => String(num).padStart(5, '0')).join('');

    return paddedV1.localeCompare(paddedV2);
  }
  const fetchVersion = async () => {
    let body = {};
    const apiRequestObject = {
      path: 'config',
      body: body,
      Token: userData.data.token,
    };

    const response = await api.javascriptGet(apiRequestObject);
    console.log('\x1b[36m%s\x1b[0m', response, '---------------------- response ---------------------');
    if (response.status) {
      setStore(
        iOS ? response.data.app_store_link : response.data.play_store_link,
      );
      let apiVersion = iOS
        ? response?.data?.current_ios_app_version
        : response?.data?.current_app_version;
    const comparison = compareVersions(Version, apiVersion);
      // console.log(response, Version, "is_notification_read", comparison);
      if (apiVersion) {
        if (comparison < 0) {
          let hardUpdate = iOS
            ? response.data.ios_hard_update
            : response.data.hard_update;
             response.data.hardUpdate=hardUpdate
           setupdate(response.data)
        }}
    }
  };
  
  const fetchAccountsummery = async () => {
    let body = {};
    body.ws_type = ENDPOINT.account_summary;
    body.member_id =
      userData.data.data.length > 0 ? userData.data.data[0].MemberID : 0;

    try {
      const apiRequestObject = {
        path: '',
        body: body,
        Token: userData.data.token,
      };

      const response = await api.javascriptPost(apiRequestObject);
  
      if (response.data) {
        setAccount_summary(response.data);
      }

      return response;
    } catch (err) {
      return {result: FAILURE};
    }
  };
 async function callAPI() {
  const deviceTokenId = await getMessaging().getToken();
  console.log('\x1b[36m%s\x1b[0m', deviceTokenId, '---------------------- deviceTokenId ---------------------');
    let body = {};
    body.ws_type = ENDPOINT.card_balance;
    body.member_id =
      userData.data.data.length > 0 ? userData.data.data[0].MemberID : 0;

    try {
      const apiRequestObject = {
        path: ENDPOINT.card_balance,
        body: body,
        Token: userData.data.token,
      };
      let summeryOblect = {
        path: ENDPOINT.account_summary,
        Token: userData.data.token,
        body: {},
      };
      const response = await api.javascriptGet(apiRequestObject);
      const Summery = await api.javascriptGet(summeryOblect);
    
     Summery.status ? setAccount_summary(Summery.data) : '0.00';
     response.data.balance ? setBalance(response.data.balance) : '0.00';
   

      return response;
    } catch (err) {
      return {result: FAILURE};
    }
  }
console.log(account_summary,'balance')
  const handleUpdate = () => {
    Linking.openURL(store);
  };

  const renderItem = (item, options) => (
    <View
      style={{alignItems: 'center', justifyContent: 'space-around', flex: 1}}>
      <TouchableOpacity
        onPress={() => {
          item?.item?.navigate
            ? navigation.navigate(item.item.navigate, item?.item?.data)
            : item?.item.OTP
            ? setOTPModal(true)
            : Toast.show( 'Feature coming soon...',{
              type:'warning',
            });
        }}
        activeOpacity={0.9}>
        <View style={{margin: 10}}>
          <SvgUri
            style={{
              backgroundColor: 'rgb(237, 243, 249)',
              padding: 10,
              borderRadius: 10,
              alignItems: 'center',
            }}
            height={50}
            width={50}
            source={{
              uri: `https://club26.org/mobileAPI/icons/${item?.item?.icon}`,
            }}
          />
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              marginTop: 10,
              fontFamily: FONT_FAMILY.normal,
              color: 'black',
              fontSize: 14,
            }}>
            {item.item.name}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const screens = [
    {
      id: 1,
      name: "Subscription",
      icon: "Statementcdp.svg",
      navigate: "Invoice",
    },
    {
      id: 2,
      name: "Card",
      icon: "Rechargecdp.svg",
      navigate: "Recharge",
      data: balance,
    },
    {
      id: 3,
      name: "OTP",
      icon: "Otpcdp.svg",
      OTP: true,
    },
   
  ];
  const screens2 = [

    {
      id: 2,
      name: "News & Circulars",
      icon: "newscdp.svg",
      subTitle: "Stay updated with the latest announcements.",
      navigate: "Notification",
      data: "",
      fullwidth: false,
    },
    {
      id: 3,
      name: "Book Activities",
      subTitle: "Browse exclusive activities and games options.",
      icon: "bowling-svgrepo-com.svg",
      navigate: "AllFacilities",
      data: "https://club26.org/CLUB26-MENU.pdf",
      fullwidth: false,
    },
  ];

 
  const renderBottomList = ({item}) => {
    return (
      <TouchableOpacity
      activeOpacity={0.9}
        onPress={() => navigation.navigate(item.navigate, {url: item.data})}
        style={[styles.card, {}]}>
        <View style={{}}>
          <View>
            <Text
              style={{
                marginTop: 10,
                fontFamily: FONT_FAMILY.semiBold,
                color: 'black',
                fontSize: 16,
              }}>
              {item.name}
            </Text>
          </View>
          <Text
            style={{
              marginTop: 10,
              fontFamily: FONT_FAMILY.normal,
              color: 'grey',
              fontSize: 13,
              width: '60%',
            }}>
            {item.subTitle}
          </Text>
          <View
            style={{
              position: 'absolute',
              right: 0,
              bottom: -10,
            }}>
            <SvgUri
              height={60}
              width={60}
              source={{
                uri: `https://club26.org/mobileAPI/icons/${item?.icon}`,
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          backgroundColor: DARK_BLUE,
        }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}>
          <Icon
            name="menu-fold"
            size={20}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer)}
            color={"white"}
          />
          <View
            style={{
              flex: 0.9,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Image
              source={require("../../assets/images/clubdepalma.jpg")}
              style={{ height: 30, width: 30, borderRadius: 15 }}
            />
            <Text
              style={{
                color: "white",
                fontSize: 25,
                marginLeft: 5,
                fontFamily: FONT_FAMILY.normal,
              }}>
              CLUBE de PALMA
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
            justifyContent: "space-between",
          }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: FONT_FAMILY.bold,
              color: "white",
            }}
            numberOfLines={2}>
            Card Balance:{" "}
          </Text>
          <Text style={[styles.moneyText, { fontSize: 20 }]} numberOfLines={2}>
            ₹{balance.balance ? Number(balance.balance).toFixed(2) : "0.00"}
          </Text>
        </View>
      </View>
    
        <View
          style={{
            // flex:1,
            padding: 20,
            paddingTop: 0,
            backgroundColor: DARK_BLUE,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}>
          <View
            style={{
              // flex: 1,
              backgroundColor: LIGHT_GREEN,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 20,
              shadowOffset: { width: 200, height: 400 }, // iOS

              shadowRadius: 1, // iOS
              backdropFilter: "blur(10px)",
              opacity: 1,
            }}>
            <View style={{ position: "absolute", top: "40%", right: 0 }}>
              <TransactionBoxImage style={{ scale: 0.6 }} />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}>
              <Icons name="wallet" size={20} color={DARK_BLUE} />
              <Text style={styles.prepaidText}>Subscription/Dues</Text>
            </View>
            <View
              style={{
                // flex: 1,
                flexDirection: "row",
                alignItems: "center",
              }}>
              <View style={{ flex: 0.5 }}>
                <Text style={styles.postpaidBalanceText}>Current Bill</Text>
                <Text style={styles.moneyText}>
                  ₹
                  {account_summary?.bill_amt
                    ? Number(account_summary?.bill_amt).toFixed(2)
                    : "0.00"}
                </Text>
              </View>
              <View style={{ flex: 0.5 }}>
                <Text style={styles.postpaidBalanceText}>Unbilled Debit</Text>
                <Text style={styles.moneyText}>
                  ₹
                  {account_summary?.total_debit
                    ? Number(account_summary?.total_debit).toFixed(2)
                    : "0.00"}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}>
              <View style={{ flex: 0.5 }}>
                <Text style={styles.postpaidBalanceText}>Unbilled Credit</Text>
                <Text style={styles.moneyText}>
                  ₹
                  {account_summary?.total_credit
                    ? Number(account_summary?.total_credit).toFixed(2)
                    : "0.00"}
                </Text>
              </View>
              <View style={{ flex: 0.5 }}>
                <Text style={styles.postpaidBalanceText}>Outstanding</Text>
                <Text style={styles.moneyText}>
                  ₹
                  {account_summary?.outstanding_amt
                    ? Number(account_summary?.outstanding_amt).toFixed(2)
                    : "0.00"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <ScrollView
        showsVerticalScrollIndicator={false}
          style={{backgroundColor:'white'}}
            contentContainerStyle={{ backgroundColor:'white'}}
      >
        <View
          style={{
            flex: 1,
            margin: 20,
            borderWidth: 2,
            borderColor: "rgba(0,0,0,0.2)",
            borderRadius: 10,
          }}>
          <Text style={styles.headingText}>Transactions & A/C</Text>
          <FlatList
            scrollEnabled={false}
            data={screens}
            numColumns={3}
            contentContainerStyle={{}}
            renderItem={(item) => renderItem(item, true)}
          />
        </View>

        <View
          style={{
            justifyContent: "space-around",
            backgroundColor: "white",
            marginTop: 20,
            borderRadius: 5,
            padding: 10,
          }}>
          <FlatList
            scrollEnabled={false}
            data={screens2}
            numColumns={2}
            contentContainerStyle={{}}
            keyExtractor={(item, index) => item.name}
            renderItem={renderBottomList}
          />
        </View>
    
      </ScrollView>
     {update && (
        <Modal visible={true} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{update.and_alert_line}</Text>
              <View
                style={[
                  styles.buttonContainer,
                  {
                    justifyContent: update.hardUpdate
                      ? "flex-end"
                      : "space-between",
                  },
                ]}>
             
                <NewButton
                 text="Update"
                 onPress={handleUpdate}
                />
                {update.hardUpdate == false && (

                <CancelButton
                 text="Cancel"
                onPress={() => setupdate(false)}
                />
                 
                )}
              </View>
            </View>
          </View>
        </Modal>
      )}
      <OTPModal visible={otpModal} setVisible={setOTPModal} />
    </View>
  );
};

export default HomeComponent;
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  listView: {
    justifyContent: "space-around",
    backgroundColor: "white",
    margin: 20,
    borderRadius: 5,
    padding: 10,
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    marginBottom: 20,
    fontSize: 16,
    fontWeight: "300",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  Buttons: {
    backgroundColor: SECONDARY_COLOR,
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  prepaidText: {
    fontSize: 16,
    color: "black",
    fontFamily: FONT_FAMILY.bold,
    marginVertical: 5,
    paddingLeft: 5,
  },
  headingText: {
    fontSize: 16,
    color: "black",
    fontFamily: FONT_FAMILY.bold,
    marginVertical: 5,
    padding: 10,
    borderBottomColor: "rgba(0,0,0,0.2)",
    borderBottomWidth: 2,
  },
  moneyText: {
    fontSize: 15,
    color:SECONDARY_COLOR,
    marginTop: 3,
    fontFamily: FONT_FAMILY.bold,
  },
  equalFlex: {
    flex: 0.33,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    padding: 15,
    backgroundColor: "rgb(245, 248, 255)",
    borderWidth: 0.5,
    borderColor: "rgb(196, 197, 198)",
    opacity:2,
    elevation:9
  },
  postpaidBalanceText: {
    fontSize: 14,
    marginTop: 5,
    fontFamily: FONT_FAMILY.normal,
    color: "black",
  },

  primeryIcon: {
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "transparent",
  },
  secondryIcon: {
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 30,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "white",
    elevation: 10,
    shadowColor: "grey",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  roundShimmer: {
    width: 50, // Set width for the shimmer
    height: 50, // Set height for the shimmer
    borderRadius: 50, // Make it round
  },
});