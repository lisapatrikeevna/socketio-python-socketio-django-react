import cl from './LogoutPage.module.scss'
import {NavLink } from "react-router-dom";
import { Box, Button, CircularProgress, Paper, Typography } from "@mui/material";
import { PATH } from "../../../router";
import { useDispatch } from "react-redux";
import { appAC } from "../../../bll/app.slice";
import { useLogOutMutation } from "../../../bll/auth/auth.servies";
// import img1 from '@/assets/myBg1.png'
import { useTranslation } from "react-i18next";
import { handleError } from "@/helpers/handleError";



export const LogoutPage = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const [logOut,{isLoading}] =useLogOutMutation()

  const handleLogout=()=>{
    logOut().unwrap().then((response) => {
      console.log('Logout successful:', response);
      dispatch(appAC.setLogout())
    }).catch((error) => {
      console.error('Logout Error:', error);
      handleError(error, t("LogoutError"), dispatch)
    })

  }

  return (<>
    <Box className={cl.root}>
      {/*<img src={img1} alt={'img1'} className={cl.img1}/>*/}
      <Typography variant={'h3'} className={cl.pageTitle}>{t('logout')}</Typography>
      {isLoading && <Box className={cl.preloader}><CircularProgress/></Box>}
      <Paper className={cl.card}>
        <Typography variant={'h5'} className={cl.title}>{t('subTitleLogOut')}</Typography>

        <Button variant={'contained'} onClick={handleLogout}>
          {t('textLogOutBtn')}
        </Button>
      </Paper>

      <Box className={cl.underlineLinkWrapper}>
        <NavLink className={cl.underlineLink} to={PATH.home}>
          {t('returnToHome')}
        </NavLink>
      </Box>
    </Box>
  </>)
}

export default LogoutPage









