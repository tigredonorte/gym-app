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
    <Button type="submit" color={color} variant={variant} disabled={!isFormValid || isRequesting} {...props}>
      {children}
      {title}
      {isRequesting && '...'}
    </Button>
  )
};