import { observe } from 'mobx'
import { observer, Observer } from 'mobx-react-lite'
import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Segment, List, Item, Label,Image } from 'semantic-ui-react'
import { IAttendee } from '../../../app/models/attendee'

interface IProps {
  attendees:IAttendee[]
}
export const ActivityDetailedSideBar:React.FC<IProps> = ({attendees}) => {

  const isHost=false;
    return (
            <Fragment>
              <Segment
                textAlign='center'
                style={{ border: 'none' }}
                attached='top'
                secondary
                inverted
                color='teal'
              >
                {attendees.length} {attendees.length ===1 ?'Person':'People'} going
              </Segment>
              <Segment attached>
                <List relaxed divided>
                  {attendees.map((attende) =>(
                    <Item key={attende.username} style={{ position: 'relative' }}>
                      {isHost &&
                      <Label
                        style={{ position: 'absolute' }}
                        color='orange'
                        ribbon='right'
                      >
                        Host
                      </Label>
                    }
                    <Image size='tiny' src={'/assets/user.png'} />
                    <Item.Content verticalAlign='middle'>
                      <Item.Header as='h3'>
                        <Link to={`/profile/${attende.username}`}>{attende.displayName}</Link>
                      </Item.Header>
                      {attende.following &&
                      <Item.Extra style={{ color: 'orange' }}>Following</Item.Extra>}
                    </Item.Content>
                  </Item>
                  ))}
                </List>
              </Segment>
            </Fragment>
    )
}

export default observer(ActivityDetailedSideBar);