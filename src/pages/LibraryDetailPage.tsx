import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Eye, FileText, File, FileVideo, FileImage, BookOpen } from "lucide-react";
import { digitalLibraries } from "@/data/digital-library-data";
import { Badge } from "@/components/ui/badge";

const fileTypeConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  PDF: { icon: <FileText className="w-5 h-5" />, color: "bg-red-50 text-red-600 border-red-200" },
  DOC: { icon: <File className="w-5 h-5" />, color: "bg-blue-50 text-blue-600 border-blue-200" },
  VIDEO: { icon: <FileVideo className="w-5 h-5" />, color: "bg-purple-50 text-purple-600 border-purple-200" },
  IMAGE: { icon: <FileImage className="w-5 h-5" />, color: "bg-green-50 text-green-600 border-green-200" },
};

const LibraryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const library = digitalLibraries.find((l) => l.id === id);

  if (!library) {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">Bibliothèque introuvable.</p>
          <button onClick={() => navigate("/bibliotheque")} className="py-2 px-4 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
            Retour aux bibliothèques
          </button>
        </div>
      </div>
    );
  }

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
        {/* Back button */}
        <button
          onClick={() => navigate("/bibliotheque")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux bibliothèques
        </button>

        {/* Library header card */}
        <div className="bg-background rounded-lg border border-border shadow-sm overflow-hidden mb-6">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-72 h-48 md:h-auto flex-shrink-0">
              <img src={library.coverImage} alt={library.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex-1">
              <Badge className="bg-primary text-primary-foreground text-xs mb-2">{library.category}</Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">{library.title}</h2>
              <p className="text-sm text-muted-foreground mb-3">{library.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span><strong>Auteur :</strong> {library.author}</span>
                <span><strong>Fichiers :</strong> {library.numberOfDocuments}</span>
                <span><strong>Créé le :</strong> {library.dateCreation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Files table */}
        <div className="bg-background rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Fichiers ({library.files.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Fichier</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Type</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Taille</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-right px-5 py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {library.files.map((file) => {
                  const config = fileTypeConfig[file.type] || fileTypeConfig.DOC;
                  return (
                    <tr key={file.id} className="border-b border-border last:border-b-0 hover:bg-secondary/30 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-md border ${config.color}`}>
                            {config.icon}
                          </div>
                          <span className="font-medium text-foreground">{file.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant="outline" className="text-xs">{file.type}</Badge>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{file.size}</td>
                      <td className="px-5 py-3 text-muted-foreground">{file.dateUpload}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button className="flex items-center gap-1 py-1.5 px-3 text-xs font-medium rounded-md border border-input bg-background hover:bg-secondary transition-colors">
                            <Eye className="w-3.5 h-3.5" />
                            Lire
                          </button>
                          <button className="flex items-center gap-1 py-1.5 px-3 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                            <Download className="w-3.5 h-3.5" />
                            Télécharger
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
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

export default LibraryDetailPage;
