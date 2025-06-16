let array = [];
let waitTime = 0;
let stopSorting = false;
let numBars = 200;
let numComparisons = 0;
let comparisonElt = document.getElementById("comparisons");

function generateBars() 
{
    stopSorting = true;
    numComparisons = 0;
    updateComparisons();
    const container = document.getElementById('visualization-window');
    container.innerHTML = '';
    array = [];
    let maxHeight = container.clientHeight;
    for (let i = 0; i < numBars; i++) 
    {
        const height = Math.floor(Math.random() * (maxHeight - (maxHeight * 0.1))) + 20;
        array.push(height);
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${height}px`;
        container.appendChild(bar);
    }
}

function sleep(ms) 
{
  return new Promise(resolve => setTimeout(resolve, ms));
}

function updateComparisons()
{
    comparisonElt.textContent = `# comparisons: ${numComparisons}`;
}

async function bubbleSort() 
{
    const bars = document.querySelectorAll('.bar');
    for (let i = 0; i < bars.length; i++) 
    {
        for (let j = 0; j < bars.length - i - 1; j++) 
        {
            if (stopSorting) return;
            
            const h1 = parseInt(bars[j].style.height);
            const h2 = parseInt(bars[j + 1].style.height);
            
            numComparisons++;
            updateComparisons();
            if (h1 > h2)
            {
                bars[j].style.height = `${h2}px`;
                bars[j + 1].style.height = `${h1}px`;
                await sleep(waitTime);
            }
        }
    }

  playSortedAnimation();
}

async function insertionSort() 
{
    const bars = document.querySelectorAll('.bar');
    for (let i = 1; i < bars.length; i++) 
    {
        let j = i;
        while (j > 0) 
        {
            const height1 = parseInt(bars[j - 1].style.height);
            const height2 = parseInt(bars[j].style.height);

            numComparisons++;
            updateComparisons();

            if (height1 > height2) 
            {
                // Swap bars
                let temp = bars[j].style.height;
                bars[j].style.height = bars[j - 1].style.height;
                bars[j - 1].style.height = temp;

                j--;
                await sleep(waitTime);
            } 

            else 
            {
                break;
            }
        }
    }

    playSortedAnimation();
}

async function selectionSort() 
{
    const bars = document.querySelectorAll('.bar');
    for (let i = 0; i < bars.length; i++) 
    {
        let minIndex = i;
        for (let j = i + 1; j < bars.length; j++) 
        {
            if (parseInt(bars[j].style.height) < parseInt(bars[minIndex].style.height)) 
            {
                minIndex = j;
            }
        }

        numComparisons++;
        updateComparisons();
        if (minIndex !== i) 
        {
            let temp = bars[i].style.height;
            bars[i].style.height = bars[minIndex].style.height;
            bars[minIndex].style.height = temp;
            await sleep(waitTime);
        }
    }

  playSortedAnimation();
}

async function quickSort(start = 0, end = null) {
  
    if (stopSorting) return;
    const bars = document.querySelectorAll(".bar");
    if (end === null) end = bars.length - 1;

    if (start < end) 
    {
        let pivotIndex = await partition(bars, start, end);
        await quickSort(start, pivotIndex - 1);
        await quickSort(pivotIndex + 1, end);
    }

    if (isSorted(bars)) playSortedAnimation();
}

async function partition(bars, low, high) 
{
    if (stopSorting) return;
    let pivotHeight = parseInt(bars[high].style.height);

    let i = low - 1;
    for (let j = low; j < high; j++) 
    {
        let currentHeight = parseInt(bars[j].style.height);
        await sleep(waitTime);

        if (currentHeight < pivotHeight) 
        {
            i++;
            // swap bars[i] and bars[j]
            swapHeights(bars[i], bars[j]);
            await sleep(waitTime);
        } 
    }

  await sleep(waitTime);
  swapHeights(bars[i + 1], bars[high]);

  return i + 1;
}

function swapHeights(bar1, bar2) 
{
  const temp = bar1.style.height;
  bar1.style.height = bar2.style.height;
  bar2.style.height = temp;
}

async function bogoSort() 
{
    const bars = document.querySelectorAll('.bar');
    let tries = 0;
    allowedTries = 1000;
    while (!isSorted(bars))
    {
        shuffle(bars);
        await sleep(waitTime);
        tries++;
        if (tries > allowedTries)
        {
            alert(`Gave up after ${allowedTries} attempts.`)
            return;
        }
    }

    playSortedAnimation();
}

function isSorted(bars)
{
    for (let i = 0; i < bars.length - 1; i++)
    {
        const bar1 = parseInt(bars[i].style.height);
        const bar2 = parseInt(bars[i + 1].style.height);
        if (bar1 > bar2) return false;
    }  

    return true;
}

function shuffle(bars) 
{
    for (let i = bars.length - 1; i > 0; i--) 
    {
        const j = Math.floor(Math.random() * (i + 1));
        // swap heights
        let temp = bars[i].style.height;
        bars[i].style.height = bars[j].style.height;
        bars[j].style.height = temp;
    }
}

async function playSortedAnimation()
{
    const bars = document.querySelectorAll(".bar");
    for (let i = 0; i < bars.length; i++)
    {
        bars[i].style.backgroundColor = "red";
        await sleep(20);
    }
}

function startSort() 
{
    const selectedAlgorithm = document.getElementById('algorithm-select').value;
    numComparisons = 0;
    updateComparisons();
    disableControls();
    stopSorting = false;
    switch (selectedAlgorithm) 
    {
        case 'bubble':
            bubbleSort();
            break;
        case 'insertion':
            insertionSort();
            break;
        case 'selection':
            selectionSort();
            break;
        case 'quick':
            quickSort();
            break;
        case 'bogo':
            bogoSort();
            break;
        default:
            alert('Please select a valid algorithm.');
    }
    enableControls();
}

function disableControls() 
{
    //sortButton.disabled = true;
}

function enableControls() 
{
    //sortButton.disabled = false;
}

window.onload = generateBars();