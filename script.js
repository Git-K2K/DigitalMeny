// Use JS strict mode
"use strict";

// Import menu from json-file
let xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    var response = JSON.parse(this.responseText);

    // Global variables

    const menuJson = response.menu;
    let anyCategoryChecked = false;
    let gluten = false;
    let lactose = false;
    let sortBy = "standard";
    let language = "SWE";
    let uncheckedCategories = [];
    let pickedItems = [];
    let cart = [];
    let total = 0;

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

    // HTML elements
    let languageElements = document.querySelectorAll(".lang");
    const menuItemsDiv = document.querySelector(".menuItems");
    const toggleButton = document.getElementsByClassName("toggle-button")[0];
    const filterBox = document.getElementsByClassName("filters")[0];

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

          if (language === "SWE") {
            menuItemDiv.innerHTML = `<div class="menuItem-text"><h3>${
              item.titleSWE
            }</h3><p>${
              item.descriptionSWE
            }</p><div class="priceAndBtn"><h3 class="pris"> Pris: ${
              item.priceFull
            } kr${
              item.priceHalf !== "" ? " Halv " + item.priceHalf + " kr" : ""
            }</h3><button value="${
              item.id
            }" class="buyBTN">+</button></div></div><div class="item-img"><img src="${
              item.img
            }" alt="${item.titleSWE}"></div>`;
          } else if (language === "ENG") {
            menuItemDiv.innerHTML = `<div class="menuItem-text"><h3>${
              item.titleENG
            }</h3><p>${
              item.descriptionENG
            }</p><div class="priceAndBtn"><h3 class="pris"> Pris: ${
              item.priceFull
            } kr${
              item.priceHalf !== "" ? " Halv " + item.priceHalf + " kr" : ""
            }</h3><button value="${
              item.id
            }" class="buyBTN">+</button></div></div><div class="item-img"><img src="${
              item.img
            }" alt="${item.titleENG}"></div>`;
          }

          document.querySelector(".menuItems").appendChild(menuItemDiv);
        });
      }
      let buyBTN = document.querySelectorAll(".buyBTN");
      buyBTN.forEach((btn) => {
        btn.addEventListener("click", () => {
          pickedItems.push(Number(btn.value));
          cart = [];
          updateCart();
          console.log(pickedItems);
          languageElements = document.querySelectorAll(".lang");
        });
      });
    }

    function updateCart() {
      pickedItems.forEach(function (pickedItemId) {
        // Find the corresponding item in the jsonData array
        let selectedItem = menuJson.find(function (item) {
          return item.id === pickedItemId;
        });
        // If the item is found, push the priceFull to the cart
        if (selectedItem) {
          cart.push(selectedItem);
        }
      });

      populateCart();

      emptyCartBtnHTML.addEventListener("click", () => {
        console.log("click");
        cart.length = 0;
        pickedItems.length = 0;
        const cartHTML = document.getElementById("totalItems");
        populateCart();
        cartHTML.innerHTML = "";
      });

      function populateCart() {
        total = cart.reduce(function (total, currentValue) {
          return total + currentValue.priceFull;
        }, 0);

        let totalItems = cart.length;

        const cartHTML = document.getElementById("totalItems");
        cartHTML.innerHTML = `<p class="total-price">  ${totalItems}</p>`;

        const cartList = document.getElementById("cartList");
        cartList.innerHTML = "";

        if (language === "SWE") {
          if (cart.length === 0) {
            let listItem = document.createElement("div");
            cartHTML.innerHTML = "";

            listItem.innerHTML = `<p>Inga produkter i varukorgen</p>`;

            cartList.appendChild(listItem);
          } else {
            cart.forEach(function (item) {
              let listItem = document.createElement("div");

              listItem.innerHTML = `<div class="cart-item-div"><p class="lang">${item.titleSWE}</p> <p class="cart-pris lang"> ${item.priceFull} kr</p> 
              <p class="lang hidden">${item.titleENG}</p> <p class="cart-pris lang hidden"> ${item.priceFull}</p></div>`;

              cartList.appendChild(listItem);
            });
          }
        } else {
          if (cart.length === 0) {
            let listItem = document.createElement("div");
            cartHTML.innerHTML = "";

            listItem.innerHTML = `<p>No items in cart</p>`;

            cartList.appendChild(listItem);
          } else {
            cart.forEach(function (item) {
              let listItem = document.createElement("div");

              listItem.innerHTML = `<div class="cart-item-div"><p class="lang">${item.titleENG}</p> <p class="cart-pris lang"> ${item.priceFull} kr</p> 
              <p class="lang hidden">${item.titleSWE}</p> <p class="cart-pris lang hidden"> ${item.priceFull}</p></div>`;

              cartList.appendChild(listItem);
            });
          }
        }
        let cartTotals = document.createElement("div");
        cartTotals.classList.add("cart-item-div");
        cartTotals.innerHTML = `<p class="cart-total">Total</p><p class="cart-pris"> ${total} kr</p>`;
        cartList.appendChild(cartTotals);
      }

      languageSelect.forEach((item) => {
        item.addEventListener("change", function (event) {
          language = event.target.value;
          populateCart();
        });
      });
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

    const emptyCartBtnHTML = document.getElementById("emptyCartBtn1");
    emptyCartBtnHTML.addEventListener("click", () => {
      const cartList = document.getElementById("cartList");
      console.log(cartList);
      let listItem = document.createElement("li");
      listItem.innerHTML = `No items selected`;
      cartList.appendChild(listItem);
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

    const cartBtn = document.getElementsByClassName("cart-btn")[0];
    const cartDropDown = document.getElementsByClassName("cart-dropdown")[0];

    cartBtn.addEventListener("click", () => {
      cartDropDown.classList.toggle("active");

      if (filterBox.classList.contains("active")) {
        filterBox.classList.toggle("active");
      }
    });

    //test här

    printMenu();
  }
};
xmlhttp.open("GET", "menu.json", true);
xmlhttp.send();
