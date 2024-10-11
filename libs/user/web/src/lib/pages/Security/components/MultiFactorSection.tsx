import { CardHeader } from '@gym-app/shared/web';
import { mdiArrowRight } from '@mdi/js';
import Icon from '@mdi/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const MultifactorSection: React.FC = React.memo(() => {
  const { t } = useTranslation('user');

  return (
    <Card>
      <CardHeader title={t('MultiFactorSection.title')} />
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6} md={6}>
          <Stack
            spacing={1}
            border={1}
            borderRadius={1}
            borderColor="text.hint"
            p={2}
            sx={{
              '&:hover': {
                borderColor: 'border',
              },
            }}
          >
            <Typography color="error">
              <Box
                component="span"
                width={10}
                height={10}
                bgcolor="error.main"
                borderRadius="50%"
                display="inline-block"
                mr={1}
              />
              {t('MultiFactorSection.off')}
            </Typography>
            <Typography variant="subtitle1">{t('MultiFactorSection.app')}</Typography>
            <Typography variant="body1" color="textSecondary">
              {t('MultiFactorSection.appDescription')}
            </Typography>
            <Button variant="outlined" sx={{ width: 'fit-content' }} endIcon={<Icon path={mdiArrowRight} size={1} />}>
              {t('MultiFactorSection.setUp')}
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Stack
            spacing={1}
            border={1}
            borderRadius={1}
            borderColor="text.hint"
            p={2}
            height="100%"
            sx={{
              '&:hover': {
                borderColor: 'border',
              },
            }}
          >
            <Typography color="error">
              <Box
                component="span"
                width={10}
                height={10}
                bgcolor="error.main"
                borderRadius="50%"
                display="inline-block"
                mr={1}
              />
              {t('MultiFactorSection.off')}
            </Typography>
            <Typography variant="subtitle1">{t('MultiFactorSection.sms')}</Typography>
            <Typography variant="body1" color="textSecondary" flexGrow={1}>
              {t('MultiFactorSection.smsDescription')}
            </Typography>
            <Button variant="outlined" sx={{ width: 'fit-content' }} endIcon={<Icon path={mdiArrowRight} size={1} />}>
              {t('MultiFactorSection.setUp')}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
});