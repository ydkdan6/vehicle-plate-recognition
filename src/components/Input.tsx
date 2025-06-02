import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInputProps,
  ViewStyle,
  TextStyle
} from 'react-native';
import { COLORS, FONT, SIZES } from '../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: ViewStyle;
  secureTextEntry?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  labelStyle,
  inputStyle,
  secureTextEntry,
  icon,
  iconPosition = 'left',
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer,
        error ? { borderColor: COLORS.error } : null,
        inputStyle
      ]}>
        {icon && iconPosition === 'left' && (
          <View style={styles.iconLeft}>
            {icon}
          </View>
        )}
        
        <TextInput
          style={[
            styles.input,
            icon && iconPosition === 'left' && { paddingLeft: 40 },
            icon && iconPosition === 'right' && { paddingRight: 40 },
            secureTextEntry && { paddingRight: 50 }
          ]}
          placeholderTextColor={COLORS.secondary[500]}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <View style={styles.iconRight}>
            {icon}
          </View>
        )}
        
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={togglePasswordVisibility}
          >
            <Text style={styles.toggleText}>
              {isPasswordVisible ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.margin.md,
  },
  label: {
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.medium,
    marginBottom: SIZES.margin.xs,
    color: COLORS.secondary[700],
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.secondary[300],
    borderRadius: SIZES.radius.md,
    backgroundColor: COLORS.white,
    position: 'relative',
  },
  input: {
    paddingHorizontal: SIZES.padding.md,
    paddingVertical: SIZES.padding.md,
    fontSize: FONT.size.md,
    color: COLORS.text.primary,
  },
  iconLeft: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
  iconRight: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
  toggleButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
  toggleText: {
    color: COLORS.primary[500],
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.medium,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT.size.xs,
    marginTop: SIZES.margin.xs,
  },
});

export default Input;