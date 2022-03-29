let delays = []

const button = document.querySelector('#do-it')
const stopButton = document.querySelector('#stop');
const input = document.querySelector('#test');
const console = document.querySelector('#output');
const copy = document.querySelector('#copy');

function percentile(arr, p) {
    if (arr.length === 0) return 0;
    if (typeof p !== 'number') throw new TypeError('p must be a number');
    if (p <= 0) return arr[0];
    if (p >= 1) return arr[arr.length - 1];

    var index = (arr.length - 1) * p,
        lower = Math.floor(index),
        upper = lower + 1,
        weight = index % 1;

    if (upper >= arr.length) return arr[lower];
    return arr[lower] * (1 - weight) + arr[upper] * weight;
}

function getOutput() {
    const total = delays.reduce((prev, next) => prev + next, 0)
    const avg = total/delays.length;

    return {
        'Electron version': robots.versions.electron,
        'Chromium version': robots.versions.chromium,
        'Number of Events': delays.length,
        'Average': `${avg.toFixed(2)}ms`,
        'p50': `${percentile(delays, .5).toFixed(2)}ms`,
        'p95': `${percentile(delays, .95).toFixed(2)}ms`,
        'p99': `${percentile(delays, .99).toFixed(2)}ms`
    };
}


button.addEventListener('click', async (e) => {
    delays = [];
    input.focus();
    await robots.startTest({iterations: 500, delay: 50});
    finishTest();
})

stopButton.addEventListener('click', (e) => {
    robots.stopTest();
})

copy.addEventListener('click', (e) => {
    const output = getOutput();
    const text = Object.entries(output).map(([key, value]) => `${key}: ${value}`);
    navigator.clipboard.writeText(text.join('\n'));
})

function finishTest() {
    console.innerHTML = '';
    input.value = '';
    const output = getOutput();
    const nodes = Object.entries(output).map(([key, value]) => {
        const line = document.createElement('div');
        const title = document.createElement('strong');
        title.textContent = `${key}:`;
        line.appendChild(title)
        line.append(` ${value}`);
        return line;
    })
    nodes.forEach((node) => console.appendChild(node))
}

input.addEventListener('keydown', (e) => {
    const delay = performance.now() - e.timeStamp;
    delays.push(delay);
});