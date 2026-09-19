export type Dictionary = {
  common: {
    loading: string;
    error: string;
    retry: string;
    save: string;
    cancel: string;
    confirm: string;
    delete: string;
    edit: string;
    back: string;
    close: string;
    search: string;
    noResults: string;
  };
  auth: {
    login: {
      title: string;
      subtitle: string;
      emailLabel: string;
      emailPlaceholder: string;
      passwordLabel: string;
      passwordPlaceholder: string;
      submitButton: string;
      submittingButton: string;
      forgotPassword: string;
      noAccount: string;
      signUp: string;
      errors: {
        invalidCredentials: string;
        tooManyAttempts: string;
        serverError: string;
        emailRequired: string;
        emailInvalid: string;
        passwordRequired: string;
        passwordMinLength: string;
      };
    };
    logout: {
      button: string;
      success: string;
    };
  };
  dashboard: {
    title: string;
    welcome: string;
    navigation: {
      dashboard: string;
      profile: string;
      settings: string;
    };
  };
  errors: {
    notFound: {
      title: string;
      description: string;
      backHome: string;
    };
    serverError: {
      title: string;
      description: string;
      retry: string;
    };
  };
};

export const en: Dictionary = {
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Try again',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    close: 'Close',
    search: 'Search',
    noResults: 'No results found',
  },
  auth: {
    login: {
      title: 'Welcome back',
      subtitle: 'Sign in to your account to continue',
      emailLabel: 'Email address',
      emailPlaceholder: 'you@example.com',
      passwordLabel: 'Password',
      passwordPlaceholder: '••••••••',
      submitButton: 'Sign in',
      submittingButton: 'Signing in...',
      forgotPassword: 'Forgot your password?',
      noAccount: "Don't have an account?",
      signUp: 'Sign up',
      errors: {
        invalidCredentials: 'Invalid email or password.',
        tooManyAttempts: 'Too many attempts. Please try again later.',
        serverError: 'Something went wrong. Please try again.',
        emailRequired: 'Email is required.',
        emailInvalid: 'Please enter a valid email address.',
        passwordRequired: 'Password is required.',
        passwordMinLength: 'Password must be at least 8 characters.',
      },
    },
    logout: {
      button: 'Sign out',
      success: 'You have been signed out.',
    },
  },
  dashboard: {
    title: 'Dashboard',
    welcome: 'Welcome back, {name}!',
    navigation: {
      dashboard: 'Dashboard',
      profile: 'Profile',
      settings: 'Settings',
    },
  },
  errors: {
    notFound: {
      title: 'Page not found',
      description: "The page you're looking for doesn't exist.",
      backHome: 'Back to home',
    },
    serverError: {
      title: 'Something went wrong',
      description: 'An unexpected error occurred. Please try again.',
      retry: 'Try again',
    },
  },
};
