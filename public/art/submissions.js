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

    document.querySelector('form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/.netlify/functions/submit-art', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to submit form');
            }

            const result = await response.json();
            console.log('Form submission successful:', result);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    });
});
