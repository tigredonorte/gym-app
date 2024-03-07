import { Typography } from "@mui/material";

interface FormTextProps {
  text: string;
}

export const FormText: React.FC<FormTextProps> = ({ text }) => (
  <Typography variant="caption" gutterBottom textAlign='center'>
    {text}
  </Typography>
);