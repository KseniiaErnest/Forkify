import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

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


////////////////////////////////////////////////
const init = function () {
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  
};

init();
