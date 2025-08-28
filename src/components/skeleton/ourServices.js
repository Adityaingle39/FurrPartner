import React, { useRef } from "react";
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import ProfileCards from "./cards";

const OurServices = ({nos}) => {
    const theme = useTheme();
    const count = nos && nos > 0 ? Array.apply(null, Array(nos)).map(function (y, i) { return i; }) : Array.apply(null, Array(3)).map(function (y, i) { return i; });

    return (
        <>
        <View style={{marginVertical: 15, paddingHorizontal: 15}}>
            <SkeletonPlaceholder borderRadius={4} highlightColor={theme.colors.outline} backgroundColor={theme.colors.surfaceVariant}>
                <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginBottom={10}>
                    <SkeletonPlaceholder.Item width={'50%'} height={30} borderRadius={20} />
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between" width={'100%'} height={40}>
                    <SkeletonPlaceholder.Item width={'22%'} height={40} borderRadius={15} />
                    <SkeletonPlaceholder.Item width={'22%'} height={40} borderRadius={15} />
                    <SkeletonPlaceholder.Item width={'22%'} height={40} borderRadius={15} />
                    <SkeletonPlaceholder.Item width={'22%'} height={40} borderRadius={15} />
                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
        </View>
        <View style={{backgroundColor: theme.colors.surface, margin: 15, padding: 15, borderRadius: 15}}>
            <SkeletonPlaceholder borderRadius={4} highlightColor={theme.colors.outline} backgroundColor={theme.colors.surfaceVariant}>
                <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
                    <SkeletonPlaceholder.Item width={'100%'} height={180} borderRadius={20} />
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between" paddingVertical={15}>
                    <SkeletonPlaceholder.Item flexDirection="column" alignItems="flex-start" width={'75%'} height={35}>
                        <SkeletonPlaceholder.Item width={'80%'} height={15} borderRadius={20} />
                        <SkeletonPlaceholder.Item width={'100%'} height={15} borderRadius={20} marginTop={5} />
                    </SkeletonPlaceholder.Item>
                    <SkeletonPlaceholder.Item width={'15%'} height={35} borderRadius={20} /> 
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between">
                    <SkeletonPlaceholder.Item width={'40%'} height={30} borderRadius={20} />
                    <SkeletonPlaceholder.Item width={'20%'} height={30} borderRadius={20} />
                    <SkeletonPlaceholder.Item width={'20%'} height={30} borderRadius={20} />
                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
        </View>
        <View style={{margin: 15, padding: 15, borderRadius: 15}}>
            <SkeletonPlaceholder borderRadius={4} highlightColor={theme.colors.outline} backgroundColor={theme.colors.surfaceVariant}>
                <SkeletonPlaceholder.Item width={'50%'} height={30} borderRadius={20} alignContent="center" alignSelf="center" />
            </SkeletonPlaceholder>
        </View>
        </>
    )
}

export default OurServices;