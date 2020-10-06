import React, { useState } from "react";
import {
	StyleSheet,
	SafeAreaView,
	View,
	ActivityIndicator,
} from "react-native";
import { Card, Icon, Input, Button } from "../components";
import { FlatList } from "react-native-gesture-handler";
import { Text } from "galio-framework";
import { argonTheme } from "../constants";
import { AuthContext } from "../providers/AuthProvider";

export default function SignUp({ navigation }) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	return (
		<AuthContext.Consumer>
			{({ signUp, isLoading }) => (
				<View style={styles.container}>
					<Text h1 bold style={styles.heading}>
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
	},
});