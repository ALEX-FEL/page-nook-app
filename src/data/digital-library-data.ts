export interface LibraryFile {
  id: string;
  title: string;
  type: "PDF" | "DOC" | "VIDEO" | "IMAGE";
  size: string;
  dateUpload: string;
}

export interface DigitalLibrary {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  category: string;
  author: string;
  numberOfDocuments: number;
  dateCreation: string;
  progress?: number;
  files: LibraryFile[];
}

export const digitalLibraryCategories = [
  "Informatique",
  "Mathématiques",
  "Physique",
  "Langues",
  "Histoire",
  "Littérature",
  "Sciences",
  "Économie",
];

const placeholderCovers = [
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=250&fit=crop",
];

function generateFiles(count: number): LibraryFile[] {
  const types: LibraryFile["type"][] = ["PDF", "DOC", "VIDEO", "IMAGE"];
  const files: LibraryFile[] = [];
  for (let i = 1; i <= count; i++) {
    files.push({
      id: `file-${i}`,
      title: `Document ${i}`,
      type: types[Math.floor(Math.random() * types.length)],
      size: `${(Math.random() * 50 + 0.5).toFixed(1)} MB`,
      dateUpload: `2024-0${Math.floor(Math.random() * 9) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
    });
  }
  return files;
}

export const digitalLibraries: DigitalLibrary[] = Array.from({ length: 38 }, (_, i) => {
  const cat = digitalLibraryCategories[i % digitalLibraryCategories.length];
  const docCount = Math.floor(Math.random() * 20) + 3;
  return {
    id: `lib-${i + 1}`,
    title: [
      "Introduction à l'algorithmique",
      "Bases de données avancées",
      "Analyse mathématique I",
      "Mécanique quantique",
      "Grammaire anglaise avancée",
      "Histoire de l'Europe moderne",
      "Littérature française du XIXe",
      "Microéconomie appliquée",
      "Programmation Python",
      "Statistiques et probabilités",
      "Physique des particules",
      "Espagnol débutant",
      "Géographie politique",
      "Poésie romantique",
      "Macroéconomie",
      "Intelligence artificielle",
      "Algèbre linéaire",
      "Thermodynamique",
      "Allemand intermédiaire",
      "Révolution industrielle",
      "Le roman moderne",
      "Finance d'entreprise",
      "Réseaux informatiques",
      "Calcul intégral",
      "Optique géométrique",
      "Japonais initiation",
      "Antiquité grecque",
      "Théâtre classique",
      "Comptabilité générale",
      "Sécurité informatique",
      "Géométrie différentielle",
      "Électromagnétisme",
      "Italien conversationnel",
      "Moyen Âge",
      "Philosophie des sciences",
      "Marketing digital",
      "Cloud Computing",
      "Systèmes embarqués",
    ][i],
    description: `Une collection complète de ressources pour l'étude de ce sujet. Contient ${docCount} documents variés.`,
    coverImage: placeholderCovers[i % placeholderCovers.length],
    category: cat,
    author: [
      "Dr. Martin Dupont",
      "Prof. Claire Moreau",
      "Dr. Jean-Pierre Laurent",
      "Prof. Sophie Bernard",
      "Dr. Ahmed Benali",
      "Prof. Marie Lefèvre",
      "Dr. Thomas Petit",
      "Prof. Isabelle Roux",
    ][i % 8],
    numberOfDocuments: docCount,
    dateCreation: `2024-0${(i % 9) + 1}-15`,
    progress: Math.random() > 0.5 ? Math.floor(Math.random() * 100) : undefined,
    files: generateFiles(docCount),
  };
});
