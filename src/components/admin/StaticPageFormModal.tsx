'use client';

import React, { useState, useEffect } from 'react';
import { X, Globe, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StaticPage, StaticPageInput, StaticPageTranslation } from '@/types/static-page';

interface StaticPageFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    page: StaticPage | null;
    onSave: (data: StaticPageInput) => Promise<void>;
}

const LANGUAGES = ['en', 'fr', 'ar'] as const;

export function StaticPageFormModal({
    isOpen,
    onClose,
    page,
    onSave,
}: StaticPageFormModalProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [activeLang, setActiveLang] = useState<string>('en');

    // Form State
    const [systemName, setSystemName] = useState('');
    const [translations, setTranslations] = useState<Record<string, StaticPageTranslation>>({
        en: { language: 'en', slug: '', h1: '', description: '', metaTitle: '', metaDesc: '', keywords: '' },
        fr: { language: 'fr', slug: '', h1: '', description: '', metaTitle: '', metaDesc: '', keywords: '' },
        ar: { language: 'ar', slug: '', h1: '', description: '', metaTitle: '', metaDesc: '', keywords: '' },
    });

    useEffect(() => {
        if (isOpen) {
            if (page) {
                setSystemName(page.systemName);
                const newTranslations: Record<string, StaticPageTranslation> = { ...translations };

                LANGUAGES.forEach(lang => {
                    const existing = page.translations.find(t => t.language === lang);
                    if (existing) {
                        newTranslations[lang] = { ...existing };
                    } else {
                        // Reset if translation missing on existing page
                        newTranslations[lang] = { language: lang, slug: '', h1: '', description: '', metaTitle: '', metaDesc: '', keywords: '' };
                    }
                });
                setTranslations(newTranslations);
            } else {
                // Reset for new page
                setSystemName('');
                setTranslations({
                    en: { language: 'en', slug: '', h1: '', description: '', metaTitle: '', metaDesc: '', keywords: '' },
                    fr: { language: 'fr', slug: '', h1: '', description: '', metaTitle: '', metaDesc: '', keywords: '' },
                    ar: { language: 'ar', slug: '', h1: '', description: '', metaTitle: '', metaDesc: '', keywords: '' },
                });
            }
        }
    }, [page, isOpen]);

    const updateTranslation = (field: keyof StaticPageTranslation, value: string) => {
        setTranslations(prev => ({
            ...prev,
            [activeLang]: {
                ...prev[activeLang],
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave({
                id: page?.id,
                systemName,
                translations: Object.values(translations)
            });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const currentTranslation = translations[activeLang];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-[#f8f9fa] rounded-2xl shadow-2xl w-[95vw] max-w-4xl h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
                    <h2 className="text-2xl font-bold text-[#606C38]">
                        {page ? 'Edit Static Page' : 'Create Static Page'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="overflow-y-auto h-[calc(90vh-140px)]">
                    <div className="p-6 space-y-6">

                        {/* System Info */}
                        <fieldset className="border-2 border-[#606C38] rounded-xl p-5 bg-white">
                            <legend className="text-lg font-bold text-[#606C38] px-2">System Information</legend>

                            <div>
                                <Label htmlFor="systemName" className="font-bold text-slate-700">System Name (ID)</Label>
                                <Input
                                    id="systemName"
                                    value={systemName}
                                    onChange={(e) => setSystemName(e.target.value.toUpperCase().replace(/\s+/g, '_'))}
                                    placeholder="e.g. ABOUT_US"
                                    disabled={!!page}
                                    className="mt-2"
                                />
                                <p className="text-xs text-slate-500 mt-2">
                                    Unique identifier used by the system to fetch this page. Cannot be changed after creation.
                                </p>
                            </div>
                        </fieldset>

                        {/* Language Selector */}
                        <div className="flex gap-2 border-b border-slate-200 pb-2">
                            {LANGUAGES.map(lang => (
                                <button
                                    key={lang}
                                    type="button"
                                    onClick={() => setActiveLang(lang)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeLang === lang
                                            ? 'bg-[#606C38] text-white shadow-md'
                                            : 'bg-white text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {lang === 'en' ? 'English' : lang === 'fr' ? 'Français' : 'العربية'}
                                </button>
                            ))}
                        </div>

                        {/* Content & SEO */}
                        <fieldset className="border-2 border-[#606C38] rounded-xl p-5 bg-white">
                            <legend className="text-lg font-bold text-[#606C38] px-2 flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                Content & SEO ({activeLang.toUpperCase()})
                            </legend>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="col-span-1 md:col-span-2">
                                    <Label className="font-bold text-slate-700">Page Heading (H1)</Label>
                                    <Input
                                        value={currentTranslation.h1 || ''}
                                        onChange={(e) => updateTranslation('h1', e.target.value)}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <Label className="font-bold text-slate-700">URL Slug</Label>
                                    <Input
                                        value={currentTranslation.slug || ''}
                                        onChange={(e) => updateTranslation('slug', e.target.value)}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                <Label className="font-bold text-slate-700">Short Description</Label>
                                <Textarea
                                    value={currentTranslation.description || ''}
                                    onChange={(e) => updateTranslation('description', e.target.value)}
                                    rows={5}
                                    className="resize-none"
                                />
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <h4 className="font-semibold text-slate-700">SEO Meta Data</h4>

                                <div>
                                    <Label>Meta Title</Label>
                                    <Input
                                        value={currentTranslation.metaTitle || ''}
                                        onChange={(e) => updateTranslation('metaTitle', e.target.value)}
                                        placeholder={currentTranslation.h1 || ''}
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label>Meta Description</Label>
                                    <Textarea
                                        value={currentTranslation.metaDesc || ''}
                                        onChange={(e) => updateTranslation('metaDesc', e.target.value)}
                                        rows={2}
                                        className="mt-1 resize-none"
                                    />
                                </div>

                                <div>
                                    <Label>Keywords</Label>
                                    <Input
                                        value={currentTranslation.keywords || ''}
                                        onChange={(e) => updateTranslation('keywords', e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </fieldset>

                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-white">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#606C38] hover:bg-[#4a5429] text-white"
                            disabled={isSaving || !systemName}
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
