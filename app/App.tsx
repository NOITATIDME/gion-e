import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// === 스크린 import ===
import HomeScreen from './screens/HomeScreen';
import DailyForecastScreen from './screens/DailyForecastScreen';

// === 네비게이션 타입 ===
export type RootStackParamList = {
  Home: undefined;
  DailyForecast: { location: string; dailyData: any[] };
};;

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// import React from 'react';
// import HomeScreen from './screens/HomeScreen';

// export default function App() {
//   return <HomeScreen />;
// }
