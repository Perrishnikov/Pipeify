const source = document.querySelector('#source');
const target = document.querySelector('#target');
const targetInfo = document.querySelector('#target-info');
const targetIcon = document.querySelector('#target-icon');
const sourceInfo = document.querySelector('#source-info');
const paste = document.querySelector('#paste');

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
        source.innerText = formatClipText(clipText);

        // console.log(`clipText: ${clipText}`);
        // console.log(clipText);

        const validText = validateClipText(clipText);
        // console.log(`validiatedText: ${validText}`);

        if (validText) {
          const cleanText = cleanClipText(validText);

          // target.innerText = pipeify(cleanText);
          target.innerText = formatTargetText(cleanText);

          paste.innerHTML = formatPasteText(validText);
        } else {
          return 'error in validation';
        }


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
    });
});


/**
 * Validation Tests for the pasted string
 * @param {string} text 
 * @returns {string | boolean} If valid, return the text. If not, return false
 */
function validateClipText(text) {
  let result; // boolean
  const numberOfTabs = 3; //3 tabs == 4 columns

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


function cleanClipText(text) {

  text = text
    .replace(/ {2,}/g, '') //remove multiple spaces (formatted)
    .replace(/(".*)([\r\n])(.*")/g, '$1 $3') //remove linebreak fromw between quotes
    .replace(/"/g, '') //finally, remove quotes - needed above
    // .replace(/\n/g, ';')
    .normalize();

  return text;
}


function formatClipText(text) {
  //https://www.compart.com/en/unicode/html
  text = text
    .replace(/ /g, '\u00b7') //replace spaces
    .replace(/\t/g, '\u2192') //replace tabs
    .replace(/(\n|\r)/g, '\u2199$1'); //replace return

  return text;
}


function formatTargetText(text) {
  let seq = 1;

  /** map through each split and pipeify it */
  const rest = text.split('\n').map(section => {
    console.log(section);
    if (!section) return ''; //just a friendly check

    //split each section on tabs
    const [ingred, qty = '', uom = '', foot = ''] = section.split(/\t/g);

    seq++;
    return `${ingred.trim()} ${qty.trim()} ${uom.trim()} ${foot.trim()}\n`;

  }).join('');

  return `____Medicinal Ingredients_____\n${rest}`;
}

function formatPasteText(text) {
  let seq = 1;

  /** map through each split and pipeify it */
  const rest = text.split('\n').map(section => {
    console.log(section);
    if (!section) return ''; //just a friendly check

    const [ingred, qty = '', uom = '', foot = ''] = section.split(/\t/g);
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

  return rest;
}

targetIcon.addEventListener('click', () => {
  // document.querySelector('#source-info').classList.toggle('in');
  document.querySelector('#target-info').classList.toggle('in');
});
