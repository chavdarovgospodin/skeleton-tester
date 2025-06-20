import React, { useState, useEffect, useMemo } from 'react';
import { Typography, Box } from '@mui/material';
import { getJobsByContractorId, payJob } from '../services/api';
import { useSnackbar } from '../contexts/SnackBar';
import Loading from '../components/Loading';
import JobsTable from '../components/JobsTable';
import type { Job } from '../interfaces/JobInterface';
import { getProfileBalance, setProfileBalance } from '../services/utils';
import { useParams } from 'react-router-dom';
import { useProfileData } from '../hooks/useProfileData';

const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isJobsLoading, setIsJobsLoading] = useState(true);
  const [isPayLoading, setIsPayLoading] = useState(false);
  const { contractorProfiles, isLoading } = useProfileData();

  const balance = getProfileBalance();

  const { contractorId } = useParams();
  const contractor = contractorProfiles.find(
    (contractor) => Number(contractor.id) === Number(contractorId)
  );
  const { showSuccess, showError } = useSnackbar();

  useEffect(() => {
    const fetchContractorJobs = async () => {
      try {
        const data = await getJobsByContractorId(Number(contractorId));

        setJobs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsJobsLoading(false);
      }
    };
    fetchContractorJobs();
  }, [contractorId]);

  const handlePayJob = async (jobId: number, price: number) => {
    try {
      setIsPayLoading(true);

      await payJob(jobId);

      const balance = getProfileBalance();

      setProfileBalance((Number(balance) - price).toString());
      showSuccess('Payment successful!');

      const updatedJobs = await getJobsByContractorId(Number(contractorId));

      setJobs(updatedJobs);
    } catch (err: any) {
      showError(err.response?.data?.error || 'Payment failed');
      console.error(err);
    } finally {
      setIsPayLoading(false);
    }
  };

  const unpaidJobs = useMemo(() => jobs.filter((job) => !job.paid), [jobs]);
  const paidJobs = useMemo(() => jobs.filter((job) => job.paid), [jobs]);

  if (isJobsLoading || isPayLoading || isLoading) {
    return <Loading />;
  }

  return (
    <Box p={3} mt={8} sx={{ position: 'relative' }}>
      <Typography variant="h4" gutterBottom>
        Jobs for{' '}
        {contractor
          ? `${contractor.firstName} ${contractor.lastName} (${contractor.profession})`
          : 'Unknown Contractor'}
      </Typography>

      {jobs.length === 0 ? (
        <Typography>No jobs available</Typography>
      ) : (
        <JobsTable
          unpaidJobs={unpaidJobs}
          paidJobs={paidJobs}
          balance={balance}
          handlePayJob={handlePayJob}
        />
      )}
    </Box>
  );
};

export default JobsPage;
