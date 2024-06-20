/* eslint-disable @typescript-eslint/ban-ts-comment */
import { alpha, ThemeOptions, TypographyVariantsOptions } from '@mui/material/styles';
import { IPaletteColorOptions, IThemePaletteMode, Mode } from './palette';

export const getComponentStyleOverride = (
	palette: IThemePaletteMode,
	mode: Mode,
	typography: TypographyVariantsOptions
): ThemeOptions['components'] => ({
	MuiButton: {
		styleOverrides: {
			root: {
				'&.MuiButton-containedPrimary:not(:disabled)': {
					backgroundColor: palette?.primary?.[400],
					'&:hover': {
						backgroundColor: palette?.primary.main,
					},
				},
			},
		},
	},
	MuiPaper: {
		styleOverrides: {
			elevation: {
				backgroundImage: 'none',
			},
		},
		defaultProps: {
			elevation: 26,
			variant: 'outlined',
		},
		variants: [
			{
				props: {
					variant: 'outlined',
				},
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				style: ({ ownerState, theme }: any) => ({
					boxShadow: theme.shadows[ownerState?.elevation || ''],
					border: `1px solid ${palette?.border}`,
				}),
			},
		],
	},
	MuiCard: {
		variants: [
			{
				props: {
					itemType: 'none',
				},
				style: {
					padding: 0,
				},
			},
			{
				props: {
					itemType: 'card',
				},
				style: {
					padding: 25,
					margin: 0,
				},
			},
			{
				props: {
					itemType: 'section',
				},
				style: {
					paddingTop: 40,
					paddingBottom: 40,
					paddingLeft: 30,
					paddingRight: 30,
					'@media (max-width: 600px)': {
						padding: '5%',
					},
				},
			},
			{
				props: {
					itemType: 'card',

					// @ts-ignore
					hover: 'light',
				},
				style: {
					'&:hover': {
						boxShadow: '0px 10px 20px -10px #0005',
					},
				},
			},
			{
				props: {
					// @ts-ignore
					hover: 'color',
				},
				style: {
					'&:hover': {
						boxShadow: `0px 10px 20px -15px ${palette?.primary.main}`,
					},
				},
			},
		],
		defaultProps: {
			// @ts-ignore
			hover: 'light',
			itemType: 'card',
			variant: 'outlined',
		},
	},
	MuiPopover: {
		defaultProps: {
			elevation: 26,
		},
	},
	MuiMenuItem: {
		styleOverrides: {
			root: {
				color: palette?.text.secondary,
				borderRadius: '3px',
				'&.Mui-selected': {
					color: palette?.primary.contrastText,
					backgroundColor: palette?.primary[mode === 'light' ? 300 : 400],
					'&>.MuiListItemIcon-root': {
						color: palette?.primary.contrastText,
					},
					'&:hover': {
						backgroundColor: palette?.primary[mode === 'light' ? 400 : 300],
						color: palette?.primary.contrastText,
						'&>.MuiListItemIcon-root': {
							color: palette?.primary.contrastText,
						},
					},
				},
				'&:hover': {
					backgroundColor: alpha(palette?.primary.light, 0.2),

					...(mode === 'light' && {
						color: palette?.primary[400],
						'&>.MuiListItemIcon-root': {
							color: palette?.primary.main,
						},
					}),
					...(mode === 'dark' && {
						color: palette?.primary.contrastText,
					}),
				},
			},
		},
	},

	MuiOutlinedInput: {
		styleOverrides: {
			root: ({ ownerState }) => {
				const paletteColor = palette?.[ownerState?.color || 'primary'] as IPaletteColorOptions;
				return {
					...(mode === 'light' && {
						'&:hover': {
							backgroundColor: '#eee8',
						},
					}),
					...(mode === 'dark' && {
						'&:hover': {
							backgroundColor: '#eee1',
						},
					}),
	
					'&:not(.Mui-error).Mui-focused .MuiOutlinedInput-notchedOutline': {
						borderColor: paletteColor?.[400]  || '#000',
					},
					'&:not(.Mui-error):hover .MuiOutlinedInput-notchedOutline': {
						borderColor: paletteColor?.[400]  || '#000',
					},
				}
			},
		},
	},
	MuiInputBase: {
		styleOverrides: {
			root: {
				'&.Mui-disabled, &.Mui-readOnly': {
					pointerEvents: 'none',
				},
			},
		},
	},
	MuiTableHead: {
		styleOverrides: {
			root: {
				backgroundColor: palette?.background?.default,
				'& .MuiTableCell-head': {
					...typography?.h5,
					textTransform: 'uppercase',
					borderTop: `1px solid ${palette?.border}`,
					borderBottom: `1px solid ${palette?.border}`,
				},
			},
		},
	},
	MuiTableRow: {
		styleOverrides: {
			root: {
				'&.MuiTableRow-hover:hover': {
					backgroundColor: alpha(palette?.background?.default || '#fff', 0.4),
				},
			},
		},
	},
	MuiRadio: {
		styleOverrides: {
			root: {
				'& .MuiSvgIcon-root': {
					fontSize: 35,
				},
			},
		},
	},
	MuiLink: {
		styleOverrides: {
			root: {
				color: palette?.primary[300],
			},
		},
	},

	MuiAlert: {
		styleOverrides: {
			outlined: {
				backgroundColor: palette?.background?.paper,
			},
			filled: {
				border: 0,
			},
			standard: {
				border: 0,
			},
			filledSuccess: {
				color: palette?.success.contrastText,
			},
		},
	},
	MuiMobileStepper: {
		styleOverrides: {
			root: {
				background: palette?.background?.paper,
			},
		},
	},
});
