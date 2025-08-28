import React, { useRef } from "react";
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { View } from "react-native";
import { useTheme } from "react-native-paper";

const TrendingRolls = ({nos}) => {
    const theme = useTheme();
    const count = nos && nos > 0 ? Array.apply(null, Array(nos)).map(function (y, i) { return i; }) : Array.apply(null, Array(3)).map(function (y, i) { return i; });

    return (
        <View style={{marginVertical: 15, paddingHorizontal: 10, height: 170}}>
            <SkeletonPlaceholder borderRadius={4} highlightColor={theme.colors.outline} backgroundColor={theme.colors.surfaceVariant}>
                <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginBottom={10}>
                    <SkeletonPlaceholder.Item width={'50%'} height={30} borderRadius={20} />
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between" width={'100%'} height={150}>
                    <SkeletonPlaceholder.Item width={'30%'} height={150} borderRadius={15} />
                    <SkeletonPlaceholder.Item width={'30%'} height={150} borderRadius={15} />
                    <SkeletonPlaceholder.Item width={'30%'} height={150} borderRadius={15} />
                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
        </View>
    )
}

export default TrendingRolls;