import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Product Research Dashboard
        </Typography>
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Welcome to Product Research
          </Typography>
          <Typography variant="body1">
            This is the main dashboard for product research activities.
            Here you can view recent research projects, analytics, and get an overview of your research pipeline.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;
