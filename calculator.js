$(document).ready(() => {
    // Authentication Check:
    const sessionData = sessionStorage.getItem('userSession') || localStorage.getItem('userSession');
    
    if (!sessionData) {
        // Redirects to login.html if no active session is found.
        window.location.href = 'login.html';
        return;
    }

    const user = JSON.parse(sessionData);
    // Update header: "Welcome, [username]!"
    $('#welcomeMessage').text(`Welcome, ${user.username}!`); 

    // REQUIRED: Single Arrow Function to handle 'add', 'subtract', 'multiply', and 'divide'.
    const calculate = (num1, num2, operation) => {
        switch (operation) {
            case 'add':
                return num1 + num2;
            case 'subtract':
                return num1 - num2;
            case 'multiply':
                return num1 * num2;
            case 'divide':
                // Handle edge case: Division by zero.
                if (num2 === 0) {
                    return "Error: Division by Zero";
                }
                return num1 / num2;
            default:
                return "Error: Invalid Operation";
        }
    };

    // Arrow Function: Input validation for numeric fields.
    const validateInput = (inputField, errorElement) => {
        const value = inputField.val().trim();
        errorElement.empty();

        // Requirement: Both fields required before calculation.
        if (value.length === 0) {
            errorElement.text("Please enter a valid number");
            return false;
        }

        // Validation: Ensures input is a valid number (including decimals and negatives).
        const num = Number(value); 
        
        // Checks if the converted value is NaN or infinite (e.g., from non-numeric input)
        if (isNaN(num) || !isFinite(num)) {
            // Show error: "Please enter a valid number"
            errorElement.text("Please enter a valid number");
            return false;
        }

        return true;
    };
    
    // Add event listeners for validation on input and blur.
    $('#num1').on('input blur', () => validateInput($('#num1'), $('#num1Error')));
    $('#num2').on('input blur', () => validateInput($('#num2'), $('#num2Error')));


    // Attach click handler to all operation buttons using delegated events.
    $('.operation-btn').on('click', function() {
        // 1. Get values and operation type.
        const num1Field = $('#num1');
        const num2Field = $('#num2');
        const operation = $(this).data('operation');

        // 2. Validate both inputs.
        const isNum1Valid = validateInput(num1Field, $('#num1Error'));
        const isNum2Valid = validateInput(num2Field, $('#num2Error'));
        
        if (!isNum1Valid || !isNum2Valid) {
            $('#result').val(""); // Clear result if validation fails
            return;
        }
        
        // Convert valid input strings to numbers for calculation.
        const num1 = parseFloat(num1Field.val());
        const num2 = parseFloat(num2Field.val());

        // 3. Call the single calculate arrow function.
        const result = calculate(num1, num2, operation);

        // 4 & 5. Display result and use jQuery chaining for smooth UI update.
        $('#result')
            .val(result)
            .css('background-color', '#f0f0f0')
            .animate({opacity: 0.8}, 100) // Quick fade for visual feedback
            .animate({opacity: 1}, 100);
    });

    // Logout Process
    $('#logoutButton').on('click', () => {
        // Clear session from both storage types.
        sessionStorage.removeItem('userSession');
        localStorage.removeItem('userSession');
        
        // Use jQuery fadeOut animation for a smooth logout effect.
        $('body').fadeOut(600, () => {
            // Redirect to login.html.
            window.location.href = 'login.html';
        });
    });
});