import { Category } from "@/data/library-data";

interface CategoryTreeProps {
  categories: Category[];
  depth?: number;
  onSelect?: (id: string) => void;
  selectedId?: string;
}

const CategoryTree = ({ categories, depth = 0, onSelect, selectedId }: CategoryTreeProps) => {
  return (
    <ul className={depth === 0 ? "" : "ml-4"}>
      {categories.map((cat) => (
        <li key={cat.id} className="my-1">
          <span className="flex items-start">
            {depth > 0 && <span className="text-muted-foreground mr-1">»</span>}
            <button
              onClick={() => onSelect?.(cat.id)}
              className={`text-left hover:underline ${
                depth === 0
                  ? "text-lg font-bold text-heading"
                  : "text-link text-sm"
              } ${selectedId === cat.id ? "underline" : ""}`}
            >
              {cat.name} ({cat.count})
            </button>
          </span>
          {cat.children && (
            <CategoryTree
              categories={cat.children}
              depth={depth + 1}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export default CategoryTree;
