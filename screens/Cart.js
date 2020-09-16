import React from "react";
import { View, StyleSheet, SafeAreaView, Image } from "react-native";
import { Icon } from "../components";
import { Text } from "galio-framework";
import argonTheme from "../constants/Theme";
import { CartContext } from "../providers/CartProvider";
import { FlatList } from "react-native-gesture-handler";
import { Block } from "galio-framework";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import ArButton from "../components/Button";
import { showMessage } from "react-native-flash-message";

export default function Cart({ navigation }) {
	function ListHeaderComponent() {
		return (
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
						Cart
					</Text>
				</View>
			</View>
		);
	}

	function ListFooterComponent({ cart, total }) {
		return (
			<>
				<View style={styles.header}>
					<View style={styles.headerLeft}>
						<Text h5 bold>
							Total
						</Text>
					</View>
					<Text h5>${total}</Text>
				</View>
				<ArButton
					onPress={() => {
						if (cart.length < 1) {
							showMessage({ message: "Cart is empty", type: "info" });
						}
					}}
				>
					<Text h5 color={argonTheme.COLORS.SECONDARY} bold>
						Check Out
					</Text>
				</ArButton>
			</>
		);
	}

	function ListEmptyComponent() {
		return (
			<Text h6 color="grey">
				Cart is empty
			</Text>
		);
	}

	function CartItem({ item, removeFromCart }) {
		return (
			<Block
				card
				flex
				row
				space="between"
				fluid
				width={wp("90%")}
				style={styles.cartItem}
			>
				<Block
					row
					width={wp("25%")}
					space="between"
					style={{ alignItems: "center" }}
				>
					<Image
						source={{ uri: item.products[0].image }}
						style={styles.image}
					></Image>
					<Text h5 bold>
						{item.title}
					</Text>
				</Block>
				<Block
					row
					width={wp("25%")}
					space="between"
					style={{ alignItems: "center" }}
				>
					<Text h5>${item.price}</Text>
					<Icon
						onPress={() => {
							removeFromCart(item);
						}}
						name="close"
						family="Ionicons"
						size={20}
						color="red"
					></Icon>
				</Block>
			</Block>
		);
	}

	return (
		<CartContext.Consumer>
			{({ cart, total, removeFromCart }) => (
				<SafeAreaView style={{ flex: 1 }}>
					<FlatList
						ListHeaderComponent={ListHeaderComponent}
						ListEmptyComponent={ListEmptyComponent}
						ListFooterComponent={
							<ListFooterComponent
								cart={cart}
								total={total}
							></ListFooterComponent>
						}
						style={styles.container}
						data={cart}
						renderItem={({ item, index }) => (
							<CartItem item={item} removeFromCart={removeFromCart}></CartItem>
						)}
					></FlatList>
				</SafeAreaView>
			)}
		</CartContext.Consumer>
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
	image: {
		width: 50,
		height: 50,
	},
	cartItem: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		alignItems: "center",
	},
});
