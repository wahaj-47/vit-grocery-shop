import React from "react";
import { Image, View, StyleSheet, SafeAreaView } from "react-native";
import Swiper from "react-native-swiper";
import articles from "../constants/articles";
import { Text, Block } from "galio-framework";
import {
	ScrollView,
	FlatList,
	TouchableOpacity,
} from "react-native-gesture-handler";
import ArButton from "../components/Button";
import { SharedElement } from "react-navigation-shared-element";
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Icon } from "../components";
import { CartContext } from "../providers/CartProvider";
import FastImage from "react-native-fast-image";
import { TAX } from "../constants";

function Product({ item }) {
	const { item: product } = item;
	return (
		<View styles={styles.productContainer}>
			<FastImage
				source={{ uri: product.image }}
				style={styles.productImage}
			></FastImage>
			<Text style={styles.productTitle}>
				{product.title} x {product.quantity}
			</Text>
		</View>
	);
}

export default function HamperDetails({ navigation, route }) {
	const { item } = route.params;

	console.log(item.description);

	return (
		<CartContext.Consumer>
			{({ addToCart }) => (
				<ScrollView
					onScrollEndDrag={({ nativeEvent }) => {
						if (nativeEvent.contentOffset.y < -50) {
							navigation.pop();
						}
					}}
					showsVerticalScrollIndicator={false}
				>
					<SafeAreaView>
						<View style={styles.container}>
							<Icon
								color="red"
								size={35}
								name="close"
								family="Ionicons"
								style={{ position: "absolute", top: 25, left: 10, zIndex: 100 }}
								onPress={() => {
									navigation.pop();
								}}
							></Icon>
							<SharedElement id={`item.${item.id}.image`}>
								<FastImage
									style={{ width: "100%", height: 400, resizeMode: "cover" }}
									source={{ uri: item?.image }}
								></FastImage>
							</SharedElement>
							<View style={styles.hamperDescription}>
								<Block
									// flex
									row
									space="between"
									style={{ alignItems: "center" }}
								>
									<SharedElement id={`item.${item.id}.title`}>
										<Text h5 bold style={{ width: "75%" }}>
											{item.title}
										</Text>
									</SharedElement>
									<SharedElement id={`item.${item.id}.price`}>
										<Text h5>£{item.price}</Text>
									</SharedElement>
								</Block>
								<SharedElement id={`item.${item.id}.description`}>
									<Text h6>{item.description}</Text>
								</SharedElement>
							</View>

							<ArButton
								style={{ marginVertical: 30, alignSelf: "center" }}
								onPress={() => {
									addToCart({ ...item, tax: (item.price * TAX).toFixed(2) });
								}}
								color="button_color"
							>
								<Text color="white" bold h5>
									Add to cart
								</Text>
							</ArButton>
						</View>
					</SafeAreaView>
				</ScrollView>
			)}
		</CartContext.Consumer>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
	},
	hamperDescription: {
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	productContainer: {
		width: wp("50%"),
		height: 50,
	},
	productImage: {
		height: wp("50%"),
		width: wp("50%"),
	},
	productTitle: {
		position: "absolute",
		bottom: 20,
		color: "white",
		alignSelf: "center",
		fontWeight: "600",
		fontSize: 16,
		backgroundColor: "rgba(0,0,0,0.6)",
		padding: 10,
	},
	productContainerHeader: {
		marginVertical: 10,
		alignSelf: "flex-start",
	},
});
