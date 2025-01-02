document.addEventListener('DOMContentLoaded', () => {
    // Load notes from localStorage
    document.querySelectorAll('.day').forEach(day => {
        const dayTitle = day.querySelector('.daytitle').textContent;
        const notesField = day.querySelector('.notes');
        const savedNotes = localStorage.getItem(`notes_${dayTitle}`);
        if (savedNotes) {
            notesField.value = savedNotes;
        }
    });
    // Add event listener to the Save Notes button
    const saveNotesButton = document.querySelector('#save-notes-btn');
    saveNotesButton.addEventListener('click', () => {
        document.querySelectorAll('.day').forEach(day => {
            const dayTitle = day.querySelector('.daytitle').textContent;
            const notesField = day.querySelector('.notes');
            localStorage.setItem(`notes_${dayTitle}`, notesField.value);
        });
        alert('All notes have been saved!');
    });
    console.log('Notes loaded successfully on page load.');
});