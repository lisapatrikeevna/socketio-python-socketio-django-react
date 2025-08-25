import {z} from 'zod'
import cl from './RegisterForm.module.scss'
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {DevTool} from "@hookform/devtools";
import {Link, NavLink} from "react-router-dom";
import {Box, Button, Paper, TextField, Typography, InputAdornment, IconButton} from "@mui/material";
import {useSignUpMutation} from "../../../bll/auth/auth.servies";
import {useDispatch, useSelector} from "react-redux";
import {appAC} from "../../../bll/app.slice";
import {useState} from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {handleError} from "../../../helpers/handleError.ts";
import {PATH} from "../../../paths.ts";
import type {UserType} from "../../../bll/auth/auth.type.ts";
import type {RootStateType} from "../../../bll/store.ts";

const schema = z.object({
password: z.string().min(3, 'too short password').nonempty('Enter password'),
passwordConfirmation: z.string().nonempty('Confirm your password'),
email: z.string().email('Invalid email address').nonempty('Enter email'),
identifier: z.string().nonempty('Enter nickName'),})
                 .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirmation) {
        ctx.addIssue({message: 'Passwords do not match', code: z.ZodIssueCode.custom, path: ['passwordConfirmation'],})
    }
    return data
})

type FormType = z.infer<typeof schema>


export const RegisterForm = () => {
    const dispatch = useDispatch();
    const [resErr, setResErr] = useState<string | null>(null);
    const [signUp, {isError}] = useSignUpMutation();
    const user = useSelector<RootStateType, UserType | null>(state => state.app.user);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {control, register, handleSubmit, formState: {errors},} = useForm<FormType>({mode: 'onSubmit', resolver: zodResolver(schema), defaultValues: {
                                                                                              email: 'lisa@gmail.com',
                                                                                              password: 'lisa@gmail.com',
                                                                                              identifier: 'lisa',
                                                                                              passwordConfirmation: 'lisa@gmail.com',
                                                                                          },
                                                                                      })

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

    const onSubmit = (data: FormType) => {
        // @ts-ignore
        const response = signUp({email: data.email, password: data.password, username: data.identifier}).unwrap().then(res => {
            console.log("response register form:  ", response)
            dispatch(appAC.setUser(res.user))
            dispatch(appAC.changeStatusSuccessfully("SignUpSuccess"))

        }).catch(err => {
            handleError(err, "SignUpFailed", dispatch)
            setResErr(err)
        })
    };

    const handleFormSubmitted = handleSubmit(data => onSubmit(data))

    return (<>
        <DevTool control={control}/>
        <Box className={cl.root}>
            <Typography variant={'h4'} className={cl.h1}>Sign In</Typography>
            <p>{isError}</p>
            <Paper component={"form"} onSubmit={handleFormSubmitted} className={cl.registerForm}>
                {resErr && <Typography color={'warning'}>{resErr}</Typography>}
                <TextField placeholder={'Email'} label={'Email'} {...register('email')} error={!!errors.email}/>
                <TextField placeholder="NickName" label="NickName" {...register('identifier')}
                           error={!!errors.identifier} helperText={errors.identifier?.message}/>
                <TextField placeholder={'Password'} label={'Password'}
                           type={showPassword ? 'text' : 'password'}{...register('password')} error={!!errors.password}
                           InputProps={{
                               endAdornment: (<InputAdornment position="end">
                                   <IconButton aria-label="toggle password visibility"
                                               onClick={handleClickShowPassword} edge="end">
                                       {showPassword ? <VisibilityOff/> : <Visibility/>}
                                   </IconButton>
                               </InputAdornment>),
                           }}
                />
                {errors.password && <p>{errors.password.message}</p>}

                <TextField{...register('passwordConfirmation')} label={'Confirm Password'}
                          type={showConfirmPassword ? 'text' : 'password'} error={!!errors.passwordConfirmation}
                          InputProps={{
                              endAdornment: (<InputAdornment position="end">
                                  <IconButton aria-label="toggle password confirmation visibility"
                                              onClick={handleClickShowConfirmPassword} edge="end">
                                      {showConfirmPassword ? <VisibilityOff/> : <Visibility/>}
                                  </IconButton>
                              </InputAdornment>),
                          }}
                />
                {errors.passwordConfirmation && <p>{errors.passwordConfirmation.message}</p>}

                <Button className={cl.button} variant={'outlined'} type="submit" fullWidth={true}
                        sx={{backgroundColor: 'var(--secondary-color)', mt: 2, mb: 3, p: '10px'}}>
                    Sign Up(reg)
                </Button>
            </Paper>
            <Box style={{display: 'flex', justifyContent: 'center'}}>
                <Button component={Link} className={`${cl.link} ${cl.alreadyHaveAccount}`} to={PATH.login}>
                    Already have an account?
                </Button>
            </Box>
            <Box className={cl.underlineLinkWrapper}>
                <NavLink className={cl.underlineLink} to={PATH.login} rel={'noopener nopener'} target={'_blank'}>
                    Sign In(log)
                </NavLink>
            </Box>
            {user && <Box className={cl.underlineLinkWrapper}>
                <NavLink className={cl.underlineLink} to={PATH.chat} rel={'noopener nopener'} target={'_blank'}>
                    Chat Page
                </NavLink>
            </Box>}
        </Box>
    </>)
}

export default RegisterForm




