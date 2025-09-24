(function(w, d, s, o) {
  'use strict';
  
  // Configuration
  var config = {
    botId: null,
    position: 'bottom-right',
    color: '#25D366',
    size: 'medium',
    welcomeMessage: 'Hi! How can I help you today?',
    showAvatar: true,
    showTyping: true,
    apiUrl: 'https://your-domain.com/api'
  };

  // Extract configuration from data attributes
  function extractConfig() {
    var script = d.currentScript || d.getElementsByTagName('script')[d.getElementsByTagName('script').length - 1];
    
    if (script) {
      config.botId = script.getAttribute('data-bot-id');
      config.position = script.getAttribute('data-position') || config.position;
      config.color = script.getAttribute('data-color') || config.color;
      config.size = script.getAttribute('data-size') || config.size;
      config.welcomeMessage = script.getAttribute('data-welcome-message') || config.welcomeMessage;
      config.showAvatar = script.getAttribute('data-show-avatar') !== 'false';
      config.showTyping = script.getAttribute('data-show-typing') !== 'false';
      config.apiUrl = script.getAttribute('data-api-url') || config.apiUrl;
    }
  }

  // Widget HTML
  function createWidgetHTML() {
    var sizeClasses = {
      small: 'w-12 h-12',
      medium: 'w-14 h-14',
      large: 'w-16 h-16'
    };

    var positionClasses = {
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4'
    };

    var chatSizeClasses = {
      small: 'w-80 h-96',
      medium: 'w-96 h-[500px]',
      large: 'w-[420px] h-[600px]'
    };

    return `
      <div id="whatsapp-widget" class="fixed ${positionClasses[config.position]} z-50" style="display: none;">
        <!-- Chat Window -->
        <div id="chat-window" class="${chatSizeClasses[config.size]} bg-white rounded-lg shadow-2xl border border-gray-200 mb-4 overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between p-4 text-white" style="background-color: ${config.color}">
            <div class="flex items-center gap-3">
              ${config.showAvatar ? '<div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>' : ''}
              <div>
                <h3 class="font-semibold">AI Assistant</h3>
                <p class="text-xs opacity-90">Online</p>
              </div>
            </div>
            <button id="close-chat" class="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- Messages -->
          <div id="messages-container" class="flex-1 overflow-y-auto p-4 space-y-4 max-h-80">
            <div class="flex justify-start">
              <div class="max-w-xs px-4 py-2 rounded-lg bg-gray-100 text-gray-800">
                <p class="text-sm">${config.welcomeMessage}</p>
                <p class="text-xs opacity-70 mt-1">${new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>

          <!-- Input -->
          <div class="p-4 border-t border-gray-200">
            <div class="flex gap-2">
              <input id="message-input" type="text" placeholder="Type your message..." 
                     class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <button id="send-button" class="px-4 py-2 rounded-lg text-white transition-colors" 
                      style="background-color: ${config.color}">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Widget Button -->
        <button id="widget-button" class="${sizeClasses[config.size]} rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center text-white" 
                style="background-color: ${config.color}">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
        </button>
      </div>
    `;
  }

  // Widget functionality
  function initWidget() {
    if (!config.botId) {
      console.error('WhatsApp Widget: botId is required');
      return;
    }

    // Create widget HTML
    var widgetHTML = createWidgetHTML();
    d.body.insertAdjacentHTML('beforeend', widgetHTML);

    var widget = d.getElementById('whatsapp-widget');
    var chatWindow = d.getElementById('chat-window');
    var widgetButton = d.getElementById('widget-button');
    var closeButton = d.getElementById('close-chat');
    var messageInput = d.getElementById('message-input');
    var sendButton = d.getElementById('send-button');
    var messagesContainer = d.getElementById('messages-container');

    var isOpen = false;
    var conversationId = getConversationId();

    // Show/hide chat
    function toggleChat() {
      isOpen = !isOpen;
      widget.style.display = isOpen ? 'block' : 'none';
      chatWindow.style.display = isOpen ? 'block' : 'none';
      
      if (isOpen) {
        messageInput.focus();
      }
    }

    // Get or create conversation ID
    function getConversationId() {
      var key = 'conversation_' + config.botId;
      var conversationId = localStorage.getItem(key);
      if (!conversationId) {
        conversationId = 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem(key, conversationId);
      }
      return conversationId;
    }

    // Add message to chat
    function addMessage(content, role) {
      var messageDiv = d.createElement('div');
      messageDiv.className = 'flex ' + (role === 'user' ? 'justify-end' : 'justify-start');
      
      var messageContent = d.createElement('div');
      messageContent.className = 'max-w-xs px-4 py-2 rounded-lg ' + 
        (role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800');
      
      messageContent.innerHTML = '<p class="text-sm">' + content + '</p>' +
        '<p class="text-xs opacity-70 mt-1">' + new Date().toLocaleTimeString() + '</p>';
      
      messageDiv.appendChild(messageContent);
      messagesContainer.appendChild(messageDiv);
      
      // Scroll to bottom
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Show typing indicator
    function showTyping() {
      var typingDiv = d.createElement('div');
      typingDiv.className = 'flex justify-start';
      typingDiv.id = 'typing-indicator';
      
      var typingContent = d.createElement('div');
      typingContent.className = 'bg-gray-100 text-gray-800 px-4 py-2 rounded-lg';
      typingContent.innerHTML = '<div class="flex items-center gap-1">' +
        '<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>' +
        '<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>' +
        '<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>' +
        '</div>';
      
      typingDiv.appendChild(typingContent);
      messagesContainer.appendChild(typingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Hide typing indicator
    function hideTyping() {
      var typingIndicator = d.getElementById('typing-indicator');
      if (typingIndicator) {
        typingIndicator.remove();
      }
    }

    // Send message
    function sendMessage() {
      var message = messageInput.value.trim();
      if (!message) return;

      // Add user message
      addMessage(message, 'user');
      messageInput.value = '';

      // Show typing indicator
      if (config.showTyping) {
        showTyping();
      }

      // Send to API
      fetch(config.apiUrl + '/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          botId: config.botId,
          message: message,
          conversationId: conversationId
        })
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        hideTyping();
        
        if (data.success) {
          addMessage(data.data.response, 'assistant');
        } else {
          addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
        }
      })
      .catch(function(error) {
        console.error('Error sending message:', error);
        hideTyping();
        addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
      });
    }

    // Event listeners
    widgetButton.addEventListener('click', toggleChat);
    closeButton.addEventListener('click', toggleChat);
    sendButton.addEventListener('click', sendMessage);
    
    messageInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Show widget button
    widget.style.display = 'block';
  }

  // Initialize when DOM is ready
  if (d.readyState === 'loading') {
    d.addEventListener('DOMContentLoaded', function() {
      extractConfig();
      initWidget();
    });
  } else {
    extractConfig();
    initWidget();
  }

})(window, document, 'script');
