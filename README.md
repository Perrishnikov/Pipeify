# Pipeify

https://github.com/Perrishnikov/Pipeify/blob/master/index.html

Salsify:LABEL_DATASET_NUTRIENT_A  (before 1st pin.LineBreak)

1)-a Dynamically generated Nutrient level indicator formatted like 1.0.0 -pin.Sequence

2)-b Nutrient Description (standard description) – BLANK

3)-c Source or Override Phrase (Always use Override Phrase if present) concat im.IngredientName and im.Description –@Soumya remove HTML

4)-d Declared Qty pin.Qty

5)-e Declared UoM pin.UnitOfMeasure

6)-f Value Statement Description  – BLANK for PLU . Comes from Description

7)-g Declared RDA percentage pin.RDA

8)-h Will be a symbol if applicable. This is not part of the PLM output yet; Alivla and Erik will need to duplicate logic and identify what value is needed here. Perry says this is a “Dagger Bool” in PLU - pin.DVClaim  (0 = “”, 1 = “†”, 2 = …)
