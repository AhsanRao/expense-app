import { useState } from 'react';
import PropTypes from 'prop-types';

// import Stack from '@mui/material/Stack';
// import Avatar from '@mui/material/Avatar';
// import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
// import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { red, green } from '@mui/material/colors';

// import Label from 'src/components/label';
// import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ExpenseTableRow({
  selected,
  expenseType,
  date,
  totalAmount,
  isApproved,
  username,
  handleClick,
  handleApprove,
  handleReject,
}) {
  const [setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  // const handleCloseMenu = () => {
  //   setOpen(null);
  // };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Typography variant="subtitle2" noWrap>
            {username}
          </Typography>
        </TableCell>

        <TableCell>{expenseType}</TableCell>

        <TableCell>{new Date(date).toLocaleDateString()}</TableCell>

        <TableCell>${totalAmount}</TableCell>

        <TableCell>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleApprove(username)}
            disabled={isApproved}
            size="small"
            sx={{
              backgroundColor: `${green[500]}CC`, // 80% opacity
              color: '#fff',
              '&:hover': {
                backgroundColor: `${green[700]}CC`, // Darker on hover with the same transparency
              },
              '&.Mui-disabled': {
                backgroundColor: `${green[200]}80`, // Lighter green when button is disabled
              },
            }}
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleReject(username)}
            disabled={!isApproved}
            size="small"
            style={{ marginLeft: 8 }}
            sx={{
              marginLeft: 1,
              backgroundColor: `${red[500]}CC`, // 80% opacity
              color: '#fff',
              '&:hover': {
                backgroundColor: `${red[700]}CC`, // Darker red on hover with transparency
              },
              '&.Mui-disabled': {
                backgroundColor: `${red[200]}80`, // Lighter red when button is disabled
              },
            }}
          >
            Reject
          </Button>
        </TableCell>

        {/* <TableCell>
          <Label color={isApproved ? 'success' : 'error'}>
            {isApproved ? 'Approved' : 'Not Approved'}
          </Label>
        </TableCell> */}

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            {/* <Iconify icon="eva:more-vertical-fill" /> */}
          </IconButton>
        </TableCell>
      </TableRow>

      {/* <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover> */}
    </>
  );
}

ExpenseTableRow.propTypes = {
  username: PropTypes.string,
  expenseType: PropTypes.string,
  date: PropTypes.string,
  totalAmount: PropTypes.number,
  isApproved: PropTypes.bool,
  selected: PropTypes.bool,
  handleClick: PropTypes.func,
  handleApprove: PropTypes.func.isRequired,
  handleReject: PropTypes.func.isRequired,
};
