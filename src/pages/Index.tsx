import { useState } from "react";
import { categories, libraryItems } from "@/data/library-data";
import CategoryTree from "@/components/CategoryTree";

const Index = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const filteredItems = libraryItems.filter((item) => {
    const matchesSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || item.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-heading mb-1">
        Exabis Library: Organisation
      </h1>
      <hr className="border-border mb-6" />

      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-input px-2 py-1 text-sm mb-2"
            placeholder=""
          />
          <div className="flex gap-1 mb-6">
            <select className="border border-input px-2 py-1 text-sm flex-1">
              <option>In this Category</option>
            </select>
            <button
              onClick={() => {}}
              className="border border-input bg-secondary px-3 py-1 text-sm hover:bg-muted"
            >
              Search
            </button>
          </div>

          <CategoryTree
            categories={categories}
            onSelect={setSelectedCategory}
            selectedId={selectedCategory}
          />
        </div>

        {/* Results */}
        <div className="flex-1">
          <div className="text-right font-bold text-foreground mb-4">Results</div>
          <div className="space-y-6">
            {filteredItems.map((item) => (
              <div key={item.id}>
                <a href={item.url} className="text-link hover:underline text-base font-medium">
                  {item.title}
                </a>
                {item.description && (
                  <p className="text-foreground text-sm mt-0.5">{item.description}</p>
                )}
                <p className="text-sm mt-0.5">
                  <span className="font-bold text-foreground">Authors:</span>{" "}
                  {item.authors}
                </p>
                <a href={item.url} className="text-link text-sm hover:underline">
                  {item.url}
                </a>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <p className="text-muted-foreground">No results found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
