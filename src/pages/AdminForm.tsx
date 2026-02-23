import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { ChevronDown, ChevronRight, Table, Bold, Italic, List, ListOrdered, Link, Unlink, Image, ArrowDown } from "lucide-react";

const AdminForm = () => {
  const [contentExpanded, setContentExpanded] = useState(true);
  const [name, setName] = useState("");
  const [source, setSource] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [content, setContent] = useState("");
  const [authors, setAuthors] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Entry saved (demo).");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-foreground mb-1">Library</h1>
      <Breadcrumb />

      <div className="flex justify-end mb-4">
        <button className="text-link text-sm flex items-center gap-1 hover:underline">
          <ChevronRight className="w-3 h-3" />
          Expand all
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="flex items-center gap-4">
          <label className="w-32 text-right text-label text-sm font-medium">
            Name<span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 max-w-lg border border-input px-2 py-1 text-sm"
          />
        </div>

        {/* Source */}
        <div className="flex items-center gap-4">
          <label className="w-32 text-right text-label text-sm font-medium">Source</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="flex-1 max-w-lg border border-input px-2 py-1 text-sm"
          />
        </div>

        {/* Content Section */}
        <div className="border-t border-border pt-4">
          <button
            type="button"
            onClick={() => setContentExpanded(!contentExpanded)}
            className="flex items-center gap-1 text-breadcrumb font-medium text-sm mb-4 hover:underline"
          >
            {contentExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            Content
          </button>

          {contentExpanded && (
            <div className="space-y-4">
              {/* Link Titel */}
              <div className="flex items-center gap-4">
                <label className="w-32 text-right text-label text-sm font-medium">Link Titel</label>
                <input
                  type="text"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  className="flex-1 max-w-lg border border-input px-2 py-1 text-sm"
                />
              </div>

              {/* Link */}
              <div className="flex items-center gap-4">
                <label className="w-32 text-right text-label text-sm font-medium">Link</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="flex-1 max-w-lg border border-input px-2 py-1 text-sm"
                />
              </div>

              {/* File */}
              <div className="flex items-start gap-4">
                <label className="w-32 text-right text-label text-sm font-medium pt-1">File</label>
                <div className="flex-1">
                  <p className="text-xs text-link text-right mb-1">
                    Maximum size for new files: Unlimited, maximum attachments: 1
                  </p>
                  <div className="border border-input">
                    <div className="flex items-center justify-between bg-secondary px-2 py-1 border-b border-input">
                      <button type="button" className="text-muted-foreground">
                        <Image className="w-4 h-4" />
                      </button>
                      <div className="flex gap-1">
                        <button type="button" className="p-1 border border-input bg-background text-xs">⊞</button>
                        <button type="button" className="p-1 border border-input bg-background text-xs">☰</button>
                        <button type="button" className="p-1 border border-input bg-background text-xs">≡</button>
                      </div>
                    </div>
                    <div className="px-2 py-1 text-sm text-link flex items-center gap-1">
                      <ChevronRight className="w-3 h-3" />
                      📁 Files
                    </div>
                    <div className="border-2 border-dashed border-input m-2 p-8 flex flex-col items-center justify-center text-center">
                      <ArrowDown className="w-10 h-10 text-primary mb-2" />
                      <p className="text-sm text-muted-foreground">
                        You can drag and drop files here to add them.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content editor */}
              <div className="flex items-start gap-4">
                <label className="w-32 text-right text-label text-sm font-medium pt-1">Content</label>
                <div className="flex-1">
                  <div className="border border-input">
                    <div className="flex items-center gap-1 bg-secondary px-2 py-1 border-b border-input">
                      <button type="button" className="p-1 hover:bg-muted"><Table className="w-4 h-4" /></button>
                      <select className="text-xs border border-input px-1 py-0.5">
                        <option>A1</option>
                        <option>A2</option>
                        <option>A3</option>
                      </select>
                      <button type="button" className="p-1 hover:bg-muted font-bold text-sm">B</button>
                      <button type="button" className="p-1 hover:bg-muted italic text-sm">I</button>
                      <button type="button" className="p-1 hover:bg-muted"><List className="w-4 h-4" /></button>
                      <button type="button" className="p-1 hover:bg-muted"><ListOrdered className="w-4 h-4" /></button>
                      <button type="button" className="p-1 hover:bg-muted"><Link className="w-4 h-4" /></button>
                      <button type="button" className="p-1 hover:bg-muted"><Unlink className="w-4 h-4" /></button>
                      <button type="button" className="p-1 hover:bg-muted"><Image className="w-4 h-4" /></button>
                    </div>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full h-64 p-2 text-sm resize-y outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Authors */}
        <div className="flex items-center gap-4">
          <label className="w-32 text-right text-label text-sm font-medium">Authors</label>
          <input
            type="text"
            value={authors}
            onChange={(e) => setAuthors(e.target.value)}
            className="flex-1 max-w-lg border border-input px-2 py-1 text-sm"
          />
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-6 py-2 text-sm hover:opacity-90"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminForm;
