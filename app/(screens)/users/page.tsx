import EmptyState from "@/app/components/EmptyState";
import UsersLayout from "./layout";

const UsersPage = () => {
  return (
    //@ts-expect-error Server Component
    <UsersLayout>
      <div className="hidden lg:block lg:pl-80 h-full">
        <EmptyState />
      </div>
    </UsersLayout>
  );
};

export default UsersPage;
