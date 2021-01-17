import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import RootDrawer from "./navigation/RootNavigator";
import AuthStack from "./navigation/AuthStack";
import { AuthProvider, AuthContext } from "./providers/AuthProvider";
import FlashMessage from "react-native-flash-message";
import { HamperProvider } from "./providers/HamperProvider";
import { CartProvider } from "./providers/CartProvider";
import { ConstantsProvider } from "./providers/ConstantsProvider";

export default function App() {
	return (
		<>
			<StatusBar style="dark"></StatusBar>
			<AuthProvider>
				<ConstantsProvider>
					<HamperProvider>
						<CartProvider>
							<NavigationContainer>
								<AuthContext.Consumer>
									{({ initializing, user }) =>
										!initializing && user && user?.emailVerified ? (
											<RootDrawer></RootDrawer>
										) : (
											<AuthStack></AuthStack>
										)
									}
								</AuthContext.Consumer>
							</NavigationContainer>
							<FlashMessage></FlashMessage>
						</CartProvider>
					</HamperProvider>
				</ConstantsProvider>
			</AuthProvider>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
