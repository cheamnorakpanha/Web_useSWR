import Users from "./api/components/User";

async function getUsers() {
  const res = await fetch("http://localhost:3000/api/users", {
    cache: "no-store",
  });

  return res.json();
}

export default async function Page() {
  const users = await getUsers();

  return <Users fallbackData={users} />;
}
