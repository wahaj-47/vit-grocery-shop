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
import argonTheme from "../constants/Theme";
import { AuthContext } from "../providers/AuthProvider";

export default function SignUp({ navigation }) {
	const [email, setEmail] = useState("");

	return (
		<AuthContext.Consumer>
			{({ resetPassword, isLoading }) => (
				<View style={styles.container}>
					<Text h1 bold style={styles.heading}>
						Forgot Password
					</Text>

					<Input
						autoCompleteType="email"
						placeholder="Email"
						value={email}
						onChangeText={(value) => {
							setEmail(value);
						}}
					></Input>

					<Button
						style={styles.btn}
						onPress={() => {
							resetPassword(email);
						}}
						color="button_color"
					>
						{!isLoading ? (
							<Text size={20} color="white" bold>
								Send Email
							</Text>
						) : (
							<ActivityIndicator color="white"></ActivityIndicator>
						)}
					</Button>
					<Text size={16} style={styles.signUp}>
						Already have an account ?{" "}
						<Text
							onPress={() => {
								navigation.navigate("Login");
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
