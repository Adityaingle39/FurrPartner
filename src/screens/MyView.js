import React, { useEffect, useState } from "react";
import { BackHandler, Linking, Alert, Dimensions, SafeAreaView, useColorScheme } from 'react-native';
import { WebView } from 'react-native-webview';
import { Button, useTheme } from "react-native-paper";

import { useAuthState } from "../services/auth";
import Header from "../components/common/Header";

const MyView = ({ navigation, route }) => {
    const theme = useTheme();
    const colorScheme = useColorScheme();
    const { width, height } = Dimensions.get('window');
    
    const { userData } = useAuthState();

    const [url, setUrl] = useState(route.params?.url);
    const [title, setTitle] = useState(route.params?.title);

    useEffect(() => {
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colorScheme == 'dark' ? theme.colors.background : theme.colors.surfaceVariant }}>
            <Header navigation={navigation} type='back' options={{ title: title ? title : 'Details'}} />
            <WebView
                useWebKit={true}
                useWebView2={true}
                incognito={true}
                originWhitelist={['*']}
                cacheEnabled={false}
                enableApplePay={false}
                geolocationEnabled={true}
                setSupportMultipleWindows={true}
                javaScriptCanOpenWindowsAutomatically={true}
                onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn('WebView error: ', nativeEvent);
                }}
                onShouldStartLoadWithRequest={(request) => {
                    // Only allow navigating within this website
                    if (request.url.includes('mailto:') || request.url.includes('sms:') || request.url.includes('tel:')) {
                        Linking.openURL(request.url);
                        return false;
                    }
                    return true;
                }}
                style={{ flex: 1, backgroundColor: colorScheme == 'dark' ? theme.colors.background : theme.colors.surfaceVariant }}
                source={{ uri: url }} />
        </SafeAreaView>
    );
}

export default MyView;