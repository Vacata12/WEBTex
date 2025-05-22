let noCursorPage = 1;
let withCursorPage = 1;
const limit = 10;

async function fetchData(method, page) {
    const response = await fetch(`/${method}?page=${page}&limit=${limit}`); // Use relative URL
    if (!response.ok) {
        console.error(`Error fetching data: ${response.statusText}`);
        return;
    }

    const data = await response.json();
    const outputId = method === 'no-cursor' ? 'no-cursor-output' : 'with-cursor-output';
    const timeId = method === 'no-cursor' ? 'no-cursor-time' : 'with-cursor-time';

    document.getElementById(outputId).textContent = JSON.stringify(data.data, null, 2);
    document.getElementById(timeId).textContent = `Time Taken: ${data.timeTaken} ms`;
}

document.getElementById('no-cursor-next').addEventListener('click', () => {
    noCursorPage++;
    fetchData('no-cursor', noCursorPage);
});

document.getElementById('no-cursor-prev').addEventListener('click', () => {
    if (noCursorPage > 1) noCursorPage--;
    fetchData('no-cursor', noCursorPage);
});

document.getElementById('with-cursor-next').addEventListener('click', () => {
    withCursorPage++;
    fetchData('with-cursor', withCursorPage);
});

document.getElementById('with-cursor-prev').addEventListener('click', () => {
    if (withCursorPage > 1) withCursorPage--;
    fetchData('with-cursor', withCursorPage);
});