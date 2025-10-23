// --- Global Variables and Constants ---
const SESSION_STORAGE_KEY = 'stopwatchSessions';
let intervalId = null; // Stores the setInterval ID
let startTime = 0;     // Timestamp when the timer started/resumed
let elapsedTime = 0;   // Total elapsed time in milliseconds
let isPaused = false;  // Flag to check pause state

// --- Utility Functions ---

/**
 * Converts milliseconds to HH:MM:SS format.
 * @param {number} ms - Milliseconds
 * @returns {string} Formatted time string
 */
const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

/**
 * Shows a professional, modal notification using jQuery.
 * @param {string} message - Message to display.
 */
const showNotification = (message) => {
    $('#modalMessage').text(message);
    // Use jQuery for animation and display
    $('#modalBackdrop').fadeIn(300);
    
    // Auto-hide the modal after 2.5 seconds
    setTimeout(() => {
        $('#modalBackdrop').fadeOut(300);
    }, 2500);
};

// --- Validation Logic (using jQuery) ---

/**
 * Validates the Date and Event Name fields.
 * @returns {Promise<boolean>} Resolves with true if valid, false otherwise.
 */
const validateEventDetails = () => {
    return new Promise((resolve) => {
        let isValid = true;
        const date = $('#eventDate').val();
        const name = $('#eventName').val().trim();
        
        $('#dateError').empty();
        $('#nameError').empty();

        // 1. Date Validation
        if (date.length === 0) {
            $('#dateError').text('Please select a date');
            isValid = false;
        }

        // 2. Event Name Validation
        if (name.length === 0) {
            $('#nameError').text('Event name is required');
            isValid = false;
        } else if (name.length < 3) {
            $('#nameError').text('Event name must be at least 3 characters');
            isValid = false;
        } else if (name.length > 100) {
            $('#nameError').text('Event name too long (max 100 characters)');
            isValid = false;
        } else if (!/^[a-zA-Z0-9\s-']+$/.test(name)) { // Only letters, numbers, spaces, hyphens, and apostrophes
            $('#nameError').text('Event name contains invalid characters');
            isValid = false;
        }

        resolve(isValid);
    });
};


// --- Stopwatch Logic (using Async/Await, Promises, setInterval) ---

/**
 * Updates the timer display every second.
 */
const updateTimer = () => {
    const now = Date.now();
    elapsedTime = now - startTime;
    $('#timerDisplay').text(formatTime(elapsedTime));
};

/**
 * Starts the stopwatch.
 */
const startTimer = async () => {
    // 1. Use Async/Await to wait for validation Promise
    const isValid = await validateEventDetails();
    if (!isValid) {
        showNotification("Please fill in event details correctly.");
        return;
    }

    if (intervalId) return; // Already running

    // Disable input fields while running
    $('#eventDate, #eventName').prop('disabled', true);
    $('#startButton').prop('disabled', true);
    
    // Set initial start time (Date.now() - accumulated time)
    startTime = Date.now() - elapsedTime;

    // Use setInterval to run the timer
    intervalId = setInterval(updateTimer, 1000);
    
    // Update button states
    $('#pauseResumeButton, #stopSaveButton').prop('disabled', false);
    $('#pauseResumeButton').text('Pause');
    isPaused = false;
};

/**
 * Pauses or resumes the stopwatch.
 */
const pauseResumeTimer = () => {
    if (!intervalId) return;

    if (isPaused) {
        // Resume
        startTime = Date.now() - elapsedTime; // Adjust startTime to account for pause time
        intervalId = setInterval(updateTimer, 1000);
        $('#pauseResumeButton').text('Pause');
        showNotification("Timer Resumed.");
    } else {
        // Pause: Use clearInterval
        clearInterval(intervalId);
        intervalId = null;
        $('#pauseResumeButton').text('Resume');
        showNotification("Timer Paused.");
    }
    isPaused = !isPaused;
};

/**
 * Stops the timer and saves the session.
 */
const stopAndSaveTimer = () => {
    if (elapsedTime === 0 && !intervalId) {
        showNotification("Timer must be running or have elapsed time to save.");
        return;
    }

    // Stop timer (using clearInterval)
    clearInterval(intervalId);
    intervalId = null;
    isPaused = false;
    
    // Save session to localStorage
    saveSession(elapsedTime);
    
    // Reset state
    resetTimer(false); 
    showNotification("Session Saved!");
};

/**
 * Resets the timer display and state.
 * @param {boolean} notify - Whether to show a notification.
 */
const resetTimer = (notify = true) => {
    // 1. Clear interval if running (safety check)
    clearInterval(intervalId);
    intervalId = null;
    isPaused = false;
    
    // 2. Reset time variables
    elapsedTime = 0;
    startTime = 0;
    
    // 3. Reset UI using jQuery
    $('#timerDisplay').text('00:00:00');
    
    // 4. Reset controls
    $('#eventDate, #eventName').prop('disabled', false);
    $('#startButton').prop('disabled', false);
    $('#pauseResumeButton, #stopSaveButton').prop('disabled', true).text('Pause');

    if (notify) {
        showNotification("Timer Reset.");
    }
};


// --- History and Persistence (localStorage) ---

/**
 * Loads sessions from localStorage and renders them.
 * @param {string|null} filterDate - Optional date string to filter by.
 */
const renderHistory = (filterDate = null) => {
    const sessions = JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || '[]');
    const $sessionList = $('#sessionList');
    $sessionList.empty();

    let filteredSessions = sessions;
    let totalMs = 0;

    if (filterDate) {
        filteredSessions = sessions.filter(s => s.date === filterDate);
    }

    if (filteredSessions.length === 0) {
        const message = filterDate ? "No sessions recorded for this date." : "No sessions recorded yet";
        $sessionList.append(`<p id="noSessionsMessage" class="no-data-message">${message}</p>`);
    } else {
        // Sort by timestamp (most recent first)
        filteredSessions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        filteredSessions.forEach(session => {
            const durationFormatted = formatTime(session.durationMs);
            totalMs += session.durationMs;
            
            // Use jQuery to append history items
            const $item = $(`
                <div class="session-item">
                    <p><strong>Date:</strong> ${session.date}</p>
                    <p><strong>Event:</strong> ${session.name}</p>
                    <p class="session-duration"><strong>Duration:</strong> ${durationFormatted}</p>
                </div>
            `);
            $sessionList.append($item);
        });
    }
    
    // Update Statistics
    $('#totalSessions').text(sessions.length);
    // Note: totalMs accumulates filtered time, but for "Total Time Logged" we calculate from all sessions
    const totalTimeLogged = sessions.reduce((sum, s) => sum + s.durationMs, 0);
    $('#totalDuration').text(formatTime(totalTimeLogged));
};

/**
 * Saves the current session to localStorage.
 * @param {number} durationMs - The duration of the session in milliseconds.
 */
const saveSession = (durationMs) => {
    const sessions = JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || '[]');
    const date = $('#eventDate').val();
    const name = $('#eventName').val().trim();
    
    const newSession = {
        date: date,
        name: name,
        durationMs: durationMs,
        timestamp: new Date().toISOString() // for sorting
    };
    
    sessions.push(newSession);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));
    renderHistory();
};


// --- Initialization and Event Bindings (using jQuery) ---

$(document).ready(() => {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    $('#eventDate').val(today);
    
    // Initial render of history
    renderHistory();

    // Attach event handlers using jQuery

    // Start Button
    $('#startButton').on('click', startTimer);

    // Pause/Resume Button
    $('#pauseResumeButton').on('click', pauseResumeTimer);

    // Stop & Save Button
    $('#stopSaveButton').on('click', stopAndSaveTimer);

    // Reset Button
    $('#resetButton').on('click', () => {
        resetTimer(true);
    });

    // Validation focus/blur events (clear errors)
    $('#eventDate, #eventName').on('focus', function() {
        const errorId = $(this).attr('id') === 'eventDate' ? '#dateError' : '#nameError';
        $(errorId).empty();
    });

    // History Filter
    $('#filterDate').on('change', function() {
        const filterValue = $(this).val();
        renderHistory(filterValue);
    });
    
    // Clear Filter Button
    $('#clearFilterButton').on('click', function() {
        $('#filterDate').val(''); // Clear the input field
        renderHistory(); // Re-render without filter
    });
});