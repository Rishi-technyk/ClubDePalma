/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, { EventType } from '@notifee/react-native';

// ✅ Set background event handler BEFORE registerComponent
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  if (type === EventType.ACTION_PRESS && pressAction.id === 'default') {
     navigate(notification?.data?.screen, notification.data);

  
  }
});


AppRegistry.registerComponent(appName, () => App);
