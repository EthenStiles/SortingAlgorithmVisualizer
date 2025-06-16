let array = [];
let waitTime = 25;
let stopSorting = false;
let numComparisons = 0;
let comparisonElt = document.getElementById("comparisons");
let numBars = 0;

function generateBars() 
{
    stopSorting = true;
    numComparisons = 0;
    numBars = parseInt(document.getElementById("element-count").value) || 50;
    updateStats();
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

function updateStats()
{
    comparisonElt.textContent = `# comparisons: ${numComparisons}`;
    document.getElementById("elements").textContent = `# elements: ${numBars}`

}

async function bubbleSort() 
{
    const bars = document.querySelectorAll('.bar');
    for (let i = 0; i < bars.length; i++) 
    {
        for (let j = 0; j < bars.length - i - 1; j++) 
        {
            if (stopSorting) return;

            bars[j + 1].classList.add('current');
            
            const h1 = parseInt(bars[j].style.height);
            const h2 = parseInt(bars[j + 1].style.height);
            
            numComparisons++;
            updateStats();
            if (h1 > h2)
            {
                bars[j].style.height = `${h2}px`;
                bars[j + 1].style.height = `${h1}px`;
                await sleep(waitTime);
            }

            bars[j + 1].classList.remove('current');
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
            if (stopSorting) return;
            //const barA = bars[j - 1];
            const barB = bars[j];

            // Add highlight to both bars being compared
            //barA.classList.add('current');
            barB.classList.add('current');
            
            const height1 = parseInt(bars[j - 1].style.height);
            const height2 = parseInt(bars[j].style.height);

            numComparisons++;
            updateStats();

            await sleep(waitTime);

            if (height1 > height2) 
            {
                // Swap bars
                let temp = bars[j].style.height;
                bars[j].style.height = bars[j - 1].style.height;
                bars[j - 1].style.height = temp;

                j--;
                
            } 

            else 
            {
                //barA.classList.remove('current');
                barB.classList.remove('current');
                break;
            }

            //barA.classList.remove('current');
            barB.classList.remove('current');
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
            if (stopSorting) return;
            
            bars[j].classList.add('current');
            
            numComparisons++;
            updateStats();

            await sleep(waitTime);
            
            if (parseInt(bars[j].style.height) < parseInt(bars[minIndex].style.height)) 
            {
                bars[minIndex].classList.remove('current-min');
                
                minIndex = j;

                bars[minIndex].classList.add('current-min');
            }

            bars[j].classList.remove('current');
        }

        if (minIndex !== i) 
        {
            let temp = bars[i].style.height;
            bars[i].style.height = bars[minIndex].style.height;
            bars[minIndex].style.height = temp;
            await sleep(waitTime);
        }

        bars[minIndex].classList.remove('current-min');
    }

  playSortedAnimation();
}

async function quickSort(bars, start = 0, end = null) {
  
    if (stopSorting) return;
    if (end === null) end = bars.length - 1;

    if (start < end) 
    {
        let pivotIndex = await partition(bars, start, end);
        await quickSort(bars, start, pivotIndex - 1);
        await quickSort(bars, pivotIndex + 1, end);
    }
}

async function partition(bars, low, high) 
{
    let pivotHeight = parseInt(bars[high].style.height);

    let i = low - 1;
    for (let j = low; j < high; j++) 
    {
        if (stopSorting) return;
        bars[j].classList.add('current');  // Highlight the current bar being compared
    
        numComparisons++;
        updateStats();

        let currentHeight = parseInt(bars[j].style.height);

        if (currentHeight < pivotHeight) 
        {
            i++;
            // swap bars[i] and bars[j]
            swapHeights(bars[i], bars[j]);

            bars[i].classList.add('swapped'); // highlight swapped bar
            await sleep(waitTime);
            bars[i].classList.remove('swapped');
        } 

        bars[j].classList.remove('current');
    }

    swapHeights(bars[i + 1], bars[high]);
    await sleep(waitTime)
    bars[high].classList.remove('pivot');

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
        bars[i].style.backgroundColor = "indianred";
        await sleep(20);
    }
}

async function startSort() 
{
    const selectedAlgorithm = document.getElementById('algorithm-select').value;
    numComparisons = 0;
    updateStats();
    disableControls();
    stopSorting = false;
    switch (selectedAlgorithm) 
    {
        case 'bubble':
            await bubbleSort();
            break;
        case 'insertion':
            await insertionSort();
            break;
        case 'selection':
            await selectionSort();
            break;
        case 'quick':
            const bars = document.querySelectorAll(".bar");
            await quickSort(bars);
            playSortedAnimation();
            break;
        case 'bogo':
            await bogoSort();
            break;
        default:
            alert('Please select a valid algorithm.');
    }
    enableControls();
}

function disableControls() 
{
    document.getElementById("sort").disabled = true;
}

function enableControls() 
{
    document.getElementById("sort").disabled = false;
}

window.onload = generateBars();