import axios, { AxiosResponse } from 'axios';
import { fil } from 'date-fns/locale';
import { promises } from 'dns';
import { toast } from 'react-toastify';
import { URLSearchParams } from 'url';
import { history } from '../..';
import {IActivitiesEnvelope, IActivity} from '../models/activity';
import { IPhoto, IProfile } from '../models/Profile';
import { IUser, IUserFormValues } from '../models/user';

//Setting base  URI
axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use((config)=>{

    const token = window.localStorage.getItem('jwt');
    if(token)
        config.headers.Authorization =`Bearer ${token}` 
    return config;
}, error=> {
    return Promise.reject(error);
})

//handle error 
axios.interceptors.response.use(undefined, (error)=>{
    if(error.message ==='Network Error' && !error.response){
        toast.error('Make sure the API is running', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
    }

    const {status,data,config} = error.response;
    if(status === 404)
    {
        history.push('/notfound');
    }
    if(status === 400)
    {
        history.push('/notfound');
    }
    if(status === 401)
    {
        console.error(Response);
        toast.info('Your token has expried, please login again...');
        window.localStorage.removeItem('jwt');
        history.push('/'); 
    }
    // console.log(error.response);

    if(status === 500)
    {
        toast.error('Server error- Check terminal', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
    }
    throw error.response;
});

const responseBody=(response: AxiosResponse) =>response.data;
const sleep= (ms:number) =>(response:AxiosResponse) => new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response),ms));

const requests = {

    get: (url:string) => axios.get(url).then(sleep(1000)).then(responseBody),
    post: (url:string,body:{}) => axios.post(url,body).then(sleep(1000)).then(responseBody),
    put : (url:string,body:{}) => axios.put(url,body).then(sleep(1000)).then(responseBody),
    del: (url:string) => axios.delete(url).then(sleep(1000)).then(responseBody),
    postForm: (url:string, file:Blob) =>{
        let formData= new FormData();
        formData.append('File',file)
        return axios.post(url,formData,{
            headers:{'Content-type':'multipart/form-data'}
        }).then(responseBody)
    }

}

const Activities ={

    // list:(params:URLSearchParams):Promise<IActivitiesEnvelope> => axios.get('/activities',{params:params}).then(sleep(1000)).then(responseBody),
    list:(limit?:number, page?:number):Promise<IActivitiesEnvelope> =>requests.get(`/activities?limit=${limit}&offset=${page?page * limit!:0}`) ,
    details: (id:string) => requests.get(`/activities/${id}`),
    create: (activity:IActivity) => requests.post('/activities',activity),
    update: (activit:IActivity)  => requests.put(`/activities/${activit.id}`,activit),
    delete: (id:string) => requests.del(`/activities/${id}`),
    attend:(id:string) => requests.post(`/activities/${id}/attend`,{}),
    unattend:(id:string)=> requests.del(`/activities/${id}/attend`)

}


const User ={
    current:():Promise<IUser>=> requests.get('/user'),
    login:(user:IUserFormValues):Promise<IUser> =>requests.post('/user/login',user),
    register:(user:IUserFormValues):Promise<IUser> =>requests.post('/user/register',user)
}

const Profiles ={
    get:(username:string):Promise<IProfile> =>requests.get(`/profiles/${username}`),
    uploadPhoto:(photo:Blob):Promise<IPhoto> => requests.postForm(`/photos`,photo),
    setMainPhoto : (id:string)=> requests.post(`/photos/${id}/setMain`,{}),
    deletePhoto : (id:string) => requests.del(`/photos/${id}`),
    follow:(username:string) => requests.post(`/profiles/${username}/follow`,{}),
    unfollow:(username:string) => requests.del(`/profiles/${username}/follow`),
    listFollowings: (username:string, predicate:string) => requests.get(`/profiles/${username}/follow?predicate=${predicate}`)
}



export default {
    Activities,
    User,
    Profiles
}
