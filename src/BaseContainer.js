
import React, {  useEffect,  } from 'react';
import { useDispatch } from 'react-redux';
import { setDeviceToken, setModal, setPlatform, setVersion } from './store/actions/authActions';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import AppDrawerNavigator from './HomeNavigation';
import { useNavigation } from '@react-navigation/native';
import { navigate } from './Navigation/ NavigationService';

const BaseContainer = () => {
  const dispatch = useDispatch();
const navigation=useNavigation()
  const updateDeviceConfig = async () => {
    
    const deviceTokenId = await messaging().getToken();
    const platform = DeviceInfo.getSystemName().toUpperCase();
    const modal = DeviceInfo.getModel().toUpperCase();
    const Version = DeviceInfo.getVersion().toUpperCase();
 
    dispatch(setDeviceToken(deviceTokenId));
    dispatch(setVersion(Version));
    dispatch(setPlatform(platform));
    dispatch(setModal(modal));
  };

  const setupNotifications = async () => {
    try {
      await requestNotificationPermission();
      messaging().onMessage(async (remoteMessage) => {
        console.log('Received remote message------------------>>>>>>>>:', remoteMessage);
        await displayNotification(remoteMessage);
        if (remoteMessage?.data?.screen) {
          navigate(remoteMessage?.data?.screen, remoteMessage.data);
        }
      });

      messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in the background!===================>>>>>>', remoteMessage);
        await notifee.displayNotification({
          title: remoteMessage.notification?.title,
          body: remoteMessage.notification?.body,
          android: {
            channelId: 'default',
          },
        });
      });
      messaging().onNotificationOpenedApp((remoteMessage) => {
        console.log('Notification opened:===================----------->', remoteMessage);
        // Handle navigation or other logic here
      });

      const initialNotification = await messaging().getInitialNotification();
      if (initialNotification) {
        console.log('Initial notification:=--------=========------===========000000099999', initialNotification);
        if (initialNotification?.data?.screen) {
        
          navigate(initialNotification?.data?.screen, initialNotification.data);
        }
        // Handle initial notification if needed
      }
    } catch (error) {
      console.error('Error setting up push notifications909090089089988798:', error);
    }
  };

  const requestNotificationPermission = async () => {
    try {
     const permission= notifee.requestPermission()
      if (permission.authorizationStatus === notifee.AuthorizationStatus.DENIED) {
        console.warn('Notification permission denied');
        return;
      }
      const authStatus = await messaging().requestPermission();
      const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (!enabled) {

      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  }

  useEffect(() => {
    requestNotificationPermission()
   
      updateDeviceConfig();
      setupNotifications();
  }, [])

  const displayNotification = async (remoteMessage) => {
    try {
      const { notification, data } = remoteMessage;
      await notifee.requestPermission();
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });

      await notifee.displayNotification({
        title: notification.title,
        body: notification.body,
        android: {
          channelId,
          pressAction: {
            id: 'default',
          },
        },
        data: data,
      });
    } catch (error) {
      console.error('Error displaying notification:', error);
    }
  };

  return (
<AppDrawerNavigator/>
  );
};

export default BaseContainer;
