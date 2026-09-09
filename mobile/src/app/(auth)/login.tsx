import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  Colors,
  Spacing,
  FontSize,
  BorderRadius,
  LetterSpacing,
  Shadows,
} from '@/constants/colors';

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }, [email, password]);

  const handleLogin = useCallback(async () => {
    if (isSubmitting) return;
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const result = await login(email.trim(), password);
      if (result.success) {
        router.replace('/(tabs)' as any);
      } else {
        Alert.alert('Login Failed', result.error || 'Please try again');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  }, [email, password, validate, login, router, isSubmitting]);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="school" size={48} color={Colors.primary} />
          </View>

          <Text style={styles.title}>Welcome Back</Text>

          <Text style={styles.subtitle}>Sign in to your parent account</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={handleEmailChange}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.email}
            icon={
              <Ionicons name="mail-outline" size={20} color={Colors.textMuted} />
            }
          />

          <View style={styles.passwordContainer}>
            <Input
              label="Password"
              value={password}
              onChangeText={handlePasswordChange}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.password}
              icon={
                <Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} />
              }
            />

            <TouchableOpacity
              onPress={() => setShowPassword((prev) => !prev)}
              style={styles.showPassword}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={21}
                color={Colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => router.push('/(auth)/forgot-password' as any)}
            style={styles.forgotPassword}
            activeOpacity={0.7}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login */}
          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading || isSubmitting}
            size="lg"
            style={styles.loginButton}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{'Don\u0027t have an account? '}</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register' as any)}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
  },

  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },

  logoContainer: {
    width: 84,
    height: 84,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primary + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '22',
    ...Shadows.sm,
  },

  title: {
    fontSize: FontSize.xxxl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
    letterSpacing: LetterSpacing.tight,
  },

  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  form: {
    gap: Spacing.xs,
  },

  passwordContainer: {
    position: 'relative',
  },

  showPassword: {
    position: 'absolute',
    right: 16,
    top: 38,
    padding: 5,
    zIndex: 10,
  },

  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
    paddingVertical: 4,
  },

  forgotPasswordText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
  },

  loginButton: {
    marginTop: Spacing.sm,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
  },

  footerText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },

  footerLink: {
    fontSize: FontSize.md,
    color: Colors.primary,
    fontWeight: '600',
  },
});
