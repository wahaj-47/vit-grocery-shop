import React, { useContext, useEffect } from "react";
import { StyleSheet, SafeAreaView, View, Image } from "react-native";
import { Card, Icon } from "../components";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { Text } from "galio-framework";
import argonTheme from "../constants/Theme";
import { HamperContext } from "../providers/HamperProvider";
import { CartContext } from "../providers/CartProvider";
import { ConstantsContext } from "../providers/ConstantsProvider";
import logo from "../assets/imgs/logo-2.png";
import { widthPercentageToDP } from "react-native-responsive-screen";

export default function Homescreen({ navigation }) {
	const { getHampers } = useContext(HamperContext);
	const { getConstants } = useContext(ConstantsContext);

	useEffect(() => {
		getHampers();
		getConstants();
	}, []);

	function ListHeaderComponent() {
		return (
			<CartContext.Consumer>
				{({ cart }) => (
					<>
						{/* <Image
							source={logo}
							style={{
								width: widthPercentageToDP("90"),
								height: widthPercentageToDP("30%"),
								marginBottom: 10,
							}}
							resizeMode="contain"
						/> */}
						<View style={styles.header}>
							<View style={styles.headerLeft}>
								<Icon
									onPress={() => {
										navigation.openDrawer();
									}}
									name="menu"
									family="Ionicons"
									size={25}
									style={{ marginRight: 10 }}
								></Icon>
								<Text h1 bold>
									Shop
								</Text>
							</View>
							<TouchableOpacity
								onPress={() => {
									navigation.jumpTo("Cart");
								}}
							>
								<Icon
									name="shopping-cart"
									family="FontAwesome5"
									size={36}
									style={{ marginRight: 10 }}
								></Icon>
								{cart.length > 0 && (
									<View style={styles.badge}>
										<Text style={styles.badgeNumber}>{cart.length}</Text>
									</View>
								)}
							</TouchableOpacity>
						</View>
					</>
				)}
			</CartContext.Consumer>
		);
	}

	return (
		<HamperContext.Consumer>
			{({ hampers }) => (
				<SafeAreaView>
					<FlatList
						ListHeaderComponent={ListHeaderComponent}
						style={styles.container}
						data={hampers}
						renderItem={({ item, index }) => (
							<Card
								full
								key={item.id}
								item={item}
								onPress={() => {
									navigation.push("Hamper", { item });
								}}
							></Card>
						)}
					></FlatList>
				</SafeAreaView>
			)}
		</HamperContext.Consumer>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 20,
	},
	header: {
		paddingVertical: 20,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	headerLeft: { flexDirection: "row", alignItems: "center" },
	badge: {
		backgroundColor: argonTheme.COLORS.BUTTON_COLOR,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 50,
		position: "absolute",
		bottom: 0,
		right: 5,
		width: 20,
		height: 20,
	},
	badgeNumber: {
		color: "white",
		fontSize: 10,
	},
});
