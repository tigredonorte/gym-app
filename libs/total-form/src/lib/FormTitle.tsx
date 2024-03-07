import { Typography } from "@mui/material";

interface FormTitleProps {
  title: string;
}

export const FormTitle: React.FC<FormTitleProps> = ({ title }) => (
  <Typography variant="h4" gutterBottom>
    {title}
  </Typography>
);