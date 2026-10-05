/* =====================================
   ELEMENTS
===================================== */

const textInput = document.getElementById("textInput");

const charCount = document.getElementById("charCount");

const analyzeTextBtn =
    document.getElementById("analyzeTextBtn");

const micButton =
    document.getElementById("micButton");

const micCircle =
    document.getElementById("micCircle");

const voiceStatus =
    document.getElementById("voiceStatus");

const voiceText =
    document.getElementById("voiceText");


/* =====================================
   CHARACTER COUNT
===================================== */

textInput.addEventListener("input", function () {

    const count = textInput.value.length;

    charCount.textContent =
        count + " characters";

});


/* =====================================
   EMOTION DATA
===================================== */

const emotions = {

    Happy: {
        emoji: "😊",
        description:
            "The text expresses happiness, positivity or excitement.",
        keywords: [
            "happy",
            "joy",
            "joyful",
            "great",
            "good",
            "excellent",
            "love",
            "lovely",
            "amazing",
            "wonderful",
            "excited",
            "success",
            "win",
            "won",
            "congratulations",
            "fun",
            "beautiful",
            "best"
        ]
    },

    Sad: {
        emoji: "😢",
        description:
            "The text contains words associated with sadness or disappointment.",
        keywords: [
            "sad",
            "unhappy",
            "cry",
            "crying",
            "lonely",
            "alone",
            "pain",
            "hurt",
            "depressed",
            "disappointed",
            "loss",
            "lost",
            "miss",
            "missing",
            "bad",
            "upset",
            "broken"
        ]
    },

    Angry: {
        emoji: "😡",
        description:
            "The text expresses anger, frustration or irritation.",
        keywords: [
            "angry",
            "anger",
            "hate",
            "hated",
            "furious",
            "annoyed",
            "annoying",
            "irritated",
            "frustrated",
            "fight",
            "stupid",
            "worst",
            "mad"
        ]
    },

    Fear: {
        emoji: "😨",
        description:
            "The text contains words related to fear, worry or anxiety.",
        keywords: [
            "fear",
            "afraid",
            "scared",
            "worried",
            "worry",
            "danger",
            "dangerous",
            "nervous",
            "anxiety",
            "anxious",
            "terrified",
            "risk",
            "threat"
        ]
    },

    Surprise: {
        emoji: "😮",
        description:
            "The text expresses surprise, shock or unexpected feelings.",
        keywords: [
            "wow",
            "surprise",
            "surprised",
            "shocked",
            "unexpected",
            "unbelievable",
            "really",
            "suddenly",
            "amazing"
        ]
    },

    Neutral: {
        emoji: "😐",
        description:
            "The text does not strongly indicate a specific emotion.",
        keywords: []
    }

};


/* =====================================
   ANALYZE TEXT
===================================== */

analyzeTextBtn.addEventListener(
    "click",
    function () {

        const text =
            textInput.value.trim();

        if (text === "") {

            alert(
                "Please enter some text first."
            );

            return;
        }

        analyzeEmotion(text);

    }
);


/* =====================================
   EMOTION ANALYZER
===================================== */

function analyzeEmotion(text) {

    const lowerText =
        text.toLowerCase();

    let scores = {

        Happy: 0,
        Sad: 0,
        Angry: 0,
        Fear: 0,
        Surprise: 0,
        Neutral: 0

    };


    /* Check keywords */

    for (
        const emotion in emotions
    ) {

        const keywords =
            emotions[emotion].keywords;

        keywords.forEach(
            function (word) {

                if (
                    lowerText.includes(word)
                ) {

                    scores[emotion] += 1;

                }

            }
        );

    }


    /* Find highest score */

    let highestEmotion =
        "Neutral";

    let highestScore =
        0;


    for (
        const emotion in scores
    ) {

        if (
            scores[emotion] >
            highestScore
        ) {

            highestScore =
                scores[emotion];

            highestEmotion =
                emotion;

        }

    }


    /* Calculate confidence */

    let totalScore = 0;

    for (
        const emotion in scores
    ) {

        totalScore +=
            scores[emotion];

    }


    let confidence;


    if (totalScore === 0) {

        confidence = 45;

    } else {

        confidence =
            Math.round(
                (
                    highestScore /
                    totalScore
                ) * 100
            );

    }


    /* Add neutral baseline */

    if (
        highestEmotion === "Neutral"
    ) {

        scores.Neutral = 1;

    }


    displayResult(
        highestEmotion,
        confidence,
        scores
    );

}


/* =====================================
   DISPLAY RESULT
===================================== */

function displayResult(
    emotion,
    confidence,
    scores
) {

    const emotionEmoji =
        document.getElementById(
            "emotionEmoji"
        );

    const emotionName =
        document.getElementById(
            "emotionName"
        );

    const emotionDescription =
        document.getElementById(
            "emotionDescription"
        );

    const confidenceValue =
        document.getElementById(
            "confidenceValue"
        );

    const confidenceBar =
        document.getElementById(
            "confidenceBar"
        );


    /* Main result */

    emotionEmoji.textContent =
        emotions[emotion].emoji;

    emotionName.textContent =
        emotion;

    emotionDescription.textContent =
        emotions[emotion].description;


    confidenceValue.textContent =
        confidence + "%";

    confidenceBar.style.width =
        confidence + "%";


    /* Score calculation */

    let total =
        Object.values(scores)
        .reduce(
            (sum, value) =>
                sum + value,
            0
        );


    if (total === 0) {

        total = 1;

    }


    /* Update every emotion */

    updateScore(
        "Happy",
        scores.Happy,
        total
    );

    updateScore(
        "Sad",
        scores.Sad,
        total
    );

    updateScore(
        "Angry",
        scores.Angry,
        total
    );

    updateScore(
        "Fear",
        scores.Fear,
        total
    );

    updateScore(
        "Surprise",
        scores.Surprise,
        total
    );

    updateScore(
        "Neutral",
        scores.Neutral,
        total
    );

}


/* =====================================
   UPDATE SCORE
===================================== */

function updateScore(
    emotion,
    score,
    total
) {

    let percentage =
        Math.round(
            (score / total) * 100
        );


    if (
        emotion === "Neutral" &&
        score > 0 &&
        percentage < 45
    ) {

        percentage = 45;

    }


    const scoreElement =
        document.getElementById(
            emotion.toLowerCase() +
            "Score"
        );

    const barElement =
        document.getElementById(
            emotion.toLowerCase() +
            "Bar"
        );


    if (scoreElement) {

        scoreElement.textContent =
            percentage + "%";

    }


    if (barElement) {

        barElement.style.width =
            percentage + "%";

    }

}


/* =====================================
   SPEECH RECOGNITION
===================================== */

let recognition;

let isRecording = false;


/* Check browser support */

if (
    "webkitSpeechRecognition"
    in window
) {

    recognition =
        new webkitSpeechRecognition();

} else if (
    "SpeechRecognition"
    in window
) {

    recognition =
        new SpeechRecognition();

}


/* =====================================
   START / STOP MICROPHONE
===================================== */

micButton.addEventListener(
    "click",
    function () {

        if (!recognition) {

            alert(
                "Speech recognition is not supported in this browser. Please use Google Chrome."
            );

            return;

        }


        if (!isRecording) {

            startRecording();

        } else {

            stopRecording();

        }

    }
);


/* =====================================
   START RECORDING
===================================== */

function startRecording() {

    isRecording = true;

    recognition.continuous = true;

    recognition.interimResults = true;

    recognition.lang = "en-US";


    voiceStatus.textContent =
        "Listening...";

    voiceText.textContent =
        "Speak clearly into your microphone.";

    micButton.textContent =
        "Stop Recording";

    micButton.classList.add(
        "stop"
    );

    micCircle.classList.add(
        "recording"
    );


    recognition.start();

}


/* =====================================
   STOP RECORDING
===================================== */

function stopRecording() {

    isRecording = false;

    recognition.stop();

    voiceStatus.textContent =
        "Recording stopped";

    micButton.textContent =
        "Start Recording";

    micButton.classList.remove(
        "stop"
    );

    micCircle.classList.remove(
        "recording"
    );

}


/* =====================================
   SPEECH RESULT
===================================== */

if (recognition) {

    recognition.onresult =
        function (event) {

            let finalText = "";

            for (
                let i =
                event.resultIndex;

                i <
                event.results.length;

                i++
            ) {

                finalText +=
                    event.results[i][0]
                    .transcript;

            }


            voiceText.textContent =
                finalText;


            /* Put voice text into textarea */

            textInput.value =
                finalText;

            textInput.dispatchEvent(
                new Event("input")
            );


            /* Analyze automatically */

            if (
                finalText.trim() !== ""
            ) {

                analyzeEmotion(
                    finalText
                );

            }

        };


    recognition.onerror =
        function () {

            voiceStatus.textContent =
                "Could not recognize voice";

            voiceText.textContent =
                "Please try again and speak clearly.";

            isRecording = false;

            micButton.textContent =
                "Start Recording";

            micButton.classList.remove(
                "stop"
            );

            micCircle.classList.remove(
                "recording"
            );

        };


    recognition.onend =
        function () {

            if (isRecording) {

                try {

                    recognition.start();

                } catch (error) {

                    console.log(error);

                }

            }

        };

}