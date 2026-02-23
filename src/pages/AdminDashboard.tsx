import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { libraryItems as initialItems, categories as initialCategories, LibraryItem, Category } from "@/data/library-data";
import { Plus, Pencil, Trash2, Eye, BookOpen, FolderTree, X, ChevronDown, ChevronRight, Table, Bold, Italic, List, ListOrdered, Link, Unlink, Image, ArrowDown, Search, Download } from "lucide-react";

const AdminDashboard = () => {
  const [books, setBooks] = useState<LibraryItem[]>(initialItems);
  const [cats, setCats] = useState<Category[]>(initialCategories);
  const [activeTab, setActiveTab] = useState<"books" | "categories">("books");
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<LibraryItem | null>(null);
  const [viewingBook, setViewingBook] = useState<LibraryItem | null>(null);
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  // Book form state
  const [formName, setFormName] = useState("");
  const [formSource, setFormSource] = useState("");
  const [formLinkTitle, setFormLinkTitle] = useState("");
  const [formLink, setFormLink] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formAuthors, setFormAuthors] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [contentExpanded, setContentExpanded] = useState(true);

  // Category form state
  const [showCatForm, setShowCatForm] = useState(false);
  const [editingCat, setEditingCat] = useState<{ id: string; name: string } | null>(null);
  const [catFormName, setCatFormName] = useState("");
  const [catFormParentId, setCatFormParentId] = useState<string | null>(null);

  const openAddForm = () => {
    setEditingBook(null);
    setFormName("");
    setFormSource("");
    setFormLinkTitle("");
    setFormLink("");
    setFormContent("");
    setFormAuthors("");
    setFormCategoryId("");
    setContentExpanded(true);
    setShowForm(true);
  };

  const openEditForm = (book: LibraryItem) => {
    setEditingBook(book);
    setFormName(book.title);
    setFormSource(book.source);
    setFormLinkTitle(book.linkTitle);
    setFormLink(book.url);
    setFormContent(book.content);
    setFormAuthors(book.authors);
    setFormCategoryId(book.categoryId);
    setContentExpanded(true);
    setShowForm(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBook) {
      setBooks(books.map(b => b.id === editingBook.id ? {
        ...b, title: formName, source: formSource, linkTitle: formLinkTitle, url: formLink, content: formContent, authors: formAuthors, categoryId: formCategoryId
      } : b));
    } else {
      setBooks([...books, {
        id: `book_${Date.now()}`,
        title: formName,
        source: formSource,
        linkTitle: formLinkTitle,
        url: formLink,
        content: formContent,
        authors: formAuthors,
        categoryId: formCategoryId,
        description: "",
      }]);
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Supprimer ce livre ?")) {
      setBooks(books.filter(b => b.id !== id));
    }
  };

  const handlePreview = (url: string) => {
    setPreviewFile(url);
  };

  const handleDownload = (url: string, title: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = title;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
  const openAddMainCategory = () => {
    setEditingCat(null);
    setCatFormName("");
    setCatFormParentId(null);
    setShowCatForm(true);
  };

  const openAddSubCategory = (parentId: string) => {
    setEditingCat(null);
    setCatFormName("");
    setCatFormParentId(parentId);
    setShowCatForm(true);
  };

  const openEditCategory = (id: string, name: string) => {
    setEditingCat({ id, name });
    setCatFormName(name);
    setCatFormParentId(null);
    setShowCatForm(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catFormName.trim()) return;

    if (editingCat) {
      const editIn = (list: Category[]): Category[] =>
        list.map(c => {
          if (c.id === editingCat.id) return { ...c, name: catFormName };
          return { ...c, children: c.children ? editIn(c.children) : undefined };
        });
      setCats(editIn(cats));
    } else if (catFormParentId) {
      const addTo = (list: Category[]): Category[] =>
        list.map(c => {
          if (c.id === catFormParentId) {
            return { ...c, children: [...(c.children || []), { id: `sub_${Date.now()}`, name: catFormName, count: 0 }] };
          }
          return { ...c, children: c.children ? addTo(c.children) : undefined };
        });
      setCats(addTo(cats));
    } else {
      setCats([...cats, { id: `main_${Date.now()}`, name: catFormName, count: 0 }]);
    }
    setShowCatForm(false);
  };

  const handleDeleteCategory = (id: string) => {
    if (!confirm("Supprimer cette catégorie ?")) return;
    const removeById = (list: Category[]): Category[] =>
      list.filter(c => c.id !== id).map(c => ({
        ...c, children: c.children ? removeById(c.children) : undefined,
      }));
    setCats(removeById(cats));
  };

  // Categories tree like CategoriesPage
  const renderCategoryTree = (items: Category[], depth = 0) => (
    <ul className={depth > 0 ? "ml-6" : ""}>
      {items.map(cat => (
        <li key={cat.id} className="my-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-foreground">
              {depth > 0 && "• "}
              {cat.name} ({cat.count})
            </span>
            <button onClick={() => openEditCategory(cat.id, cat.name)} className="text-link text-xs hover:underline">edit</button>
            <span className="text-muted-foreground">|</span>
            <button onClick={() => handleDeleteCategory(cat.id)} className="text-link text-xs hover:underline">delete</button>
          </div>
          <button onClick={() => openAddSubCategory(cat.id)} className="text-link text-xs ml-4 hover:underline">
            add category here
          </button>
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
            <button onClick={openAddForm} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm hover:opacity-90 rounded">
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
                        {book.url && (
                          <>
                            <button onClick={() => handlePreview(book.url)} className="p-1.5 hover:bg-muted rounded" title="Prévisualiser">
                              <Search className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button onClick={() => handleDownload(book.url, book.title)} className="p-1.5 hover:bg-muted rounded" title="Télécharger">
                              <Download className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </>
                        )}
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
          </div>

          <button onClick={openAddMainCategory} className="text-link text-sm hover:underline mb-4 block">
            add main category
          </button>

          {renderCategoryTree(cats)}

          {/* Category Form Modal */}
          {showCatForm && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
              <div className="bg-background border border-border rounded w-full max-w-md">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">
                    {editingCat ? "Modifier la catégorie" : catFormParentId ? "Ajouter une sous-catégorie" : "Ajouter une catégorie principale"}
                  </h3>
                  <button onClick={() => setShowCatForm(false)} className="p-1 hover:bg-muted rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleSaveCategory} className="p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-label mb-1">Nom <span className="text-destructive">*</span></label>
                    <input required value={catFormName} onChange={e => setCatFormName(e.target.value)}
                      className="w-full border border-input px-3 py-2 text-sm rounded" />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setShowCatForm(false)}
                      className="px-4 py-2 text-sm border border-input rounded hover:bg-muted">Annuler</button>
                    <button type="submit"
                      className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded hover:opacity-90">
                      {editingCat ? "Enregistrer" : "Ajouter"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* Book Form Modal — AdminForm style */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground">{editingBook ? "Modifier le livre" : "Ajouter un livre"}</h3>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-muted rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              {/* Name */}
              <div className="flex items-center gap-4">
                <label className="w-32 text-right text-label text-sm font-medium shrink-0">
                  Name<span className="text-destructive">*</span>
                </label>
                <input required value={formName} onChange={e => setFormName(e.target.value)}
                  className="flex-1 border border-input px-2 py-1 text-sm" />
              </div>

              {/* Source */}
              <div className="flex items-center gap-4">
                <label className="w-32 text-right text-label text-sm font-medium shrink-0">Source</label>
                <input value={formSource} onChange={e => setFormSource(e.target.value)}
                  className="flex-1 border border-input px-2 py-1 text-sm" />
              </div>

              {/* Catégorie */}
              <div className="flex items-center gap-4">
                <label className="w-32 text-right text-label text-sm font-medium shrink-0">Catégorie</label>
                <select value={formCategoryId} onChange={e => setFormCategoryId(e.target.value)}
                  className="flex-1 border border-input px-2 py-1 text-sm">
                  <option value="">— Sélectionner —</option>
                  {flattenCategories(cats).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Content Section */}
              <div className="border-t border-border pt-4">
                <button type="button" onClick={() => setContentExpanded(!contentExpanded)}
                  className="flex items-center gap-1 text-breadcrumb font-medium text-sm mb-4 hover:underline">
                  {contentExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  Content
                </button>

                {contentExpanded && (
                  <div className="space-y-4">
                    {/* Link Titel */}
                    <div className="flex items-center gap-4">
                      <label className="w-32 text-right text-label text-sm font-medium shrink-0">Link Titel</label>
                      <input value={formLinkTitle} onChange={e => setFormLinkTitle(e.target.value)}
                        className="flex-1 border border-input px-2 py-1 text-sm" />
                    </div>

                    {/* Link */}
                    <div className="flex items-center gap-4">
                      <label className="w-32 text-right text-label text-sm font-medium shrink-0">Link</label>
                      <input value={formLink} onChange={e => setFormLink(e.target.value)}
                        className="flex-1 border border-input px-2 py-1 text-sm" />
                    </div>

                    {/* File */}
                    <div className="flex items-start gap-4">
                      <label className="w-32 text-right text-label text-sm font-medium pt-1 shrink-0">File</label>
                      <div className="flex-1">
                        <p className="text-xs text-link text-right mb-1">
                          Maximum size for new files: Unlimited, maximum attachments: 1
                        </p>
                        <div className="border border-input">
                          <div className="flex items-center justify-between bg-secondary px-2 py-1 border-b border-input">
                            <button type="button" className="text-muted-foreground"><Image className="w-4 h-4" /></button>
                            <div className="flex gap-1">
                              <button type="button" className="p-1 border border-input bg-background text-xs">⊞</button>
                              <button type="button" className="p-1 border border-input bg-background text-xs">☰</button>
                              <button type="button" className="p-1 border border-input bg-background text-xs">≡</button>
                            </div>
                          </div>
                          <div className="px-2 py-1 text-sm text-link flex items-center gap-1">
                            <ChevronRight className="w-3 h-3" /> 📁 Files
                          </div>
                          <div className="border-2 border-dashed border-input m-2 p-8 flex flex-col items-center justify-center text-center">
                            <ArrowDown className="w-10 h-10 text-primary mb-2" />
                            <p className="text-sm text-muted-foreground">You can drag and drop files here to add them.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content editor */}
                    <div className="flex items-start gap-4">
                      <label className="w-32 text-right text-label text-sm font-medium pt-1 shrink-0">Content</label>
                      <div className="flex-1">
                        <div className="border border-input">
                          <div className="flex items-center gap-1 bg-secondary px-2 py-1 border-b border-input">
                            <button type="button" className="p-1 hover:bg-muted"><Table className="w-4 h-4" /></button>
                            <select className="text-xs border border-input px-1 py-0.5">
                              <option>A1</option><option>A2</option><option>A3</option>
                            </select>
                            <button type="button" className="p-1 hover:bg-muted font-bold text-sm">B</button>
                            <button type="button" className="p-1 hover:bg-muted italic text-sm">I</button>
                            <button type="button" className="p-1 hover:bg-muted"><List className="w-4 h-4" /></button>
                            <button type="button" className="p-1 hover:bg-muted"><ListOrdered className="w-4 h-4" /></button>
                            <button type="button" className="p-1 hover:bg-muted"><Link className="w-4 h-4" /></button>
                            <button type="button" className="p-1 hover:bg-muted"><Unlink className="w-4 h-4" /></button>
                            <button type="button" className="p-1 hover:bg-muted"><Image className="w-4 h-4" /></button>
                          </div>
                          <textarea value={formContent} onChange={e => setFormContent(e.target.value)}
                            className="w-full h-48 p-2 text-sm resize-y outline-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Authors */}
              <div className="flex items-center gap-4">
                <label className="w-32 text-right text-label text-sm font-medium shrink-0">Authors</label>
                <input value={formAuthors} onChange={e => setFormAuthors(e.target.value)}
                  className="flex-1 border border-input px-2 py-1 text-sm" />
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
              <div><span className="font-medium text-label">Source :</span> <span className="text-foreground">{viewingBook.source || "—"}</span></div>
              <div><span className="font-medium text-label">Auteurs :</span> <span className="text-foreground">{viewingBook.authors || "—"}</span></div>
              <div><span className="font-medium text-label">Catégorie :</span> <span className="text-foreground">{getCategoryName(viewingBook.categoryId)}</span></div>
              <div>
                <span className="font-medium text-label">Link :</span>{" "}
                <a href={viewingBook.url} target="_blank" rel="noopener noreferrer" className="text-link hover:underline">{viewingBook.url || "—"}</a>
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

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Prévisualisation du fichier</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(previewFile, 'fichier')}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:opacity-90"
                >
                  <Download className="w-4 h-4" /> Télécharger
                </button>
                <button onClick={() => setPreviewFile(null)} className="p-1 hover:bg-muted rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {previewFile.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) ? (
                <img src={previewFile} alt="Preview" className="max-w-full h-auto mx-auto" />
              ) : previewFile.match(/\.(pdf)$/i) ? (
                <iframe src={previewFile} className="w-full h-full min-h-[600px] border-0" title="PDF Preview" />
              ) : previewFile.match(/\.(mp4|webm|ogg)$/i) ? (
                <video controls className="max-w-full h-auto mx-auto">
                  <source src={previewFile} />
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              ) : previewFile.match(/\.(mp3|wav|ogg)$/i) ? (
                <audio controls className="w-full">
                  <source src={previewFile} />
                  Votre navigateur ne supporte pas la lecture audio.
                </audio>
              ) : previewFile.match(/\.(txt|md|csv)$/i) ? (
                <iframe src={previewFile} className="w-full h-full min-h-[600px] border border-border rounded" title="Text Preview" />
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <p className="text-muted-foreground mb-4">Prévisualisation non disponible pour ce type de fichier.</p>
                  <a
                    href={previewFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded hover:opacity-90"
                  >
                    <Download className="w-4 h-4" /> Télécharger le fichier
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
