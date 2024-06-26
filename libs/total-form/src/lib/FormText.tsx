import { Typography } from '@mui/material';

interface FormTextProps {
  text: string;
}

export const FormText: React.FC<FormTextProps> = ({ text }: FormTextProps) => (
  <Typography variant="caption" gutterBottom textAlign='justify' className="box" sx={{ mb: 2, mt: 2 }}>
    {text}
  </Typography>
);