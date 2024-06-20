import { Divider } from "@mui/material";
import Card from '@mui/material/Card';
import { Stack } from "@mui/system";
import React from "react";
import { CardHeader } from "../CardHeader";

interface ContainerProps {
  title: string;
  children: React.ReactNode | React.ReactNode[];
}

export const Container: React.FC<ContainerProps> = ({ title, children }: ContainerProps) => {
  const childrenArray = React.Children.toArray(children);

	return (
		<Card>
			<CardHeader title={title} />
			<Stack spacing={3}>
        {childrenArray.map((child, index) => (
          <React.Fragment key={index}>
            {child}
            {index < childrenArray.length - 1 && <Divider />}
          </React.Fragment>
        ))}
			</Stack>
		</Card>
	);
}