const { peer } = require('./peer');

let file;

// Function to initiate file sharing
function shareFile() {
    if (file) {
        const channelLabel = file.name;
        const channel = peer.createDataChannel(channelLabel);
        channel.binaryType = 'arraybuffer';

        channel.onopen = async () => {
            const arrayBuffer = await file.arrayBuffer();
            for (let i = 0; i < arrayBuffer.byteLength; i += MAXIMUM_MESSAGE_SIZE) {
                channel.send(arrayBuffer.slice(i, i + MAXIMUM_MESSAGE_SIZE));
            }
            channel.send(END_OF_FILE_MESSAGE);
        };

        channel.onclose = () => {
            closeDialog();
        };
    }
}

// Function to close the file sharing dialog
function closeDialog() {
    document.getElementById('select-file-input').value = '';
    document.getElementById('select-file-dialog').style.display = 'none';
}

// Function to download a shared file
function downloadFile(blob, fileName) {
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
}

// Event listener for the "Share File" button click
document.getElementById('share-file-button').addEventListener('click', () => {
    document.getElementById('select-file-dialog').style.display = 'block';
});

// Event listener for the "Cancel" button in the file sharing dialog
document.getElementById('cancel-button').addEventListener('click', () => {
    closeDialog();
});

// Event listener for file selection in the file sharing dialog
document.getElementById('select-file-input').addEventListener('change', (event) => {
    file = event.target.files[0];
    document.getElementById('ok-button').disabled = !file;
});

// Event listener for the "OK" button in the file sharing dialog
document.getElementById('ok-button').addEventListener('click', () => {
    shareFile();
});

module.exports = {
    shareFile,
    closeDialog,
    downloadFile,
};