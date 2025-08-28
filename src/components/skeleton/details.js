import React, { useRef } from "react";
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { View } from "react-native";
import { useTheme } from "react-native-paper";

const DetailsCards = () => {
    const theme = useTheme();

    // console.log(count);
    return (
        <SkeletonPlaceholder borderRadius={4} highlightColor={theme.colors.outline} backgroundColor={theme.colors.surfaceVariant}>
            <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginBottom={15}>
                <SkeletonPlaceholder.Item width={'100%'} height={180} borderRadius={20} />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between" marginBottom={15}>
                <SkeletonPlaceholder.Item flexDirection="column" alignItems="flex-start" width={'100%'} height={50}>
                    <SkeletonPlaceholder.Item width={'80%'} height={15} borderRadius={20} />
                    <SkeletonPlaceholder.Item width={'100%'} height={15} borderRadius={20} marginTop={5} />
                    <SkeletonPlaceholder.Item width={'50%'} height={15} borderRadius={20} marginTop={5} />
                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between" marginBottom={15}>
                <SkeletonPlaceholder.Item width={'40%'} height={30} borderRadius={20} />
                <SkeletonPlaceholder.Item width={'30%'} height={30} borderRadius={20} />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item marginBottom={25}>
                <SkeletonPlaceholder.Item width={'50%'} height={20} borderRadius={20} marginTop={15}/>
                <SkeletonPlaceholder.Item width={'100%'} height={15} borderRadius={20} marginTop={5} />
                <SkeletonPlaceholder.Item width={'98%'} height={15} borderRadius={20} marginTop={5} />
                <SkeletonPlaceholder.Item width={'90%'} height={15} borderRadius={20} marginTop={5} />
                <SkeletonPlaceholder.Item width={'95%'} height={15} borderRadius={20} marginTop={5} />
                <SkeletonPlaceholder.Item width={'40%'} height={15} borderRadius={20} marginTop={5} />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item flexDirection="row" justifyContent="flex-start" marginBottom={10}>
                <SkeletonPlaceholder.Item width={'20%'} height={15} borderRadius={20} marginRight={25} />
                <SkeletonPlaceholder.Item width={'30%'} height={15} borderRadius={20} />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item flexDirection="row" justifyContent="flex-start" marginBottom={45}>
                <SkeletonPlaceholder.Item width={'20%'} height={15} borderRadius={20} marginRight={25} />
                <SkeletonPlaceholder.Item width={'30%'} height={15} borderRadius={20} />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between" marginBottom={45}>
                <SkeletonPlaceholder.Item width={'100%'} height={80} borderRadius={20} />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between" marginBottom={15}>
                <SkeletonPlaceholder.Item width={50} height={50} borderRadius={50} />
                <SkeletonPlaceholder.Item width={'80%'} height={50} borderRadius={20} />
            </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
    )
}

export default DetailsCards;