// Register.js - Enhanced version dengan Google registration dan konsistensi dengan login.js
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== PASSWORD TOGGLE FUNCTIONALITY =====
    initializePasswordToggle();
    
    // ===== FORM VALIDATION & SUBMISSION =====
    initializeFormHandler();
    
    // ===== REAL-TIME VALIDATION =====
    initializeRealTimeValidation();
    
    // ===== GOOGLE REGISTRATION HANDLER =====
    initializeGoogleRegistration();
});

/**
 * Inisialisasi toggle password visibility
 */
function initializePasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    // Set initial SVG icons
    toggleButtons.forEach(button => {
        const eyeIcon = button.querySelector('.eye-icon');
        eyeIcon.innerHTML = createEyeIcon(true); // mata terbuka = password hidden
        
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            const eyeIcon = this.querySelector('.eye-icon');
            
            if (passwordInput.type === 'password') {
                // Show password
                passwordInput.type = 'text';
                eyeIcon.innerHTML = createEyeIcon(false); // mata tertutup = password visible
                this.classList.add('active');
                this.setAttribute('aria-label', 'Hide password');
            } else {
                // Hide password
                passwordInput.type = 'password';
                eyeIcon.innerHTML = createEyeIcon(true); // mata terbuka = password hidden
                this.classList.remove('active');
                this.setAttribute('aria-label', 'Show password');
            }
        });
        
        // Set initial aria-label for accessibility
        button.setAttribute('aria-label', 'Show password');
        button.setAttribute('title', 'Show password');
    });
}

/**
 * Create SVG eye icon
 * @param {boolean} isOpen - true for open eye (password hidden), false for closed eye (password visible)
 */
function createEyeIcon(isOpen) {
    if (isOpen) {
        return `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>
        `;
    } else {
        return `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
        `;
    }
}

/**
 * Inisialisasi form submission handler
 */
function initializeFormHandler() {
    const form = document.getElementById("registerForm");
    
    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        
        // Get form values
        const formData = getFormData();
        const status = document.getElementById("registerStatus");
        
        // Validate form
        const validation = validateForm(formData);
        if (!validation.isValid) {
            showStatus(status, validation.message, 'error');
            return;
        }
        
        // Show loading state
        showStatus(status, "Memproses registrasi...", 'loading');
        setFormDisabled(true);
        
        try {
            const response = await fetch("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    username: formData.name, 
                    email: formData.email, 
                    password: formData.password 
                }),
            });
            
            let result = {};
            try {
                result = await response.json();
            } catch (jsonError) {
                console.warn('Failed to parse JSON response:', jsonError);
                result = { message: 'Server response error' };
            }
            
            if (response.ok && result.success) {
                showStatus(status, "Registrasi berhasil! Mengarahkan ke login...", 'success');
                
                // Clear form for security
                clearForm();
                
                // Redirect after success
                setTimeout(() => {
                    window.location.href = "/login";
                }, 1500);
            } else {
                const errorMessage = result.message || `Registrasi gagal (${response.status})`;
                showStatus(status, errorMessage, 'error');
                setFormDisabled(false);
            }
        } catch (error) {
            console.error('Registration error:', error);
            showStatus(status, "Terjadi kesalahan jaringan saat registrasi.", 'error');
            setFormDisabled(false);
        }
    });
}

/**
 * Inisialisasi Google registration handler
 */
function initializeGoogleRegistration() {
    const googleBtn = document.querySelector('.google-btn');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const status = document.getElementById("registerStatus");
            showStatus(status, "Mengarahkan ke Google...", 'loading');
            
            // Add loading state to Google button
            this.style.opacity = '0.7';
            this.style.pointerEvents = 'none';
            
            // Redirect to Google OAuth registration
            setTimeout(() => {
                window.location.href = '/register/google';
            }, 500);
        });
    }
}

/**
 * Get form data
 */
function getFormData() {
    return {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value,
        confirmPassword: document.getElementById("confirmPassword").value
    };
}

/**
 * Validate form data
 */
function validateForm(data) {
    // Check required fields
    if (!data.name || !data.email || !data.password || !data.confirmPassword) {
        return { isValid: false, message: "Semua kolom wajib diisi." };
    }
    
    // Validate name length
    if (data.name.length < 2) {
        return { isValid: false, message: "Nama harus minimal 2 karakter." };
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return { isValid: false, message: "Format email tidak valid." };
    }
    
    // Validate password strength
    if (data.password.length < 6) {
        return { isValid: false, message: "Password harus minimal 6 karakter." };
    }
    
    // Check password match
    if (data.password !== data.confirmPassword) {
        return { isValid: false, message: "Password tidak cocok!" };
    }
    
    return { isValid: true };
}

/**
 * Show status message with appropriate styling
 */
function showStatus(statusElement, message, type) {
    statusElement.textContent = message;
    
    // Remove existing status classes
    statusElement.classList.remove('status-error', 'status-success', 'status-loading');
    
    switch (type) {
        case 'error':
            statusElement.style.color = "#ff6b6b";
            statusElement.classList.add('status-error');
            break;
        case 'success':
            statusElement.style.color = "#00cc66";
            statusElement.classList.add('status-success');
            break;
        case 'loading':
            statusElement.style.color = "#00f0ff";
            statusElement.classList.add('status-loading');
            break;
        default:
            statusElement.style.color = "#b5b8de";
    }
}

/**
 * Enable/disable form elements
 */
function setFormDisabled(disabled) {
    const form = document.getElementById("registerForm");
    const inputs = form.querySelectorAll('input, button[type="submit"]');
    
    inputs.forEach(input => {
        input.disabled = disabled;
    });
    
    // Update submit button text and state
    const submitButton = form.querySelector('button[type="submit"]');
    const googleButton = form.querySelector('.google-btn');
    
    if (disabled) {
        submitButton.textContent = 'Memproses...';
        submitButton.classList.add('loading');
        if (googleButton) {
            googleButton.style.opacity = '0.5';
            googleButton.style.pointerEvents = 'none';
        }
    } else {
        submitButton.textContent = 'Daftar';
        submitButton.classList.remove('loading');
        if (googleButton) {
            googleButton.style.opacity = '1';
            googleButton.style.pointerEvents = 'auto';
        }
    }
}

/**
 * Clear form data
 */
function clearForm() {
    document.getElementById("name").value = '';
    document.getElementById("email").value = '';
    document.getElementById("password").value = '';
    document.getElementById("confirmPassword").value = '';
    
    // Reset password fields to hidden state
    const passwordInputs = document.querySelectorAll('input[type="text"][id$="password"], input[type="text"][id$="Password"]');
    passwordInputs.forEach(input => {
        input.type = 'password';
    });
    
    // Reset toggle buttons
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        button.classList.remove('active');
        const eyeIcon = button.querySelector('.eye-icon');
        eyeIcon.innerHTML = createEyeIcon(true);
        button.setAttribute('aria-label', 'Show password');
    });
    
    // Clear validation states
    const inputGroups = document.querySelectorAll('.sci-fi-input-group');
    inputGroups.forEach(group => {
        group.classList.remove('field-valid', 'field-invalid');
    });
}

/**
 * Real-time validation feedback
 */
function initializeRealTimeValidation() {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    
    // Name validation
    nameInput.addEventListener('blur', function() {
        validateField(this, this.value.trim().length >= 2, "Nama harus minimal 2 karakter");
    });
    
    // Email validation
    emailInput.addEventListener('blur', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        validateField(this, emailRegex.test(this.value.trim()), "Format email tidak valid");
    });
    
    // Password validation
    passwordInput.addEventListener('input', function() {
        const isValid = this.value.length >= 6;
        validateField(this, isValid, "Password harus minimal 6 karakter");
        
        // Also check confirm password if it has value
        if (confirmPasswordInput.value) {
            validatePasswordMatch();
        }
    });
    
    // Confirm password validation
    confirmPasswordInput.addEventListener('input', validatePasswordMatch);
    
    function validatePasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const isMatch = password === confirmPassword;
        
        validateField(confirmPasswordInput, isMatch, "Password tidak cocok");
    }
}

/**
 * Validate individual field with visual feedback
 */
function validateField(input, isValid, errorMessage) {
    const inputGroup = input.closest('.sci-fi-input-group');
    
    // Remove existing validation classes
    inputGroup.classList.remove('field-valid', 'field-invalid');
    
    if (input.value.trim() === '') {
        // Empty field - no validation styling
        return;
    }
    
    if (isValid) {
        inputGroup.classList.add('field-valid');
        input.setCustomValidity('');
    } else {
        inputGroup.classList.add('field-invalid');
        input.setCustomValidity(errorMessage);
    }
}