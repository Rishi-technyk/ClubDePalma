import React, { useState, useEffect, useRef } from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import LoginTextInput from "../../components/LoginTextInput";
import { PRIMARY_BUTTON_BLUE } from "../../util/colors";
import { FONT_FAMILY } from "../../util/constant";
import _ from "lodash";
import { forgotPassword } from "./ForgotPasswordService.js";
import Svg, { Path, Rect } from "react-native-svg";
import { Loginstyles } from "../../Styles/LoginStyles.js";
import Button2 from "../../components/Button2.js";
import { Toast } from "react-native-toast-notifications";
const InputType = {
  username: "username",
  password: "password",
};

const ForgotPasswordScreen = ({ navigation }) => {
  const [usernameTextValue, setUsernameTextValue] = useState("");
  const [loadingData, setLoadingData] = useState(false);
  const keyboardMargin = useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get("window");

  const forgotPasswordHandler = async () => {
    // navigation.navigate('VerifyForgotPassOTPScreen', { memberID: usernameTextValue })
    const trimmedUsername = usernameTextValue.replace(/ /g, "");

    if (trimmedUsername.length === 0) {
      Toast.show("Forgot Password", "Please enter valid Member ID", {
        type: "warning",
      });
      return;
    }

    try {
      setLoadingData(true);
      const response = await forgotPassword(usernameTextValue);

      if (response.status) {
        Toast.show(response.message, {
          type: "success",
        });
        navigation.navigate("VerifyForgotPassOTPScreen", {
          memberID: usernameTextValue,
        });
      } else {
        Toast.show("Failed to send OTP", {
          type: "warning",
        });
        navigation.navigate("LoginScreen");
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      Toast.show("An unexpected error occurred", { type: "danger" });
    } finally {
      setLoadingData(false);
    }
  };

  const onChangeText = (text, type) => {
    setUsernameTextValue(text);
  };

  const renderNameField = () => {
    return (
      <LoginTextInput
        maxLength={10}
        keyboardType="email-address"
        placeholder="Enter your Member ID (001A)"
        canManageTextVisibility
        secureTextEntry={false}
        textValue={usernameTextValue}
        onChangeText={(value) => onChangeText(value, InputType.username)}
      />
    );
  };

  return (
    <View style={Loginstyles.container}>
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "absolute", flex: 1 }}
      >
        <Path
          d={`M 0 ${height * 0.45}
                                        C ${width * 0.5} ${height * 0.5}, 
                                          ${width * 0.2} ${height * 0.25}, 
                                          ${width} ${height * 0.2} 
                                        L ${width} ${height} 
                                        L 0 ${height} Z`}
          fill={PRIMARY_BUTTON_BLUE}
        />
      </Svg>
      <View style={Loginstyles.innerContainer}>
        <Image
          source={require("../../assets/images/clubdepalma.png")}
          style={Loginstyles.logo}
        />
        <Text style={Loginstyles.headdingTitle}>CLUBE de PALMA</Text>
      </View>
      <View>
        <Text style={Loginstyles.signInText}>Forgot Password</Text>
      </View>
      <View style={Loginstyles.card}>
        <View style={{ marginVertical: 20 }}>
          <Text
            style={{
              color: "#717483",
              fontFamily: FONT_FAMILY.normal,
            }}
          >
            To reset your password, please enter the Member ID associated with
            your account. We will send you a link to reset your password.
          </Text>
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={Loginstyles.inputLabel}>Member ID</Text>
          {renderNameField()}
        </View>

        <Button2
          onPress={forgotPasswordHandler}
          text={"Forgot Password"}
          loading={loadingData}
        />
        <TouchableOpacity
          style={Loginstyles.backToSignInButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={Loginstyles.backToSignInText}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;
// import React, {useState, useEffect, useRef} from 'react';
// import {
//   Image,
//   View,
//   Text,
//   TouchableOpacity,
//   Animated,
//   Keyboard,
//   ActivityIndicator,
//   SafeAreaView,
//   Alert,
//   StyleSheet,
//   Dimensions,
//   ImageBackground,
//   ScrollView,
// } from 'react-native';
// import LoginTextInput from '../../components/LoginTextInput';
// import {moderateScale, verticalScale, scale} from '../../util/scale';
// import {
//   RED_COLOR,
//   WHITE_SMOKE,
//   GREY_COLOR,
//   PRIMARY_COLOR,
//   PINK_COLOR,
//   SECONDARY_COLOR,
// } from '../../util/colors';
// import {FONT_FAMILY} from '../../util/constant';
// import Modal from 'react-native-modal';
// import _ from 'lodash';
// import {forgotPassword} from './ForgotPasswordService.js';

// const InputType = {
//   username: 'username',
//   password: 'password',
// };

// const ForgotPasswordScreen = ({navigation}) => {
//   const [usernameTextValue, setUsernameTextValue] = useState('');
//   const [loadingData, setLoadingData] = useState(false);
//   const keyboardMargin = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     const keyboardWillShowSub = Keyboard.addListener(
//       'keyboardWillShow',
//       keyboardWillShow,
//     );
//     const keyboardWillHideSub = Keyboard.addListener(
//       'keyboardWillHide',
//       keyboardWillHide,
//     );

//     return () => {
//       keyboardWillShowSub.remove();
//       keyboardWillHideSub.remove();
//     };
//   }, []);

//   const keyboardWillShow = event => {
//     Animated.timing(keyboardMargin, {
//       duration: event.duration,
//       toValue: event.endCoordinates.height,
//       useNativeDriver: true,
//     }).start();
//   };

//   const keyboardWillHide = event => {
//     Animated.timing(keyboardMargin, {
//       duration: event.duration,
//       toValue: 0,
//       useNativeDriver: true,
//     }).start();
//   };

//   const forgotPasswordHandler = async () => {
//     // navigation.navigate('VerifyForgotPassOTPScreen', { memberID: usernameTextValue })
//     const trimmedUsername = usernameTextValue.replace(/ /g, '');

//     if (trimmedUsername.length === 0) {
//       Alert.alert('Forgot Password', 'Please enter valid Member ID', [
//         {text: 'OK', onPress: () => {}},
//       ]);
//       return;
//     }

//     try {
//       setLoadingData(true);
//       const response = await forgotPassword(usernameTextValue);
//       console.log(response, '---------------response---------------');
//       if (response.status) {
//         Alert.alert('Forgot Password', response.message, [
//           {
//             text: 'OK',
//             onPress: () => {
//               navigation.navigate('VerifyForgotPassOTPScreen', {
//                 memberID: usernameTextValue,
//               });
//             },
//           },
//         ]);
//       } else {
//         Alert.alert('Forgot Password', 'Failed to send OTP', [
//           {
//             text: 'OK',
//             onPress: () => {
//               navigation.navigate('LoginScreen');
//             },
//           },
//         ]);
//       }
//     } catch (error) {
//       console.error('Forgot Password Error:', error);
//       Alert.alert('Error', 'An unexpected error occurred', [
//         {text: 'OK', onPress: () => {}},
//       ]);
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   const onChangeText = (text, type) => {
//     setUsernameTextValue(text);
//   };

//   const renderNameField = () => {
//     return (
//       <LoginTextInput
//         // name="Membership No."
//         keyboardType="email-address"
//         placeholder="Enter your member id"
//         canManageTextVisibility
//         secureTextEntry={false}
//         textValue={usernameTextValue}
//         onChangeText={value => onChangeText(value, InputType.username)}
//         // required={true}
//       />
//     );
//   };

//   const renderBackToSignIn = () => {
//     return (
//       <TouchableOpacity
//         style={{marginTop: 10, justifyContent: 'center', alignItems: 'center'}}
//         onPress={() => navigation.navigate('LoginScreen')}>
//         <Text style={styles.forgotPasswordText}>Back to Sign In</Text>
//       </TouchableOpacity>
//     );
//   };

//   const renderLoader = () => {
//     return (
//       <Modal
//         isVisible={loadingData}
//         backdropColor={'black'}
//         animationIn="fadeIn"
//         animationOut="fadeOut"
//         style={{
//           position: 'absolute',
//           elevation: 10,
//           justifyContent: 'center',
//           alignItems: 'center',
//           right: 0,
//           left: 0,
//           bottom: 0,
//           top: 0,
//         }}>
//         <View>
//           <ActivityIndicator size="large" animating={loadingData} />
//         </View>
//       </Modal>
//     );
//   };

//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         paddingBottom: moderateScale(16),
//         backgroundColor: '#151831',
//       }}>
//       <ScrollView>
//         <ImageBackground
//           style={{width: width, height: height}}
//           source={require('../../assets/images/backgroundNew.png')}>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'center',
//               alignItems: 'center',
//               width: '100%',
//               marginTop: 75,
//               paddingBottom: 70,
//             }}>
//             <Image
//               source={require('../../assets/images/clubdepalma.png')}
//               style={{height: 30, width: 30, borderRadius: 20}}
//             />
//             <Text
//               style={{
//                 color: 'white',
//                 fontSize: 30,
//                 marginBottom: 5,
//                 marginLeft: 5,
//               }}>
//               MB Club
//             </Text>
//           </View>
//           <View style={{flex: 1, paddingHorizontal: 20}}>
//             <View>
//               <Text style={styles.SignInText}>Forgot Password</Text>
//             </View>
//             <View>
//               <Text style={styles.titleText}>
//                 To reset your password, please enter the Member ID associated
//                 with your account. We will send you a link to reset your
//                 password.
//               </Text>
//             </View>
//             <View style={{paddingVertical: 10}}>
//               <Text style={styles.titleText}>Member Id</Text>
//               {renderNameField()}
//             </View>
//             <TouchableOpacity style={{}} onPress={forgotPasswordHandler}>
//               <View style={styles.submitButton}>
//                 <Text
//                   style={{
//                     color: 'white',
//                     fontSize: moderateScale(16),
//                     fontFamily: FONT_FAMILY.bold,
//                   }}>
//                   Send OTP
//                 </Text>
//               </View>
//             </TouchableOpacity>
//             {renderBackToSignIn()}
//             {renderLoader()}
//           </View>
//         </ImageBackground>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const {height, width} = Dimensions.get('window');

// const styles = StyleSheet.create({
//   SignInText: {
//     fontSize: 30,
//     color: 'white',
//   },
//   submitButton: {
//     backgroundColor: SECONDARY_COLOR,
//     width: width - 35,
//     height: moderateScale(50),
//     marginTop: 20,
//     justifyContent: 'center',
//     alignSelf: 'center',
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   titleText: {
//     color: '#717483',
//     paddingBottom: 10,
//     paddingVertical: 20,
//   },
//   forgotPasswordText: {
//     color: SECONDARY_COLOR,
//     paddingBottom: 10,
//     textAlign: 'center',
//     paddingVertical: 20,
//   },
// });

// export default ForgotPasswordScreen;
