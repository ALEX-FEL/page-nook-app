import { useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "@/components/Breadcrumb";
import { libraryItems as initialItems, categories as initialCategories, LibraryItem, Category } from "@/data/library-data";
import { Plus, Pencil, Trash2, Eye, BookOpen, FolderTree, ChevronRight, X } from "lucide-react";

const AdminDashboard = () => {
  const [books, setBooks] = useState<LibraryItem[]>(initialItems);
  const [cats, setCats] = useState<Category[]>(initialCategories);
  const [activeTab, setActiveTab] = useState<"books" | "categories">("books");
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<LibraryItem | null>(null);
  const [viewingBook, setViewingBook] = useState<LibraryItem | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formAuthors, setFormAuthors] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");

  const openAddForm = () => {
    setEditingBook(null);
    setFormTitle("");
    setFormDescription("");
    setFormAuthors("");
    setFormUrl("");
    setFormCategoryId("");
    setShowForm(true);
  };

  const openEditForm = (book: LibraryItem) => {
    setEditingBook(book);
    setFormTitle(book.title);
    setFormDescription(book.description);
    setFormAuthors(book.authors);
    setFormUrl(book.url);
    setFormCategoryId(book.categoryId);
    setShowForm(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBook) {
      setBooks(books.map(b => b.id === editingBook.id ? {
        ...b, title: formTitle, description: formDescription, authors: formAuthors, url: formUrl, categoryId: formCategoryId
      } : b));
    } else {
      setBooks([...books, {
        id: `book_${Date.now()}`,
        title: formTitle,
        description: formDescription,
        authors: formAuthors,
        url: formUrl,
        categoryId: formCategoryId,
      }]);
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Supprimer ce livre ?")) {
      setBooks(books.filter(b => b.id !== id));
    }
  };

  // Category helpers
  const flattenCategories = (cats: Category[]): { id: string; name: string }[] => {
    let result: { id: string; name: string }[] = [];
    for (const c of cats) {
      result.push({ id: c.id, name: c.name });
      if (c.children) result = result.concat(flattenCategories(c.children));
    }
    return result;
  };

  const getCategoryName = (id: string) => flattenCategories(cats).find(c => c.id === id)?.name || "—";

  // Category CRUD
  const handleAddMainCategory = () => {
    const name = prompt("Nom de la catégorie principale :");
    if (!name) return;
    setCats([...cats, { id: `main_${Date.now()}`, name, count: 0 }]);
  };

  const handleAddSubCategory = (parentId: string) => {
    const name = prompt("Nom de la sous-catégorie :");
    if (!name) return;
    const addTo = (list: Category[]): Category[] =>
      list.map(c => {
        if (c.id === parentId) {
          return { ...c, children: [...(c.children || []), { id: `sub_${Date.now()}`, name, count: 0 }] };
        }
        return { ...c, children: c.children ? addTo(c.children) : undefined };
      });
    setCats(addTo(cats));
  };

  const handleEditCategory = (id: string) => {
    const name = prompt("Nouveau nom :");
    if (!name) return;
    const editIn = (list: Category[]): Category[] =>
      list.map(c => {
        if (c.id === id) return { ...c, name };
        return { ...c, children: c.children ? editIn(c.children) : undefined };
      });
    setCats(editIn(cats));
  };

  const handleDeleteCategory = (id: string) => {
    if (!confirm("Supprimer cette catégorie ?")) return;
    const removeById = (list: Category[]): Category[] =>
      list.filter(c => c.id !== id).map(c => ({
        ...c, children: c.children ? removeById(c.children) : undefined,
      }));
    setCats(removeById(cats));
  };

  const renderCategoryTree = (items: Category[], depth = 0) => (
    <ul className={depth > 0 ? "ml-6 border-l border-border pl-4" : ""}>
      {items.map(cat => (
        <li key={cat.id} className="my-2">
          <div className="flex items-center gap-3 group">
            <FolderTree className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-foreground text-sm font-medium flex-1">{cat.name} ({cat.count})</span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleAddSubCategory(cat.id)} className="text-link text-xs hover:underline px-1">+ sous-cat.</button>
              <button onClick={() => handleEditCategory(cat.id)} className="p-1 hover:bg-muted rounded">
                <Pencil className="w-3 h-3 text-muted-foreground" />
              </button>
              <button onClick={() => handleDeleteCategory(cat.id)} className="p-1 hover:bg-destructive/10 rounded">
                <Trash2 className="w-3 h-3 text-destructive" />
              </button>
            </div>
          </div>
          {cat.children && renderCategoryTree(cat.children, depth + 1)}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-heading mb-1">Exabis Library</h1>
      <Breadcrumb />

      {/* Tabs */}
      <div className="flex gap-0 border-b border-border mb-6">
        <button
          onClick={() => setActiveTab("books")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "books"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="w-4 h-4" /> Livres ({books.length})
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "categories"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FolderTree className="w-4 h-4" /> Catégories ({flattenCategories(cats).length})
        </button>
      </div>

      {/* Books Tab */}
      {activeTab === "books" && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Liste des livres</h2>
            <button
              onClick={openAddForm}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm hover:opacity-90 rounded"
            >
              <Plus className="w-4 h-4" /> Ajouter un livre
            </button>
          </div>

          <div className="border border-border rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary border-b border-border">
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Titre</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Auteurs</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Catégorie</th>
                  <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map(book => (
                  <tr key={book.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{book.title}</div>
                      {book.description && (
                        <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{book.description}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{book.authors || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{getCategoryName(book.categoryId)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewingBook(book)} className="p-1.5 hover:bg-muted rounded" title="Voir">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button onClick={() => openEditForm(book)} className="p-1.5 hover:bg-muted rounded" title="Modifier">
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button onClick={() => handleDelete(book.id)} className="p-1.5 hover:bg-destructive/10 rounded" title="Supprimer">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {books.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                      Aucun livre. Cliquez sur "Ajouter un livre" pour commencer.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Gestion des catégories</h2>
            <button
              onClick={handleAddMainCategory}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm hover:opacity-90 rounded"
            >
              <Plus className="w-4 h-4" /> Ajouter une catégorie
            </button>
          </div>

          <div className="border border-border rounded p-4">
            {renderCategoryTree(cats)}
          </div>
        </>
      )}

      {/* Book Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground">{editingBook ? "Modifier le livre" : "Ajouter un livre"}</h3>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-muted rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-label mb-1">Titre <span className="text-destructive">*</span></label>
                <input required value={formTitle} onChange={e => setFormTitle(e.target.value)}
                  className="w-full border border-input px-3 py-2 text-sm rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-label mb-1">Description</label>
                <textarea value={formDescription} onChange={e => setFormDescription(e.target.value)}
                  className="w-full border border-input px-3 py-2 text-sm rounded h-24 resize-y" />
              </div>
              <div>
                <label className="block text-sm font-medium text-label mb-1">Auteurs</label>
                <input value={formAuthors} onChange={e => setFormAuthors(e.target.value)}
                  className="w-full border border-input px-3 py-2 text-sm rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-label mb-1">URL</label>
                <input value={formUrl} onChange={e => setFormUrl(e.target.value)}
                  className="w-full border border-input px-3 py-2 text-sm rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-label mb-1">Catégorie</label>
                <select value={formCategoryId} onChange={e => setFormCategoryId(e.target.value)}
                  className="w-full border border-input px-3 py-2 text-sm rounded">
                  <option value="">— Sélectionner —</option>
                  {flattenCategories(cats).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm border border-input rounded hover:bg-muted">Annuler</button>
                <button type="submit"
                  className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded hover:opacity-90">
                  {editingBook ? "Enregistrer" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Book Modal */}
      {viewingBook && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded w-full max-w-lg">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Détails du livre</h3>
              <button onClick={() => setViewingBook(null)} className="p-1 hover:bg-muted rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 text-sm">
              <div><span className="font-medium text-label">Titre :</span> <span className="text-foreground">{viewingBook.title}</span></div>
              <div><span className="font-medium text-label">Description :</span> <span className="text-foreground">{viewingBook.description || "—"}</span></div>
              <div><span className="font-medium text-label">Auteurs :</span> <span className="text-foreground">{viewingBook.authors || "—"}</span></div>
              <div><span className="font-medium text-label">Catégorie :</span> <span className="text-foreground">{getCategoryName(viewingBook.categoryId)}</span></div>
              <div>
                <span className="font-medium text-label">URL :</span>{" "}
                <a href={viewingBook.url} target="_blank" rel="noopener noreferrer" className="text-link hover:underline">{viewingBook.url}</a>
              </div>
            </div>
            <div className="flex justify-end px-5 py-4 border-t border-border">
              <button onClick={() => { setViewingBook(null); openEditForm(viewingBook); }}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded hover:opacity-90">
                <Pencil className="w-3 h-3" /> Modifier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
