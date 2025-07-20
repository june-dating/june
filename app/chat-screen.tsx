import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Keyboard,
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

// Message interface
interface Message {
  id: number;
  text: string;
  sender: "user" | "other";
  timestamp: string;
  isAudio: boolean;
}

const otherUser = {
  name: "Aija Mayrock",
  photo: require("../assets/images/aija5.jpg"),
  isOnline: true,
};

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageIdCounter, setMessageIdCounter] = useState(1);

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: messageIdCounter,
        text: message.trim(),
        sender: "user",
        timestamp: formatTime(),
        isAudio: false,
      };

      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
      setMessageIdCounter((prev) => prev + 1);

      // Close keyboard
      Keyboard.dismiss();

      // Auto-reply after a short delay
      setTimeout(() => {
        const replyMessage: Message = {
          id: messageIdCounter + 1,
          text: "Hey, what's up?",
          sender: "other",
          timestamp: formatTime(),
          isAudio: false,
        };
        setMessages((prev) => [...prev, replyMessage]);
        setMessageIdCounter((prev) => prev + 2);
      }, 1000);
    }
  };

  const handleAudioPress = () => {
    setIsRecording(!isRecording);
    console.log("Audio recording:", !isRecording);
  };

  const handleBackPress = () => {
    router.push("/dashboard");
  };

  const renderMessage = (msg: Message) => {
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
          <View
            style={[
              styles.messageWithTimestamp,
              isUser && styles.userMessageWithTimestamp,
            ]}
          >
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
              <Text style={styles.aiPersonaText}>
                Chat with Aija's AI persona
              </Text>
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
        contentContainerStyle={[
          styles.messagesContent,
          messages.length === 0 && styles.emptyMessagesContent,
        ]}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateImageContainer}>
              <Image source={otherUser.photo} style={styles.emptyStateImage} />
            </View>
            <Text style={styles.emptyStateTitle}>Start a conversation</Text>
            <Text style={styles.emptyStateSubtitle}>
              Say hello to Aija's AI persona and start chatting!
            </Text>
          </View>
        ) : (
          messages.map(renderMessage)
        )}
      </ScrollView>

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View
          style={[styles.inputWrapper, { paddingBottom: insets.bottom + 10 }]}
        >
          <View style={styles.inputRow}>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Type a message..."
                placeholderTextColor="#999"
                value={message}
                onChangeText={setMessage}
                multiline
                maxLength={500}
                returnKeyType="send"
                onSubmitEditing={handleSendMessage}
                blurOnSubmit={false}
              />
            </View>

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

            <TouchableOpacity
              style={[
                styles.sendButton,
                !message.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!message.trim()}
            >
              <Ionicons name="arrow-up" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
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
    marginBottom: 1,
  },
  onlineText: {
    color: "#666",
    fontSize: 12,
    fontWeight: "400",
    marginBottom: 2,
  },
  aiPersonaText: {
    color: "#9440DD",
    fontSize: 11,
    fontWeight: "500",
    fontStyle: "italic",
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
  emptyMessagesContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyStateContainer: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyStateImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(148, 64, 221, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 3,
    borderColor: "rgba(148, 64, 221, 0.2)",
  },
  emptyStateImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  messageContainer: {
    marginBottom: 20,
    paddingHorizontal: 2,
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
    minWidth: "50%",
    maxWidth: "80%",
  },
  userMessageWithTimestamp: {
    minWidth: "50%",
    maxWidth: "85%",
  },
  messageBubble: {
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    // marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 48,
    justifyContent: "center",
  },
  userBubble: {
    backgroundColor: "#9440DD",
    borderBottomRightRadius: 8,
    alignSelf: "flex-end",
    shadowColor: "#9440DD",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    // Add gradient effect through background
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    // Override horizontal padding to reduce right padding
    paddingLeft: 20,
    paddingRight: 12,
  },
  otherBubble: {
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    // Add subtle inner shadow effect
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.02)",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    color: "#333",
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  userText: {
    color: "#ffffff",
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 6,
    marginHorizontal: 8,
    fontWeight: "500",
    opacity: 0.7,
  },
  userTimestamp: {
    color: "#666",
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
  inputWrapper: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 54,
    maxHeight: 120,
    borderWidth: 1.5,
    borderColor: "rgba(148, 64, 221, 0.1)",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textInput: {
    fontSize: 16,
    color: "#333",
    maxHeight: 80,
    paddingTop: 0,
    paddingBottom: 0,
    textAlignVertical: "center",
    lineHeight: 22,
    fontWeight: "500",
  },
  audioButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(148, 64, 221, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  audioButtonRecording: {
    backgroundColor: "#ff4444",
    borderColor: "#ff4444",
    shadowColor: "#ff4444",
    shadowOpacity: 0.3,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#9440DD",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#9440DD",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  sendButtonDisabled: {
    backgroundColor: "#d1d5db",
    shadowOpacity: 0,
    elevation: 0,
    borderColor: "rgba(0,0,0,0.1)",
  },
});
