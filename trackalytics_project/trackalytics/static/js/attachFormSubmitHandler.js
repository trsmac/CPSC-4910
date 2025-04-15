function attachFormSubmitHandler() {
    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            // Triggered by addinventory.js
        });
    }
}

export default attachFormSubmitHandler;