import Typography, { TypographyOwnProps } from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

type IVariant = Record<'small'|'medium'|'large', {
  headerMb: number;
  titleMb: TypographyOwnProps['mb'];
  titleVariant: TypographyOwnProps['variant'];
}>

const VARIANTS_CONFIG: IVariant = {
  small: {
    headerMb: 0,
    titleMb: 0.5,
    titleVariant: 'h5',
  },
  medium: {
    headerMb: 3,
    titleMb: 1,
    titleVariant: 'h4',
  },
  large: {
    headerMb: 3,
    titleMb: 1,
    titleVariant: 'h3',
  },
};

interface CardHeaderProps {
  children?: React.ReactNode;
  title: string;
  subtitle?: string;
  size?: 'small' | 'medium' | 'large';
  sx?: object;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, title, subtitle, size = 'medium', sx }: CardHeaderProps) => {
  return (
    <Stack
      mb={VARIANTS_CONFIG?.[size]?.headerMb}
      direction="row"
      justifyContent="space-between"
      flexWrap="wrap"
      sx={sx}
    >
      <Stack>
        <Typography
          variant={VARIANTS_CONFIG?.medium?.titleVariant}
          mb={VARIANTS_CONFIG?.[size]?.titleMb}
          fontWeight="500"
          textTransform="uppercase"
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Stack>
      {children}
    </Stack>
  );
};
