import React ,{useEffect,Fragment, SyntheticEvent, useContext} from  'react';
import { Container, Header, Icon, List } from 'semantic-ui-react';
import NavBar from '../../feature/nav/NavBar';
import ActivityDashboard from '../../feature/activities/dashboard/ActivityDashboard';
import { LoadingCompnent } from './LoadingCompnent';
import ActivityStore from '../stores/activityStore';
import {observer} from 'mobx-react-lite';

const App = () => {

 const activityStore = useContext(ActivityStore);
 
 useEffect(() => {
    activityStore.loadActivities();
    },[activityStore]);
  
  if(activityStore.loadingInitial) return <LoadingCompnent content='Loading activites...'></LoadingCompnent>

    return (
      <Fragment>
        <NavBar />
        <Container style={{marginTop:'7em'}}>
          <ActivityDashboard
            activities={activityStore.activities}
            selectActivity={activityStore.selectActivity}
             ></ActivityDashboard>
        </Container>
      </Fragment>
    );

}
export default observer(App);
