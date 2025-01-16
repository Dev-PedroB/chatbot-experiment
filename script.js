const API_KEY = '';  //ADD YOU API KEY HERE (OBS: free accounts can return a max quota reached error)

document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addMessage(message, true);
        userInput.value = '';
        sendButton.disabled = true;

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{
                        role: "user",
                        content: message
                    }],
                    max_tokens: 150
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                const botResponse = data.choices[0].message.content;
                addMessage(botResponse);
            } else {
                const errorMessage = data.error?.message || 'Something went wrong';
                addMessage(`Error: ${errorMessage}. Please check your API key and quota.`);
                console.error('OpenAI API Error:', data.error);
            }
        } catch (error) {
            console.error('Network Error:', error);
            addMessage('Error: Could not connect to ChatGPT. Please check your internet connection and API key.');
        } finally {
            sendButton.disabled = false;
        }
    }

    
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
