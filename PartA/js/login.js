// Global array for credential validation against hardcoded users.
const HARDCODED_USERS = [
    { email: "user1@northeastern.edu", password: "password1" },
    { email: "admin@northeastern.edu", password: "securepassword" }
];

// Arrow Function: Checks if both fields are valid to enable/disable the Login button.
// The button must remain disabled until both fields pass validation.
const checkFormValidity = () => {
    // Check if error containers are empty and inputs have content
    const isEmailValid = $('#emailError').is(':empty') && $('#email').val().length > 0;
    const isPasswordValid = $('#passwordError').is(':empty') && $('#password').val().length > 0;
    
    // Use jQuery to set the disabled property
    $('#loginButton').prop('disabled', !(isEmailValid && isPasswordValid));
};

// Arrow Function: Handles Email Validation logic.
const validateEmail = () => {
    const email = $('#email').val();
    const errorElement = $('#emailError');
    errorElement.empty(); // Clear error on input/blur
    
    // Requirement: Cannot be empty.
    if (email.length === 0) {
        checkFormValidity();
        return false; 
    }

    // Requirement: Must be a valid email format and must end with @northeastern.edu.
    const northeasternEmailRegex = /^[^\s@]+@northeastern\.edu$/;

    if (!northeasternEmailRegex.test(email)) {
        // Display specific error: "Please enter a valid Northeastern email"
        errorElement.text("Please enter a valid Northeastern email");
        checkFormValidity();
        return false;
    }
    
    checkFormValidity();
    return true;
};

// Arrow Function: Handles Password Validation logic.
const validatePassword = () => {
    const password = $('#password').val();
    const errorElement = $('#passwordError');
    errorElement.empty(); // Clear error on input/blur

    // Requirement: Cannot be empty.
    if (password.length === 0) {
        errorElement.text("Password cannot be empty"); 
        checkFormValidity();
        return false;
    }

    // Requirement: Minimum 8 characters.
    if (password.length < 8) {
        errorElement.text("Password must be at least 8 characters"); 
        checkFormValidity();
        return false;
    }

    checkFormValidity();
    return true;
};

$(document).ready(() => {
    // Use jQuery for all validation setup.
    
    // Validate on keyup and blur events.
    $('#email').on('keyup blur', validateEmail)
               .on('focus', () => $('#emailError').empty()); // Clear error on focus

    $('#password').on('keyup blur', validatePassword)
                  .on('focus', () => $('#passwordError').empty()); // Clear error on focus
    
    $('#loginForm').on('submit', (event) => {
        event.preventDefault();
        
        // 1. Validate form fields using jQuery.
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        
        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        const email = $('#email').val();
        const password = $('#password').val();
        const rememberMe = $('#rememberMe').is(':checked');
        const loginError = $('#loginError');
        loginError.empty();
        
        // 2. Check credentials against hardcoded users.
        const user = HARDCODED_USERS.find(u => u.email === email && u.password === password);

        if (user) {
            // 3. If valid: Handle success and session creation.
            
            // Extract username (part before @)
            const username = email.substring(0, email.indexOf('@')); 
            const timestamp = new Date().toISOString();
            
            const sessionData = {
                username: username,
                email: email,
                loginTimestamp: timestamp,
                isLoggedIn: true
            };
            
            // Session Handling: Use localStorage if 'Remember Me' is checked, otherwise use sessionStorage.
            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem('userSession', JSON.stringify(sessionData));
            
            // Show success message with jQuery animation (fadeOut for transition)
            $('#loginSuccess').slideDown(300).delay(1500).fadeOut(500, () => {
                // Redirect to calculator.html after success animation (total ~2 seconds).
                window.location.href = 'calculator.html';
            });
            
        } else {
            // 4. If invalid: Display error below the login button.
            
            // Show error: "Invalid email or password"
            // Requirement: Do not specify which field is incorrect.
            loginError.text("Invalid email or password"); 
        }
    });
});