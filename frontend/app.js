const socket = io.connect('http://localhost:3000');

socket.on('data_saved', (data) => {
    const dataContainer = document.getElementById('data-container');
    const dataElement = document.createElement('div');
    dataElement.classList.add('data-entry');
    
    const timestamp = new Date(data.timestamp).toLocaleTimeString();
    dataElement.innerHTML = `<p><strong>Name:</strong> ${data.name}</p>
                              <p><strong>Origin:</strong> ${data.origin}</p>
                              <p><strong>Destination:</strong> ${data.destination}</p>
                              <p><strong>Timestamp:</strong> ${timestamp}</p>`;
    
    dataContainer.appendChild(dataElement);
});

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});
