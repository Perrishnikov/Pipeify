//@ts-check
const source = document.querySelector('#source');
const target = document.querySelector('#target');
// const targetInfo = document.querySelector('#target-info');
const targetIcon = document.querySelector('#target-icon');
const sourceInfo = document.querySelector('#source-info');
const paste = document.querySelector('#paste');
const numberOfCols = 5;

/** Used to make sure we dont paste the same text */
let newText;

/** Fade the Copied Message on User paste click */
function showMessage() {

  sourceInfo.classList.toggle('in');
}

/** Magic happens here when User clicks the Source div */
source.addEventListener('click', e => {

  e.preventDefault();

  /** Get the text in the User's clipboard */
  navigator.clipboard.readText()
    .then(clipText => {

      if (clipText !== newText) {
        /** add unicode characters and show it in SOURCE */
        const formattedText = formatClipText(clipText);
        source.innerText = formattedText;

        /** check text against rules */
        const validText = validateClipText(clipText);
        // console.log(`validiatedText: ${validText}`);

        if (validText) {
          const cleanText = cleanClipText(validText);

          // target.innerText = pipeify(cleanText);
          target.innerText = formatTargetText(cleanText);

          paste.innerHTML = formatPasteText(validText);
        } else {
          target.innerText = '*SOURCE is not valid';
          paste.innerHTML = '';
          return 'error in validation';
        }

        {
          /** Write the Pipeified text to the source box and copy it to clipboard */
          // navigator.clipboard.writeText(newText)
          //   .then(() => {
          //     // console.log(`newText: ${newText}`);

          //     /* clipboard successfully set */
          //     target.innerText = newText;

          //     /** Show confirmation message */
          //     showMessage();

          //     /** Set the timeout to hide the message after a few seconds */
          //     setTimeout(showMessage, 4000);

          //   }, function() {
          //     /* clipboard write failed */
          //   });
        }

      }
    });
});


/**
 * Validation Tests for the pasted string
 * @param {string} text 
 * @returns {string | boolean} If valid, return the text. If not, return false
 */
function validateClipText(text) {
  let result; // boolean
  const numberOfTabs = numberOfCols - 1; //3 tabs == 4 columns

  /* TEST - Column Count
   * make sure that each section has ^^ columns 
   */
  text.split('\n').map(section => {
    //matches == number of times tab is found
    const matches = section.match(/\t/g);

    if (matches) result = matches.length !== numberOfTabs ? false : text;
  });

  /** TEST 2 -  */

  return result;
}


/**
 * Basic cleanup like trim() at this point
 * @param {string} text 
 */
function cleanClipText(text) {

  /*Order seems to matter - dont mess with it.*/
  text = text.replace(/ {2,}/g, ''); //remove multiple spaces (formatted)
  text = text.replace(/(".*)(\n)(.*")/g, '$1 $3'); //remove newline from between quotes(ingreds)
  text = text.replace(/"/g, ''); //finally, remove quotes - needed above
  text = text.replace(/\n/g, '\t'); //make all end-of-lines into tabs
  // console.log(text);
  return text;
}

/**
 * Add some unicode characters to see where the tabs and newlines are.
 * @param {string} text 
 */
function formatClipText(text) {
  //https://www.compart.com/en/unicode/html
  text = text
    .replace(/\t/g, '\u2197') //replace tabs
    .replace(/[\n\r]/g, '\u2199'); //replace return

  return text;
}


/**
 * Formats the text for insertion into DOM
 * This is what text will look like in Salsify
 * @param {string} text 
 */
function formatTargetText(text) {
  const allTabs = text.split(/\t/); //array of tabs
  let activeIngredientType = null; 
  let lines = [];
  
  let count = 0;
  while (count < allTabs.length) {
    /**get this many tabs and add them to a Line */
    const short = allTabs.splice(0, numberOfCols);
    // console.log(short);
    lines.push(short);
    count++;
  }

  console.log(lines);

  /** map through each split */
  const linesHTML = lines.map(line => {

    //if there is text in the first column, track it.
    if (line[0]) {
      activeIngredientType = line[0];
    }

    // console.log(`activeIngredientType: ${activeIngredientType}`);
    //This is the tile for each section 
    let type = `______${activeIngredientType}______\n`;

    if (activeIngredientType === 'Medicinal Ingredients' || activeIngredientType === 'Ingrédients médicinaux') {
      const ingred = line[1].trim();
      const qty = line[2].trim();
      const uom = line[3].trim();
      const foot = line[4].trim();

      // If this has a title (line[0]), use it. Returns the rest
      return `${line[0] ? type : ''}${ingred} ${qty} ${uom} ${foot}\n`;
    }
    //Non-Medicinal Ingred and anything else
    else {
      const ingred = line[1].trim();

      // If this has a title (line[0]), use it. Returns the rest
      return `${line[0] ? type : ''}${ingred}\n`;

    }
  }).join('');

  return linesHTML;
}


function formatPasteText(text) {
  let seq = 1;

  /** map through each split and pipeify it */
  const lines = text.split('\n').map((line, index) => {
    // console.log(section);
    if (!line) return ''; //just a friendly check

    const [ingred, qty = '', uom = '', foot = ''] = line.split(/\t/g);
    let order = seq; // #1 Sequence 
    //let ingred = ''; // #2 blank
    //let qty = section.trim(); // #3 
    //let uom = ''; // #4 
    let inputQty = ''; // #5 
    let inoutUom = ''; // #6 
    let rda = ''; // #7 rda has a number
    // let foot = ''; // #8 

    seq++;
    return `${order}|${ingred.trim()}|${qty.trim()}|${uom.trim()}|||${foot}||$`;

  }).join('');

  return lines;
}

targetIcon.addEventListener('click', () => {
  // document.querySelector('#source-info').classList.toggle('in');
  document.querySelector('#target-info').classList.toggle('in');
});
