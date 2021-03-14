import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom';
import { Grid, GridColumn } from 'semantic-ui-react';
import { LoadingCompnent } from '../../app/layout/LoadingCompnent';
import { RootStoreContext } from '../../app/stores/rootStore';
import { ProfileContent } from './ProfileContent';
import ProfileHeader from './ProfileHeader';

interface RouteParams{
    username:string
}
interface IProps extends RouteComponentProps<RouteParams>{}

export const ProfilePage:React.FC<IProps> = ({match}) => {
    const rootStore= useContext(RootStoreContext);
    const {loadProfile,profile,loadingProfile,uploadPhoto,uploadingPhoto} =rootStore.profileStore;

    useEffect(() => {
        loadProfile(match.params.username);
    }, [loadProfile,match])

    if(loadingProfile) return <LoadingCompnent content ="Loading profile..."></LoadingCompnent>

    return (
        <Grid>
            <GridColumn width={16}>
                <ProfileHeader profile ={profile!}></ProfileHeader>
                <ProfileContent></ProfileContent>
            </GridColumn>
        </Grid>
    )
}

export default observer (ProfilePage);