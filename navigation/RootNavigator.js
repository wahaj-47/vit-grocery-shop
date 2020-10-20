import React from "react";
import { Cart, Contact } from "../screens";
import {
	createDrawerNavigator,
	DrawerContentScrollView,
	DrawerItem,
	DrawerItemList,
} from "@react-navigation/drawer";
import HomeStack from "./HomeStack";
import CartStack from "./CartStack";
import { AuthContext } from "../providers/AuthProvider";
import { argonTheme } from "../constants";
import { Image, View } from "react-native";
import logo from "../assets/imgs/logo.png";
import { Text } from "galio-framework";

const Drawer = createDrawerNavigator();

export default function RootDrawer() {
	return (
		<AuthContext.Consumer>
			{({ signOut }) => (
				<Drawer.Navigator
					initialRouteName="Home"
					screenOptions={{ headerShown: false }}
					drawerContentOptions={{
						activeBackgroundColor: argonTheme.COLORS.BUTTON_COLOR,
						activeTintColor: "white",
						labelStyle: { fontSize: 20 },
					}}
					drawerContent={(props) => {
						return (
							<DrawerContentScrollView {...props}>
								<DrawerItem
									label={() => (
										<View
											style={{ flexDirection: "row", alignItems: "center" }}
										>
											<Image
												source={logo}
												style={{ width: 55, height: 55 }}
											></Image>
											<Text h5>Vit Grocery Shop</Text>
										</View>
									)}
								></DrawerItem>
								<DrawerItemList {...props} />
								<DrawerItem
									labelStyle={{ fontSize: 20 }}
									label="Logout"
									onPress={() => {
										signOut();
									}}
								/>
							</DrawerContentScrollView>
						);
					}}
				>
					<Drawer.Screen name="Home" component={HomeStack} />
					<Drawer.Screen name="Cart" component={CartStack} />
					<Drawer.Screen name="Contact" component={Contact} />
				</Drawer.Navigator>
			)}
		</AuthContext.Consumer>
	);
}
