import { useMemo } from 'react';
import { Theme, useTheme } from '@react-navigation/native'; // Import your theme library
import { ViewStyle, TextStyle, ImageStyle, StyleSheet } from 'react-native'; // Import necessary types from React Native

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

const useThemedStyles = <T extends NamedStyles<T>>(
  getStyles: (theme: Theme) => T
) => {
  const theme = useTheme();

  const styles = useMemo(() => {
    const themedStyles = getStyles(theme);
    return StyleSheet.create(themedStyles);
  }, [theme, getStyles]);

  return styles;
};

// Example usage:
// const MyComponent: React.FC = () => {
//   const getStyles = (theme: Theme) => ({
//     container: {
//       backgroundColor: theme.backgroundColor,
//       color: theme.textColor,
//       // add more styles based on the theme
//     },
//   });

//   const styles = useThemedStyles(getStyles);

//   return (
//     <View style={styles.container}>
//       {/* Your component content */}
//     </View>
//   );
// };

export default useThemedStyles;