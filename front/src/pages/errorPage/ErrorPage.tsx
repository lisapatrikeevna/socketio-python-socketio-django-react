import { Box, Typography } from "@mui/material";
import cat from './../../assets/404-error-background-with-cat_23-2147681980.jpg'
import { useRouteError } from "react-router-dom";


const ErrorPage = () => {
  const error = useRouteError();

  return (<div>
    <Typography variant={'h2'} style={{textAlign:'center'}}>Ooops, It seems like crap happened</Typography>
    {error? <Typography style={{textAlign:'center', marginTop:'130px'}}>{error.toString()}</Typography>:
    <Box style={{width:'500px',margin:'30px auto 40px'}}>
      <img style={{width:'100%'}} src={cat} alt={'404'}/>
    </Box>
    }
  </div>);
};




export default ErrorPage;
