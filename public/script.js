let currentPage = 1;
const limit = 10;

async function fetchDataForBothSections(page) {
    const methods = ['no-cursor', 'with-cursor'];

    for (const method of methods) {
        const response = await fetch(`/${method}?page=${page}&limit=${limit}`);
        if (!response.ok) {
            console.error(`Error fetching data for ${method}: ${response.statusText}`);
            continue;
        }

        const data = await response.json();
        const outputId = method === 'no-cursor' ? 'no-cursor-output' : 'with-cursor-output';
        const timeId = method === 'no-cursor' ? 'no-cursor-time' : 'with-cursor-time';

        document.getElementById(outputId).textContent = JSON.stringify(data.data, null, 2);
        document.getElementById(timeId).textContent = `Time Taken: ${data.timeTaken} ms`;

        updateChart(method, page, data.timeTaken);
    }
}

document.getElementById('next-page').addEventListener('click', () => {
    currentPage++;
    fetchDataForBothSections(currentPage);
});

document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchDataForBothSections(currentPage);
    }
});

// Fetch data for both sections on page load
window.addEventListener('load', () => {
    fetchDataForBothSections(currentPage);
});