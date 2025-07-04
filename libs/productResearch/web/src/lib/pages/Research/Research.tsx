import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent } from '@mui/material';

const Research: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Product Research
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Market Research
                </Typography>
                <Typography variant="body2">
                  Analyze market trends, competitor analysis, and industry insights.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  User Research
                </Typography>
                <Typography variant="body2">
                  Conduct user interviews, surveys, and usability testing.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Product Analysis
                </Typography>
                <Typography variant="body2">
                  Feature analysis, product positioning, and competitive research.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Research Projects
                </Typography>
                <Typography variant="body2">
                  Manage and track ongoing research initiatives and studies.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Research;
