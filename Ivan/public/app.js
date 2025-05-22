let nextCursor = null;

function renderResults(data) {
  const resultsDiv = document.getElementById('results');
  if (!data.items.length) {
    resultsDiv.innerHTML = '<p>No items found.</p>';
    document.getElementById('nextPage').style.display = 'none';
    return;
  }
  let html = '<table><tr><th>Name</th><th>Value</th><th>Created At</th></tr>';
  data.items.forEach(item => {
    html += `<tr><td>${item.name}</td><td>${item.value}</td><td>${new Date(item.createdAt).toLocaleString()}</td></tr>`;
  });
  html += '</table>';
  resultsDiv.innerHTML = html;
  nextCursor = data.nextCursor;
  document.getElementById('nextPage').style.display = nextCursor ? 'inline-block' : 'none';
}

document.getElementById('queryForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  nextCursor = null;
  await fetchItems();
});

document.getElementById('nextPage').addEventListener('click', async function() {
  await fetchItems(nextCursor);
});

async function fetchItems(cursor) {
  const form = document.getElementById('queryForm');
  const params = new URLSearchParams(new FormData(form));
  if (cursor) params.append('after', cursor);
  const res = await fetch(`/items?${params.toString()}`);
  const data = await res.json();
  renderResults(data);
}
