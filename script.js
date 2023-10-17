// Use JS strict mode
"use strict";

// Import menu from json-file
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
const categoryCheckboxes = document.querySelectorAll(".category");

// Allergies checkboxes
const glutenCheck = document.getElementById("glutenCheck");
const lactoseCheck = document.getElementById("lactoseCheck");

// Drop down selectors
const sortBySelect = document.getElementById("sortBy");
const languageSelect = document.getElementById("language");

// Buttons
const resetFiltersBtn = document.getElementById("reset-filters");

// HTML elements
const languageElements = document.querySelectorAll(".lang");
const menuItemsDiv = document.querySelector(".menuItems");

// FUNCTIONS

//
function printMenu() {
  // Re-set printedMenu
  let printedMenu = JSON.parse(JSON.stringify(menuJson));

  // Call the clearMenu function
  menuItemsDiv.innerHTML = "";

  // Sort the menu using the variable sortBy
  sortMenu(printedMenu, sortBy);

  // Filter the menu on category checkboxes
  if (checkCategories()) {
    printedMenu = filterCategories(printedMenu);
  }

  // Filter the menu on allergy checkboxes
  if (checkAllergies()) {
    printedMenu = filterAllergies(printedMenu);
  }

  // Generate message if no menu items match the filters
  if (printedMenu.length === 0) {
    let html = `
        <div class="menuItem">
          <p>${
            language === "SWE"
              ? "Det finns inga rätter som matchar valda kriterier"
              : "There are no options that match the selected criterias"
          }</p>
        </div>
      `;

    menuItemsDiv.insertAdjacentHTML("beforeend", html);

    // const noItemsParagraph = document.createElement("p");
    // noItemsParagraph.classList.add("menuItem");
    // if (language === "SWE") {
    //   noItemsParagraph.textContent =
    //     "Det finns inga rätter som matchar valda kriterier";
    // } else {
    //   noItemsParagraph.textContent =
    //     "There are no options that match the selected criterias";
    // }
    // document.querySelector(".menuItems").appendChild(noItemsParagraph);
  } else {
    // Create HTML-elements for each menu item
    console.log(language);
    printedMenu.forEach(function (item) {
      let html = `
        <div class="menuItem">
          <div class="title-and-price">
            <h3>${language === "SWE" ? item.titleSWE : item.titleENG}</h3>
            <h3><span class="half-price">${
              item.priceHalf ? "(1/2 " + item.priceHalf + "kr) " : ""
            }</span>${item.priceFull}kr</h3>
          </div>
          <p>${
            language === "SWE" ? item.descriptionSWE : item.descriptionENG
          }</p>
        </div>
      `;

      menuItemsDiv.insertAdjacentHTML("beforeend", html);

      // const menuItemDiv = document.createElement("div");
      // menuItemDiv.classList.add("menuItem");
      // const menuItemTitle = document.createElement("h3");
      // const menuDesctiption = document.createElement("p");
      // if (language === "SWE") {
      //   menuItemTitle.textContent = `${item.titleSWE} | ${item.priceFull} kr ${
      //     item.priceHalf !== "" ? "(Halv " + item.priceHalf + " kr)" : ""
      //   }`;
      //   menuDesctiption.textContent = item.descriptionSWE;
      // } else if (language === "ENG") {
      //   menuItemTitle.textContent = `${item.titleENG} | ${item.priceFull} kr ${
      //     item.priceHalf !== "" ? "(Half " + item.priceHalf + " kr)" : ""
      //   }`;
      //   menuDesctiption.textContent = item.descriptionENG;
      // }
      // menuItemDiv.appendChild(menuItemTitle);
      // menuItemDiv.appendChild(menuDesctiption);

      // document.querySelector(".menuItems").appendChild(menuItemDiv);
    });
  }
}

// Filter a menu array by category
function filterCategories(menu) {
  uncheckedCategories.forEach(function (category) {
    menu = menu.filter((menuItem) => menuItem.category !== category);
  });

  return menu;
}

// Filter the menu array by allergies
function filterAllergies(menu) {
  if (lactose) {
    menu = menu.filter((menuItem) => menuItem.lactoseFree);
  }

  if (gluten) {
    menu = menu.filter((menuItem) => menuItem.glutenFree);
  }

  return menu;
}

// Sort the menu based on the sortBy variable
function sortMenu(menu, sortBy) {
  // High to low
  if (sortBy === "priceHighLow") {
    printedMenu = menu.sort(function (a, b) {
      if (a.priceFull < b.priceFull) {
        return 1;
      } else {
        return -1;
      }
    });
    // Low to high
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

// Check if any of the category checkboxes are true
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

// Check if any of the allery checkboxes are true
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

// Re-set all filters and sorting
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

// Create an array with the values of all unchecked category boxes. Used to filter the menu.
function getUncheckedCategories() {
  uncheckedCategories = [];
  categoryCheckboxes.forEach((box) => {
    if (!box.checked) {
      uncheckedCategories.push(box.value);
    }
  });
}

// Toggle the CSS hidden-class based on the language variable.
function toggleLanguage() {
  languageElements.forEach((el) => {
    el.classList.toggle("hidden");
  });

  if (language === "SWE") {
    document.documentElement.lang = "sv";
  } else {
    document.documentElement.lang = "en";
  }
}

// EVENT LISTENERS

// Category checkboxes
categoryCheckboxes.forEach((box) => {
  box.addEventListener("change", function (event) {
    // If the vegetarian option is selected, all other categories are unchecked
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

// Lactose free checkbox
lactoseCheck.addEventListener("change", function (event) {
  lactose = event.target.checked;
  printMenu();
});

// Gluten free checkbox
glutenCheck.addEventListener("change", function (event) {
  gluten = event.target.checked;
  printMenu();
});

// Sorting selector
sortBySelect.addEventListener("change", function (event) {
  sortBy = event.target.value;
  printMenu();
});

// Language selector
languageSelect.addEventListener("change", function (event) {
  language = event.target.value;

  toggleLanguage();
  printMenu();
});

// Re-set filters button
resetFiltersBtn.addEventListener("click", resetFilters);
