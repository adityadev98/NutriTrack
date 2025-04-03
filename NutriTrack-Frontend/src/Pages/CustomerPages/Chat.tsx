import { useEffect, useRef, useState } from 'react';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import {
  Avatar,
  Box,
  Button,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
  useToast,
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
} from '@chakra-ui/react';
import { Sidenav } from '../../Components/Sections';
import axiosInstance from '../../utils/axiosInstance';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface ChatAPIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface MealEntry {
  foodName: string;
  eatenWhen: string;
  details: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
  };
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [mealsSummary, setMealsSummary] = useState<string>('');
  const [mealTable, setMealTable] = useState<JSX.Element | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showYesPrompt, setShowYesPrompt] = useState(false);
  const toast = useToast();
  const bottomRef = useRef<HTMLDivElement>(null);
  const userName = JSON.parse(localStorage.getItem('userInfo') || '{}')?.name || 'there';

    const userContext = useContext(UserContext);
    const loggedUser = userContext?.loggedUser || null;


  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const fetchMeals = async () => {
    try {
      const response = await fetch('/api/mealsConsumed', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching meals');
      }

      const data = await response.json();
      const meals: MealEntry[] = data.data;

      const groupedMeals: Record<string, string[]> = {};
      meals.forEach((meal) => {
        const when = meal.eatenWhen.toLowerCase();
        if (!groupedMeals[when]) groupedMeals[when] = [];
        groupedMeals[when].push(meal.foodName);
      });

      // Text summary for GPT
      let summary = '';
      for (const [when, foods] of Object.entries(groupedMeals)) {
        summary += `- ${when}: ${foods.join(', ')}\n`;
      }
      setMealsSummary(summary.trim());

      // Render table for UI
      const table = (
        <Table variant="simple" size="sm" width="fit-content">
          <Thead>
            <Tr>
              <Td fontWeight="bold">Meal</Td>
              <Td fontWeight="bold">Items</Td>
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(groupedMeals).map(([meal, items]) => (
              <Tr key={meal}>
                <Td textTransform="capitalize">{meal}</Td>
                <Td>{items.join(', ')}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      );
      setMealTable(table);

      setMessages([
        {
          role: 'assistant',
          content: `Hi ${userName}! I'm NutriBot 🤖.\n\nHere is what you consumed today:`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      setShowYesPrompt(true);
    } catch (err) {
      console.error('Meal fetch error:', err);
      setMessages([
        {
          role: 'assistant',
          content: "Hi! I'm NutriBot 🤖. I couldn't load your meal history. You can still ask me for diet suggestions!",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  const sendMessage = async (customMessage?: string) => {
    const userInput = customMessage || input.trim();
    if (!userInput) return;

    const timestamp = new Date().toLocaleTimeString();
    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: userInput, timestamp },
    ];

    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await axiosInstance.post('/api/booking/chat', {
        messages: [
          {
            role: 'system',
            content: `You are NutriBot, a friendly nutrition assistant helping ${userName}. Provide personalized diet suggestions. Here's their intake today:\n\n${mealsSummary || 'No recent meals available.'}`,
          },
          ...newMessages.map(({ role, content }) => ({ role, content } as ChatAPIMessage)),
        ],
      });

      const reply = res.data.reply;
      setMessages([
        ...newMessages,
        {
          role: reply.role,
          content: reply.content,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      setShowYesPrompt(false);
    } catch (err) {
      console.error('Error fetching GPT response:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch response from NutriBot.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (mealsSummary) {
      setMessages([
        {
          role: 'assistant',
          content: `Hi again ${userName}! Here's your food summary. Would you like suggestions based on this?`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      setShowYesPrompt(true);
    } else {
      setMessages([
        {
          role: 'assistant',
          content: "Hi! I'm NutriBot 🤖. You can ask me for personalized meal suggestions.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  const getAvatar = (role: 'user' | 'assistant') =>
    role === 'user' ? (
      <Avatar
        name={loggedUser?.name || "User"}
        bg="var(--bright-green)"
        size="sm"
      />
    ) : (
      <Avatar
        name="NutriBot"
        size="sm"
        src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
      />
    );
  

  return (
    <Sidenav>
      <Box bg="white" boxShadow="md" borderRadius="lg" p={0} mb={10}>
        <Box
          bg="var(--dark-green)"
          borderTopRadius="lg"
          px={6}
          py={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading size="lg" color="white">
            Chat with NutriBot
          </Heading>
        </Box>
        <Box p={6} borderBottomRadius="lg" color="var(--dark-green)">
          <Text fontSize="md" fontWeight="medium">
            Ask NutriBot for personalized meal suggestions based on what you've eaten recently.
          </Text>
        </Box>
      </Box>

      <Container maxW="container.sm" py={6}>
        <Box bg="white" boxShadow="md" borderRadius="lg" p={6} minH="60vh">
          <VStack spacing={4} align="stretch">
            <Box overflowY="auto" maxH="50vh" pr={2}>
              {messages.map((msg, idx) => (
                <HStack
                  key={idx}
                  alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                  spacing={3}
                  mb={3}
                >
                  {msg.role === 'assistant' && getAvatar(msg.role)}
                  <Box
                    bg={msg.role === 'user' ? 'blue.100' : 'gray.100'}
                    px={4}
                    py={2}
                    borderRadius="md"
                    maxW="80%"
                  >
                    {msg.role === 'assistant' ? (
                      <>
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                        {idx === 0 && mealTable}
                      </>
                    ) : (
                      <Text fontSize="sm">{msg.content}</Text>
                    )}
                    <Text fontSize="xs" color="gray.500" mt={1} textAlign="right">
                      {msg.timestamp}
                    </Text>
                  </Box>
                  {msg.role === 'user' && getAvatar(msg.role)}
                </HStack>
              ))}
              {loading && (
                <HStack justify="start" mb={2}>
                  {getAvatar('assistant')}
                  <Text fontSize="sm" color="gray.500">
                    NutriBot is thinking...
                  </Text>
                </HStack>
              )}
              <div ref={bottomRef} />
            </Box>

            {showYesPrompt && !loading && (
              <Box textAlign="center">
                <Button
                  size="sm"
                  colorScheme="green"
                  variant="solid"
                  onClick={() => sendMessage('Yes')}
                >
                  Yes, suggest meals
                </Button>
              </Box>
            )}

            <HStack mt={4}>
              <Input
                placeholder="Ask a question or type yes..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                flex={1}
                isDisabled={loading}
              />
              <Button size="sm" colorScheme="red" variant="outline" onClick={clearChat}>
                Clear Chat
              </Button>
              <Button
                colorScheme="green"
                onClick={() => sendMessage()}
                isLoading={loading}
                loadingText="Sending"
              >
                Send
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Container>
    </Sidenav>
  );
};

export default Chat;
