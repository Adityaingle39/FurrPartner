import React, { useRef } from "react";
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { View } from "react-native";
import { useTheme } from "react-native-paper";

const ImageCard = ({nos}) => {
    const theme = useTheme();
    const count = nos && nos > 0 ? Array.apply(null, Array(nos)).map(function (y, i) { return i; }) : Array.apply(null, Array(3)).map(function (y, i) { return i; });

    // console.log(count);
    return (<View style={{marginBottom: 15}}>
        <SkeletonPlaceholder borderRadius={4} highlightColor={theme.colors.outline} backgroundColor={theme.colors.surfaceVariant}>
            <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
                <SkeletonPlaceholder.Item width={'100%'} height={200} borderRadius={15} />
            </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
    </View>);
}

export default ImageCard;