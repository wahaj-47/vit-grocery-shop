import React from "react";
import { Homescreen, HamperDetails, Cart } from "../screens";
import { createStackNavigator } from "@react-navigation/stack";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";

const Stack = createSharedElementStackNavigator();

export default function HomeStack() {
	return (
		<Stack.Navigator
			initialRouteName="Home"
			screenOptions={{ gestureEnabled: false, headerShown: false }}
		>
			<Stack.Screen name="Home" component={Homescreen} />
			<Stack.Screen
				name="Hamper"
				component={HamperDetails}
				sharedElementsConfig={(route, otherRoute, showing) => {
					const { item } = route.params;
					return [
						{ id: `item.${item.id}.image` },
						{ id: `item.${item.id}.title`, animation: "fade" },
						{ id: `item.${item.id}.price`, animation: "fade" },
						{ id: `item.${item.id}.description`, animation: "fade" },
					];
				}}
			/>
		</Stack.Navigator>
	);
}
