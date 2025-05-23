console.log('Script is running');

let currentPage = 1;
let limit = 1000; // Default value

// Lists to store data for both methods
const noCursorData = [];
const withCursorData = [];
let forwardCursor = null;
let backwardCursor = null;

// Create performance display elements
const performanceSection = document.createElement('div');
performanceSection.style.marginBottom = '20px';
performanceSection.style.padding = '10px';
performanceSection.style.border = '1px solid #ccc';

const avgNoCursorTimeDisplay = document.createElement('p');
avgNoCursorTimeDisplay.id = 'avg-no-cursor-time';
avgNoCursorTimeDisplay.textContent = 'Average Time (No Cursor): - ms';

const avgWithCursorTimeDisplay = document.createElement('p');
avgWithCursorTimeDisplay.id = 'avg-with-cursor-time';
avgWithCursorTimeDisplay.textContent = 'Average Time (With Cursor): - ms';

const currentPageDisplay = document.createElement('p');
currentPageDisplay.id = 'current-page';
currentPageDisplay.textContent = 'Current Page: 1';

const recordsPerPageDisplay = document.createElement('p');
recordsPerPageDisplay.textContent = `Records per page: ${limit}`;

performanceSection.appendChild(currentPageDisplay);
performanceSection.appendChild(recordsPerPageDisplay);
performanceSection.appendChild(avgNoCursorTimeDisplay);
performanceSection.appendChild(avgWithCursorTimeDisplay);

// Insert the performance section before the chart
document.body.insertBefore(performanceSection, document.getElementById('performanceChart').parentElement);

async function fetchDataForBothSections(page, direction = 'forward') {
    const methods = ['no-cursor', 'with-cursor'];
    currentPageDisplay.textContent = `Current Page: ${page}`;

    for (const method of methods) {
        let url;
        if (method === 'no-cursor') {
            url = `/${method}?page=${page}&limit=${limit}`;
        } else {
            const cursorToUse = direction === 'backward' ? backwardCursor : forwardCursor;
            url = cursorToUse
                ? `/${method}?limit=${limit}&lastCursor=${cursorToUse}&direction=${direction}`
                : `/${method}?limit=${limit}&direction=${direction}`;
        }

        const startTime = performance.now(); // Client-side timing start
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Error fetching data for ${method}: ${response.statusText}`);
            continue;
        }

        const data = await response.json();
        const endTime = performance.now(); // Client-side timing end
        const totalTime = data.timeTaken; // Server-side timing

        const outputId = method === 'no-cursor' ? 'no-cursor-output' : 'with-cursor-output';
        const output = document.getElementById(outputId);
        
        // Show only first and last few items to avoid overwhelming the display
        const displayData = {
            totalRecords: data.data.length,
            firstItems: data.data.slice(0, 3),
            lastItems: data.data.slice(-3),
            timeTaken: totalTime
        };
        
        output.textContent = JSON.stringify(displayData, null, 2);

        if (method === 'no-cursor') {
            noCursorData.push({ page, time: totalTime });
        } else {
            withCursorData.push({ page, time: totalTime });
            
            if (data.data.length > 0) {
                if (direction === 'forward') {
                    forwardCursor = data.nextCursor;
                    backwardCursor = data.data[0]._id;
                } else {
                    backwardCursor = data.data[0]._id;
                    forwardCursor = data.nextCursor;
                }
            }
        }
    }

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

function resetData() {
    noCursorData.length = 0;
    withCursorData.length = 0;
    forwardCursor = null;
    backwardCursor = null;
    currentPage = 1;
    performanceChart.data.labels = [];
    performanceChart.data.datasets[0].data = [];
    performanceChart.data.datasets[1].data = [];
    performanceChart.update();
}

// Update event listeners for pagination and limit
document.getElementById('next-page').addEventListener('click', () => {
    currentPage++;
    fetchDataForBothSections(currentPage, 'forward');
});

document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchDataForBothSections(currentPage, 'backward');
    }
});

document.getElementById('updateLimit').addEventListener('click', () => {
    const newLimit = parseInt(document.getElementById('recordsLimit').value);
    if (newLimit >= 100 && newLimit <= 100000) {
        limit = newLimit;
        resetData();
        recordsPerPageDisplay.textContent = `Records per page: ${limit}`;
        fetchDataForBothSections(currentPage);
    } else {
        alert('Please enter a value between 100 and 100000');
    }
});

// Initialize data fetching
window.addEventListener('load', () => {
    document.getElementById('recordsLimit').value = limit;
    fetchDataForBothSections(currentPage);
});