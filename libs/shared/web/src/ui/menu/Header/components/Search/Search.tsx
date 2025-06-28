import { mdiMagnify } from '@mdi/js';
import Icon from '@mdi/react';
import { Box, Drawer, IconButton, TextField } from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import './Search.scss';

interface SearchProps {
  placeholder?: string;
}

export const SearchComponent: React.FC<SearchProps> = ({
  placeholder = 'Search...'
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ color: 'white', margin: '0 10px' }}>
        <Icon path={mdiMagnify} size={1} />
      </IconButton>

      {isOpen && (
        <Drawer anchor="top" open onClose={handleClose}>
          <Box p={2} display="flex" justifyContent="center">
            <TextField
              inputRef={inputRef}
              placeholder={placeholder}
              fullWidth
              className="search-input"
              focused
            />
          </Box>
        </Drawer>
      )}
    </>
  );
};
