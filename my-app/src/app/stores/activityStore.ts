import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ca, tr } from "date-fns/locale";
import { observable, action,makeAutoObservable,computed,configure,runInAction, reaction } from "mobx";
import { cpuUsage } from "process";
import { createContext, SyntheticEvent } from "react";
import { toast } from "react-toastify";
import { URLSearchParams } from "url";
import agent from "../api/agent";
import {IActivity} from '../models/activity'
import { IAttendee } from "../models/attendee";
import { RootStore } from "./rootStore";

const Limit=2;



export default class ActivityStore {

    rootStore: RootStore;

    constructor(rootStore:RootStore)
    {
        this.rootStore=rootStore;
        makeAutoObservable(this);

        reaction(
            () => this.predicate.keys(),
            () =>{ this.page =0;
                   this.activityRegistry.clear();
                   this.loadActivities(); 
                })
    }

    activityRegistry = new Map();
    loadingInitial = false;
    selectedActivity:IActivity |undefined;
    submitting =false;
    target='';
    loading =false;
    @observable.ref hubConnection:HubConnection |null=null;
    @observable activityCount =0;
    @observable page =0;
    @observable predicate = new Map();

    // constructor() {
    //     makeAutoObservable(this)
    // }

    @action setPredicate =(predicate :string, value:string |Date) =>
    {
        this.predicate.clear();
        if(predicate !== 'all')
        {
            this.predicate.set(predicate,value);
        }

    }

    @computed get axiosParams()
    {
        const parmas = new URLSearchParams();
        parmas.append('limit',String(Limit));
        parmas.append('offset', `${this.page ? this.page * Limit:0}`);
        this.predicate.forEach((value, key)=>{
            if(key ==='startDate')
            {
                parmas.append(key,value.ToISOString());
            }
            else 
            {
                parmas.append(key,value);
            }
        })
        return parmas;
    }

    @computed get totalPage(){
       
        return Math.ceil(this.activityCount / Limit);
    }

    @action setPage=(page:number)=>
    {
        this.page= page;
    }

    @action createHubConnection = (activityId:string) =>{
        this.hubConnection =new HubConnectionBuilder()
                            .withUrl('http://localhost:5000/chat', {
                                accessTokenFactory :()=>this.rootStore.commonStore.token!
                            })
                            .configureLogging(LogLevel.Information)
                            .build();

        this.hubConnection.start().then(()=>console.log(this.hubConnection!.state))
                                  .then(() => {console.log('Attempting to join group');
                                    this.hubConnection!.invoke('AddToGroup',activityId)   
                                })
                                .catch(error=>console.log('Error Establsing connection: ',error));

        this.hubConnection.on('ReceiveComments',comment =>{
            runInAction (()=>{
                this.selectedActivity!.comments.push(comment);
            })
            
        })

        this.hubConnection.on('Send',message => {
            toast.info(message);
        })
    }

    @action stopHubConnection = () =>{
        this.hubConnection?.invoke('RemoveFromGroup',this.selectedActivity!.id)
            .then(()=>{
                this.hubConnection!.stop();
            })
            .then(()=>{console.log('Connection stopped')})
            .catch(err=>console.log(err));
    }

    @action addComment = async(values:any) =>{
        values.activityId = this.selectedActivity!.id;
        try{
            await this.hubConnection!.invoke('SendComment',values);
        }
        catch(error)
        {
            console.log(error);
        }

    }

    @computed get activitiesByDate(){
        console.log(this.groupActivitiesByDate( Array.from( this.activityRegistry.values())));
        return this.groupActivitiesByDate( Array.from( this.activityRegistry.values()));
    }; 
    
    groupActivitiesByDate( activities:IActivity[])
    {
        const sortedActivities= activities.sort((a,b) => Date.parse(a.date) - Date.parse(b.date));
        return Object.entries(sortedActivities.reduce((activities,activity)=>{
            const date=activity.date.split('T')[0];
            activities[date] =activities[date]?[...activities[date],activity]:[activity];
            return activities;
        },{}as {[key:string]:IActivity[]}));

    }

    @action loadActivities = async() => {
        this.loadingInitial=true;
        const user = this.rootStore.userStore.user!;
        try
        {
            const activitiesEnvelope= await agent.Activities.list(this.axiosParams);
            const {activities,activityCount} = activitiesEnvelope;

            runInAction( ()=>{
                activities.forEach(actvity=>{
                    actvity.date=actvity.date.split('.')[0];
                    actvity.isGoing= actvity.attendees.some(
                        a =>a.username === user.username
                    )
                    actvity.isHost = actvity.attendees.some(
                        a =>a.username === user.username && a.isHost
                    )
                    this.activityRegistry.set(actvity.id,actvity);
                  });
                  this.activityCount = activityCount;
                  this.loadingInitial=false;
            });
        }
        catch(error)
        {
            console.log(error);
            runInAction(()=>{
                this.loadingInitial=false;
            })
        }
    };

    @action LoadActivity =async (id:string) =>
    {
        // Getting atcivity from the activity list 
        // Or get activity from Data base that does does exist in the dashboard or refresh the page (no activity in the regirsty)
        let activity= this.getActivity(id) as IActivity;
        const user = this.rootStore.userStore.user!;
        if(activity) {
            this.selectedActivity=activity;
        }
       else
       {
            this.loadingInitial=true;
            try
            {
                activity = await agent.Activities.details(id);
                runInAction(()=>{
                    
                    activity.isGoing= activity.attendees.some(
                        a => a.username === user.username
                    )
                    activity.isHost = activity.attendees.some(
                        a => a.username === user.username && a.isHost
                    )
                    this.selectedActivity=activity;
                    this.loadingInitial=false;
        
                });
            }
            catch (ex)
            {
                console.log(ex);
                runInAction(()=>{
                    this.loadingInitial=false;
                });
            }
       } 

    };

    @action clearActivity=()=>{

        this.selectedActivity=undefined;
    };

    getActivity =(id:string) =>{
        return this.activityRegistry.get(id);
    };

    @action createActivity =async (activity:IActivity)=>
    {
        this.submitting=true;
        try {
            await agent.Activities.create(activity);
            const user = this.rootStore.userStore.user!;
            const attende:IAttendee ={
            displayName:user.displayName,
            isHost:true,
            username :user.username, 
            image : user.imgae!
            };
            let attendees=[];
            attendees.push(attende);
            activity.attendees=attendees;
            runInAction(()=>{
                this.activityRegistry.set(activity.id,activity);
                this.submitting=false;
            });
        } catch (error) {
            console.log(error);
            toast.error('problem submitting data');
            runInAction(()=>{
                this.submitting=false;
            })
        }

    };
    @action editActivity = async(activity:IActivity)=>{

        this.submitting= true;
        try {
            await agent.Activities.update(activity);
            runInAction(()=>{

                this.activityRegistry.set(activity.id,activity);
                this.selectedActivity=activity;
                this.submitting=false;
            })

        } catch (error) {
            runInAction(()=>{
                this.submitting=false;
            })
            toast.error('problem submitting data');
            console.log(error);
        }

    };

    @action deleteActivity = async (event:SyntheticEvent<HTMLButtonElement>,id:string) =>{

        this.submitting=true;
        try {

            this.target=event.currentTarget.name;
            await agent.Activities.delete(id);
            runInAction(()=>{
                this.activityRegistry.delete(id);
                this.submitting=false;
            })
 
            
        } catch (error) {
            console.log(error);
            runInAction(()=>{
                this.submitting=false;
            })

        }
    };

    @action attendActivity = async () =>{
        const user = this.rootStore.userStore.user!;
        const attende:IAttendee ={
            displayName:user.displayName,
            isHost:false,
            username :user.username, 
            image : user.imgae!
        };
        this.loading=true;
        try
        {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(()=>{
                if(this.selectedActivity)
                {
                    this.selectedActivity.attendees.push(attende);
                    this.selectedActivity.isGoing=true;
                    this.activityRegistry.set(this.selectedActivity.id,this.selectedActivity);
                    this.loading=false;
                }     
            })
        } 
        catch(error)
        {
            runInAction(()=>{
                this.loading=false;
            })
            toast.error('Problem singing up to activity');
        } 
       
    }
    @action cancelAttendance =async () =>
    {
        try
        {
            await agent.Activities.unattend(this.selectedActivity!.id);
            runInAction(()=>{
                
         if(this.selectedActivity)
                {
                    this.selectedActivity.attendees = this.selectedActivity.attendees.filter (a=>a.username ! == this.rootStore.userStore.user!.username);
                    this.selectedActivity.isGoing=false;
                    this.activityRegistry.set(this.selectedActivity.id,this.selectedActivity);
                }
            })
        }
        catch(error)
        {
            runInAction(()=>{
                this.loading=false;
            })
            toast.error('Problem singing up to activity');
        }
        
    }

}