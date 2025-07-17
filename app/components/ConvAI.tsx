// components/ConvAI.tsx
"use dom";

import { useConversation } from "@elevenlabs/react";
import { Mic } from "lucide-react-native";
import React, { useCallback } from "react";
import { Pressable, StyleSheet, View } from "react-native";

async function requestMic() {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return true;
  } catch {
    alert("Microphone permission denied");
    return false;
  }
}

export default function ConvAI({ agentId }: { agentId: string }) {
  const conv = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (msg) => console.log(msg),
    onError: (e) => console.error(e),
  });

  const toggle = useCallback(async () => {
    if (conv.status === "disconnected") {
      if (!(await requestMic())) return;
      await conv.startSession({ agentId, connectionType: "webrtc" });
    } else {
      await conv.endSession();
    }
  }, [conv, agentId]);

  return (
    <Pressable
      onPress={toggle}
      style={[styles.btn, conv.status === "connected" && styles.on]}
    >
      <View
        style={[styles.inner, conv.status === "connected" && styles.innerOn]}
      >
        <Mic size={32} color="#FFF" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#8B5FBF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#5E2CA5",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  on: {
    backgroundColor: "#E9D8FD",
    shadowColor: "#8B5FBF",
  },
  inner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#5E2CA5",
    justifyContent: "center",
    alignItems: "center",
  },
  innerOn: {
    backgroundColor: "#8B5FBF",
  },
});
