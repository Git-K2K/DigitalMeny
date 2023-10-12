var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    let response = JSON.parse(xhttp.responseText);

    const menu = response.menu;
    const menuList = document.getElementById("menuList"); // hämtar HTML diven menuList
    const menuTypeCheckboxes = document.querySelectorAll(
      'input[name="menuType"]'
    ); // hämtar input i typ checkbox
    const allergyCheckboxes = document.querySelectorAll(
      'input[name="allergy"]'
    ); // hämtar input i allergi checkbox
    const enBtn = document.getElementById("en"); // hämtar knappen för engelska
    const svBtn = document.getElementById("sv"); // hämtar knappen för svenska
    const resetBtn = document.getElementById("resetBtn");
    const selectSort = document.getElementById("sort-menu");
    const isKött = document.querySelectorAll(".kött");
    const isVeg = document.getElementById("veg");

    let sortMenu = false;
    let inEnglishBool = false; // behövs för att språket ska ändras även när menuItems uppdaterad
    let sortMenuHigh = false;
    let descriptionText = []; // skapar en tom array för description av mat, ändras via funktionen updateMenuItems eller displayMenuItem
    let nameText = []; // skapar en tom array för name på mat, ändras via funktionen updateMenuItems eller displayMenuItem
    let namnText = []; // skapar en tom array för name på mat, ändras via funktionen updateMenuItems eller displayMenuItem
    let beskrivningText = []; // skapar en tom array för beskrivning av mat, ändras via funktionen updateMenuItems eller displayMenuItem

    // Funktion för att uppdatera vilka menuItems baserat på vald checkbox
    function updateMenuItems() {
      //Hämtar värdet från checkboxen menuType
      const selectedTypes = Array.from(menuTypeCheckboxes)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.value);

      //Hämtar värdet från checkboxen allergy
      const selectedAllergens = Array.from(allergyCheckboxes)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.value);

      //filtrerar menyn baserat på vilka typer och allergier
      filteredMenu = menu.filter((item) => {
        // kollar om om mattypen finns på objektet
        const typeMatch =
          selectedTypes.length === 0 || selectedTypes.includes(item.typ);

        // kollar om allergen inte finns på objektet
        const allergenMatch =
          selectedAllergens.length === 0 ||
          selectedAllergens.every(
            (allergen) => !item.allergy.includes(allergen)
          );

        //skickar tillbaka objekten som innehåller både mattypen och inte innehåller allergenen
        return typeMatch && allergenMatch;
      });

      let sortedmenu = [];

      if (sortMenu) {
        if (sortMenuHigh) {
          sortedmenu = filteredMenu.sort(function (a, b) {
            if (a.pris < b.pris) {
              return 1;
            } else {
              return -1;
            }
          });
        } else {
          sortedmenu = filteredMenu.sort(function (a, b) {
            if (a.pris > b.pris) {
              return 1;
            } else {
              return -1;
            }
          });
        }
      } else {
        sortedmenu = filteredMenu;
      }
      // tar uppdaterade listan med object och skickar till funktionen displayMenuItems
      displayMenuItems(sortedmenu);
    }

    // funktionen var att visa objekte
    function displayMenuItems(menuItems) {
      menuList.innerHTML = ""; // Clear the list

      if (menuItems.length === 0) {
        const listItem = document.createElement("div");
        listItem.classList.add("menu-item");
        listItem.innerHTML = `<h3 class="namn" > Ingen maträtt matchar dina val</h3> <h3 class="name hidden">No item matches your criteria</h3>`;
        menuList.appendChild(listItem);
      } else {
        menuItems.forEach((item) => {
          const listItem = document.createElement("div");
          listItem.classList.add("menu-item");
          if (item.prishalv) {
            listItem.innerHTML = `
                    <h3 class="namn">${item.namn}</h3> <h3 class="name hidden">${item.name}</h3> <p class="beskrivning"> ${item.beskrivning}</p><p class="description hidden"> ${item.description}</p>
                    <p class="pris">Pris hel: ${item.pris} kr</p> / <p class="pris">Pris halv: ${item.prishalv} kr</p>`;
            menuList.appendChild(listItem);
          } else {
            listItem.innerHTML = `
                    <h3 class="namn">${item.namn}</h3> <h3 class="name hidden">${item.name}</h3> <p class="beskrivning"> ${item.beskrivning}</p><p class="description hidden"> ${item.description}</p>
                    <p class="pris">Pris: ${item.pris} kr</p>`;
            menuList.appendChild(listItem);
          }
        });
      }

      descriptionText = document.querySelectorAll(".description");
      nameText = document.querySelectorAll(".name");
      namnText = document.querySelectorAll(".namn");
      beskrivningText = document.querySelectorAll(".beskrivning");

      if (inEnglishBool) {
        inEnglish();
      } else {
        inSwedish();
      }
    }

    isVeg.addEventListener("change", () => {
      isKött.forEach((checkbox) => {
        checkbox.checked = false;
      });
      console.log("klick");
    });

    // Add event listeners to checkboxes to trigger filtering
    menuTypeCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", updateMenuItems);
    });

    allergyCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", updateMenuItems);
    });

    // Initialize with all menu items
    displayMenuItems(menu);

    function inEnglish() {
      descriptionText.forEach((item) => {
        item.classList.remove("hidden");
      });
      nameText.forEach((item) => {
        item.classList.remove("hidden");
      });
      namnText.forEach((item) => {
        item.classList.add("hidden");
      });
      beskrivningText.forEach((item) => {
        item.classList.add("hidden");
      });
    }

    function inSwedish() {
      descriptionText.forEach((item) => {
        item.classList.add("hidden");
      });
      nameText.forEach((item) => {
        item.classList.add("hidden");
      });
      namnText.forEach((item) => {
        item.classList.remove("hidden");
      });
      beskrivningText.forEach((item) => {
        item.classList.remove("hidden");
      });
    }

    function resetAllFilter() {
      menuTypeCheckboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
      allergyCheckboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
      selectSort.selectedIndex = 0;
      sortMenu = false;
      sortMenuHigh = false;
    }

    selectSort.addEventListener("change", () => {
      if (selectSort.value === "none") {
        sortMenu = false;
        console.log("klick");
        updateMenuItems();
      } else if (selectSort.value === "högt") {
        sortMenuHigh = true;
        sortMenu = true;
        updateMenuItems();
        console.log("klick");
      } else {
        sortMenuHigh = false;
        sortMenu = true;
        updateMenuItems();
        console.log("klick");
      }
    });

    resetBtn.addEventListener("click", () => {
      resetAllFilter();
      updateMenuItems();
    });

    enBtn.addEventListener("click", () => {
      inEnglishBool = true;
      if (inEnglishBool) {
        inEnglish();
      } else {
        inSwedish();
      }
    });

    svBtn.addEventListener("click", () => {
      inEnglishBool = false;
      if (inEnglishBool) {
        inEnglish();
      } else {
        inSwedish();
      }
    });
  }
};

xhttp.open("GET", "menu.json", true);
xhttp.send();
