export interface Translations {
  [key: string]: string;
}

const translations: Record<string, Translations> = {
  en: {
    // Navigation
    'nav.features': 'Features',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.signin': 'Sign In',
    'nav.getstarted': 'Get Started',
    
    // Hero section
    'hero.title': 'Streamline Your NGO Operations',
    'hero.subtitle': 'Empower your organization with advanced project management, team collaboration, and progress tracking designed specifically for NGOs and non-profit organizations.',
    'hero.startTrial': 'Start Free Trial',
    'hero.watchDemo': 'Watch Demo',
    
    // Features
    'features.title': 'Everything Your NGO Needs',
    'features.subtitle': 'From project planning to progress tracking, ADEL provides all the tools needed for effective NGO management in one integrated platform.',
    'features.teamManagement': 'Team Management',
    'features.teamManagementDesc': 'Organize your team with role-based access. Admins manage projects while officers submit reports seamlessly.',
    'features.progressTracking': 'Progress Tracking',
    'features.progressTrackingDesc': 'Visualize project progress with interactive charts and reports based on approved submissions.',
    'features.reportSubmissions': 'Report Submissions',
    'features.reportSubmissionsDesc': 'Upload progress reports with photos and files. Streamlined approval workflow ensures data quality.',
    'features.budgetManagement': 'Budget Management',
    'features.budgetManagementDesc': 'Set project budgets, track expenses, and maintain financial transparency across all initiatives.',
    'features.mobileOptimized': 'Mobile Optimized',
    'features.mobileOptimizedDesc': 'Access ADEL from anywhere with mobile-friendly design optimized for low-bandwidth environments.',
    'features.multilingualSupport': 'Multilingual Support',
    'features.multilingualSupportDesc': 'Work in English or French with full interface translation and localized content support.',
    
    // Workflow
    'workflow.title': 'Simple Workflow, Powerful Results',
    'workflow.subtitle': 'Get started in minutes with our streamlined onboarding process',
    'workflow.step1': 'Register Organization',
    'workflow.step1Desc': 'Admin creates organization account and receives unique organization code for team members.',
    'workflow.step2': 'Team Collaboration',
    'workflow.step2Desc': 'Officers join using organization code. Admin creates projects and officers submit progress reports.',
    'workflow.step3': 'Track Progress',
    'workflow.step3Desc': 'Admin approves reports and progress is automatically tracked with visual charts and analytics.',
    
    // Auth
    'auth.welcomeBack': 'Welcome Back',
    'auth.signInSubtitle': 'Sign in to your ADEL account',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.rememberMe': 'Remember me',
    'auth.forgotPassword': 'Forgot password?',
    'auth.signIn': 'Sign In',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.signUpHere': 'Sign up here',
    'auth.getStarted': 'Get Started with ADEL',
    'auth.chooseType': 'Choose your registration type',
    'auth.admin': 'Admin',
    'auth.adminDesc': 'Register organization',
    'auth.officer': 'Officer',
    'auth.officerDesc': 'Join organization',
    'auth.firstName': 'First Name',
    'auth.lastName': 'Last Name',
    'auth.organizationName': 'Organization Name',
    'auth.organizationCode': 'Organization Code',
    'auth.createOrganization': 'Create Organization',
    'auth.joinOrganization': 'Join Organization',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.signInHere': 'Sign in here',
    
    // Organization
    'organizationInfo': 'Organization Information',
    'manageYourOrganization': 'Manage your organization details',
    'invitationCode': 'Invitation Code',
    'shareThisCodeWithTeam': 'Share this code with your team members to join',
    'createdDate': 'Created Date',
    'organizationCodeCopied': 'Organization code copied to clipboard!',
    'success': 'Success',
    'error': 'Error',
    
    // Dashboard
    'dashboard.activeProjects': 'Active Projects',
    'dashboard.pendingReports': 'Pending Reports',
    'dashboard.teamMembers': 'Team Members',
    'dashboard.totalBudget': 'Total Budget',
    'dashboard.recentProjects': 'Recent Projects',
    'dashboard.pendingApprovals': 'Pending Approvals',
    'dashboard.approve': 'Approve',
    'dashboard.reject': 'Reject',
    'dashboard.myProjects': 'My Projects',
    'dashboard.reportsSubmitted': 'Reports Submitted',
    'dashboard.pendingReview': 'Pending Review',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.submitNewReport': 'Submit New Report',
    'dashboard.viewMyProjects': 'View My Projects',
    'dashboard.recentSubmissions': 'Recent Submissions',
    
    // Footer
    'footer.description': 'Empowering NGOs and non-profit organizations with modern project management tools to maximize their social impact.',
    'footer.platform': 'Platform',
    'footer.support': 'Support',
    'footer.demo': 'Demo',
    'footer.pricing': 'Pricing',
    'footer.help': 'Help Center',
    'footer.documentation': 'Documentation',
    'footer.training': 'Training',
    'footer.contact': 'Contact Us',
    'footer.newsletter.title': 'Stay Updated',
    'footer.newsletter.subtitle': 'Get the latest updates and NGO management insights delivered to your inbox.',
    'footer.newsletter.placeholder': 'Enter your email',
    'footer.newsletter.subscribe': 'Subscribe',
    'footer.rights': 'All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.cookies': 'Cookie Policy',
  },
  fr: {
    // Navigation
    'nav.features': 'Fonctionnalités',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'nav.signin': 'Se connecter',
    'nav.getstarted': 'Commencer',
    
    // Hero section
    'hero.title': 'Rationalisez vos opérations ONG',
    'hero.subtitle': 'Renforcez votre organisation avec une gestion de projet avancée, une collaboration d\'équipe et un suivi des progrès conçus spécifiquement pour les ONG et les organisations à but non lucratif.',
    'hero.startTrial': 'Essai gratuit',
    'hero.watchDemo': 'Voir la démo',
    
    // Features
    'features.title': 'Tout ce dont votre ONG a besoin',
    'features.subtitle': 'De la planification de projet au suivi des progrès, ADEL fournit tous les outils nécessaires pour une gestion efficace des ONG dans une plateforme intégrée.',
    'features.teamManagement': 'Gestion d\'équipe',
    'features.teamManagementDesc': 'Organisez votre équipe avec un accès basé sur les rôles. Les administrateurs gèrent les projets tandis que les agents soumettent des rapports en toute transparence.',
    'features.progressTracking': 'Suivi des progrès',
    'features.progressTrackingDesc': 'Visualisez les progrès du projet avec des graphiques interactifs et des rapports basés sur les soumissions approuvées.',
    'features.reportSubmissions': 'Soumissions de rapports',
    'features.reportSubmissionsDesc': 'Téléchargez des rapports de progrès avec des photos et des fichiers. Le flux de travail d\'approbation rationalisé garantit la qualité des données.',
    'features.budgetManagement': 'Gestion budgétaire',
    'features.budgetManagementDesc': 'Définissez les budgets de projet, suivez les dépenses et maintenez la transparence financière dans toutes les initiatives.',
    'features.mobileOptimized': 'Optimisé mobile',
    'features.mobileOptimizedDesc': 'Accédez à ADEL de n\'importe où avec une conception adaptée aux mobiles optimisée pour les environnements à faible bande passante.',
    'features.multilingualSupport': 'Support multilingue',
    'features.multilingualSupportDesc': 'Travaillez en anglais ou en français avec une traduction complète de l\'interface et un support de contenu localisé.',
    
    // Workflow
    'workflow.title': 'Flux de travail simple, résultats puissants',
    'workflow.subtitle': 'Commencez en quelques minutes avec notre processus d\'intégration rationalisé',
    'workflow.step1': 'Enregistrer l\'organisation',
    'workflow.step1Desc': 'L\'administrateur crée un compte d\'organisation et reçoit un code d\'organisation unique pour les membres de l\'équipe.',
    'workflow.step2': 'Collaboration d\'équipe',
    'workflow.step2Desc': 'Les agents rejoignent en utilisant le code d\'organisation. L\'administrateur crée des projets et les agents soumettent des rapports de progrès.',
    'workflow.step3': 'Suivre les progrès',
    'workflow.step3Desc': 'L\'administrateur approuve les rapports et les progrès sont automatiquement suivis avec des graphiques visuels et des analyses.',
    
    // Auth
    'auth.welcomeBack': 'Bon retour',
    'auth.signInSubtitle': 'Connectez-vous à votre compte ADEL',
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.rememberMe': 'Se souvenir de moi',
    'auth.forgotPassword': 'Mot de passe oublié?',
    'auth.signIn': 'Se connecter',
    'auth.dontHaveAccount': "Vous n'avez pas de compte?",
    'auth.signUpHere': 'Inscrivez-vous ici',
    'auth.getStarted': 'Commencer avec ADEL',
    'auth.chooseType': 'Choisissez votre type d\'inscription',
    'auth.admin': 'Administrateur',
    'auth.adminDesc': 'Enregistrer l\'organisation',
    'auth.officer': 'Agent',
    'auth.officerDesc': 'Rejoindre l\'organisation',
    'auth.firstName': 'Prénom',
    'auth.lastName': 'Nom',
    'auth.organizationName': 'Nom de l\'organisation',
    'auth.organizationCode': 'Code d\'organisation',
    'auth.createOrganization': 'Créer une organisation',
    'auth.joinOrganization': 'Rejoindre l\'organisation',
    'auth.alreadyHaveAccount': 'Vous avez déjà un compte?',
    'auth.signInHere': 'Connectez-vous ici',
    
    // Dashboard
    'dashboard.activeProjects': 'Projets actifs',
    'dashboard.pendingReports': 'Rapports en attente',
    'dashboard.teamMembers': 'Membres de l\'équipe',
    'dashboard.totalBudget': 'Budget total',
    'dashboard.recentProjects': 'Projets récents',
    'dashboard.pendingApprovals': 'Approbations en attente',
    'dashboard.approve': 'Approuver',
    'dashboard.reject': 'Rejeter',
    'dashboard.myProjects': 'Mes projets',
    'dashboard.reportsSubmitted': 'Rapports soumis',
    'dashboard.pendingReview': 'En attente d\'examen',
    'dashboard.quickActions': 'Actions rapides',
    'dashboard.submitNewReport': 'Soumettre un nouveau rapport',
    'dashboard.viewMyProjects': 'Voir mes projets',
    'dashboard.recentSubmissions': 'Soumissions récentes',
    
    // Footer
    'footer.description': 'Autonomiser les ONG et les organisations à but non lucratif avec des outils modernes de gestion de projet pour maximiser leur impact social.',
    'footer.platform': 'Plateforme',
    'footer.support': 'Support',
    'footer.demo': 'Démo',
    'footer.pricing': 'Tarifs',
    'footer.help': 'Centre d\'aide',
    'footer.documentation': 'Documentation',
    'footer.training': 'Formation',
    'footer.contact': 'Nous contacter',
    'footer.newsletter.title': 'Restez informé',
    'footer.newsletter.subtitle': 'Recevez les dernières mises à jour et conseils de gestion d\'ONG directement dans votre boîte mail.',
    'footer.newsletter.placeholder': 'Entrez votre email',
    'footer.newsletter.subscribe': 'S\'abonner',
    'footer.rights': 'Tous droits réservés.',
    'footer.privacy': 'Politique de confidentialité',
    'footer.terms': 'Conditions d\'utilisation',
    'footer.cookies': 'Politique des cookies',
  },
};

let currentLanguage: string = 'en';

export function setLanguage(lang: string) {
  if (translations[lang]) {
    currentLanguage = lang;
    localStorage.setItem('adelLanguage', lang);
  }
}

export function getCurrentLanguage(): string {
  return currentLanguage;
}

export function t(key: string): string {
  return translations[currentLanguage]?.[key] || key;
}

export function initializeLanguage() {
  const savedLang = localStorage.getItem('adelLanguage');
  if (savedLang && translations[savedLang]) {
    currentLanguage = savedLang;
  }
}
