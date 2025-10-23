// ============================
// INITIAL SETUP
// ============================

let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Perseverance" },
  { text: "Don’t watch the clock; do what it does. Keep going.", category: "Productivity" },
  { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Inspiration" },
  { text: "It always seems impossible until it’s done.", category: "Determination" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const categorySelect = document.getElementById("categoryFilter");

// ============================
// DISPLAY & ADD QUOTES
// ============================

function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available.</p>";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <p><em>— ${quote.category}</em></p>
  `;
}

function createAddQuoteForm() {
  const formContainer = document.createElement("div");
  formContainer.innerHTML = `
    <h3>Add a New Quote</h3>
    <form id="quoteForm">
      <div>
        <input id="quoteText" type="text" placeholder="Enter a new quote" />
        <input id="quoteCategory" type="text" placeholder="Enter quote category" />
        <button type="submit">Add Quote</button>
      </div>
    </form>
  `;

  document.body.appendChild(formContainer);

  document.getElementById("quoteForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const text = document.getElementById("quoteText").value.trim();
    const category = document.getElementById("quoteCategory").value.trim();

    if (text && category) {
      const newQuote = { text, category };
      quotes.push(newQuote);
      saveQuotes();
      alert("Quote added successfully!");
      showRandomQuote();
      populateCategories();
    } else {
      alert("Please fill in both fields.");
    }
  });
}

// ============================
// STORAGE & FILTERING
// ============================

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories() {
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  categorySelect.innerHTML = "";
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categorySelect.appendChild(option);
  });

  const savedCategory = localStorage.getItem("selectedCategory") || "all";
  categorySelect.value = savedCategory;
  filterQuotes();
}

function filterQuotes() {
  const selectedCategory = categorySelect.value;
  localStorage.setItem("selectedCategory", selectedCategory);
  let filtered = quotes;

  if (selectedCategory !== "all") {
    filtered = quotes.filter(q => q.category === selectedCategory);
  }

  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes found for this category.</p>";
  } else {
    const randomIndex = Math.floor(Math.random() * filtered.length);
    const quote = filtered[randomIndex];
    quoteDisplay.innerHTML = `
      <p>"${quote.text}"</p>
      <p><em>— ${quote.category}</em></p>
    `;
  }
}

// ============================
// IMPORT & EXPORT
// ============================

document.getElementById("exportBtn").addEventListener("click", () => {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert("Quotes imported successfully!");
    populateCategories();
  };
  fileReader.readAsText(event.target.files[0]);
}

// ============================
// SERVER SYNC SIMULATION
// ============================

const SERVER_ENDPOINT = "https://jsonplaceholder.typicode.com/posts";
const SYNC_INTERVAL = 15000; // 15 seconds

async function fetchServerQuotes() {
  try {
    const response = await fetch(SERVER_ENDPOINT);
    const data = await response.json();

    // Simulate "server quotes"
    const serverQuotes = data.slice(0, 5).map((item, index) => ({
      text: item.title,
      category: ["Motivation", "Life", "Inspiration", "Productivity"][index % 4]
    }));

    handleServerSync(serverQuotes);
  } catch (error) {
    console.error("Error fetching from server:", error);
  }
}

function handleServerSync(serverQuotes) {
  let conflictsResolved = false;

  // Conflict resolution: server takes precedence
  serverQuotes.forEach(sq => {
    const exists = quotes.some(lq => lq.text === sq.text);
    if (!exists) {
      quotes.push(sq);
      conflictsResolved = true;
    }
  });

  if (conflictsResolved) {
    saveQuotes();
    populateCategories();
    showNotification("Quotes updated from server (server took precedence).");
  }
}

function showNotification(message) {
  let notification = document.getElementById("syncNotification");
  if (!notification) {
    notification = document.createElement("div");
    notification.id = "syncNotification";
    notification.style.position = "fixed";
    notification.style.bottom = "10px";
    notification.style.right = "10px";
    notification.style.padding = "10px";
    notification.style.background = "#f0c040";
    notification.style.borderRadius = "8px";
    notification.style.boxShadow = "0 0 6px rgba(0,0,0,0.2)";
    document.body.appendChild(notification);
  }
  notification.textContent = message;
  setTimeout(() => (notification.style.display = "none"), 4000);
}

// Start periodic sync
setInterval(fetchServerQuotes, SYNC_INTERVAL);

// ============================
// INITIALIZATION
// ============================

newQuoteButton.addEventListener("click", showRandomQuote);

window.addEventListener("DOMContentLoaded", () => {
  showRandomQuote();
  createAddQuoteForm();
  populateCategories();
  fetchServerQuotes(); // initial sync
});
