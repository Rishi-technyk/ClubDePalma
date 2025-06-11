import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { DARK_BLUE, LIGHT_GREEN, SECONDARY_COLOR } from "../../util/colors";
import { ENDPOINT, FONT_FAMILY } from "../../util/constant";
import InvoiceStyles from "../../Styles/InvoiceStyle";
import * as api from "../../util/api";
import TransactionBoxImage from "../../assets/svg/TransactionHistory";
import { useSelector } from "react-redux";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";
import { useQueryClient } from "@tanstack/react-query";
import {
  getStatement,
  useStatments,
  useTransactions,
} from "./ViewStatementService";
import DatePickerComponent from "../Transaction/DatePicker";
import NewButton from "../../components/Button";
import { getRechargeNewData, getStatmentData } from "../CardRecharge/CardRechargeService";
import { Card } from "react-native-paper";
import { Toast } from "react-native-toast-notifications";
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const ViewStatement = ({ navigation }) => {
  const [startDate, setStartDate] = useState(null);
  const userData = useSelector((state) => state.auth.userData);

  const [endDate, setEndDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(null);
  const [tempEndDate, setTempEndDate] = useState(null);
  const [amountheading, setAmountheading] = useState("");
  const [amount, setAmount] = useState("");
  const [click, setClick] = useState("");
  const [showModalAmount, setShowModalAmount] = useState(false);
  const [loading, setLoading] = useState(false);
  const billType = [
    { type: "Bill to Bill", text: 0, placeholder: "" },
    {
      type: "More than Bill",
      text: "Additional Amount",
      placeholder: "Enter Additional Amount",
    },
  ];
  // const data = null;
  // let isLoading=false
  const { data, isLoading, error, refetch } = useTransactions(
    startDate,
    endDate,
    userData
  );

  const statmentData = useStatments(userData);
  const applyFilter = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setShowModal(false);
    refetch();
  };
  const onSelect = (ind) => {
    if (ind !== "") {
      setClick(ind);
      setAmountheading({
        text: billType[ind]?.text,
        placeholder: billType[ind]?.placeholder,
      });
      setAmount("");
    }
  };

  const CreditAmt = parseFloat(
    data?.data
      ?.reduce((acc, record) => {
        return acc + parseFloat(record.credit_amt);
      }, 0)
      .toFixed(2)
  );

  const DebitAmt = parseFloat(
    data?.data
      .reduce((acc, record) => {
        return acc + parseFloat(record.debit_amt);
      }, 0)
      .toFixed(2)
  );
  const handleValidateDates = () => {
    
    if (tempEndDate && tempStartDate) {
      if (moment(tempStartDate).isAfter(tempEndDate)) {
        Toast.show("Invalid Date Range",{
          type: "warning",
        });
        setShowModal(false);
        setTempEndDate("");
        setTempStartDate("");
        return;
      } else {
        applyFilter();
      }
    } else {
      Toast.show("Please select Date range.",
        {
          type: "warning",
        }
      );
    }
  };
  const showDatepickerModal = () => {
    setTempEndDate(null);
    setTempStartDate(null);
    setShowModal(true);
  };
   const payNowAction = async (paymentType) => {
  Toast.hideAll()
    try {
      const payload = {
        // amount: amount ? amount : 0,
       
      };
      setLoading(true);
      const apiRequestObject={
        path:'create_invoice_pay_order',
        body:{
          member_id:userData?.data?.data[0]?.MemberID,
           payment_type: 'Bill to Bill',
        less_than_amount: 0,
        }
      }
      let response = await api.javascriptPost(apiRequestObject);
      console.log('\x1b[36m%s\x1b[0m', response, '---------------------- response ---------------------');
      setLoading(false);
      setShowModalAmount(false);
      if (response && response?.data && response?.data?.url) {
        setAmount(0);

        navigation.navigate("PaymentWebView", {
        data:response.data,
          member_id: userData?.data?.data[0]?.MemberID,
        type:'Bill'
        });
        setAmountheading("");
      } else {
        Toast.show(response.message|| 'Failed to initiate payment.',{
          type: "danger",
        });
      }
    } catch (error) {
      Toast.show(error.message ||'Failed to initiate payment.',{
        type: "danger",
      });
    }
  };
  // const payNowAction = async (paymentType) => {
  //     Toast.show("Feature coming soon...",
  //       {
  //         type: "warning",
  //       }
  //     );
  //     return;
  //   try {
  //     const payload = {
  //       amount: amount ? amount : 0,
  //       payment_type: billType[paymentType].type,
  //       less_than_amount: 0,
  //     };
  //     setLoading(true);
  //     let response = await getStatmentData(payload, userData?.data?.token);
  //     console.log(response.data.url, "payload", payload);
  //     setLoading(false);
  //     if (response && response?.data && response?.data?.url) {
  //       setShowModalAmount(false);
  //       setAmount(0);
  //       const { url } = response.data;

  //       navigation.navigate("PaymentWebView", {
  //        data:{ url: response?.data?.url,
  //         title: "Pay Now",
  //         member_id: payload.member_id,
  //         amount: payload.amount,
  //         txn_id: "",
  //         userInfo: null,
  //         invoice: false,}
  //       });
  //       setAmountheading("");
  //     } else {
  //       Toast.show(response.message,{
  //         type: "danger",
  //       });
  //     }
  //   } catch (error) {
  //     Toast.show(error.message,{
  //       type: "danger",
  //     });
  //   }
  // };
  const onSubmitButtonPress = () => {
    if (click !== null) {
      if (click === 0) {
        payNowAction(click);
      } else if (
        Number(statmentData?.data?.amount_payable ?? 0) >
          Number(amount) &&
        Number(amount) > 0 &&
        click === 1
      ) {
        payNowAction(click);
      } else if (Number(amount) > 0 && click === 1) {
        payNowAction(click);
      }
    } else {
      console.log("Call is coming here in else!");

      Toast.show("Please Select Bill amount",{
        type: "warning",
      });
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Header
        title={"Subscription"}
        OpenDropDawn={showDatepickerModal}
        isMulti={true}
        isDawnload={true}
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              refetch(), setStartDate(null), setEndDate(null);
            }}
            tintColor={SECONDARY_COLOR}
            refreshing={isLoading}
            colors={[DARK_BLUE]}
          />
        }
        showsVerticalScrollIndicator={false}
        style={{backgroundColor:DARK_BLUE}}
        contentContainerStyle={{ flexGrow: 1 ,backgroundColor:'white'}}
        stickyHeaderIndices={[1]}>
        <View style={InvoiceStyles.container}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}>
            <Text
              style={{
                flex: 1,
                fontSize: 14,
                fontFamily: FONT_FAMILY.bold,
                color: "white",
              }}>
              Current Outstanding:
            </Text>
            <Text
              style={[InvoiceStyles.moneyText, { fontSize: 20, color: "red" }]}>
              ₹
              {statmentData?.data?.bill_amount
                ? Number(statmentData.data?.bill_amount).toFixed(2)
                : "0.00"}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: LIGHT_GREEN,
              borderRadius: 20,
              padding: 10,
              paddingHorizontal: 15,
            }}>
            <View style={InvoiceStyles.svg}>
              <TransactionBoxImage style={{ scale: 0.6 }} />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 5,
                justifyContent: "space-between",
              }}>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Icon
                  name="card-account-details-star"
                  size={20}
                  color={DARK_BLUE}
                />
                <Text style={InvoiceStyles.text}>A/C Summary</Text>
              </View>
              <View>
                <NewButton
                  text={"View Bill"}
                  onPress={() =>
                    navigation.navigate("PDFView", {
                      url: statmentData?.data?.pdf,
                      title: "Statement",
                    })
                  }
                />
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
              }}>
              <View style={{ flex: 0.5 }}>
                <Text style={InvoiceStyles.postpaidBalanceText}>
                  Opening Balance
                </Text>
                <Text style={InvoiceStyles.moneyText}>
                  ₹{data?.opening_balance ? data?.opening_balance : "0.00"}
                </Text>
              </View>
              <View style={{ flex: 0.5 }}>
                <Text style={InvoiceStyles.postpaidBalanceText}>
                  Closing Balance
                </Text>
                <Text style={InvoiceStyles.moneyText}>
                  ₹{data?.closing_balance ? data?.closing_balance : "0.00"}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}>
              <View style={{ flex: 0.5 }}>
                <Text style={InvoiceStyles.postpaidBalanceText}>
                  Total Credit
                </Text>
                <Text style={InvoiceStyles.moneyText}>
                  ₹
                  {CreditAmt && startDate && endDate
                    ? Number(CreditAmt).toFixed(2)
                    : data?.credit_amt || "0.00"}
                </Text>
              </View>
              <View
                style={{
                  flex: 0.5,
                }}>
                <Text style={InvoiceStyles.postpaidBalanceText}>
                  Total Debit
                </Text>
                <Text style={InvoiceStyles.moneyText}>
                  ₹
                  {DebitAmt && startDate && endDate
                    ? Number(DebitAmt).toFixed(2)
                    : data?.debit_amt || "0.00"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Transaction list */}
        <View
          style={{
            backgroundColor: "white",
            elevation: 3,
            paddingHorizontal: 10,
          }}>
          <View
            style={{
              flexDirection: "row",

              padding: 10,
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Text style={InvoiceStyles.transactionListHeaderText}>
              Transaction History
            </Text>
            <View>
             <NewButton
               loading={loading}
                text={"Pay Now"}
                onPress={() => {
                  // setShowModalAmount(true), setClick("");
                   payNowAction()
                }}
              />
            </View>
          </View>
        </View>
        {startDate && endDate && data?.data?.length > 0 && (
          <Text style={InvoiceStyles.noRecord}>
            Records between {moment(startDate).format("DD MMM YYYY")} to{" "}
            {moment(endDate).format("DD MMM YYYY")}
          </Text>
        )}

        <FlatList
          scrollEnabled={false}
          ListEmptyComponent={
            isLoading ? (
              emptyList
            ) : startDate && endDate ? (
              <View
                style={{
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <Image
                  style={InvoiceStyles.alertImage}
                  source={require("../../assets/images/norecord.png")}
                />
                <Text style={InvoiceStyles.noRecord}>
                  No records found matching the applied filters.
                </Text>
              </View>
            ) : (
              <Text style={InvoiceStyles.noRecord}>No records found.</Text>
            )
          }
          initialNumToRender={10}
          data={data?.data}
          contentContainerStyle={{
            marginHorizontal: 20,
            marginTop: 20,
            flex: 1,
          }}
          renderItem={renderTransactions}
        />
      </ScrollView>
      <Modal
        transparent={true}
        dismissableBackButton={true}
        statusBarTranslucent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
        visible={showModal}
        presentationStyle={
          Platform.OS === "ios" ? "pageSheet" : "overFullScreen"
        }
        style={{ alignItems: "flex-end", flex: 1, justifyContent: "flex-end" }}
        dismissable={true}>
        <View style={InvoiceStyles.modal}>
          <View style={InvoiceStyles.innerModalCont}>
            <View
              style={InvoiceStyles.headingContainer}>
              <Text
                style={InvoiceStyles.headingText}>
                Filter by:
              </Text>
              <Icon
                onPress={() => setShowModal(false)}
                name="close"
                size={25}
                style={InvoiceStyles.cancelText}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                flex: 1,
                marginTop: 20,
              }}>
              <View
                style={{
                  flex: 0.5,
                  // justifyContent: "space-evenly",
                  // alignItems: "center",
                }}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={{
                    // flex: 1,
                    backgroundColor:
                      click === 1 ? "white" : "rgb(237, 243, 249)",
                    justifyContent: "space-between",
                    // width: "100%",
                    padding: 10,
                    flexDirection: "row",
                  }}
                  onPress={() => onApply(0)}>
                  <Text
                    style={{
                      fontFamily: FONT_FAMILY.semiBold,
                      fontSize: 14,
                      color: click === 1 ? "grey" : "black",
                    }}>
                    Date
                  </Text>
                  <Text style={{ textAlign: "right" }}>
                    {tempEndDate && tempStartDate ? 1 : ""}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                  marginHorizontal: 20,
                }}>
                <DatePickerComponent
                  placeholder={"Select Start date"}
                  stateDate={setTempStartDate}
                />
                <DatePickerComponent
                  placeholder={"Select End date"}
                  stateDate={setTempEndDate}
                  minDate={
                    tempStartDate
                      ? moment(tempStartDate).add(1, "day").toDate()
                      : moment().toDate()
                  }
                />
              </View>
            </View>
          </View>
        </View>
        <View style={{ backgroundColor: "white", padding: 10 }}>
          <TouchableOpacity
            onPress={handleValidateDates}
            activeOpacity={0.9}
            style={InvoiceStyles.submitContainer}>
            <Text style={InvoiceStyles.confirmText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        dismissableBackButton={true}
        animationType="slide"
        transparent={true}
        // presentationStyle='formSheet'
        presentationStyle={
          Platform.OS === "ios" ? "pageSheet" : "overFullScreen"
        }
        onRequestClose={() => setShowModalAmount(false)}
        visible={showModalAmount}
        dismissable={true}>
        <View style={InvoiceStyles.modal}>
          <View style={InvoiceStyles.innerModalCont}>
            <View
              style={InvoiceStyles.headingContainer}>
              <Text
                style={InvoiceStyles.headingText}>
                Pay Now
              </Text>
              <Icon
                onPress={() => setShowModalAmount(false)}
                name="close"
                size={25}
                style={InvoiceStyles.cancelText}
              />
            </View>
            <View>
              <FlatList
                data={billType}
                renderItem={({ item, index }) => {
                  return (
                    <View style={{ flex: 1 }}>
                      <TouchableOpacity
                        disabled={
                          Number(
                            statmentData?.data?.amount_payable || 0
                          ) < 0 && index !== 2
                        }
                        onPress={() => onSelect(index)}
                        activeOpacity={0.7}
                        style={{ flexDirection: "row", margin: 10 }}>
                        <View
                          style={{
                            justifyContent: "center",
                            opacity:
                              Number(statmentData?.data?.amount_payable) <
                                0 && index !== 2
                                ? 0.3
                                : 2,
                          }}>
                          <Image
                            source={
                              click === index
                                ? require("../../assets/images/circleFilled.png")
                                : require("../../assets/images/circle.png")
                            }
                            style={{
                              height: 20,
                              width: 20,
                              tintColor: click === index ? "black" : "grey",
                              resizeMode: "contain",
                            }}
                          />
                        </View>
                        <View
                          style={{
                            marginLeft: 10,
                          }}>
                          <Text
                            style={[
                              {
                                fontFamily: FONT_FAMILY.semiBold,
                                fontSize: 16,
                                color: click === index ? "black" : "grey",
                              },
                            ]}>
                            {item.type}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
              {click !== "" && (
                <Text
                  style={{
                    color: "black",
                    fontFamily: FONT_FAMILY.normal,
                    marginLeft: 10,
                  }}>
                  Payble Amount:{" "}
                  <Text
                    style={{
                      color: SECONDARY_COLOR,
                      fontFamily: FONT_FAMILY.bold,
                      fontSize: 16,
                    }}>
                    ₹
                    {Number(
                      statmentData?.data?.amount_payable || 0
                    ).toFixed(2) || 0}
                  </Text>
                </Text>
              )}
              {amountheading.text !== 0 && click !== "" && (
                <TextInput
                  value={amount}
                  placeholder="Enter Payble Amount"
                  placeholderTextColor={"grey"}
                  style={InvoiceStyles.amountInput}
                  onChangeText={(text) => setAmount(text)}
                  maxLength={6}
                  keyboardType="decimal-pad"
                />
              )}
            </View>
          </View>
          <View style={{ backgroundColor: "white", padding: 10 }}>
            <TouchableOpacity
              onPress={onSubmitButtonPress}
              activeOpacity={0.9}
              style={InvoiceStyles.submitContainer}>
              {loading && <ActivityIndicator color={"white"} />}

              <Text
                onPress={onSubmitButtonPress}
                style={InvoiceStyles.confirmText}>
                Pay
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const renderTransactions = ({ item }) => {
  return (
    <Card style={InvoiceStyles.listcontainer}>
      <View style={InvoiceStyles.transactionRow}>
        <View style={InvoiceStyles.rowContainer}>
          <Icon name="calendar-month-outline" size={15} color="grey" />
          <Text style={[InvoiceStyles.dateText]}>
            {moment(item?.voucher_date).format("DD MMM YYYY")}
          </Text>
        </View>
        <Text style={[InvoiceStyles.voucherText, {}]}>
          Voucher No:{" "}
          <Text style={InvoiceStyles.voucherBold}>{item.voucher_no}</Text>
        </Text>
      </View>

      <View style={InvoiceStyles.transactionRow}>
        <Text numberOfLines={2} style={{ flex: 1,color:'black',fontFamily:FONT_FAMILY.semiBold }} ellipsizeMode="tail">
          {item.particulars}
        </Text>
        <View style={InvoiceStyles.creditContainer}>
          <Icon name="arrow-bottom-left" size={15} color={SECONDARY_COLOR} />
          <Text style={InvoiceStyles.creditText}>
            ₹{isNaN(item.credit_amt) ? "0.00" : item.credit_amt} Cr.
          </Text>
        </View>
      </View>
      <View style={InvoiceStyles.transactionRow}>
        <Text numberOfLines={3} style={InvoiceStyles.narrationText}>
          {item.narrations
            .toLowerCase()
            .replace(/(^\s*\w|[\.\?\!]\s*\w)/g, (char) => char.toUpperCase())}
        </Text>
        <View style={InvoiceStyles.debitContainer}>
          <Icon name="arrow-top-right" size={15} color="red" />
          <Text style={InvoiceStyles.debitText}>
            ₹{isNaN(item.debit_amt) ? "0.00" : item.debit_amt} Dr.
          </Text>
        </View>
      </View>
    </Card>
  );
};
export default ViewStatement;

const emptyList = () => (
  <FlatList
    data={[1, 1, 1, 1, 1, 1]}
    renderItem={() => (
      <View style={InvoiceStyles.listcontainer}>
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
          }}>
          <ShimmerPlaceholder style={{ borderRadius: 10 }} width={80} />
          <ShimmerPlaceholder style={{ borderRadius: 10 }} width={80} />
        </View>
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            marginVertical: 10,
          }}>
          <ShimmerPlaceholder style={{ borderRadius: 10 }} width={80} />
          <ShimmerPlaceholder style={{ borderRadius: 10 }} width={80} />
        </View>
        <ShimmerPlaceholder style={{ borderRadius: 10 }} />
      </View>
    )}
  />
);
// export default ViewStatement;
// import React, {useState, useEffect} from 'react';

// import {
//   ActivityIndicator,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Image,
//   StatusBar,
//   StyleSheet,
//   Dimensions,
//   Alert,
//   KeyboardAvoidingView,
//   Modal,
//   Platform,
// } from 'react-native';
// import {getStatusBarHeight} from 'react-native-status-bar-height';
// import {PINK_COLOR, SECONDARY_COLOR} from '../../util/colors';
// import {moderateScale} from '../../util/scale';
// import {FONT_FAMILY} from '../../util/constant';
// import Button from '../../components/Button';
// import ViewStatement from '../../assets/svg/ViewStatement';
// import CrossIcon from '../../assets/svg/CrossIcon';
// import {getStatement} from './ViewStatementService';
// import {useSelector} from 'react-redux';
// import {getStatmentData} from '../CardRecharge/CardRechargeService';
// import {FlatList} from 'react-native-gesture-handler';

// const ViewStatementComponent = ({navigation}) => {
//   const [amountText, setAmountText] = useState('');
//   const [additionalAmountText, setAdditionalAmountText] = useState('');
//   const [rechargeBoxError, setRechargeBoxError] = useState('');
//   const [data, setData] = useState({pay_status: 'success'});
//   console.log(data, '---------------data---------------');
//   const userData = useSelector(state => state.auth.userData);
//   const [amountheading, setAmountheading] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [pdf, setPdf] = useState(null);
//   const [amountPayable, setAmountPayable] = useState(0);
//   const [click, setClick] = useState('');
//   const [closeModal, setClosemodal] = useState(false);
//   const [billType, setbillType] = useState([
//     {type: 'Bill to Bill', text: 0, placeholder: ''},
//     {
//       type: 'Less than Bill',
//       text: 'Minimum Bill Amount',
//       placeholder: 'Enter Minimum Bill Amount',
//     },
//     {
//       type: 'More than Bill',
//       text: 'Additional Amount',
//       placeholder: 'Enter Additional Amount',
//     },
//   ]);
//   const onSelect = ind => {
//     if (ind !== '') {
//       setClick(ind);
//       setAmountheading({
//         text: billType[ind]?.text,
//         placeholder: billType[ind]?.placeholder,
//       });
//       setAdditionalAmountText('');
//     }
//   };

//   const getStatementApi = async () => {
//     try {
//       setLoading(true);
//       let response = await getStatement(
//         userData.data.data[0].MemberID,
//         userData.data.token,
//       );

//       if (response) {
//         setLoading(false);
//         setPdf(response.pdf);
//         setData(response);
//         setAmountPayable(response.amount_payable ? response.amount_payable : 0);
//       } else {
//         setLoading(false);
//       }
//     } catch (error) {
//       Alert.alert(error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getStatementApi();
//     return () => setClosemodal(false);
//   }, []);

//   const payNowAction = async paymentType => {
//     setAmountheading('');
//     setLoading(true);
//     setClosemodal(false);
//     try {
//       const payload = {
//         amount: 0,
//         payment_type: billType[paymentType].type,
//         less_than_amount: 0,
//       };

//       paymentType === 1
//         ? (payload.less_than_amount = additionalAmountText)
//         : (payload.amount = additionalAmountText);
//       paymentType === 0 ? (payload.amount = amountPayable) : 0;

//       const response = await getStatmentData(payload, userData?.data?.token);
//       if (response && response.data && response.data.url) {
//         if (response && response.data.url) {
//           navigation.navigate('PaymentWebView', {
//             member_id: payload.member_id,
//             amount: payload.amount,
//             data: response.data,
//           });
//         }
//         setClosemodal(false);
//         setAmountheading('');
//         setLoading(false);
//       } else if (!response.status) {
//         setLoading(false);

//         Alert.alert(response.message);
//         //   setError(response.message || 'Error in API response');
//       }
//       setLoading(false);
//     } catch (error) {
//       Alert.alert('Feature Coming Soon...');
//       setLoading(false);
//     }
//   };

//   const onChangeText = (text, type) => {
//     if (type === 'amountText') {
//       setAmountText(text);
//     } else if (type === 'additionalAmountText') {
//       setAdditionalAmountText(text);
//     }
//   };

//   const onSubmitButtonPress = () => {
//     if ((click == 2 || click == 1) && additionalAmountText == '') {
//       setRechargeBoxError('Please fill a valid amount');
//       return;
//     }

//     if (click !== null) {
//       if (click === 0) {
//         payNowAction(click);
//       } else if (
//         Number(amountPayable) > Number(additionalAmountText) &&
//         Number(additionalAmountText) > 0 &&
//         click === 1
//       ) {
//         payNowAction(click);
//       } else if (Number(additionalAmountText) > 0 && click === 2) {
//         payNowAction(click);
//       } else {
//         if (
//           click === 1 &&
//           Number(amountPayable) < Number(additionalAmountText)
//         ) {
//           setRechargeBoxError('The amount should be less than the bill amount');
//         } else {
//           setRechargeBoxError('Please fill a valid amount');
//         }
//       }
//     } else {
//       console.log('Call is coming here in else!');

//       setRechargeBoxError('Please Select Bill amount');
//     }
//   };
//   const renderContent = () => {
//     return (
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={{flex: 1}}>
//         <View
//           style={{
//             backgroundColor: 'white',
//             paddingHorizontal: 20,
//             paddingVertical: 20,
//             borderTopEndRadius: 30,
//             height: '100%',
//             borderTopLeftRadius: 30,
//           }}>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               marginBottom: 10,
//             }}>
//             <View>
//               <Text style={{fontSize: moderateScale(18), fontWeight: 'bold'}}>
//                 Payment Details
//               </Text>
//             </View>
//             <TouchableOpacity
//               onPress={() => {
//                 setClosemodal(false),
//                   setClick(''),
//                   onSelect(''),
//                   setAdditionalAmountText('');
//               }}
//               activeOpacity={0.5}
//               style={{
//                 height: 30,
//                 width: 30,
//                 borderRadius: 15,
//                 alignItems: 'center',
//                 justifyContent: 'center',
//               }}>
//               <CrossIcon />
//             </TouchableOpacity>
//           </View>
//           <View>
//             <FlatList
//               data={billType}
//               renderItem={({item, index}) => {
//                 return (
//                   <View>
//                     <TouchableOpacity
//                       disabled={amountPayable === 0 && index !== 2}
//                       onPress={() => onSelect(index)}
//                       activeOpacity={0.7}
//                       style={styles.listRow}>
//                       <View
//                         style={{
//                           flex: 0.1,
//                           justifyContent: 'center',
//                           alignItems: 'flex-start',
//                           opacity: amountPayable === 0 && index !== 2 ? 0.3 : 2,
//                         }}>
//                         <Image
//                           source={
//                             click === index
//                               ? require('../../assets/images/circleFilled.png')
//                               : require('../../assets/images/circle.png')
//                           }
//                           style={{height: 15, width: 15}}
//                         />
//                       </View>
//                       <View
//                         style={{
//                           flex: 0.7,
//                           alignItems: 'flex-start',
//                           justifyContent: 'center',
//                         }}>
//                         <Text
//                           style={[
//                             styles.downloadText,
//                             {
//                               color:
//                                 amountPayable === 0 && index !== 2
//                                   ? 'grey'
//                                   : 'black',
//                             },
//                           ]}>
//                           {item.type}
//                         </Text>
//                       </View>
//                     </TouchableOpacity>
//                   </View>
//                 );
//               }}
//             />
//           </View>

//           {amountheading !== '' && (
//             <>
//               <Text style={{marginVertical: 10, fontSize: 18}}>
//                 Payable Amount
//               </Text>
//               <View
//                 style={{
//                   borderWidth: 1,
//                   borderRadius: 10,
//                   height: 50,
//                   justifyContent: 'center',
//                   paddingHorizontal: 10,
//                   borderColor: '#dedede',
//                   backgroundColor: '#dedede',
//                 }}>
//                 <TextInput
//                   value={amountPayable}
//                   editable={false}
//                   selectTextOnFocus={false}
//                   placeholder={JSON.stringify(amountPayable)}
//                   keyboardType="number-pad"
//                   onChangeText={value => onChangeText(value, 'amountText')}
//                   placeholderTextColor={'#fff'}
//                 />
//               </View>
//               {amountheading.text !== 0 && (
//                 <>
//                   <Text style={{marginVertical: 10}}>
//                     {amountheading?.text}
//                   </Text>
//                   <View
//                     style={{
//                       borderWidth: 1,
//                       borderRadius: 10,
//                       height: 50,
//                       justifyContent: 'center',
//                       paddingHorizontal: 10,
//                       borderColor: '#dedede',
//                     }}>
//                     <TextInput
//                       style={{color: 'black'}}
//                       ref={input => (this.additionalAmount = input)}
//                       name="Additional Amount"
//                       placeholder={amountheading?.placeholder}
//                       keyboardType="number-pad"
//                       value={additionalAmountText}
//                       onChangeText={value =>
//                         onChangeText(value, 'additionalAmountText')
//                       }
//                       placeholderTextColor={'#dedede'}
//                     />
//                   </View>
//                 </>
//               )}
//               {rechargeBoxError && (
//                 <Text style={{marginVertical: 10, color: 'red', fontSize: 14}}>
//                   {rechargeBoxError}
//                 </Text>
//               )}
//               <Button
//                 text={'Submit'}
//                 onPress={onSubmitButtonPress}
//                 disabled={Number(amountText) <= 0}
//                 height={50}
//               />
//             </>
//           )}
//         </View>
//       </KeyboardAvoidingView>
//     );
//   };

//   const viewBillAction = () => {
//     if (pdf) {
//       navigation.navigate('PDFView', {
//         url: pdf,
//         title: 'Statement',
//       });
//     } else {
//       Alert.alert(
//         'MB Club',
//         'No Bill Generated',
//         [
//           {
//             text: 'OK',
//             onPress: () => {},
//           },
//         ],
//         {cancelable: false},
//       );
//     }
//   };
//   return (
//     <>
//       <StatusBar
//         backgroundColor={'transparent'}
//         translucent={true}
//         barStyle="dark-content"
//       />
//       <View style={styles.container}>
//         <View
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'center',
//             alignItems: 'center',
//             width: '100%',
//           }}>
//           <Image
//             source={require('../../assets/images/clubdepalma.png')}
//             style={{height: 30, width: 30, borderRadius: 15}}
//           />
//           <Text
//             style={{
//               color: 'black',
//               fontSize: 20,
//               marginBottom: 5,
//               marginLeft: 5,
//             }}>
//             MB Club
//           </Text>
//         </View>

//         <Text style={styles.header}>Subscription</Text>

//         <View style={styles.card}>
//           <View style={{width: '55%', justifyContent: 'flex-start'}}>
//             <View>
//               <Text
//                 style={{
//                   fontSize: moderateScale(20),
//                   fontFamily: FONT_FAMILY.Cinzel,
//                   color: 'black',
//                 }}
//                 numberOfLines={2}>
//                 Make your payment
//               </Text>
//             </View>
//             <View>
//               <Button
//                 text={'Pay Now'}
//                 onPress={() => {
//                   setClosemodal(true);
//                   setClick('');
//                   setAmountheading('');
//                   onSelect('');
//                 }}
//                 height={40}
//                 width={width / 3}
//               />
//             </View>
//           </View>
//           <View style={{width: '40%', transform: [{scale: 0.8}]}}>
//             {/* <Recharge1 /> */}
//             <ViewStatement />
//           </View>
//         </View>

//         <View style={styles.transactionListHeaderStyle}>
//           <View>
//             <Text style={styles.transactionListHeaderText}>Member Details</Text>
//           </View>
//         </View>

//         <View
//           style={{
//             backgroundColor: 'white',
//             elevation: 5,
//             width: width - 40,
//             borderRadius: 10,
//             flex: 1,
//             marginBottom: 20,
//           }}>
//           <ScrollView showsVerticalScrollIndicator={false}>
//             <View
//               style={{
//                 paddingBottom: 15,
//                 justifyContent: 'center',
//                 paddingHorizontal: 20,
//                 paddingTop: 10,
//               }}>
//               <Text style={styles.headerStyle}>Name</Text>
//               <Text style={styles.textStyle}>
//                 {data?.DisplayName ? data?.DisplayName : 'N/A'}
//               </Text>
//             </View>

//             <View
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 paddingBottom: 15,
//                 paddingHorizontal: 20,
//               }}>
//               <View style={{width: width / 2}}>
//                 <Text style={styles.headerStyle}>Member ID</Text>
//                 <Text style={styles.textStyle}>
//                   {data?.MemberID ? data?.MemberID : 'N/A'}
//                 </Text>
//               </View>
//               <View style={{width: width / 2 - 30}}>
//                 <Text style={styles.headerStyle}>Status</Text>
//                 <Text style={styles.textStyle}>
//                   {data?.Status ? data?.Status : 'N/A'}
//                 </Text>
//               </View>
//             </View>

//             <View
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 paddingBottom: 15,
//                 paddingHorizontal: 20,
//               }}>
//               <View style={{width: width / 2}}>
//                 <Text style={styles.headerStyle}>Ref No.</Text>
//                 <Text style={styles.textStyle}>
//                   {data?.bill_no ? data?.bill_no : 'N/A'}
//                 </Text>
//               </View>

//               <View style={{width: width / 2 - 30}}>
//                 <Text style={styles.headerStyle}>Month/Year</Text>
//                 <Text style={styles.textStyle}>
//                   {data?.bill_month_year ? data?.bill_month_year : 'N/A'}
//                 </Text>
//               </View>
//             </View>

//             <View
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 paddingBottom: 15,
//                 paddingHorizontal: 20,
//               }}>
//               <View style={{width: width / 2}}>
//                 <Text style={styles.headerStyle}>Current Outstanding</Text>
//                 <Text style={styles.textStyle}>
//                   ₹{data?.bill_amount ? data?.bill_amount : '0.00'}
//                 </Text>
//               </View>
//               <View style={{width: width / 2 - 30}}>
//                 <Text style={styles.headerStyle}>C ID</Text>
//                 <Text style={styles.textStyle}>
//                   {data?.SC_ID ? data?.SC_ID : 'N/A'}
//                 </Text>
//               </View>
//             </View>

//             <View
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 paddingBottom: 15,
//                 paddingHorizontal: 20,
//               }}>
//               <View style={{width: width / 2}}>
//                 <Text style={styles.headerStyle}>Date of Birth</Text>
//                 <Text style={styles.textStyle}>
//                   {data?.DOB ? data?.DOB : 'N/A'}
//                 </Text>
//               </View>
//               <View style={{width: width / 2 - 30}}>
//                 <Text style={styles.headerStyle}>Mobile</Text>
//                 <Text style={styles.textStyle}>
//                   {data?.Phone ? data?.Phone : 'N/A'}
//                 </Text>
//               </View>
//             </View>

//             <View
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 paddingBottom: 15,
//                 paddingHorizontal: 20,
//               }}>
//               <View style={{width: width / 2}}>
//                 <Text style={styles.headerStyle}>Email</Text>
//                 <Text style={styles.textStyle}>
//                   {data?.Email ? data?.Email : 'N/A'}
//                 </Text>
//               </View>
//               <View style={{width: width / 2 - 30}}>
//                 <Text style={styles.headerStyle}>Category</Text>
//                 <Text style={styles.textStyle}>
//                   {data?.Catg_Name ? data?.Catg_Name : 'N/A'}
//                 </Text>
//               </View>
//             </View>

//             <View
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 paddingBottom: 15,
//                 paddingHorizontal: 20,
//               }}>
//               <View style={{width: width / 2}}>
//                 <Text style={styles.headerStyle}>Transaction ID</Text>
//                 <Text style={styles.textStyle}>
//                   {data?.txn_id ? data?.txn_id : 'N/A'}
//                 </Text>
//               </View>
//               <View style={{width: width / 2 - 30}}>
//                 <Button
//                   noMargin={1}
//                   text={'View Bill'}
//                   onPress={() => {
//                     viewBillAction();
//                   }}
//                   height={40}
//                   width={90}
//                 />
//               </View>
//             </View>
//           </ScrollView>
//         </View>
//       </View>

//       <Modal
//         animationType="slide"
//         visible={closeModal}
//         // presentationStyle="formSheet"
//         transparent={true}
//         onRequestClose={() => {
//           setClosemodal(false);
//           setClick(0);
//           onSelect(0);
//           setAdditionalAmountText('');
//         }}>
//         <View
//           style={{
//             backgroundColor: 'transparent',
//             flex: 1,
//             paddingTop: Platform.OS === 'ios' ? 100 : 20,
//           }}>
//           {renderContent()}
//         </View>
//       </Modal>

//       {loading && (
//         <View
//           style={{
//             backgroundColor: 'rgba(0, 0,0, 0.3)',
//             flex: 1,
//             position: 'absolute',
//             top: 0,
//             bottom: 0,
//             left: 0,
//             right: 0,
//           }}>
//           <View
//             style={{
//               backgroundColor: 'transparent',
//               flex: 1,
//               alignItems: 'center',
//               justifyContent: 'center',
//             }}>
//             <ActivityIndicator
//               size="large"
//               color={SECONDARY_COLOR}
//               animating={loading}
//             />
//           </View>
//         </View>
//       )}
//     </>
//   );
// };

// const {height, width} = Dimensions.get('window');

// const styles = StyleSheet.create({
//   container1: {
//     flex: 1,
//     padding: 24,
//     justifyContent: 'center',
//     backgroundColor: 'grey',
//   },
//   contentContainer1: {
//     flex: 1,
//     alignItems: 'center',
//   },

//   container: {
//     flex: 1,
//     backgroundColor: 'transparent',
//     alignItems: 'center',
//     marginTop: Platform.OS === 'ios' ? 60 : getStatusBarHeight() + 30,
//     paddingHorizontal: 20,
//   },
//   rowStyle: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 8,
//   },
//   elevatedView: {
//     paddingHorizontal: 10,
//     backgroundColor: 'white',
//     flexDirection: 'column',
//     paddingVertical: 10,
//     marginHorizontal: 20,
//     marginBottom: 10,
//     marginTop: 6,
//     borderRadius: 10,
//     height: 220,
//     width: Dimensions.get('window').width - 20,
//     paddingHorizontal: 20,
//   },
//   titleText: {
//     color: PINK_COLOR,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   titleValue: {
//     // color: '#FE8371',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   dataNotFoundText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   header: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 15,
//     color: 'black',
//   },
//   card: {
//     backgroundColor: '#F5FFE9',
//     height: height / 4,
//     width: width - 40,
//     marginTop: 30,
//     borderRadius: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     alignItems: 'center',
//   },
//   transactionListHeaderStyle: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: width - 40,
//     paddingVertical: 20,
//   },
//   transactionListHeaderText: {
//     color: 'black',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   cardView: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//   },
//   indexView: {
//     height: 50,
//     width: 50,
//     borderRadius: 10,
//     backgroundColor: '#79CA14',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   indexText: {
//     color: 'white',
//     fontSize: moderateScale(18),
//     fontWeight: 'bold',
//   },
//   locationName: {
//     fontSize: moderateScale(16),
//     fontWeight: 'bold',
//     paddingHorizontal: 10,
//   },
//   amountText: {
//     paddingHorizontal: 10,
//   },
//   headerStyle: {
//     color: '#5D5D5D',
//     fontSize: moderateScale(12),
//     paddingBottom: 5,
//   },
//   textStyle: {
//     color: 'black',
//     fontWeight: 'bold',
//     fontSize: moderateScale(14),
//     fontFamily: FONT_FAMILY.bold,
//   },
//   listRow: {
//     flexDirection: 'row',
//     marginBottom: 10,
//   },
// });

// export default ViewStatementComponent;
