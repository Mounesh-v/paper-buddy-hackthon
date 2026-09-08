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
import { Colors, Spacing, FontSize } from '@/constants/colors';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { register, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
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
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, email, password, confirmPassword]);

  const handleRegister = useCallback(async () => {
    if (isSubmitting) return;
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const result = await register({
        name: name.trim(),
        email: email.trim(),
        password: password,
        phoneNumber: phoneNumber.trim() || undefined,
      });

      if (result.success) {
        router.replace('/(tabs)' as any);
      } else {
        Alert.alert('Registration Failed', result.error || 'Please try again');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  }, [name, email, phoneNumber, password, validate, register, router, isSubmitting]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Register as a parent</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            autoCapitalize="words"
            error={errors.name}
            icon={
              <Ionicons name="person-outline" size={20} color={Colors.textMuted} />
            }
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            icon={
              <Ionicons name="mail-outline" size={20} color={Colors.textMuted} />
            }
          />

          <Input
            label="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            icon={
              <Ionicons name="call-outline" size={20} color={Colors.textMuted} />
            }
          />

          <View style={styles.passwordContainer}>
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              secureTextEntry={!showPassword}
              error={errors.password}
              icon={
                <Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} />
              }
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.showPassword}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={Colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            secureTextEntry={!showPassword}
            error={errors.confirmPassword}
            icon={
              <Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} />
            }
          />

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={isLoading || isSubmitting}
            size="lg"
            style={styles.registerButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.footerLink}>Sign In</Text>
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
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
    padding: 4,
  },
  registerButton: {
    marginTop: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
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
