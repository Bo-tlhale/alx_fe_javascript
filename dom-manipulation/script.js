// Initial array of quotes
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Perseverance" },
  { text: "Don’t watch the clock; do what it does. Keep going.", category: "Productivity" },
  { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Inspiration" },
  { text: "It always seems impossible until it’s done.", category: "Determination" }
];

// Get DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");

// Function to show a random quote
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

// Function to create and add the quote form
function createAddQuoteForm() {
  const formContainer = document.createElement("div");
  formContainer.innerHTML = `
    <h3>Add a New Quote</h3>
    <form id="quoteForm">
      <div>
		<input id="newQuoteText" type="text" placeholder="Enter a new quote" />
		<input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
		<button onclick="addQuote()">Add Quote</button>
	  </div>
    </form>
  `;

  document.body.appendChild(formContainer);

  // Handle form submission
  const quoteForm = document.getElementById("quoteForm");
  quoteForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = document.getElementById("quoteText").value.trim();
    const category = document.getElementById("quoteCategory").value.trim();

    if (text && category) {
      const newQuote = { text, category };
      quotes.push(newQuote);
	  localStorage.setItem("quotes", JSON.stringify(quotes));
      alert("Quote added successfully!");

      // Clear inputs
      document.getElementById("quoteText").value = "";
      document.getElementById("quoteCategory").value = "";

      // Optionally display the newly added quote
      showRandomQuote();
    } else {
      alert("Please fill in both fields.");
    }
  });
}

// Event listeners
newQuoteButton.addEventListener("click", showRandomQuote);

// Initialize on page load
window.addEventListener("DOMContentLoaded", () => {
  JSON.parse(localStorage.getItem("quotes"));
  showRandomQuote();
  createAddQuoteForm();
});

 document.getElementById("exportBtn").addEventListener("click", () => {
      const data = JSON.stringify(quotes, null, 2); // Pretty format JSON
      const blob = new Blob([data], { type: "application/json" }); // Create a Blob
      const url = URL.createObjectURL(blob); // Create a temporary download URL

      const a = document.createElement("a");
      a.href = url;
      a.download = "quotes.json"; // Filename
      document.body.appendChild(a);
      a.click(); // Trigger download
      document.body.removeChild(a);
	  
 });

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
const dropdown = document.getElementById("categoryFilter");

function populateCategories() {
      const categories = ["all", ...new Set(quotes.map(q => q.category))];
      dropdown.innerHTML = "";
      categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        categorySelect.appendChild(option);
      });

      // Restore last selected category from localStorage
      const savedCategory = localStorage.getItem("selectedCategory") || "all";
      categorySelect.value = savedCategory;
      filterQuotes();
    }

    // ----- Filter quotes -----
    function filterQuotes() {
      const selectedCategory = categorySelect.value;
      localStorage.setItem("selectedCategory", selectedCategory);

      if (selectedCategory === "all") {
        renderQuotes(quotes);
      } else {
        const filtered = quotes.filter(q => q.category === selectedCategory);
        renderQuotes(filtered);
      }
    }