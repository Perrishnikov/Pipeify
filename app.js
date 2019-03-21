const source = document.querySelector('#source');
const target = document.querySelector('#target');
const message = document.querySelector('.message');

let newText;

source.addEventListener('click', e => {

  e.preventDefault();

  navigator.clipboard.readText()
    .then(clipText => {

      if (clipText !== newText) {
        source.innerText = clipText;

        // console.log(`clipText: ${clipText}`);

        newText = pipeify(clipText);

        /** Write the Pipeified text to the source box and copy it to clipboard */
        navigator.clipboard.writeText(newText)
          .then(() => {
            /* clipboard successfully set */
            // console.log(`newText: ${newText}`);
            target.innerText = newText;
            showMessage();
            setTimeout(showMessage, 4000);

          }, function() {
            /* clipboard write failed */
          });
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
  text = text.replace(/"/g, '').replace(/:/, ',').normalize().trim();
  // console.log(text);

  let seq = 1;

  /** map through each split and pipeify it */
  const rest = text.split(',').map(section => {
    // console.log(section);
    let a = seq; // Sequence 
    let b = '-'; // blank
    let c = section.trim(); // concat ingreds and description
    let d = '-'; // qty
    let e = '-'; // uom
    let f = '-'; // blank
    let g = '-'; // RDA
    let h = '-'; //symbol like dagger

    seq++;
    return `${a}|${b}|${c}|${d}|${e}|${f}|${g}|${h}\n`;
  }).join('');

  return rest;
}

/*
1|-|Ingrédients médicinaux|-
    2|-|Racine et feuille d'Ashwagandha (Withania somnifera) (Sensoril®) Standardisé à 32% Withania olgosaccarides|-
    3|-|10% Withanolide glycosides|-
    4|-|Ecorce de Magnolia (Magnolia officinalis) 2% Honokiol|-
    5|-|1% Magnolol|-
    6|-|L-Theanine (Suntheanine®)|-
    7|-|Phosphatidylsérine|-
    
*/

function showMessage() {
  // let classList = [...message.classList];
  // console.log(classList);
  message.classList.toggle('in');
  // function sayHi() {
  //   alert('Hello');
  // }
  
  
}
