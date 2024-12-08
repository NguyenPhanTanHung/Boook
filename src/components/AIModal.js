import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, FlatList, Image } from 'react-native';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { geminiAPI } from '../../secret';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { boookdata } from '../../excelBook';

const AIModal = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), text: newMessage, sender: 'You' }]);
    setNewMessage('');
    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(geminiAPI);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(`Imagine you are an AI assistant named Gemini, dedicated to supporting users of the Book_Chili app. Book_Chili is a platform that specializes in providing personalized book recommendations based on users' interests, reading habits, and favorite genres. Your role is to engage with users in a friendly, knowledgeable, and helpful manner. You will:
        Help users discover new books tailored to their preferences.
        Provide detailed summaries, reviews, and ratings of books when asked in Vietnamese.
        Suggest reading lists for specific moods, themes, or occasions.
        Assist users in tracking their reading progress within the app.
        Address any technical or account-related questions about Book_Chili.
        You aim to create a delightful and seamless experience for every reader. Always maintain a tone that is enthusiastic about literature and empathetic to users' reading needs.`);
      setMessages(prev => [...prev, { id: Date.now().toString(), text: result.response.text(), sender: 'AI' }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), text: 'Error: Unable to process your request.', sender: 'AI' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo nằm ở giữa phía trên */}
      <View style={styles.header}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="close" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Giao diện chat */}
      <View style={styles.chatArea}>
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          style={styles.chatBox}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.sender === 'You' ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
        />

        {/* Input box */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={loading}
            style={[styles.button, loading ? styles.buttonDisabled : null]}
          >
            <Text style={styles.buttonText}>{loading ? '...' : 'Send'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AIModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: 120,
    height: 40,
  },
  closeButton: {
    padding: 5,
  },
  chatArea: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  chatBox: {
    flex: 1,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 40,
    marginRight: 10,
    backgroundColor: '#f8f9fa',
    color: '#333',
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  buttonDisabled: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
    paddingHorizontal: 15,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#007BFF',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFE4B5', // Đổi màu khung chat của AI sang màu be sáng
    borderColor: '#FFD700', // Viền màu vàng nhạt để tạo điểm nhấn
    borderWidth: 1,
  },
  messageText: {
    color: '#fff',
    fontSize: 14,
  },
});
