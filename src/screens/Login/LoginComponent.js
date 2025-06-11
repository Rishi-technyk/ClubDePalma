import React, {useCallback, useRef, useState} from 'react';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  BackHandler,
  Alert,
  StatusBar,
} from 'react-native';
import LoginTextInput from '../../components/LoginTextInput';
import {PRIMARY_BUTTON_BLUE, DARK_BLUE} from '../../util/colors';
import DeviceInfo from 'react-native-device-info';
import {loginSuccess} from '../../store/actions/authActions'; // Adjust path as per your project structure
import {useDispatch, useSelector} from 'react-redux';
import {loginWith} from './LoginService';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Svg, {Path, Rect} from 'react-native-svg';
import Button2 from '../../components/Button2';
import {Loginstyles} from '../../Styles/LoginStyles';
import { Toast } from 'react-native-toast-notifications';

const Version = DeviceInfo.getVersion().toUpperCase();

const LoginComponent = () => {
  const [passwordTextValue, setPasswordTextValue] = useState('');
  const [usernameTextValue, setUsernameTextValue] = useState('');
  const data = useSelector(state => state.auth);
  const [loadingData, setLoadingData] = useState(false);
  const {width, height} = Dimensions.get('window');
  const navigation = useNavigation();
  const {isConnected, isInternetReachable} = useSelector(state => state.common);
  const passRef = useRef(null);
  const dispatch = useDispatch();

  const onChangeText = (text, type) => {
    if (type === 'username') {
      setUsernameTextValue(text);
    } else if (type === 'password') {
      setPasswordTextValue(text);
    }
  };

  const authenticateUsers = async () => {
    setLoadingData(true);
    Toast.hideAll();
    if (usernameTextValue === '') {
      Toast.show('Please enter memberID',
        {type: 'danger',})
      
      setLoadingData(false);
      return;
    }
    if (passwordTextValue === '') {
      Toast.show('Please enter password',
        {type: 'danger',}
      );
      setLoadingData(false);
      return;
    }

    if (isConnected && isInternetReachable) {
      setLoadingData(true);
      const response = await loginWith(
        usernameTextValue,
        passwordTextValue,
        data,
      );
      console.log(response, '---------------response---------------');
      console.log(response);
      if (response.status) {
        dispatch(loginSuccess(response));

        setLoadingData(false);
        navigation.reset({
          routes: [{name: 'Home'}],
        });
      } else {
        Toast.show(response.message ? response.message : 'incorrect id or password',{
          type: 'danger',
        });
      }
    } else {
      Toast.show('Please make sure internet is working!!',{
        type: 'danger',
      });
      setLoadingData(false);
    }
    setLoadingData(false);
  };
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Exit App',
          'Are you sure you want to close the app?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: () => BackHandler.exitApp(),
            },
          ],
          {cancelable: false},
        );
        return true; // Prevent default behavior (going back)
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        setPasswordTextValue('');

        setUsernameTextValue('');
      };
    }, []),
  );

  return (
    <View style={Loginstyles.container}>
      <StatusBar backgroundColor={DARK_BLUE} />
      <View style={Loginstyles.innerContainer}>
        <Image
          source={require('../../assets/images/clubdepalma.png')}
          style={Loginstyles.logo}
        />
        <Text style={Loginstyles.headdingTitle}>CLUBE de PALMA</Text>
      </View>
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
      <Text style={Loginstyles.welcomeText}>Welcome to Clube de Palma</Text>
      <Text style={Loginstyles.signInText}>Sign In</Text>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={Loginstyles.card}>
        <View style={{marginVertical: 20}}>
          <LoginTextInput
            maxLength={15}
            // name="Member Id"
            keyboardType="email-address"
            placeholder="Member ID (001A)"
            canManageTextVisibility
            secureTextEntry={false}
            textValue={usernameTextValue}
            onChangeText={value => onChangeText(value, 'username')}
          />
        </View>

        <View style={{marginBottom: 20}}>
          <LoginTextInput
            ref={passRef}
            placeholder="Password (DD/MM/YY)"
            canManageTextVisibility
            maxLength={15}
            secureTextEntry={true}
            textValue={passwordTextValue}
            onChangeText={value => onChangeText(value, 'password')}
            onDone={authenticateUsers}
          />
        </View>

        <Button2
          text={'Sign In'}
          onPress={authenticateUsers}
          loading={loadingData}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={Loginstyles.dividor} />
          <Text style={Loginstyles.versionText}>or</Text>
          <View style={Loginstyles.dividor} />
        </View>
        <Button2
          text={'Sign In With OTP'}
          onPress={() => navigation.navigate('SigninWithOTPScreen')}
        />

        <TouchableOpacity
          activeOpacity={0.8}
          style={Loginstyles.forgotButton}
          onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={Loginstyles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={Loginstyles.versionContainer}>
          <Text style={Loginstyles.versionText}>Version: {Version}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginComponent;