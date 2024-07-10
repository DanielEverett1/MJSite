document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('image');
    if (fileInput) {
        fileInput.addEventListener('change', function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const preview = document.getElementById('imagePreview');
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                const preview = document.getElementById('imagePreview');
                preview.style.display = 'none';
                preview.src = '#';
            }
        });
    } else {
        console.error('File input element not found');
    }

    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            const formData = new FormData(form);
            try {
                const response = await fetch('https://milkjug-art.netlify.app/.netlify/functions/submit-art', { // Updated endpoint
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Failed to submit form');
                }

                const data = await response.json();
                console.log('Response:', data);
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        });
    } else {
        console.error('Form element not found');
    }
});
