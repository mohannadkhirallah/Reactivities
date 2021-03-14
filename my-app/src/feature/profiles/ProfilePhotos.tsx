import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react'
import { Button, ButtonGroup, Card, Grid, GridColumn, Header, Image, Tab } from 'semantic-ui-react'
import { PhotoUploadWidget } from '../../app/common/photoUpload/PhotoUploadWidget';
import { RootStoreContext } from '../../app/stores/rootStore'

export const ProfilePhotos = () => {
    const rootStore = useContext(RootStoreContext);
    const {profile,isCurrentUser,uploadPhoto,uploadingPhoto,setMainPhoto,loading,deletePhoto}= rootStore.profileStore;
    const [addPhotoMode, SetAddPhotoMode] = useState(true);
    const [target, setTarget] = useState<string|undefined>(undefined);
    const [delTarget, setDelTarget] = useState<string|undefined>(undefined);

    return (
      <Tab.Pane>
          <Grid>
              <GridColumn width={16} style={{paddingBottom:0}}>
              <Header floated='left' icon='image' content='Photos'/>
                    {true && 
                        <Button floated='right' basic content={addPhotoMode?'Cancel':'Add Photo'}
                        onClick={() =>SetAddPhotoMode(!addPhotoMode)}/>
                    }
              </GridColumn>
              <GridColumn width={16}>
                  {
                      addPhotoMode ?(<PhotoUploadWidget uploadPhoto={uploadPhoto} loading={uploadingPhoto} />)
                      : (
                        <Card.Group itemPerRow={5}>
                        {profile && profile.photos.map((photo)=>{
                            <Card key ={photo.id}>
                                <Image src={photo.url}/>
                                <ButtonGroup fluid widths={2}>
                                    <Button 
                                        name={photo.id}
                                        onClick={(e)=>{
                                        setMainPhoto(photo);
                                        setTarget(e.currentTarget.name)
                                    }}    
                                    disabled={photo.isMain}                      
                                    loading={loading && target=== photo.id} basic positive content='Main'/>

                                    <Button basic
                                    name={photo.id}
                                    disabled={photo.isMain}
                                    onClick={(e) =>{
                                        deletePhoto(photo);
                                        setDelTarget(e.currentTarget.name)
                                    }}
                                    loading={loading && delTarget === photo.id}
                                    negative icon='trash'/>
                                </ButtonGroup>
                            </Card>
                         })}
                        </Card.Group>
                      )
                  }


              </GridColumn>
          </Grid>
          
         
      </Tab.Pane>
    )
}
export default observer(ProfilePhotos);