import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Mock chat messages
const mockMessages = [
  {
    id: 1,
    text: "Hey! How's your day going?",
    sender: "user",
    timestamp: "2:30 PM",
    isAudio: false,
  },
  {
    id: 2,
    text: "Hi there! It's been great, thanks for asking 😊",
    sender: "other",
    timestamp: "2:32 PM",
    isAudio: false,
  },
  {
    id: 3,
    text: "That's awesome! I just finished a great workout at the gym",
    sender: "user",
    timestamp: "2:33 PM",
    isAudio: false,
  },
  {
    id: 4,
    text: "Nice! I love staying active too. What kind of workout?",
    sender: "other",
    timestamp: "2:35 PM",
    isAudio: false,
  },
  {
    id: 5,
    text: "🎵 Audio Message (0:12)",
    sender: "user",
    timestamp: "2:36 PM",
    isAudio: true,
  },
];

const otherUser = {
  name: "Aija Mayrock",
  photo: require("../assets/images/img1.jpg"),
  isOnline: true,
};

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add send message logic here
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleAudioPress = () => {
    setIsRecording(!isRecording);
    console.log("Audio recording:", !isRecording);
  };

  const handleBackPress = () => {
    router.push("/dashboard");
  };

  const renderMessage = (msg: any) => {
    const isUser = msg.sender === "user";

    return (
      <View
        key={msg.id}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.otherMessage,
        ]}
      >
        <View style={styles.messageContent}>
          {!isUser && (
            <Image source={otherUser.photo} style={styles.avatarSmall} />
          )}
          <View style={styles.messageWithTimestamp}>
            <View
              style={[
                styles.messageBubble,
                isUser ? styles.userBubble : styles.otherBubble,
              ]}
            >
              {msg.isAudio ? (
                <View style={styles.audioMessage}>
                  <TouchableOpacity style={styles.audioPlayButton}>
                    <Ionicons
                      name="play"
                      size={14}
                      color={isUser ? "#fff" : "#9440DD"}
                    />
                  </TouchableOpacity>
                  <Text style={[styles.audioText, isUser && styles.userText]}>
                    {msg.text}
                  </Text>
                </View>
              ) : (
                <Text style={[styles.messageText, isUser && styles.userText]}>
                  {msg.text}
                </Text>
              )}
            </View>
            <Text
              style={[
                styles.timestamp,
                isUser ? styles.userTimestamp : styles.otherTimestamp,
              ]}
            >
              {msg.timestamp}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Background gradient */}
      <LinearGradient
        colors={["#f8f9fa", "#ffffff", "#f1f3f4"]}
        style={styles.backgroundGradient}
      />

      {/* Header */}
      <BlurView
        intensity={95}
        tint="light"
        style={[styles.header, { paddingTop: insets.top + 10 }]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#333" />
          </TouchableOpacity>

          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Image source={otherUser.photo} style={styles.avatar} />
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.headerName}>{otherUser.name}</Text>
              <Text style={styles.onlineText}>Active now</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-vertical" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </BlurView>

      {/* Messages */}
      <ScrollView
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesContent}
      >
        {mockMessages.map(renderMessage)}
      </ScrollView>

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.inputContainer, { paddingBottom: insets.bottom + 20 }]}
      >
        <BlurView intensity={95} tint="light" style={styles.inputBlur}>
          <View style={styles.inputRow}>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Message..."
                placeholderTextColor="#999"
                value={message}
                onChangeText={setMessage}
                multiline
                maxLength={500}
              />

              <View style={styles.inputActions}>
                <TouchableOpacity
                  style={[
                    styles.audioButton,
                    isRecording && styles.audioButtonRecording,
                  ]}
                  onPress={handleAudioPress}
                  onLongPress={handleAudioPress}
                >
                  {isRecording ? (
                    <MaterialIcons name="stop" size={18} color="#fff" />
                  ) : (
                    <Ionicons name="mic" size={18} color="#666" />
                  )}
                </TouchableOpacity>

                {message.trim() && (
                  <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSendMessage}
                  >
                    <Ionicons name="arrow-up" size={18} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </BlurView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 15,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.08)",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#00ff88",
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  userDetails: {
    flex: 1,
  },
  headerName: {
    color: "#333",
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 2,
  },
  onlineText: {
    color: "#666",
    fontSize: 12,
    fontWeight: "400",
  },
  moreButton: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageContainer: {
    marginBottom: 16,
  },
  messageContent: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  userMessage: {
    alignSelf: "flex-end",
  },
  otherMessage: {
    alignSelf: "flex-start",
  },
  messageWithTimestamp: {
    maxWidth: "75%",
  },
  messageBubble: {
    padding: 14,
    borderRadius: 20,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: "#9440DD",
    borderBottomRightRadius: 6,
    alignSelf: "flex-end",
  },
  otherBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    color: "#333",
    fontWeight: "400",
  },
  userText: {
    color: "#fff",
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    marginHorizontal: 8,
    fontWeight: "400",
  },
  userTimestamp: {
    color: "#999",
    textAlign: "right",
  },
  otherTimestamp: {
    color: "#999",
    textAlign: "left",
  },
  audioMessage: {
    flexDirection: "row",
    alignItems: "center",
  },
  audioPlayButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  audioText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "400",
  },
  inputContainer: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  inputBlur: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 5,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.04)",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "flex-end",
    minHeight: 48,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    maxHeight: 80,
    paddingTop: 0,
    paddingBottom: 0,
  },
  inputActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: 8,
  },
  audioButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  audioButtonRecording: {
    backgroundColor: "#ff4444",
    borderColor: "#ff4444",
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#9440DD",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#9440DD",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
