import React, { useState } from 'react';
import { Modal, Box, Typography} from '@mui/material';
import SettingUserInfo from './SettingUserInfo';

const nextIcon = '../src/assets/settingmodal/next-button.png';

const SettingProfileModal = ({ isOpen, onClose, profileInfo }) => {
  const [isNameModalOpen, setNameModalOpen] = useState(false);
  const [isEmailModalOpen, setEmailModalOpen] = useState(false);

  const handleOpenNameModal = () => setNameModalOpen(true);
  const handleCloseNameModal = () => setNameModalOpen(false);

  const handleOpenEmailModal = () => setEmailModalOpen(true);
  const handleCloseEmailModal = () => setEmailModalOpen(false);

  return (
    <>
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="profile-modal-title"
        aria-describedby="profile-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 550,
            height: 500,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            background: 'linear-gradient(to right, #FFEEEE, #f2fcfe)',
            color: '#696969',
            fontWeight: '800',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2, mt: 3 }}>
            <img src={profileInfo.profileImageUrl} alt="프로필" style={{ width: 120, height: 120, marginBottom: 10, borderRadius: '50%' }} />
            <Typography id="profile-modal-title" variant="h6" component="h2">
              {profileInfo.name}
            </Typography>
            <Typography variant="body1" component="p" color="textSecondary" sx={{ fontSize: '12px' }}>
              Petstagram
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', mt: 6, backgroundColor: 'white', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, mt: 2, borderBottom: '1px solid #dcdcdc', paddingBottom: 2 }} onClick={handleOpenNameModal}>
              <Typography variant="body1" sx={{marginLeft : 1, fontSize : 16 }}>이름</Typography>
              <img src={nextIcon} alt="프로필 아이콘" style={{ width: 25, height: 25, marginRight: 5 }} />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, mt: 2, mb: 2, marginBottom: 1 }} onClick={handleOpenEmailModal}>
              <Typography variant="body1" sx={{marginLeft : 1, fontSize : 16 }}>사용자 이름</Typography>
              <img src={nextIcon} alt="프로필 아이콘" style={{ width: 25, height: 25, marginRight: 5 }} />
            </Box>
          </Box>
        </Box>
      </Modal>

      <SettingUserInfo  
        isOpen={isNameModalOpen}
        onClose={handleCloseNameModal}
        profileInfo={profileInfo}
        inputLabel="name"
        title="이름"
        placeholder="이름"
        warningMessage="이름은 14일 동안 최대 두 번까지 변경할 수 있습니다." />

      <SettingUserInfo 
         isOpen={isEmailModalOpen}
         onClose={handleCloseEmailModal}
         profileInfo={profileInfo}
         inputLabel="email"
         title="사용자 이메일"
         placeholder="사용자 이메일"
         warningMessage="이메일을 변경하면 로그인 정보도 변경됩니다."
       />
    </>
  );
};

export default SettingProfileModal;
