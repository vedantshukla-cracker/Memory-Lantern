
// ======================================
// MEMORY LANTERN - MAIN JAVASCRIPT
// ======================================

// Local Ollama AI configuration

const AI_MODEL = "gemma3:1b";

const OLLAMA_URL = "http://127.0.0.1:11434";

const CHAT_API = OLLAMA_URL + "/api/chat";

const TAGS_API = OLLAMA_URL + "/api/tags";


// ======================================
// GET HTML ELEMENTS
// ======================================

const memoryForm = document.getElementById("memoryForm");

const memoryTitle = document.getElementById("memoryTitle");
const personName = document.getElementById("personName");
const memoryDate = document.getElementById("memoryDate");
const category = document.getElementById("category");
const memoryStory = document.getElementById("memoryStory");

const memoryList = document.getElementById("memoryList");

const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");

const polishBtn = document.getElementById("polishBtn");
const formMessage = document.getElementById("formMessage");

const askForm = document.getElementById("askForm");
const questionInput = document.getElementById("questionInput");
const askBtn = document.getElementById("askBtn");
const aiAnswer = document.getElementById("aiAnswer");

const aiStatus = document.getElementById("aiStatus");
const aiDot = document.getElementById("aiDot");


// ======================================
// LOAD MEMORIES FROM LOCAL STORAGE
// ======================================

let memories = [];

try {
    const savedMemories = localStorage.getItem("memoryLantern");

    memories = savedMemories
        ? JSON.parse(savedMemories)
        : [];

    if (!Array.isArray(memories)) {
        memories = [];
    }

} catch (error) {
    console.error("Could not load saved memories:", error);
    memories = [];
}


// ======================================
// SET TODAY'S DATE
// ======================================

function getTodayDate() {

    const today = new Date();

    const localDate = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    );

    return localDate.toISOString().split("T")[0];
}

memoryDate.value = getTodayDate();


// ======================================
// SAVE MEMORIES TO LOCAL STORAGE
// ======================================

function saveToStorage() {

    localStorage.setItem(
        "memoryLantern",
        JSON.stringify(memories)
    );

}


// ======================================
// HELPER FUNCTIONS
// ======================================

function escapeHTML(value) {

    return String(value ?? "").replace(/[&<>"']/g, function (char) {

        const characters = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return characters[char];

    });

}


function formatDate(date) {

    if (!date) {
        return "Date not available";
    }

    const parsedDate = new Date(date + "T00:00:00");

    if (Number.isNaN(parsedDate.getTime())) {
        return "Date not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

}


// ======================================
// DISPLAY MEMORY STATISTICS
// ======================================

function updateStatistics() {

    document.getElementById("totalMemories").textContent =
        memories.length;

    const people = new Set(
        memories
            .map(memory => memory.person)
            .filter(person => person && person.trim() !== "")
            .map(person => person.trim().toLowerCase())
    );

    document.getElementById("totalPeople").textContent =
        people.size;

    const categories = new Set(
        memories.map(memory => memory.category)
    );

    document.getElementById("totalCategories").textContent =
        categories.size;

}


// ======================================
// DISPLAY SAVED MEMORIES
// ======================================

function renderMemories() {

    const searchText = searchInput.value.toLowerCase().trim();

    const selectedCategory = filterCategory.value;

    const filteredMemories = [...memories]
        .sort((a, b) => {
            return b.date.localeCompare(a.date);
        })
        .filter(memory => {

            const searchContent = [
                memory.title,
                memory.person,
                memory.story,
                memory.category
            ].join(" ").toLowerCase();

            const matchesSearch =
                searchContent.includes(searchText);

            const matchesCategory =
                selectedCategory === "All" ||
                memory.category === selectedCategory;

            return matchesSearch && matchesCategory;

        });


    if (filteredMemories.length === 0) {

        if (memories.length === 0) {

            memoryList.innerHTML = `
                <div class="empty-state">
                    <span>🏮</span>
                    <h3>Your archive is waiting.</h3>
                    <p>Save your first memory and let its story live on.</p>
                </div>
            `;

        } else {

            memoryList.innerHTML = `
                <div class="empty-state">
                    <span>🔍</span>
                    <h3>No memories found.</h3>
                    <p>Try a different search or category.</p>
                </div>
            `;

        }

        updateStatistics();
        return;

    }


    memoryList.innerHTML = filteredMemories.map(memory => {

        return `
            <div class="memory-card">

                <div class="card-top">

                    <span class="category-pill">
                        ${escapeHTML(memory.category)}
                    </span>

                    <button
                        class="delete-btn"
                        data-delete="${escapeHTML(memory.id)}">
                        Delete ✕
                    </button>

                </div>

                <h3>${escapeHTML(memory.title)}</h3>

                <p class="memory-meta">
                    ${memory.person
                ? "❤️ " + escapeHTML(memory.person) + " · "
                : ""}
                    📅 ${escapeHTML(formatDate(memory.date))}
                </p>

                <p class="card-story">
                    ${escapeHTML(memory.story)}
                </p>

                <div class="card-bottom">
                    <span>✦ Memory preserved</span>
                    <span>🏮 Memory Lantern</span>
                </div>

            </div>
        `;

    }).join("");


    updateStatistics();


    // Attach delete events

    document.querySelectorAll("[data-delete]").forEach(button => {

        button.addEventListener("click", function () {

            const memoryId = button.dataset.delete;

            deleteMemory(memoryId);

        });

    });

}


// ======================================
// ADD NEW MEMORY
// ======================================

memoryForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const title = memoryTitle.value.trim();
    const person = personName.value.trim();
    const date = memoryDate.value;
    const selectedCategory = category.value;
    const story = memoryStory.value.trim();


    if (!title || !date || !story) {

        formMessage.textContent =
            "Please fill in all required fields.";

        return;

    }


    const newMemory = {

        id: (window.crypto && window.crypto.randomUUID)
            ? window.crypto.randomUUID()
            : Date.now().toString(),

        title: title,

        person: person,

        date: date,

        category: selectedCategory,

        story: story

    };


    memories.unshift(newMemory);

    saveToStorage();

    renderMemories();

    memoryForm.reset();

    memoryDate.value = getTodayDate();

    formMessage.textContent =
        "✓ Your memory has been saved successfully!";

});


// ======================================
// DELETE MEMORY
// ======================================

function deleteMemory(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this memory?"
    );

    if (!confirmed) {
        return;
    }


    memories = memories.filter(memory => {

        return String(memory.id) !== String(id);

    });


    saveToStorage();

    renderMemories();

    formMessage.textContent =
        "Memory deleted successfully.";

}


// ======================================
// SEARCH MEMORIES
// ======================================

searchInput.addEventListener("input", renderMemories);


// ======================================
// FILTER MEMORIES BY CATEGORY
// ======================================

filterCategory.addEventListener("change", renderMemories);


// ======================================
// CHECK OLLAMA AI CONNECTION
// ======================================

async function checkAIConnection() {

    aiStatus.textContent = "Checking local AI...";

    aiDot.className = "status-dot";

    try {

        const response = await fetch(TAGS_API);

        if (!response.ok) {
            throw new Error("Ollama server is unavailable.");
        }

        const data = await response.json();

        const modelAvailable = data.models.some(model => {

            return model.name === AI_MODEL ||
                model.name.startsWith(AI_MODEL + "-");

        });


        if (modelAvailable) {

            aiStatus.textContent = "Local AI connected";

            aiDot.className = "status-dot online";

        } else {

            aiStatus.textContent = "AI model not installed";

            aiDot.className = "status-dot offline";

        }

    } catch (error) {

        aiStatus.textContent = "Local AI offline";

        aiDot.className = "status-dot offline";

    }

}


// ======================================
// SEND REQUEST TO LOCAL AI
// ======================================

async function askLocalAI(systemPrompt, userPrompt) {

    const response = await fetch(CHAT_API, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            model: AI_MODEL,

            messages: [

                {
                    role: "system",
                    content: systemPrompt
                },

                {
                    role: "user",
                    content: userPrompt
                }

            ],

            stream: false,

            options: {
                temperature: 0.6,
                num_predict: 500
            }

        })

    });


    if (!response.ok) {

        const errorText = await response.text();

        throw new Error(
            "AI request failed. " + errorText
        );

    }


    const data = await response.json();

    if (!data.message || !data.message.content) {

        throw new Error("The AI returned an empty response.");

    }

    return data.message.content.trim();

}


// ======================================
// AI STORY POLISHING
// ======================================

polishBtn.addEventListener("click", async function () {

    const story = memoryStory.value.trim();

    const title = memoryTitle.value.trim();

    const person = personName.value.trim();


    if (!story) {

        formMessage.textContent =
            "Please write your memory first.";

        memoryStory.focus();

        return;

    }


    polishBtn.disabled = true;

    polishBtn.textContent = "✨ AI is polishing your story...";

    formMessage.textContent = "";


    const systemPrompt = `You are Memory Lantern's family story writer.

Your job is to improve personal family memories.

Rules:
1. Keep the original meaning and facts.
2. Do not invent names, dates, places or events.
3. Use warm, emotional and natural language.
4. Keep the story simple and meaningful.
5. Return only the polished story.
6. Do not add a title or unnecessary explanations.`;


    const userPrompt = `
Memory title: ${title}

Person remembered: ${person || "Not specified"}

Original memory:
${story}

Please turn this into a beautiful family memory.
Preserve all original facts.
`;


    try {

        const improvedStory = await askLocalAI(
            systemPrompt,
            userPrompt
        );

        memoryStory.value = improvedStory;

        formMessage.textContent =
            "✨ Your story has been polished. Review it and save your memory.";

    } catch (error) {

        console.error("Story polishing error:", error);

        formMessage.textContent =
            "Could not connect to AI. Please check that Ollama is running and Gemma is installed.";

    }


    polishBtn.disabled = false;

    polishBtn.textContent = "✨ Polish Story with AI";

});


// ======================================
// ASK QUESTIONS ABOUT MEMORIES
// ======================================

askForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const question = questionInput.value.trim();


    if (!question) {
        return;
    }


    if (memories.length === 0) {

        aiAnswer.style.display = "block";

        aiAnswer.textContent =
            "Your memory archive is empty. Save some family memories first, and then I can help you explore them.";

        return;

    }


    askBtn.disabled = true;

    askBtn.textContent = "Thinking...";

    aiAnswer.style.display = "block";

    aiAnswer.textContent =
        "✧ Searching your saved memories and preparing an answer...";


    // Give the AI the saved archive as context.

    const archiveContext = memories
        .slice(0, 25)
        .map((memory, index) => {

            return `
Memory ${index + 1}

Title: ${memory.title}

Person: ${memory.person || "Not specified"}

Date: ${memory.date}

Category: ${memory.category}

Story: ${memory.story}
`;

        })
        .join("\n");


    const systemPrompt = `
You are the Memory Lantern AI assistant.

Your job is to help people explore their personal family archive.

IMPORTANT RULES:

1. Answer using only the memories supplied below.
2. Never invent family details.
3. Never make up dates, names or events.
4. If information is not available, honestly say that it is not in the saved memories.
5. Be warm, respectful and helpful.
6. Use simple and clear language.

SAVED FAMILY MEMORY ARCHIVE:

${archiveContext}
`;


    try {

        const answer = await askLocalAI(
            systemPrompt,
            question
        );

        aiAnswer.textContent = answer;

    } catch (error) {

        console.error("AI assistant error:", error);

        aiAnswer.textContent =
            "I couldn't reach your local AI model. Please make sure Ollama is running and Gemma 3 is installed.";

    }


    askBtn.disabled = false;

    askBtn.textContent = "Ask AI →";

});


// ======================================
// INITIALIZE APPLICATION
// ======================================

function initializeApp() {

    renderMemories();

    updateStatistics();

    checkAIConnection();

}


// Start the application

initializeApp();
