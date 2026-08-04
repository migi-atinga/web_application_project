


Script · JS
/* Community Volunteer Network  */

document.addEventListener("DOMContentLoaded", () => {
    //  DOM Elements
    const form = document.getElementById("volunteer-form");
    const formStatus = document.getElementById("form-status");

    // so we stop here to avoid errors.
    if (!form) {
        return;
    }

    // Input fields
    const inputs = {
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
    const firstAidCheckbox = document.getElementById("skill-first-aid");
    const certificationField = document.getElementById("certification-field");
    const certificationInput = document.getElementById("certification");

    const volunteeredYes = document.getElementById("volunteered-yes");
    const volunteeredNo = document.getElementById("volunteered-no");
    const previousOrgField = document.getElementById("previous-org-field");
    const previousOrgInput = document.getElementById("previous-org");

    // Message counter
    const messageCount = document.getElementById("message-count");

    //  Error Messages 
    const errorMessages = {
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
        certification: "Please give your first aid / medical certification details.",
        hours: {
            empty: "Please enter how many hours per week you are available.",
            invalid: "Hours must be a number between 1 and 40.",
        },
        volunteeredBefore: "Please tell us if you have volunteered with us before.",
        previousOrg: "Please enter the organization you volunteered with.",
        agreeTerms: "You must agree to be contacted to continue.",
    };

    //  Helper Functions 
    const showError = (input, errorId, message) => {
        document.getElementById(errorId).textContent = message;
        input.classList.add("invalid");
        input.classList.remove("valid");
    };

    const clearError = (input, errorId) => {
        document.getElementById(errorId).textContent = "";
        input.classList.remove("invalid");
        input.classList.add("valid");
    };

    const isRadioGroupChecked = (name) => {
        return document.querySelector(`input[name="${name}"]:checked`) !== null;
    };

    //  Validation Functions 
    const validateField = (field, errorId, rules) => {
        const value = field.value.trim();
        for (const rule of rules) {
            if (rule.condition(value)) {
                showError(field, errorId, rule.message);
                return false;
            }
        }
        clearError(field, errorId);
        return true;
    };

    const validateFullName = () => validateField(inputs.fullName, "full-name-error", [
        { condition: (v) => v === "", message: errorMessages.fullName.empty },
        { condition: (v) => v.length < 2, message: errorMessages.fullName.short },
    ]);

    const validateEmail = () => validateField(inputs.email, "email-error", [
        { condition: (v) => v === "", message: errorMessages.email.empty },
        { condition: (v) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: errorMessages.email.invalid },
    ]);

    const validatePhone = () => validateField(inputs.phone, "phone-error", [
        { condition: (v) => v === "", message: errorMessages.phone.empty },
        { condition: (v) => !/^[0-9]{10}$/.test(v), message: errorMessages.phone.invalid },
    ]);

    const validateDob = () => validateField(inputs.dob, "dob-error", [
        { condition: (v) => v === "", message: errorMessages.dob },
    ]);

    const validateArea = () => validateField(inputs.area, "area-error", [
        { condition: (v) => v === "", message: errorMessages.area },
    ]);

    const validatePreferredTime = () => {
        const errorElement = document.getElementById("preferred-time-error");
        if (!isRadioGroupChecked("preferred_time")) {
            errorElement.textContent = errorMessages.preferredTime;
            return false;
        }
        errorElement.textContent = "";
        return true;
    };

    const validateCertification = () => {
        if (certificationField.hidden) return true;
        return validateField(certificationInput, "certification-error", [
            { condition: (v) => v === "", message: errorMessages.certification },
        ]);
    };

    const validateHours = () => validateField(inputs.hours, "hours-error", [
        { condition: (v) => v === "", message: errorMessages.hours.empty },
        { condition: (v) => isNaN(Number(v)) || Number(v) < 1 || Number(v) > 40, message: errorMessages.hours.invalid },
    ]);

    const validateVolunteeredBefore = () => {
        const errorElement = document.getElementById("volunteered-before-error");
        if (!isRadioGroupChecked("volunteered_before")) {
            errorElement.textContent = errorMessages.volunteeredBefore;
            return false;
        }
        errorElement.textContent = "";
        return true;
    };

    const validatePreviousOrg = () => {
        if (previousOrgField.hidden) return true;
        return validateField(previousOrgInput, "previous-org-error", [
            { condition: (v) => v === "", message: errorMessages.previousOrg },
        ]);
    };

    const validateAgreeTerms = () => {
        const errorElement = document.getElementById("agree-terms-error");
        if (!inputs.agreeTerms.checked) {
            errorElement.textContent = errorMessages.agreeTerms;
            return false;
        }
        errorElement.textContent = "";
        return true;
    };

    //  Validation Array 
    const validationFunctions = [
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

    //  Event Listeners
    // Toggle certification field
    firstAidCheckbox.addEventListener("change", () => {
        certificationField.hidden = !firstAidCheckbox.checked;
        if (!firstAidCheckbox.checked) {
            certificationInput.value = "";
            document.getElementById("certification-error").textContent = "";
        }
    });

    // Toggle previous organization field
    volunteeredYes.addEventListener("change", () => (previousOrgField.hidden = false));
    volunteeredNo.addEventListener("change", () => {
        previousOrgField.hidden = true;
        previousOrgInput.value = "";
        document.getElementById("previous-org-error").textContent = "";
    });

    // Character counter
    inputs.message.addEventListener("input", () => {
        messageCount.textContent = `${inputs.message.value.length} / 500 characters`;
    });

    // Form submission
    form.addEventListener("submit", (e) => {
        let isFormValid = true;
        validationFunctions.forEach((validate) => {
            if (!validate()) isFormValid = false;
        });

        if (!isFormValid) {
            e.preventDefault();
            formStatus.textContent = "Please fix the errors above before submitting.";
            formStatus.className = "form-status error";
        } else {
            formStatus.textContent = "Thank you! Your registration looks good.";
            formStatus.className = "form-status success";
        }
    });
});


