import { getSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next/types';

interface UserPageProps {
  user: User;
}

// gets a prop from getServerSideProps
function User({ user }: UserPageProps) {
  return (
    <div>
      <h4>User session:</h4>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <button onClick={() => signOut()}>Sign out</button> |{' '}
      <Link href="/">Home</Link>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  // redirect if not authenticated
  if (!session) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };
  }

  return {
    props: { user: session.user },
  };
}

export default User;
