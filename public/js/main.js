// Main JavaScript for ClickQuest

document.addEventListener('DOMContentLoaded', function() {
    // Check if user has accepted terms
    const termsAccepted = localStorage.getItem('clickquest_terms_accepted');
    const termsModal = document.getElementById('termsModal');
    
    if (!termsAccepted && termsModal) {
        termsModal.classList.add('show');
    }

    // Accept terms button
    const acceptBtn = document.getElementById('acceptTerms');
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            localStorage.setItem('clickquest_terms_accepted', 'true');
            termsModal.classList.remove('show');
        });
    }

    // Close modal on outside click
    if (termsModal) {
        termsModal.addEventListener('click', function(e) {
            if (e.target === termsModal) {
                termsModal.classList.remove('show');
            }
        });
    }
});

// Utility functions
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        alert('Скопировано в буфер обмена!');
    }).catch(function(err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Скопировано в буфер обмена!');
    });
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}
