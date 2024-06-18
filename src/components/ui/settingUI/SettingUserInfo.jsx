import React, { useState } from 'react';
import { Modal, Box, Typography, Button, IconButton, InputAdornment, InputLabel, OutlinedInput, FormControl } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClearIcon from '@mui/icons-material/Clear';
import UserService from '../../service/UserService';

const SettingUserInfo = ({ isOpen, onClose, profileInfo, inputLabel, title, warningMessage }) => {
  const [value, setValue] = useState(profileInfo[inputLabel] || '');

  const handleClear = () => {
    setValue('');
  };

  const handleNameSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await UserService.updateName(profileInfo.id, value, token);
      alert("이름 변경 성공")
      onClose();
    } catch (error) {
      console.error("이름 변경에 실패했습니다.", error);
      alert("이름 변경 실패")
    }
  };

  const handleEmailSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await UserService.updateEmail(profileInfo.id, value, token);
      alert("이메일 변경 성공")
      onClose();
    } catch (error) {
      console.error("이메일 변경에 실패했습니다.", error);
      alert("이메일 변경 실패")
    }
  };

  const handleSubmit = async () => {
    if (inputLabel === 'name') {
      await handleNameSubmit();
    } else if (inputLabel === 'email') {
      await handleEmailSubmit();
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 550,
        height: 500,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        background: 'linear-gradient(to right, #FFEEEE, #f2fcfe)',
        borderRadius: 2,
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={onClose} sx={{ flexGrow: 0 }}>
              <ArrowBackIcon />
            </IconButton>
          </Box>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>{title}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={onClose} sx={{ flexGrow: 0 }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', mt: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', borderRadius: 1, width: '100%', maxWidth: 500, padding: '0px 8px' }}>
            <FormControl fullWidth variant="outlined" sx={{ border: '1px solid #ccc', borderRadius: 1 }}>
              <InputLabel htmlFor="outlined-adornment">{inputLabel === 'name' ? "이름" : "이메일"}</InputLabel>
              <OutlinedInput
                id="outlined-adornment"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                endAdornment={
                  value && (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClear} edge="end">
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }
                label={inputLabel === 'name' ? "이름" : "이메일"}
                sx={{
                  '& fieldset': {
                    border: 'none',
                  },
                }}
              />
            </FormControl>
          </Box>
        </Box>

        <Typography variant="body2" sx={{ mt: 2, color: 'grey', fontSize: '13px', marginLeft: 2}}>
          {warningMessage}
        </Typography>

        <Button
          fullWidth
          sx={{ mt: 25, bgcolor: '#e6e6fa', color: 'black', borderRadius: 2, height: 48, '&:hover': { bgcolor: '#d8bfd8', color: '#fff' } }}
          onClick={handleSubmit}
          variant="contained"
        >
          완료
        </Button>
      </Box>
    </Modal>
  );
};

export default SettingUserInfo;
