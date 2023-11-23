import React from 'react'
import {View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';



export default function Header({unitSystem, setUnitSystem, load}) {

    return (

        <View style={styles.header}>

            <View style={styles.unitSwitch}>
                <Text style={{...styles.unit, marginTop: 0, fontSize: 18}}>°C</Text>
                <View
                    style={{
                        marginHorizontal: 8,
                    }}
                >
                    <Switch
                        trackColor={{ false: '#81b0ff', true: '#81b0ff' }}
                        thumbColor={'#fff'}
                        ios_backgroundColor="#fff"
                        onValueChange={() => {
                            setUnitSystem(prev => {
                                if (prev === 'metric') {
                                    return 'imperial'
                                } else {
                                    return 'metric'
                                }
                            })
                        }}
                        value={unitSystem==='imperial'}
                    />
                </View>
                <Text style={{...styles.unit, marginTop: 0, fontSize: 18}}>°F</Text>
                
            </View>

            <TouchableOpacity onPress={load}>
                <MaterialCommunityIcons 
                    name="reload" 
                    size={24} 
                    color="#fff"
                />
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        top: 0,
        width: '100%',
        paddingHorizontal: 40,
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    unitSwitch: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    unit: {
        color: '#fff',
        marginTop: 40,
        fontSize: 24,
        fontWeight: '700',
    },
})