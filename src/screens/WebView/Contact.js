import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Linking,
} from 'react-native';
import React, {useState} from 'react';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import {Marker} from 'react-native-svg';
import Header from '../../components/Header';
import NewButton from '../../components/Button';
import { FONT_FAMILY,SECONDARY_COLOR } from '../../util/constant';
import { Toast } from 'react-native-toast-notifications';
const Contact = () => {
  const Items = [
    {
      id: 1,
      icon: "location-on",
      text: `Clube de Palma, Aldeia de Goa, Bambolim, Goa 400004`,
    },
    {
      id: 2,
      icon: "email",
      text: `john.smith@clubedepalma.co.in`,
      color: "rgb(36, 126, 252)",
    },
    {
      id: 3,
      icon: "call",
      text: `+91-9876543210`,
      color: "rgb(36, 126, 252)",
    },
   
  ];
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const handleContactPress = item => {
    if (item.icon === 'email') {
      const emailUrl = `mailto:${item.text}`;
      Linking.openURL(emailUrl).catch(() =>
        Toast.show( 'Could not open email app.',{type:'warning'}),
      );
    } else if (item.icon === 'call') {
      // Remove any non-digit characters (like dash or spaces)
      const phoneNumber = item.text.replace(/[^\d+]/g, '');
      const phoneUrl = `tel:${phoneNumber}`;
      Linking.openURL(phoneUrl).catch(() =>
        Toast.show( 'Could not open phone dialer.',{type:'warning'}),
      );
    }
  };
  const [Inputs, setInputs] = useState([
    {
      id: 1,
      placeHolder: 'Enter Name',
      text: '',
      name: 'Name',
      maxLength: 50,
      keyboardType: 'ascii-capable',
      value: '',
    },
    {
      id: 2,
      placeHolder: 'Enter Email',
      text: '',
      name: 'Email',
      maxLength: 50,
      keyboardType: 'ascii-capable',
      value: '',
    },
    {
      id: 3,
      placeHolder: 'Enter Phone',
      text: '',
      name: 'Phone',
      maxLength: 10,
      keyboardType: 'decimal-pad',
      value: '',
    },
    {
      id: 4,
      placeHolder: 'Write Message',
      text: '',
      name: 'Message',
      maxLength: 200,
      keyboardType: 'ascii-capable',
      value: '',
    },
  ]);
  const handleChangeText = (text, id) => {
    setInputs(prevInputs =>
      prevInputs.map(input =>
        input.id === id ? {...input, value: text} : input,
      ),
    );
  };
  const handleSubmit = async () => {
    const data = Inputs.map(input => input.value);
    console.log(data);

    const response = await fetch(
      'https://club26.org/wp-json/contact-form-7/v1/contact-forms/1572/feedback',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({your-name:}),
      },
    );
  };
  return (
    <View style={styles.container}>
      <Header title={'Contact Us'} />
      <ScrollView style={{margin: 20}} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={{fontFamily: FONT_FAMILY.bold, fontSize: 20}}>
            OFFICE ADDRESS
          </Text>
          <FlatList
            scrollEnabled={false}
            data={Items}
            contentContainerStyle={{flex: 1}}
            renderItem={({item}) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    margin: 10,
                    alignItems: 'center',
                  }}>
                  <Icons
                    name={item.icon}
                    size={20}
                    color={'#000'}
                    style={{marginRight: 10}}
                  />
                  <Text
                    onPress={() => handleContactPress(item)}
                    style={{
                      color: 'black',
                      fontFamily: FONT_FAMILY.normal,
                      color: item.color ? item.color : 'black',
                    }}>
                    {item.text}
                  </Text>
                </View>
              );
            }}
          />
        </View>
        {/* <View>
          <FlatList
            data={Inputs}
            contentContainerStyle={{flex: 1}}
            renderItem={({item}) => {
              return (
                <View
                  style={{
                    margin: 10,
                  }}>
                  <Text
                    style={{color: 'black', fontFamily: FONT_FAMILY.normal}}>
                    {item.name}
                  </Text>
                  <TextInput
                    style={{
                      borderWidth: 0.3,
                      borderRadius: 10,
                      padding: 10,
                      marginVertical: 5,
                      fontFamily: FONT_FAMILY.normal,
                      minHeight: item.id === 4 ? 150 : undefined,
                      textAlignVertical: 'top',
                    }}
                    scrollEnabled={false}
                    multiline={true}
                    cursorColor={SECONDARY_COLOR}
                    maxLength={item.maxLength}
                    keyboardType={item.keyboardType || 'decimal-pad'}
                    value={item.value}
                    onChangeText={text => handleChangeText(text, item.id)}
                    placeholder={item.placeHolder}
                  />
                </View>
              );
            }}
          />
        </View> */}
      </ScrollView>
      {/* <View style={{margin: 20}}>
        <NewButton text={'Ask A Question'} />
      </View> */}
    </View>
  );
};

export default Contact;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white'},
});
