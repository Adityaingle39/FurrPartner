import { useState } from "react";
import { Animated, View, Image, Platform } from "react-native";
import BootSplash from "react-native-bootsplash";

const AnimatedBootSplash = ({ onAnimationEnd }) => {
  const [opacity] = useState(() => new Animated.Value(1));

  const { container, logo , brand } = BootSplash.useHideAnimation({
    manifest: require("../../assets/bootsplash_manifest.json"),

    logo: require("../../assets/bootsplash_logo.png"),
    // darkLogo: require("../assets/bootsplash_dark_logo.png"),
    // brand: require("../../assets/bootsplash_brand.png"),
    // darkBrand: require("../assets/bootsplash_dark_brand.png"),

    statusBarTranslucent: true,
    navigationBarTranslucent: false,

    animate: () => {
      // Perform animations and call onAnimationEnd
      Animated.timing(opacity, {
        useNativeDriver: true,
        toValue: 0,
        duration: 1500,
      }).start(() => {
        onAnimationEnd();
      });
    },
  });

  return (
    <Animated.View {...container} style={[container.style, { opacity }]}>
      <View style={[container.style, {marginTop: Platform.OS == 'android' ? -10 : 0}]}>
        <Image {...logo} style={logo.style} />
        {/* {brand && <Image {...brand} style={brand.style} />} */}
      </View>
    </Animated.View>
  );
};

export default AnimatedBootSplash;
