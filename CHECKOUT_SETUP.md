# Configuration Checkout - Stripe & PayPal

## ✅ Intégration Complète

Les intégrations Stripe et PayPal sont maintenant complètes avec les clés API fournies.

## 🔑 Variables d'Environnement

Ajoutez ces variables dans votre fichier `.env.local` :

```env
# Stripe API Keys
STRIPE_SECRET_KEY=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
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51R6wPIIyF1N47bdozKFkx0sumpCfUqrWwRJsoefO3SD1MNxgjOYlYN7MOwVHfrGv6Pe9xXmdYfgxn7GKFcIZyehI003HAqMx6I

# PayPal API Keys
PAYPAL_CLIENT_ID=ASHlp4YnXU8iZ1q6czZhX8Xc1k2HsHooFqbTUk1VsCFUAanzz-J-mX6Y5pB0M53_oBap69CarTdEXSUM
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
PAYPAL_MODE=live
NEXT_PUBLIC_PAYPAL_CLIENT_ID=ASHlp4YnXU8iZ1q6czZhX8Xc1k2HsHooFqbTUk1VsCFUAanzz-J-mX6Y5pB0M53_oBap69CarTdEXSUM
```

**Note:** Les clés Stripe sont déjà intégrées dans le code comme fallback, mais il est recommandé de les mettre dans `.env.local` pour la sécurité.

## 📦 Packages Installés

- `stripe` - SDK Stripe côté serveur
- `@stripe/stripe-js` - SDK Stripe côté client
- `@stripe/react-stripe-js` - Composants React pour Stripe
- `@paypal/paypal-server-sdk` - SDK PayPal côté serveur

## 🚀 Fonctionnalités

### Stripe
- ✅ Intégration complète avec Stripe Elements
- ✅ Support des cartes de crédit/débit
- ✅ Gestion des erreurs de paiement
- ✅ Support 3D Secure
- ✅ Sauvegarde automatique des commandes dans la base de données

### PayPal
- ✅ Intégration avec PayPal SDK
- ✅ Bouton PayPal intégré
- ✅ Capture automatique des paiements
- ✅ Sauvegarde automatique des commandes dans la base de données

## 📝 Structure des Fichiers

```
src/
├── app/
│   ├── [lang]/
│   │   └── checkout/
│   │       ├── page.tsx                    # Page checkout principale
│   │       ├── CheckoutClient.tsx          # Composant client checkout
│   │       └── success/
│   │           ├── page.tsx                # Page de succès
│   │           └── CheckoutSuccessClient.tsx
│   └── api/
│       └── checkout/
│           ├── stripe/
│           │   └── route.ts                # API route Stripe
│           └── paypal/
│               └── route.ts                # API route PayPal
├── components/
│   └── checkout/
│       └── StripeElements.tsx              # Composant Stripe Elements
└── actions/
    └── order.actions.ts                    # Actions pour sauvegarder les commandes
```

## 🔄 Flux de Paiement

### Stripe
1. L'utilisateur remplit le formulaire de checkout
2. Stripe Elements collecte les informations de la carte
3. Au clic sur "Complete Order", un PaymentMethod est créé
4. Le PaymentMethod est envoyé à `/api/checkout/stripe`
5. Un PaymentIntent est créé et confirmé
6. La commande est sauvegardée dans la base de données
7. Redirection vers la page de succès

### PayPal
1. L'utilisateur remplit le formulaire de checkout
2. L'utilisateur clique sur le bouton PayPal
3. PayPal ouvre sa fenêtre de paiement
4. Après approbation, PayPal capture le paiement
5. La commande est sauvegardée dans la base de données
6. Redirection vers la page de succès

## 🗄️ Base de Données

Les commandes sont sauvegardées avec :
- Informations client (Customer)
- Adresse de livraison (Address)
- Détails de la commande (Order)
- Articles de la commande (OrderItem)
- Référence de paiement (paymentId)
- Méthode de paiement (STRIPE ou PAYPAL)

## ⚠️ Notes Importantes

1. **Sécurité**: Les clés API sont actuellement hardcodées dans le code comme fallback. Pour la production, déplacez-les dans `.env.local`.

2. **PayPal Client Secret**: Vous devez ajouter le `PAYPAL_CLIENT_SECRET` dans votre fichier `.env.local`.

3. **Test**: Pour tester en mode sandbox, changez `PAYPAL_MODE` à `sandbox` et utilisez les clés de test.

4. **Variant ID**: Dans `order.actions.ts`, il y a un `defaultVariantId` qui doit être remplacé par la logique réelle de mapping des produits aux variants.

## 🐛 Dépannage

### Erreur Stripe
- Vérifiez que `STRIPE_SECRET_KEY` et `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` sont corrects
- Vérifiez que les clés sont en mode "live" si vous êtes en production

### Erreur PayPal
- Vérifiez que `PAYPAL_CLIENT_ID` et `PAYPAL_CLIENT_SECRET` sont corrects
- Vérifiez que `PAYPAL_MODE` est défini (live ou sandbox)
- Vérifiez que le script PayPal est chargé correctement

### Erreur de base de données
- Vérifiez que `DATABASE_URL` est correct dans `.env.local`
- Vérifiez que les migrations Prisma sont à jour : `npx prisma migrate dev`
