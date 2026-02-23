export interface Category {
  id: string;
  name: string;
  count: number;
  children?: Category[];
}

export interface LibraryItem {
  id: string;
  title: string;
  description: string;
  authors: string;
  url: string;
  categoryId: string;
}

export const categories: Category[] = [
  {
    id: "archiv",
    name: "Archiv",
    count: 375,
    children: [
      { id: "newsletter", name: "Newsletter", count: 375 },
    ],
  },
  {
    id: "latein",
    name: "Latein",
    count: 310,
    children: [
      {
        id: "bundesolympiaden",
        name: "Bundesolympiaden Latein und Griechisch",
        count: 27,
        children: [
          { id: "2001_vbg_1", name: "2001_VBG", count: 1 },
          { id: "2001_vbg_2", name: "2001_VBG", count: 1 },
        ],
      },
      { id: "2002_ktn", name: "2002_KTN", count: 1 },
      { id: "3kl_langform", name: "3. Kl. Langform Lat.", count: 26 },
      { id: "4kl_langform", name: "4. Kl. Langform Lat.", count: 3 },
      { id: "5kl_griechisch", name: "5. Kl. Griechisch", count: 8 },
    ],
  },
];

export const libraryItems: LibraryItem[] = [
  {
    id: "1",
    title: "2006-06-23/24: Olympiadeleiter & Statut",
    description: "Conspectus praesidum foederatorum & Regulae Hilarienses vom 23./24.6.2006.",
    authors: "",
    url: "http://www.eduhi.at/go/loading.php?id=189990",
    categoryId: "bundesolympiaden",
  },
  {
    id: "2",
    title: "2006-06-23/24: (Brau-)Meister",
    description: "",
    authors: "",
    url: "http://www.eduhi.at/go/loading.php?id=190221",
    categoryId: "bundesolympiaden",
  },
  {
    id: "3",
    title: "2006-06-23/24: Das Team",
    description: "Olympiadeleiter in Wilhering (ziemlich viele)",
    authors: "",
    url: "http://www.eduhi.at/go/loading.php?id=190222",
    categoryId: "bundesolympiaden",
  },
  {
    id: "4",
    title: "2006-06-23/24: Protokoll der Sitzung in Wilhering",
    description: "Das Protokoll (4 DINA4-Seiten) wurde von Peter Glatz erstellt und ist auch unter \"Protokolle\" zu finden.",
    authors: "",
    url: "http://www.schule.at/dl/Olympiadeleiter_Besprechung_Juni06_EF.doc",
    categoryId: "bundesolympiaden",
  },
  {
    id: "5",
    title: "Lateinische Grammatik - Übersicht",
    description: "Umfassende Übersicht der lateinischen Grammatik für Schüler.",
    authors: "Prof. Dr. Müller",
    url: "http://www.eduhi.at/go/loading.php?id=200001",
    categoryId: "3kl_langform",
  },
  {
    id: "6",
    title: "Newsletter Ausgabe 1/2006",
    description: "Erste Ausgabe des Newsletters mit aktuellen Informationen.",
    authors: "Redaktion",
    url: "http://www.eduhi.at/go/loading.php?id=300001",
    categoryId: "newsletter",
  },
];
