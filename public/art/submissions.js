document.addEventListener('DOMContentLoaded', function () {
    const handleImagePreview = function (event) {
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
    };

    const fileInput = document.getElementById('image');
    if (fileInput) {
        fileInput.addEventListener('change', handleImagePreview);
    } else {
        console.error('File input element not found');
    }

    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            const formData = new FormData(form);
            try {
                const response = await fetch('/.netlify/functions/submit-art', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Failed to submit form');
                }

                const data = await response.json();
                console.log('Response:', data);
                // Handle success response (e.g., show success message)
            } catch (error) {
                console.error('Error submitting form:', error);
                // Handle error (e.g., show error message)
            }
        });
    } else {
        console.error('Form element not found');
    }
});
