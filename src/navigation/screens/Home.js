import React from 'react'

import {createStackNavigator} from '@react-navigation/stack'

//Screens
import HomeListView from './HomeListView'
import OnlineConsultation from '../../screens/services/ListDetails'
import Rolls from './Rolls'
import PreivewRolls from '../../screens/rolls/PreviewRolls'
import Notification from './Notification'
import Analytics from './Analytics'


const Stack = createStackNavigator()

const FirstScreenNavigator = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="HomeListView"
                component={HomeListView}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="OnlineConsultation"
                component={OnlineConsultation}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    )
}
export {FirstScreenNavigator}

const SecondScreenNavigator = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="Rolls"
                component={Rolls}
                options={{headerShown: false}}
            />
            {/* <Stack.Screen
                name="PreivewRolls"
                component={PreivewRolls}
                options={{headerShown: false}}
            /> */}
        </Stack.Navigator>
    )
}
export {SecondScreenNavigator}

const ThirdScreenNavigator = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="Notification"
                component={Notification}
                options={{headerShown: false}}
            />
            {/* <Stack.Screen
                name="NestedScreen"
                component={NestedScreen}
            /> */}
        </Stack.Navigator>
    )
}
export {ThirdScreenNavigator}

const FourthScreenNavigator = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="Analytics"
                component={Analytics}
                options={{headerShown: false}}
            />
            {/* <Stack.Screen
                name="NestedScreen"
                component={NestedScreen}
            /> */}
        </Stack.Navigator>
    )
}
export {FourthScreenNavigator}