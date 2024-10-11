import { CardHeader } from '@gym-app/shared/web';
import { mdiArrowRight, mdiStar, mdiStarCircle, mdiStarOutline } from '@mdi/js';
import Icon from '@mdi/react';
import Box from '@mui/material/Box';
import Button, { ButtonOwnProps } from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

interface IPlan {
  title: string;
  subtitle: string;
  btnText: string;
  color: ButtonOwnProps['color'];
}

const planStats: IPlan[] = [
  {
    title: 'Bill Due',
    subtitle: '$150.00',
    btnText: 'Pay Now',
    color: 'error',
  },
  {
    title: 'Total Credits',
    subtitle: '1570 GB',
    btnText: 'Full Report',
    color: 'info',
  },
  {
    title: 'Plan',
    subtitle: 'Basic',
    btnText: 'Upgrade?',
    color: 'success',
  },
];

export const Billing: React.FC = () => {
  return (
    <Stack spacing={6}>
      <ChangePlanSection />
      <PaymentSection />
    </Stack>
  );
};

const plansData = [
  {
    type: 'Startup',
    cost: '0.00',
    icon: mdiStarOutline,
  },
  {
    type: 'Standard',
    cost: '4.99',
    icon: mdiStar,
    using: true,
  },
  {
    type: 'Business',
    cost: '29.99',
    icon: mdiStarCircle,
  },
];

const ChangePlanSection: React.FC = () => {
  const [userTypeSelected, setUserTypeSelected] = useState('Standard');

  return (
    <Card>
      <CardHeader title="Change Plan" subtitle="You can upgrade and downgrade whenever you want" />
      <Stack spacing={3} direction={{ xs: 'column', md: 'row' }}>
        {plansData.map(({ type, cost, icon, using }) => (
          <UserPlanCard
            key={type}
            type={type}
            cost={cost}
            icon={icon}
            using={using}
            setUserTypeSelected={() => setUserTypeSelected(type)}
            userTypeSelected={userTypeSelected === type}
          />
        ))}
      </Stack>
    </Card>
  );
};

interface UserPlanCardProps {
  cost: string;
  icon: string;
  type: string;
  using?: boolean;
  userTypeSelected: boolean;
  setUserTypeSelected: () => void;
}

const UserPlanCard: React.FC<UserPlanCardProps> = ({
  cost,
  icon,
  type,
  using,
  userTypeSelected,
  setUserTypeSelected,
}: UserPlanCardProps) => {
  return (
    <Stack
      width="100%"
      direction="column"
      onClick={setUserTypeSelected}
      component="button"
      spacing={2}
      py={3}
      px={{
        xs: 2,
        sm: 4,
      }}
      sx={{
        cursor: 'pointer',
        bgcolor: 'background.paper',
        transition: '0.1s all',
        border: 2,
        borderColor: userTypeSelected ? 'primary.300' : 'text.hint',
        borderRadius: '10px',
        '&:hover': {
          boxShadow: '0px 10px 30px -15px #0003',
        },
      }}
    >
      <Icon path={icon} size={1} color="primary" />
      <Typography variant="h3" align="left">
				${cost}
        <Typography variant="caption">/mo</Typography>
      </Typography>
      <Stack direction="row" justifyContent="space-between" spacing={3} width="100%">
        <Typography variant="subtitle1" align="left" textTransform="uppercase">
          {type}
        </Typography>
        {using && (
          <Typography variant="caption" color="success.main">
						Using Now
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

const paymentMethodsData = [
  {
    img: 'https://via.placeholder.com/60',
    type: 'Visa Card',
    card: '5269 07XX XXXX 8110',
    isdefault: true,
  },
  {
    img: 'https://via.placeholder.com/60',
    type: 'Discover',
    card: '6109 07XX XXXX 8020',
    isdefault: false,
  },
  {
    img: 'https://via.placeholder.com/60',
    type: 'Mastercard',
    card: '7278 07XX XXXX 4290',
    isdefault: false,
  },
];

const historyData = [
  {
    id: '12877227695',
    date: '26 Feb 2021 9:16 am',
    price: '56.32',
    status: 'Awaiting',
  },
  {
    id: '12901477937',
    date: '30 Jan 2021 2:54 pm',
    price: '75.56',
    status: 'Paid',
  },
  {
    id: '12767886919',
    date: '22 Jan 2021 12:01 pm',
    price: '34.23',
    status: 'Paid',
  },
];

const PaymentSection: React.FC = () => {
  return (
    <Card>
      <CardHeader title="Stats" />
      <Stack spacing={6} direction="column">
        <Stack spacing={3} direction={{ xs: 'column', md: 'row' }} width="100%">
          {planStats.map(({ title, subtitle, btnText, color }, i) => (
            <PlanStat key={i} title={title} subtitle={subtitle} btnText={btnText} color={color} />
          ))}
        </Stack>
        <Box border={1} borderColor="border" p={2} borderRadius="10px">
          <CardHeader size="small" title="Payment Methods" sx={{ mb: 1 }}>
            <Button variant="contained">Add New Method</Button>
          </CardHeader>
          <Divider />
          <Stack>
            {paymentMethodsData.map((card, i) => (
              <PaymentMethod card={card} key={i} />
            ))}
          </Stack>
        </Box>
        <Box border={1} borderColor="border" p={2} borderRadius="10px">
          <CardHeader size="small" title="Billing History" sx={{ mb: 1 }} />
          <TableContainer>
            <Table aria-label="results table">
              <TableHead
                sx={{
                  bgcolor: 'background.paper',
                }}
              >
                <TableRow>
                  <TableCell>Order No.</TableCell>
                  <TableCell align="left">Date</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historyData.map(({ id, date, price, status }) => (
                  <TableRow hover key={id}>
                    <TableCell>{id}</TableCell>
                    <TableCell align="left">{date}</TableCell>
                    <TableCell align="right">${price}</TableCell>
                    <TableCell align="right">
                      {status === 'Paid' ? (
                        <Chip label={status} color="success" size="small" />
                      ) : (
                        <Chip label={status} color="warning" size="small" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Stack>
    </Card>
  );
};

interface PlanStatProps {
  title: string;
  subtitle: string;
  btnText: string;
  color: ButtonOwnProps['color'];
}

const PlanStat: React.FC<PlanStatProps> = ({ title, subtitle, btnText, color }: PlanStatProps) => {
  return (
    <Stack
      width="100%"
      border={1}
      borderLeft={10}
      borderColor={`${color}.main`}
      p={2}
      borderRadius="10px"
      spacing={0.5}
    >
      <Typography variant="body2">{title}</Typography>
      <Typography variant="h4">{subtitle}</Typography>
      <Button endIcon={<Icon path={mdiArrowRight} size={1} />} sx={{ width: 'fit-content' }} size="small" color={color}>
        {btnText}
      </Button>
    </Stack>
  );
};

interface PaymentMethodProps {
  card: {
    img: string;
    type: string;
    card: string;
    isdefault: boolean;
  };
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ card }: PaymentMethodProps) => {
  const { img, type, card: cardNumber, isdefault } = card;
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box component="img" src={img} width={60} height={60} />
      <Box flexGrow={1}>
        <Typography variant="subtitle1">{type}</Typography>
        <Typography variant="subtitle2">Ending in {cardNumber}</Typography>
      </Box>
      {isdefault ? <Chip label="Default" size="small" /> : <Link href="#!">Make Default</Link>}
      <Link href="#!">Edit</Link>
    </Stack>
  );
};

