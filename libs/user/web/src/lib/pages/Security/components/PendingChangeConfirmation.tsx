import { CardHeader } from '@gym-app/ui';
import { mdiDeleteOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { Button } from '@mui/material';
import Card from '@mui/material/Card';
import { Box } from '@mui/system';
import React from 'react';

interface PendingChangeChangeProps {
  title: string;
  subtitle: string;
  onCancel: () => void;
}
export const PendingChangeChange: React.FC<PendingChangeChangeProps> = (props: PendingChangeChangeProps) => {
  const { title, subtitle, onCancel } = props;

  return (
    <Card>
      <CardHeader title={title} />
      <p>
        {subtitle}
      </p>
      <Button
        type="submit"
        color="primary"
        variant="outlined"
        sx={{ mt: 3, mb: 2 }}
        onClick={() => onCancel()}
      >
        Cancel Change
        <Box sx={{ marginLeft: 1, display: 'flex' }}>
          <Icon path={mdiDeleteOutline} size={1}/>
        </Box>
      </Button>
    </Card>
  );
};
