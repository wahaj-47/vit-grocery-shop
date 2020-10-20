import React from "react";
import { SafeAreaView, View, StyleSheet, Linking } from "react-native";
import { Icon, Text } from "galio-framework";

export default function Contact({ navigation }) {
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={styles.container}>
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
							Contact Us
						</Text>
					</View>
				</View>
				<View>
					<Text h5 style={styles.info}>
						@vitgroceryshop
					</Text>
					<Text h5 style={styles.info}>
						<Icon name="phone" family="Ionicons"></Icon> +44 (0) 7947794644
					</Text>
					<Text
						onPress={() => {
							Linking.openURL("mailto:info@vitgroceryshop.com");
						}}
						h5
						style={styles.info}
					>
						<Icon name="mail" family="Ionicons"></Icon> info@vitgroceryshop.com
					</Text>
					<Text
						onPress={() => {
							Linking.openURL("vitgroceryshop.online");
						}}
						h5
						style={styles.info}
					>
						<Icon name="globe" family="Entypo"></Icon> vitgroceryshop.online
					</Text>
					<Text
						onPress={() => {
							Linking.openURL("https://www.facebook.com/vitgroceryshop");
						}}
						h5
						style={styles.info}
					>
						<Icon name="facebook" family="Feather"></Icon> Vit Grocery Shop
					</Text>
					<Text
						onPress={() => {
							Linking.openURL("https://www.instagram.com/vitgroceryshop/");
						}}
						h5
						style={styles.info}
					>
						<Icon name="instagram" family="Feather"></Icon> Vit_grocery_Shop
					</Text>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 20,
	},
	headerLeft: { flexDirection: "row", alignItems: "center" },
	header: {
		paddingVertical: 20,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	socials: {
		flexDirection: "row",
		paddingVertical: 30,
		alignItems: "center",
		justifyContent: "space-evenly",
	},
	info: {
		marginVertical: 5,
	},
});
