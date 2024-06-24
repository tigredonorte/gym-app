import { Button, ButtonOwnProps } from "@mui/material";
import { useFormContext } from "./FormContext";

interface SubmitButtonProps {
  children?: React.ReactNode;
  title?: string;
  color?: 'primary' | 'secondary';
  variant?: 'contained' | 'outlined' | 'text';
  className?: string;
  fullWidth?: boolean;
  endIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
  loadingIcon?: React.ReactNode | string;
}

export const SubmitButton: React.FC<SubmitButtonProps & ButtonOwnProps> = ({ 
  children,
  title,
  variant= "contained",
  color="primary",
  fullWidth = true,
  endIcon,
  startIcon,
  loadingIcon = '...',
  ...props
}) => {
  const { isFormValid, isRequesting } = useFormContext();
  return (
    <Button
      {...props}
      type="submit"
      fullWidth={fullWidth}
      color={color}
      variant={variant}
      disabled={!isFormValid || isRequesting}
      sx={{ mt: 3, mb: 2 }}
    >
      {startIcon && (<span style={{ marginRight: 5, display: 'flex' }}>{startIcon}</span>)}
      {children}
      {title}
      {endIcon && (<span style={{ marginLeft: 5, display: 'flex' }}>{endIcon}</span>)}
      {isRequesting && loadingIcon}
    </Button>
  )
};