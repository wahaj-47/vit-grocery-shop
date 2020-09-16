import React from "react";
import { Cart } from "../screens";
import {
	createDrawerNavigator,
	DrawerContentScrollView,
	DrawerItem,
	DrawerItemList,
} from "@react-navigation/drawer";
import HomeStack from "./HomeStack";
import { AuthContext } from "../providers/AuthProvider";

const Drawer = createDrawerNavigator();

export default function RootDrawer() {
	return (
		<AuthContext.Consumer>
			{({ signOut }) => (
				<Drawer.Navigator
					initialRouteName="Home"
					screenOptions={{ headerShown: false }}
					drawerContent={(props) => {
						return (
							<DrawerContentScrollView {...props}>
								<DrawerItemList {...props} />
								<DrawerItem
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
					<Drawer.Screen name="Cart" component={Cart} />
				</Drawer.Navigator>
			)}
		</AuthContext.Consumer>
	);
}
