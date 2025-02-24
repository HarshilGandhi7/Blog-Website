import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loading from "@/components/Loading";
import { MdDelete } from "react-icons/md";
import { showToast } from "@/helper/showToast";
import UserIcon from "@/assets/userIcon.png";

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/user/get-all-users`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const responseData = await response.json();

        if (response.ok) {
          setUsers(responseData.users);
        } else {
          setError(responseData.message);
        }

      } catch (error) {
        showToast("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [refresh]);

  const handleDelete = async (userid) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/delete-user/${userid}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const responseData = await response.json();
      if (response.ok) {
        showToast("success", "User deleted successfully");
        setRefresh(!refresh);
      } else {
        setError(responseData.message);
      }
    } catch (error) {
      showToast("Failed to delete User");
    }
  };

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Card>
        <CardContent>
          <Table>
            <TableCaption>A list of the Users.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Avatar</TableHead>
                <TableHead>Dated</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user?.role}</TableCell>
                    <TableCell>{user?.name}</TableCell>
                    <TableCell>{user?.email}</TableCell>
                    <TableCell>
                      <img
                        src={user?.avatar || UserIcon}
                        alt="avatar"
                        className="w-10 h-10 rounded-full"
                      />
                    </TableCell>
                    <TableCell>{new Date(user?.createdAt).toDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button onClick={() => handleDelete(user._id)}>
                          <MdDelete />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="3">No Users found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetails;
