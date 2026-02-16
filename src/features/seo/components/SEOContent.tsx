'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/features/admin/components/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { toast } from 'react-hot-toast';
import {
    Save,
    Globe,
    Image as ImageIcon,
    Share2,
    Loader2
} from 'lucide-react';
import { useSEOSettings, useUpdateSEOSettings } from '@/features/seo/hooks';
import { LanguageCode, GlobalSettings, LocalizedSettings } from '@/types/seo';

const DEFAULT_LOCALIZED: LocalizedSettings = {
    siteName: 'Moroccan Organica',
    titleSuffix: ' | Premium Argan Oil',
    defaultMetaDesc: '',
    defaultKeywords: ''
};

export function SEOContent() {
    const [activeLanguage, setActiveLanguage] = useState<LanguageCode>('en');

    // Hooks
    const { data: settings, isLoading } = useSEOSettings();
    const updateSettings = useUpdateSEOSettings();

    // Local state for editing
    const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({
        ogImage: '',
        twitterHandle: '',
        facebookPage: ''
    });

    const [translations, setTranslations] = useState<Record<LanguageCode, LocalizedSettings>>({
        en: { ...DEFAULT_LOCALIZED },
        fr: { ...DEFAULT_LOCALIZED },
        ar: { ...DEFAULT_LOCALIZED }
    });

    // Sync data when loaded
    useEffect(() => {
        if (settings) {
            setGlobalSettings({
                ogImage: settings.ogImage || '',
                twitterHandle: settings.twitterHandle || '',
                facebookPage: settings.facebookPage || ''
            });

            const newTranslations = { ...translations };
            if (Array.isArray(settings.translations)) {
                settings.translations.forEach((t: any) => {
                    if (['en', 'fr', 'ar'].includes(t.language)) {
                        newTranslations[t.language as LanguageCode] = {
                            siteName: t.siteName || '',
                            titleSuffix: t.titleSuffix || '',
                            defaultMetaDesc: t.defaultMetaDesc || '',
                            defaultKeywords: t.defaultKeywords || ''
                        };
                    }
                });
            }
            setTranslations(newTranslations);
        }
    }, [settings]);

    const handleSave = async () => {
        try {
            const payload = {
                ...globalSettings,
                translations: Object.entries(translations).map(([lang, data]) => ({
                    language: lang,
                    ...data
                }))
            };

            await updateSettings.mutateAsync(payload);
            // toast.success('SEO settings saved successfully!');
            alert('SEO settings saved successfully!');
        } catch (error) {
            console.error(error);
            // toast.error('Failed to save settings');
            alert('Failed to save settings');
        }
    };

    const updateGlobal = (field: keyof GlobalSettings, value: string) => {
        setGlobalSettings(prev => ({ ...prev, [field]: value }));
    };

    const updateLocalized = (field: keyof LocalizedSettings, value: string) => {
        setTranslations(prev => ({
            ...prev,
            [activeLanguage]: {
                ...prev[activeLanguage],
                [field]: value
            }
        }));
    };

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        );
    }

    const currentLocalized = translations[activeLanguage];
    const isSaving = updateSettings.isPending;

    return (
        <div>
            <AdminHeader
                title="SEO Settings"
                subtitle="Manage global search engine optimization settings"
            />

            <div className="p-6">
                <Tabs value={activeLanguage} onValueChange={(v) => setActiveLanguage(v as LanguageCode)} className="mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <TabsList className="grid w-full sm:w-[400px] grid-cols-3">
                            <TabsTrigger value="en">English</TabsTrigger>
                            <TabsTrigger value="fr">Français</TabsTrigger>
                            <TabsTrigger value="ar">العربية</TabsTrigger>
                        </TabsList>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-[#606C38] hover:bg-[#4a5429] text-white w-full sm:w-auto"
                        >
                            {isSaving ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4 mr-2" />
                            )}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>

                    <div className="space-y-6">
                        {/* Localized Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-[#606C38]" />
                                    Localized Meta Tags ({activeLanguage.toUpperCase()})
                                </CardTitle>
                                <CardDescription>
                                    Define how your site appears in search results for this language
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="siteName">Site Name</Label>
                                        <Input
                                            id="siteName"
                                            value={currentLocalized.siteName}
                                            onChange={(e) => updateLocalized('siteName', e.target.value)}
                                            placeholder="Moroccan Organica"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="titleSuffix">Title Suffix</Label>
                                        <Input
                                            id="titleSuffix"
                                            value={currentLocalized.titleSuffix}
                                            onChange={(e) => updateLocalized('titleSuffix', e.target.value)}
                                            placeholder=" | Premium Argan Oil"
                                        />
                                        <p className="text-xs text-slate-500 mt-1">Appended to page titles (e.g. "Home | Moroccan Organica")</p>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="metaDescription">Default Meta Description</Label>
                                    <Textarea
                                        id="metaDescription"
                                        value={currentLocalized.defaultMetaDesc}
                                        onChange={(e) => updateLocalized('defaultMetaDesc', e.target.value)}
                                        placeholder="Discover the finest organic argan oil..."
                                        rows={3}
                                    />
                                    <p className="text-xs text-slate-500 mt-1">
                                        Used when a specific page doesn't have a custom description. Recommended: 150-160 chars.
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="keywords">Default Keywords</Label>
                                    <Input
                                        id="keywords"
                                        value={currentLocalized.defaultKeywords}
                                        onChange={(e) => updateLocalized('defaultKeywords', e.target.value)}
                                        placeholder="argan oil, organic, beauty, morocco"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Global Settings (Same for all languages) */}
                        <Card className="border-t-4 border-[#606C38]/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Share2 className="h-5 w-5 text-[#606C38]" />
                                    Global Social Media Settings
                                </CardTitle>
                                <CardDescription>
                                    These settings apply to all languages
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="ogImage">Default Social Image URL (OG Image)</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="ogImage"
                                            value={globalSettings.ogImage}
                                            onChange={(e) => updateGlobal('ogImage', e.target.value)}
                                            placeholder="https://.../image.jpg"
                                        />
                                        <Button variant="outline" size="icon">
                                            <ImageIcon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Absolute URL recommended. 1200x630 pixels.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="twitter">Twitter Handle</Label>
                                        <Input
                                            id="twitter"
                                            value={globalSettings.twitterHandle}
                                            onChange={(e) => updateGlobal('twitterHandle', e.target.value)}
                                            placeholder="@moroccanorganica"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="facebook">Facebook Page URL</Label>
                                        <Input
                                            id="facebook"
                                            value={globalSettings.facebookPage}
                                            onChange={(e) => updateGlobal('facebookPage', e.target.value)}
                                            placeholder="https://facebook.com/..."
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
