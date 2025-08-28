import React, { useRef } from "react";
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { View } from "react-native";
import { useTheme } from "react-native-paper";

const ProfileCards = ({nos}) => {
    const theme = useTheme();
    const count = nos && nos > 0 ? Array.apply(null, Array(nos)).map(function (y, i) { return i; }) : Array.apply(null, Array(3)).map(function (y, i) { return i; });

    // console.log(count);
    return (
        <>
            {count.map(i => (<View key={`loader-${i}`} style={{marginBottom: 15, width: '100%'}}>
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
            </View>))}
        </>
    )
}

export default ProfileCards;