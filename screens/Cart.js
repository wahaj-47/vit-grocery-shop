import React, { useState } from "react";
import {
	View,
	StyleSheet,
	SafeAreaView,
	Image,
	ActivityIndicator,
} from "react-native";
import { Icon } from "../components";
import { Text } from "galio-framework";
import argonTheme from "../constants/Theme";
import { CartContext } from "../providers/CartProvider";
import { FlatList } from "react-native-gesture-handler";
import { Block } from "galio-framework";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import ArButton from "../components/Button";
import { showMessage } from "react-native-flash-message";
import FastImage from "react-native-fast-image";
import { DELIVERY_CHARGES, TAX } from "../constants";

export default function Cart({ navigation }) {
	const [processing, setProcessing] = useState(false);

	function ListHeaderComponent({ cart }) {
		return (
			<View style={styles.header}>
				<View>
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
				{cart.length > 0 && (
					<View>
						<Text style={styles.numItems}>
							Number of items in cart: {cart.length}
						</Text>
					</View>
				)}
			</View>
		);
	}

	function ListFooterComponent({ cart, total }) {
		return (
			<>
				<View style={styles.header}>
					<View style={styles.headerLeft}>
						<Text h6>Delivery Charges</Text>
						<Text h6>VAT 20%</Text>
						<Text h5 bold>
							Total
						</Text>
					</View>
					<View style={styles.headerRight}>
						<Text h6>£{DELIVERY_CHARGES.toFixed(2)}</Text>
						<Text h6>£{(total * TAX).toFixed(2)}</Text>
						<Text h5>
							£{(total + DELIVERY_CHARGES + total * TAX).toFixed(2)}
						</Text>
					</View>
				</View>
				<ArButton
					color="button_color"
					onPress={() => {
						if (cart.length < 1) {
							showMessage({ message: "Cart is empty", type: "info" });
						} else {
							// setProcessing(true);
							navigation.navigate("Shipping", { total });
							// functions()
							// 	.httpsCallable("createClientToken")()
							// 	.then((response) => {
							// 		makePayment(response.data.clientToken, total);
							// 	});
						}
					}}
				>
					{!processing ? (
						<Text h5 color={argonTheme.COLORS.SECONDARY} bold>
							Check Out
						</Text>
					) : (
						<ActivityIndicator color="white"></ActivityIndicator>
					)}
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
					width={wp("30%")}
					space="between"
					style={{ alignItems: "center" }}
				>
					<FastImage
						source={{ uri: item?.image }}
						style={styles.image}
					></FastImage>
					<Text h6 bold style={{ marginLeft: 10 }}>
						{item.title}
					</Text>
				</Block>
				<Block
					row
					width={wp("25%")}
					space="between"
					style={{ alignItems: "center" }}
				>
					<Text h5>£{item.price}</Text>
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
						ListHeaderComponent={
							<ListHeaderComponent cart={cart}></ListHeaderComponent>
						}
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
	headerLeft: { alignItems: "flex-start" },
	headerRight: { alignItems: "flex-end" },
	image: {
		width: 50,
		height: 50,
	},
	cartItem: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		alignItems: "center",
	},
	numItems: {
		fontSize: 16,
	},
});
