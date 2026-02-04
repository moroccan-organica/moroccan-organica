"use client";

import React, { useMemo, useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, Tag, Pencil, Trash2, Loader2, Grid3X3, List } from "lucide-react";
import { createCategory, getCategories, deleteCategory } from "@/actions/category.actions";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LanguageCode } from "@/types/product";

type CategoryItem = {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
  color: string;
  icon: string;
};

interface CategoryForm {
  name: string;
  nameAr: string;
  slug: string;
  color: string;
  icon: string;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [form, setForm] = useState<CategoryForm>({
    name: "",
    nameAr: "",
    slug: "",
    color: "#606C38",
    icon: "tag",
  });

  // Load categories from database
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const dbCategories = await getCategories();
      // Transform to CategoryItem format (we'll use color and icon from a default mapping)
      const transformedCategories: CategoryItem[] = dbCategories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        nameAr: cat.nameAr || "",
        slug: cat.slug,
        color: "#606C38", // Default color, you can store this in a separate field if needed
        icon: "tag", // Default icon
      }));
      setCategories(transformedCategories);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCategories = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(term) ||
        cat.slug.toLowerCase().includes(term)
    );
  }, [categories, searchTerm]);

  const openAddModal = () => {
    setEditingCategory(null);
    setForm({ name: "", nameAr: "", slug: "", color: "#606C38", icon: "tag" });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setForm({ name: cat.name, nameAr: cat.nameAr || "", slug: cat.slug, color: cat.color, icon: cat.icon });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) return;

    setIsSaving(true);
    try {
      if (editingCategory) {
        // TODO: Implement updateCategory action if needed
        // For now, we'll just show an alert
        alert("Update functionality will be implemented soon");
      } else {
        // Create new category
        const result = await createCategory({
          translations: [
            {
              language: "en" as LanguageCode,
              name: form.name,
              slug: form.slug,
            },
            ...(form.nameAr.trim()
              ? [
                {
                  language: "ar" as LanguageCode,
                  name: form.nameAr,
                  slug: form.slug + "-ar", // You might want to generate a proper Arabic slug
                },
              ]
              : []),
          ],
        });

        if (result.success && result.category) {
          // Reload categories from database
          await loadCategories();
          setIsModalOpen(false);
          setEditingCategory(null);
          setForm({ name: "", nameAr: "", slug: "", color: "#606C38", icon: "tag" });
        } else {
          alert(result.error || "Failed to create category");
        }
      }
    } catch (error) {
      console.error("Error saving category:", error);
      alert("An error occurred while saving the category");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const result = await deleteCategory(id);
      if (result.success) {
        // Reload categories from database
        await loadCategories();
      } else {
        alert(result.error || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("An error occurred while deleting the category");
    }
  };

  const generateSlug = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  return (
    <div>
      <AdminHeader title="Categories" subtitle="Manage your product categories" />

      <div className="p-6 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('table')}
                className={cn(
                  'p-2 transition-colors cursor-pointer',
                  viewMode === 'table' ? 'bg-[#606C38] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                )}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 transition-colors cursor-pointer',
                  viewMode === 'grid' ? 'bg-[#606C38] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                )}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
            </div>
            <Button className="bg-[#606C38] hover:bg-[#4a5429] text-white cursor-pointer" onClick={openAddModal}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#606C38]" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: cat.color }}
                  >
                    {/* We can dynamically load icons if needed, for now just generic Tag */}
                    <Tag className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-slate-900 truncate">{cat.name}</h3>
                      <Badge
                        variant="secondary"
                        className="text-xs"
                        style={{
                          backgroundColor: `${cat.color}20`,
                          color: cat.color,
                        }}
                      >
                        {cat.slug}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{cat.icon}</p>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(cat)} className="cursor-pointer">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 cursor-pointer" onClick={() => handleDelete(cat.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredCategories.length === 0 && (
              <div className="col-span-full text-center text-slate-500 py-10 border border-dashed border-slate-200 rounded-2xl">
                No categories found
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">Icon</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Slug</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Icon Ref</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div
                        className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: cat.color }}
                      >
                        <Tag className="h-5 w-5" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{cat.name}</div>
                      {cat.nameAr && <div className="text-xs text-slate-500">{cat.nameAr}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="secondary"
                        style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                      >
                        {cat.slug}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {cat.icon}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(cat)}
                          className="hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                          onClick={() => handleDelete(cat.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500">No categories found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">{editingCategory ? "Edit Category" : "Add Category"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name (English)</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value, slug: generateSlug(e.target.value) }))}
                  placeholder="Oils"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name (Arabic)</label>
                <Input
                  value={form.nameAr}
                  onChange={(e) => setForm((prev) => ({ ...prev, nameAr: e.target.value }))}
                  placeholder="الزيوت"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: generateSlug(e.target.value) }))}
                  placeholder="oils"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
                  <Input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Icon (text)</label>
                  <Input
                    value={form.icon}
                    onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
                    placeholder="tag"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button
                className="bg-[#606C38] hover:bg-[#4a5429] text-white"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
