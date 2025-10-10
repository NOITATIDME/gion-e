import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// === 스크린 import ===
import HomeScreen from './screens/HomeScreen';
import HomeScreen2 from './screens/HomeScreen2';
import DailyForecastScreen from './screens/DailyForecastScreen';
import LocationCheckScreen from "./screens/LocationCheckScreen";

// === 네비게이션 타입 ===
import { RootStackParamList } from './types/type';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LocationCheck">
        <Stack.Screen
          name="LocationCheck"
          component={LocationCheckScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DailyForecast"
          component={DailyForecastScreen}
          options={{ title: '일별 예보' }}
        /> 
        <Stack.Screen
          name="Home2"
          component={HomeScreen2}
          options={{ headerShown: false }}
        /> 
      </Stack.Navigator>

      
 
    </NavigationContainer>
  );
}