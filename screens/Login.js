import React, { useState } from "react";
import {
	StyleSheet,
	SafeAreaView,
	View,
	ActivityIndicator,
	Image,
} from "react-native";
import { Card, Icon, Input, Button } from "../components";
import { FlatList } from "react-native-gesture-handler";
import { Text } from "galio-framework";
import { argonTheme } from "../constants";
import { AuthContext } from "../providers/AuthProvider";
import logo from "../assets/imgs/logo-2.png";
import { widthPercentageToDP } from "react-native-responsive-screen";

export default function Login({ navigation }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	return (
		<AuthContext.Consumer>
			{({ signIn, isLoading }) => (
				<View style={styles.container}>
					<Image
						source={logo}
						style={{
							width: widthPercentageToDP("90"),
							height: widthPercentageToDP("30%"),
							marginBottom: 10,
						}}
						resizeMode="contain"
					/>
					{/* <Text h1 bold style={styles.heading}>
						Vit Grocery Shop
					</Text> */}
					<Input
						autoCompleteType="email"
						placeholder="Email"
						value={email}
						onChangeText={(value) => {
							setEmail(value);
						}}
					></Input>
					<Input
						secureTextEntry
						placeholder="Password"
						value={password}
						onChangeText={(value) => {
							setPassword(value);
						}}
					></Input>
					<Text
						onPress={() => {
							navigation.push("Forgot");
						}}
						style={styles.forgotPassword}
						size={16}
					>
						Forgot Password ?
					</Text>

					<Button
						style={styles.btn}
						onPress={() => {
							signIn(email, password);
						}}
						color="button_color"
					>
						{!isLoading ? (
							<Text size={20} color="white" bold>
								Login
							</Text>
						) : (
							<ActivityIndicator color="white"></ActivityIndicator>
						)}
					</Button>
					<Text size={16} style={styles.signUp}>
						Don't have an account ?{" "}
						<Text
							onPress={() => {
								navigation.push("SignUp");
							}}
							color={argonTheme.COLORS.BUTTON_COLOR}
						>
							Sign Up
						</Text>
					</Text>
				</View>
			)}
		</AuthContext.Consumer>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 20,
		backgroundColor: "white",
	},
	btn: {
		marginTop: 25,
	},
	signUp: {
		marginTop: 20,
	},
	heading: {
		alignSelf: "flex-start",
		marginBottom: 20,
	},
	forgotPassword: {
		alignSelf: "flex-end",
		color: "grey",
	},
});
