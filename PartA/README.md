# Assignment 6 - Part A: Calculator with User Login

## 1. Project Description

This is the first part of Assignment 6, a two-page web application that features user authentication and a basic arithmetic calculator. The primary goal is to demonstrate strong client-side form validation and session management using modern JavaScript (ES6+ features like Arrow Functions) and the jQuery library.

## 2. Features Implemented

The application consists of two pages: `login.html` and `calculator.html`.

### Login Page (`login.html`)
* **Form Validation:** Real-time validation is implemented on `keyup` and `blur` events using jQuery.
* **Email Validation:** Requires a valid email format ending specifically with `@northeastern.edu`.
* **Password Validation:** Requires a minimum of 8 characters.
* **Login Control:** The **Login Button is disabled** by default and only enables when both Email and Password fields pass all validation rules.
* **Authentication:** Credentials are verified against a set of hardcoded users.
* **Session Management:** Upon successful login, user details (username, email, timestamp) are stored in `sessionStorage` or `localStorage` (if "Remember Me" is checked).
* **Redirection:** Users are redirected to the calculator page after a brief success animation.

### Calculator Page (`calculator.html`)
* **Authentication Guard:** Automatically redirects the user to `login.html` if no valid session data is found upon page load.
* **Input Validation:** Ensures both input fields contain valid numeric values (including decimals and negative numbers) before any calculation is performed.
* **Core Calculation Logic:** A **single Arrow Function (`calculate`)** handles all four arithmetic operations (Add, Subtract, Multiply, Divide).
* **Edge Case Handling:** Includes specific logic to prevent division by zero.
* **Logout Functionality:** Clears the user session from storage and redirects back to `login.html` with a fade-out effect.

## 3. Technologies Used

* **HTML5:** Structure of the two web pages.
* **CSS3:** Styling, including a professional, clean design, consistent color scheme, and consistent error message styling.
* **JavaScript ES6+:** Used for modern language features, specifically **Arrow Functions** for calculation and form logic.
* **jQuery:** Used for all DOM manipulation, event handling, form validation, and UI animations (like fades and redirects).
* **Flexbox/CSS Grid:** Used for creating the responsive layout of both the login form and the calculator button group.

## 4. How to Run the Application

1.  **Download Files:** Ensure you have all the files (`login.html`, `calculator.html`, `css/styles.css`, `js/login.js`, and `js/calculator.js`).
2.  **Include jQuery:** Make sure the **jQuery library** file (`jquery-3.x.x.min.js` or a CDN link) is correctly placed in your `js` folder and properly referenced in both HTML files.
3.  **Open in Browser:** Open `login.html` in any modern web browser (Chrome, Firefox, Safari, etc.).
4.  **Test Credentials:** To log in, use the following sample credentials defined in `js/login.js`:
    * **Email:** `user1@northeastern.edu`
    * **Password:** `password1`

---