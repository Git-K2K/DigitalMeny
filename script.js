// Use JS strict mode
"use strict";

// Import menu from json-file
let xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    var response = JSON.parse(this.responseText);

    // Global variables
    const menuJson = response.menu;
    let gluten = false;
    let lactose = false;
    let sortBy = "standard";
    let language = "SWE";
    let uncheckedCategories = [];
    let pickedItems = [];
    let cart = [];
    let totalPrice = 0;
    let totalItems;

    // Category checkboxes
    const categoryCheckboxes = document.querySelectorAll(".category");

    // Allergies checkboxes
    const glutenCheck = document.getElementById("glutenCheck");
    const lactoseCheck = document.getElementById("lactoseCheck");

    // Drop down selectors
    const sortBySelect = document.getElementById("sortBy");
    const languageSelect = document.querySelectorAll(".changeLanguage");

    // Buttons
    const resetFiltersBtn = document.getElementById("reset-filters");
    const emptyCartBtnHTML = document.getElementById("emptyCartBtn");
    const cartBtn = document.querySelector(".cart-btn");

    // HTML elements
    let languageElements = document.querySelectorAll(".lang");
    const menuItemsDiv = document.querySelector(".menuItems");
    const toggleButton = document.getElementsByClassName("toggle-button")[0];
    const filterBox = document.getElementsByClassName("filters")[0];
    const cartItemCount = document.getElementById("totalItems");
    const cartList = document.getElementById("cartList");
    const cartDropDown = document.querySelector(".cart-dropdown");

    // FUNCTIONS

    //Function for printing selected menu items to page.
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
        const noItemsParagraph = document.createElement("p");
        noItemsParagraph.classList.add("menuItem");
        noItemsParagraph.textContent =
          language === "SWE"
            ? "Det finns inga rätter som matchar valda kriterier"
            : "There are no options that match the selected criterias";
        document.querySelector(".menuItems").appendChild(noItemsParagraph);
      } else {
        // Create HTML-elements for each menu item
        printedMenu.forEach(function (item) {
          const menuItemDiv = document.createElement("div");
          menuItemDiv.classList.add("menuItem");

          menuItemDiv.innerHTML = `
          <div class="menuItem-text"><h3>${
            language === "SWE" ? item.titleSWE : item.titleENG
          }</h3>
          <p>${
            language === "SWE" ? item.descriptionSWE : item.descriptionENG
          }</p>
          <div class="priceAndBtn">
          <h3 class="pris"> ${language === "SWE" ? "Pris" : "Price"}: ${
            item.priceFull
          } kr${
            item.priceHalf !== ""
              ? " <i class='fa-solid fa-circle-half-stroke'></i> " +
                item.priceHalf +
                " kr"
              : ""
          }</h3><button value="${
            item.id
          }" class="buyBTN">+</button></div></div><div class="item-img"><img src="${
            item.img
          }" alt="${language === "SWE" ? item.titleSWE : item.titleENG}"></div>
          `;

          document.querySelector(".menuItems").appendChild(menuItemDiv);
        });
      }
      let buyBTN = document.querySelectorAll(".buyBTN");
      buyBTN.forEach((btn) => {
        btn.addEventListener("click", () => {
          pickedItems.push(Number(btn.value));
          cart = [];
          updateCart();
        });
      });
    }

    function updateCart() {
      pickedItems.forEach(function (pickedItemId) {
        let selectedItem = menuJson.find(function (item) {
          return item.id === pickedItemId;
        });
        if (selectedItem) {
          cart.push(selectedItem);
        }
      });

      populateCart();
    }

    function populateCart() {
      //Adds fullPrice to total variable
      totalPrice = cart.reduce(function (total, currentValue) {
        return total + currentValue.priceFull;
      }, 0);

      // Set totalItem var to items in cart
      totalItems = cart.length;

      //add text to cartItemCount
      cartItemCount.innerHTML = `<p class="total-items">  ${totalItems}</p>`;
      //empty cartList
      cartList.innerHTML = "";

      if (cart.length === 0) {
        let listItem = document.createElement("div");
        cartItemCount.innerHTML = ""; // empty cartItemCount

        listItem.innerHTML = `<p> ${
          language === "SWE"
            ? "Inga produkter i varukorgen"
            : "No items in cart"
        } </p>`; //adds text to cartList div

        cartList.appendChild(listItem);
      } else {
        // adds every picker item to cartList
        cart.forEach(function (item) {
          let listItem = document.createElement("div");
          listItem.innerHTML = `<div class="cart-item-div"><p>${
            language === "SWE" ? item.titleSWE : item.titleENG
          }</p> <p class="cart-pris"> ${item.priceFull} kr</p>`;
          cartList.appendChild(listItem);
        });
      }

      let cartTotals = document.createElement("div"); //create new div
      cartTotals.classList.add("cart-item-div"); //add class to div
      cartTotals.innerHTML = `<p class="cart-total">Total</p><p class="cart-pris"> ${totalPrice} kr</p>`; //adds totalPrice to div
      cartList.appendChild(cartTotals);
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
        menu = menu.sort(function (a, b) {
          if (a.priceFull < b.priceFull) {
            return 1;
          } else {
            return -1;
          }
        });
        // Low to high
      } else if (sortBy === "priceLowHigh") {
        menu = menu.sort(function (a, b) {
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

    //Empty cart button
    emptyCartBtnHTML.addEventListener("click", () => {
      cart = [];
      pickedItems = [];
      populateCart();
    });

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
    languageSelect.forEach((item) => {
      item.addEventListener("change", function (event) {
        language = event.target.value;
        toggleLanguage();
        printMenu();
        populateCart();
      });
    });

    // Re-set filters button
    resetFiltersBtn.addEventListener("click", resetFilters);

    // Filter button
    toggleButton.addEventListener("click", () => {
      filterBox.classList.toggle("active");
      toggleButton.innerHTML = filterBox.classList.contains("active")
        ? `<i class="fa-solid fa-xmark test" alt="Close icon"></i>`
        : `<i class="fa-solid fa-filter test" alt="Close icon"></i>`;
      if (cartDropDown.classList.contains("active")) {
        cartDropDown.classList.toggle("active");
      }
    });

    cartBtn.addEventListener("click", () => {
      cartDropDown.classList.toggle("active");

      if (filterBox.classList.contains("active")) {
        filterBox.classList.toggle("active");
      }
    });

    printMenu();
  }
};
xmlhttp.open("GET", "menu.json", true);
xmlhttp.send();
