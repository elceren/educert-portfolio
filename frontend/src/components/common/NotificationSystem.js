import React from 'react';
import { Box, Alert, AlertTitle, IconButton, Snackbar, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNotification, NotificationType } from '../context/NotificationContext';

const NotificationSystem = () => {
  const { notifications, removeNotification } = useNotification();

  // Handle notification close
  const handleClose = (id) => {
    removeNotification(id);
  };

  // Get severity based on notification type
  const getSeverity = (type) => {
    switch (type) {
      case NotificationType.SUCCESS:
        return 'success';
      case NotificationType.ERROR:
        return 'error';
      case NotificationType.WARNING:
        return 'warning';
      case NotificationType.INFO:
      default:
        return 'info';
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 2000,
        maxWidth: '100%',
        width: { xs: 'calc(100% - 32px)', sm: 400 }
      }}
    >
      <Stack spacing={1}>
        {notifications.map((notification) => (
          <Snackbar
            key={notification.id}
            open={true}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert
              severity={getSeverity(notification.type)}
              variant="filled"
              sx={{ width: '100%' }}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => handleClose(notification.id)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
            >
              <AlertTitle>
                {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
              </AlertTitle>
              {notification.message}
            </Alert>
          </Snackbar>
        ))}
      </Stack>
    </Box>
  );
};

export default NotificationSystem;
