import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, FlatList } from 'react-native';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { geminiAPI } from '../../secret'
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const AIModal = ({ onClose }) => {
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
      const result = await model.generateContent(newMessage);
      setMessages(prev => [...prev, { id: Date.now().toString(), text: result.response.text(), sender: 'AI' }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), text: 'Error: Unable to process your request.', sender: 'AI' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ position: "absolute", top: 15, right: 15, borderWidth: 0, width: 50, height: 50, borderWidth: 1, justifyContent:'center', alignItems:'center' }}
        onPress={onClose}
      >
        <MaterialIcons name="close" size={30} />
      </TouchableOpacity>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Text style={item.sender === 'You' ? styles.userMessage : styles.aiMessage}>
            {item.text}
          </Text>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
        />
        <TouchableOpacity onPress={handleSendMessage} disabled={loading} style={styles.button}>
          <Text style={styles.buttonText}>{loading ? '...' : 'Send'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AIModal;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#cce5ff', padding: 10, margin: 5, borderRadius: 5 },
  aiMessage: { alignSelf: 'flex-start', backgroundColor: '#f1f1f1', padding: 10, margin: 5, borderRadius: 5 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderColor: '#ccc', padding: 5 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginRight: 5 },
  button: { backgroundColor: '#007BFF', borderRadius: 5, padding: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
