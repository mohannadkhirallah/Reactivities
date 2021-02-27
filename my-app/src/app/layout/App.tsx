import React ,{Fragment, useContext, useEffect} from  'react';
import { Container } from 'semantic-ui-react';
import NavBar from '../../feature/nav/NavBar';
import ActivityDashboard from '../../feature/activities/dashboard/ActivityDashboard';
import {observer} from 'mobx-react-lite';
import { Route,RouteComponentProps,Switch,withRouter } from 'react-router-dom';
import { HomePage } from '../../feature/home/HomePage';
import { ActivityForm } from '../../feature/activities/form/ActivityForm';
import { ActivityDetails } from '../../feature/activities/details/ActivityDetails';
import NotFound from './NotFound';
import { ToastContainer } from 'react-toastify';
import LoginForm from '../../feature/user/LoginForm';
import { RootStoreContext } from '../stores/rootStore';
import { getuid } from 'process';
import { LoadingCompnent } from './LoadingCompnent';
import ModalContainer from '../common/modals/ModalContainer';

const App:React.FC<RouteComponentProps> = ({location}) => {

  const rootStore=useContext(RootStoreContext);
  const {setAppLoaded,token,appLoaded} =rootStore.commonStore;
  const {getUser} = rootStore.userStore;

  useEffect(()=>{
    if(token)
    {
      getUser().finally(()=>setAppLoaded())
    }
    else
    {
      setAppLoaded()
    }
  },[getUser,setAppLoaded,token])

 

    return (
      <Fragment>
        <ModalContainer></ModalContainer>
        <ToastContainer position='top-right'/> 
        <Route exact path='/' component={HomePage} />
        <Route path={'/(.+)'} render={() => (
                <Fragment>
                 <NavBar />
                 <Container style={{marginTop:'7em'}}>
                   <Switch>
                    <Route exact path='/activities' component={ActivityDashboard}/>
                    <Route  path='/activities/:id' component={ActivityDetails}/>
                    <Route key={location.key} path= {['/createActivity','/manage/:id']} component={ActivityForm}/>
                    <Route path='/login' component={LoginForm}/>
                    <Route component={NotFound}/>
                   </Switch>
                 </Container>
                 
                 </Fragment>
        )}></Route>
      </Fragment>
    );
}
export default withRouter(observer(App));
