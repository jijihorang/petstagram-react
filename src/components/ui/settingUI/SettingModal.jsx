import React, { useState } from 'react';
import { Modal, Box, Typography } from '@mui/material';
import SettingProfileModal from './SettingProfileModal';
import SettingPasswordModal from './SettingPasswordModal';

const metaIcon = '../src/assets/settingmodal/meta.png';
const profileIcon = '../src/assets/settingmodal/user-profile.png'; 
const connectedIcon = '../src/assets/settingmodal/connection.png'; 

const SettingModal = ({ onClose, profileInfo }) => {
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);

  const handleProfileClick = () => {
    setProfileModalOpen(true);
  };

  const handleProfileClose = () => {
    setProfileModalOpen(false);
  };

  const handlePasswordClick = () => {
    setPasswordModalOpen(true);
  }

  const handlePasswordClose= () => {
    setPasswordModalOpen(false);
  }
  
  return (
    <>
      <Modal
        open={true}
        onClose={onClose}
        aria-labelledby="setting-modal-title"
        aria-describedby="setting-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 520,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            background: 'linear-gradient(to right, #FFEEEE, #f2fcfe)',
            color: '#696969', 
            fontWeight: '800'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <img src={metaIcon} alt="Meta 아이콘" style={{ width: 40, height: 40, marginRight: 10 }} />
            <Typography id="setting-modal-title" variant="h6" component="h2">
              계정 센터
            </Typography>
          </Box>

          <Typography id="setting-modal-description" variant="body1" gutterBottom>
            Facebook, Petstagram, Meta Horizon 등 Meta 테크놀로지 전반에서 연결된 환경 및 계정 설정을 관리해보세요. <a href="#">더 알아보기</a>
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 4, mb: 3 }} onClick={handleProfileClick}>
            <img src={profileIcon} alt="프로필 아이콘" style={{ width: 40, height: 40, marginRight: 10 }} />
            <Typography variant="body1" component="p">
              프로필
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }} onClick={handlePasswordClick}>
            <img src={connectedIcon} alt="연결된 환경 아이콘" style={{ width: 40, height: 40, marginRight: 10 }} />
            <Typography variant="body1" component="p">
              비밀번호 변경
            </Typography>
          </Box>
        </Box>
      </Modal>

      <SettingProfileModal isOpen={isProfileModalOpen} onClose={handleProfileClose} profileInfo={profileInfo} />
      <SettingPasswordModal isOpen={isPasswordModalOpen} onClose={handlePasswordClose} profileInfo={profileInfo} />
    </>
  );
};

export default SettingModal;
