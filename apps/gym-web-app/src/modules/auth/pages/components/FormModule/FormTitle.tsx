import { Typography } from "@mui/material";

export const FormTitle = ({ title }: { title: string }) => (
  <Typography variant="h4" gutterBottom>
    {title}
  </Typography>
);