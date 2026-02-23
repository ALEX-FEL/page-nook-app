import { useState } from "react";
import { categories, libraryItems } from "@/data/library-data";
import CategoryTree from "@/components/CategoryTree";
import { Search, Download, X } from "lucide-react";

const Index = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  const filteredItems = libraryItems.filter((item) => {
    const matchesSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || item.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-heading mb-1">
      Library: Organisation
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
                <div className="flex items-start gap-3">
                  <div className="flex-1">
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
                  {item.url && (
                    <div className="flex items-center gap-1 mt-1">
                      <button
                        onClick={() => handlePreview(item.url)}
                        className="p-1.5 hover:bg-muted rounded border border-border"
                        title="Prévisualiser"
                      >
                        <Search className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDownload(item.url, item.title)}
                        className="p-1.5 hover:bg-muted rounded border border-border"
                        title="Télécharger"
                      >
                        <Download className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <p className="text-muted-foreground">No results found.</p>
            )}
          </div>
        </div>
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Prévisualisation du fichier</h3>
              <div className="flex items-center gap-2">
                {/* <button
                  onClick={() => handleDownload(previewFile, 'fichier')}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:opacity-90"
                >
                  <Download className="w-4 h-4" /> Télécharger
                </button> */}
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
                  {/* <a
                    href={previewFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded hover:opacity-90"
                  >
                    <Download className="w-4 h-4" /> Télécharger le fichier
                  </a> */}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
