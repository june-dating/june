import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { InsightCard as InsightCardType } from "../../types/ProfileTypes";
import InsightCard from "./InsightCard";

const INSIGHT_CARDS: InsightCardType[] = [
  {
    id: "thinks",
    title: "June thinks you're a...",
    icon: "brain",
    color: "#8B5CF6",
    iconLibrary: "MaterialCommunityIcons",
    route: "/Profilescreens/june-thinks",
  },
  {
    id: "tips",
    title: "Tips to be a Better Date",
    icon: "bulb",
    color: "#F59E0B",
    iconLibrary: "Ionicons",
    route: "/Profilescreens/june-tips",
  },
  {
    id: "looking",
    title: "June is looking for someone who is...",
    icon: "heart",
    color: "#EF4444",
    iconLibrary: "Ionicons",
    route: "/Profilescreens/june-looking-for",
    isFullWidth: true,
  },
];

const ANIMATION_CONFIG = {
  fadeIn: {
    delay: 200,
    duration: 800,
  },
};

export default function InsightCardsSection() {
  return (
    <Animated.View
      style={styles.cardsSection}
      entering={FadeInUp.delay(400).duration(ANIMATION_CONFIG.fadeIn.duration)}
    >
      <View style={styles.cardsRow}>
        {INSIGHT_CARDS.slice(0, 2).map((card) => (
          <InsightCard
            key={card.id}
            title={card.title}
            icon={card.icon}
            color={card.color}
            iconLibrary={card.iconLibrary}
            onPress={() => router.push(card.route as any)}
          />
        ))}
      </View>

      <View style={styles.singleCardRow}>
        {INSIGHT_CARDS.slice(2).map((card) => (
          <InsightCard
            key={card.id}
            title={card.title}
            icon={card.icon}
            color={card.color}
            iconLibrary={card.iconLibrary}
            onPress={() => router.push(card.route as any)}
            isFullWidth={card.isFullWidth}
          />
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardsSection: {
    marginTop: 32,
    marginBottom: 40,
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  singleCardRow: {
    alignItems: "center",
  },
});
