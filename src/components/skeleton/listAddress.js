import React, { useRef } from "react";
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { View, Dimensions } from "react-native";
import { useTheme } from "react-native-paper";

const ListAddress = ({nos, style}) => {
    const theme = useTheme();
    const { width, height } = Dimensions.get('window');
    const count = nos && nos > 0 ? Array.apply(null, Array(nos)).map(function (y, i) { return i; }) : Array.apply(null, Array(3)).map(function (y, i) { return i; });
    const contentStyle = style ? style : {marginBottom: 15, paddingHorizontal: 15, width: width};

    // console.log(count);
    return (
        <>
            {count.map(i => (<View key={`loader-${i}`} style={[contentStyle]}>
                <SkeletonPlaceholder borderRadius={4} highlightColor={theme.colors.outline} backgroundColor={theme.colors.surfaceVariant}>
                    <SkeletonPlaceholder.Item width={'100%'} flexDirection="row" justifyContent="space-between" alignItems="center" paddingVertical={15}>
                        <SkeletonPlaceholder.Item width={'9%'} height={35} borderRadius={20} />
                        <SkeletonPlaceholder.Item marginHorizontal={5} marginRight={15} flexDirection="column" alignItems="flex-start" width={'60%'}>
                            <SkeletonPlaceholder.Item width={'80%'} height={15} borderRadius={20} />
                            <SkeletonPlaceholder.Item width={'100%'} height={15} borderRadius={20} marginTop={5} />
                            <SkeletonPlaceholder.Item width={'90%'} height={15} borderRadius={20} marginTop={5} />
                        </SkeletonPlaceholder.Item>
                        <SkeletonPlaceholder.Item width={'9%'} height={35} borderRadius={20} />
                        <SkeletonPlaceholder.Item width={'9%'} height={35} borderRadius={20} />
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
            </View>))}
        </>
    )
}

export default ListAddress;