import PageMeta from "../../components/common/PageMeta";

import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="React.js SignIn Dashboard | Sarjan_Admin - Next.js Admin Dashboard Template"
        description="This is React.js SignIn Tables Dashboard page for Sarjan_Admin - React.js Tailwind CSS Admin Dashboard Template"
      />

      <SignInForm />
    </>
  );
}
