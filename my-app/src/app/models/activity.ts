import { IAttendee } from "./attendee";

export interface IActivitiesEnvelope
{
    activities:IActivity[];
    activityCount:number;
}

export interface IActivity{

    id:string;
    title:string;
    description:string;
    date:string;
    city:string;
    venue:string;
    category:string;
    isGoing:boolean;
    isHost:boolean;
    attendees:IAttendee[];
    comments: IComment[];

}
export interface IComment 
{
    id:string;
    createdAt:string;
    body:string;
    username:string;
    displayName:string;
    image:string;
}
export class ActivityFormValues implements Partial< IActivity>
{
    id: string = '';
    title: string='';
    description: string='';
    date: string='';
    city: string='';
    venue: string='';
    category: string='';
    // attendees:IAttendee[]=[];
    // isGoing:boolean=false;
    // isHost:boolean=false;

    constructor(init?:IActivity){
        if(init)
        {
            Object.assign(this,init);
        }
    }
  
}