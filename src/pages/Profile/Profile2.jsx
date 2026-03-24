import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure2 from '../../hooks/useAxiosSecure2';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const Profile = () => {

  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    }
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2>{profile.displayName}</h2>
      <p>{profile.email}</p>
      <img src={profile.photoURL} alt="" width="100"/>
    </div>
  );
};

export default Profile;