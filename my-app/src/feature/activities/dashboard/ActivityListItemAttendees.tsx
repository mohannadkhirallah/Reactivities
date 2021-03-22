import React from 'react'
import { Image, List,Popup } from 'semantic-ui-react'
import { IAttendee } from '../../../app/models/attendee'

interface IPorps {
    attendees:IAttendee[]
}

const styles = {
    borderColor:'organe',
    borderWidth :2
}
export const ActivityListItemAttendees: React.FC<IPorps> = ({attendees}) => {
    return (
        
        <List horizontal>
            {attendees.map((attendees)=>(
                <List.Item key={attendees.username}>
                    <Popup header={attendees.displayName}
                          trigger ={ 
                              <Image size='mini'
                               circular src={'/assets/user.png' || attendees.image}
                               bordered 
                               style={attendees.following ? styles: null}
                               /> }/>
              
            </List.Item>
            ))}
            
        </List>
    )
}
