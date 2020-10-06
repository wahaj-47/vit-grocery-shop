import React from "react";
import { Cart, ShippingDetails } from "../screens";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function CartStack() {
	return (
		<Stack.Navigator
			initialRouteName="Cart"
			screenOptions={{ gestureEnabled: false, headerShown: false }}
		>
			<Stack.Screen name="Cart" component={Cart} />
			<Stack.Screen name="Shipping" component={ShippingDetails} />
		</Stack.Navigator>
	);
}
