import cl from './pageLogin.module.scss';
import {NavLink, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {DevTool} from "@hookform/devtools";
import {z} from 'zod';
import {Box, Button, Paper, TextField, Typography, InputAdornment, IconButton} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {appAC} from "../../../bll/app.slice";
import {useLoginMutation} from "../../../bll/auth/auth.servies";
import {LoadCanvasTemplateNoReload, loadCaptchaEnginge, validateCaptcha} from 'react-simple-captcha';
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {handleError} from "../../../helpers/handleError.ts";
import type {RootStateType} from "../../../bll/store.ts";
import type {UserType} from "../../../bll/auth/auth.type.ts";
import {PATH} from "../../../paths.ts";
// import {useHistory} from "react-router-dom";

// students for dev=[ivanov@mail.ru,AidAidov@mail.ru]

const schema = z.object({
                            password: z.string().min(3, 'too short password').nonempty('Enter password'),
                            identifier: z.string().min(3, 'too short username').nonempty('Enter username'),
                            captcha: z.string().optional(), // captcha: z.string().nonempty('Enter captcha'),
                        });

type FormType = z.infer<typeof schema>;

const PageLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    // const history = useHistory();
    const [showCaptcha, setShowCaptcha] = useState(false);
    // Добавляем состояние для отображения/скрытия пароля
    const [showPassword, setShowPassword] = useState(false);
    const user = useSelector<RootStateType, UserType | null>(state => state.app.user);
    const [signIn, {isLoading: isSigningIn, isError}] = useLoginMutation();

    const {control, register, handleSubmit, formState: {errors},} = useForm<FormType>({
                                                                                          mode: 'onSubmit',
                                                                                          resolver: zodResolver(schema),
                                                                                          defaultValues: {
                                                                                              password: 'lisa@gmail.com',
                                                                                              identifier: 'lisa',
                                                                                          },
                                                                                      });

    // useEffect(() => {
    //   loadCaptchaEnginge(6);
    // }, []);
    useEffect(() => {
        if (showCaptcha) {
            loadCaptchaEnginge(2);
        }
    }, [showCaptcha]);

    // Функция для переключения видимости пароля
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSignIn = async (data: FormType) => {
        if (showCaptcha) {
            const isCaptchaValid = validateCaptcha(data.captcha ?? '');
            if (!isCaptchaValid) {
                dispatch(appAC.changeStatusError('InvalidCaptcha'));
                return;
            }
        }

        try {
            const response = await signIn(data).unwrap();
            dispatch(appAC.setUser(response.user));
            dispatch(appAC.changeStatusSuccessfully('LoginSuccessful'))
            setShowCaptcha(false)
        } catch (err) {
            // console.log('SignIn Error:', err.data.email);
            // dispatch(appAC.changeStatusError(err.error))
            handleError(err, 'SignInFailed', dispatch);
            setShowCaptcha(true)
        }
    };

    const handleFormSubmitted = handleSubmit(handleSignIn);
    if (user) {
        navigate(PATH.chat);
        // history.goBack();
        // navigate(-1);
        // navigate(from, {replace: true});
        return null;
    }

    return (<>
        <DevTool control={control}/>
        <Box className={cl.root}>
            <Typography variant={'h4'} className={cl.pageTitle}>{'login'}</Typography>
            <Typography component={'p'}>{isError}</Typography>
            <Paper component={"form"} onSubmit={handleFormSubmitted} className={cl.card}>

                <TextField fullWidth placeholder={'placeholderEmail'} label={'labelEmail'} {...register('identifier')}
                           error={!!errors.identifier}/>

                <TextField fullWidth label={'labelPassword'} placeholder={'placeholderPassword'}
                           type={showPassword ? 'text' : 'password'}
                           {...register('password')} error={!!errors.password} InputProps={{
                    endAdornment: (<InputAdornment position="end">
                        <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                        </IconButton>
                    </InputAdornment>)
                }}
                />
                {errors.password && <Typography>{errors.password.message}</Typography>}

                {showCaptcha && <> <LoadCanvasTemplateNoReload/>
                    <TextField fullWidth placeholder={'placeholderCaptcha'}
                               label={'labelCaptcha'} {...register('captcha')} error={!!errors.captcha}/>
                    {errors.captcha && <Typography>{errors.captcha.message}</Typography>}</>}

                <Button variant={'contained'} disabled={isSigningIn} fullWidth={true} type="submit"
                        sx={{
                            backgroundColor: 'var(--secondary-color)', mt: 2, mb: 3, p: '10px', '&.Mui-disabled': {
                                color: 'gray',
                            },
                        }}>
                    {"textSignInBtn"}
                </Button>

                <Box style={{display: 'flex', justifyContent: 'center'}}>
                  <Button component={NavLink} className={`${cl.link} ${cl.dontHaveAccount}`} fullWidth={true} to={PATH.register} rel={'noopener nopener'}>
                    Dont have an account?
                  </Button>
                </Box>

            </Paper>
        </Box>
    </>)
}

export default PageLogin;
