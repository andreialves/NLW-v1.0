import React, { useState, useEffect} from 'react';
import { View, Image, StyleSheet, Text, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Picker } from '@react-native-community/picker';


interface UF{
  sigla:string;
}

interface City{
   nome: string;
}

const Home = () =>{ 

    const [ufs, setUfs] = useState<string[]>([]);
    const [citys, setCity] = useState<string[]>([]);
    const [selectedUF, setSelectedUF] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');

    const navigation = useNavigation();

    
    
    useEffect (()=> {
      axios.get<UF[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome`).then(response =>{
         const ufInitials = response.data.map(uf => uf.sigla);
         setUfs(ufInitials);
      })
    }, []);

    useEffect (() => {
      if (selectedUF === '0') return;
      axios.get<City[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios?orderBy=nome`).then(response => {
          const ci = response.data.map(city => city.nome);
          setCity(ci);
      })
    }, [selectedUF]);

    function handleNavigationToPoints(){
      navigation.navigate('Points', {
        selectedUF,
        selectedCity
      });
    }

    return (
        <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS == 'ios' ? 'padding' : undefined}>
        <ImageBackground 
            source={require('../../assets/home-background.png')}
            style={styles.container}
            imageStyle={{width: 274, height: 368}}>

            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')} />
                <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente. </Text>
            </View>

            <View style={styles.footer}>
                <Picker 
                  selectedValue={selectedUF}
                  style={styles.input}
                  onValueChange={(itemValue, itemPosition) =>  setSelectedUF(itemValue as string) }>

                  <Picker.Item label="Selecione um Estado" value="0" />
                  {ufs.map(uf =>( 
                    <Picker.Item label={uf} value={uf} />
                ))}
                </Picker>

                <Picker 
                  selectedValue={selectedCity}
                  style={styles.input}
                  onValueChange={(itemValue, itemPosition) =>  setSelectedCity(itemValue as string) }>
                  <Picker.Item label="Selecione uma Cidade" value="0" />
                  {citys.map(city =>( 
                    <Picker.Item label={city} value={city} />
                ))}
                </Picker>

                <RectButton style={styles.button} onPress={handleNavigationToPoints} >
                    <View style={styles.buttonIcon}>
                        <Icon name="log-in" color="#FFF" size={24}/>
                    </View>
                    <Text style={styles.buttonText}>Entrar</Text>
                </RectButton>
            </View>
        </ ImageBackground>
        </KeyboardAvoidingView>
   );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
   
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
      marginBottom: 280,
    },
  
    footer: {},
  
    select: {},
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

export default Home;