import { useEffect } from "react";
import PropTypes from "prop-types";

export const RecipeDetailsModal = ({ recipe, onClose }) => {
  useEffect(() => {
    if (!recipe) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [recipe, onClose]);

  if (!recipe) {
    return null;
  }

  return (
    <div
      className="recipe-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="recipe-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-modal-title"
      >
        <button
          type="button"
          className="recipe-modal-close"
          onClick={onClose}
          aria-label="Close recipe details"
        >
          &times;
        </button>
        {recipe.imageUrl && (
          <img
            className="recipe-modal-image"
            src={recipe.imageUrl}
            alt={recipe.name}
          />
        )}
        <div className="recipe-modal-content">
          <p className="recipe-modal-eyebrow">FROM YOUR RECIPE BOX</p>
          <h2 id="recipe-modal-title">{recipe.name}</h2>
          <div className="recipe-modal-meta">
            {recipe.category && <span>{recipe.category}</span>}
            {recipe.cookingTime && (
              <span>{recipe.cookingTime} mins</span>
            )}
          </div>
          <div className="recipe-modal-section">
            <h3>Ingredients</h3>
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={`${index}-${ingredient}`}>{ingredient}</li>
              ))}
            </ul>
          </div>
          <div className="recipe-modal-section">
            <h3>Instructions</h3>
            <p>{recipe.instructions}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

RecipeDetailsModal.propTypes = {
  recipe: PropTypes.shape({
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    category: PropTypes.string,
    cookingTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
    instructions: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};
