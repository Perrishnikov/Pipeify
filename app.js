//ts-check

const source = document.querySelector('#source');
const target = document.querySelector('#target');
const countrySelect = document.querySelector('#countrySelect');
const targetIcon = document.querySelector('#target-icon');
const sourceInfo = document.querySelector('#source-info');
const paste = document.querySelector('#paste');
const numberOfCols = 5;

/** Used to make sure we dont paste the same text */
let newText;

/** Magic happens here when User clicks the Source div */
source.addEventListener('click', e => {

  e.preventDefault();

  target.innerText = '';
  source.innerText = 'click to paste';

  /** Only if user selects US or CA */
  if (countrySelect.value !== '') {

    /** Get the text in the User's clipboard */
    navigator.clipboard.readText()
      .then(clipText => {

        if (clipText !== newText) {
          /** add unicode characters and show it in SOURCE */
          // const formattedText = formatClipText(clipText);
          // source.innerText = formattedText;

          /** check text against rules */
          const validText = validateClipText(clipText);
          // console.log(`validiatedText: ${validText}`);

          if (validText) {
            const cleanText = cleanClipText(validText);
            let innerHTML = ''
            let innerText = '';


            if (countrySelect.value == 'CA') {
              innerHTML = pipeifyCA(cleanText);
              innerText = formatTargetTextCA(pipeifyCA(cleanText));

            } //US Template
            else {
              innerHTML = pipeifyUS(cleanText);
              innerText = formatTargetTextUS(pipeifyUS(cleanText));
            }

            paste.innerHTML = innerHTML;
            target.innerText = innerText;

            /** Write the Pipeified text to the source box and copy it to clipboard */
            navigator.clipboard.writeText(innerHTML)
              .then((goodStuff) => {
                //     console.log(`goodStuff: ${goodStuff}`);

                //     /* clipboard successfully set */
                //     // target.innerText = goodStuff;


                //     /** Show confirmation message */
                showMessage();

                //     /** Set the timeout to hide the message after a few seconds */
                setTimeout(showMessage, 4000);

              }, function() {
                /* clipboard write failed */
              });

          } else {
            source.innerText = `*SOURCE is not valid; Need ${numberOfCols} columns`;
            paste.innerHTML = '';
            return 'error in validation';
          }
        }
      });

  } else {
    source.innerText = `Please select US or CA template`;
    paste.innerHTML = '';
  }

});

function pipeifyUS(text) {
  const allTabs = text.split(/\t/); //array of tabs
  let pipifiedText = '';
  let activeType = null;
  let seq = 1;
  let onceThrough = false;

  //While loop will capture blank columns
  while (allTabs.length) {
    /**get this many tabs and add them to a Line */
    const short = allTabs.splice(0, numberOfCols);

    // const nothing = short[0].trim();
    const ingred = short[1].trim();
    const qty = short[2].trim();
    const uom = short[3].trim();
    const foot = short[4].trim();

    //if there is text in the first column, track it.
    if (short[0]) {
      activeType = short[0];
      //A little dirty, but good enough
      if (short[0] === 'Ingredients') pipifiedText += `#`;
    }

    // Nutrients and Ingredients get a sequence
    if (activeType === 'Nutrients' || activeType === 'Ingredients') {

      // If this has a title (line[0]), use it. Returns the rest
      pipifiedText += `${seq}|${ingred}|${qty}|${uom}|||${foot}||$`;
    }
    //Other Ingredients and anything else dont
    else {

      //If this is non-med
      if (!onceThrough) {
        pipifiedText += `#|${ingred}|${qty}|${uom}|||${foot}||$`;
        onceThrough = true;
      } else {
        //if this is anything else
        pipifiedText += `|${ingred}|${qty}|${uom}|||${foot}||$`;
      }

    }

    seq++;
  }

  return pipifiedText;
}

/**
 * Formats the text for insertion into DOM
 * This is what text will look like in Salsify
 * @param {string} text 
 */
function formatTargetTextUS(text) {
  const allsections = text.split('#'); //array of tabs
  let lineText;
  const sectionNames = { 0: 'Nutrients', 1: 'Ingredients', 2: 'Other Ingredients' };

  const sectionText = allsections.map((section, index) => {
    const lines = section.split('$').filter(line => line);

    //Name each section as above
    const sectionName = sectionNames[index];

    lineText = lines.map(line => {
      const split = line.split('|');
      const seq = split[0].trim();
      const ingred = split[1].trim();
      const qty = split[2].trim();
      const uom = split[3].trim();
      const foot = split[4].trim();

      if (index != 2) {
        return `${ingred} ${qty} ${uom} \n`;
      } else {
        return `${ingred}, `;
      }

    }).join('');

    return `____${sectionName}____\n${lineText}`;

  }).join('');

  // console.log(sectionText);
  return sectionText;
}


function pipeifyCA(text) {
  const allTabs = text.split(/\t/); //array of tabs
  let pipifiedText = '';
  let activeType = null;
  let seq = 1;
  let onceThrough = false;

  //While loop will capture blank columns
  while (allTabs.length) {
    // get this many tabs and add them to a Line 
    const short = allTabs.splice(0, numberOfCols);

    // If there are any blank lines, ignore them 
    if (!short.every(element => element == '')) {

      const ingred = short[1].trim();
      const qty = short[2].trim();
      const uom = short[3].trim();
      const foot = short[4].trim();

      //if there is text in the first column, track it.
      if (short[0]) {
        activeType = short[0];
      }

      if (activeType === 'Medicinal Ingredients' || activeType === 'Ingrédients médicinaux') {

        // If this has a title (line[0]), use it. Returns the rest
        pipifiedText += `${seq}|${ingred}|${qty}|${uom}|||${foot}||$`;
      }
      //Non-Medicinal Ingred and anything else
      else {

        //If this is non-med
        if (!onceThrough) {
          pipifiedText += `#|${ingred}|${qty}|${uom}|||${foot}||$`;
          onceThrough = true;
        } else {
          //if this is anything else
          pipifiedText += `|${ingred}|${qty}|${uom}|||${foot}||$`;
        }

      } //close section

      seq++;
    } // close if ''

  } // close while

  return pipifiedText;
}

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
  text = text.replace(/(".*)(\n)([^"].*)(\n)(.*"\t{2})/g, '$1 $3 $5'); //remove newline from between quotes(ingreds)

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
function formatTargetTextCA(text) {
  const allsections = text.split('#'); //array of tabs
  let lineText;
  const sectionNames = {
    0: {
      'EN': 'Medicinal Ingredients',
      'FR': 'Ingrédients médicinaux'
    },
    1: {
      'EN': 'Non-Medicinal Ingredients',
      'FR': 'Ingrédients non médicinaux'
    }
  };

  const sectionText = allsections.map((section, index) => {
    const lines = section.split('$').filter(line => line);
    const sectionName = index == 0 ? 'Medicinal Ingredients' : 'Non-Medicinal Ingredients';

    lineText = lines.map(line => {
      const split = line.split('|');
      const seq = split[0].trim();
      const ingred = split[1].trim();
      const qty = split[2].trim();
      const uom = split[3].trim();
      const foot = split[4].trim();

      if (index == 0) {
        return `${ingred} ${qty} ${uom} \n`;
      } else {
        return `${ingred}, `;
      }

    }).join('');

    return `____${sectionName}____\n${lineText}`;

  }).join('');

  // console.log(sectionText);
  return sectionText;
}


/** Fade the Copied Message on User paste click */
function showMessage() {

  sourceInfo.classList.toggle('in');
}


targetIcon.addEventListener('click', () => {
  // document.querySelector('#source-info').classList.toggle('in');
  document.querySelector('#target-info').classList.toggle('in');
});
