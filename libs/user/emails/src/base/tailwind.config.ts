export const tailwindConfig = {
  theme: {
    extend: {
      colors: {
        gray: {
          DEFAULT: '#8492a6',
          dark: '#273444',
          light: '#d3dce6'
        },
        primary: {
          DEFAULT: '#1560BD',
          dark: '#0F468B',
          light: '#96C0F3',
          contrastText: '#fff',
        },
        secondary: {
          main: '#FEC604',
          dark: '#C99C01',
          light: '#FFF3CA',
          contrastText: '#343A40',
        },
      },
    },
  },
};

export const typography = {
  fontFamily: 'Roboto,RobotoDraft,Helvetica,Arial,sans-serif',
  margin: '0',
};
