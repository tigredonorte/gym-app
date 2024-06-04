import { Typography } from "@mui/material";

interface FormTitleProps {
  title: string;
}

export const FormTitle: React.FC<FormTitleProps> = ({ title }) => (
  <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
    {title}
  </Typography>
);