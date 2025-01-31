document.addEventListener('DOMContentLoaded', async () => {
    // Fetch the conversation starters
    const response = await fetch('js/conversation-starters.json');
    const topics = await response.json();

    const generateBtn = document.getElementById('generateBtn');
    const topicsContainer = document.getElementById('topicsContainer');

    // Add timer functionality
    const timerBtn = document.getElementById('timerBtn');
    const timerDisplay = document.getElementById('timerDisplay');
    const alertSound = new Audio("audio/done.wav");
    let timerInterval;

    function getRandomTopics(count) {
        const shuffled = [...topics].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    function displayTopics(selectedTopics) {
        topicsContainer.innerHTML = '';

        selectedTopics.forEach((topic, index) => {
            const topicElement = document.createElement('div');
            topicElement.className = 'bg-white p-4 sm:p-6 rounded-lg shadow-md transform transition duration-300 ease-in-out hover:scale-102 hover:shadow-lg';
            topicElement.innerHTML = `
                <span class="inline-block bg-blue-200 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold mb-2">Topic ${index + 1}</span>
                <p class="text-gray-800 text-base sm:text-lg">${topic}</p>
            `;
            topicsContainer.appendChild(topicElement);
        });
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function startTimer(duration, callback) {
        let timeLeft = duration;
        timerDisplay.textContent = formatTime(timeLeft);

        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = formatTime(timeLeft);

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                alertSound.play();
                callback?.();
            }
        }, 1000);
    }

    generateBtn.addEventListener('click', () => {
        const selectedTopics = getRandomTopics(3);
        displayTopics(selectedTopics);
    });

    timerBtn.addEventListener('click', () => {
        // Clear any existing timer
        clearInterval(timerInterval);
        timerBtn.disabled = true;
        timerBtn.classList.add('opacity-50');

        // Start 15-second timer
        startTimer(15, () => {
            // After 15-second timer, start 1-minute timer
            startTimer(60, () => {
                timerBtn.disabled = false;
                timerBtn.classList.remove('opacity-50');
            });
        });
    });

    // Generate initial topics
    displayTopics(getRandomTopics(3));
});
