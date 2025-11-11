import {
  Alert,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Modal,
  LayoutAnimation,
} from "react-native";
import RNModal from "react-native-modal";
import React, { useEffect, useMemo, useState } from "react";
import { useBooking } from "./BookingService";
import { useSelector } from "react-redux";
import Header from "../../components/Header";
import * as Animatable from 'react-native-animatable';
import { BlurView } from "@react-native-community/blur";
import {
  DARK_BLUE,
  LIGHT_BLUE,
  LIGHT_GREEN,
  LIGHT_GREY,
  LIGHT_RED,
  LIGHT_YELLOW,
  ORANGE,
  PRIMARY_COLOR,
  SECONDARY,
  SECONDARY_COLOR,
} from "../../util/colors";
import { ENDPOINT, FONT_FAMILY } from "../../util/constant";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialIcons";
import UniversalModal from "../../components/UniversalModal";
import SvgUri from "react-native-svg-uri";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";
import CancelButton from "../../components/CancelButton";
import { javascriptGet } from "../../util/api";
import { stat } from "react-native-fs";
import { Dropdown } from "react-native-element-dropdown";
import { ModalStyles } from "../../Styles/ModalStyles";
const tabs = [
  { title: "All", status: "" },
  { title: "Upcoming", status: "Active" },
  { title: "Past", status: "Completed" },
  { title: "Cancelled", status: "Cancelled" },
  { title: "Pending", status: "Pending" },
  { title: "Failed", status: "Failed" },
];
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const MyBookings = ({ navigation, route }) => {
  const userData = useSelector((state) => state.auth.userData);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState(route.params?.type || "");
  console.log('\x1b[36m%s\x1b[0m', route.params.id, '---------------------- route.params ---------------------');
  const [page, setPage] = useState(1);
  const [bookingData, setBookingData] = useState([]);
 
  const { bookingQuery, facilityQuery } = useBooking(
    page,
    search,
    status,
    type,
    userData
  );
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const calculateDeduction = () =>
    selectedBooking.slots.reduce(
      (acc, slot) => acc + Number(slot.cancellation_deducation || "0"),
      0
    );

  useEffect(() => {
    const incomingData = bookingQuery?.data?.data?.data;
    
    if (!incomingData) return;
    if(route?.params?.id && page==1){
      console.log('\x1b[33m%s\x1b[0m', route?.params?.id, '---------------------- incomingData ---------------------');
  
          setSelectedBooking(incomingData.find(item => item.id === route.params.id))
   setIsModalVisible(true);
        }

    setBookingData((prev) => {
      if (page === 1) return incomingData;
     

      const newItems = incomingData.filter(
        (item) => !prev.some((old) => old.id === item.id)
      );

      return [...prev, ...newItems];
    });
  
    
  }, [bookingQuery?.data?.data, page]);

  const handleCancelBooking = async (item) => {
    const bookingId = item?.slot_id;
    const requestObject = {
      path: ENDPOINT.get_cancellation_amount + bookingId,
      body: {},
      Token: userData?.data?.token,
    };
    console.log("Cancel Booking Request", requestObject);
    const response = await javascriptGet(requestObject);
    console.log("Cancel Booking Response", response);
    if (response?.status) {
      setIsModalVisible(false);
      navigation.navigate("BookingCancelled", {
        amounts: response.cancelationAmount,
        activity: item,
        bookingQuery,
      });
    } else {
      Alert.alert("Failed", response?.message);
    }
  };
  const emptyList = () => (
    <FlatList
      data={[...Array(6).keys()]}
      renderItem={() => (
        <View
          style={[
            {
              borderRadius: 20,
              margin: 5,
              marginHorizontal: 10,
              backgroundColor: "white",
              padding: 10,
            },
          ]}
        >
          <View style={{ flex: 1, alignItems: "center", flexDirection: "row" }}>
            <ShimmerPlaceholder style={styles.imgStyle} />
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <ShimmerPlaceholder
                shimmerStyle={{ borderRadius: 20 }}
                style={{ margin: 5 }}
              />
              <ShimmerPlaceholder
                shimmerStyle={{ borderRadius: 20 }}
                style={{ margin: 5 }}
              />
              <ShimmerPlaceholder
                shimmerStyle={{ borderRadius: 20 }}
                style={{ margin: 5 }}
              />
            </View>
          </View>
        </View>
      )}
    />
  );

  const renderBookings = ({ item, index }) => {
    return (
      <Animatable.View
        style={{
          margin: 5,
          borderRadius: 10,
          marginHorizontal: 10,
          overflow: "hidden",
        }}
        animation='fadeInUp'
        duration={500 + index * 50}
      >
        <BlurView
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          blurType="xlight"
          blurAmount={15}
          reducedTransparencyFallbackColor="white"
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setSelectedBooking(item);
            setIsModalVisible(true);
          }}
          style={{
            padding: 5,

            //  elevation:0.2,
            //  opacity:9
          }}
        >
          <View
            style={[
              {
                padding: 5,
                flexDirection: "row",
              },
            ]}
          >
            <View style={{ justifyContent: "center" }}>
              <Image
                height={40}
                width={40}
                source={{
                  uri: `https://dynamixclubedepalma.co.in/clubdepalma${item?.facility_image}`,
                }}
                style={{ alignItems: "center", marginRight: 20 }}
              />
            </View>

            <View style={{ flex: 1 }}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardTitle}>{item?.facility_name}</Text>
                <Icon
                  name="chevron-right"
                  size={20}
                  color={"black"}
                  style={{ marginLeft: "auto" }}
                />
              </View>
              <View style={styles.rowBetween}>
                <Text style={styles.cardContent}>Booking Number: </Text>
                <Text style={styles.cardContent}>{item?.booking_number}</Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 5,
                  }}
                >
                  <Icon
                    name="calendar-month"
                    size={20}
                    // color={SECONDARY_COLOR}
                    color={"black"}
                    style={{ marginRight: 5 }}
                  />
                  <Text style={styles.cardContent}>
                    Booked{" "}
                    {moment(item?.booking_date).format("Do MMM [on] h:mm A")}
                  </Text>
                </View>
                <View style={[styles.rowBetween, { marginTop: 5 }]}>
                  <Text
                    style={[
                      styles.cardContent,
                      {
                        backgroundColor:
                          item?.status === "Pending" 
                            ? LIGHT_RED
                            : item?.status === "Completed"
                            ? LIGHT_YELLOW
                            : item?.status === "Failed"
                            ? "#e0e0e0"
                            : item?.status === "Cancelled"
                            ? LIGHT_RED
                            : LIGHT_GREEN,
                        color:
                          item?.status === "Pending"
                            ? "red"
                            : item?.status === "Completed"
                            ? ORANGE
                            : item?.status === "Failed"
                            ? "black"
                            : item?.status === "Cancelled"
                            ? "red"
                            : SECONDARY_COLOR,
                        padding: 5,
                        borderRadius: 5,
                        fontFamily: FONT_FAMILY.bold,
                      },
                    ]}
                  >
                    {item?.status}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  };
 return (
    <View style={styles.container}>
      <Header title={"My Bookings"} />
      <Dropdown
        style={[styles.dropdown]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        containerStyle={{
          backgroundColor: "white",
          // 'rgb(11, 96, 161)',
          borderRadius: 10,
          marginTop: 10,
        }}
        autoScroll={false}
        itemTextStyle={styles.itemContainerStyle}
        iconStyle={styles.iconStyle}
        data={[
          { id: "", name: "All Activity" }, // default item at the top
          ...(facilityQuery?.data?.data || []),
        ]}
        maxHeight={300}
        labelField="name"
        valueField="id"
        placeholder={"Select Activity"}
        value={type ?? 0}
        onChange={(item) => {
          setType(item.id);
          setBookingData([]), setPage(1);
        }}
      />
      <View>
        <FlatList
          data={tabs}
          horizontal
          style={{ paddingBottom: 10 }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item ,index}) => (
            <Animatable.View
              animation="fadeInRight"
              duration={1000 * index }
            >

           
            <TouchableOpacity
              onPress={() => {
                setPage(1), setStatus(item.status);
              }}
              activeOpacity={0.8}
              style={{
                backgroundColor:
                  item.status == status ? "rgb(11, 96, 161)" : "white",
                margin: 5,
                borderRadius: 5,
                minWidth: 100,
              }}
            >
              <Text
                style={{
                  margin: 10, // horizontal padding only
                  color: item.status == status ? "white" : PRIMARY_COLOR,
                  textAlign: "center",
                  fontFamily:
                    item.status == status
                      ? FONT_FAMILY.bold
                      : FONT_FAMILY.normal,
                }}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
            </Animatable.View>
          )}
        />
      </View>

      <FlatList
        data={bookingData}
        keyExtractor={(item, index) =>
          item?.booking_id?.toString() ?? `booking-${index}`
        }
        showsVerticalScrollIndicator={false}
        renderItem={renderBookings}
        ListEmptyComponent={
          bookingQuery.isLoading ? (
            emptyList()
          ) : (
            <View
              style={{
                flex: 1,
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                style={InvoiceStyles.alertImage}
                source={require("../../assets/images/norecord.png")}
              />
              <Text style={InvoiceStyles.noRecord}>No bookings found.</Text>
            </View>
          )
        }
        onEndReached={() => {
          const lastPage = bookingQuery?.data?.data?.last_page;

          if (lastPage && page < lastPage) {
            setPage((prev) => prev + 1);
          }
        }}
        onEndReachedThreshold={0.5}
        // onRefresh={onRefresh}
        refreshing={bookingQuery?.isRefetching}
        contentContainerStyle={{
          backgroundColor: "#EEEEEE",
          flexGrow: 1,
        }}
        ListFooterComponent={
          bookingQuery?.isFetchingNextPage ? <Text>Loading more...</Text> : null
        }
      />

      {isModalVisible && (
        <RNModal
          presentationStyle="pageSheet"
          animationType="slide"
          visible={isModalVisible}
          onBackdropPress={() => setIsModalVisible(false)}
          onBackButtonPress={() => setIsModalVisible(false)}
          onDismiss={() => setIsModalVisible(false)}
          onSwipeComplete={() => setIsModalVisible(false)}
          style={{
            justifyContent: "flex-start",
            padding: 10,
            paddingTop: 20,
            margin: 0,
            backgroundColor: "white",
            borderTopEndRadius: 20,
            borderTopStartRadius: 20,
          }}
        >
          <View style={[ModalStyles.headingContainer, {}]}>
            <Text style={ModalStyles.headingText}>Booking Details</Text>
            <Pressable onPress={() => setIsModalVisible(false)}>
              <Icon name="close" size={25} style={ModalStyles.cancelText} />
            </Pressable>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 10 }}
          >
            <View
              style={{
                backgroundColor: LIGHT_BLUE,
                padding: 10,
                borderRadius: 5,
              }}
            >
              <Text style={styles.cardTitle}>
                {selectedBooking?.facility_name}
              </Text>
              <View
                style={[styles.rowBetween, { backgroundColor: LIGHT_BLUE }]}
              >
                <Text style={styles.cardContent}>Booking Number: </Text>
                <Text style={styles.cardContent}>
                  {selectedBooking?.booking_number}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 5,
                  backgroundColor: LIGHT_BLUE,
                }}
              >
                <Text style={styles.cardContent}>
                  Booked on{" "}
                  {moment(selectedBooking?.booking_date).format(
                    "Do MMM [at] h:mm A"
                  )}
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 10 }}>
              <Text
                style={[
                  styles.cardContent,
                  { fontFamily: FONT_FAMILY.semiBold },
                ]}
              >
                Activity Details:
              </Text>
              {selectedBooking?.slots?.map((slot, index) => (
                <View
                  key={index}
                  style={{
                    marginTop: 5,
                    backgroundColor: "white",
                    padding: 10,
                    marginBottom: 10,
                    borderBottomWidth: 1,
                    borderBottomColor:'black'
                  }}
                >
                  <View style={styles.rowBetween}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Icon
                        name="schedule"
                        size={20}
                        color={"black"}
                        style={{ marginRight: 5 }}
                      />
                      <Text style={styles.cardContent}>
                        {moment(slot.slot_date).format("Do MMM ")}
                      </Text>
                      <Text style={[styles.cardContent, { color: "grey" }]}>
                       {`${moment(slot.name, "HHmm").format(
                                         "hh:mm A"
                                       )} to ${moment(slot.name.slice(5, 8), "HHmm").format(
                                         "hh:mm A"
                                       )}`}{" "}
                      </Text>
                    </View>
                    <Text style={styles.cardContent}>
                      ₹{Number(selectedBooking?.facility_amount).toFixed(2)}
                    </Text>
                  </View>
                  {slot?.guests?.length > 0 && (
                    <View style={{ marginTop: 5 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={[
                            styles.cardContent,
                            { fontFamily: FONT_FAMILY.semiBold, color: "grey" },
                          ]}
                        >
                          Players:
                        </Text>
                        {slot?.status == "Active" ? (
                          moment(slot?.slot_date, "YYYY-MM-DD")
                            .isAfter(moment()) && (
                            <CancelButton
                              text={"Cancel"}
                              onPress={() => handleCancelBooking(slot)}
                              loading={false}
                            />
                          )
                        ) : (
                          <Text style={{ color: "red" }}>{slot?.status}</Text>
                        )}
                      </View>
                     {slot?.status=='Cancelled' && <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={[
                            styles.cardContent,
                            { fontFamily: FONT_FAMILY.semiBold, color: "black" },
                          ]}
                        >
                          Cancellation date:
                        </Text>
                        <Text
                          style={[
                            styles.cardContent,
                            { fontFamily: FONT_FAMILY.semiBold, color: "black" },
                          ]}
                        >
                         {moment(slot?.cancellation_date).format("Do MMM [at] h:mm A")}
                        </Text>
                        </View>}
                      {slot.guests.map((guest, guestIndex) => (
                        <View key={guestIndex} style={styles.rowBetween}>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginTop: 5,
                            }}
                          >
                            <Icon
                              name={
                                guest.occupant_id == 2
                                  ? "person"
                                  : "card-membership"
                              }
                              size={20}
                              color={"black"}
                              style={{ marginRight: 5 }}
                            />
                            <Text style={styles.cardContent}>
                              {guest.player_name}
                            </Text>
                            <Text
                              style={[styles.cardContent, { color: "grey" }]}
                            >
                              {"  "}(
                              {guest.occupant_id == 2 ? "Guest" : "Member"})
                            </Text>
                          </View>
                          <Text style={styles.cardContent}>
                            ₹
                            {guest.occupant_id == 2
                              ? Number(guest.occupant_charge).toFixed(2)
                              : "0.00"}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
              <View
                style={[
                  styles.rowBetween,
                  { marginTop: 5, paddingHorizontal: 10 },
                ]}
              >
                <Text style={[styles.cardContent, { color: "grey" }]}>
                  Sub Total:
                </Text>
                <Text style={styles.cardContent}>
                  ₹
                  {Number(selectedBooking?.facility_amount *
                    selectedBooking?.slots?.length +
                    Number(selectedBooking?.guest_total_amount)).toFixed(2)}
                </Text>
              </View>
              <View
                style={[
                  styles.rowBetween,
                  {
                    marginTop: 5,
                    borderBottomWidth: 1,
                    paddingBottom: 10,
                    paddingHorizontal: 10,
                    borderBottomColor:'black'
                  },
                ]}
              >
                <Text style={[styles.cardContent, { color: "grey" }]}>
                  GST ({selectedBooking?.facility_gst_per}%):
                </Text>
                <Text style={styles.cardContent}>
                  ₹{Number(selectedBooking.facility_gst_amt).toFixed(2)}
                </Text>
              </View>
              {calculateDeduction() > 0 && (
                <View
                  style={[
                    styles.rowBetween,
                    { marginTop: 5, paddingHorizontal: 10 },
                  ]}
                >
                  <Text style={[styles.cardContent, { color: "grey" }]}>
                    Cancellation charges:
                  </Text>
                  <Text style={[styles.cardContent, { color: "red" }]}>
                    ₹{calculateDeduction().toFixed(2)}
                  </Text>
                </View>
              )}
             
              <View
                style={[
                  styles.rowBetween,
                  {
                    marginVertical: 10,
                    marginBottom: 40,
                    padding: 10,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.cardContent,
                    {
                      color: "black",
                      fontFamily: FONT_FAMILY.bold,
                      fontSize: 14,
                    },
                  ]}
                >
                  Total amount:
                </Text>
                <Text
                  style={[
                    styles.cardContent,
                    {
                      fontFamily: FONT_FAMILY.bold,
                      fontSize: 18,
                      color: SECONDARY_COLOR,
                    },
                  ]}
                >
                  ₹
                  {Number(
                    selectedBooking.facility_total - calculateDeduction() || 0
                  ).toFixed(2)}
                </Text>
              </View>
            </View>
          </ScrollView>
        </RNModal>
      )}
    </View>
  );
};

export default MyBookings;

const styles = StyleSheet.create({
  iconStyle: {
    color: "black",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  tab: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
  },
  container: {
    flex: 1,
    backgroundColor: "#EEEEEE",
  },
  title: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.bold,
    color: DARK_BLUE,
  },
  card: {
    // padding: 10,
    margin: 10,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  selectedTextStyle: {
    color: "black",
    fontFamily: FONT_FAMILY.normal,
  },
  dropdown: {
    margin: 10,
    backgroundColor: LIGHT_BLUE,
    borderWidth: 1,
    borderColor: "rgb(11, 96, 161)",
    padding: 10,
    borderRadius: 10,
  },
  itemContainerStyle: {
    color: "black",
    fontFamily: FONT_FAMILY.normal,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.bold,
    color: DARK_BLUE,
    marginBottom: 5,
  },
  placeholderStyle: {
    color: "grey",
    fontFamily: FONT_FAMILY.normal,
  },
  cardContent: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.normal,
    color: "black",
  },
  cardDate: {
    fontSize: 12,
    color: "#888",
  },
  cardTime: {
    fontSize: 12,
    color: "#888",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  activeTab: {
    backgroundColor: DARK_BLUE,
  },
  activeText: {
    color: "#fff",
    fontFamily: FONT_FAMILY.bold,
  },
  inactiveText: {
    color: "#000",
    fontFamily: FONT_FAMILY.light,
    fontSize: 12,
  },
  mainView: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 20,
  },
  imgStyle: {
    height: "auto",
    width: "20%",
    resizeMode: "cover",
    minHeight: 80,
    borderRadius: 10,
    marginRight: 10,
  },
});
