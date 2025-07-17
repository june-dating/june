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
    /* your styles */
  },
  on: {
    /* active style */
  },
  inner: {
    /* inner view */
  },
  innerOn: {
    /* inner active */
  },
});
