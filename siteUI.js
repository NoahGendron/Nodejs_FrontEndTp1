//<span class="cmdIcon fa-solid fa-ellipsis-vertical"></span>
let contentScrollPosition = 0;
let selectedCat = "Toutes les catégories";
Init_UI();

function Init_UI() {
  renderBookmarks();

  $("#createContact").on("click", async function () {
    saveContentScrollPosition();
    renderCreateContactForm();
  });
  $("#abort").on("click", async function () {
    renderBookmarks();
  });
  $("#aboutCmd").on("click", function () {
    renderAbout();
  });

  checkCatButtons();
}

function removeCatButtonListeners() {
  let buttons = document.querySelectorAll(".menuItemLayout");

  buttons.forEach((button) => {
    button.removeEventListener("click", handleCatButtonClick);
  });
}

function checkCatButtons() {
  let buttons = document.querySelectorAll(".menuItemLayout");

  buttons.forEach((button) => {
    if (button.id != "aboutCmd") {
      button.addEventListener("click", handleCatButtonClick);
    }
  });
}

function handleCatButtonClick() {

  let buttons = document.querySelectorAll(".menuItemLayout");
  buttons.forEach((otherButton) => {
    otherButton.querySelector("i").classList.remove("fa-fw", "fa-check");
  });

  this.querySelector("i").classList.add("fa-check");
  this.querySelector("i").classList.remove("fa-fw");

  selectedCat = this.textContent.trim();
  renderBookmarks(this.textContent.trim());
}

async function renderCategories() {
  const uniqueCategories = [];
  const dropdownMenu = document.getElementById("dropdown");

  let favs = await API_GetContacts();

  if (favs !== null) {
    favs.forEach((fav) => {
      if (fav.Category && !uniqueCategories.includes(fav.Category)) {
        uniqueCategories.push(fav.Category);
      }
    });
  }

  $("#dropdown").empty();

  /* dropdownMenu.innerHTML = `<div data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="cmdIcon fa fa-ellipsis-vertical"></i>
                </div>
              <div class="dropdown-menu noselect" id="DDMenu" style="position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate(-193px, 42px);" data-popper-placement="bottom-end"><div class="dropdown-item menuItemLayout" id="allCatCmd">
                <i class="menuIcon fa fa-check mx-2"></i> Toutes les catégories
            </div><div class="dropdown-divider"></div><div class="dropdown-item menuItemLayout category" id="allCatCmd">
                    <i class="menuIcon fa fa-fw mx-2"></i> Cegep
                </div><div class="dropdown-item menuItemLayout category" id="allCatCmd">
                    <i class="menuIcon fa fa-fw mx-2"></i> Cloud
                </div><div class="dropdown-item menuItemLayout category" id="allCatCmd">
                    <i class="menuIcon fa fa-fw mx-2"></i> Météo
                </div><div class="dropdown-item menuItemLayout category" id="allCatCmd">
                    <i class="menuIcon fa fa-fw mx-2"></i> Nouvelles
                </div><div class="dropdown-item menuItemLayout category" id="allCatCmd">
                    <i class="menuIcon fa fa-fw mx-2"></i> Réseaux sociaux
                </div><div class="dropdown-item menuItemLayout category" id="allCatCmd">
                    <i class="menuIcon fa fa-fw mx-2"></i> Streaming
                </div><div class="dropdown-item menuItemLayout category" id="allCatCmd">
                    <i class="menuIcon fa fa-fw mx-2"></i> Université
                </div><div class="dropdown-divider"></div><div class="dropdown-item menuItemLayout" id="aboutCmd">
                <i class="menuIcon fa fa-info-circle mx-2"></i> À propos...
            </div></div>`;*/

  uniqueCategories.forEach((cat) => {
    let faClass = cat == selectedCat ? "fa-check" : "fa-fw";

    dropdownMenu.innerHTML += `<div class="dropdown-divider"></div><div class="dropdown-item menuItemLayout category" id="allCatCmd">
                    <i class="menuIcon fa ${faClass} mx-2"></i> ${cat}
                </div>`;
  });
  checkCatButtons();
}

function renderAbout() {
  saveContentScrollPosition();
  eraseContent();
  $("#createContact").hide();
  $("#abort").show();
  $("#actionTitle").text("À propos...");
  $("#content").append(
    $(`
            <div class="aboutContainer">
                <h2>Gestionnaire de favoris</h2>
                <hr>
                <p>
                    Travail pratique, gestionnaire de favoris.
                </p>
                <p>
                    Auteur: Noah Gendron
                </p>
                <p>
                    Collège Lionel-Groulx, automne 2023
                </p>
            </div>
        `)
  );
}
async function renderBookmarks(cat) {
  showWaitingGif();
  $("#actionTitle").text("Liste des favoris");
  $("#createContact").show();
  $("#abort").hide();
  let contacts = await API_GetContacts();
  eraseContent();

  if (contacts !== null) {
    contacts.forEach((fav) => {
      if (fav.Category == cat || !cat || cat == "Toutes les catégories") {
        $("#content").append(renderContact(fav));
      }
    });
    restoreContentScrollPosition();
    // Attached click events on command icons
    $(".editCmd").on("click", function () {
      saveContentScrollPosition();
      renderEditContactForm(parseInt($(this).attr("editContactId")));
    });
    $(".deleteCmd").on("click", function () {
      saveContentScrollPosition();
      renderDeleteContactForm(parseInt($(this).attr("deleteContactId")));
    });
    $(".contactRow").on("click", function (e) {
      e.preventDefault();
    });
  } else {
    renderError("Service introuvable");
  }
  renderCategories();
}
function showWaitingGif() {
  $("#content").empty();
  $("#content").append(
    $(
      "<div class='waitingGifcontainer'><img class='waitingGif' src='Loading_icon.gif' /></div>'"
    )
  );
}
function eraseContent() {
  $("#content").empty();
}
function saveContentScrollPosition() {
  contentScrollPosition = $("#content")[0].scrollTop;
}
function restoreContentScrollPosition() {
  $("#content")[0].scrollTop = contentScrollPosition;
}
function renderError(message) {
  eraseContent();
  $("#content").append(
    $(`
            <div class="errorContainer">
                ${message}
            </div>
        `)
  );
}
function renderCreateContactForm() {
  renderContactForm();
}
async function renderEditContactForm(id) {
  showWaitingGif();
  console.log(id);
  let contact = await API_GetContact(id);
  if (contact !== null) renderContactForm(contact);
  else renderError("Favori introuvable!");
}
async function renderDeleteContactForm(id) {
  showWaitingGif();
  $("#createContact").hide();
  $("#abort").show();
  $("#actionTitle").text("Retrait");
  console.log(id);
  let contact = await API_GetContact(id);
  console.log(contact);
  eraseContent();
  if (contact !== null) {
    $("#content").append(`
        <div class="contactdeleteForm">
            <h4>Effacer le favori suivant?</h4>
            <br>
            <div class="contactRow" contact_id=${contact.Id}">
                <div class="contactContainer">
                    <div class="contactLayout">
                        <div class="contactName">${contact.Title}</div>
                        <div class="contactPhone">${contact.Url}</div>
                        <div class="contactEmail">${contact.Category}</div>
                    </div>
                </div>  
            </div>   
            <br>
            <input type="button" value="Effacer" id="deleteContact" class="btn btn-primary">
            <input type="button" value="Annuler" id="cancel" class="btn btn-secondary">
        </div>    
        `);
    $("#deleteContact").on("click", async function () {
      showWaitingGif();
      let result = await API_DeleteContact(contact.Id);
      if (result) renderBookmarks();
      else renderError("Une erreur est survenue!");
    });
    $("#cancel").on("click", function () {
      renderBookmarks();
    });
  } else {
    renderError("Favori introuvable!");
  }
}
function newContact() {
  let fav = {};
  fav.Id = 0;
  fav.Title = "";
  fav.Url = "";
  fav.Category = "";
  return fav;
}

function renderContactForm(fav = null) {
  console.log("hallo");

  $("#createContact").hide();
  $("#abort").show();
  eraseContent();
  let create = fav == null;
  if (create) fav = newContact();
  $("#actionTitle").text(create ? "Création" : "Modification");
  $("#content").append(`
        <form class="form" id="favForm">
            <img 
            style="background-image: url('https://cdn.glitch.global/728b0641-65b1-4d60-9177-92ff2cc2f95c/bookmark_logo%20(1).png?v=1695065504505');"
            class="big-favicon" id="favLogo" alt="" title="Gestionnaire de favoris"><br>

            <input type="hidden" name="Id" value="${fav}"/>

            <label for="Title" class="form-label">Titre </label>
            <input 
                class="form-control Alpha"
                name="Title" 
                id="Title" 
                placeholder="Titre"
                required
                RequireMessage="Veuillez entrer un titre"
                InvalidMessage="Le titre comporte un caractère illégal" 
                value="${fav.Title}"
            />
            <label for="Url" class="form-label">Url </label>
            <input
                class="form-control URL"
                name="URL"
                id="URL"
                placeholder="https://"
                required
                RequireMessage="Veuillez entrer l'url d'un site favori" 
                InvalidMessage="Veuillez entrer un url valide"
                value="${fav.Url}" 
            />
            <label for="Category" class="form-label">Catégorie </label>
            <input 
                class="form-control Category"
                name="Category"
                id="Category"
                placeholder="Categorie"
                required
                RequireMessage="Veuillez entrer votre courriel" 
                InvalidMessage="Veuillez entrer un courriel valide"
                value="${fav.Category}"
                
            />
            <hr>
            <input type="submit" value="Enregistrer" id="saveContact" class="btn btn-primary">
            <input type="button" value="Annuler" id="cancel" class="btn btn-secondary">
        </form>
    `);
  // Typing
  document.getElementById("URL").addEventListener("input", function () {
    let userInput = this.value;
    document.getElementById(
      "favLogo"
    ).style.backgroundImage = `url('http://www.google.com/s2/favicons?sz=64&domain=${userInput}')`;
  });

  initFormValidation();
  $("#favForm").on("submit", async function (event) {
    event.preventDefault();
    let contact = getFormData($("#favForm"));
    contact.Id = parseInt(contact.Id);
    showWaitingGif();
    let result = await API_SaveBookmark(contact, create);
    if (result) renderBookmarks();
    else renderError("Une erreur est survenue!");
  });
  $("#cancel").on("click", function () {
    renderBookmarks();
  });
}

function getFormData($form) {
  const removeTag = new RegExp("(<[a-zA-Z0-9]+>)|(</[a-zA-Z0-9]+>)", "g");
  var jsonObject = {};
  $.each($form.serializeArray(), (index, control) => {
    jsonObject[control.name] = control.value.replace(removeTag, "");
  });
  return jsonObject;
}

function renderContact(contact) {
  return $(`
     <div class="contactRow" contact_id=${contact.Id}">
        <div class="contactContainer">
            <div class="contactLayout">
                <span class="contactName">  
                
                <img class="big-favicon" 
                  style="background-image: url('http://www.google.com/s2/favicons?sz=64&domain=${contact.Url}');">${contact.Title}</span>
                
                <a href=${contact.Url}>${contact.Category}</a>
            </div>
            <div class="contactCommandPanel">
                <span class="editCmd cmdIcon fa fa-pencil" editContactId="${contact.Id}" title="Modifier ${contact.Title}"></span>
                <span class="deleteCmd cmdIcon fa fa-trash" deleteContactId="${contact.Id}" title="Effacer ${contact.Title}"></span>
            </div>
        </div>
    </div>           
    `);
}
