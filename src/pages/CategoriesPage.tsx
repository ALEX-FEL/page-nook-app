import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { categories as initialCategories, Category } from "@/data/library-data";

const CategoriesPage = () => {
  const [cats, setCats] = useState<Category[]>(initialCategories);

  const handleDelete = (id: string) => {
    const removeById = (list: Category[]): Category[] =>
      list.filter((c) => c.id !== id).map((c) => ({
        ...c,
        children: c.children ? removeById(c.children) : undefined,
      }));
    setCats(removeById(cats));
  };

  const handleAddSub = (parentId: string) => {
    const name = prompt("Category name:");
    if (!name) return;
    const addTo = (list: Category[]): Category[] =>
      list.map((c) => {
        if (c.id === parentId) {
          return {
            ...c,
            children: [
              ...(c.children || []),
              { id: `${parentId}_${Date.now()}`, name, count: 0 },
            ],
          };
        }
        return { ...c, children: c.children ? addTo(c.children) : undefined };
      });
    setCats(addTo(cats));
  };

  const handleAddMain = () => {
    const name = prompt("Main category name:");
    if (!name) return;
    setCats([...cats, { id: `main_${Date.now()}`, name, count: 0 }]);
  };

  const handleEdit = (id: string) => {
    const name = prompt("New name:");
    if (!name) return;
    const editIn = (list: Category[]): Category[] =>
      list.map((c) => {
        if (c.id === id) return { ...c, name };
        return { ...c, children: c.children ? editIn(c.children) : undefined };
      });
    setCats(editIn(cats));
  };

  const renderTree = (items: Category[], depth = 0) => (
    <ul className={depth > 0 ? "ml-6" : ""}>
      {items.map((cat) => (
        <li key={cat.id} className="my-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-foreground">
              {depth > 0 && "• "}
              {cat.name} ({cat.count})
            </span>
            <button
              onClick={() => handleEdit(cat.id)}
              className="text-link text-xs hover:underline"
            >
              edit
            </button>
            <span className="text-muted-foreground">|</span>
            <button
              onClick={() => handleDelete(cat.id)}
              className="text-link text-xs hover:underline"
            >
              delete
            </button>
          </div>
          <button
            onClick={() => handleAddSub(cat.id)}
            className="text-link text-xs ml-4 hover:underline"
          >
            add category here
          </button>
          {cat.children && renderTree(cat.children, depth + 1)}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-foreground mb-1">Exabis Library</h1>
      <Breadcrumb />

      <button
        onClick={handleAddMain}
        className="text-link text-sm hover:underline mb-4 block"
      >
        add main category
      </button>

      {renderTree(cats)}
    </div>
  );
};

export default CategoriesPage;
