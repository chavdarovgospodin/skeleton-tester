import { useState, useEffect } from 'react';
import { getProfiles } from '../services/api';
import type { Profile } from '../interfaces/ProfileInterface';
import { getProfileId } from '../services/utils';

export const useProfileData = () => {
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [clientProfiles, setClientProfiles] = useState<Profile[]>([]);
  const [contractorProfiles, setContractorProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const data = await getProfiles();
        setAllProfiles(data);
        setContractorProfiles(
          data.filter((profile: Profile) => profile.type === 'contractor')
        );
        setClientProfiles(
          data.filter((profile: Profile) => profile.type === 'client')
        );
      } catch (err) {
        setError('Failed to load profiles');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const getLoggedInBalance = (): number | null => {
    const profileId = getProfileId();
    if (!profileId) return null;
    const userProfile = allProfiles.find(
      (profile) => profile.id === parseInt(profileId)
    );
    return userProfile ? userProfile.balance : null;
  };

  return {
    isLoading,
    error,
    clientProfiles,
    contractorProfiles,
    getLoggedInBalance,
  };
};
