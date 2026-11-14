import { useEffect, useState } from "react";
import { useGetUserID } from "../hook/useGetUserID";
import { SearchBar } from "../components/SearchBar";
import { RecipeDetailsModal } from "../components/RecipeDetailsModal";
import "./SavedRecipes.css";

export const Favourites = () => {
  const [recipes, setRecipes] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const recipesPerPage = 3;

  const userID = useGetUserID();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        if (!userID) {
          window.location.href = "/";
        }
        const response = await fetch(`/api/recipe/get-recipe/${userID}`);
        if (response.ok) {
          const data = await response.json();
          setRecipes(data.data);
        } else {
          console.error("Failed to fetch data.");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecipes();
  }, [userID]);

  // Function to filter recipes based on keyword
  // const filteredRecipes = recipes.filter((recipe) => recipe.isLiked);

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.isLiked &&
      (recipe.category.toLowerCase().includes(keyword.toLowerCase()) ||
        recipe.name.toLowerCase().includes(keyword.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  const startIndex = (currentPage - 1) * recipesPerPage;
  const endIndex = startIndex + recipesPerPage;
  const recipesToDisplay = filteredRecipes.slice(startIndex, endIndex);

  return (
    <div className="recipe-container">
      <h1 className="recipe-title">- Your favorite recipes -</h1>
      <div className="col-md-12 mt-2">
        <p className="search-info-text" style={{color: 'black'}}>
          Search recipes by their name or cuisine
        </p>
      </div>
      <div className="container py-4 recipe-grid">
        <div className="row search-container">
          <SearchBar
            keyword={keyword}
            setKeyword={setKeyword}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      <div className="recipe-grid">
        {recipesToDisplay.length > 0 ? (
          recipesToDisplay.map((recipe) => (
            <div key={recipe._id} className="recipe-card">
              <div className="card">
                <button
                  type="button"
                  className="recipe-card-open"
                  onClick={() => setSelectedRecipe(recipe)}
                  aria-label={`View ${recipe.name} recipe`}
                >
                  <div className="card-img-container">
                    <img
                      src={recipe.imageUrl}
                      className="card-img-top"
                      alt=""
                    />
                  </div>
                  <div className="recipe-card-summary">
                    <div className="recipe-card-heading">
                      <h2 className="card-title">{recipe.name}</h2>
                      <span className="recipe-card-arrow" aria-hidden="true">
                        &rarr;
                      </span>
                    </div>
                    <div className="recipe-card-meta">
                      {recipe.category && <span>{recipe.category}</span>}
                      {recipe.cookingTime && (
                        <span>{recipe.cookingTime} mins</span>
                      )}
                    </div>
                    <span className="recipe-card-hint">View full recipe</span>
                  </div>
                </button>
                <div className="card-body">
                  <span className="recipe-card-ingredient-count">
                    {recipe.ingredients.length} ingredients
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-recipes">
            No recipes found. Create a new recipe today!
          </p>
        )}
      </div>
      {/* Pagination controls */}
      <nav>
        <ul className="pagination justify-content-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <li
              key={index}
              className={`page-item ${
                currentPage === index + 1 ? "active" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <RecipeDetailsModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />
    </div>
  );
};
