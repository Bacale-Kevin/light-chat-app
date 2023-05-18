import EmptyState from "@/app/components/EmptyState";
import UsersLayout from "./UsersLayout";

const UsersPage = () => {
  return (
    <UsersLayout>
      <div className="hidden lg:block lg:pl-80 h-full">
        <EmptyState />
      </div>
    </UsersLayout>
  );
};

export default UsersPage;
