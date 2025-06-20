import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { Job } from '../interfaces/JobInterface';

const JobsTable = ({
  unpaidJobs,
  paidJobs,
  handlePayJob,
  balance,
}: {
  unpaidJobs: Job[];
  paidJobs: Job[];
  balance: string | null;
  handlePayJob: (id: number, price: number) => void;
}) => (
  <Paper>
    {unpaidJobs.length > 0 && (
      <div>
        <Typography gutterBottom p={2} variant="h5">
          Unpaid Jobs
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Contract ID</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {unpaidJobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{job.id}</TableCell>
                <TableCell>{job.description}</TableCell>
                <TableCell>{job.price}</TableCell>
                <TableCell>{job.ContractId}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    disabled={Number(balance) < job.price}
                    onClick={() => handlePayJob(job.id, job.price)}
                  >
                    Pay
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )}

    {paidJobs.length > 0 && (
      <div>
        <Typography p={2} variant="h5" gutterBottom>
          Paid Jobs
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Contract ID</TableCell>
              <TableCell>Payment Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paidJobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{job.id}</TableCell>
                <TableCell>{job.description}</TableCell>
                <TableCell>{job.price}</TableCell>
                <TableCell>{job.ContractId}</TableCell>
                <TableCell>{job.paymentDate || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )}

    {unpaidJobs.length === 0 && paidJobs.length === 0 && (
      <Typography>No jobs available</Typography>
    )}
  </Paper>
);

export default JobsTable;
