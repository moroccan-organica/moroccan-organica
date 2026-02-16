'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { AdminHeader } from '@/features/admin/components/AdminHeader';
import { PostsTable } from '@/features/blog/components/PostsTable';
import { PostForm } from '@/features/blog/components/PostForm';
import { StatsOverview } from '@/features/blog/components/StatsOverview';
import { QuickActionsGrid } from '@/features/blog/components/QuickActions';
import { 
  useBlogPosts, 
  useBlogCategories, 
  useCreateBlogPost,
  useUpdateBlogPost,
  usePublishBlogPost,
  useArchiveBlogPost,
  useCreateBlogCategory, 
  useDeleteBlogCategory,
} from '@/features/blog/hooks';
import type { BlogPost, BlogCategory } from '@/types/blog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, FileText, FolderOpen, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ViewType = 'dashboard' | 'posts' | 'categories' | 'editor';

interface CategoryWithCount extends BlogCategory {
  postCount?: number;
}

const translations = {
  en: {
    title: 'Blog Management',
    subtitle: 'Create, edit and manage your blog posts',
    tabs: {
      dashboard: 'Dashboard',
      posts: 'Posts',
      categories: 'Categories',
    },
    posts: {
      allPosts: 'All Posts',
      recentPosts: 'Recent Posts',
      searchPlaceholder: 'Search posts...',
      refresh: 'Refresh',
      gridView: 'Grid View',
      tableView: 'Table View',
      archives: 'Archives',
      addPost: 'New Post',
      filterTitle: 'Filters',
      clearAll: 'Clear All',
      status: 'Status',
      category: 'Category',
      noPostsFound: 'No posts found',
      noPostsMatchFilter: 'No posts match your current filters',
      clearFilters: 'Clear filters',
      viewAll: 'View All',
      table: {
        title: 'Title',
        status: 'Status',
        category: 'Category',
        actions: 'Actions',
      },
      actions: {
        view: 'View',
        edit: 'Edit',
        publish: 'Publish',
        archive: 'Archive',
        delete: 'Delete',
      },
      statusLabels: {
        published: 'Published',
        draft: 'Draft',
        review: 'In Review',
        archived: 'Archived',
      },
    },
    stats: {
      totalArticles: 'Total Articles',
      totalArticlesDelta: '{count} articles total',
      totalArticlesDescription: 'All your blog content',
      noArticles: 'No articles yet',
      published: 'Published',
      publishedDelta: '{percentage}% ({count})',
      publishedDescription: 'Live on your blog',
      noPublished: 'No published articles',
      inReview: 'In Review',
      inReviewDelta: '{percentage}% ({count})',
      inReviewDescription: 'Awaiting approval',
      noInReview: 'None in review',
      drafts: 'Drafts',
      draftsDelta: '{percentage}% ({count})',
      draftsDescription: 'Work in progress',
      noDrafts: 'No drafts',
    },
    quickActions: {
      title: 'Quick Actions',
      newPost: 'New Post',
      newPostDescription: 'Create a new blog article',
      categories: 'Categories',
      categoriesDescription: 'Manage your categories',
      mediaLibrary: 'Media Library',
      mediaLibraryDescription: 'Upload and manage media',
      viewBlog: 'View Blog',
      viewBlogDescription: 'See your live blog',
    },
    categories: {
      title: 'Categories',
      addCategory: 'Add Category',
      name: 'Name',
      description: 'Description',
      color: 'Color',
      posts: 'Posts',
      actions: 'Actions',
      noCategories: 'No categories yet',
      createFirst: 'Create your first category to organize your blog posts',
    },
    form: {
      cancel: 'Cancel',
    },
  },
  fr: {
    title: 'Gestion du Blog',
    subtitle: 'Créer, modifier et gérer vos articles de blog',
    tabs: {
      dashboard: 'Tableau de bord',
      posts: 'Articles',
      categories: 'Catégories',
    },
    posts: {
      allPosts: 'Tous les articles',
      recentPosts: 'Articles récents',
      searchPlaceholder: 'Rechercher des articles...',
      refresh: 'Rafraîchir',
      gridView: 'Vue Grille',
      tableView: 'Vue Tableau',
      archives: 'Archives',
      addPost: 'Nouvel Article',
      filterTitle: 'Filtres',
      clearAll: 'Effacer tout',
      status: 'Statut',
      category: 'Catégorie',
      noPostsFound: 'Aucun article trouvé',
      noPostsMatchFilter: 'Aucun article ne correspond à vos filtres',
      clearFilters: 'Effacer les filtres',
      viewAll: 'Voir tout',
      table: {
        title: 'Titre',
        status: 'Statut',
        category: 'Catégorie',
        actions: 'Actions',
      },
      actions: {
        view: 'Voir',
        edit: 'Modifier',
        publish: 'Publier',
        archive: 'Archiver',
        delete: 'Supprimer',
      },
      statusLabels: {
        published: 'Publié',
        draft: 'Brouillon',
        review: 'En révision',
        archived: 'Archivé',
      },
    },
    stats: {
      totalArticles: 'Total Articles',
      totalArticlesDelta: '{count} articles au total',
      totalArticlesDescription: 'Tout votre contenu',
      noArticles: 'Aucun article',
      published: 'Publiés',
      publishedDelta: '{percentage}% ({count})',
      publishedDescription: 'En ligne sur votre blog',
      noPublished: 'Aucun article publié',
      inReview: 'En révision',
      inReviewDelta: '{percentage}% ({count})',
      inReviewDescription: 'En attente d\'approbation',
      noInReview: 'Aucun en révision',
      drafts: 'Brouillons',
      draftsDelta: '{percentage}% ({count})',
      draftsDescription: 'Travaux en cours',
      noDrafts: 'Aucun brouillon',
    },
    quickActions: {
      title: 'Actions Rapides',
      newPost: 'Nouveau Post',
      newPostDescription: 'Créer un nouvel article',
      categories: 'Catégories',
      categoriesDescription: 'Gérer vos catégories',
      mediaLibrary: 'Médiathèque',
      mediaLibraryDescription: 'Télécharger et gérer les médias',
      viewBlog: 'Voir le Blog',
      viewBlogDescription: 'Voir votre blog en ligne',
    },
    categories: {
      title: 'Catégories',
      addCategory: 'Ajouter une catégorie',
      name: 'Nom',
      description: 'Description',
      color: 'Couleur',
      posts: 'Articles',
      actions: 'Actions',
      noCategories: 'Aucune catégorie',
      createFirst: 'Créez votre première catégorie pour organiser vos articles',
    },
    form: {
      cancel: 'Annuler',
    },
  },
};

export default function BlogAdminPage() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';
  const t = translations[lang as keyof typeof translations] || translations.en;

  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#606C38');

  // Hooks
  const { data: postsData, refetch: refetchPosts, isLoading: postsLoading } = useBlogPosts({ pageSize: 100 });
  const { data: categoriesData = [], isLoading: categoriesLoading } = useBlogCategories();
  
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const publishPost = usePublishBlogPost();
  const archivePost = useArchiveBlogPost();
  const createCategory = useCreateBlogCategory();
  const deleteCategory = useDeleteBlogCategory();

  const posts = useMemo(() => postsData?.data || [], [postsData]);
  const categories = useMemo(() => categoriesData as CategoryWithCount[], [categoriesData]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetchPosts();
    setIsRefreshing(false);
  }, [refetchPosts]);

  const handleCreatePost = useCallback(() => {
    setEditingPost(null);
    setCurrentView('editor');
  }, []);

  const handleEditPost = useCallback((post: BlogPost) => {
    setEditingPost(post);
    setCurrentView('editor');
  }, []);

  const handlePostAction = useCallback(async (post: BlogPost, action: 'archive' | 'publish') => {
    if (action === 'publish') {
      await publishPost.mutateAsync(post.id);
    } else if (action === 'archive') {
      await archivePost.mutateAsync(post.id);
    }
  }, [publishPost, archivePost]);

  const handleSavePost = useCallback(async (data: Partial<BlogPost>) => {
    const postInput = {
      title: data.title || '',
      titleAr: data.title_ar,
      content: data.content,
      contentAr: data.content_ar,
      excerpt: data.excerpt,
      excerptAr: data.excerpt_ar,
      categoryId: data.category_id,
      tags: data.tags,
      featuredImageUrl: data.featured_image_url,
      status: data.status,
    };

    if (editingPost) {
      await updatePost.mutateAsync({ postId: editingPost.id, input: postInput });
    } else {
      await createPost.mutateAsync(postInput);
    }
    
    setCurrentView('posts');
    setEditingPost(null);
    await refetchPosts();
  }, [editingPost, updatePost, createPost, refetchPosts]);

  const handleCancelEdit = useCallback(() => {
    setCurrentView(editingPost ? 'posts' : 'dashboard');
    setEditingPost(null);
  }, [editingPost]);

  const handleCreateCategory = useCallback(async () => {
    if (!newCategoryName.trim()) return;
    
    await createCategory.mutateAsync({
      name: newCategoryName,
      description: newCategoryDescription,
      color: newCategoryColor,
    });
    
    setCategoryDialogOpen(false);
    setNewCategoryName('');
    setNewCategoryDescription('');
    setNewCategoryColor('#606C38');
  }, [newCategoryName, newCategoryDescription, newCategoryColor, createCategory]);

  const handleDeleteCategory = useCallback(async (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await deleteCategory.mutateAsync(categoryId);
    }
  }, [deleteCategory]);

  // Show editor view
  if (currentView === 'editor') {
    return (
      <div className="min-h-screen bg-slate-50">
        <PostForm
          post={editingPost || undefined}
          categories={categories}
          onSave={handleSavePost}
          onCancel={handleCancelEdit}
          isLoading={createPost.isPending || updatePost.isPending}
        />
      </div>
    );
  }

  const isLoading = postsLoading || categoriesLoading;

  return (
    <div>
      <AdminHeader title={t.title} subtitle={t.subtitle} />

      <div className="p-6">
        <Tabs 
          value={currentView} 
          onValueChange={(v) => setCurrentView(v as ViewType)}
          className="w-full"
        >
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-white border border-slate-200">
              <TabsTrigger value="dashboard" className="gap-2">
                <LayoutDashboard className="h-4 w-4" />
                {t.tabs.dashboard}
              </TabsTrigger>
              <TabsTrigger value="posts" className="gap-2">
                <FileText className="h-4 w-4" />
                {t.tabs.posts}
              </TabsTrigger>
              <TabsTrigger value="categories" className="gap-2">
                <FolderOpen className="h-4 w-4" />
                {t.tabs.categories}
              </TabsTrigger>
            </TabsList>

            <Button
              onClick={handleCreatePost}
              className="bg-[#606C38] hover:bg-[#4a5429] text-white gap-2"
            >
              <Plus className="h-4 w-4" />
              {t.posts.addPost}
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-[#606C38]" />
            </div>
          ) : (
            <>
              <TabsContent value="dashboard" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <StatsOverview 
                      posts={posts}
                      isLoading={postsLoading}
                      translations={t.stats}
                    />
                    <PostsTable
                      posts={posts.slice(0, 5)}
                      categories={categories}
                      onEdit={handleEditPost}
                      onCreatePost={handleCreatePost}
                      onAction={handlePostAction}
                      onRefresh={handleRefresh}
                      isRefreshing={isRefreshing}
                      viewMode="compact"
                      onViewAll={() => setCurrentView('posts')}
                      translations={t.posts}
                    />
                  </div>
                  <div>
                    <QuickActionsGrid
                      onCreatePost={handleCreatePost}
                      onManageCategories={() => setCurrentView('categories')}
                      onViewLiveBlog={() => window.open(`/${lang}/blog`, '_blank')}
                      translations={t.quickActions}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="posts" className="mt-0">
                <PostsTable
                  posts={posts}
                  categories={categories}
                  onEdit={handleEditPost}
                  onCreatePost={handleCreatePost}
                  onAction={handlePostAction}
                  onRefresh={handleRefresh}
                  isRefreshing={isRefreshing}
                  viewMode="full"
                  translations={t.posts}
                />
              </TabsContent>

              <TabsContent value="categories" className="mt-0">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">{t.categories.title}</h2>
                    <Button
                      onClick={() => setCategoryDialogOpen(true)}
                      className="bg-[#606C38] hover:bg-[#4a5429] text-white gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      {t.categories.addCategory}
                    </Button>
                  </div>

                  {categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                      <FolderOpen className="h-12 w-12 text-slate-200 mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900">{t.categories.noCategories}</h3>
                      <p className="text-sm text-slate-500 max-w-xs mt-2">{t.categories.createFirst}</p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                          <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">{t.categories.name}</th>
                          <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">{t.categories.description}</th>
                          <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">{t.categories.color}</th>
                          <th className="text-center px-6 py-4 text-xs font-semibold text-slate-500 uppercase">{t.categories.posts}</th>
                          <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase">{t.categories.actions}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {categories.map((category) => (
                          <tr key={category.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-slate-900">{category.name}</td>
                            <td className="px-6 py-4 text-sm text-slate-500">{category.description || '-'}</td>
                            <td className="px-6 py-4">
                              <div 
                                className="h-6 w-6 rounded-full border border-slate-200"
                                style={{ backgroundColor: category.color || '#606C38' }}
                              />
                            </td>
                            <td className="px-6 py-4 text-center text-sm text-slate-600">
                              {category.postCount || 0}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteCategory(category.id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>

      {/* Create Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.categories.addCategory}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">{t.categories.name}</Label>
              <Input
                id="category-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-description">{t.categories.description}</Label>
              <Input
                id="category-description"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                placeholder="Description (optional)..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-color">{t.categories.color}</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="category-color"
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                  className="h-10 w-20 rounded border border-slate-200 cursor-pointer"
                />
                <span className="text-sm text-slate-500">{newCategoryColor}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
              {t.form.cancel}
            </Button>
            <Button
              onClick={handleCreateCategory}
              disabled={!newCategoryName.trim() || createCategory.isPending}
              className="bg-[#606C38] hover:bg-[#4a5429]"
            >
              {createCategory.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t.categories.addCategory
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
