import { action, makeAutoObservable, observable } from "mobx";
import { RootStore } from "./rootStore";

export class ModalStore 
{
    rootStore: RootStore;

    constructor(rootStore :RootStore)
    {
        this.rootStore= rootStore;
        makeAutoObservable(this);
    }

    @observable.shallow modal ={
        open:false,
        body:null
    }
    @action opneModal = (content:any)=>{
        this.modal.open=true;
        this.modal.body=content;
    }
    @action closeModal = () =>{
        this.modal.open=false;
        this.modal.body=null;
    }
}