import Image from "next/image";
import AuthForm from "./components/AuthForm";
import { GiThunderStruck } from "react-icons/gi";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col py-12 sm:px-6 lg:px-8 bg-gray-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <GiThunderStruck className="h-[48px]  text-sky-500 mx-auto w-auto" />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
      </div>

      {/* Authentication form */}
      <AuthForm />
    </div>
  );
}
