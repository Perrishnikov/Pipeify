const source = document.querySelector('#source');
const target = document.querySelector('#target');
const targetInfo = document.querySelector('#target-info');
const targetIcon = document.querySelector('#target-icon');
const sourceInfo = document.querySelector('#source-info');

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
        source.innerText = clipText;

        // console.log(`clipText: ${clipText}`);
        // console.log(clipText);
        newText = pipeify(clipText);

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

          target.innerText = newText;
      }
    });
});

/*
Salsify:LABEL_DATASET_NUTRIENT_A  (before 1st pin.LineBreak)
1)-a Dynamically generated Nutrient level indicator formatted like 1.0.0 -pin.Sequence
2)-b Nutrient Description (standard description) – BLANK
3)-c Source or Override Phrase (Always use Override Phrase if present) concat im.IngredientName and im.Description –@Soumya remove HTML
4)-d Declared Qty pin.Qty
5)-e Declared UoM pin.UnitOfMeasure
6)-f Value Statement Description  – BLANK for PLU . Comes from Description
7)-g Declared RDA percentage pin.RDA
8)-h Will be a symbol if applicable. This is not part of the PLM output yet; Alivla and Erik will need to duplicate logic and identify what value is needed here. Perry says this is a “Dagger Bool” in PLU - pin.DVClaim  (0 = “”, 1 = “†”, 2 = …)
*/
function pipeify(text) {
  /** clean the text first 
   * replace " from excel
   * replace : with a , to better map
   */
  text = text
    // .replace(/:/g, ',')
    .replace(/ {2,}/g, '') //remove multiple spaces (formatted)
    .replace(/(".*)([\r\n])(.*")/g, '$1 $3') //remove linebreak fromw between quotes
    .replace(/"/g, '') //finally, remove quotes - needed above
    // .replace(/\n/g, ';')
    .normalize();
  
  let seq = 1;

  /*
  1|-|Ingrédients médicinaux|-
  2|-|Racine et feuille d'Ashwagandha (Withania somnifera) (Sensoril®) Standardisé à 32% Withania olgosaccarides|-
  3|-|10% Withanolide glycosides|-
  4|-|Ecorce de Magnolia (Magnolia officinalis) 2% Honokiol|-
  5|-|1% Magnolol|-
  6|-|L-Theanine (Suntheanine®)|-
  7|-|Phosphatidylsérine|-
  */
  // console.log(text);
  /** map through each split and pipeify it */
  const rest = text.split('\n').map(section => {
    console.log(section);
    if(!section) return ''; //just a friendly check

    let [ingred, other = ''] = section.split(/\t/g); //split on tab between cells

    let [qty = '', uom = '', ...theRest] = other.split(/\s/g); //split on the space between "200 mg". any pther junk goes into theRest
    
    if(theRest.length){
      console.log(`%c${theRest}`, 'font-style: italic; background-color: red;padding: 2px');
    }

    let order = seq; // #1 Sequence 
    //let ingred = ''; // #2 blank
    //let qty = section.trim(); // #3 
    //let uom = ''; // #4 
    let inputQty = ''; // #5 
    let inoutUom = ''; // #6 
    let rda = ''; // #7 rda has a number
    let footnote = ''; // #8 

    seq++;
    return `${order}|${ingred.trim()}|${qty.trim()}|${uom.trim()}|${inputQty}|${inoutUom}|${rda.trim()}|${footnote}\n`;

  }).join('');

  return rest;
}

targetIcon.addEventListener('click', e => {
  // document.querySelector('#source-info').classList.toggle('in');
  document.querySelector('#target-info').classList.toggle('in');
});
