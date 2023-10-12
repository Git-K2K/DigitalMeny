"use strict";

let xmlhttp = new XMLHttpRequest();
let menuJson = [];

xmlhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    var response = JSON.parse(this.responseText);
    response.menu.forEach((item) => {
      menuJson.push(item);
    });
    printMenu();
  }
};

xmlhttp.open("GET", "menu.json", true);
xmlhttp.send();

// Global variables

let anyCategoryChecked = false;
let gluten = false;
let lactose = false;
let sortBy = "standard";
let language = "SWE";
let printedMenu = [];
let uncheckedCategories = [];

// Category checkboxes
const vegCheck = document.getElementById("vegCheck");
const categoryCheckboxes = document.querySelectorAll(".category");

// Allergies checkboxes
const glutenCheck = document.getElementById("glutenCheck");
const lactoseCheck = document.getElementById("lactoseCheck");

// Drop down selectors
const sortBySelect = document.getElementById("sortBy");
const languageSelect = document.getElementById("language");

// Buttons
const resetFiltersBtn = document.getElementById("reset-filters");

// Language HTML elements
const languageElements = document.querySelectorAll(".lang");

// FUNCTIONS

function printMenu() {
  // Re-set printedMenu
  let printedMenu = JSON.parse(JSON.stringify(menuJson));

  // Call the clearMenu function
  clearMenu();

  // Sort the menu using the variable sortBy
  sortMenu(printedMenu, sortBy);

  // Filter the menu
  if (checkCategories()) {
    printedMenu = filterCategories(printedMenu);
  }

  if (checkAllergies()) {
    printedMenu = filterAllergies(printedMenu);
  }

  // Generate message if no menu items match the filters
  if (printedMenu.length === 0) {
    const noItemsParagraph = document.createElement("p");
    noItemsParagraph.classList.add("menuItem");
    if (language === "SWE") {
      noItemsParagraph.textContent =
        "Det finns inga rätter som matchar valda kriterier";
    } else {
      noItemsParagraph.textContent =
        "There are no options that match the selected criterias";
    }
    document.querySelector(".menuItems").appendChild(noItemsParagraph);
  } else {
    // Create HTML-elements for each menu item
    printedMenu.forEach(function (item) {
      const menuItemDiv = document.createElement("div");
      menuItemDiv.classList.add("menuItem");
      const menuItemTitle = document.createElement("h3");
      const menuDesctiption = document.createElement("p");
      if (language === "SWE") {
        menuItemTitle.textContent = `${item.titleSWE} | ${item.priceFull} kr ${
          item.priceHalf !== "" ? "(Halv " + item.priceHalf + " kr)" : ""
        }`;
        menuDesctiption.textContent = item.descriptionSWE;
      } else if (language === "ENG") {
        menuItemTitle.textContent = `${item.titleENG} | ${item.priceFull} kr ${
          item.priceHalf !== "" ? "(Half " + item.priceHalf + " kr)" : ""
        }`;
        menuDesctiption.textContent = item.descriptionENG;
      }
      menuItemDiv.appendChild(menuItemTitle);
      menuItemDiv.appendChild(menuDesctiption);

      document.querySelector(".menuItems").appendChild(menuItemDiv);
    });
  }
}

function filterCategories(menu) {
  uncheckedCategories.forEach(function (category) {
    menu = menu.filter((menuItem) => menuItem.category !== category);
  });

  return menu;
}

function filterAllergies(menu) {
  let tempMenu = menu;

  if (lactose) {
    tempMenu = tempMenu.filter((menuItem) => menuItem.lactoseFree);
  }

  if (gluten) {
    tempMenu = tempMenu.filter((menuItem) => menuItem.glutenFree);
  }

  return tempMenu;
}

// CLEAR the menu
function clearMenu() {
  const menuItems = document.querySelectorAll(".menuItem");
  menuItems.forEach(function (item) {
    item.remove();
  });
}

// SORT the menu
function sortMenu(menu, sortBy) {
  if (sortBy === "priceHighLow") {
    printedMenu = menu.sort(function (a, b) {
      if (a.priceFull < b.priceFull) {
        return 1;
      } else {
        return -1;
      }
    });
  } else if (sortBy === "priceLowHigh") {
    printedMenu = menu.sort(function (a, b) {
      if (a.priceFull > b.priceFull) {
        return 1;
      } else {
        return -1;
      }
    });
  }
}

function checkCategories() {
  let categoryCheckboxes = document.querySelectorAll(".category");
  let checked = false;
  categoryCheckboxes.forEach(function (checkbox) {
    if (checkbox.checked) {
      checked = true;
    }
  });
  return checked;
}

function checkAllergies() {
  let categoryCheckboxes = document.querySelectorAll(".allergy");
  let checked = false;
  categoryCheckboxes.forEach(function (checkbox) {
    if (checkbox.checked) {
      checked = true;
    }
  });
  return checked;
}

function resetFilters() {
  // Uncheck all boxes
  const allCheckBoxes = document.querySelectorAll(".checkbox");
  allCheckBoxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
  // Re-set sorting
  sortBy = "standard";
  document.getElementById("sortBy").value = "standard";
  printMenu();
}

function getUncheckedCategories() {
  uncheckedCategories = [];
  categoryCheckboxes.forEach((box) => {
    if (!box.checked) {
      uncheckedCategories.push(box.value);
    }
  });
}

function toggleLanguage() {
  languageElements.forEach((el) => {
    el.classList.toggle("hidden");
  });
}

// EVENT LISTENERS

categoryCheckboxes.forEach((box) => {
  box.addEventListener("change", function (event) {
    if (event.target.value === "Veg" && event.target.checked) {
      document.getElementById("beefCheck").checked = false;
      document.getElementById("chickenCheck").checked = false;
      document.getElementById("fishCheck").checked = false;
      document.getElementById("porkCheck").checked = false;
    }
    getUncheckedCategories();
    printMenu();
  });
});

lactoseCheck.addEventListener("change", function (event) {
  lactose = event.target.checked;
  printMenu();
});

glutenCheck.addEventListener("change", function (event) {
  gluten = event.target.checked;
  printMenu();
});

sortBySelect.addEventListener("change", function (event) {
  sortBy = event.target.value;
  printMenu();
});

languageSelect.addEventListener("change", function (event) {
  language = event.target.value;
  toggleLanguage();
  printMenu();
});

resetFiltersBtn.addEventListener("click", resetFilters);
