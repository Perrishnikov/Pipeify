//ts-check
const validate = {
  isNotEmpty: (str1) => {
    const pattern = /\S+/;
    console.assert(pattern.test(str1), `! isNotEmpty`);
    return pattern.test(str1);
  },
  isNumber: (str1) => {
    const pattern = /^\d+$/;
    console.assert(pattern.test(str1), '! isNumber');
    return pattern.test(str1);
  },
  isNotSame: (str1, str2) => {
    console.assert(str1 !== str2, '! isNotSame');
    return str1 !== str2;
  },
  isLessThan: (str1, max) => {
    console.assert(str1.length < max, '! isLessThan');
    return str1.length < max;
  },
  isGreaterThan: (str1, min) => {
    console.assert(str1.length > min, '! isGreaterThan');
    return str1.length > min;
  },
  isValidUOM: (value) => {
    const stuff = ['mg', 'mcg', 'g', 'ml', 'l', 'oz', 'CFU', ''];
    console.assert(stuff.includes(value));
    return stuff.includes(value);
  }
};

const source = document.querySelector('#source');
const target = document.querySelector('#target');
const countrySelect = document.querySelector('#countrySelect');
// const targetIcon = document.querySelector('#target-icon');
const sourceInfo = document.querySelector('#source-info');
const paste = document.querySelector('#paste');
const numberOfCols = 5;

/**
 * Button for Pipeify
 */
const pipifyButton = `<button style="margin-top:12px;width:100px;height:30px;border-radius:6px;" id="pipeifyLine">Pipeify</button>`;

// For Pipeify button, since this is added dynamically.
document.addEventListener('click', e => {
  if (e.target.id == 'pipeifyLine') {
    //All the row values
    const order = document.querySelector('#order');
    const name = document.querySelector('#name');
    const qty = document.querySelector('#qty');
    const uom = document.querySelector('#uom');
    const dvAmt = document.querySelector('#dvAmt');
    const syml = document.querySelector('#syml');
    const foot = document.querySelector('#foot');

    let asterisk;
    let pipified;

    //Rest any invalid calsses;
    order.classList.remove('invalid');
    name.classList.remove('invalid');
    qty.classList.remove('invalid');
    uom.classList.remove('invalid');
    if (dvAmt) dvAmt.classList.remove('invalid');
    if (syml) syml.classList.remove('invalid');
    if (foot) foot.classList.remove('invalid');
    if (asterisk) asterisk.classList.remove('invalid');

    //This is a Nutrient
    if ([...newNutrient.classList].includes('envy')) {

      //Validate Order
      // if (!validate.isNotEmpty(order.innerText) && !validate.isNumber(order.innerText)) {
      //   order.classList.add('invalid');
      //   return;
      // }

      //Validate Name
      if (!validate.isNotEmpty(name.innerText)) {
        name.classList.add('invalid');
        return;
      }

      //Validate qty
      // if (!validate.isNotEmpty(qty.innerText) && !validate.isNumber(qty.innerText)) {
      //   qty.classList.add('invalid');
      //   return;
      // }

      //Validate UOM - TODO: Need a better list from Tammy
      if (!validate.isValidUOM(uom.innerText)) {
        uom.classList.add('invalid');
        return;
      }

      //Validate DV - cound be "<1", so will need to check for this...
      // if (validate.isNotEmpty(dvAmt.innerText) && !validate.isNumber(dvAmt.innerText)) {
      //   dvAmt.classList.add('invalid');
      //   return;
      // }

      pipified = returnNutrient({
        order: order.innerText,
        name: name.innerText,
        qty: qty.innerText,
        uom: uom.innerText,
        dvAmt: dvAmt.innerText,
        syml: syml.innerText,
        foot: foot.innerText
      });


    } else {
      //This is an Ingredient
      asterisk = document.querySelector('#asterisk');


      //Validate Order
      if (!validate.isNotEmpty(order.innerText) && !validate.isNumber(order.innerText)) {
        order.classList.add('invalid');
        return;
      }

      //Validate Name
      if (!validate.isNotEmpty(name.innerText)) {
        name.classList.add('invalid');
        return;
      }

      //Validate qty
      if (!validate.isNotEmpty(qty.innerText) && !validate.isNumber(qty.innerText)) {
        qty.classList.add('invalid');
        return;
      }

      //Validate UOM - TODO: Need a better list from Tammy
      if (!validate.isValidUOM(uom.innerText)) {
        uom.classList.add('invalid');
        return;
      }

      pipified = returnIngredient({
        order: order.innerText,
        name: name.innerText,
        qty: qty.innerText,
        uom: uom.innerText,
        asterisk: asterisk.innerText,
      });
    }

    console.log(pipified);
    /** Write the Pipeified text to the source box and copy it to clipboard */

    navigator.clipboard.writeText(pipified)
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


  }
});

/**
 * Target where the new table is rendered
 */
const updatedLine = document.querySelector('#updateLine');

/**
 * Button for new "Nutrient"
 */
const newNutrient = document.querySelector('#newNutrient');
newNutrient.addEventListener('click', (e) => {
  let count = 1;

  newNutrient.classList.add('envy');
  newIngredient.classList.remove('envy');

  updatedLine.innerHTML = `
      <table>
      <caption>Add Nutrient (8 cols)</caption>
        <tr>
          <th>Order</th>
          <th>Name</th>
          <th>QTY</th>
          <th>UOM</th>
          <th>DV (number or **)</th>
          <th>DV symbol (%)</th>
          <th>Footnote (†)</th>
        </tr>
        <tr id="line${count}" style="text-align:center;">
          <td id="order" contenteditable="true"></td>
          <td id="name" contenteditable="true"></td>
          <td id="qty" contenteditable="true"></td>
          <td id="uom" contenteditable="true"></td>
          <td id="dvAmt" contenteditable="true"></td>
          <td id="syml" contenteditable="true">%</td>
          <td id="foot" contenteditable="true"></td>
        </tr>
      </table>
      ${pipifyButton}
  `;
});

/**
 * Button for new "Ingredient"
 */
const newIngredient = document.querySelector('#newIngredient');
newIngredient.addEventListener('click', (e => {

  newNutrient.classList.remove('envy');
  newIngredient.classList.add('envy');

  updatedLine.innerHTML = `
              <table>
              <caption>Update Ingredient (9 cols)</caption>
              <tr>
                <th>Order</th>
                <th>Name</th>
                <th>qty</th>
                <th>UOM</th>
                <th>Asterisk</th>
              </tr>
              <tr style="text-align:center;">
                <td id="order" contenteditable="true"></td>
                <td id="name" contenteditable="true"></td>
                <td id="qty" contenteditable="true"></td>
                <td id="uom" contenteditable="true"></td>
                <td id="asterisk" contenteditable="true"></td>
              </tr>
            </table>
            ${pipifyButton}
  `;
}));


/** Radio toggle the New and Update sections */
const productType = document.querySelector('#ingredType');

productType.addEventListener('change', (e) => {
  const newR = document.querySelector('#New');
  const upR = document.querySelector('#Update');

  upR.classList.toggle('hidden');
  newR.classList.toggle('hidden');

});


function returnIngredient({
  order,
  name,
  qty,
  uom,
  asterisk
}) {
  let pipifiedText = `${order}|${name}|${qty}|${uom}|||${asterisk}||`;
  return pipifiedText;

}

/**
 * Returns the pipeified value for the clipboard
 * @param {*} param0 
 */
function returnNutrient({
  order,
  name,
  qty,
  uom,
  dvAmt,
  syml,
  foot
}) {

  let pipifiedText = `${order}|${name}||${qty}|${uom}|${dvAmt}|${syml}|${foot}`;
  return pipifiedText;
}

/**
 * Split the Salsify string
 * @param {string} clipboardText 
 * @returns {string | null}
 */
function parseUpdateFromSalsify(clipboardText) {
  const split = clipboardText.split('|');
  console.log(split);

  if (split.length == 8 || split.length == 9) {
    return split;
  }
  return null;
}

/* UPDATE event listner
 * Paste Target for line from Salsify
 */
document.querySelector('#updateSource').addEventListener('click', e => {
  let table = '';

  newNutrient.classList.remove('envy');
  newIngredient.classList.remove('envy');

  e.preventDefault();

  /** Get the text in the User's clipboard */
  navigator.clipboard.readText()
    .then(clipText => {
      console.log(clipText);

      if (clipText) {

        /** check text against rules */
        const splitText = parseUpdateFromSalsify(clipText);

        // US Nutrition Facts	- length == 8
        if (splitText && splitText.length == 8) {
          console.log(`US Nutrition Facts`);

          //add the class so we have a handle
          newNutrient.classList.add('envy');

          const order = splitText[0].trim();
          const name = splitText[1].trim();
          const qty = splitText[3].trim();
          const uom = splitText[4].trim();
          const dvAmt = splitText[5].trim();
          const syml = splitText[6].trim();
          const foot = splitText[7].trim();

          table = `
            <table>
              <caption>Update Nutrient (8 cols)</caption>
              <tr>
                <th>Order</th>
                <th>Name</th>
                <th>qty</th>
                <th>UOM</th>
                <th>DV</th>
                <th>DV symbol</th>
                <th>footnote †</th>
              </tr>
              <tr style="text-align:center;">
                <td id="order" contenteditable="true">${order}</td>
                <td id="name" contenteditable="true">${name}</td>
                <td id="qty" contenteditable="true">${qty}</td>
                <td id="uom" contenteditable="true">${uom}</td>
                <td id="dvAmt" contenteditable="true">${dvAmt}</td>
                <td id="syml" contenteditable="true">${syml}</td>
                <td id="foot" contenteditable="true">${foot}</td>
              </tr>
            </table>
            ${pipifyButton}
            `;



        } // US Ingredients - Long
        else if (splitText && splitText.length == 9) {
          console.log(`US Ingredients - Long`);

          //add class so we have a handle
          newIngredient.classList.add('envy');

          const order = splitText[0].trim();
          const name = splitText[1].trim();
          const qty = splitText[2].trim();
          const uom = splitText[3].trim();

          // const dvAmt = splitText[5].trim();
          const asterisk = splitText[6].trim();
          // const foot = splitText[7].trim();

          table = `
            <table>
              <caption>Update Ingredient (9 cols)</caption>
              <tr>
                <th>Order</th>
                <th>Name</th>
                <th>qty</th>
                <th>UOM</th>
                <th>Asterisk</th>
              </tr>
              <tr style="text-align:center;">
                <td id="order" contenteditable="true">${order}</td>
                <td id="name" contenteditable="true">${name}</td>
                <td id="qty" contenteditable="true">${qty}</td>
                <td id="uom" contenteditable="true">${uom}</td>
                <td id="asterisk" contenteditable="true">${asterisk}</td>
              </tr>
            </table>
            ${pipifyButton}
            `;
        }

        updatedLine.innerHTML = table;


        /** Write the Pipeified text to the source box and copy it to clipboard */

        // navigator.clipboard.writeText(innerHTML)
        //   .then((goodStuff) => {
        //     //     console.log(`goodStuff: ${goodStuff}`);

        //     //     /* clipboard successfully set */
        //     //     // target.innerText = goodStuff;


        //     //     /** Show confirmation message */
        //     showMessage();

        //     //     /** Set the timeout to hide the message after a few seconds */
        //     setTimeout(showMessage, 4000);

        //   }, function() {
        //     /* clipboard write failed */
        //   });

      } else {
        // source.innerText = `*SOURCE is not valid; Need ${numberOfCols} columns`;
        // paste.innerHTML = '';
        // return 'error in validation';
      }

    });

});



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
            let innerHTML = '';
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
  console.log(allTabs);
  while (allTabs.length > 0) {
    /**get this many tabs and add them to a Line */
    const short = allTabs.splice(0, numberOfCols);
    console.log(short);
    if (short[1]) {
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




// targetIcon.addEventListener('click', () => {
//   // document.querySelector('#source-info').classList.toggle('in');
//   document.querySelector('#target-info').classList.toggle('in');
// });
