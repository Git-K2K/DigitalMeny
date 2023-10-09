const meny = [
  {
    namn: "FLÄSKFILÉPLANKA",
    pris: 149,
    beskrivning: "Duchesse mos, rödvinssky, bearnaise och stekta grönsaker",
    typ: "fläsk",
  },
  {
    namn: "BIFF RYDBERG",
    pris: 175,
    beskrivning:
      "Tärnad oxfilé, potatis och gullök, serveras med dijonsenapskräm och rå äggula",
    typ: "biff",
  },
  {
    namn: "SPICY CHEESEBURGER",
    pris: 155,
    beskrivning:
      "180gram högrevsburgare med sallad, tomat, picklade rödlök, cheddarost med jalapeños och barbecuesås i briochebröd med pommes och rökig ranch-aioli",
    typ: "biff",
  },
  {
    namn: "HALLOUMI BURGARE",
    pris: 155,
    beskrivning:
      "Sallad, tomat, rödlök och guacamole i briochebröd med pommes och aiol",
    typ: "veg",
  },
  {
    namn: "FISH'N CHIPS",
    pris: 149,
    beskrivning:
      '"Beer-batter" panerad torskrygg med dill-aioli, halstrad citron och pommes',
    typ: "fisk",
  },
  {
    namn: "HUSETS SCHNITZEL",
    pris: 175,
    beskrivning:
      '200 gram välbankad schnitzel "Borås största" med citron, kapris, anjovis, kryddsmör och rödvinssky serveras med stekt potatis',
    typ: "fläsk",
  },
  {
    namn: "CAESARSALLAD",
    pris: 139,
    beskrivning:
      "Varm kyckling, bacon, krutonger, parmesan samt caesardressing",
    typ: "kyckling",
  },
  {
    namn: "LAXSALLAD MED QUINOA",
    pris: 159,
    beskrivning:
      "Grillad lax med quinoa, cocktailtomater, blandsallad, morot julienne, rödlök med en vinägrett",
    typ: "fisk",
  },
  {
    namn: "KRÄMIG KYCKLING PASTA",
    pris: 169,
    beskrivning: "Soltorkade tomater, basilika, grönsaker och parmesan",
    typ: "kyckling",
  },
  {
    namn: "MUSSLOR AL CAVA",
    pris: 189,
    beskrivning:
      "Ångkokta musslor i en krämig sås gjord på cava, toppas med cream fraîche och jalapeños, serveras med pommes och aioli",
    typ: "fisk",
  },
  {
    namn: "GRILLAD OXFILE",
    pris: 259,
    beskrivning:
      "200 gram oxfilé, rödvinssås, frästa grönsaker serveras med potatisgratäng (går att få med pommes och bearnaise) GRILLED BEEF TENDERLOIN ",
    typ: "biff",
  },
];
const kycklingRätter = meny.filter(
  (kycklingRätter) => kycklingRätter.typ === ("kyckling", "biff")
);

const biffRätter = meny.filter((biff) => biff.typ === "biff");
const menyItems = document.getElementsByClassName("meny-items")[0];

kycklingRätter.forEach((maträtt) => {
  let itemHR = document.createElement("HR");
  let itemH3 = document.createElement("h3");
  let itemBeskr = document.createElement("p");
  let itemPris = document.createElement("p");
  let itemH3Text = document.createTextNode(maträtt.namn);
  let itemBeskrText = document.createTextNode(maträtt.beskrivning);
  let itemPrisText = document.createTextNode(`${maträtt.pris} kr`);
  itemH3.appendChild(itemH3Text);
  itemBeskr.appendChild(itemBeskrText);
  itemPris.appendChild(itemPrisText);

  menyItems.appendChild(itemH3);

  menyItems.appendChild(itemBeskr);

  menyItems.appendChild(itemPris);
  menyItems.appendChild(itemHR);
});

console.log(biffRätter);
