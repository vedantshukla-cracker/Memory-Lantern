# 🏮 Memory Lantern

**An AI-powered family memory archive** that helps people preserve personal stories and explore them with a locally running AI model.

Memory Lantern is a beginner-friendly web project inspired by remembrance, family traditions, and the idea that meaningful stories should be preserved for future generations.

> *Save a memory. Keep a story alive.*

---

## ✨ Features

- **Save family memories:** Add a title, person, date, category, and story.
- **Browser-based storage:** Memories are saved in the browser using `localStorage` and remain available after refreshing the page in the same browser profile.
- **Search and filter:** Find memories by title, person, story text, or category.
- **AI story polishing:** Ask Gemma 3 1B to rewrite rough notes as a clearer, warmer story while being instructed not to invent details.
- **Ask your archive:** Ask questions about saved memories. The app supplies up to 25 of the latest saved memories as context to the model.
- **Delete memories:** Remove an entry from the archive.
- **Responsive interface:** Layout adapts to desktop, tablet, and mobile screens.

---

## 🧰 Built With

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and forms |
| CSS3 | Layout, styling, animations, and responsive design |
| JavaScript | Memory management, search, filtering, and AI requests |
| Browser `localStorage` | Saves memories in the current browser |
| [Ollama](https://ollama.com/) | Runs the AI model locally |
| [Gemma 3 1B](https://ollama.com/library/gemma3) | Local language model for story polishing and archive questions |

---

## 📁 Project Structure

```
Memory-Lantern/
├── index.html   # Main webpage
├── style.css    # Website design and responsive layout
├── script.js    # App logic, local storage, and Ollama connection
└── README.md    # Project documentation
```

---

## 🚀 Getting Started

### 1. Requirements

- A computer running Windows, macOS, or Linux.
- A modern browser such as Chrome, Edge, or Firefox.
- [Visual Studio Code](https://code.visualstudio.com/) or another code editor.
- [Ollama](https://ollama.com/download) installed for AI features.
- An internet connection for the initial Ollama and model download. The app's local AI features can then run without a hosted AI API, provided Ollama is running locally.

### 2. Download or clone the project

Clone your GitHub repository (replace the URL with your repository URL):

```bash
git clone https://github.com/YOUR-USERNAME/Memory-Lantern.git
cd Memory-Lantern
```

Alternatively, download the repository as a ZIP and extract it.

### 3. Download the Gemma model

Open a terminal and run:

```bash
ollama pull gemma3:1b
```

The `gemma3:1b` model download is listed at approximately 806 MB in the Ollama model library; the actual storage required can vary. The model is downloaded once and kept locally by Ollama.

To confirm that it is installed:

```bash
ollama list
```

You should see `gemma3:1b` in the list.

### 4. Start Ollama

Open or start the Ollama desktop application. On systems where Ollama is managed from a terminal, you can start the server with:

```bash
ollama serve
```

If Ollama is already running as a background application, you usually do not need to start a second server.

The app expects the local Ollama API at:

```
http://127.0.0.1:11434
```

### 5. Run the website

1. Open the `Memory-Lantern` folder in VS Code.
2. Install the **Live Server** extension, if you do not already have it.
3. Right-click `index.html`.
4. Choose **Open with Live Server**.
5. Keep Ollama running while using the AI features.

You can also serve the folder with another local static web server. Do not rely on opening the HTML file directly if the browser blocks local API requests.

---

## 🧠 How the AI Integration Works

The browser sends requests to the Ollama server running on the same computer:

- `GET /api/tags` checks whether the configured model is installed.
- `POST /api/chat` sends prompts to the model and receives its response.

The model name is configured near the top of `script.js`:

```javascript
const AI_MODEL = "gemma3:1b";
const OLLAMA_URL = "http://127.0.0.1:11434";
```

The app uses two AI workflows:

1. **Polish Story:** Sends the draft story and asks the model to improve its wording without changing the original facts. The result is placed back into the story field. Review it and click **Save Memory** to store it.

2. **Ask your memories:** Sends the question together with up to 25 recently saved memories as context. The prompt asks the model to answer only from those memories and to say when the archive does not contain the answer.

> ⚠️ The AI may still misunderstand or generate inaccurate details. Always review generated text before saving or relying on it.

---

## 🔐 Privacy and Data Storage

- Memory entries are stored in the browser's `localStorage` on the device and browser profile where they were created.
- The app does not include its own remote database or application backend.
- AI prompts are sent to the Ollama server at the local address configured in `script.js`, rather than to a third-party hosted AI API.
- The archive is not automatically synchronized across browsers or devices.
- Clearing browser data, using private browsing, or changing browser profiles may make saved memories unavailable. Back up important content separately.

> **Privacy note:** This is a prototype, not a secure vault. Do not enter highly sensitive personal information. Anyone with access to the same unlocked device and browser profile may be able to access the saved archive. Keep Ollama bound to your local machine; do not expose its API port to the public internet for this demo.

---

## ⚠️ Current Scope and Limitations

This version is a frontend prototype. It currently does not include:

- User accounts, authentication, or encrypted storage.
- Cloud synchronization or a remote database.
- Photo/audio/video uploads.
- Memory editing after an entry has been saved.
- Export/import or automatic backup.
- A hosted backend that runs the model for visitors.

The archive-question feature passes only up to 25 recent saved entries to the AI for each question. It is not a full search or retrieval system, and the model's answers may be incomplete.

### Running a public demo

The current JavaScript calls `127.0.0.1`, which means it expects Ollama to be running on the visitor's own computer. Deploying these three static files to a public website does not provide a shared AI server. A visitor would need to install and run Ollama and allow the website's exact origin in Ollama's origin settings. For a simple project demonstration, run the app locally and record a short video showing the memory and AI features. Do not configure Ollama to accept every website origin or expose the local API publicly.

---

## 🛠️ Troubleshooting

### The AI status says "Local AI offline"

- Confirm that Ollama is installed and running.
- Open `http://127.0.0.1:11434/api/tags` in your browser. Ollama should return model information if the local API is running.
- Check that the model is installed with `ollama list`.

### The AI status says "AI model not installed"

Run:

```bash
ollama pull gemma3:1b
```

Then refresh the Memory Lantern page.

### The browser shows a CORS or network error

Ollama allows local browser origins such as `127.0.0.1` and `localhost` by default. Use a local Live Server URL and check Ollama's official documentation if you use a different origin. Only allow the exact origin you trust; do not use a wildcard to expose the API to arbitrary websites.

### Memories disappear

This version stores data in browser `localStorage`. Check that you are using the same browser and profile and have not cleared site data. This prototype does not currently provide an export or recovery feature.

---

## 🌱 Why Local AI?

Memory Lantern uses a locally running model so the application can demonstrate AI-assisted writing without depending on a paid hosted AI API key. Local inference gives the user more control over where prompts are processed and makes an offline-capable workflow possible after the model has been downloaded.

The project uses Gemma 3 1B through Ollama. Gemma is an open-weight model family. Review the [Gemma Terms of Use](https://ai.google.dev/gemma/terms) and the model information on the [Ollama Gemma 3 library page](https://ollama.com/library/gemma3) before redistributing the model or making licensing claims. Open weights and open-source software licenses are not interchangeable terms.

---

## 🗺️ Future Improvements

- Export and import memories as JSON.
- Add editing for saved entries.
- Attach photographs to memories.
- Create printable remembrance and tribute cards.
- Add a chronological family timeline.
- Improve archive search and retrieval for larger collections.
- Add optional encryption and a secure backup workflow.
- Create a backend deployment option for a shared public demo.

---

## 🤝 Contributing

Suggestions, bug reports, and improvements are welcome. For code changes:

1. Fork the repository.
2. Create a branch for your change.
3. Test the feature locally with Ollama.
4. Submit a pull request describing the change.

Before publishing this repository for reuse, add a project `LICENSE` file that clearly states the license for the source code. The Gemma model is governed separately by its own terms.

---

## 📄 License

The source-code license for this project has not yet been selected. Add a `LICENSE` file before presenting the repository as reusable open-source software. Gemma's model terms are separate; see the [Gemma Terms of Use](https://ai.google.dev/gemma/terms).

---

<p align="center">
  Made with care to keep family stories alive. 🏮
</p>

---

### Useful Links

- [Ollama download](https://ollama.com/download)
- [Ollama documentation](https://docs.ollama.com/)
- [Ollama API documentation](https://docs.ollama.com/api)
- [Gemma 3 model library](https://ollama.com/library/gemma3)
- [Gemma Terms of Use](https://ai.google.dev/gemma/terms)
