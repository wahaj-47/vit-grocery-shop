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
import argonTheme from "../constants/Theme";
import { AuthContext } from "../providers/AuthProvider";
import logo from "../assets/imgs/logo-2.png";
import { widthPercentageToDP } from "react-native-responsive-screen";

export default function SignUp({ navigation }) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	return (
		<AuthContext.Consumer>
			{({ signUp, isLoading }) => (
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
					<Text h3 bold style={styles.heading}>
						Sign Up
					</Text>
					<Input
						placeholder="Name"
						value={name}
						onChangeText={(value) => {
							setName(value);
						}}
					></Input>
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
					<Button
						style={styles.btn}
						onPress={() => {
							signUp(email, password, name);
						}}
						color="button_color"
					>
						{!isLoading ? (
							<Text size={20} color="white" bold>
								Sign Up
							</Text>
						) : (
							<ActivityIndicator color="white"></ActivityIndicator>
						)}
					</Button>
					<Text size={16} style={styles.signUp}>
						Already have an account ?{" "}
						<Text
							onPress={() => {
								navigation.pop();
							}}
							color={argonTheme.COLORS.BUTTON_COLOR}
						>
							Log In
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
	},
	btn: {
		marginTop: 20,
	},
	signUp: {
		marginTop: 20,
	},
	heading: {
		alignSelf: "flex-start",
		marginBottom: 20,
		color: "#142F6B",
	},
});
