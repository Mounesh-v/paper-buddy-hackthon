import React, { useState, useCallback, memo } from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Spacing, FontSize } from '@/constants/colors';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const Input: React.FC<InputProps> = memo(({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  icon,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  const containerStyle = [
    styles.container,
    style,
  ];

  const inputContainerStyle = [
    styles.inputContainer,
    isFocused && styles.focused,
    error ? styles.errorBorder : null,
  ];

  const inputStyle = [
    styles.input,
    icon ? styles.inputWithIcon : undefined,
  ];

  return (
    <View style={containerStyle}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={inputContainerStyle}>
        {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
        <TextInput
          style={inputStyle}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
  },
  focused: {
    borderColor: Colors.primary,
  },
  errorBorder: {
    borderColor: Colors.error,
  },
  iconContainer: {
    paddingLeft: Spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  inputWithIcon: {
    paddingLeft: Spacing.sm,
  },
  errorText: {
    fontSize: FontSize.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
});

export default Input;
