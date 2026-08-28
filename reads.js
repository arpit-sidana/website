const books = [
  { title: "The Network State", subtitle: "How to Start a New Country", author: "Balaji Srinivasan", genres: ["Technology", "Society"], status: "Backlog", cover: "network-state.jpg", summary: "A proposal for digitally organized communities that build shared institutions before seeking recognition as new political entities." },
  { title: "On the Edge", subtitle: "The Art of Risking Everything", author: "Nate Silver", genres: ["Business", "Society"], status: "Backlog", cover: "on-the-edge.jpg", summary: "An exploration of professional risk-takers and how probabilistic thinking shapes markets, technology, politics, and modern life." },
  { title: "The Anthology of Balaji", subtitle: "A Guide to Technology, Truth, and Building the Future", author: "Eric Jorgenson", genres: ["Technology", "Society"], status: "Backlog", cover: "anthology-balaji.jpg", summary: "A curated collection of Balaji Srinivasan's ideas on technological progress, decentralized systems, and building the future." },
  { title: "Read Write Own", subtitle: "Building the Next Era of the Internet", author: "Chris Dixon", genres: ["Technology", "Business"], status: "Backlog", cover: "read-write-own.jpg", summary: "A case for blockchain networks as a new internet architecture that gives users and creators meaningful ownership." },
  { title: "The Company", subtitle: "A Short History of a Revolutionary Idea", author: "John Micklethwait & Adrian Wooldridge", genres: ["Business", "Science & History"], status: "Backlog", cover: "the-company.jpg", summary: "A compact history of the corporation and the outsized role it has played in organizing economic and social life." },
  { title: "The Psychology of Money", subtitle: "Timeless Lessons on Wealth, Greed, and Happiness", author: "Morgan Housel", genres: ["Business", "Society"], status: "Backlog", cover: "psychology-money.jpg", summary: "Short stories about how behavior, incentives, luck, and personal history shape the way people handle money." },
  { title: "The Origins of Political Order", subtitle: "From Prehuman Times to the French Revolution", author: "Francis Fukuyama", genres: ["Society", "Science & History"], status: "Backlog", cover: "origins-political-order.jpg", summary: "A broad account of how states, laws, and accountable institutions emerged across different civilizations." },
  { title: "A Short History of Nearly Everything", subtitle: "", author: "Bill Bryson", genres: ["Science & History"], status: "Backlog", cover: "short-history-everything.jpg", summary: "An accessible tour through the scientific discoveries that explain the universe, Earth, and human life." },
  { title: "Algorithms to Live By", subtitle: "The Computer Science of Human Decisions", author: "Brian Christian & Tom Griffiths", genres: ["Technology", "Society"], status: "Backlog", cover: "algorithms-live-by.jpg", summary: "Computer-science principles translated into practical strategies for making decisions under uncertainty and limited time." },
  { title: "The Anxious Generation", subtitle: "How the Great Rewiring of Childhood Is Causing an Epidemic of Mental Illness", author: "Jonathan Haidt", genres: ["Society", "Science & History"], status: "Backlog", cover: "anxious-generation.jpg", summary: "An argument that phone-based childhood changed adolescent development, with proposals for restoring healthier norms." },
  { title: "What It Takes", subtitle: "Lessons in the Pursuit of Excellence", author: "Stephen A. Schwarzman", genres: ["Business", "Biography"], status: "Backlog", cover: "what-it-takes.jpg", summary: "Lessons on ambition, leadership, hiring, and dealmaking drawn from the Blackstone co-founder's career." },
  { title: "India After Gandhi", subtitle: "The History of the World's Largest Democracy", author: "Ramachandra Guha", genres: ["Science & History", "Society"], status: "Backlog", cover: "india-after-gandhi.jpg", summary: "A sweeping history of independent India and the political, social, and economic forces that shaped its democracy." },
  { title: "The Bhagavad Gita", subtitle: "", author: "Anonymous", genres: ["Philosophy"], status: "Backlog", cover: "bhagavad-gita.jpg", summary: "A foundational dialogue on duty, action, discipline, and spiritual insight set on the eve of battle." },
  { title: "Principles for Dealing with the Changing World Order", subtitle: "Why Nations Succeed and Fail", author: "Ray Dalio", genres: ["Business", "Science & History"], status: "Read", cover: "changing-world-order.jpg", summary: "A framework for understanding the recurring economic and political cycles behind the rise and decline of great powers." },
  { title: "Capitalism and Freedom", subtitle: "", author: "Milton Friedman", genres: ["Business", "Society"], status: "Read", cover: "capitalism-freedom.jpg", summary: "A defense of competitive markets and limited government as foundations for economic and political freedom." },
  { title: "The End of Faith", subtitle: "Religion, Terror, and the Future of Reason", author: "Sam Harris", genres: ["Philosophy", "Society"], status: "Read", cover: "end-of-faith.jpg", summary: "A critique of religious faith and its consequences for public reasoning, conflict, and ethics." },
  { title: "The Sovereign Individual", subtitle: "Mastering the Transition to the Information Age", author: "James Dale Davidson & William Rees-Mogg", genres: ["Technology", "Society"], status: "Read", cover: "sovereign-individual.jpg", summary: "A forecast of how digital technology could weaken nation-states and reshape power, work, money, and personal autonomy." },
  { title: "Angel", subtitle: "How to Invest in Technology Startups", author: "Jason Calacanis", genres: ["Business", "Technology"], status: "Read", cover: "angel.jpg", summary: "A practical introduction to sourcing, evaluating, and supporting early-stage startup investments." },
  { title: "Lifespan", subtitle: "Why We Age—and Why We Don't Have To", author: "David A. Sinclair", genres: ["Science & History"], status: "Read", cover: "lifespan.jpg", summary: "A survey of aging research and the biological pathways scientists hope to use to extend healthy life." },
  { title: "This Is How They Tell Me the World Ends", subtitle: "The Cyberweapons Arms Race", author: "Nicole Perlroth", genres: ["Technology", "Science & History"], status: "Read", cover: "cyberweapons.jpg", summary: "An investigation into the secret market for software vulnerabilities and the global escalation of offensive cyberwarfare." },
  { title: "Zero to One", subtitle: "Notes on Startups, or How to Build the Future", author: "Peter Thiel & Blake Masters", genres: ["Business", "Technology"], status: "Read", cover: "zero-to-one.jpg", summary: "A contrarian guide to building distinctive companies through technological insight, monopoly advantages, and original thinking." },
  { title: "Super Pumped", subtitle: "The Battle for Uber", author: "Mike Isaac", genres: ["Business", "Technology", "Biography"], status: "Read", cover: "super-pumped.jpg", summary: "The inside story of Uber's hypergrowth, combative culture, and the downfall of co-founder Travis Kalanick." },
  { title: "Fooled by Randomness", subtitle: "The Hidden Role of Chance in Life and in the Markets", author: "Nassim Nicholas Taleb", genres: ["Business", "Society"], status: "Read", cover: "fooled-randomness.jpg", summary: "A study of how people mistake luck for skill and underestimate randomness in markets, careers, and everyday judgment." },
  { title: "1984", subtitle: "", author: "George Orwell", genres: ["Fiction"], status: "Read", cover: "1984.jpg", summary: "A dystopian novel about surveillance, propaganda, language, and the totalitarian destruction of private truth." },
  { title: "Drive", subtitle: "The Surprising Truth About What Motivates Us", author: "Daniel H. Pink", genres: ["Society", "Business"], status: "Read", cover: "drive.jpg", summary: "An argument that autonomy, mastery, and purpose often motivate knowledge work better than conventional rewards." },
  { title: "The Millionaire Next Door", subtitle: "The Surprising Secrets of America's Wealthy", author: "Thomas J. Stanley & William D. Danko", genres: ["Business", "Society"], status: "Read", cover: "millionaire-next-door.jpg", summary: "Research on the understated habits, spending choices, and wealth-building patterns of affluent American households." },
  { title: "Why I Am a Hindu", subtitle: "", author: "Shashi Tharoor", genres: ["Philosophy", "Society"], status: "Read", cover: "why-i-am-a-hindu.jpg", summary: "A personal account of Hindu philosophy alongside an argument against its use as a narrow political identity." },
  { title: "Last Man Standing", subtitle: "The Ascent of Jamie Dimon and JPMorgan Chase", author: "Duff McDonald", genres: ["Biography", "Business"], status: "Read", cover: "last-man-standing.jpg", summary: "A biography of Jamie Dimon's career and the decisions that positioned JPMorgan to survive the financial crisis." },
  { title: "Good Economics for Hard Times", subtitle: "Better Answers to Our Biggest Problems", author: "Abhijit V. Banerjee & Esther Duflo", genres: ["Business", "Society"], status: "Read", cover: "good-economics.jpg", summary: "Evidence-based thinking on migration, trade, inequality, growth, and climate policy from two development economists." },
  { title: "Doing Justice", subtitle: "A Prosecutor's Thoughts on Crime, Punishment, and the Rule of Law", author: "Preet Bharara", genres: ["Society"], status: "Read", cover: "doing-justice.jpg", summary: "Stories from federal prosecution used to examine truth, judgment, punishment, and institutional integrity." },
  { title: "Hooked", subtitle: "How to Build Habit-Forming Products", author: "Nir Eyal", genres: ["Business", "Technology"], status: "Read", cover: "hooked.jpg", summary: "A product-design framework explaining how triggers, actions, rewards, and investment can create recurring user habits." },
  { title: "The Body", subtitle: "A Guide for Occupants", author: "Bill Bryson", genres: ["Science & History"], status: "Read", cover: "the-body.jpg", summary: "A lively tour of human anatomy, medicine, and the remarkable systems that keep the body functioning." }
];

const filterOrder = ["All", "Business", "Technology", "Society", "Science & History", "Biography", "Fiction", "Philosophy", "Backlog"];
const grid = document.querySelector("#bookshelf-grid");
const filters = document.querySelector("#book-filters");
const search = document.querySelector("#book-search");
const results = document.querySelector("#book-results");
const empty = document.querySelector("#bookshelf-empty");
let activeFilter = "All";

function countFor(filter) {
  if (filter === "All") return books.length;
  if (filter === "Backlog") return books.filter((book) => book.status === "Backlog").length;
  return books.filter((book) => book.genres.includes(filter)).length;
}

function renderFilters() {
  filters.innerHTML = filterOrder.map((filter) => `
    <button class="book-filter${filter === activeFilter ? " is-active" : ""}" type="button" data-filter="${filter}" aria-pressed="${filter === activeFilter}">
      ${filter}<span>${countFor(filter)}</span>
    </button>
  `).join("");
}

function matchesFilter(book) {
  if (activeFilter === "All") return true;
  if (activeFilter === "Backlog") return book.status === "Backlog";
  return book.genres.includes(activeFilter);
}

function renderBooks() {
  const query = search.value.trim().toLowerCase();
  const visible = books.filter((book) => {
    const haystack = [book.title, book.subtitle, book.author, ...book.genres].join(" ").toLowerCase();
    return matchesFilter(book) && (!query || haystack.includes(query));
  });

  grid.innerHTML = visible.map((book) => `
    <article class="book-card">
      <div class="book-cover-wrap">
        <img class="book-cover" src="assets/images/books/${book.cover}" alt="Cover of ${book.title} by ${book.author}" loading="lazy" width="330" height="500">
        ${book.status === "Backlog" ? '<span class="backlog-badge">backlog</span>' : ""}
      </div>
      <div class="book-meta">
        <p class="book-genres">${book.genres.join(" · ")}</p>
        <h2>${book.title}</h2>
        ${book.subtitle ? `<p class="book-subtitle">${book.subtitle}</p>` : ""}
        <p class="book-author">${book.author}</p>
        <p class="book-summary">${book.summary}</p>
      </div>
    </article>
  `).join("");

  results.textContent = `${visible.length} ${visible.length === 1 ? "book" : "books"}`;
  empty.hidden = visible.length !== 0;
}

filters.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;
  activeFilter = button.dataset.filter;
  renderFilters();
  renderBooks();
});

search.addEventListener("input", renderBooks);
renderFilters();
renderBooks();
