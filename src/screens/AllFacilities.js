import {
  FlatList,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import * as api from "../util/api";
import { ENDPOINT, FONT_FAMILY } from "../util/constant";
import SvgUri from "react-native-svg-uri";
import { Toast } from "react-native-toast-notifications";
import { Card } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { usePlayers, usePlayersQuery } from "./FacilityService";
import { useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icons from "react-native-vector-icons/AntDesign";
import CancelButton from "../components/CancelButton";
import { DARK_BLUE, LIGHT_BLUE, LIGHT_RED } from "../util/colors";
import NewButton from "../components/Button";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const AllFacilities = ({ navigation }) => {
  const [options, setOptions] = useState([]);
  const userData = useSelector((state) => state.auth.userData);
  const [players, setPlayers] = useState([]);
  const fetchFacilities = async () => {
    try {
      const summeryObject = { path: ENDPOINT.get_facility, body: {} };
      const response = await api.javascriptGet(summeryObject);

      if (response.status) {
        setOptions(response.data.filter(item => item.status == 'Active'));
      }else {
        Toast.hideAll();
        Toast.show(response.message, {
          type: "danger",
        });
        setOptions(false)
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchFacilities();
  }, []);
  const editPlayers = async (item, action) => {
    const apiRequestObject = {
      body: {
        type: action,
        id: item.id,
      },
      path: ENDPOINT.editPlayer,
    };
    const response = await api.javascriptPost(apiRequestObject);
    console.log(
      "\x1b[36m%s\x1b[0m",
      response,
      "---------------------- response ---------------------"
    );
    if (response.status) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
     
      if (action === "Like") {
        const updatedPlayers = players.map((player) => {
            console.log('\x1b[36m%s\x1b[0m', item,player, '---------------------- item ---------------------');

          if (player.id === item.id) {
            return { ...player, is_favorite: item.is_favorite =='0'?'1':'0'  }; 
          }
          return player;
        });
        console.log('\x1b[32m%s\x1b[0m', updatedPlayers, '---------------------- updatedPlayers ---------------------');
        setPlayers(updatedPlayers);
      } else if (action === "Delete") {
        const updatedPlayers = players.filter((player) => player.id !== item.id);
        setPlayers(updatedPlayers);
      }
    }
  };
  const { playersQuery } = usePlayersQuery(userData);

   const emptyActivity = () => (
      <FlatList
      data={[...Array(4).keys()]}
      numColumns={2}
      style={styles.listView}
        renderItem={() => (
        
              <View style={{ flex: 1,alignItems: "center" ,}}>
              <View style={{ margin: 10, alignItems: "center" ,minHeight: 100}}>
                <ShimmerPlaceholder shimmerStyle={{borderRadius:10,minHeight: 100,}} width={150} style={{ margin:5 }} />
        
              </View>
              </View>
             
          
        )}
      />
    );
   const emptyList = () => (
      <FlatList
      data={[...Array(5).keys()]}
        renderItem={() => (
          <View
            style={[styles.mainView, { marginHorizontal: 10, borderRadius: 20 }]}
          >
            <View style={{ flex: 1, alignItems: "center", flexDirection: "row" }}>
              {/* <ShimmerPlaceholder style={styles.imgStyle} /> */}
              <View style={{ flex: 1, alignItems: "flex-start", marginLeft: 10 }}>
                <ShimmerPlaceholder shimmerStyle={{borderRadius:10}} style={{ margin: 5 }} />
                <ShimmerPlaceholder  shimmerStyle={{borderRadius:10}} style={{ margin: 5 }} />
                {/* <ShimmerPlaceholder style={{ margin: 5 }} /> */}
              </View>
                <View
                  style={{
                    // flexDirection: "row",
                    // justifyContent: "space-around",
                  }}
                >
                  <ShimmerPlaceholder shimmerStyle={{borderRadius:10}} width={70} style={{ margin: 5 }} />
                  <ShimmerPlaceholder shimmerStyle={{borderRadius:10}} width={70} style={{ margin: 5 }} />
                </View>
            </View>
          </View>
        )}
      />
    );
  useEffect(() => {
    if (playersQuery.isSuccess) {
      Toast.hideAll();
      if (playersQuery.data.status) {
        setPlayers(playersQuery.data.data);
      } else {
        Toast.show(playersQuery.data.message, {
          type: "danger",
        });
      }
    }
    if (playersQuery.isError) {
      Toast.hideAll();
      Toast.show(playersQuery.error.message, {
        type: "danger",
      });
    }
  }, [playersQuery.isSuccess, playersQuery.isError, playersQuery.error]);
  const handleFacility = (item) => {
    if (item.is_available_slots) {
      navigation.navigate("Facility", { facility: item });
    } else {
      Toast.hideAll();
      Toast.show(`No slots avaiable for ${item.name}`, {
        type: "warning",
      });
    }
  };
  const renderFacilities = ({ item }) => {
    console.log('\x1b[36m%s\x1b[0m', item, '---------------------- item ---------------------');
    return (
      <TouchableOpacity
        onPress={() => handleFacility(item)}
        activeOpacity={0.8}
        style={[
          {
            
            flex: 1,
            // borderWidth:1,
            borderColor: "rgba(105, 125, 240, 0.1)",
            backgroundColor: "white",
            elevation: 1,
            borderRadius: 10,
            marginVertical: 20,
            minHeight: 100,
            marginHorizontal: 20,
            padding: 15,
          },
        ]}
      >
            {/* <View style={{ marginTop: 10 }}> */}
          <Text
            style={{
              fontFamily: FONT_FAMILY.semiBold,
              color: "grey",
              fontSize: 20,
              color: "rgb(105, 125, 240)",
                maxWidth: "90%",
            }}
          >
            {item.name}
          </Text>
          <Text
            style={{
              fontFamily: FONT_FAMILY.normal,
              color: "grey",
              fontSize: 12,
              color: "grey",
              maxWidth: "90%",
            }}
          >
            {item.short_description}
          </Text>
     
          <View style={{position: "absolute", bottom: 0, right: 0,}}>
        <SvgUri
          height={50}
          width={50}
          style={{ alignSelf: "center",}}
          source={{
            uri: `https://booking.panchshilaclub.org${item?.first_image}`,
          }}
          />
          </View>
    
      </TouchableOpacity>
    );
  };
  const renderPlayers = ({ item, index }) => {
    return (
      <View
        style={{
          flex: 1,
          margin: 10,
          backgroundColor: index % 2 == 0 ? "white" : LIGHT_BLUE,
          padding: 5,
          borderRadius: 10,
          elevation: 0.4,
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <View style={{}}>
          <Text
            style={{
              flex: 1,
              fontFamily: FONT_FAMILY.bold,
              color: "rgb(105, 125, 240)",
              fontSize: 15,
              // backgroundColor: "rgba(105, 125, 240, 0.1)",
              padding: 5,
              borderRadius: 5,
              alignSelf: "flex-start",
            }}
          >
            {item.name}{" "}
            <Text
              style={{
                fontFamily: FONT_FAMILY.normal,
                color: "black",
                // fontSize: 15,

                marginTop: 5,
              }}
            >
              {item.occupant_id == 1 ? item.player_memberId : "Non-member"}
            </Text>
          </Text>
          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}
          >
            <Icon
              name={"email"}
              size={20}
              color={"black"}
              style={{ alignSelf: "flex-end", marginRight: 5 }}
            />
            <Text
              style={{
                fontFamily: FONT_FAMILY.normal,
                color: "grey",
                fontSize: 15,
              }}
            >
              {item.email}
            </Text>
          </View>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={() => editPlayers(item, "Like")}>
            <Icons
              name={
                item.is_favorite == 1 ? "star" : "staro"
              }
              size={20}
              color={item.is_favorite == 1 ? "orange" : "grey"}
              style={{ alignSelf: "flex-end", marginTop: 5 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: LIGHT_RED,
              padding: 5,
              borderRadius: 5,
            }}
            onPress={() => editPlayers(item, "Delete")}
          >
            <Text
              style={{
                fontFamily: FONT_FAMILY.normal,
                color: "red",
                fontSize: 10,
              }}
            >
              Remove
            </Text>
            {/* <Icon name="delete-empty" size={20} color="red" /> */}
          </TouchableOpacity>

          {/* <CancelButton text={'Remove'}/> */}
        </View>
      </View>
    );
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <Header title={"All Facilities"} />
      <ScrollView
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
      >
        <FlatList
          style={styles.listView}
          scrollEnabled={true}
          data={options ||[]}
          numColumns={2}
          keyExtractor={(item, index) => index}
          renderItem={renderFacilities}
           ListEmptyComponent={
                    options ? emptyActivity() : (
                      <View style={{ alignItems: "center", marginTop: 20 }}>
                        <Text style={{ fontSize: 16, color: "grey" }}>No Active Activity.</Text>
                      </View>
                    )
                  }
        />
        <View>
          <View
            style={{
              flexDirection: "row",
              padding: 10,
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: LIGHT_BLUE,
              paddingHorizontal: 20,
              elevation: 0.4,
            }}
          >
            <Text style={styles.transactionListHeaderText}>Players</Text>
            <View style={{}}>
              <NewButton text={"+ Add"} />
            </View>
          </View>
        </View>

        <FlatList
          scrollEnabled={false}
          data={ players|| []}
          // numColumns={2}
          keyExtractor={(item, index) => index}
          renderItem={renderPlayers}
           ListEmptyComponent={
                    playersQuery.isLoading ? emptyList() : (
                      <View style={{ alignItems: "center", marginTop: 20 }}>
                        <Text style={{ fontSize: 16, color: "grey" }}>No Players found.</Text>
                      </View>
                    )
                  }
        />
      </ScrollView>
    </View>
  );
};

export default AllFacilities;

const styles = StyleSheet.create({
  listView: {
    // backgroundColor:'rgba(105, 125, 240, 0.1)',
    flex: 1,
    // paddingVertical: 10,
  },
  transactionListHeaderText: {
    flex: 1,
    fontSize: 18,
    fontFamily: FONT_FAMILY.bold,
    color: "black",
  },
  mainView: {
    flex: 1,
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
  },
});
