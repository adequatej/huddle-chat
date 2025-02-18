import { redirect } from 'next/navigation';
import { signIn, providerMap } from '@/app/auth';
import { AuthError } from 'next-auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

interface SignInPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function SignInPage(props: SignInPageProps) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-col items-center gap-4">
          <Image
            src="/logo.svg"
            alt="Huddle Chat Logo"
            width={128}
            height={128}
            className="m-auto"
          />
          <CardTitle className="text-2xl font-bold">Huddle Chat</CardTitle>
          <CardDescription>Sign in to Huddle Chat.</CardDescription>
          <Separator />
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {Object.values(providerMap).map((provider) => (
            <form
              key={provider.id}
              action={async () => {
                'use server';
                try {
                  await signIn(provider.id, {
                    redirectTo: searchParams?.callbackUrl ?? '',
                  });
                } catch (error) {
                  // Signin can fail for a number of reasons, such as the user
                  // not existing, or the user not having the correct role.
                  // In some cases, you may want to redirect to a custom error
                  if (error instanceof AuthError) {
                    return redirect(
                      `${process.env.AUTH_URL}?error=${error.type}`,
                    );
                  }

                  // Otherwise if a redirects happens Next.js can handle it
                  // so you can just re-thrown the error and let Next.js handle it.
                  // Docs:
                  // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
                  throw error;
                }
              }}
            >
              <Button variant={'secondary'} type="submit">
                <span>Sign in with {provider.name}</span>
              </Button>
            </form>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
