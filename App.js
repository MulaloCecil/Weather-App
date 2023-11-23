import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground } from 'react-native';
import * as Location from 'expo-location'

import daybg from './assets/daybg.jpg'
import nightbg from './assets/nightbg.jpg'
import loadImg from './assets/load.jpg'

import Info from './components/info';
import Header from './components/header'
import Detail from './components/detail';

const WEATHER_API_KEY = '5e02bca3bd23c8a5e85da3acf7d9548f'
const CURRENT_WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

export default function App() {
  const [currentWeather, setCurrentWeather] = useState(null)
  const [error, setError] = useState('')
  const [unitSystem, setUnitSystem] = useState('metric') //imperial
  const [isDay, setIsDay] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    load();
  }, [unitSystem])

  async function load() {
    setCurrentWeather(null)
    try {
      let {status} = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setError('Access to location is needed!')
        return
      }

      setIsLoading(true)

      const location = await Location.getCurrentPositionAsync()
      const {latitude, longitude} = location.coords

      const hour = (new Date()).getHours();
      if (hour >= 6 && hour <=18) {
        setIsDay(true)
      } else {
        setIsDay(false)
      }

      const weatherURL = `${CURRENT_WEATHER_BASE_URL}?lat=${latitude}&lon=${longitude}&units=${unitSystem}&appid=${WEATHER_API_KEY}`
      const response = await fetch(weatherURL)
      const result = await response.json()

      setIsLoading(false)

      if (response.ok) {
        setCurrentWeather(result)
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError(error.message)
    }
  }


  if (currentWeather && !isLoading) {
    return (
      <View style={styles.container}>
        <ImageBackground source={isDay ? daybg : nightbg} style={styles.imgbg}>
          <Header 
            unitSystem={unitSystem}
            setUnitSystem={setUnitSystem}
            load={load}
          />
          <Info 
            currentWeather={currentWeather}
            unitSystem={unitSystem}
            setUnitSystem={setUnitSystem}
          />
          <Detail 
            currentWeather={currentWeather}
            unitSystem={unitSystem}
          />
          <StatusBar style="auto" />
        </ImageBackground>
      </View>   
    )
  } else if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
        <StatusBar style="auto" />
      </View>   
    )
  } else {
    return (
      <View style={{...styles.container,
        padding: 20, 
        backgroundColor: '#152131', 
        justifyContent: 'flex-start',
      }}>
        <Image 
          source={loadImg}
          style={{
            height: 300,
            width: 300
          }}
        />
        <Text
          style={{
            color: '#fff',
            fontWeight: '700',
            fontSize: 24,
            margin: 30,
          }}
        >
          Detecting your weather...!
        </Text>
        <View
          style={{
            margin: 60,
            marginTop: 'auto',
            borderRadius: 500,
            borderColor: 'rgba(255,255,255,.7)',
            borderWidth: 8,
            height: 60,
            width: 60,
          }}
        >

        </View>
        <StatusBar style="auto" />
      </View>   
    )
  } 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgbg: {
    width: '100%',
    height: '100%',
  }
});
