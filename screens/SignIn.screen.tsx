import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Snackbar, Text, TextInput, TouchableRipple} from 'react-native-paper';
import {StackNavigationProp} from '@react-navigation/stack';
import {SIGN_IN_SCREEN, SIGN_UP_SCREEN} from "../navigation/navigation.constants";

// type SignInScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignIn'>;

type Props = {
    navigation: any; // SignInScreenNavigationProp
};

const SignInScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleSignIn = async () => {
        setLoading(true);
        // Here you would normally call an API to handle authentication
        // For example purposes, I'll just set a timeout to simulate an async request
        setTimeout(() => {
            setLoading(false);
            // const success = Math.random() > 0.5; // randomly decide if login is successful
            //
            // if (success) {
            //     // Navigate to the main screen if login is successful
            //     navigation.replace('MainScreen'); // Use 'navigate' or 'replace' based on your flow
            // } else {
            //     // If login fails, show an error message
            //     setError('Invalid credentials. Please try again.');
            // }
        }, 2000);
    };

    return (
        <View style={styles.container}>
            {/*{loading && <ActivityIndicator size="large" />}*/}
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
            />
            <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry
                style={styles.input}
            />
            <Button
                mode="contained"
                onPress={handleSignIn}
                style={styles.button}
                disabled={loading}
                loading={loading}
            >
                Sign In
            </Button>
            <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableRipple onPress={() => navigation.navigate(SIGN_UP_SCREEN)}>
                    <Text style={styles.signUpButtonText}>Sign Up</Text>
                </TouchableRipple>
            </View>
            <Snackbar
                visible={!!error}
                onDismiss={() => setError('')}
                action={{
                    label: 'Close',
                    onPress: () => {
                        setError('');
                    },
                }}
            >
                {error}
            </Snackbar>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    input: {
        marginBottom: 10,
    },
    button: {
        marginTop: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    footerText: {
        fontSize: 16,
        color: '#000', // or any color that suits your design
    },
    signUpButtonText: {
        fontSize: 16,
        color: '#673AB7',
        fontWeight: 'bold',
    },
});

export default SignInScreen;
