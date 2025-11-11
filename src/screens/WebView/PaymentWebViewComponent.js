import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  ActivityIndicator,
  BackHandler,
  NativeEventEmitter,
  NativeModules,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import HyperSdkReact from 'hyper-sdk-react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FONT_FAMILY } from '../../util/constant';
import Header from '../../components/Header';
import { javascriptPost } from '../../util/api';
import { DARK_BLUE } from '../../util/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PaymentWebViewComponent = ({navigation}) => {
  // const navigation = useNavigation();
  const route = useRoute();

  const [isLoaderActive, setIsLoaderActive] = useState(false);
const [data, setData] = useState()
useEffect(() => {
  startPayment();
  const eventEmitter = new NativeEventEmitter(NativeModules.HyperSdkReact);

  const subscription = eventEmitter.addListener('HyperEvent', async(resp) => {
    const response = JSON.parse(resp);
    console.log('Received HyperEvent:', response);  // <-- Print the entire response here

    const event = response.event || '';
    const orderId = response.orderId;


    switch (event) {
      case 'initiate_result':
      case 'hide_loader':
        setIsLoaderActive(false);
        break;
      case 'process_result':
        const status = response.payload?.status || '';
        if(status === 'charged'){
          getSuccessData1(route?.params?.data, true,resp);
        }else if (status === 'user_aborted' || status === 'backpressed'|| status==='authorization_failed' ) {
          console.log('Payment cancelled by user or back pressed.');
           getSuccessData1(route?.params?.data, false,resp);
          // handle cancel
        } else {
         getSuccessData1(route?.params?.data, false,resp);
         
        }
        break;
      default:
        console.log('Other SDK Event:', response);
    }
  });

  const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
     if (!HyperSdkReact.isNull()) {
    HyperSdkReact.onBackPressed(); // still give SDK a chance
  }
  navigation.navigate('Home');
  return true;
  });

  return () => {
    subscription.remove();
    backHandler.remove();
  };
}, []);


  const startPayment = () => {
  setIsLoaderActive(true);
  const sdkPayload = route.params?.data.response.details.sdk_payload;

  console.log('SDK Payload:', sdkPayload);  // Print the sdk_payload to console

  if (sdkPayload) {
    HyperSdkReact.openPaymentPage(JSON.stringify(sdkPayload));
  } else {
    console.error('SDK Payload missing');
    setIsLoaderActive(false);
  }
};
console.log('\x1b[32m%s\x1b[0m', route.params.data.response.details.sdk_payload.payload, '---------------------- response ---------------------');
    

 const getSuccessData1 = async (data, status,payment_response) => {
    const apirequestObject = {
      path: data.end_point,
      body: {
        transaction_id: data.txnid,
        member_id: route.params.member_id,
        transaction_status: status,
        payment_response
      },
    };


    try {
      let response = await javascriptPost(apirequestObject);
  if (response && response.data) {
        setIsLoaderActive(false);
        setData(response.data);
      }
    } catch (error) {
      alert(error);
    }
  };
  return (
     <View style={styles.container}>
       
      <View style={styles.header}>
<TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
  <Icon name="chevron-left" size={20} color="white" />
      <Text style={styles.headerText}>Payment Recipt</Text>
</TouchableOpacity>
      </View>
        <View
          style={{
          flex:1,padding:10
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
           
                paddingHorizontal: 20,
                paddingTop: 30,
              }}
            >
              <Text style={styles.headerStyle}>Member Name</Text>
              <Text style={styles.textStyle}>
                {data?.member_name ? data.member_name : "Not Available"}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 20,
                paddingTop: 30,
                paddingBottom: 5,
              }}
            >
              <View style={{ width: width / 2 }}>
                <Text style={styles.headerStyle}>New ID</Text>
                <Text style={styles.textStyle}>
                  {data?.c_id ? data.c_id : "Not Available"}
                </Text>
              </View>
              <View style={{ width: width / 2 - 100 }}>
                <Text style={styles.headerStyle}>M ID</Text>
                <Text style={styles.textStyle}>
                  {data?.m_id ? data.m_id : "Not Available"}
                </Text>
              </View>
            </View>

            <View
              style={{
                paddingBottom: 5,
                justifyContent: "center",
                paddingHorizontal: 20,
                paddingTop: 30,
              }}
            >
              <Text style={styles.headerStyle}>{route?.params?.type} Amount</Text>
              <Text style={styles.textStyle}>
                {data?.paid_amount ? data.paid_amount : "Not Available"}
              </Text>
            </View>

            <View
              style={{
                paddingBottom: 5,
                justifyContent: "center",
                paddingHorizontal: 20,
                paddingTop: 30,
              }}
            >
              <Text style={styles.headerStyle}>Merchant Reference No</Text>
              <Text style={styles.textStyle}>
                {data?.reference_number
                  ? data.reference_number
                  : "Not Available"}
              </Text>
            </View>

            <View
              style={{
                paddingBottom: 5,
                justifyContent: "center",
                paddingHorizontal: 20,
                paddingTop: 30,
              }}
            >
              <Text style={styles.headerStyle}>Payment Status</Text>
              <Text style={styles.textStyle}>
                {data?.response_code ? data.response_code : "Not Available"}
              </Text>
            </View>

            <View
              style={{
                paddingBottom: 5,
                justifyContent: "center",
                paddingHorizontal: 20,
                paddingTop: 30,
              }}
            >
              <Text style={styles.headerStyle}>Transaction ID</Text>
              <Text style={styles.textStyle}>
                {data?.transaction_id ? data.transaction_id : "Not Available"}
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
  );
};

const { height, width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
   
    backgroundColor: "white",
  },
  headerStyle:{
    fontFamily:FONT_FAMILY.normal,
     color: "grey",
  },
  card: {
    width: "95%",
    height: "85%",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    marginTop: 5,
  },
  header: {
    backgroundColor: DARK_BLUE,
    alignItems: "center",
    flexDirection: "row",
    padding: 20,
 
  },
  headerText: {
    // fontSize: 17,
   fontFamily: FONT_FAMILY.normal,
    color: "white",
    // marginLeft: 10,
  },
  backButton: {
    // marginRight: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  textStyle: {
    color: "black",
    fontSize: 14,
     fontFamily:FONT_FAMILY.bold
  },
});


export default PaymentWebViewComponent;
