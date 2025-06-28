// Login.js - Enhanced version with validation and OAuth error handling
document.addEventListener('DOMContentLoaded', function() {
    
    checkUrlErrors();
    initializePasswordToggle();
    initializeFormHandler();
    initializeRealTimeValidation();
});

/**
 * Check for error parameters in URL
 */
function checkUrlErrors() {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const status = document.getElementById("loginStatus");
    
    if (error && status) {
        let errorMessage = '';
        switch (error) {
            case 'google_auth_failed':
                errorMessage = 'Login Google gagal. Silakan coba lagi.';
                break;
            case 'no_email_from_google':
                errorMessage = 'Tidak dapat mengakses email dari akun Google Anda.';
                break;
            case 'account_not_found':
                errorMessage = 'Akun tidak ditemukan. Silakan daftar terlebih dahulu.';
                break;
            case 'oauth_error':
                errorMessage = 'Terjadi kesalahan saat login dengan Google.';
                break;
            default:
                errorMessage = 'Terjadi kesalahan tak terduga.';
        }
        
        showStatus(status, errorMessage, 'error');
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

/**
 * Toggle password visibility
 */
function initializePasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');

    toggleButtons.forEach(button => {
        const eyeIcon = button.querySelector('.eye-icon');
        eyeIcon.innerHTML = createEyeIcon(true);
        
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            const eyeIcon = this.querySelector('.eye-icon');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeIcon.innerHTML = createEyeIcon(false);
                this.classList.add('active');
                this.setAttribute('aria-label', 'Hide password');
            } else {
                passwordInput.type = 'password';
                eyeIcon.innerHTML = createEyeIcon(true);
                this.classList.remove('active');
                this.setAttribute('aria-label', 'Show password');
            }
        });

        button.setAttribute('aria-label', 'Show password');
        button.setAttribute('title', 'Show password');
    });
}

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

function initializeFormHandler() {
    const form = document.getElementById("loginForm");
    
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = getFormData();
        const status = document.getElementById("loginStatus");

        const validation = validateForm(formData);
        if (!validation.isValid) {
            showStatus(status, validation.message, 'error');
            return;
        }

        showStatus(status, "Memproses login...", 'loading');
        setFormDisabled(true);

        try {
            const response = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    username: formData.username, 
                    password: formData.password,
                    remember: formData.remember
                }),
            });

            let result = {};
            try {
                result = await response.json();
            } catch {
                result = { message: 'Server response error' };
            }

            if (response.ok && result.success) {
                showStatus(status, "Login berhasil! Mengarahkan...", 'success');
                setTimeout(() => {
                    window.location.href = result.redirect || "/dashboard";
                }, 1500);
            } else {
                const errorMessage = result.message || `Login gagal (${response.status})`;
                showStatus(status, errorMessage, 'error');
                setFormDisabled(false);
            }

        } catch {
            showStatus(status, "Terjadi kesalahan jaringan saat login.", 'error');
            setFormDisabled(false);
        }
    });
}

function getFormData() {
    return {
        username: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value,
        remember: document.getElementById("rememberMe")?.checked || false
    };
}

function validateForm(data) {
    if (!data.username || !data.password) {
        return { isValid: false, message: "Username/Email dan password wajib diisi." };
    }

    if (data.username.length < 3) {
        return { isValid: false, message: "Username/Email harus minimal 3 karakter." };
    }

    if (data.username.includes('@')) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.username)) {
            return { isValid: false, message: "Format email tidak valid." };
        }
    }

    if (data.password.length < 6) {
        return { isValid: false, message: "Password harus minimal 6 karakter." };
    }

    return { isValid: true };
}

function showStatus(statusElement, message, type) {
    statusElement.textContent = message;
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

function setFormDisabled(disabled) {
    const form = document.getElementById("loginForm");
    const inputs = form.querySelectorAll('input, button[type="submit"]');

    inputs.forEach(input => {
        input.disabled = disabled;
    });

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.textContent = disabled ? 'Memproses...' : 'Masuk';
}

function initializeRealTimeValidation() {
    const usernameInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    usernameInput.addEventListener('blur', function() {
        const value = this.value.trim();
        let isValid = true;
        let errorMessage = "";

        if (value.length < 3) {
            isValid = false;
            errorMessage = "Username/Email harus minimal 3 karakter";
        } else if (value.includes('@')) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = "Format email tidak valid";
            }
        }

        validateField(this, isValid, errorMessage);
    });

    passwordInput.addEventListener('blur', function() {
        const isValid = this.value.length >= 6;
        validateField(this, isValid, "Password harus minimal 6 karakter");
    });
}

function validateField(input, isValid, errorMessage) {
    const inputGroup = input.closest('.sci-fi-input-group');
    inputGroup.classList.remove('field-valid', 'field-invalid');

    if (input.value.trim() === '') return;

    if (isValid) {
        inputGroup.classList.add('field-valid');
        input.setCustomValidity('');
    } else {
        inputGroup.classList.add('field-invalid');
        input.setCustomValidity(errorMessage);
    }
}
