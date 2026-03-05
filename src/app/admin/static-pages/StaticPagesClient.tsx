'use client';

import React, { useState, useMemo } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    Eye,
    List,
    Grid3X3,
    FileText,
    Filter,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StaticPageFormModal } from '@/components/admin/StaticPageFormModal';
import {
    useStaticPages,
    useCreateStaticPage,
    useUpdateStaticPage,
    useDeleteStaticPage
} from '@/lib/static-pages/hooks';
import { StaticPage, StaticPageInput } from '@/types/static-page';

export function StaticPagesClient() {
    const { data: pages = [], isLoading } = useStaticPages();
    const createStaticPage = useCreateStaticPage();
    const updateStaticPage = useUpdateStaticPage();
    const deleteStaticPage = useDeleteStaticPage();

    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPage, setEditingPage] = useState<StaticPage | null>(null);

    const filteredPages = useMemo(() => {
        return pages.filter(page => {
            const matchesSearch = page.systemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                page.translations.some(t => t.h1?.toLowerCase().includes(searchTerm.toLowerCase()) || t.slug.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesLanguage = !selectedLanguage || page.translations.some(t => t.language === selectedLanguage);

            return matchesSearch && matchesLanguage;
        });
    }, [pages, searchTerm, selectedLanguage]);

    const handleEdit = (page: StaticPage) => {
        setEditingPage(page);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingPage(null);
        setIsModalOpen(true);
    };

    const handleSavePage = async (pageData: StaticPageInput) => {
        try {
            if (editingPage) {
                await updateStaticPage.mutateAsync({
                    id: editingPage.id,
                    input: pageData
                });
            } else {
                await createStaticPage.mutateAsync(pageData);
            }
            setIsModalOpen(false);
            setEditingPage(null);
        } catch (error) {
            console.error('Error saving page:', error);
            alert('An error occurred while saving');
        }
    };

    const handleDelete = async (pageId: string) => {
        if (!confirm('Are you sure you want to delete this page?')) return;

        try {
            await deleteStaticPage.mutateAsync(pageId);
        } catch (error) {
            console.error('Error deleting page:', error);
            alert('An error occurred while deleting');
        }
    };

    const getTranslation = (page: StaticPage, lang: string) => {
        return page.translations.find(t => t.language === lang);
    };

    return (
        <div>
            <AdminHeader title="Static Pages" subtitle="Manage your website static pages" />

            <div className="p-6">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Search pages..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-white"
                            />
                        </div>

                        <select
                            value={selectedLanguage || ''}
                            onChange={(e) => setSelectedLanguage(e.target.value || null)}
                            className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#606C38]"
                        >
                            <option value="">All Languages</option>
                            <option value="en">English</option>
                            <option value="fr">Français</option>
                            <option value="ar">العربية</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setViewMode('table')}
                                className={cn(
                                    'p-2 transition-colors',
                                    viewMode === 'table' ? 'bg-[#606C38] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                                )}
                            >
                                <List className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={cn(
                                    'p-2 transition-colors',
                                    viewMode === 'grid' ? 'bg-[#606C38] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                                )}
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </button>
                        </div>

                        <Button
                            onClick={handleAddNew}
                            className="bg-[#606C38] hover:bg-[#4a5429] text-white opacity-50 cursor-not-allowed"
                            disabled
                            title="Adding new pages is temporarily disabled"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Page
                        </Button>
                    </div>
                </div>

                {/* Pages Display */}
                {viewMode === 'table' ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Page / Slug</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">H1 Heading</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">System Name</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Languages</th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredPages.map((page) => {
                                    const enTranslation = getTranslation(page, 'en');
                                    return (
                                        <tr key={page.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-[#606C38]/10">
                                                        <FileText className="h-5 w-5 text-[#606C38]" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900">{enTranslation?.h1 || page.systemName}</p>
                                                        <p className="text-sm text-slate-500">{enTranslation?.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-slate-700 line-clamp-1">{enTranslation?.h1 || '-'}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-xs text-slate-500 line-clamp-1 max-w-[200px]">
                                                    {enTranslation?.description || '-'}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
                                                    {page.systemName}
                                                </code>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-1">
                                                    {page.translations.map((trans) => (
                                                        <Badge
                                                            key={trans.language}
                                                            variant="secondary"
                                                            className="bg-blue-100 text-blue-700"
                                                        >
                                                            {trans.language.toUpperCase()}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => window.open(`/en/${enTranslation?.slug}`, '_blank')}
                                                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                                        title="View"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(page)}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(page.id)}
                                                        className="p-2 text-slate-300 cursor-not-allowed"
                                                        disabled
                                                        title="Deletion is temporarily disabled"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {filteredPages.length === 0 && (
                            <div className="text-center py-12">
                                <Filter className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                                <p className="text-slate-500">No pages found</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredPages.map((page) => {
                            const enTranslation = getTranslation(page, 'en');
                            return (
                                <div
                                    key={page.id}
                                    className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group relative"
                                >
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-[#606C38]/10">
                                                <FileText className="h-6 w-6 text-[#606C38]" />
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4">
                                                <button
                                                    onClick={() => handleEdit(page)}
                                                    className="p-2 bg-white rounded-lg shadow hover:bg-blue-50 transition-colors"
                                                >
                                                    <Pencil className="h-4 w-4 text-blue-600" />
                                                </button>
                                                <button
                                                    disabled
                                                    className="p-2 bg-white rounded-lg shadow cursor-not-allowed opacity-50"
                                                >
                                                    <Trash2 className="h-4 w-4 text-slate-400" />
                                                </button>
                                            </div>
                                        </div>

                                        <h3 className="font-semibold text-slate-900 mb-1 line-clamp-1">{enTranslation?.h1 || page.systemName}</h3>
                                        <p className="text-sm text-slate-500 mb-3">{page.systemName}</p>

                                        <div className="flex flex-wrap gap-1 mt-4">
                                            {page.translations.map((trans) => (
                                                <Badge
                                                    key={trans.language}
                                                    variant="secondary"
                                                    className="bg-blue-100 text-blue-700 text-xs"
                                                >
                                                    {trans.language.toUpperCase()}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                        <span className="text-xs text-slate-500">
                                            Updated {new Date(page.updatedAt).toLocaleDateString()}
                                        </span>
                                        <button
                                            onClick={() => window.open(`/en/${enTranslation?.slug}`, '_blank')}
                                            className="text-xs font-medium text-[#606C38] hover:underline"
                                        >
                                            View Page
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Summary */}
                <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                    <p>Showing {filteredPages.length} of {pages.length} pages (total {pages.length})</p>
                </div>
            </div>

            {/* Static Page Form Modal */}
            <StaticPageFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingPage(null);
                }}
                page={editingPage}
                onSave={handleSavePage}
            />
        </div>
    );
}
