import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, Grid3X3, List, FileText, FileImage, FileVideo, File, ChevronDown, BookOpen } from "lucide-react";
import { digitalLibraries, digitalLibraryCategories } from "@/data/digital-library-data";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 12;

const fileTypeColors: Record<string, string> = {
  PDF: "bg-red-100 text-red-700",
  DOC: "bg-blue-100 text-blue-700",
  VIDEO: "bg-purple-100 text-purple-700",
  IMAGE: "bg-green-100 text-green-700",
};

const BibliothecaPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentPage = Number(searchParams.get("page") || "1");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter libraries
  const filtered = digitalLibraries.filter((lib) => {
    const matchSearch =
      !search ||
      lib.title.toLowerCase().includes(search.toLowerCase()) ||
      lib.author.toLowerCase().includes(search.toLowerCase());
    const matchCat = !categoryFilter || lib.category === categoryFilter;
    const matchDate =
      !dateFilter || lib.dateCreation.startsWith(dateFilter);
    const matchType =
      !typeFilter ||
      lib.files.some((f) => f.type === typeFilter);
    return matchSearch && matchCat && matchDate && matchType;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    if (page === 1) {
      setSearchParams({});
    } else {
      setSearchParams({ page: String(page) });
    }
  };

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case "PDF": return <FileText className="w-4 h-4" />;
      case "DOC": return <File className="w-4 h-4" />;
      case "VIDEO": return <FileVideo className="w-4 h-4" />;
      case "IMAGE": return <FileImage className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const renderPaginationPages = () => {
    const pages: React.ReactNode[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => goToPage(i)}
              isActive={i === currentPage}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => goToPage(1)} isActive={1 === currentPage} className="cursor-pointer">1</PaginationLink>
        </PaginationItem>
      );
      if (currentPage > 3) {
        pages.push(<PaginationItem key="start-ellipsis"><PaginationEllipsis /></PaginationItem>);
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink onClick={() => goToPage(i)} isActive={i === currentPage} className="cursor-pointer">{i}</PaginationLink>
          </PaginationItem>
        );
      }
      if (currentPage < totalPages - 2) {
        pages.push(<PaginationItem key="end-ellipsis"><PaginationEllipsis /></PaginationItem>);
      }
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => goToPage(totalPages)} isActive={totalPages === currentPage} className="cursor-pointer">{totalPages}</PaginationLink>
        </PaginationItem>
      );
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Bibliothèque Numérique</h1>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground transition-colors">Organisation</button>
            <button onClick={() => navigate("/bibliotheque")} className="text-primary font-semibold border-b-2 border-primary pb-1">Bibliothèque</button>
            <button onClick={() => navigate("/admin")} className="text-muted-foreground hover:text-foreground transition-colors">Administration</button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search & Filters Bar */}
        <div className="bg-background rounded-lg border border-border p-4 mb-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); goToPage(1); }}
                placeholder="Rechercher une bibliothèque..."
                className="w-full pl-10 pr-3 py-2 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            {/* Category Filter */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); goToPage(1); }}
                className="appearance-none pl-3 pr-8 py-2 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
              >
                <option value="">Toutes les catégories</option>
                {digitalLibraryCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            {/* Date Filter */}
            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => { setDateFilter(e.target.value); goToPage(1); }}
                className="appearance-none pl-3 pr-8 py-2 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
              >
                <option value="">Toutes les dates</option>
                <option value="2024-01">Janvier 2024</option>
                <option value="2024-02">Février 2024</option>
                <option value="2024-03">Mars 2024</option>
                <option value="2024-04">Avril 2024</option>
                <option value="2024-05">Mai 2024</option>
                <option value="2024-06">Juin 2024</option>
                <option value="2024-07">Juillet 2024</option>
                <option value="2024-08">Août 2024</option>
                <option value="2024-09">Septembre 2024</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            {/* Type Filter */}
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); goToPage(1); }}
                className="appearance-none pl-3 pr-8 py-2 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
              >
                <option value="">Tous les types</option>
                <option value="PDF">PDF</option>
                <option value="DOC">DOC</option>
                <option value="VIDEO">Vidéo</option>
                <option value="IMAGE">Image</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            {/* View Toggle */}
            <div className="flex border border-input rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-secondary"}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-secondary"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {filtered.length} bibliothèque{filtered.length > 1 ? "s" : ""} trouvée{filtered.length > 1 ? "s" : ""}
          </p>
          <p className="text-sm text-muted-foreground">
            Page {currentPage} sur {totalPages || 1}
          </p>
        </div>

        {/* GRID VIEW */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {paginated.map((lib) => (
              <div
                key={lib.id}
                className="bg-background rounded-lg border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
              >
                {/* Cover */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={lib.coverImage}
                    alt={lib.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs">
                    {lib.category}
                  </Badge>
                </div>
                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground text-sm leading-tight mb-1 line-clamp-2">
                    {lib.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">{lib.author}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{lib.numberOfDocuments} fichiers</span>
                  </div>
                  {lib.progress !== undefined && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Progression</span>
                        <span>{lib.progress}%</span>
                      </div>
                      <Progress value={lib.progress} className="h-1.5" />
                    </div>
                  )}
                  <button
                    onClick={() => navigate(`/bibliotheque/${lib.id}`)}
                    className="w-full py-2 px-3 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Voir la bibliothèque
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="space-y-3">
            {paginated.map((lib) => (
              <div
                key={lib.id}
                className="bg-background rounded-lg border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow flex"
              >
                <div className="w-48 h-32 flex-shrink-0 overflow-hidden">
                  <img
                    src={lib.coverImage}
                    alt={lib.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-primary text-primary-foreground text-xs">{lib.category}</Badge>
                    </div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">{lib.title}</h3>
                    <p className="text-xs text-muted-foreground mb-1">{lib.author}</p>
                    <p className="text-xs text-muted-foreground">{lib.numberOfDocuments} fichiers · Créé le {lib.dateCreation}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    {lib.progress !== undefined && (
                      <div className="flex-1 max-w-[200px]">
                        <Progress value={lib.progress} className="h-1.5" />
                      </div>
                    )}
                    <button
                      onClick={() => navigate(`/bibliotheque/${lib.id}`)}
                      className="py-1.5 px-4 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors ml-auto"
                    >
                      Voir la bibliothèque
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {paginated.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Aucune bibliothèque trouvée.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
                    className={`cursor-pointer ${currentPage <= 1 ? "pointer-events-none opacity-50" : ""}`}
                  />
                </PaginationItem>
                {renderPaginationPages()}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
                    className={`cursor-pointer ${currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-background border-t border-border mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-xs text-muted-foreground">
          © 2024 Bibliothèque Numérique. Tous droits réservés.
        </div>
      </div>
    </div>
  );
};

export default BibliothecaPage;
