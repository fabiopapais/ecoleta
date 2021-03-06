import React, { useState, useEffect } from 'react'
import { Feather } from '@expo/vector-icons'
import { View, Text, Image, ImageBackground, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'

import RNPickerSelect from 'react-native-picker-select';

import axios from 'axios'

// useEffect(() => {
//     axios.get<IBGEufResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(res => {
//         const ufInitials = res.data.map(uf => uf.sigla)

//         setUfs(ufInitials)
//     })
// }, [])

interface IBGEufResponse {
    sigla: string
}

interface IBGEcityResponse {
    nome: string
}

const Home = () => {
    const navigation = useNavigation()

    const [ufs, setUfs] = useState<string[]>([])
    const [cities, setCities] = useState<string[]>([])

    const [selectedUf, setSelectedUf] = useState('')
    const [selectedCity, setSelectedCity] = useState('')

    useEffect(() => {
        axios.get<IBGEufResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(res => {
            const ufInitials = res.data.map(uf => uf.sigla)
            setUfs(ufInitials)
        })
    }, [])

    useEffect(() => {
        axios
            .get<IBGEcityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(res => {
                const cityNames = res.data.map(city => city.nome)
                setCities(cityNames)
            })
    }, [selectedUf])

    function handleNavigateToPoints() {
        if (selectedCity === '' || selectedUf === '') {
            Alert.alert('Oooops....', 'Por favor, selecione sua região')
            return ''
        }
        navigation.navigate('Points', {
            selectedUf,
            selectedCity
        })
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ImageBackground
                source={require('../../assets/home-background.png')}
                style={styles.container}
                imageStyle={{ width: 374, height: 468 }}
            >
                <View style={styles.main}>
                    <Image source={require('../../assets/logo.png')} />
                    <View>
                        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <View style={[
                        styles.select, 
                        selectedUf === '' ? {} : styles.selectedSelect]}> 
                        <RNPickerSelect
                            placeholder={{
                                label: "Selecione sua UF",
                                color: '#322153',
                            }}
                            onValueChange={(value) => setSelectedUf(value)}
                            items={ufs.map((uf) => {
                                return {
                                    label: uf,
                                    value: uf,
                                };
                            })}
                        />
                    </View>
                    <View style={[
                        styles.select, 
                        selectedCity === '' ? {} : styles.selectedSelect]}>
                        <RNPickerSelect
                            placeholder={{
                                label: "Selecione sua cidade",
                                color: '#322153',
                            }}
                            
                            onValueChange={(value) => setSelectedCity(value)}
                            items={cities.map((city) => {
                                return {
                                    label: city,
                                    value: city,
                                };
                            })}
                        />
                    </View>


                    <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                        <View style={styles.buttonIcon}>
                            <Text>
                                <Feather name="arrow-right" color="#FFF" size={24} />
                            </Text>
                        </View>
                        <Text style={styles.buttonText}>Entrar</Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    )
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
    },

    footer: {},

    select: {
        marginBottom: 20,
        padding: 6,
        borderColor: '#999999',   
        borderWidth: 2,
        borderRadius: 10,
    },

    selectedSelect: {
        borderColor: '#34CB79' 
    },

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
    },
});

export default Home