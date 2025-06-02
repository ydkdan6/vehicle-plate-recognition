import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle
} from 'react-native';
import { COLORS, FONT, SIZES } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  type = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left'
}) => {
  // Button styles based on type
  const getButtonStyles = () => {
    switch (type) {
      case 'primary':
        return {
          backgroundColor: disabled ? COLORS.primary[300] : COLORS.primary[500],
          borderWidth: 0
        };
      case 'secondary':
        return {
          backgroundColor: disabled ? COLORS.secondary[200] : COLORS.secondary[500],
          borderWidth: 0
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: disabled ? COLORS.primary[300] : COLORS.primary[500]
        };
      case 'danger':
        return {
          backgroundColor: disabled ? '#FFADA8' : COLORS.error,
          borderWidth: 0
        };
      default:
        return {
          backgroundColor: disabled ? COLORS.primary[300] : COLORS.primary[500],
          borderWidth: 0
        };
    }
  };

  // Text color based on type
  const getTextColor = () => {
    switch (type) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return COLORS.white;
      case 'outline':
        return disabled ? COLORS.primary[300] : COLORS.primary[500];
      default:
        return COLORS.white;
    }
  };

  // Button size
  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: SIZES.padding.xs,
          paddingHorizontal: SIZES.padding.md,
          borderRadius: SIZES.radius.sm
        };
      case 'large':
        return {
          paddingVertical: SIZES.padding.lg,
          paddingHorizontal: SIZES.padding.xl,
          borderRadius: SIZES.radius.md
        };
      case 'medium':
      default:
        return {
          paddingVertical: SIZES.padding.md,
          paddingHorizontal: SIZES.padding.lg,
          borderRadius: SIZES.radius.md
        };
    }
  };

  // Text size
  const getTextSize = () => {
    switch (size) {
      case 'small':
        return {
          fontSize: FONT.size.sm,
          fontWeight: FONT.weight.medium
        };
      case 'large':
        return {
          fontSize: FONT.size.lg,
          fontWeight: FONT.weight.bold
        };
      case 'medium':
      default:
        return {
          fontSize: FONT.size.md,
          fontWeight: FONT.weight.semibold
        };
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        styles.button,
        getButtonStyles(),
        getButtonSize(),
        style
      ]}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator size="small\" color={getTextColor()} />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text
            style={[
              styles.text,
              { color: getTextColor() },
              getTextSize(),
              icon && iconPosition === 'left' && { marginLeft: 8 },
              icon && iconPosition === 'right' && { marginRight: 8 },
              textStyle
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  }
});

export default Button;