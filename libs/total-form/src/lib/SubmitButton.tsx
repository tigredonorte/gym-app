import { Button, ButtonOwnProps } from "@mui/material";
import { useFormContext } from "./FormContext";

interface SubmitButtonProps {
  children?: React.ReactNode;
  title?: string;
  color?: 'primary' | 'secondary';
  variant?: 'contained' | 'outlined' | 'text';
}

export const SubmitButton: React.FC<SubmitButtonProps & ButtonOwnProps> = ({ 
  children,
  title,
  variant= "contained",
  color="primary",
  ...props
}) => {
  
  const { isFormValid, isRequesting } = useFormContext();
  return (
    <Button type="submit" fullWidth color={color} variant={variant} disabled={!isFormValid || isRequesting} sx={{ mt: 3, mb: 2 }} {...props}>
      {children}
      {title}
      {isRequesting && '...'}
    </Button>
  )
};