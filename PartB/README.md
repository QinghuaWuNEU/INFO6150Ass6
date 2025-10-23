# Assignment 6 - Part B: Event Stopwatch with Session Logging

## 1. Project Description

This application is a single-page event stopwatch designed to track and log the duration of various activities (Events) associated with a specific Date. It serves as a demonstration of modern JavaScript asynchronous programming techniques (Async/Await, Promises) combined with persistent data storage via `localStorage`.

## 2. Features Implemented

### Stopwatch Functionality
* **Timer Display:** Shows time in HH:MM:SS format with a large, striking font.
* **Core Logic:** The stopwatch mechanism uses the required modern JavaScript features: **Async/Await**, **Promises** (for validation), and **setInterval/clearInterval** (for time tracking and control).
* **Controls:** Dedicated buttons for Start, Pause/Resume, Stop & Save, and Reset.
* **Pause/Resume:** Allows pausing the timer and correctly resuming from the elapsed time.
* **Button Color-Coding:** Control buttons are color-coded for clear visual hierarchy.

### Event Details & Validation
* **Required Fields:** Requires a Date and an Event Name before the timer can be started.
* **Validation:** All validation is handled by jQuery.
    * **Date:** Must be selected.
    * **Event Name:** Must be between 3 and 100 characters, and only allows letters, numbers, spaces, hyphens, and apostrophes.
* **UI Lockout:** The Date and Event Name input fields are disabled while the timer is running.

### Session Logging and History
* **Data Persistence:** Completed sessions (Date, Event Name, Duration) are saved to the user's browser using `localStorage`.
* **History Display:** Shows a list of all recorded sessions, with the most recent displayed first.
* **Statistics:** Displays the total number of sessions and the combined total time logged.
* **Filtering:** Users can filter the displayed history by a specific Date.

### UI/UX
* **Notifications:** Uses a professional **Modal dialog with a backdrop** for important messages (e.g., validation errors, session saved, timer paused).
* **Styling:** Implements responsive design, clear visual separation for history items, and consistent styling for disabled controls.

## 3. Technologies Used

* **HTML5:** Application structure, including the native date input type.
* **CSS3:** Styling, using Flexbox for button and layout organization, and ensuring responsiveness.
* **JavaScript ES6+:** Core stopwatch logic utilizing **Async/Await**, **Promises**, and **Arrow Functions**.
* **jQuery:** Used for all client-side validation, DOM manipulation, and dynamic UI updates (like rendering the history list).

## 4. How to Run the Application

1.  **Download Files:** Ensure all files from Part B (`stopwatch.html`, `js/stopwatch.js`, `css/stopwatch-styles.css`) are in place, along with your jQuery library (`jquery-3.x.x.min.js`).
2.  **Open in Browser:** Open `stopwatch.html` in any modern web browser.
3.  **Start:** Fill in the Date and Event Name, then click "Start."
4.  **Data Storage:** All recorded sessions are saved locally in your browser's Local Storage.