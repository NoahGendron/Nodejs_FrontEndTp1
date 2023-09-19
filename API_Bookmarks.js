const API_URL = "https://honored-blush-crabapple.glitch.me/api/favoris"; //"http://localhost:5000/api/contacts";
//const API_URL = "https://api-server-5.glitch.me/api/bookmarks"; //"http://localhost:5000/api/contacts";




function API_GetContacts() {
  return new Promise((resolve) => {
    $.ajax({
      url: API_URL,
      success: (contacts) => {
        resolve(contacts);
      },
      error: (xhr) => {
        console.log(xhr);
        resolve(null);
      },
    });
  });
}
function API_GetContact(favId) {
  return new Promise((resolve) => {
    $.ajax({
      url: API_URL + "/" + favId,
      success: (fav) => {
        resolve(fav);
      },
      error: () => {
        resolve(null);
      },
    });
  });
}
function API_SaveBookmark(fav, create) {
  return new Promise((resolve) => {
    $.ajax({
      url: API_URL,
      type: create ? "POST" : "PUT",
      contentType: "application/json",
      data: JSON.stringify(fav),
      success: (/*data*/) => {
        resolve(true);
      },
      error: (/*xhr*/) => {
        resolve(false /*xhr.status*/);
      },
    });
  });
}
function API_DeleteContact(id) {
  return new Promise((resolve) => {
    $.ajax({
      url: API_URL + "/" + id,
      type: "DELETE",
      success: () => {
        resolve(true);
      },
      error: (/*xhr*/) => {
        resolve(false /*xhr.status*/);
      },
    });
  });
}
