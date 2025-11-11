import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import LoginContainer from '../src/screens/Login/LoginComponent';
import SigninWithOTPScreen from '../src/screens/Login/SigninWithOTPScreen';
import VerifySigninOTPScreen from '../src/screens/Login/VerifySigninOTP';
import ForgotPasswordScreen from '../src/screens/ForgotPassword/ForgotPasswordScreen';
import VerifyForgotPasswordOTPScreen from '../src/screens/ForgotPassword/VerifyForgotPasswordOTPScreen';
import DownloadStatement from '../src/screens/DownloadStatement/DownloadStatement';
import HomeContainer from '../src/screens/Home/HomeComponent';
import ViewStatement from '../src/screens/ViewStatement/ViewStatement';
import CardRecharge from '../src/screens/CardRecharge/CardRecharge';
import OTP from '../src/screens/OTP/OTP';
import Transaction from '../src/screens/Transaction/Transaction';
import ChangePassword from '../src/screens/ChangePassword/ChangePassword';
import WebViewAll from '../src/screens/WebView/WebViewAll';
import NotificationListScreen from '../src/screens/Notification/Notification';
import NotificationDetailScreen from '../src/screens/Notification/NotificationDetails';
import ContactDetailsComponent from './screens/WebView/Contact';
import PaymentWebViewComponent from './screens/WebView/PaymentWebViewComponent';
import PDFView from './screens/PDF/PdfComponent';
import AffilatedClubScreen from './screens/AffilatedClub/AffilatedClubScreen';
import {useSelector} from 'react-redux';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {DARK_BLUE} from './util/colors';
import {CustomDrawerContent} from './Navigation/CustomDrawerContaient';
import Profile from './screens/Settings/Profile';
import Contact from './screens/WebView/Contact';
import Info from './screens/WebView/Info';
import Facilities from './screens/Facilities';
import ChoosePlayer from './screens/ChoosePlayer';
import AllFacilities from './screens/AllFacilities';
import PickPlayers from './screens/PickPlayers';
import MyBookings from './screens/Bookings/MyBookings';
import BookingCancelled from './screens/Bookings/BookingCancelled';
import Players from './screens/Players/Players';
const AuthStack = createStackNavigator();
const DrawerNav = createDrawerNavigator();

const DrawerNavigator = ({navigation}) => {
  return (
    <DrawerNav.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: 'black',
        },

        title: 'Home',
        headerTitleStyle: {color: 'red'},
        drawerIcon: ({color, size}) => (
          <Icon name="user" size={size} color="white" />
        ),
        drawerStyle: {
          backgroundColor: DARK_BLUE,
          width: '70%',
        },

        drawerLabelStyle: {
          fontSize: 29,
          color: 'red',
        },

        headerLeft: () => (
          <Icon
            name="menu"
            size={30}
            color="white"
            onPress={() => navigation.dispatch(DrawerActions.openDrawer)}
          />
        ),
      }}>
      <DrawerNav.Screen name="Home" component={HomeContainer} />
    </DrawerNav.Navigator>
  );
};

const AppDrawerNavigator = () => {
  const userData = useSelector(state => state.auth.userData);
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "white" },
        gestureEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: {
            animation: "timing",
            config: {
              duration: 300,
            },
          },
          close: {
            animation: "timing",
            config: {
              duration: 300,
            },
          },
        },
      }}>
      {!userData?.data?.data[0]?.MemberID ? (
        <AuthStack.Screen name="LoginScreen" component={LoginContainer} />
      ) : (
        <AuthStack.Screen name="Home" component={DrawerNavigator} />
      )}
      <AuthStack.Screen
        name="Invoice"
        component={ViewStatement}
        screenOptions={{ headerShown: false }}
      />
      
      <AuthStack.Screen
        name="Transactions"
        component={Transaction}
        screenOptions={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Recharge"
        component={CardRecharge}
        screenOptions={{ headerShown: false }}
      />
      <AuthStack.Screen name="ChangePassword" component={ChangePassword} />
      <AuthStack.Screen name="Profile" component={Profile} />
      <AuthStack.Screen name="AffilatedClub" component={AffilatedClubScreen} />
      <AuthStack.Screen
        name="DownloadStatement"
        component={DownloadStatement}
      />
      <AuthStack.Screen
        name="Notification"
        component={NotificationListScreen}
      />
      <AuthStack.Screen name="OTP" component={OTP} />
      <AuthStack.Screen
        name="NotificationDetailScreen"
        component={NotificationDetailScreen}
      />
      <AuthStack.Screen name="ContactUs" component={ContactDetailsComponent} />
      <AuthStack.Screen name="WebViewAll" component={WebViewAll} />
      <AuthStack.Screen name="PDFView" component={PDFView} />
      <AuthStack.Screen name="Contact" component={Contact} />
      <AuthStack.Screen name="Info" component={Info} />
      <AuthStack.Screen name="Facility" component={Facilities} />
      <AuthStack.Screen
        name="PaymentWebView"
        component={PaymentWebViewComponent}
      />

      <AuthStack.Screen
        name="SigninWithOTPScreen"
        component={SigninWithOTPScreen}
      />
      <AuthStack.Screen
        name="VerifySigninOTP"
        component={VerifySigninOTPScreen}
      />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
      <AuthStack.Screen
        name="VerifyForgotPassOTPScreen"
        component={VerifyForgotPasswordOTPScreen}
      />
      <AuthStack.Screen
        name="Players"
        component={Players}
      />
      <AuthStack.Screen name="Facilities" component={Facilities} />
      <AuthStack.Screen name="ChoosePlayer" component={ChoosePlayer} />
      <AuthStack.Screen name="AllFacilities" component={AllFacilities} />
      <AuthStack.Screen name="PickPlayers" component={PickPlayers} />
      <AuthStack.Screen name="Bookings" component={MyBookings} />
      <AuthStack.Screen name="BookingCancelled" component={BookingCancelled} />
    </AuthStack.Navigator>
  );
};
export default AppDrawerNavigator;
