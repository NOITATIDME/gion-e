// // src/navigation/RootNavigator.tsx
// import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';

// import HomeScreen from '../screens/HomeScreen';
// import OutfitPage from '../components/OutfitModal';

// export type RootStackParamList = {
//     Home: undefined;
//     Outfit: { scrollToTop?: boolean }; // params 추가
// };

// const Stack = createStackNavigator<RootStackParamList>();

// export default function RootNavigator() {
//     return (
//         <Stack.Navigator screenOptions={{ headerShown: false }}>
//             <Stack.Screen name="Home" component={HomeScreen} />
//             <Stack.Screen name="Outfit" component={OutfitPage} />
//         </Stack.Navigator>
//     );
// }
