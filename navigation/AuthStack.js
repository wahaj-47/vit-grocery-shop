import React from "react";
import { ForgotPassword, Login, SignUp } from "../screens";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function AuthStack() {
	return (
		<Stack.Navigator
			initialRouteName="Home"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen name="Login" component={Login} />
			<Stack.Screen name="SignUp" component={SignUp} />
			<Stack.Screen name="Forgot" component={ForgotPassword} />
		</Stack.Navigator>
	);
}
