import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

export default function PendingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors, typography, spacing, borderRadius, shadow } = useTheme();

  const paymentStatus = params.collection_status || params.status || '';
  const reference = params.external_reference || params.externalReference || params.preference_id || '';
  const description = paymentStatus
    ? `El pago quedó en estado ${paymentStatus}. Revisa Mis viajes para confirmar la reserva.`
    : 'Tu pago está en proceso. Revisa el estado nuevamente en unos minutos desde Mis viajes.';
  const referenceText = reference ? `Reserva: #${reference}` : 'Puedes verificar tu reserva en Mis viajes cuando esté disponible.';

  return (
    <View style={[styles.container, { backgroundColor: colors.background.default }]}> 
      <View style={[styles.card, { backgroundColor: colors.background.card, borderColor: colors.border.default, ...shadow.md, borderRadius: borderRadius.lg }]}> 
        <View style={[styles.iconBox, { backgroundColor: colors.status.warningBg }]}> 
          <Ionicons name="time" size={52} color={colors.status.warning} />
        </View>
        <Text style={[styles.title, { color: colors.text.primary, fontFamily: typography.family.bold }]}>Pago pendiente ⏳</Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary, fontFamily: typography.family.regular }]}>{description}</Text>
        <Text style={[styles.note, { color: colors.text.muted, fontFamily: typography.family.medium }]}>{referenceText}</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.secondary.default }]}
            onPress={() => router.replace('/(tabs)/home')}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, { color: colors.secondary.contrast, fontFamily: typography.family.semibold }]}>Volver al menú</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: colors.secondary.default }]}
            onPress={() => router.replace('/bookings')}
            activeOpacity={0.8}
          >
            <Text style={[styles.secondaryText, { color: colors.secondary.default, fontFamily: typography.family.semibold }]}>Ver Mis viajes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    padding: 28,
    alignItems: 'center',
    gap: 18,
  },
  iconBox: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  note: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  buttonsContainer: {
    width: '100%',
    marginTop: 20,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 16,
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  secondaryText: {
    fontSize: 16,
  },
});
