import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { borderRadius, spacing, shadow } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/hooks/useTheme';
import PageHeader from '@/components/PageHeader';
import { useAuth } from '@/context/AuthContext';
import { sabanaCoinsApi } from '@/api/sabana-coins';
import { cardsApi } from '@/api/cards';
import type { SabanaCoinsLedgerEntry, SavedCard } from '@/types';

export default function PaymentsScreen() {
  const router = useRouter();
  const { t } = useSettings();
  const { colors, typography } = useTheme();
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'cards' | 'coins'>('cards');

  const [balance, setBalance] = useState<number | null>(null);
  const [ledger, setLedger] = useState<SabanaCoinsLedgerEntry[]>([]);
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [loading, setLoading] = useState(true);

  const p = t.payments;

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const [balanceRes, ledgerRes, cardsRes] = await Promise.all([
        sabanaCoinsApi.getBalance(token),
        sabanaCoinsApi.getLedger(token),
        cardsApi.getMyCards(token),
      ]);
      setBalance(balanceRes.balance);
      setLedger(ledgerRes);
      setCards(cardsRes);
    } catch {
      setBalance(0);
      setLedger([]);
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchData();
    }, [fetchData])
  );

  const removeCard = (cardId: string) => {
    if (!token) return;
    Alert.alert(t.common.delete, '¿Estás seguro de eliminar esta tarjeta?', [
      { text: t.common.cancel, style: 'cancel' },
      { text: t.common.delete, style: 'destructive', onPress: async () => {
        try {
          await cardsApi.deleteCard(token, cardId);
          setCards((prev) => prev.filter((c) => c.id !== cardId));
        } catch {
          Alert.alert('Error', 'No se pudo eliminar la tarjeta');
        }
      } },
    ]);
  };

  const getCardIcon = (brand: string) => {
    switch (brand) {
      case 'Visa': return 'card';
      case 'Mastercard': return 'card';
      case 'Amex': return 'card';
      default: return 'card';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Hace unos minutos';
    if (hours < 24) return `Hace ${hours} horas`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `Hace ${days} días`;
    return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
      <PageHeader
        title={p.title}
        rightAction={
          <TouchableOpacity onPress={() => router.push('/payments/add-card')}>
            <Ionicons name="add" size={24} color={colors.primary.contrast} />
          </TouchableOpacity>
        }
      />

      <View style={[styles.coinsBanner, { backgroundColor: '#FEF3C7', marginHorizontal: spacing.lg, marginTop: spacing.lg, borderRadius: borderRadius.lg, padding: spacing.md }]}>
        <View style={[styles.coinsIcon, { width: 48, height: 48, borderRadius: borderRadius.full, backgroundColor: colors.background.card, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md }]}>
          <Ionicons name="trophy" size={24} color="#F59E0B" />
        </View>
        <View>
          <Text style={[styles.coinsBalance, { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: '#92400E', fontFamily: typography.family.bold }]}>{loading ? '...' : balance ?? 0} Sabana Coins</Text>
          <Text style={[styles.coinsSubtext, { fontSize: typography.sizes.sm, color: '#A16207', fontFamily: typography.family.regular }]}>Disponible para usar en reservas</Text>
        </View>
      </View>

      <View style={[styles.tabContainer, { backgroundColor: colors.background.card, borderBottomColor: colors.border.default, borderBottomWidth: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md }]}>
        <TouchableOpacity style={[styles.tab, { paddingVertical: spacing.sm, marginRight: spacing.lg, borderBottomWidth: 2, borderBottomColor: 'transparent' }, activeTab === 'cards' && { borderBottomColor: colors.secondary.default }]} onPress={() => setActiveTab('cards')}>
          <Text style={[styles.tabText, { fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text.muted, fontFamily: typography.family.medium }, activeTab === 'cards' && { color: colors.secondary.default, fontWeight: typography.weights.semibold }]}>Tarjetas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, { paddingVertical: spacing.sm, marginRight: spacing.lg, borderBottomWidth: 2, borderBottomColor: 'transparent' }, activeTab === 'coins' && { borderBottomColor: colors.secondary.default }]} onPress={() => setActiveTab('coins')}>
          <Text style={[styles.tabText, { fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text.muted, fontFamily: typography.family.medium }, activeTab === 'coins' && { color: colors.secondary.default, fontWeight: typography.weights.semibold }]}>Historial Coins</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'cards' && (
          <>
            {loading ? (
              <ActivityIndicator size="large" color={colors.secondary.default} style={{ marginTop: spacing.xl }} />
            ) : cards.length === 0 ? (
              <Text style={[styles.emptyText, { fontSize: typography.sizes.md, color: colors.text.muted, textAlign: 'center', marginTop: spacing.xl, fontFamily: typography.family.regular }]}>No hay tarjetas guardadas</Text>
            ) : (
              cards.map((card) => (
                <View key={card.id} style={[styles.cardItem, { backgroundColor: colors.background.card, borderRadius: borderRadius.lg, padding: spacing.md, marginHorizontal: spacing.lg, marginBottom: spacing.md, ...shadow.sm }]}>
                  <View style={[styles.cardInfo, { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }]}>
                    <Ionicons name={getCardIcon(card.brand) as any} size={28} color={colors.secondary.default} />
                    <View style={[styles.cardDetails, { flex: 1, marginLeft: spacing.md }]}>
                      <Text style={[styles.cardBrand, { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.text.primary, fontFamily: typography.family.semibold }]}>{card.brand} •••{card.last_four}</Text>
                      <Text style={[styles.cardExpiry, { fontSize: typography.sizes.sm, color: colors.text.muted, fontFamily: typography.family.regular }]}>Vence {card.exp_month.toString().padStart(2, '0')}/{card.exp_year}</Text>
                    </View>
                    {card.is_default && (
                      <View style={[styles.defaultBadge, { backgroundColor: colors.tertiary.default + '20', paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.sm }]}>
                        <Text style={[styles.defaultBadgeText, { fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold, color: colors.tertiary.default, fontFamily: typography.family.semibold }]}>Principal</Text>
                      </View>
                    )}
                  </View>
                  <View style={[styles.cardActions, { flexDirection: 'row', justifyContent: 'center', borderTopWidth: 1, borderTopColor: colors.border.default, paddingTop: spacing.sm }]}>
                    <TouchableOpacity style={[styles.cardAction, { paddingHorizontal: spacing.md, paddingVertical: spacing.xs }]} onPress={() => removeCard(card.id)}>
                      <Text style={[styles.cardActionText, { fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, fontFamily: typography.family.medium }, { color: colors.status.error }]}>{t.common.delete}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
            <TouchableOpacity style={[styles.addCardButton, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background.card, borderRadius: borderRadius.lg, paddingVertical: spacing.lg, marginHorizontal: spacing.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border.default, borderStyle: 'dashed' }]} onPress={() => router.push('/payments/add-card')}>
                <Ionicons name="add-circle-outline" size={24} color={colors.secondary.default} />
                <Text style={[styles.addCardText, { fontSize: typography.sizes.md, color: colors.secondary.default, fontWeight: typography.weights.medium, marginLeft: spacing.sm, fontFamily: typography.family.medium }]}>{p.addCard}</Text>
              </TouchableOpacity>
          </>
        )}

        {activeTab === 'coins' && (
          <View>
            <Text style={[styles.coinsHistoryTitle, { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text.primary, marginHorizontal: spacing.lg, marginBottom: spacing.md, fontFamily: typography.family.bold }]}>Movimientos de Sabana Coins</Text>
            {loading ? (
              <ActivityIndicator size="large" color={colors.secondary.default} style={{ marginTop: spacing.xl }} />
            ) : ledger.length === 0 ? (
              <Text style={[styles.emptyText, { fontSize: typography.sizes.md, color: colors.text.muted, textAlign: 'center', marginTop: spacing.xl, fontFamily: typography.family.regular }]}>No hay movimientos aún</Text>
            ) : (
              ledger.map((item) => (
                <View key={item.id} style={[styles.coinHistoryItem, { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background.card, borderRadius: borderRadius.lg, padding: spacing.md, marginHorizontal: spacing.lg, marginBottom: spacing.sm, ...shadow.sm }]}>
                  <View style={[styles.coinHistoryIcon, { width: 36, height: 36, borderRadius: borderRadius.full, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md }, { backgroundColor: item.amount < 0 ? colors.status.errorBg : '#FEF3C7' }]}>
                    <Ionicons name={item.amount < 0 ? 'arrow-down' : 'arrow-up'} size={16} color={item.amount < 0 ? colors.status.error : '#F59E0B'} />
                  </View>
                  <View style={[styles.coinHistoryInfo, { flex: 1 }]}>
                    <Text style={[styles.coinHistoryDesc, { fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text.primary, fontFamily: typography.family.medium }]}>{item.description || 'Transacción'}</Text>
                    <Text style={[styles.coinHistoryDate, { fontSize: typography.sizes.sm, color: colors.text.muted, fontFamily: typography.family.regular }]}>{formatDate(item.created_at)}</Text>
                  </View>
                  <Text style={[styles.coinHistoryAmount, { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, fontFamily: typography.family.bold }, { color: item.amount < 0 ? colors.status.error : colors.status.success }]}>{item.amount > 0 ? `+${item.amount}` : item.amount}</Text>
                </View>
              ))
            )}
          </View>
        )}
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  coinsBanner: {},
  coinsIcon: {},
  coinsBalance: {},
  coinsSubtext: {},
  tabContainer: {},
  tab: {},
  tabText: {},
  cardItem: {},
  cardInfo: {},
  cardDetails: {},
  cardBrand: {},
  cardExpiry: {},
  defaultBadge: {},
  defaultBadgeText: {},
  cardActions: {},
  cardAction: {},
  cardActionText: {},
  addCardButton: { gap: spacing.sm },
  addCardText: {},
  coinsHistoryTitle: {},
  coinHistoryItem: {},
  coinHistoryIcon: {},
  coinHistoryInfo: {},
  coinHistoryDesc: {},
  coinHistoryDate: {},
  coinHistoryAmount: {},
});
