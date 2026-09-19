import type { Metadata } from 'next';
import { getDictionary, type Locale } from '@/lib/i18n';
import { LoginForm } from '@/features/auth/components/login-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface LoginPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return {
    title: dict.auth.login.title,
    description: dict.auth.login.subtitle,
  };
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo / Brand */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl">
            N
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dict.auth.login.title}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {dict.auth.login.subtitle}
          </p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="sr-only">Login form</CardTitle>
            <CardDescription className="sr-only">
              Enter your credentials to sign in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm lang={lang} dict={dict.auth.login} />
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          {dict.auth.login.noAccount}{' '}
          <a
            href="#"
            className="font-medium text-primary underline-offset-4 hover:underline"
            aria-label="Navigate to sign up page"
          >
            {dict.auth.login.signUp}
          </a>
        </p>
      </div>
    </main>
  );
}
