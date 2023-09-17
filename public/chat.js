const socket = io('/');

// Function to handle user connections
socket.on('user-connected', (userId) => {
    // Handle user connection (e.g., connecting to a new user)
    setTimeout(() => {
        connectToNewUser(userId, myVideoStream);
    }, 1000);
});

// Function to handle sending and displaying chat messages
function setupChat() {
    const textInput = document.querySelector('input');
    const messagesContainer = document.querySelector('.messages');

    // Listen for keypress events in the input field
    textInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && textInput.value.trim() !== '') {
            // Emit a message to the server
            socket.emit('message', textInput.value);
            textInput.value = ''; // Clear the input field
        }
    });

    // Listen for incoming chat messages from the server
    socket.on('createMessage', (message) => {
        // Append the message to the messages container
        messagesContainer.innerHTML += `<li class="message"><b>User:</b><br />${message}</li>`;
        scrolltoBottom(); // Scroll to the bottom to display the new message
    });
}

// Function to scroll to the bottom of the chat window
function scrolltoBottom() {
    const chatWindow = document.querySelector('.main__chat__window');
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

module.exports = {
    setupChat,
};