/* Community Volunteer Network */

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    let form = document.getElementById("volunteer-form");
    let formStatus = document.getElementById("form-status");

    if (!form) return;

    // Input fields
    let inputs = {
        fullName: document.getElementById("full-name"),
        email: document.getElementById("email"),
        phone: document.getElementById("phone"),
        dob: document.getElementById("dob"),
        area: document.getElementById("area"),
        hours: document.getElementById("hours"),
        message: document.getElementById("message"),
        agreeTerms: document.getElementById("agree-terms"),
    };

    // Dynamic fields
    let firstAidCheckbox = document.getElementById("skill-first-aid");
    let certificationField = document.getElementById("certification-field");
    let certificationInput = document.getElementById("certification");

    let volunteeredYes = document.getElementById("volunteered-yes");
    let volunteeredNo = document.getElementById("volunteered-no");
    let previousOrgField = document.getElementById("previous-org-field");
    let previousOrgInput = document.getElementById("previous-org");

    // Message counter
    let messageCount = document.getElementById("message-count");

    // Error Messages 
    let errorMessages = {
        fullName: {
            empty: "Please enter your full name.",
            short: "Full name must be at least 2 characters.",
        },
        email: {
            empty: "Please enter your email address.",
            invalid: "Please enter a valid email address (e.g. name@example.com).",
        },
        phone: {
            empty: "Please enter your phone number.",
            invalid: "Please enter a valid phone number (digits only, 10 digits).",
        },
        dob: "Please select your date of birth.",
        area: "Please select a volunteer area.",
        preferredTime: "Please choose a preferred volunteering time.",
        certification: "Please give your medical certification details.",
        hours: {
            empty: "Please enter how many hours per week you are available.",
            invalid: "Hours must be a number between 1 and 40.",
        },
        volunteeredBefore: "Please tell us if you have volunteered with us before.",
        previousOrg: "Please enter the organization you volunteered with.",
        agreeTerms: "You must agree to be contacted to continue.",
    };

    // Helper Functions 
    let showError = (input, errorId, message) => {
        let errEl = document.getElementById(errorId);
        if (errEl) errEl.textContent = message;
        if (input) {
            input.classList.add("invalid");
            input.classList.remove("valid");
        }
    };

    let clearError = (input, errorId) => {
        let errEl = document.getElementById(errorId);
        if (errEl) errEl.textContent = "";
        if (input) {
            input.classList.remove("invalid");
            input.classList.add("valid");
        }
    };

    let isRadioGroupChecked = (name) => {
        return document.querySelector(`input[name="${name}"]:checked`) !== null;
    };

    // Validation Functions 
    let validateField = (field, errorId, rules) => {
        if (!field) return true;
        let value = field.value ? field.value.trim() : "";
        for (const rule of rules) {
            if (rule.condition(value)) {
                showError(field, errorId, rule.message);
                return false;
            }
        }
        clearError(field, errorId);
        return true;
    };

    let validateFullName = () => validateField(inputs.fullName, "full-name-error", [
        { condition: (v) => v === "", message: errorMessages.fullName.empty },
        { condition: (v) => v.length < 2, message: errorMessages.fullName.short },
    ]);

    let validateEmail = () => validateField(inputs.email, "email-error", [
        { condition: (v) => v === "", message: errorMessages.email.empty },
        { condition: (v) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: errorMessages.email.invalid },
    ]);

    let validatePhone = () => validateField(inputs.phone, "phone-error", [
        { condition: (v) => v === "", message: errorMessages.phone.empty },
        { condition: (v) => !/^[0-9]{10}$/.test(v), message: errorMessages.phone.invalid },
    ]);

    let validateDob = () => validateField(inputs.dob, "dob-error", [
        { condition: (v) => v === "", message: errorMessages.dob },
    ]);

    let validateArea = () => validateField(inputs.area, "area-error", [
        { condition: (v) => v === "", message: errorMessages.area },
    ]);

    let validatePreferredTime = () => {
        const errorElement = document.getElementById("preferred-time-error");
        if (!isRadioGroupChecked("preferred_time")) {
            if (errorElement) errorElement.textContent = errorMessages.preferredTime;
            return false;
        }
        if (errorElement) errorElement.textContent = "";
        return true;
    };

    let validateCertification = () => {
        if (!certificationField || certificationField.hidden) {
            clearError(certificationInput, "certification-error");
            return true;
        }
        return validateField(certificationInput, "certification-error", [
            { condition: (v) => v === "", message: errorMessages.certification },
        ]);
    };

    let validateHours = () => validateField(inputs.hours, "hours-error", [
        { condition: (v) => v === "", message: errorMessages.hours.empty },
        { condition: (v) => isNaN(Number(v)) || Number(v) < 1 || Number(v) > 40, message: errorMessages.hours.invalid },
    ]);

    let validateVolunteeredBefore = () => {
        const errorElement = document.getElementById("volunteered-before-error");
        if (!isRadioGroupChecked("volunteered_before")) {
            if (errorElement) errorElement.textContent = errorMessages.volunteeredBefore;
            return false;
        }
        if (errorElement) errorElement.textContent = "";
        return true;
    };

    let validatePreviousOrg = () => {
        if (!previousOrgField || previousOrgField.hidden) {
            clearError(previousOrgInput, "previous-org-error");
            return true;
        }
        return validateField(previousOrgInput, "previous-org-error", [
            { condition: (v) => v === "", message: errorMessages.previousOrg },
        ]);
    };

    let validateAgreeTerms = () => {
        const errorElement = document.getElementById("agree-terms-error");
        if (!inputs.agreeTerms || !inputs.agreeTerms.checked) {
            if (errorElement) errorElement.textContent = errorMessages.agreeTerms;
            return false;
        }
        if (errorElement) errorElement.textContent = "";
        return true;
    };

    // Validation Functions Array
    let validationFunctions = [
        validateFullName,
        validateEmail,
        validatePhone,
        validateDob,
        validateArea,
        validatePreferredTime,
        validateCertification,
        validateHours,
        validateVolunteeredBefore,
        validatePreviousOrg,
        validateAgreeTerms,
    ];

    // Event Listeners for dynamic toggles
    if (firstAidCheckbox && certificationField) {
        firstAidCheckbox.addEventListener("change", () => {
            certificationField.hidden = !firstAidCheckbox.checked;
            if (!firstAidCheckbox.checked && certificationInput) {
                certificationInput.value = "";
                clearError(certificationInput, "certification-error");
            }
        });
    }

    if (volunteeredYes && volunteeredNo && previousOrgField) {
        volunteeredYes.addEventListener("change", () => (previousOrgField.hidden = false));
        volunteeredNo.addEventListener("change", () => {
            previousOrgField.hidden = true;
            if (previousOrgInput) previousOrgInput.value = "";
            clearError(previousOrgInput, "previous-org-error");
        });
    }

    if (inputs.message && messageCount) {
        inputs.message.addEventListener("input", () => {
            messageCount.textContent = `${inputs.message.value.length} / 500 characters`;
        });
    }

    // Form submission via AJAX (Fetch API)
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevent page refresh

        let isFormValid = true;

        // Run each validation check individually without short-circuiting
        for (let validate of validationFunctions) {
            let result = validate();
            if (!result) {
                isFormValid = false;
            }
        }

        if (!isFormValid) {
            formStatus.textContent = "Please fix the error(s) marked above before submitting.";
            formStatus.className = "form-status error";
            return;
        }

        // Send data to PHP
        const formData = new FormData(form);

        try {
            formStatus.textContent = "Submitting...";
            formStatus.className = "form-status info";

            const response = await fetch("process.php", {
                method: "POST",
                body: formData
            });

            const result = await response.text();

            if (response.ok && !result.toLowerCase().includes("error")) {
                formStatus.textContent = "Thank you! Your registration was submitted successfully.";
                formStatus.className = "form-status success";
                form.reset();
            } else {
                formStatus.textContent = result.replace(/<[^>]*>?/gm, '');
                formStatus.className = "form-status error";
            }
        } catch (error) {
            formStatus.textContent = "An error occurred while submitting. Please try again.";
            formStatus.className = "form-status error";
        }
    });
});