import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react'
import { Grid, GridColumn } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import ActivityStore from '../../../app/stores/activityStore';
import { LoadingCompnent } from '../../../app/layout/LoadingCompnent';
import { RootStore, RootStoreContext } from '../../../app/stores/rootStore';

export const ActivityDashboard :React.FC = () => {
    // const activityStore = useContext(ActivityStore);
    const rootStore= useContext(RootStoreContext);
    const activityStore = rootStore.activityStore;

 
    useEffect(() => {
       activityStore.loadActivities();
       },[activityStore]);
     
     if(activityStore.loadingInitial) return <LoadingCompnent content='Loading activites...'></LoadingCompnent>;
    return (
        <Grid>
            <Grid.Column width={10} >
                <ActivityList />
            </Grid.Column>
            <GridColumn width={6}>
               <h2>Activity filters</h2>
            </GridColumn>
        </Grid>
    )
}
export default observer(ActivityDashboard) ;