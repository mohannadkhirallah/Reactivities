import { action, computed, makeAutoObservable, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { IPhoto, IProfile } from "../models/Profile";
import { RootStore } from "./rootStore";

export default class ProfileStore 
{
    rootStore:RootStore;
    constructor(rootStore:RootStore)
    {
        this.rootStore=rootStore
        // makeObservable(this,{
        //     isCurrentUser:computed,
        //     profile:observable,
        //     loadingProfile:observable
        //  });
        makeAutoObservable(this);
    }

    @observable profile:IProfile|null=null;
    @observable loadingProfile =true;
    @observable uploadingPhoto=false;
    @observable loading =false;

   @computed get isCurrentUser ()
    {
        if(this.rootStore.userStore.user && this.profile)
        {
            return this.rootStore.userStore.user.username === this.profile.username
        }
        else
        {
            return false;
        }
    }


    @action loadProfile=async (username:string) => {
        this.loadingProfile=true;
        try
        {
            const profile = await agent.Profiles.get(username);
            runInAction(()=>{
                this.profile=profile;
                this.loadingProfile=false;
            })
        }
        catch(error)
        {
            runInAction(() =>{
                this.loadingProfile=false;
            })
            console.log(error);
        }

    }

    @action uploadPhoto =async (file:Blob) =>{
        this.uploadingPhoto =true;
        try{
            const photo= await agent.Profiles.uploadPhoto(file);
            runInAction(() =>{
                if(this.profile)
                {
                    this.profile.photos.push(photo);
                    if(photo.isMain && this.rootStore.userStore.user)
                    {
                        this.rootStore.userStore.user.imgae= photo.url;
                        this.profile.image = photo.url;
                    }
                }
                this.uploadingPhoto=false;
            })
        }
        catch(error)
        {
            console.log(error);
            toast.error('problem uploading photo');
            runInAction(()=>{
                this.uploadingPhoto=false;
            })
        }
    }
    @action setMainPhoto = async(photo:IPhoto) =>{
        this.loading =true;
        try{
            await agent.Profiles.setMainPhoto(photo.id);
            runInAction (()=>{
                this.rootStore.userStore.user!.imgae=photo.url;
                this.profile!.photos.find(p=>p.isMain)!.isMain=false;
                this.profile!.photos.find(p=>p.id ===photo.id)!.isMain=true;
                this.profile!.image =photo.url;
                this.loading=false;
            })

        } catch(error)
        {
            console.log(error);
            toast.error('problem in setting photo as main');
            runInAction(()=>{
                this.loading=false;
            })
        }
    }

    @action deletePhoto = async(photo:IPhoto) =>{
        this.loading=true;
        try
        {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction(()=>{
                this.loading=false;
                this.profile!.photos= this.profile!.photos.filter(p=>p.id !== photo.id);

            })
        }
        catch(error)
        {
            console.log(error);
            toast.error('problem in deleting the photo');
            runInAction(()=>{
                this.loading=false;
            })
        }
    }
}