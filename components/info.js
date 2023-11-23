import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';



export default function Info({ unitSystem }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
       
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;


      getWeatherByCoordinates(latitude, longitude);
    } catch (error) {
      console.log(error);
   
    }
  };

  const getWeatherByCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unitSystem}&appid=5e02bca3bd23c8a5e85da3acf7d9548f`
      );
      if (!response.ok) {
  
        throw new Error('Weather data not found');
      }
      const data = await response.json();


      const weatherData = {
        main: {
          temp: data.main.temp
        },
        weather: [
          {
            icon: data.weather[0].icon,
            description: data.weather[0].description
          }
        ]
      };
      setCurrentWeather(weatherData);
    } catch (error) {
      console.log(error);
   
    }
  };

  const handleSearch = async () => {
    try {
     
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&units=${unitSystem}&appid=5e02bca3bd23c8a5e85da3acf7d9548f`
      );
      if (!response.ok) {
      
        throw new Error('Weather data not found');
      }
      const data = await response.json();

   
      const weatherData = {
        main: {
          temp: data.main.temp
        },
        weather: [
          {
            icon: data.weather[0].icon,
            description: data.weather[0].description
          }
        ]
      };
      setCurrentWeather(weatherData);
    } catch (error) {
      console.log(error);
    
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Enter location"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      {currentWeather && (
        <>
          <View style={styles.temp}>
            <Text style={styles.title}>{Math.round(currentWeather.main.temp)}</Text>
            <Text style={styles.unit}>°{unitSystem === 'metric' ? 'C' : 'F'}</Text>
          </View>
          <View>
            <Text>{currentWeather.weather[0].description}</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  temp: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  title: {
    color: '#fff',
    fontSize: 130,
    fontWeight: '500',
  },
  unit: {
    color: '#fff',
    marginTop: 40,
    fontSize: 24,
    fontWeight: '700',
  },
});