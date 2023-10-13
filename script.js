import meny from "./meny.json" assert { type: "json" };
import enmeny from "./enmeny.json" assert { type: "json" };


//Dessa variabler hämtar referenser till olika DOM-element på webbsidan. 
//checkboxes hämtar alla checkbox-element, menyItems refererar till ett DOM-element med klassen 
// "meny-items", sortDropdown och languageChanger hämtar dropdown-menyer.
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const menyItems = document.querySelector(".meny-items");
const sortDropdown = document.getElementById('sort');
const languageChanger = document.getElementById('language-select');

//Detta är en funktion som uppdaterar innehållet i DOM-elementet med klassen "meny-items" baserat på vilka checkboxes som är incheckade
function displayFilteredDishes() {
menyItems.innerHTML = ""; 


  const selectedTypes = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.getAttribute("typ"));

  const filtreradeRätter = meny.filter((maträtt) => {
    if (selectedTypes.length === 0) {
      return true; // Visa alla rätter om ingen checkbox är vald
    } else {
      return selectedTypes.includes(maträtt.typ);
    }
  });
 
  const selectedSort = sortDropdown.value;

// Sortering i ordning
// If "lägst pris" är valt på comboboxen så ska sidan visa de billigaste rätterna först
// else if "högst pris" är valt på comboboxen så ska sidan visa de dyraste rätterna först
  if (selectedSort === "Lägst Pris") {
    
    filtreradeRätter.sort((a, b) => a.pris - b.pris);
  } else if (selectedSort === "Högst Pris") {
    
    filtreradeRätter.sort((a, b) => b.pris - a.pris);
  }

  filtreradeRätter.forEach((maträtt) => {
    let itemHR = document.createElement("HR");
    let itemH3 = document.createElement("h3");
    let itemal = document.createElement("al")
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
    menyItems.appendChild(itemal);
  });
}



// Dessa eventlyssnare registrerar funktionen displayFilteredDishes att köras varje gång en checkbox ändras eller om det sker ändring i comboboxen.
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", displayFilteredDishes);
});

sortDropdown.addEventListener("change", displayFilteredDishes);

// När sidan laddar visas alla rätter med hjälp av funktionen 
displayFilteredDishes();



// Funktionen ser till att alla checkboxes,comboboxes,språk återställs till standard eftersom att "checkbox.checked är false"

function resetFilters() {
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
  
  sortDropdown.value = "Standard";
  languageChanger.value = "svenska";
  
  displayFilteredDishes();
}
window.resetFilters = resetFilters; 

