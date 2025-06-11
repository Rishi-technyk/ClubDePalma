import React, {useState, useRef} from 'react';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import LoginTextInput from '../../components/LoginTextInput';
import {SECONDARY_COLOR, PRIMARY_BUTTON_BLUE} from '../../util/colors';
import {VerifySigninOTP} from './VerifySigninOTPService.js';
import {Loginstyles} from '../../Styles/LoginStyles.js';
import Svg, {Path} from 'react-native-svg';
import {FONT_FAMILY} from '../../util/constant.js';
import Button2 from '../../components/Button2.js';
import { Toast } from 'react-native-toast-notifications';

const InputType = {
  username: 'username',
  password: 'password',
};

const VerifyForgotPasswordOTPScreen = ({route, navigation}) => {
  const [usernameTextValue, setUsernameTextValue] = useState('');

  const [passwordValue, setPasswordValue] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const keyboardMargin = useRef(new Animated.Value(0)).current;

  const navigateToHome = () => {
    navigation.navigate('APPSTACK');
  };
  const VerifySignInOTP = async () => {
    Toast.hideAll()
    if (usernameTextValue === '') {
      Toast.show('Please enter OTP',{type:'warning'});
      return;
    }

    const cleanedOTP = usernameTextValue.replace(/ /g, '');
    if (cleanedOTP.length === 0) {
      Toast.show(
        'Please enter OTP',
        {type:'warning'}
      );
      return;
    }

    try {
      setLoadingData(true);

      const payload = {
        member_id: route.params?.memberID,
        otp: usernameTextValue,
        passwordValue: passwordValue,
      };
      let response = await VerifySigninOTP(payload);
      if (response.status) {
        setLoadingData(false);
        Toast.show(
          response.message,
        {type:'success'}
        );
        if (response.status === true) {
          // Assuming loginUserSuccessOTP and navigation to home are handled elsewhere
          navigateToHome();
        }
      } else {
        setLoadingData(false);
        Toast.show( 'Unable to verify OTP',{type:'danger'});
      }
    } catch (error) {
      setLoadingData(false);
      Toast.show( error.message,{type:'danger'});
    }
  };

  const onChangeText = (text, type) => {
    if (type === 'username') {
      setUsernameTextValue(text);
    } else if (type === 'password') {
      setPasswordValue(text);
    }
  };

  const renderNameField = () => {
    return (
      <LoginTextInput
        keyboardType="email-address"
        placeholder="Enter Your OTP"
        canManageTextVisibility
        secureTextEntry={false}
        textValue={usernameTextValue}
        onChangeText={value => onChangeText(value, InputType.username)}
        // required={true}
      />
    );
  };

  const renderPasswordField = () => {
    return (
      <LoginTextInput
        // ref={input => this.newPasswordInput = input}
        // name="new password."
        keyboardType="email-address"
        placeholder="Enter Password"
        canManageTextVisibility
        secureTextEntry={false}
        textValue={passwordValue}
        onChangeText={value => onChangeText(value, InputType.password)}
        onDone={() => {}}
        // required={true}
      />
    );
  };

  return (
    <View style={Loginstyles.container}>
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{position: 'absolute', flex: 1}}>
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
          source={require('../../assets/images/clubdepalma.png')}
          style={Loginstyles.logo}
        />
        <Text style={Loginstyles.headdingTitle}>CLUBE de PALMA</Text>
      </View>
      <View>
        <Text style={Loginstyles.signInText}>Verify OTP</Text>
      </View>
      <View style={Loginstyles.card}>
        <View style={{marginVertical: 20}}>
          <Text
            style={{
              color: '#717483',
              fontFamily: FONT_FAMILY.normal,
            }}>
            For Sing In, Please Enter The Valid OTP For Member ID:{' '}
            <Text
              style={{
                color: 'black',
                fontFamily: FONT_FAMILY.normal,
              }}>
              {route.params?.memberID}
            </Text>
          </Text>

          {renderNameField()}
          {renderPasswordField()}
        </View>

        <Button2
          onPress={VerifySignInOTP}
          text={'Verify'}
          loading={loadingData}
        />

        <TouchableOpacity
          style={Loginstyles.backToSignInButton}
          onPress={() => navigation.goBack()}>
          <Text style={Loginstyles.backToSignInText}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const {height, width} = Dimensions.get('window');

export default VerifyForgotPasswordOTPScreen;

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
// import {moderateScale} from '../../util/scale';
// import {PINK_COLOR, FONT_FAMILY, SECONDARY_COLOR} from '../../util/colors';
// import {VerifySigninOTP} from './VerifySigninOTPService.js';
// import Modal from 'react-native-modal';
// import _ from 'lodash';

// const InputType = {
//   username: 'username',
//   password: 'password',
// };

// const VerifyForgotPasswordOTPScreen = ({route, navigation}) => {
//   const [usernameTextValue, setUsernameTextValue] = useState('');

//   const [passwordValue, setPasswordValue] = useState('');
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

//   const navigateToHome = () => {
//     navigation.navigate('APPSTACK');
//   };
//   const VerifySignInOTP = async () => {
//     if (usernameTextValue === '') {
//       alert('Please enter OTP');
//       return;
//     }

//     const cleanedOTP = usernameTextValue.replace(/ /g, '');
//     if (cleanedOTP.length === 0) {
//       Alert.alert(
//         'Verify OTP',
//         'Please enter OTP',
//         [{text: 'OK', onPress: () => {}}],
//         {cancelable: false},
//       );
//       return;
//     }

//     try {
//       setLoadingData(true);

//       const payload = {
//         member_id: route.params?.memberID,
//         otp: usernameTextValue,
//         passwordValue: passwordValue,
//       };
//       let response = await VerifySigninOTP(payload);
//       if (response.status) {
//         setLoadingData(false);
//         Alert.alert(
//           'Verify Signin OTP',
//           response.message,
//           [
//             {
//               text: 'OK',
//               onPress: () => {
//                 navigation.navigate('LoginScreen');
//               },
//             },
//           ],
//           {cancelable: false},
//         );

//         if (response.status === true) {
//           // Assuming loginUserSuccessOTP and navigation to home are handled elsewhere
//           navigation.navigate('LoginScreen');
//         }
//       } else {
//         setLoadingData(false);
//         alert('Error: Unable to verify OTP');
//       }
//     } catch (error) {
//       setLoadingData(false);
//       alert('Error: ' + error.message);
//     }
//   };

//   const onChangeText = (text, type) => {
//     if (type === 'username') {
//       setUsernameTextValue(text);
//     } else if (type === 'password') {
//       setPasswordValue(text);
//     }
//   };

//   const renderNameField = () => {
//     return (
//       <LoginTextInput
//         keyboardType="email-address"
//         placeholder="Enter Your OTP"
//         canManageTextVisibility
//         secureTextEntry={false}
//         textValue={usernameTextValue}
//         onChangeText={value => onChangeText(value, InputType.username)}
//         // required={true}
//       />
//     );
//   };

//   const renderPasswordField = () => {
//     return (
//       <LoginTextInput
//         // ref={input => this.newPasswordInput = input}
//         // name="new password."
//         keyboardType="email-address"
//         placeholder="Enter Password"
//         canManageTextVisibility
//         secureTextEntry={false}
//         textValue={passwordValue}
//         onChangeText={value => onChangeText(value, InputType.password)}
//         onDone={() => {}}
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

//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         paddingBottom: moderateScale(16),
//         backgroundColor: '#151831',
//       }}>
//       <ScrollView>
//         <ImageBackground
//           style={{
//             width: Dimensions.get('window').width,
//             height: Dimensions.get('window').height,
//           }}
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
//               <Text style={styles.SignInText}>Verify OTP</Text>
//             </View>

//             <View>
//               <Text style={styles.titleText}>
//                 For Sing In, Please Enter The Valid OTP
//               </Text>
//               <Text style={styles.titleText1}>
//                 For Member ID: {route.params?.memberID}
//               </Text>
//             </View>

//             <View style={{paddingVertical: 10}}>
//               <Text style={styles.titleTexts}>Enter OTP</Text>
//               {renderNameField()}
//             </View>
//             <View style={{paddingVertical: 10}}>
//               <Text style={styles.titleTexts}>Enter New Password</Text>
//               {renderPasswordField()}
//             </View>
//             <TouchableOpacity onPress={VerifySignInOTP}>
//               <View style={styles.submitButton}>
//                 <Text style={{color: 'white', fontSize: moderateScale(16)}}>
//                   Verify
//                 </Text>
//               </View>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={{
//                 marginTop: 10,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               }}
//               onPress={() => navigation.navigate('LoginScreen')}>
//               <Text style={styles.forgotPasswordText}>Back to Sign In</Text>
//             </TouchableOpacity>
//           </View>
//         </ImageBackground>
//       </ScrollView>

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
//         <View style={styles.activityIndicatorBox}>
//           <ActivityIndicator size="large" animating={loadingData} />
//         </View>
//       </Modal>
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
//     backgroundColor: '#79ca14',
//     // backgroundColor: SECONDARY_COLOR,
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
//   titleTexts: {
//     color: '#717483',
//     paddingBottom: -10,
//     paddingVertical: 10,
//   },
//   titleText1: {
//     color: '#717483',
//     paddingBottom: 1,
//     paddingVertical: 0,
//   },
//   forgotPasswordText: {
//     color: SECONDARY_COLOR,
//     paddingBottom: 10,
//     textAlign: 'center',
//     paddingVertical: 20,
//   },
// });

// export default VerifyForgotPasswordOTPScreen;
