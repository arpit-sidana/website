const search = document.querySelector("#book-search");
const statusFilter = document.querySelector("#status-filter");
const rows = [...document.querySelectorAll(".reads-table tbody tr")];

function filterRows() {
  const query = search.value.trim().toLowerCase();
  const status = statusFilter.value;
  for (const row of rows) {
    const cells = row.querySelectorAll("td");
    const matchesQuery = !query || row.textContent.toLowerCase().includes(query);
    const matchesStatus = !status || cells[2].textContent.trim() === status;
    row.hidden = !(matchesQuery && matchesStatus);
  }
}

search.addEventListener("input", filterRows);
statusFilter.addEventListener("change", filterRows);

