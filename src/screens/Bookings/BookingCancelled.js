import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Header from "../../components/Header";
import Icon from "react-native-vector-icons/MaterialIcons";
import { ENDPOINT, FONT_FAMILY } from "../../util/constant";
import { DARK_BLUE } from "../../util/colors";
import CancelButton from "../../components/CancelButton";
import { javascriptPost } from "../../util/api";
import { Toast } from "react-native-toast-notifications";
import { useSelector } from "react-redux";

const BookingCancelled = ({ route, navigation }) => {
  const { amounts, activity } = route.params;

  const [loading, setLoading] = useState(false);
  const userData = useSelector((state) => state.auth.userData);
 
  const calculateDeduction = () => {
    const guestCharge = activity?.guests.reduce((acc, guest) => {
      if (guest?.occupant_id == 2) {
        return acc + Number(guest?.occupant_charge);
      }
      return acc;
    }, 0);
    const facilityCharge = Number(amounts?.facility_amount);

    return (
      (facilityCharge/
        100) *
      amounts?.deduction+guestCharge
    );
  };

  const cancelBooking = async () => {


    setLoading(true);

     const guestCharge = activity?.guests.reduce((acc, guest) => {
      if (guest?.occupant_id == 2) {
        return acc + Number(guest?.occupant_charge);
      }
      return acc;
    }, 0);
    const facilityCharge = Number(amounts?.facility_amount);
    const cancellationAmt=(facilityCharge )/100* amounts?.deduction+guestCharge
      const gst =
      (  cancellationAmt) * (amounts?.facility_gst_per / 100);
    
    // Call the API to cancel the booking
    const apiObject = {
      path: ENDPOINT.cancel_booking,
      body: {
        booking_id: activity?.slot_id,
        cancellation_per: Number(amounts?.deduction),
        cancellation_GST: Number(amounts?.GST),
        cancellation_amt: cancellationAmt,
        cancellation_GST_amt:gst,
        cancellation_deducation:cancellationAmt+gst
      },
      Token: userData?.data?.token,
    };
 
    const response = await javascriptPost(apiObject);
    if (response?.status) {

      Toast.show(response?.message, {
        type: "success",
      });
      navigation.goBack();
      route.params.bookingQuery.refetch();

    }
    setLoading(false);
  };
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Header title={"Cancel Booking"} />
      <ScrollView>
        <View style={{ padding: 10 }}>
          {activity?.guests.map((guest, index) => (
            <View
              key={index}
              style={{
                marginTop: 5,
                backgroundColor: "white",
                padding: 10,
                marginBottom: 10,
                borderBottomWidth: 0.2,
              }}
            >
              <View style={styles.rowBetween}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon
                    name={guest.occupant_id == 2 ? "person" : "card-membership"}
                    size={20}
                    color={"black"}
                    style={{ marginRight: 5 }}
                  />
                  <Text style={styles.cardContent}>{guest.player_name}</Text>
                  <Text style={[styles.cardContent, { color: "grey" }]}>
                    {"  "}({guest.occupant_id == 2 ? "Guest" : "Member"})
                  </Text>
                </View>
                <Text style={styles.cardContent}>
                  ₹
                  {guest.occupant_id == 2
                    ? Number(guest.occupant_charge).toFixed(2)
                    : 0.0}
                </Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.card}>
          <Text
            style={[styles.cardContent, { fontFamily: FONT_FAMILY.semiBold }]}
          >
            Refund Details
          </Text>

          <View style={[styles.rowBetween, { marginVertical: 10 }]}>
            <Text
              style={[styles.cardContent, { fontFamily: FONT_FAMILY.semiBold }]}
            >
              Activity Amount :
            </Text>
            <Text
              style={[styles.cardContent, { fontFamily: FONT_FAMILY.semiBold }]}
            >
              ₹{Number(amounts.facility_amount)?.toFixed(2)}
            </Text>
          </View>
         
         
          <View style={[styles.rowBetween, { marginTop: 5 }]}>
            <Text style={[styles.cardContent]}>
              Basic for Cancellation({amounts?.deduction}%) :
            </Text>
            <Text style={styles.cardContent}>
              ₹{activity && calculateDeduction().toFixed(2)}
            </Text>
          </View>
          <View style={[styles.rowBetween, {}]}>
            <Text style={[styles.cardContent]}>GST on Cancellation({amounts?.GST}%) :</Text>
            <Text style={styles.cardContent}>
              ₹
              {activity &&
                (
                  (calculateDeduction() / 100) *
                  amounts?.GST
                ).toFixed(2)}
            </Text>
          </View>
          <View style={[styles.rowBetween, { marginVertical: 20 }]}>
            <Text
              style={[styles.cardContent, { fontFamily: FONT_FAMILY.semiBold }]}
            >
              Cancellation charges :
            </Text>
            <Text
              style={[styles.cardContent, { fontFamily: FONT_FAMILY.bold,color:'red' }]}
            >
              ₹{((calculateDeduction() / 100) *
                  amounts?.GST+calculateDeduction()).toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={{ margin: 20 }}>
          <CancelButton
            text={"Proceed"}
            onPress={cancelBooking}
            loading={loading}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default BookingCancelled;

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.bold,
    color: DARK_BLUE,
  },
  card: {
    padding: 10,
    margin: 10,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.bold,
    color: DARK_BLUE,
    marginBottom: 5,
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
  },
});