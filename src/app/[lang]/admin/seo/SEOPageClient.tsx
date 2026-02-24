'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { toast } from 'react-hot-toast';
import {
    Save,
    Globe,
    FileText,
    Image as ImageIcon,
    Share2,
    Loader2,
    Upload,
    Trash2,
    ExternalLink
} from 'lucide-react';
import { useSEOSettings, useUpdateSEOSettings } from '@/lib/seo/hooks';
import { LanguageCode, GlobalSettings, LocalizedSettings } from '@/types/seo';
import { uploadProductImage } from '@/actions/media.actions';
import { SafeImage } from '@/components/ui/safe-image';

const DEFAULT_LOCALIZED: LocalizedSettings = {
    siteName: 'Moroccan Organica',
    titleSuffix: ' | Premium Argan Oil',
    defaultMetaDesc: '',
    defaultKeywords: ''
};

export function SEOPageClient() {
    const [activeLanguage, setActiveLanguage] = useState<LanguageCode>('en');

    // Hooks
    const { data: settings, isLoading } = useSEOSettings();
    const updateSettings = useUpdateSEOSettings();
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const result = await uploadProductImage(formData);
            if (result.success && result.url) {
                updateGlobal('ogImage', result.url);
            } else {
                alert('Failed to upload image: ' + result.error);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('An error occurred while uploading the image');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
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
                                    <Label htmlFor="ogImage">Default Social Image (OG Image)</Label>
                                    <div className="mt-2 space-y-4">
                                        {globalSettings.ogImage ? (
                                            <div className="relative w-full aspect-[1.91/1] max-w-[400px] rounded-lg overflow-hidden border border-slate-200 group">
                                                <SafeImage
                                                    src={globalSettings.ogImage}
                                                    alt="OG Image Preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => updateGlobal('ogImage', '')}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        asChild
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <a href={globalSettings.ogImage} target="_blank" rel="noopener noreferrer">
                                                            <ExternalLink className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full aspect-[1.91/1] max-w-[400px] rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#606C38] hover:bg-slate-50 transition-all"
                                            >
                                                {isUploading ? (
                                                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                                                ) : (
                                                    <>
                                                        <Upload className="h-8 w-8 text-slate-400" />
                                                        <span className="text-sm text-slate-500 font-medium">Click to upload social image</span>
                                                        <span className="text-xs text-slate-400">1200x630px recommended</span>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <Input
                                                id="ogImage"
                                                value={globalSettings.ogImage}
                                                onChange={(e) => updateGlobal('ogImage', e.target.value)}
                                                placeholder="Or enter absolute URL: https://.../image.jpg"
                                            />
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={isUploading}
                                                title="Upload Image"
                                            >
                                                {isUploading ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Upload className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>

                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                            className="hidden"
                                        />

                                        <p className="text-xs text-slate-500">
                                            This image will be shown when your website link is shared on social media (Facebook, Twitter, WhatsApp, etc).
                                        </p>
                                    </div>
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
