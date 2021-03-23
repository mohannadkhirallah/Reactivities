import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react'
import { Button, Grid, GridColumn, Loader } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import ActivityStore from '../../../app/stores/activityStore';
import { LoadingCompnent } from '../../../app/layout/LoadingCompnent';
import { RootStore, RootStoreContext } from '../../../app/stores/rootStore';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityFilters from './ActivityFilters';

export const ActivityDashboard :React.FC = () => {
    // const activityStore = useContext(ActivityStore);
    const rootStore= useContext(RootStoreContext);
    const {loadingInitial,loadActivities,setPage,page,totalPage} = rootStore.activityStore;
    const [loadingNext, setLoadingNext]=useState(false);

    const handleGetNext =() =>
    {   
        setLoadingNext(true);
        setPage(page+1);
        loadActivities().then(() => setLoadingNext(false));

    }

 
    useEffect(() => {
       loadActivities();
       },[loadActivities]);
     
     if(loadingInitial && page === 0) return <LoadingCompnent content='Loading activites...'></LoadingCompnent>;

    return (
        <Grid>
            <Grid.Column width={10} >
                <InfiniteScroll
                pageStart={0}
                loadMore={handleGetNext}
                hasMore ={!loadingNext && page +1 < totalPage}>
                <ActivityList />
                </InfiniteScroll>
                
                <Button
                floated='right'
                content='more...'
                positive
                 disabled ={totalPage === page +1}
                onClick={handleGetNext}
                loading={loadingNext}
                ></Button>
            </Grid.Column>
            <GridColumn width={6}>
               <ActivityFilters/>
            </GridColumn>
            <GridColumn width={10}>
               <Loader
               active={loadingNext}/>
            </GridColumn>
        </Grid>
    )
}
export default observer(ActivityDashboard) ;