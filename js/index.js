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
    let isTimerRunning = false;

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

    function resetTimer() {
        clearInterval(timerInterval);
        timerDisplay.textContent = '';
        timerBtn.textContent = 'Start Timer';
        timerBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
        timerBtn.classList.add('bg-green-600', 'hover:bg-green-700');
        timerBtn.disabled = false;
        timerBtn.classList.remove('opacity-50');
        isTimerRunning = false;
    }

    function startTimer(duration, callback) {
        let timeLeft = duration;
        timerDisplay.textContent = formatTime(timeLeft);

        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = formatTime(timeLeft);

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                playAlertSound();
                callback?.();
            }
        }, 1000);
    }

    function playAlertSound() {
        alertSound.play();
    }

    generateBtn.addEventListener('click', () => {
        const selectedTopics = getRandomTopics(3);
        displayTopics(selectedTopics);
    });

    timerBtn.addEventListener('click', () => {
        if (isTimerRunning) {
            resetTimer();
            return;
        }

        isTimerRunning = true;
        timerBtn.textContent = 'Cancel Timer';
        timerBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
        timerBtn.classList.add('bg-red-600', 'hover:bg-red-700');

        // Start 15-second timer
        startTimer(15, () => {
            // After 15-second timer, start 1-minute timer
            startTimer(60, () => {
                resetTimer();
            });
        });
    });

    // Generate initial topics
    displayTopics(getRandomTopics(3));
});
