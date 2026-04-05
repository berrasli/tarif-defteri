import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [image, setImage] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [editId, setEditId] = useState(null);

  const apiUrl = "http://127.0.0.1:5000/recipes";

  function getRecipes() {
    axios
      .get(apiUrl)
      .then((response) => {
        setRecipes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getRecipes();
  }, []);

  function clearForm() {
    setTitle("");
    setCategory("");
    setIngredients("");
    setSteps("");
    setImage(null);
    setEditId(null);
  }

  function addOrUpdateRecipe(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("ingredients", ingredients);
    formData.append("steps", steps);

    if (image) {
      formData.append("image", image);
    }

    if (editId === null) {
      axios
        .post(apiUrl, formData)
        .then(() => {
          clearForm();
          getRecipes();
        })
        .catch((error) => {
          console.log(error.response ? error.response.data : error.message);
          alert("Tarif eklenemedi");
        });
    } else {
      axios
        .put(`http://127.0.0.1:5000/recipes/${editId}`, formData)
        .then(() => {
          clearForm();
          getRecipes();
        })
        .catch((error) => {
          console.log(error.response ? error.response.data : error.message);
          alert("Tarif güncellenemedi");
        });
    }
  }

  function deleteRecipe(id) {
    axios
      .delete(`http://127.0.0.1:5000/recipes/${id}`)
      .then(() => {
        if (editId === id) {
          clearForm();
        }
        getRecipes();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function editRecipe(recipe) {
    setEditId(recipe.id);
    setTitle(recipe.title);
    setCategory(recipe.category);
    setIngredients(recipe.ingredients);
    setSteps(recipe.steps);
    setImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const categories = ["Tümü", ...new Set(recipes.map((recipe) => recipe.category))];

  const filteredRecipes = recipes.filter((recipe) => {
    if (selectedCategory === "Tümü") {
      return true;
    }
    return recipe.category === selectedCategory;
  });

  return (
    <div className="page">
      <header className="hero">
  <div className="hero-text">
    <h1>Tarif Defteri</h1>
  </div>
</header>

      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-card">
            <h3>Kategoriler</h3>
            <div className="category-list">
              {categories.map((cat, index) => (
                <button
                  key={index}
                  className={
                    selectedCategory === cat
                      ? "category-item active-category"
                      : "category-item"
                  }
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="content">
          <section className="form-card">
            <h2>{editId === null ? "Yeni Tarif Ekle" : "Tarifi Düzenle"}</h2>

            <form className="recipe-form" onSubmit={addOrUpdateRecipe}>
              <input
                type="text"
                placeholder="Tarif adı"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                type="text"
                placeholder="Kategori"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />

              <textarea
                placeholder="Malzemeler"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              ></textarea>

              <textarea
                placeholder="Yapılış adımları"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
              ></textarea>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />

              <div className="form-buttons">
                <button type="submit">
                  {editId === null ? "Tarif Ekle" : "Tarifi Güncelle"}
                </button>

                {editId !== null && (
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={clearForm}
                  >
                    Vazgeç
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="recipes-grid">
            {filteredRecipes.length === 0 ? (
              <div className="empty-box">Bu kategoriye ait tarif bulunamadı.</div>
            ) : (
              filteredRecipes.map((recipe) => (
                <div className="recipe-card" key={recipe.id}>
                  {recipe.image && (
                    <img
                      src={`http://127.0.0.1:5000/uploads/${recipe.image}`}
                      alt={recipe.title}
                      className="recipe-image"
                    />
                  )}

                  <div className="recipe-content">
                    <h3>{recipe.title}</h3>
                    <span className="category-badge">{recipe.category}</span>

                    <p>
                      <strong>Malzemeler:</strong> {recipe.ingredients}
                    </p>
                    <p>
                      <strong>Yapılış:</strong> {recipe.steps}
                    </p>

                    <div className="card-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => editRecipe(recipe)}
                      >
                        Düzenle
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteRecipe(recipe.id)}
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;