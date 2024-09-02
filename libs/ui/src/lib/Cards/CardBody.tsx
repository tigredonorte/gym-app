import Stack from '@mui/material/Stack';

interface CardBodyProps {
  children?: React.ReactNode;
}

export const CardBody: React.FC<CardBodyProps> = ({ children }: CardBodyProps) => {
  return (
    <Stack sx={{ flex: 1 }}>
      {children}
    </Stack>
  );
};
