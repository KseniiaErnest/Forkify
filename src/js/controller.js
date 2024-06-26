import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './config.js';

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

if (module.hot) {
  module.hot.accept();
}

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    // 1) Loading recipe
    await model.loadRecipe(id);

    // 2) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

/////////////////////////////////////////////
const controlSearchResults = async function() {
  try{
    resultsView.renderSpinner();
    // Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // Load search results
await model.loadSearchResult(query);

// Render results
// resultsView.render(model.state.search.results);
resultsView.render(model.getSearchResultsPage());

// Render the initial pagination buttons
paginationView.render(model.state.search);

  } catch(err) {
    console.log(err);
  }
};


// Page button controller
const controlPagination = function(goToPage) {
// 1) Render NEW results
resultsView.render(model.getSearchResultsPage(goToPage));

// 2) Render NEW pagination buttons
paginationView.render(model.state.search);
};

const controlServings = function(newServings) {
// Update the recipe's servingd (in state)
model.updateServings(newServings);

// Update the recipe view
// recipeView.render(model.state.recipe);
recipeView.update(model.state.recipe);
};

const controlAddBookmark = function() {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
 
  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe) {
  try {
    // Spinner
    addRecipeView.renderSpinner();
// Upload the new recipe data
await model.uploadRecipe(newRecipe);

// Render recipe
recipeView.render(model.state.recipe);


// Success message
addRecipeView.renderMessage();

// Render bookmark view
bookmarksView.render(model.state.bookmarks);

// Change ID in URL
window.history.pushState(null, '', `#${model.state.recipe.id}`);

// Close form window
setTimeout(function() {
  addRecipeView.toggleWindow();
}, MODAL_CLOSE_SEC * 1000);

  } catch(err) {
console.error(err);
addRecipeView.renderError(err.message);
  }

}


////////////////////////////////////////////////
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  
};

init();
