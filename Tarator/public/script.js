console.log('Script is running');

let currentPage = 1;
const limit = 10;

// Lists to store data for both methods
const noCursorData = [];
const withCursorData = [];
let lastCursor = null; // To track the last cursor for the "with-cursor" method

const avgNoCursorTimeDisplay = document.createElement('p');
avgNoCursorTimeDisplay.id = 'avg-no-cursor-time';
avgNoCursorTimeDisplay.textContent = 'Average Time (No Cursor): - ms';
document.body.insertBefore(avgNoCursorTimeDisplay, document.getElementById('performanceChart').parentElement);

const avgWithCursorTimeDisplay = document.createElement('p');
avgWithCursorTimeDisplay.id = 'avg-with-cursor-time';
avgWithCursorTimeDisplay.textContent = 'Average Time (With Cursor): - ms';
document.body.insertBefore(avgWithCursorTimeDisplay, document.getElementById('performanceChart').parentElement);

async function fetchDataForBothSections(page) {
    const methods = ['no-cursor', 'with-cursor'];

    for (const method of methods) {
        let url;
        if (method === 'no-cursor') {
            url = `/${method}?page=${page}&limit=${limit}`;
        } else {
            console.log('Using lastCursor:', lastCursor); // Debugging log
            url = lastCursor
                ? `/${method}?limit=${limit}&lastCursor=${lastCursor}`
                : `/${method}?limit=${limit}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Error fetching data for ${method}: ${response.statusText}`);
            continue;
        }

        const data = await response.json();
        const outputId = method === 'no-cursor' ? 'no-cursor-output' : 'with-cursor-output';

        document.getElementById(outputId).textContent = JSON.stringify(data.data, null, 2);

        // Add new data to the respective list
        if (method === 'no-cursor') {
            noCursorData.push({ page, time: data.timeTaken });
        } else {
            withCursorData.push({ page, time: data.timeTaken });
            // Update the lastCursor for the next request
            lastCursor = data.nextCursor;
        }
    }

    // Update the chart with the data from both lists
    updateChartWithLists();
}

function updateChartWithLists() {
    // Clear the chart data
    performanceChart.data.labels = [];
    performanceChart.data.datasets[0].data = []; // No Cursor dataset
    performanceChart.data.datasets[1].data = []; // With Cursor dataset

    // Populate the chart with data from the lists
    noCursorData.forEach(entry => {
        performanceChart.data.labels.push(entry.page);
        performanceChart.data.datasets[0].data.push(entry.time);
    });

    withCursorData.forEach((entry, index) => {
        if (!performanceChart.data.labels.includes(index + 1)) {
            performanceChart.data.labels.push(index + 1);
        }
        performanceChart.data.datasets[1].data.push(entry.time);
    });

    performanceChart.update();

    // Calculate and display the average times
    const avgNoCursorTime = noCursorData.reduce((sum, entry) => sum + parseFloat(entry.time), 0) / noCursorData.length;
    const avgWithCursorTime = withCursorData.reduce((sum, entry) => sum + parseFloat(entry.time), 0) / withCursorData.length;

    avgNoCursorTimeDisplay.textContent = `Average Time (No Cursor): ${avgNoCursorTime.toFixed(2)} ms`;
    avgWithCursorTimeDisplay.textContent = `Average Time (With Cursor): ${avgWithCursorTime.toFixed(2)} ms`;
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